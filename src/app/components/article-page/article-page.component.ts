import { ArticleService } from '@/app/services/article/article.service';
import { transformRawArticle } from '@/utils/transformers';
import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, first, Subject, takeUntil, tap } from 'rxjs';
import { IArticlePartial, IRawArticle } from 'types/article';
import { ArticleComponent } from '../article/article.component';

@Component({
    selector: 'app-article-page',
    imports: [AsyncPipe, ArticleComponent],
    templateUrl: './article-page.component.html',
    styleUrl: './article-page.component.scss'
})
export class ArticlePageComponent implements OnInit, OnDestroy {
    private readonly idSubject$ = new BehaviorSubject<string | null>(null);
    public id$ = this.idSubject$.asObservable();
    private readonly articleSubject$ = new BehaviorSubject<IArticlePartial | null>(null);
    public article$ = this.articleSubject$.asObservable();
    private client!: ApolloClient<NormalizedCacheObject>;
    private readonly unsubscribed$ = new Subject<void>();

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly apollo: Apollo,
        private readonly articleService: ArticleService
    ) {}

    ngOnInit(): void {
        this.client = this.apollo.client;
        this.activatedRoute.paramMap.subscribe((params) => {
            this.setId$(params.get('id'));
        });

        this.id$.pipe(takeUntil(this.unsubscribed$)).subscribe((id) => {
            if (!id) {
                return;
            }
            let article = this.client.readFragment<IRawArticle>({
                id: `ArticleType:${id}`,
                fragment: gql`
                    fragment Z on ArticleType {
                        id
                        translations {
                            language
                            header
                            content {
                                version
                                time
                                blocks {
                                    id
                                    type
                                    data
                                }
                            }
                            category {
                                id
                                name
                            }
                            tags {
                                id
                                name
                            }
                            is_published
                        }
                        created_at
                        updated_ats
                    }
                `
            });
            console.log('Articleeee: ', article);
            if (!article) {
                this.articleService
                    .getArticleById(id)
                    .pipe(
                        first(),
                        tap((a: any) => {
                            console.log('Article', a);
                        })
                    )
                    .subscribe((article) => {
                        if (!article) {
                            return;
                        }
                        this.setArticle$(article);
                    });
            } else {
                const transformedArticle = transformRawArticle(article);
                this.setArticle$(transformedArticle);
            }
        });
    }

    private setId$(id: string | null): void {
        this.idSubject$.next(id);
    }

    private setArticle$(article: IArticlePartial): void {
        this.articleSubject$.next(article);
    }

    ngOnDestroy(): void {
        this.unsubscribed$.next();
        this.unsubscribed$.complete();
    }
}
