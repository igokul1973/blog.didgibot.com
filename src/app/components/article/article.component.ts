import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
// import edjsHTML from 'editorjs-html';
import { IArticlePartial } from 'types/article';

@Component({
    selector: 'app-article',
    imports: [CommonModule, MatCardModule],
    templateUrl: './article.component.html',
    styleUrl: './article.component.scss'
})
export class ArticleComponent {
    @Input() isAnimationFinished: boolean = false;
    @Input() article!: IArticlePartial;

    constructor() {
        // const edjsParser = window.edjsHTML();
        // const html = edjsParser.parse(this.article.translations[0].content);
        // console.log(html);
    }
}
