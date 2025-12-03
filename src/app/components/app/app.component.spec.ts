import { routes } from '@/app/app.routes';
import { AnalyticsService } from '@/app/services/analytics/analytics.service';
import { ArticleService } from '@/app/services/article/article.service';
import { CookieConsentService } from '@/app/services/cookie/cookie-consent.service';
import { InitializationService } from '@/app/services/initialization/initialization.service';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, withRouterConfig } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';
import { LanguageEnum } from 'types/translation';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppComponent } from './app.component';

type GlobalWithResizeObserver = typeof globalThis & { ResizeObserver?: typeof ResizeObserver };

describe('AppComponent', () => {
    beforeAll(() => {
        const globalWithResizeObserver = globalThis as GlobalWithResizeObserver;
        globalWithResizeObserver.ResizeObserver =
            globalWithResizeObserver.ResizeObserver ||
            class {
                observe(): void {
                    return;
                }
                unobserve(): void {
                    return;
                }
                disconnect(): void {
                    return;
                }
            };
    });

    beforeEach(async () => {
        const mockAnalyticsService: Partial<AnalyticsService> = {
            init: vi.fn()
        };

        const mockInitializationService: Partial<InitializationService> = {
            setIsInitialized: vi.fn(),
            setIsAnimationFinished: vi.fn(),
            isAnimationFinished$: of(true)
        };

        const mockApolloWatchQuery: Apollo['watchQuery'] = vi.fn(() => ({
            valueChanges: of({ data: { articles: [] } })
        })) as unknown as Apollo['watchQuery'];

        const mockApollo: Partial<Apollo> = {
            watchQuery: mockApolloWatchQuery
        };

        const mockArticleService: Partial<ArticleService> = {
            selectedLanguage: signal(LanguageEnum.EN),
            homePageArticles: signal([]),
            watchArticles: vi.fn(() => of([])),
            getArticleBySlug: vi.fn(() => of(null))
        };

        const mockCookieConsentService: Partial<CookieConsentService> = {
            isShowBanner: signal(false),
            consent$: of(null),
            closeBanner: vi.fn()
        };

        await TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [
                provideRouter(routes, withRouterConfig({ paramsInheritanceStrategy: 'always' })),
                { provide: AnalyticsService, useValue: mockAnalyticsService },
                { provide: InitializationService, useValue: mockInitializationService },
                { provide: Apollo, useValue: mockApollo },
                { provide: ArticleService, useValue: mockArticleService },
                { provide: CookieConsentService, useValue: mockCookieConsentService }
            ]
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it('should have as title "Didgibot.com Blog"', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect((app as unknown as { title: string }).title).toEqual('Didgibot.com Blog');
    });

    it('should render title', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        const text = (compiled.textContent ?? '').toLowerCase();
        expect(text).toContain('didgibot.com');
    });
});
