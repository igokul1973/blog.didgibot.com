import { ArticleService } from '@/app/services/article/article.service';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ArticleComponent } from '../article/article.component';
import { of } from 'rxjs';
import { AsyncPipe, NgFor } from '@angular/common';

@Component({
    selector: 'app-blog',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.scss'],
    imports: [NgFor, AsyncPipe, MatCardModule, ArticleComponent]
})
export class BlogComponent {
    public articles$ = this.articleService.getArticles();
    public isAnimationFinished$ = of(true);

    constructor(private readonly articleService: ArticleService) {}
}
