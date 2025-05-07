import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-article',
    imports: [CommonModule, MatCardModule],
    templateUrl: './article.component.html',
    styleUrl: './article.component.scss'
})
export class ArticleComponent {
    @Input() isAnimationFinished: boolean = false;
}
