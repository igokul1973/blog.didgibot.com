import { ArticleService } from '@/app/services/article/article.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { of } from 'rxjs';
import { IArticleQueryInput, ISortInput } from 'types/article';
import { ArticleComponent } from '../article/article.component';
import BlogDataSource from './blog.datasource';

@Component({
    selector: 'app-blog',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.scss'],
    imports: [NgClass, ScrollingModule, AsyncPipe, MatCardModule, ArticleComponent]
})
export class BlogComponent implements OnInit {
    private readonly filter = { updated_at: { from_: '2022-01-01' } };
    private readonly sort: ISortInput = { field: 'updated_at', dir: 'desc' };
    private readonly limit = 20;
    public isAnimationFinished$ = of(true);
    private readonly articleService = inject(ArticleService);
    protected readonly searchQuery$ = this.articleService.searchQuery$;
    protected selectedLanguage = this.articleService.selectedLanguage;

    public ds = new BlogDataSource(this.articleService, {
        entityName: 'article',
        filterInput: this.filter,
        sortInput: this.sort,
        limit: this.limit,
        skip: 0
    });

    ngOnInit(): void {
        this.searchQuery$.subscribe((search) => {
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
        });
    }
}
