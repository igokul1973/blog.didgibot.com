import { CommonModule, DatePipe, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IArticlePartial } from 'types/article';
import { BlockParserComponent } from '../editorjs-parser/block-parser/block-parser.component';

@Component({
    selector: 'app-article',
    imports: [CommonModule, RouterLink, MatCardModule, BlockParserComponent, MatButton, DatePipe, MatIcon],
    templateUrl: './article.component.html',
    styleUrl: './article.component.scss'
})
export class ArticleComponent implements OnInit {
    @Input() isAnimationFinished: boolean = false;
    @Input() article!: IArticlePartial;
    @Input() isPreview: boolean = false;
    public id: string | null = null;

    constructor(
        private readonly location: Location,
        private readonly activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.activatedRoute.paramMap.subscribe((params) => {
            this.id = params.get('id');
        });
    }
    goBack() {
        this.location.back();
    }
}
