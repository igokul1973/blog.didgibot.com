import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import type { ICookieConsent } from '@/app/components/cookie-consent/types';
import { CookieConsentService } from './cookie-consent.service';

// Mock global gtag used by CookieConsentService
type GlobalWithGtag = typeof globalThis & { gtag?: (...args: unknown[]) => void };
const globalWithGtag = globalThis as GlobalWithGtag;

describe('CookieConsentService', () => {
    let service: CookieConsentService;

    const clearAllCookies = (): void => {
        const current = document.cookie;
        if (!current) {
            return;
        }
        current.split(';').forEach((cookie) => {
            const name = cookie.split('=')[0].trim();
            if (!name) {
                return;
            }
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
    };

    beforeEach(() => {
        localStorage.clear();
        clearAllCookies();
        globalWithGtag.gtag = vi.fn();

        TestBed.configureTestingModule({});
    });

    function createService(): CookieConsentService {
        service = TestBed.inject(CookieConsentService);
        return service;
    }

    it('should be created', () => {
        const s = createService();
        expect(s).toBeTruthy();
    });

    it('shows banner and no consent by default when there is no stored consent', () => {
        const s = createService();

        expect(s.isShowBanner()).toBe(true);
        expect(localStorage.getItem(s.CONSENT_KEY)).toBeNull();
    });

    it('loads existing consent from localStorage, closes banner, and applies analytics consent', () => {
        const storedConsent: ICookieConsent = {
            necessary: true,
            analytics: true,
            marketing: false,
            timestamp: Date.now()
        };
        localStorage.setItem('cookie_consent', JSON.stringify(storedConsent));

        const s = createService();

        expect(s.isShowBanner()).toBe(false);
        expect(globalWithGtag.gtag).toHaveBeenCalledWith(
            'consent',
            'update',
            expect.objectContaining({ analytics_storage: 'granted' })
        );
    });

    it('handles invalid JSON in localStorage gracefully and logs an error', () => {
        localStorage.setItem('cookie_consent', '{invalid-json');
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

        const s = createService();

        expect(s.isShowBanner()).toBe(true);
        expect(consoleErrorSpy).toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
    });

    it('consent setter persists consent and closes the banner', () => {
        const s = createService();
        const consent: ICookieConsent = {
            necessary: true,
            analytics: true,
            marketing: true,
            timestamp: Date.now()
        };

        s.consent = consent;

        expect(localStorage.getItem(s.CONSENT_KEY)).toBe(JSON.stringify(consent));
        expect(s.isShowBanner()).toBe(false);
    });

    it('clearConsent removes stored consent, opens banner, and disables analytics and marketing', () => {
        const consent: ICookieConsent = {
            necessary: true,
            analytics: true,
            marketing: true,
            timestamp: Date.now()
        };
        localStorage.setItem('cookie_consent', JSON.stringify(consent));
        const s = createService();

        const gtagSpy = globalWithGtag.gtag as ReturnType<typeof vi.fn>;
        gtagSpy.mockClear();

        s.clearConsent();

        expect(localStorage.getItem(s.CONSENT_KEY)).toBeNull();
        expect(s.isShowBanner()).toBe(true);
        expect(gtagSpy).toHaveBeenCalled();
    });

    it('hasAnalyticsConsent toggles analytics consent and deletes GA cookies', () => {
        const s = createService();
        document.cookie = '_ga_123=abc';

        const deleteCookieOwner = s as unknown as { deleteCookie(name: string): void };
        const deleteCookieSpy = vi.spyOn(deleteCookieOwner, 'deleteCookie');

        s.hasAnalyticsConsent = true;
        s.hasAnalyticsConsent = false;

        const gtagSpy = globalWithGtag.gtag as ReturnType<typeof vi.fn>;
        expect(gtagSpy).toHaveBeenCalledWith(
            'consent',
            'update',
            expect.objectContaining({ analytics_storage: 'granted' })
        );
        expect(gtagSpy).toHaveBeenCalledWith(
            'consent',
            'update',
            expect.objectContaining({ analytics_storage: 'denied' })
        );

        const deletedNames = deleteCookieSpy.mock.calls.map((args) => args[0]);
        expect(deletedNames).toEqual(expect.arrayContaining(['_ga', '_gid', 'gat', '_ga_123']));
    });

    it('hasMarketingConsent toggles marketing consent and deletes ad cookies', () => {
        const s = createService();
        document.cookie = '_gcl_au=abc';

        const deleteCookieOwner = s as unknown as { deleteCookie(name: string): void };
        const deleteCookieSpy = vi.spyOn(deleteCookieOwner, 'deleteCookie');

        s.hasMarketingConsent = true;
        s.hasMarketingConsent = false;

        const gtagSpy = globalWithGtag.gtag as ReturnType<typeof vi.fn>;
        expect(gtagSpy).toHaveBeenCalledWith('consent', 'update', expect.objectContaining({ ad_storage: 'granted' }));
        expect(gtagSpy).toHaveBeenCalledWith('consent', 'update', expect.objectContaining({ ad_storage: 'denied' }));

        expect(deleteCookieSpy).toHaveBeenCalledWith('_gcl_au');
    });

    it('openBanner and closeBanner toggle isShowBanner signal', () => {
        const s = createService();

        s.openBanner();
        expect(s.isShowBanner()).toBe(true);

        s.closeBanner();
        expect(s.isShowBanner()).toBe(false);
    });
});
