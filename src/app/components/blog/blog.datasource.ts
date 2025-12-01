import { ArticleService } from '@/app/services/article/article.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { CombinedGraphQLErrors, ServerError, ServerParseError } from '@apollo/client';
import { GraphQLError } from 'graphql';
import { BehaviorSubject, combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { IArticlePartial, IArticleQueryInput } from 'types/article';
import { DataSourceErrorsEnum, IDataSourceError } from './types';

export default class BlogDataSource extends DataSource<IArticlePartial> {
    private readonly cachedDataLength = 20;
    private readonly limit = this.query.limit ?? 10;
    private readonly cachedData = new Map<string, IArticlePartial[]>([
        [JSON.stringify(this.query), Array.from<IArticlePartial>({ length: this.cachedDataLength })]
    ]);
    private readonly dataStreamSubject = new BehaviorSubject<IArticlePartial[]>(
        this.cachedData.get(JSON.stringify(this.query)) ?? []
    );
    private readonly dataStream$ = this.dataStreamSubject.asObservable();
    private readonly querySubject = new BehaviorSubject<IArticleQueryInput>(this.query);
    // Error handling subjects
    private readonly errorsSubject = new Subject<IDataSourceError>();
    public readonly errors$ = this.errorsSubject.asObservable();
    // Loading state
    private readonly loadingSubject = new BehaviorSubject<boolean>(false);
    public readonly loading$ = this.loadingSubject.asObservable();
    // Track failed pages to prevent retry loops
    private readonly failedPages = new Set<string>();

    public articlesTotal = 0;

    private readonly subscriptions: Subscription[] = [];

    constructor(
        private readonly articleService: ArticleService,
        private readonly query: IArticleQueryInput
    ) {
        super();
    }

    override connect(collectionViewer: CollectionViewer): Observable<readonly IArticlePartial[]> {
        this.subscriptions.push(
            combineLatest([this.querySubject, collectionViewer.viewChange]).subscribe({
                next: ([query, view]) => {
                    const startPage = this.getPageForIndex(view.start);
                    const endPage = this.getPageForIndex(view.end);
                    for (let i = startPage; i <= endPage; i++) {
                        this.fetchPage(i, query);
                    }
                }
            })
        );
        return this.dataStream$;
    }

    private fetchPage(page: number, query: IArticleQueryInput) {
        const pageKey = `${JSON.stringify(query)}_page_${page}`;
        // Skip if the page already failed
        if (this.failedPages.has(pageKey)) {
            return;
        }
        // Check if page is already loaded
        const existingData = this.cachedData.get(JSON.stringify(query));
        const pageStart = page * this.limit;
        const pageEnd = pageStart + this.limit;

        if (existingData && existingData.slice(pageStart, pageEnd).every((item) => item !== undefined)) {
            // Page is already loaded, skip the fetch request
            return;
        }

        this.setLoading(true);

        this.articleService.getArticles({ ...query, skip: page * this.limit }).subscribe({
            next: (response) => {
                // Get or initialize the data array for this query
                const data =
                    this.cachedData.get(pageKey) ?? Array.from<IArticlePartial>({ length: this.cachedDataLength });

                // Calculate the insertion point and update the data array
                const insertAt = page * this.limit;
                data.splice(insertAt, this.limit, ...response);

                // Update cache and notify subscribers
                this.cachedData.set(pageKey, data);
                this.dataStreamSubject.next(data);
                this.articlesTotal = data.length;
                this.setLoading(false);
                // Mark page as not failed in case of retries
                this.failedPages.delete(pageKey);
            },
            error: (error: GraphQLError) => {
                this.setLoading(false);

                // Mark page as failed to prevent retry loops
                this.failedPages.add(pageKey);
                // Determine error type
                const errorType = this.determineErrorType(error);
                const errorMessage = this.getErrorMessage(error, errorType);

                // Emit error through error stream
                const dataSourceError: IDataSourceError = {
                    message: errorMessage,
                    type: errorType,
                    page,
                    originalError: error
                };
                this.setError(dataSourceError);

                // For permission errors, you might want to clear the cache
                // and stop trying to fetch more data
                if (errorType === DataSourceErrorsEnum.PERMISSION_DENIED) {
                    this.handlePermissionError(pageKey);
                }

                // Update the cached data with empty/error state for this page
                this.updateCacheWithError(page, pageKey);
            }
        });
    }

    private hasErrorCodeExtension(extensions: unknown): extensions is { error_code: number | string } {
        return typeof extensions === 'object' && extensions !== null && 'error_code' in extensions;
    }

    private determineErrorType(error: unknown): DataSourceErrorsEnum {
        // 1) GraphQL errors (HTTP 200 with `errors` array)
        if (CombinedGraphQLErrors.is(error)) {
            for (const graphQLError of error.errors as GraphQLError[]) {
                if (this.hasErrorCodeExtension(graphQLError.extensions)) {
                    const errorCode = Number(graphQLError.extensions.error_code);
                    switch (errorCode) {
                        case 401:
                            return DataSourceErrorsEnum.PERMISSION_DENIED;
                        case 404:
                            return DataSourceErrorsEnum.NOT_FOUND;
                        case 500:
                            return DataSourceErrorsEnum.SERVER_ERROR;
                        default:
                            // keep checking other GraphQL errors
                            break;
                    }
                }
            }
            // GraphQL errors present but no recognized error_code
            return DataSourceErrorsEnum.UNKNOWN;
        }

        // 2) Network / HTTP layer errors (non‑200, parse failures, etc.)
        if (ServerError.is(error) || ServerParseError.is(error)) {
            const statusCode = (error as ServerError | ServerParseError).statusCode;
            switch (statusCode) {
                case 401:
                    return DataSourceErrorsEnum.PERMISSION_DENIED;
                case 404:
                    return DataSourceErrorsEnum.NOT_FOUND;
                case 500:
                    return DataSourceErrorsEnum.SERVER_ERROR;
                default:
                    return DataSourceErrorsEnum.NETWORK_ERROR;
            }
        }

        // 3) Fallback
        return DataSourceErrorsEnum.UNKNOWN;
    }

    private getErrorMessage(error: unknown, errorType: DataSourceErrorsEnum): string {
        switch (errorType) {
            case DataSourceErrorsEnum.PERMISSION_DENIED:
                return 'You do not have permission to access these articles';
            case DataSourceErrorsEnum.NETWORK_ERROR:
                return 'Network error. Please check your connection';
            case DataSourceErrorsEnum.NOT_FOUND:
                return 'The requested articles could not be found';
            default: {
                if (typeof error === 'object' && error !== null) {
                    const maybeError = error as { message?: string; error?: { message?: string } };
                    return (
                        maybeError.message || maybeError.error?.message || 'An error occurred while fetching articles'
                    );
                }
                return 'An error occurred while fetching articles';
            }
        }
    }

    private handlePermissionError(pageKey: string) {
        // Clear all cached data for this query since we do not have permission
        this.cachedData.delete(pageKey);
        // Optionally emit and empty array to clear the view
        this.dataStreamSubject.next([]);
        this.articlesTotal = 0;
    }

    private updateCacheWithError(page: number, pageKey: string) {
        // You can either leave the page empty or mark items as error placeholders
        let existingData = this.cachedData.get(JSON.stringify(pageKey));
        if (!existingData) {
            existingData = Array.from<IArticlePartial>({ length: this.cachedDataLength });
            this.cachedData.set(JSON.stringify(pageKey), existingData);
        }

        // Mark this page's items as null/undefined to indicate error
        const errorItems = Array.from<IArticlePartial>({ length: this.limit });
        existingData.splice(page * this.limit, this.limit, ...errorItems);
        this.cachedData.set(JSON.stringify(pageKey), existingData);
        this.dataStreamSubject.next(existingData);
    }

    // Public method to retry failed pages
    public retryFailedPages() {
        const currentQuery = this.querySubject.value;
        const failedPagesArray = Array.from(this.failedPages);

        // Clear failed pages
        this.failedPages.clear();

        // Retry each failed page
        failedPagesArray.forEach((pageKey) => {
            const match = pageKey.match(/_page_(\d+)$/);
            if (match) {
                const pageNumber = parseInt(match[1], 10);
                this.fetchPage(pageNumber, currentQuery);
            }
        });
    }

    override disconnect(): void {
        for (const s of this.subscriptions) {
            s.unsubscribe();
        }
    }

    private getPageForIndex(index: number) {
        return Math.floor(index / this.limit);
    }

    public setQuery(query: IArticleQueryInput) {
        this.querySubject.next(query);
    }

    private setLoading(loading: boolean) {
        this.loadingSubject.next(loading);
    }

    private setError(dataSourceError: IDataSourceError) {
        this.errorsSubject.next(dataSourceError);
    }

    // Public method to clear errors
    public clearErrors() {
        this.failedPages.clear();
    }
}
