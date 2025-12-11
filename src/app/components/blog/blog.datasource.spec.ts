import { CollectionViewer } from '@angular/cdk/collections';
import { CombinedGraphQLErrors, ServerError, ServerParseError } from '@apollo/client';
import { GraphQLError } from 'graphql';
import { Observable, of, Subject } from 'rxjs';
import { vi } from 'vitest';

import { ArticleService } from '@/app/services/article/article.service';
import { IArticlePartial, IArticleQueryInput } from 'types/article';
import BlogDataSource from './blog.datasource';
import { DataSourceErrorsEnum, IDataSourceError } from './types';

describe('BlogDataSource', () => {
    const createDataSource = (
        getArticlesImpl: (variables: IArticleQueryInput) => Observable<IArticlePartial[]> = () => of([])
    ): BlogDataSource => {
        const articleServiceMock: Partial<ArticleService> = {
            getArticles: getArticlesImpl
        };
        const baseQuery: IArticleQueryInput = {
            entityName: 'article',
            filterInput: {},
            sortInput: { field: 'updated_at', dir: 'desc' },
            limit: 10,
            skip: 0
        };

        return new BlogDataSource(articleServiceMock as ArticleService, baseQuery);
    };

    it('connect calls fetchPage for pages covering the view range', () => {
        const ds = createDataSource();
        const dsWithPrivate = ds as unknown as { fetchPage: (page: number, query: IArticleQueryInput) => void };
        const fetchSpy = vi.spyOn(dsWithPrivate, 'fetchPage');

        const viewChangeSubject = new Subject<{ start: number; end: number }>();
        const collectionViewer = {
            viewChange: viewChangeSubject.asObservable()
        } as unknown as CollectionViewer;

        const sub = ds.connect(collectionViewer).subscribe();

        viewChangeSubject.next({ start: 0, end: 39 });

        expect(fetchSpy).toHaveBeenCalledWith(0, expect.any(Object));
        expect(fetchSpy).toHaveBeenCalledWith(1, expect.any(Object));

        sub.unsubscribe();
        ds.disconnect();
    });

    it('fetchPage loads articles and updates cache and loading state', () => {
        const getArticlesImpl = (): Observable<IArticlePartial[]> => of([{} as IArticlePartial, {} as IArticlePartial]);
        const ds = createDataSource(getArticlesImpl);

        const dsWithPrivate = ds as unknown as {
            fetchPage: (page: number, query: IArticleQueryInput) => void;
            dataStreamSubject: { getValue: () => IArticlePartial[] };
            loadingSubject: { getValue: () => boolean };
        };

        const baseQuery: IArticleQueryInput = {
            entityName: 'article',
            filterInput: {},
            sortInput: { field: 'updated_at', dir: 'desc' },
            limit: 10,
            skip: 0
        };

        dsWithPrivate.fetchPage(0, baseQuery);

        const data = dsWithPrivate.dataStreamSubject.getValue();
        expect(data.length).toBeGreaterThan(0);
        expect(ds.articlesTotal).toBe(data.length);
        expect(dsWithPrivate.loadingSubject.getValue()).toBe(false);
    });

    it('fetchPage returns early when page is already marked as failed', () => {
        const getArticlesImpl = vi.fn(() => of([{} as IArticlePartial]));
        const ds = createDataSource(getArticlesImpl);

        const dsWithPrivate = ds as unknown as {
            fetchPage: (page: number, query: IArticleQueryInput) => void;
            failedPages: Set<string>;
        };

        const baseQuery: IArticleQueryInput = {
            entityName: 'article',
            filterInput: {},
            sortInput: { field: 'updated_at', dir: 'desc' },
            limit: 10,
            skip: 0
        };
        const page = 0;
        const pageKey = `${JSON.stringify(baseQuery)}_page_${page}`;
        dsWithPrivate.failedPages.add(pageKey);

        dsWithPrivate.fetchPage(page, baseQuery);

        expect(getArticlesImpl).not.toHaveBeenCalled();
    });

    it('determineErrorType maps GraphQL error codes correctly', () => {
        const ds = createDataSource();
        const dsWithPrivate = ds as unknown as {
            determineErrorType: (error: unknown) => DataSourceErrorsEnum;
        };

        const graphQLError401 = { extensions: { error_code: 401 } } as unknown as GraphQLError;
        const graphQLError404 = { extensions: { error_code: 404 } } as unknown as GraphQLError;
        const graphQLError500 = { extensions: { error_code: 500 } } as unknown as GraphQLError;
        const graphQLErrorUnknown = { extensions: { error_code: 999 } } as unknown as GraphQLError;

        const errorObject = { errors: [graphQLError401] } as unknown;
        const errorObject404 = { errors: [graphQLError404] } as unknown;
        const errorObject500 = { errors: [graphQLError500] } as unknown;
        const errorObjectUnknown = { errors: [graphQLErrorUnknown] } as unknown;

        const graphSpy = vi.spyOn(CombinedGraphQLErrors, 'is').mockReturnValue(true);
        vi.spyOn(ServerError, 'is').mockReturnValue(false);
        vi.spyOn(ServerParseError, 'is').mockReturnValue(false);

        expect(dsWithPrivate.determineErrorType(errorObject)).toBe(DataSourceErrorsEnum.PERMISSION_DENIED);
        expect(dsWithPrivate.determineErrorType(errorObject404)).toBe(DataSourceErrorsEnum.NOT_FOUND);
        expect(dsWithPrivate.determineErrorType(errorObject500)).toBe(DataSourceErrorsEnum.SERVER_ERROR);
        expect(dsWithPrivate.determineErrorType(errorObjectUnknown)).toBe(DataSourceErrorsEnum.UNKNOWN);

        graphSpy.mockRestore();
    });

    it('determineErrorType maps server status codes correctly', () => {
        const ds = createDataSource();
        const dsWithPrivate = ds as unknown as {
            determineErrorType: (error: unknown) => DataSourceErrorsEnum;
        };

        const serverSpy = vi.spyOn(ServerError, 'is').mockReturnValue(true);
        vi.spyOn(CombinedGraphQLErrors, 'is').mockReturnValue(false);
        vi.spyOn(ServerParseError, 'is').mockReturnValue(false);

        const error401 = { statusCode: 401 } as unknown;
        const error404 = { statusCode: 404 } as unknown;
        const error500 = { statusCode: 500 } as unknown;
        const errorOther = { statusCode: 418 } as unknown;

        expect(dsWithPrivate.determineErrorType(error401)).toBe(DataSourceErrorsEnum.PERMISSION_DENIED);
        expect(dsWithPrivate.determineErrorType(error404)).toBe(DataSourceErrorsEnum.NOT_FOUND);
        expect(dsWithPrivate.determineErrorType(error500)).toBe(DataSourceErrorsEnum.SERVER_ERROR);
        expect(dsWithPrivate.determineErrorType(errorOther)).toBe(DataSourceErrorsEnum.NETWORK_ERROR);

        serverSpy.mockRestore();
    });

    it('determineErrorType falls back to UNKNOWN for non-matching errors', () => {
        const ds = createDataSource();
        const dsWithPrivate = ds as unknown as {
            determineErrorType: (error: unknown) => DataSourceErrorsEnum;
        };

        vi.spyOn(CombinedGraphQLErrors, 'is').mockReturnValue(false);
        vi.spyOn(ServerError, 'is').mockReturnValue(false);
        vi.spyOn(ServerParseError, 'is').mockReturnValue(false);

        const result = dsWithPrivate.determineErrorType({});
        expect(result).toBe(DataSourceErrorsEnum.UNKNOWN);
    });

    it('determineErrorType returns UNKNOWN when GraphQL errors lack error_code', () => {
        const ds = createDataSource();
        const dsWithPrivate = ds as unknown as {
            determineErrorType: (error: unknown) => DataSourceErrorsEnum;
        };

        const graphQLErrorNoExt = { extensions: {} } as unknown as GraphQLError;
        const errorObject = { errors: [graphQLErrorNoExt] } as unknown;

        vi.spyOn(CombinedGraphQLErrors, 'is').mockReturnValue(true);
        vi.spyOn(ServerError, 'is').mockReturnValue(false);
        vi.spyOn(ServerParseError, 'is').mockReturnValue(false);

        const result = dsWithPrivate.determineErrorType(errorObject);
        expect(result).toBe(DataSourceErrorsEnum.UNKNOWN);
    });

    it('getErrorMessage returns messages based on error type or error object', () => {
        const ds = createDataSource();
        const dsWithPrivate = ds as unknown as {
            getErrorMessage: (error: unknown, errorType: DataSourceErrorsEnum) => string;
        };

        expect(dsWithPrivate.getErrorMessage({}, DataSourceErrorsEnum.PERMISSION_DENIED)).toContain('permission');
        expect(dsWithPrivate.getErrorMessage({}, DataSourceErrorsEnum.NETWORK_ERROR)).toContain('Network error');
        expect(dsWithPrivate.getErrorMessage({}, DataSourceErrorsEnum.NOT_FOUND)).toContain('could not be found');

        const errorWithMessage = { message: 'Top level message' };
        expect(dsWithPrivate.getErrorMessage(errorWithMessage, DataSourceErrorsEnum.UNKNOWN)).toBe('Top level message');

        const nestedError = { error: { message: 'Nested message' } };
        expect(dsWithPrivate.getErrorMessage(nestedError, DataSourceErrorsEnum.UNKNOWN)).toBe('Nested message');

        const fallback = 'simple string error';
        expect(dsWithPrivate.getErrorMessage(fallback, DataSourceErrorsEnum.UNKNOWN)).toBe(
            'An error occurred while fetching articles'
        );

        const emptyObject = {};
        expect(dsWithPrivate.getErrorMessage(emptyObject, DataSourceErrorsEnum.UNKNOWN)).toBe(
            'An error occurred while fetching articles'
        );
    });

    it('handlePermissionError clears cached data and resets total and stream', () => {
        const ds = createDataSource();
        const dsWithPrivate = ds as unknown as {
            handlePermissionError: (pageKey: string) => void;
            cachedData: Map<string, IArticlePartial[]>;
            dataStreamSubject: { getValue: () => IArticlePartial[] };
        };

        const pageKey = 'permission-page-key';
        dsWithPrivate.cachedData.set(pageKey, [{} as IArticlePartial]);

        dsWithPrivate.handlePermissionError(pageKey);

        expect(dsWithPrivate.cachedData.has(pageKey)).toBe(false);
        expect(ds.articlesTotal).toBe(0);
        expect(dsWithPrivate.dataStreamSubject.getValue()).toEqual([]);
    });

    it('updateCacheWithError populates cache with error placeholders', () => {
        const ds = createDataSource();
        const dsWithPrivate = ds as unknown as {
            updateCacheWithError: (page: number, pageKey: string) => void;
            cachedData: Map<string, IArticlePartial[]>;
            dataStreamSubject: { getValue: () => IArticlePartial[] };
        };

        const pageKey = 'error-page-key';

        dsWithPrivate.updateCacheWithError(1, pageKey);

        const stored = dsWithPrivate.cachedData.get(JSON.stringify(pageKey));
        expect(stored).toBeDefined();
        expect(stored?.length).toBeGreaterThan(0);
        expect(dsWithPrivate.dataStreamSubject.getValue().length).toBe(stored?.length ?? 0);
    });

    it('fetchPage handles errors, marks failed page, emits IDataSourceError, and handles permission errors', () => {
        const error = new Error('boom');
        const getArticlesImpl = (): Observable<IArticlePartial[]> =>
            new Observable<IArticlePartial[]>((subscriber) => {
                subscriber.error(error);
            });

        const ds = createDataSource(getArticlesImpl);
        const dsWithPrivate = ds as unknown as {
            fetchPage: (page: number, query: IArticleQueryInput) => void;
            errors$: Observable<IDataSourceError>;
            failedPages: Set<string>;
            determineErrorType: (e: unknown) => DataSourceErrorsEnum;
            handlePermissionError: (pageKey: string) => void;
        };

        const baseQuery: IArticleQueryInput = {
            entityName: 'article',
            filterInput: {},
            sortInput: { field: 'updated_at', dir: 'desc' },
            limit: 10,
            skip: 0
        };

        const emitted: IDataSourceError[] = [];
        const sub = dsWithPrivate.errors$.subscribe((e) => emitted.push(e));

        const determineSpy = vi
            .spyOn(dsWithPrivate, 'determineErrorType')
            .mockReturnValue(DataSourceErrorsEnum.PERMISSION_DENIED);
        const permissionSpy = vi.spyOn(dsWithPrivate, 'handlePermissionError');

        dsWithPrivate.fetchPage(0, baseQuery);

        expect(emitted.length).toBe(1);
        expect(emitted[0].type).toBe(DataSourceErrorsEnum.PERMISSION_DENIED);
        expect(dsWithPrivate.failedPages.size).toBeGreaterThan(0);
        expect(permissionSpy).toHaveBeenCalled();

        sub.unsubscribe();
        determineSpy.mockRestore();
        permissionSpy.mockRestore();
    });

    it('fetchPage handles non-permission errors without calling handlePermissionError', () => {
        const error = new Error('other error');
        const getArticlesImpl = (): Observable<IArticlePartial[]> =>
            new Observable<IArticlePartial[]>((subscriber) => {
                subscriber.error(error);
            });

        const ds = createDataSource(getArticlesImpl);
        const dsWithPrivate = ds as unknown as {
            fetchPage: (page: number, query: IArticleQueryInput) => void;
            errors$: Observable<IDataSourceError>;
            failedPages: Set<string>;
            determineErrorType: (e: unknown) => DataSourceErrorsEnum;
            handlePermissionError: (pageKey: string) => void;
        };

        const baseQuery: IArticleQueryInput = {
            entityName: 'article',
            filterInput: {},
            sortInput: { field: 'updated_at', dir: 'desc' },
            limit: 10,
            skip: 0
        };

        const emitted: IDataSourceError[] = [];
        const sub = dsWithPrivate.errors$.subscribe((e) => emitted.push(e));

        const determineSpy = vi
            .spyOn(dsWithPrivate, 'determineErrorType')
            .mockReturnValue(DataSourceErrorsEnum.SERVER_ERROR);
        const permissionSpy = vi.spyOn(dsWithPrivate, 'handlePermissionError');

        dsWithPrivate.fetchPage(0, baseQuery);

        expect(emitted.length).toBe(1);
        expect(emitted[0].type).toBe(DataSourceErrorsEnum.SERVER_ERROR);
        expect(dsWithPrivate.failedPages.size).toBeGreaterThan(0);
        expect(permissionSpy).not.toHaveBeenCalled();

        sub.unsubscribe();
        determineSpy.mockRestore();
        permissionSpy.mockRestore();
    });

    it('retryFailedPages re-invokes fetchPage for failed pages and clears the set', () => {
        const ds = createDataSource();
        const dsWithPrivate = ds as unknown as {
            retryFailedPages: () => void;
            failedPages: Set<string>;
            fetchPage: (page: number, query: IArticleQueryInput) => void;
            querySubject: { value: IArticleQueryInput };
        };

        const pageKey = `${JSON.stringify(dsWithPrivate.querySubject.value)}_page_2`;
        dsWithPrivate.failedPages.add(pageKey);

        const fetchSpy = vi.spyOn(dsWithPrivate, 'fetchPage').mockImplementation(() => {
            return;
        });

        dsWithPrivate.retryFailedPages();

        expect(fetchSpy).toHaveBeenCalledWith(2, dsWithPrivate.querySubject.value);
        expect(dsWithPrivate.failedPages.size).toBe(0);
    });

    it('retryFailedPages ignores keys without page suffix', () => {
        const ds = createDataSource();
        const dsWithPrivate = ds as unknown as {
            retryFailedPages: () => void;
            failedPages: Set<string>;
            fetchPage: (page: number, query: IArticleQueryInput) => void;
            querySubject: { value: IArticleQueryInput };
        };

        dsWithPrivate.failedPages.add('invalid-key');

        const fetchSpy = vi.spyOn(dsWithPrivate, 'fetchPage').mockImplementation(() => {
            return;
        });

        dsWithPrivate.retryFailedPages();

        expect(fetchSpy).not.toHaveBeenCalled();
        expect(dsWithPrivate.failedPages.size).toBe(0);
    });

    it('setQuery updates the internal querySubject value', () => {
        const ds = createDataSource();
        const dsWithPrivate = ds as unknown as {
            setQuery: (q: IArticleQueryInput) => void;
            querySubject: { value: IArticleQueryInput };
        };

        const newQuery: IArticleQueryInput = {
            entityName: 'article',
            filterInput: { search: 'test' },
            sortInput: { field: 'updated_at', dir: 'asc' },
            limit: 5,
            skip: 10
        };

        dsWithPrivate.setQuery(newQuery);

        expect(dsWithPrivate.querySubject.value).toEqual(newQuery);
    });

    it('clearErrors clears the failedPages set', () => {
        const ds = createDataSource();
        const dsWithPrivate = ds as unknown as {
            clearErrors: () => void;
            failedPages: Set<string>;
        };

        dsWithPrivate.failedPages.add('foo_page_1');
        dsWithPrivate.clearErrors();

        expect(dsWithPrivate.failedPages.size).toBe(0);
    });
});
