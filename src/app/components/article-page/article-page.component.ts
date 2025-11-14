import { ArticleService } from '@/app/services/article/article.service';
import { transformRawArticle } from '@/utils/transformers';
import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, first, Subject, takeUntil } from 'rxjs';
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
    private readonly slugSubject$ = new BehaviorSubject<string | null>(null);
    public slug$ = this.slugSubject$.asObservable();
    private readonly articleSubject$ = new BehaviorSubject<IArticlePartial | null>(null);
    public article$ = this.articleSubject$.asObservable();
    private client!: ApolloClient<NormalizedCacheObject>;
    private readonly unsubscribed$ = new Subject<void>();
    protected selectedLanguage = this.articleService.selectedLanguage;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly apollo: Apollo,
        private readonly articleService: ArticleService
    ) {}

    ngOnInit(): void {
        this.client = this.apollo.client;
        this.activatedRoute.paramMap.subscribe({
            next: (params) => {
                this.setId$(params.get('id'));
                this.setSlug$(params.get('slug'));
            }
        });

        this.slug$.pipe(takeUntil(this.unsubscribed$)).subscribe({
            next: (slug) => {
                if (!slug) {
                    return;
                }
                let article = this.client.readFragment<IRawArticle>({
                    id: `ArticleType:${slug}`,
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
                            slug
                            priority
                            created_at
                            updated_at
                        }
                    `
                });

                if (!article) {
                    this.articleService
                        .getArticleBySlug(slug)
                        .pipe(first())
                        .subscribe({
                            next: (article: IArticlePartial | null) => {
                                if (!article) {
                                    return;
                                }
                                this.setArticle$(article);
                            },
                            error: (err: any) => console.error('Error fetching article:', err)
                        });
                } else {
                    const transformedArticle = transformRawArticle(article);
                    this.setArticle$(transformedArticle);
                }
            },
            error: (err) => console.error('Subscription error:', err)
        });
    }

    private setId$(id: string | null): void {
        this.idSubject$.next(id);
    }

    private setSlug$(slug: string | null): void {
        this.slugSubject$.next(slug);
    }

    private setArticle$(article: IArticlePartial): void {
        this.articleSubject$.next(article);
    }

    ngOnDestroy(): void {
        this.unsubscribed$.next();
        this.unsubscribed$.complete();
    }
}
