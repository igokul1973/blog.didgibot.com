import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { IArticlePartial } from 'types/article';
import { BlockParserComponent } from '../editorjs-parser/block-parser/block-parser.component';

@Component({
    selector: 'app-article',
    imports: [CommonModule, MatCardModule, BlockParserComponent],
    templateUrl: './article.component.html',
    styleUrl: './article.component.scss'
})
export class ArticleComponent {
    @Input() isAnimationFinished: boolean = false;
    @Input() article!: IArticlePartial;

    constructor() {}
}
