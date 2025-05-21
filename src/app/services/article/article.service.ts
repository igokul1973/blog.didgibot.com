import { GET_ARTICLES } from '@/app/operations';
import { transformRawArticle, transformRawArticles } from '@/utils/transformers';
import { Injectable, signal } from '@angular/core';
import { OperationVariables } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IArticlePartial, IRawArticle } from 'types/article';

@Injectable({
    providedIn: 'root'
})
export class ArticleService {
    private readonly searchQuerySubject = new BehaviorSubject<string>('');
    public searchQuery$ = this.searchQuerySubject.asObservable();

    public isArticleFilterSet = signal<boolean>(false);
    // private filteredArticles = signal<IArticlePartial[]>([]);

    constructor(private readonly apollo: Apollo) {}

    getArticles(variables: OperationVariables): Observable<IArticlePartial[]> {
        return this.apollo
            .watchQuery<{ articles: IRawArticle[] }>({
                query: GET_ARTICLES,
                variables
            })
            .valueChanges.pipe(
                map(({ data }) => {
                    if (!data) {
                        return [];
                    }
                    return transformRawArticles(data.articles);
                })
            );
    }

    getArticleById(id: string): Observable<IArticlePartial | null> {
        return this.apollo
            .watchQuery<{ articles: IRawArticle[] }>({
                query: GET_ARTICLES,
                variables: {
                    entityName: 'article',
                    filterInput: { ids: [id] }
                }
            })
            .valueChanges.pipe(
                map(({ data }) => {
                    if (!data) {
                        return null;
                    }
                    return transformRawArticle(data.articles[0]);
                })
            );
    }

    // getFilteredArticles(): WritableSignal<IArticlePartial[]> {
    //     return this.filteredArticles;
    // }

    // setFilteredArticles(articles: IArticlePartial[]) {
    //     this.filteredArticles.set(articles);
    // }

    setSearchQuery(query: string) {
        this.searchQuerySubject.next(query);
    }
}
