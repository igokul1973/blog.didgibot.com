import { transformRawArticles } from '@/utils/transformers';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { IArticlePartial, IRawArticle } from 'types/article';
import { GET_ARTICLES } from './article.graphql';

@Injectable({
    providedIn: 'root'
})
export class ArticleService {
    constructor(private readonly apollo: Apollo) {}

    getArticles(): Observable<IArticlePartial[]> {
        return this.apollo
            .watchQuery<{ articles: IRawArticle[] }>({
                query: GET_ARTICLES
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
}
