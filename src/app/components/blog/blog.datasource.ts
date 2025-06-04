import { ArticleService } from '@/app/services/article/article.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { IArticlePartial, IArticleQueryInput } from 'types/article';

export default class BlogDataSource extends DataSource<IArticlePartial> {
    private readonly cachedDataLength = 20;
    private readonly limit = this.query.limit ?? 10;
    private readonly cachedData = new Map<string, IArticlePartial[]>([
        [JSON.stringify(this.query), Array.from<IArticlePartial>({ length: this.cachedDataLength })]
    ]);
    private readonly dataStreamSubject = new BehaviorSubject<IArticlePartial[]>(
        this.cachedData.get(JSON.stringify(this.query)) ?? []
    );
    private readonly subscriptions: Subscription[] = [];
    private readonly querySubject = new BehaviorSubject<IArticleQueryInput>(this.query);
    public articlesTotal = 0;

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
        return this.dataStreamSubject.asObservable();
    }
    private fetchPage(page: number, query: IArticleQueryInput) {
        this.subscriptions.push(
            this.articleService.getArticles({ ...query, skip: page * this.limit }).subscribe({
                next: (response) => {
                    let existingData = this.cachedData.get(JSON.stringify(query));
                    if (!existingData) {
                        existingData = Array.from<IArticlePartial>({ length: this.cachedDataLength });
                        this.cachedData.set(JSON.stringify(query), existingData);
                    }
                    existingData.splice(page * this.limit, this.limit, ...response);
                    this.cachedData.set(JSON.stringify(query), existingData);
                    this.dataStreamSubject.next(existingData);
                    this.articlesTotal = existingData.length;
                }
            })
        );
    }

    override disconnect(): void {
        this.subscriptions.forEach((s) => s.unsubscribe());
    }

    private getPageForIndex(index: number) {
        return Math.floor(index / this.limit);
    }

    public setQuery(query: IArticleQueryInput) {
        this.querySubject.next(query);
    }
}
