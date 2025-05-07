import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { GET_ARTICLES } from './article.graphql';

@Injectable({
    providedIn: 'root'
})
export class ArticleService {
    constructor(private readonly apollo: Apollo) {}

    getArticles(): Observable<unknown> {
        return this.apollo
            .watchQuery({
                query: GET_ARTICLES
            })
            .valueChanges.pipe(
                map((result) => {
                    if (typeof result.data === 'object' && result.data !== null && 'articles' in result.data) {
                        return result.data.articles;
                    }
                    return [];
                })
            );
    }
}
