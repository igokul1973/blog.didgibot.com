import { ArticleService } from '@/app/services/article/article.service';
import { AsyncPipe, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { of } from 'rxjs';
import { ArticleComponent } from '../article/article.component';

@Component({
    selector: 'app-blog',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.scss'],
    imports: [NgFor, AsyncPipe, MatCardModule, ArticleComponent]
})
export class BlogComponent {
    private sort = { field: 'updated_at', dir: 'desc' };
    private filter = { updated_at: { from_: '2022-01-01' } };
    public articles$ = this.articleService.getArticles({
        entityName: 'article',
        filterInput: this.filter,
        sortInput: this.sort,
        limit: 5
    });
    public isAnimationFinished$ = of(true);

    constructor(private readonly articleService: ArticleService) {}
}
