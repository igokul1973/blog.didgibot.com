import { ArticleService } from '@/app/services/article/article.service';
import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { LanguageEnum } from 'types/translation';

@Component({
    selector: 'app-intro',
    imports: [CommonModule, MatIcon, RouterLink, MatCardModule, MatDividerModule, MatButton],
    templateUrl: './intro.component.html',
    styleUrl: './intro.component.scss'
})
export class IntroComponent {
    @Input() isAnimationFinished = false;
    private readonly articleService = inject(ArticleService);
    protected readonly selectedLanguage = this.articleService.selectedLanguage;
    protected readonly languageEnum = LanguageEnum;
}
