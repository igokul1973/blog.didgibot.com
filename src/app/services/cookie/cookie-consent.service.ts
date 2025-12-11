import { ICookieConsent } from '@/app/components/cookie-consent/types';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CookieConsentService {
    public readonly CONSENT_KEY = 'cookie_consent';
    public isShowBanner = signal<boolean>(false);
    private readonly consentSubject$ = new BehaviorSubject<ICookieConsent | null>(null);
    public readonly consent$ = this.consentSubject$.asObservable();
    private readonly hasAnalyticsConsentSubject$ = new BehaviorSubject<boolean>(false);
    public readonly hasAnalyticsConsent$ = this.hasAnalyticsConsentSubject$.asObservable();
    private readonly hasMarketingConsentSubject$ = new BehaviorSubject<boolean>(false);
    public readonly hasMarketingConsent$ = this.hasMarketingConsentSubject$.asObservable();

    constructor() {
        this.hasAnalyticsConsent$.subscribe((isAnalyticsConsent) => {
            if (isAnalyticsConsent) {
                this.enableAnalytics();
            } else {
                this.disableAnalytics();
            }
        });

        this.hasMarketingConsent$.subscribe((isMarketingConsent) => {
            if (isMarketingConsent) {
                this.enableMarketing();
            } else {
                this.disableMarketing();
            }
        });

        this.consent$.subscribe((consent) => {
            if (consent) {
                this.closeBanner();
            } else {
                this.openBanner();
            }
            this.hasAnalyticsConsent = consent?.analytics ?? false;
            this.hasMarketingConsent = consent?.marketing ?? false;
        });
        this.loadConsent();
    }

    private loadConsent(): void {
        const consent = localStorage.getItem(this.CONSENT_KEY);
        try {
            this.consent = consent ? JSON.parse(consent) : null;
        } catch (error) {
            console.error('Error parsing cookie consent:', error);
            this.consent = null;
        }
    }

    public set consent(consent: ICookieConsent | null) {
        if (consent) {
            localStorage.setItem(this.CONSENT_KEY, JSON.stringify(consent));
        }
        this.consentSubject$.next(consent);
    }

    public set hasAnalyticsConsent(isAnalyticsConsent: boolean) {
        this.hasAnalyticsConsentSubject$.next(isAnalyticsConsent);
    }

    public set hasMarketingConsent(isMarketingConsent: boolean) {
        this.hasMarketingConsentSubject$.next(isMarketingConsent);
    }

    public clearConsent() {
        localStorage.removeItem(this.CONSENT_KEY);
        this.consent = null;
        this.disableAnalytics();
        this.disableMarketing();
    }

    public enableAnalytics() {
        gtag('consent', 'update', {
            analytics_storage: 'granted'
        });
    }

    public disableAnalytics() {
        gtag('consent', 'update', {
            analytics_storage: 'denied'
        });

        this.deleteGACookies();
    }

    public enableMarketing() {
        gtag('consent', 'update', {
            ad_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted',
            personalization_storage: 'granted'
        });
    }

    public disableMarketing() {
        gtag('consent', 'update', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            personalization_storage: 'denied'
        });

        this.deleteAdCookies();
    }
    private deleteAdCookies() {
        document.cookie.split(';').forEach((cookie) => {
            const name = cookie.split('=')[0].trim();
            if (name.startsWith('_gcl')) {
                this.deleteCookie(name);
            }
        });
    }

    private deleteGACookies() {
        const gaCookies = ['_ga', '_gid', 'gat'];
        gaCookies.forEach(this.deleteCookie);

        document.cookie.split(';').forEach((cookie) => {
            const name = cookie.split('=')[0].trim();
            if (name.startsWith('_ga')) {
                this.deleteCookie(name);
            }
        });
    }
    private deleteCookie(cookieName: string) {
        const domain = window.location.hostname;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`;
    }

    public openBanner() {
        this.isShowBanner.set(true);
    }

    public closeBanner() {
        this.isShowBanner.set(false);
    }
}
