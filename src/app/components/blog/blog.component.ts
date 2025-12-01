import { ArticleService } from '@/app/services/article/article.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { IArticleQueryInput, ISortInput } from 'types/article';
import { ArticleComponent } from '../article/article.component';
import BlogDataSource from './blog.datasource';
import { DataSourceErrorsEnum, IDataSourceError } from './types';

@Component({
    selector: 'app-blog',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.scss'],
    imports: [
        NgClass,
        ScrollingModule,
        AsyncPipe,
        MatCardModule,
        MatProgressBarModule,
        ArticleComponent,
        MatSnackBarModule
    ],
    standalone: true
})
export class BlogComponent implements OnInit, OnDestroy {
    private readonly filter = { updated_at: { from_: '2022-01-01' } };
    private readonly sort: ISortInput = { field: 'updated_at', dir: 'desc' };
    private readonly limit = 20;
    private readonly articleService = inject(ArticleService);
    protected readonly searchQuery$ = this.articleService.searchQuery$;
    protected selectedLanguage = this.articleService.selectedLanguage;
    public currentError: IDataSourceError | null = null;
    public isLoading = false;
    private subscriptions: Subscription[] = [];
    private readonly snackBar = inject(MatSnackBar);

    public ds = new BlogDataSource(this.articleService, {
        entityName: 'article',
        filterInput: this.filter,
        sortInput: this.sort,
        limit: this.limit,
        skip: 0
    });

    ngOnInit(): void {
        this.subscriptions.push(
            this.searchQuery$.subscribe({
                next: (search) => {
                    const searchQuery: IArticleQueryInput = {
                        entityName: 'article',
                        filterInput: { ...this.filter },
                        sortInput: this.sort,
                        limit: this.limit,
                        skip: 0
                    };
                    if (search.length > 2) {
                        searchQuery.filterInput = { ...searchQuery.filterInput, search };
                    }
                    this.ds.setQuery(searchQuery);
                }
            })
        );

        this.subscriptions.push(
            this.ds.loading$.subscribe({
                next: (loading) => {
                    this.isLoading = loading;
                }
            })
        );

        this.subscriptions.push(
            this.ds.errors$.subscribe({
                next: (error) => {
                    this.currentError = error;
                    this.handleError(error);
                }
            })
        );
    }

    private showError(message: string, duration: number, action = 'Close'): MatSnackBarRef<TextOnlySnackBar> {
        return this.snackBar.open(message, action, {
            duration,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
        });
    }

    private handleError(error: IDataSourceError) {
        switch (error.type) {
            case DataSourceErrorsEnum.NETWORK_ERROR: {
                const snackbarRef = this.showError('Network error occurred. Retry?', 5000, 'Retry');
                snackbarRef.onAction().subscribe(() => {
                    this.retryFailed();
                });
                break;
            }
            case DataSourceErrorsEnum.SERVER_ERROR: {
                this.showError('Server error occurred.', 5000);
                break;
            }
            case DataSourceErrorsEnum.PERMISSION_DENIED: {
                this.showError('Permission denied!', 5000);
                break;
            }
            case DataSourceErrorsEnum.UNKNOWN: {
                this.showError('An unknown error occurred.', 5000);
                break;
            }
        }
    }

    private retryFailed() {
        this.currentError = null;
        this.ds.retryFailedPages();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    }
}
