import { ICookieConsent } from '@/app/components/cookie-consent/types';
import { ArticleService } from '@/app/services/article/article.service';
import { CookieConsentService } from '@/app/services/cookie/cookie-consent.service';
import { transition, trigger } from '@angular/animations';
import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { BehaviorSubject } from 'rxjs';
import { LanguageEnum } from 'types/translation';
import { vi } from 'vitest';
import { CookieConsentComponent } from './cookie-consent.component';

describe('CookieConsentComponent', () => {
    let component: CookieConsentComponent;
    let fixture: ComponentFixture<CookieConsentComponent>;
    let selectedLanguageSignal: WritableSignal<LanguageEnum>;
    let consentSubject: BehaviorSubject<ICookieConsent | null>;
    let openBannerSpy: CookieConsentService['openBanner'];
    let closeBannerSpy: CookieConsentService['closeBanner'];
    let clearConsentSpy: CookieConsentService['clearConsent'];
    let setConsentSpy: (value: ICookieConsent | null) => void;

    beforeEach(async () => {
        selectedLanguageSignal = signal(LanguageEnum.EN);
        consentSubject = new BehaviorSubject<ICookieConsent | null>(null);

        openBannerSpy = vi.fn() as CookieConsentService['openBanner'];
        closeBannerSpy = vi.fn() as CookieConsentService['closeBanner'];
        clearConsentSpy = vi.fn() as CookieConsentService['clearConsent'];
        setConsentSpy = vi.fn() as (value: ICookieConsent | null) => void;

        const mockArticleService: Partial<ArticleService> = {
            selectedLanguage: selectedLanguageSignal
        };

        const mockCookieConsentService: Partial<CookieConsentService> = {
            consent$: consentSubject.asObservable(),
            isShowBanner: signal(false) as WritableSignal<boolean>,
            openBanner: openBannerSpy,
            closeBanner: closeBannerSpy,
            clearConsent: clearConsentSpy
        };

        Object.defineProperty(mockCookieConsentService, 'consent', {
            set(value: ICookieConsent | null) {
                setConsentSpy(value);
            }
        });

        await TestBed.configureTestingModule({
            imports: [CookieConsentComponent],
            providers: [
                // eslint-disable-next-line @typescript-eslint/no-deprecated
                provideNoopAnimations(),
                { provide: ArticleService, useValue: mockArticleService },
                { provide: CookieConsentService, useValue: mockCookieConsentService }
            ]
        })
            .overrideComponent(CookieConsentComponent, {
                set: {
                    animations: [
                        // eslint-disable-next-line @typescript-eslint/no-deprecated
                        trigger('animate.enter', [transition(':enter', [])]),
                        // eslint-disable-next-line @typescript-eslint/no-deprecated
                        trigger('animate.leave', [transition(':leave', [])])
                    ]
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(CookieConsentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('opens banner when there is no existing consent', () => {
        expect(openBannerSpy).toHaveBeenCalledTimes(1);
    });

    it('renders cookie categories with correct required and optional badges', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const categories = Array.from(compiled.querySelectorAll('.cookie-category'));

        expect(categories.length).toBe(3);

        const firstBadge = categories[0].querySelector('.required-badge') as HTMLElement | null;
        const secondBadge = categories[1].querySelector('.required-badge') as HTMLElement | null;
        const thirdBadge = categories[2].querySelector('.required-badge') as HTMLElement | null;

        expect(firstBadge?.textContent?.trim()).toBe('Required');
        expect(secondBadge?.textContent?.trim()).toBe('Optional');
        expect(thirdBadge?.textContent?.trim()).toBe('Optional');
    });

    it('shows language-specific description text based on selected language', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        let paragraph = compiled.querySelector('.cookie-text p') as HTMLElement | null;

        expect(paragraph).not.toBeNull();
        expect(paragraph?.textContent ?? '').toContain('We use cookies');

        selectedLanguageSignal.set(LanguageEnum.RU);
        fixture.detectChanges();

        paragraph = compiled.querySelector('.cookie-text p') as HTMLElement | null;
        expect(paragraph).not.toBeNull();
        expect(paragraph?.textContent ?? '').toContain('Мы используем cookies');
    });

    it('saves preferences using current form values and closes the banner', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const analyticsInput = compiled.querySelector('input#analytics') as HTMLInputElement;
        const marketingInput = compiled.querySelector('input#marketing') as HTMLInputElement;

        analyticsInput.click();
        fixture.detectChanges();

        expect(analyticsInput.checked).toBe(true);
        expect(marketingInput.checked).toBe(false);

        const saveButton = compiled.querySelector('button.btn.btn-primary') as HTMLButtonElement;
        saveButton.click();
        fixture.detectChanges();

        expect(setConsentSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                necessary: true,
                analytics: true,
                marketing: false
            })
        );
        expect(closeBannerSpy).toHaveBeenCalled();
    });

    it('accepts all cookies and closes the banner', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const acceptAllButton = Array.from(compiled.querySelectorAll('button')).find((btn) =>
            (btn.textContent ?? '').includes('Accept all')
        ) as HTMLButtonElement | undefined;

        expect(acceptAllButton).toBeDefined();

        acceptAllButton?.click();
        fixture.detectChanges();

        expect(setConsentSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                necessary: true,
                analytics: true,
                marketing: true
            })
        );
        expect(closeBannerSpy).toHaveBeenCalled();
    });

    it('rejects non-essential cookies and closes the banner', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const rejectButton = Array.from(compiled.querySelectorAll('button')).find((btn) =>
            (btn.textContent ?? '').includes('Reject All')
        ) as HTMLButtonElement | undefined;

        expect(rejectButton).toBeDefined();

        rejectButton?.click();
        fixture.detectChanges();

        expect(setConsentSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                necessary: true,
                analytics: false,
                marketing: false
            })
        );
        expect(closeBannerSpy).toHaveBeenCalled();
    });

    it('populates form controls from existing non-expired consent without clearing it', () => {
        const consent: ICookieConsent = {
            necessary: false,
            analytics: true,
            marketing: false,
            timestamp: Date.now()
        };

        consentSubject.next(consent);
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const necessaryInput = compiled.querySelector('input#necessary') as HTMLInputElement;
        const analyticsInput = compiled.querySelector('input#analytics') as HTMLInputElement;
        const marketingInput = compiled.querySelector('input#marketing') as HTMLInputElement;

        expect(necessaryInput.checked).toBe(false);
        expect(analyticsInput.checked).toBe(true);
        expect(marketingInput.checked).toBe(false);
        expect(clearConsentSpy).not.toHaveBeenCalled();
    });

    it('uses default checkbox values and clears consent when consent fields are undefined', () => {
        const partialConsent = {
            necessary: undefined,
            analytics: undefined,
            marketing: undefined,
            timestamp: undefined
        } as unknown as ICookieConsent;

        consentSubject.next(partialConsent);
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const necessaryInput = compiled.querySelector('input#necessary') as HTMLInputElement;
        const analyticsInput = compiled.querySelector('input#analytics') as HTMLInputElement;
        const marketingInput = compiled.querySelector('input#marketing') as HTMLInputElement;

        expect(necessaryInput.checked).toBe(true);
        expect(analyticsInput.checked).toBe(false);
        expect(marketingInput.checked).toBe(false);
        expect(clearConsentSpy).toHaveBeenCalled();
    });

    it('clears consent when existing consent is expired', () => {
        const expiredConsent: ICookieConsent = {
            necessary: true,
            analytics: false,
            marketing: false,
            timestamp: 0
        };

        consentSubject.next(expiredConsent);
        fixture.detectChanges();

        expect(clearConsentSpy).toHaveBeenCalled();
    });
});
