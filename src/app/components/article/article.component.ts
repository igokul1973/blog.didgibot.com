import { CommonModule, DatePipe, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IArticlePartial } from 'types/article';
import { BlockParserComponent } from '../editorjs-parser/block-parser/block-parser.component';
import { TCodeLanguage } from '../editorjs-parser/block-parser/parsers/code-block/types';

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
    public blockParserConfig: { code: { languages: TCodeLanguage[]; showLineNumbers: boolean } } = {
        code: {
            languages: [
                {
                    shortName: 'html',
                    language: 'html',
                    logoSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
                    logoAlt: 'HTML language',
                    displayText: 'HTML5'
                },
                {
                    shortName: 'js',
                    language: 'javascript',
                    logoSrc:
                        'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
                    logoAlt: 'Javascript language',
                    displayText: 'Javascript'
                },
                {
                    shortName: 'ts',
                    language: 'typescript',
                    logoSrc:
                        'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
                    logoAlt: 'Typescript language',
                    displayText: 'Typescript'
                },
                {
                    shortName: 'go',
                    language: 'go',
                    logoSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg',
                    logoAlt: 'Golang language',
                    displayText: 'Golang'
                },
                {
                    shortName: 'python',
                    language: 'python',
                    logoSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
                    logoAlt: 'Python language',
                    displayText: 'Python'
                },
                {
                    shortName: 'php',
                    language: 'php',
                    logoSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg',
                    logoAlt: 'PHP language',
                    displayText: 'PHP'
                },
                {
                    shortName: 'java',
                    language: 'java',
                    logoSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
                    logoAlt: 'Java language',
                    displayText: 'Java'
                },
                {
                    shortName: 'css',
                    language: 'css',
                    logoSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg',
                    logoAlt: 'CSS language',
                    displayText: 'CSS'
                },
                {
                    shortName: 'scss',
                    language: 'scss',
                    logoSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sass/sass-original.svg',
                    logoAlt: 'SASS language',
                    displayText: 'SASS'
                }
            ],
            showLineNumbers: true
        }
    };

    constructor(
        private readonly location: Location,
        private readonly activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.activatedRoute.paramMap.subscribe({
            next: (params) => {
                this.id = params.get('id');
            }
        });
    }
    goBack() {
        this.location.back();
    }
}
