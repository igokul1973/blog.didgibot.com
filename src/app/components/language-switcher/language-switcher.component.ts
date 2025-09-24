import { ArticleService } from '@/app/services/article/article.service';
import { UrlService } from '@/app/services/url/url.service';
import { Component, OnDestroy, OnInit, OutputRefSubscription } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { LanguageEnum } from 'types/translation';

@Component({
    selector: 'app-language-switcher',
    templateUrl: './language-switcher.component.html',
    styleUrl: './language-switcher.component.scss',
    imports: [FormsModule, MatSelectModule, MatFormFieldModule, MatInputModule],
    providers: [UrlService]
})
export class LanguageSwitcherComponent implements OnInit, OnDestroy {
    protected languageEnum = LanguageEnum;
    protected selectedLanguage = this.articleService.selectedLanguage;
    private readonly subscriptions: Array<Subscription | OutputRefSubscription> = [];

    constructor(
        private readonly articleService: ArticleService,
        private readonly urlService: UrlService
    ) {}

    ngOnInit(): void {
        this.subscriptions.push(
            this.urlService.watchLanguageParam().subscribe((language) => {
                console.log('Language param changed:', language);
                if (!language) {
                    this.selectedLanguage.set(LanguageEnum.EN);
                } else {
                    this.selectedLanguage.set(language);
                }
            })
        );
    }

    protected changeLanguage(language: LanguageEnum) {
        this.urlService.replaceRouteParam('language', language);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((s) => s.unsubscribe());
    }
}
