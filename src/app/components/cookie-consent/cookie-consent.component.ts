import { ArticleService } from '@/app/services/article/article.service';
import { CookieConsentService } from '@/app/services/cookie/cookie-consent.service';
import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LanguageEnum } from 'types/translation';
import { ICookieConsent } from './types';

@Component({
    selector: 'app-cookie-consent',
    imports: [ReactiveFormsModule, FormsModule],
    templateUrl: './cookie-consent.component.html',
    styleUrl: './cookie-consent.component.scss'
})
export class CookieConsentComponent implements OnInit, OnDestroy {
    private readonly CONSENT_EXPIRY_DAYS = 365;
    private readonly articleService = inject(ArticleService);
    private readonly cookieConsentService = inject(CookieConsentService);
    private readonly fb = inject(FormBuilder);
    private selectedLanguage = this.articleService.selectedLanguage;
    protected noDetailsText = computed(() => {
        if (this.selectedLanguage() === LanguageEnum.EN) {
            return 'We use cookies to enhance your browsing experience and analyze our traffic. You can choose which cookies to accept.';
        } else {
            return 'Мы используем cookies для улучшения вашего опыта просмотра и анализа нашего трафика. Вы можете выбрать, какие cookies принимать.';
        }
    });

    protected cookies = [
        {
            id: 'necessary',
            name: 'Necessary Cookies',
            formControl: 'necessary',
            description: 'Essential for the website to function. Cannot be disabled.'
        },
        {
            id: 'analytics',
            name: 'Analytics Cookies',
            formControl: 'analytics',
            description: 'Help us understand how visitors interact with our website.'
        },
        {
            id: 'marketing',
            name: 'Marketing Cookies',
            formControl: 'marketing',
            description: 'Used to track visitors across websites for advertising purposes.'
        }
    ];

    protected form = this.fb.group({
        necessary: [{ value: true, disabled: true }, Validators.required],
        analytics: [{ value: false, disabled: false }],
        marketing: [{ value: false, disabled: false }]
    });

    private subscription: Subscription | null = null;

    ngOnInit(): void {
        this.cookieConsentService.consent$.subscribe((consent) => {
            this.checkExistingConsent(consent);
        });
    }

    protected isCookieRequired(cookieName: string) {
        return this.form.get(cookieName)?.hasValidator(Validators.required);
    }

    protected savePreferences() {
        const hasAnalytics = this.form.get('analytics')?.value ?? false;
        const hasMarketing = this.form.get('marketing')?.value ?? false;
        this.cookieConsentService.consent = {
            necessary: true,
            analytics: hasAnalytics,
            marketing: hasMarketing,
            timestamp: Date.now()
        };
        this.cookieConsentService.closeBanner();
    }

    protected acceptAll() {
        this.cookieConsentService.consent = {
            necessary: true,
            analytics: true,
            marketing: true,
            timestamp: Date.now()
        };
        this.cookieConsentService.closeBanner();
    }

    protected rejectNonEssential() {
        this.cookieConsentService.consent = {
            necessary: true,
            analytics: false,
            marketing: false,
            timestamp: Date.now()
        };
        this.cookieConsentService.closeBanner();
    }

    private checkExistingConsent(consent: ICookieConsent | null) {
        if (!consent) {
            this.cookieConsentService.openBanner();
        } else {
            this.form.get('necessary')?.setValue(consent.necessary ?? true);
            this.form.get('analytics')?.setValue(consent.analytics ?? false);
            this.form.get('marketing')?.setValue(consent.marketing ?? false);
            const expiryTime = (consent?.timestamp ?? 0) + this.CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

            if (Date.now() >= expiryTime) {
                this.cookieConsentService.clearConsent();
            }
        }
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}
