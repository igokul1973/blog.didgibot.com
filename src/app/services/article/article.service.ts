import { GET_ARTICLES } from '@/app/operations';
import { transformRawArticle, transformRawArticles } from '@/utils/transformers';
import { Injectable } from '@angular/core';
import { OperationVariables } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { IArticlePartial, IRawArticle } from 'types/article';

@Injectable({
    providedIn: 'root'
})
export class ArticleService {
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
}
