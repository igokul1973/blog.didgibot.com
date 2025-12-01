import { GET_ARTICLES } from '@/app/operations';
import { transformRawArticle } from '@/utils/transformers';
import { inject, Injectable, signal } from '@angular/core';
import { OperationVariables } from '@apollo/client/core';
import { DeepPartial } from '@apollo/client/utilities';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, filter, first, map, Observable, pipe, switchMap, toArray } from 'rxjs';
import { IArticlePartial, IRawArticle } from 'types/article';
import { LanguageEnum } from 'types/translation';

type ArticlesResult =
    | {
          articles: IRawArticle[];
      }
    | DeepPartial<{
          articles: IRawArticle[];
      }>
    | undefined;

const mapToArticlePartials = () =>
    pipe(
        switchMap(({ data }: { data?: ArticlesResult }) => {
            return data?.articles ?? [];
        }),
        filter(Boolean),
        map((article) => transformRawArticle(article))
    );

@Injectable({
    providedIn: 'root'
})
export class ArticleService {
    private readonly searchQuerySubject = new BehaviorSubject<string>('');
    public searchQuery$ = this.searchQuerySubject.asObservable();
    public selectedLanguage = signal<LanguageEnum>(LanguageEnum.EN);
    public homePageArticles = signal<IArticlePartial[]>([]);
    public isArticleFilterSet = signal<boolean>(false);

    private readonly apollo = inject(Apollo);

    watchArticles(variables: OperationVariables): Observable<IArticlePartial[]> {
        return this.apollo
            .watchQuery<{ articles: IRawArticle[] }>({
                query: GET_ARTICLES,
                variables
            })
            .valueChanges.pipe(
                map(({ data }) => {
                    return (data?.articles || [])
                        .filter((article): article is DeepPartial<IRawArticle> => !!article)
                        .map((article) => transformRawArticle(article));
                })
            );
    }

    getArticles(variables: OperationVariables): Observable<IArticlePartial[]> {
        return this.apollo
            .query<{ articles: IRawArticle[] }>({
                query: GET_ARTICLES,
                variables
            })
            .pipe(mapToArticlePartials(), toArray(), first());
    }

    getArticleById(id: string): Observable<IArticlePartial | null> {
        return this.apollo
            .query<{ articles: IRawArticle[] }>({
                query: GET_ARTICLES,
                variables: {
                    entityName: 'article',
                    filterInput: { ids: [id] }
                }
            })
            .pipe(mapToArticlePartials(), first());
    }

    getArticleBySlug(slug: string): Observable<IArticlePartial | null> {
        return this.apollo
            .query<{ articles: IRawArticle[] }>({
                query: GET_ARTICLES,
                variables: {
                    entityName: 'article',
                    filterInput: { slug }
                }
            })
            .pipe(mapToArticlePartials(), first());
    }

    setSearchQuery(query: string) {
        this.searchQuerySubject.next(query);
    }
}
