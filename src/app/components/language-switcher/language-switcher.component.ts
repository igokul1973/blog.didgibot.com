import { ArticleService } from '@/app/services/article/article.service';
import { UrlService } from '@/app/services/url/url.service';
import { Component, OnDestroy, OnInit, OutputRefSubscription, inject } from '@angular/core';
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
    protected get selectedLanguage() {
        return this.articleService.selectedLanguage;
    }
    private readonly subscriptions: (Subscription | OutputRefSubscription)[] = [];
    private readonly articleService = inject(ArticleService);
    private readonly urlService = inject(UrlService);

    ngOnInit(): void {
        this.subscriptions.push(
            this.urlService.watchLanguageParam().subscribe((language) => {
                if (!language) {
                    this.selectedLanguage.set(LanguageEnum.EN);
                } else {
                    this.selectedLanguage.set(language);
                }
            })
        );
    }

    protected changeLanguage(language: LanguageEnum) {
        this.urlService.replaceLanguageParamInUrl(language);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((s) => s.unsubscribe());
    }
}
