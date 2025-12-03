import { ICookieConsent } from '@/app/components/cookie-consent/types';
import { ArticleService } from '@/app/services/article/article.service';
import { CookieConsentService } from '@/app/services/cookie/cookie-consent.service';
import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { LanguageEnum } from 'types/translation';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CookieConsentComponent } from './cookie-consent.component';

describe('CookieConsentComponent', () => {
    let component: CookieConsentComponent;
    let fixture: ComponentFixture<CookieConsentComponent>;

    beforeEach(async () => {
        const mockArticleService: Partial<ArticleService> = {
            selectedLanguage: signal(LanguageEnum.EN)
        };

        const mockCookieConsentService: Partial<CookieConsentService> = {
            consent$: of(null),
            isShowBanner: signal(false) as WritableSignal<boolean>,
            openBanner: vi.fn(),
            closeBanner: vi.fn(),
            clearConsent: vi.fn(),
            set consent(_value: ICookieConsent | null | undefined) {
                // noop
            }
        };

        await TestBed.configureTestingModule({
            imports: [CookieConsentComponent],
            providers: [
                provideNoopAnimations(),
                { provide: ArticleService, useValue: mockArticleService },
                { provide: CookieConsentService, useValue: mockCookieConsentService }
            ]
        })
            .overrideComponent(CookieConsentComponent, {
                set: {
                    template: '<div></div>'
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
});
