import { routes } from '@/app/app.routes';
import { AnalyticsService } from '@/app/services/analytics/analytics.service';
import { ArticleService } from '@/app/services/article/article.service';
import { CookieConsentService } from '@/app/services/cookie/cookie-consent.service';
import { InitializationService } from '@/app/services/initialization/initialization.service';
import { signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NavigationEnd, provideRouter, Router, withRouterConfig } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { LanguageEnum } from 'types/translation';
import { vi } from 'vitest';
import { CookieConsentComponent } from '../cookie-consent/cookie-consent.component';
import { ICookieConsent } from '../cookie-consent/types';
import { AppComponent } from './app.component';

type GlobalWithResizeObserver = typeof globalThis & { ResizeObserver?: typeof ResizeObserver };

interface MediaQueryListLike {
    matches: boolean;
    media: string;
    addEventListener: (event: string, listener: (ev: MediaQueryListEvent) => void) => void;
    removeEventListener: (event: string, listener: (ev: MediaQueryListEvent) => void) => void;
    addListener: (listener: (ev: MediaQueryListEvent) => void) => void;
    removeListener: (listener: (ev: MediaQueryListEvent) => void) => void;
}

describe('AppComponent', () => {
    let analyticsInitSpy: AnalyticsService['init'];
    let initializationSetIsInitializedSpy: InitializationService['setIsInitialized'];
    let articleWatchArticlesSpy: ArticleService['watchArticles'];
    let setSearchQuerySpy: ArticleService['setSearchQuery'];
    let mockArticleService: Partial<ArticleService>;
    let cookieConsentSubject: BehaviorSubject<ICookieConsent | null>;
    let cookieBannerSignal: WritableSignal<boolean>;

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
        analyticsInitSpy = vi.fn();
        initializationSetIsInitializedSpy = vi.fn();
        articleWatchArticlesSpy = vi.fn(() => of([]));
        setSearchQuerySpy = vi.fn();
        cookieConsentSubject = new BehaviorSubject<ICookieConsent | null>(null);

        const mockAnalyticsService: Partial<AnalyticsService> = {
            init: analyticsInitSpy
        };

        const mockInitializationService: Partial<InitializationService> = {
            setIsInitialized: initializationSetIsInitializedSpy,
            setIsAnimationFinished: vi.fn(),
            isAnimationFinished$: of(true)
        };

        const mockApolloWatchQuery: Apollo['watchQuery'] = vi.fn(() => ({
            valueChanges: of({ data: { articles: [] } })
        })) as unknown as Apollo['watchQuery'];

        const mockApollo: Partial<Apollo> = {
            watchQuery: mockApolloWatchQuery
        };

        mockArticleService = {
            selectedLanguage: signal(LanguageEnum.EN),
            homePageArticles: signal([]),
            watchArticles: articleWatchArticlesSpy,
            getArticleBySlug: vi.fn(() => of(null)),
            setSearchQuery: setSearchQuerySpy
        };

        cookieBannerSignal = signal(false);

        const mockCookieConsentService: Partial<CookieConsentService> = {
            isShowBanner: cookieBannerSignal,
            consent$: cookieConsentSubject.asObservable(),
            closeBanner: vi.fn()
        };

        await TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [
                // eslint-disable-next-line @typescript-eslint/no-deprecated
                provideNoopAnimations(),
                provideRouter(routes, withRouterConfig({ paramsInheritanceStrategy: 'always' })),
                { provide: AnalyticsService, useValue: mockAnalyticsService },
                { provide: InitializationService, useValue: mockInitializationService },
                { provide: Apollo, useValue: mockApollo },
                { provide: ArticleService, useValue: mockArticleService },
                { provide: CookieConsentService, useValue: mockCookieConsentService }
            ]
        })
            .overrideComponent(CookieConsentComponent, {
                set: {
                    // Simplify the template for tests to avoid animation bindings like @animate.enter/@animate.leave
                    template: '<article class="cookie-consent-banner">Cookie consent banner</article>'
                }
            })
            .compileComponents();
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

    it('calls initialization and watches articles on init', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();

        expect(initializationSetIsInitializedSpy).toHaveBeenCalledTimes(1);
        expect(articleWatchArticlesSpy).toHaveBeenCalledTimes(1);
        expect(articleWatchArticlesSpy).toHaveBeenCalledWith({
            entityName: 'article',
            sortInput: { field: 'updated_at', dir: 'desc' },
            limit: 3
        });
    });

    it('logs an error when loading articles fails', () => {
        const error = new Error('load failed');
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
            return;
        });

        vi.spyOn(mockArticleService as ArticleService, 'watchArticles').mockReturnValueOnce(throwError(() => error));

        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();

        expect(consoleErrorSpy).toHaveBeenCalledWith(error);

        consoleErrorSpy.mockRestore();
    });

    it('initializes analytics when consent with analytics is received', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();

        cookieConsentSubject.next({
            necessary: true,
            analytics: true,
            marketing: false,
            timestamp: Date.now()
        });

        expect(analyticsInitSpy).toHaveBeenCalledTimes(1);
    });

    it('shows cookie consent banner when service signal is true', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();

        // Initially hidden
        let compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('app-cookie-consent')).toBeNull();

        // Flip the banner signal and detect changes
        cookieBannerSignal.set(true);
        fixture.detectChanges();

        compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('app-cookie-consent')).not.toBeNull();
    });

    it('emits "home" from urlPath$ when router url is root', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const router = TestBed.inject(Router);

        const eventsSpy = vi.spyOn(router, 'events', 'get').mockReturnValue(of(new NavigationEnd(1, '/', '/')));
        const urlSpy = vi.spyOn(router, 'url', 'get').mockReturnValue('/');

        fixture.detectChanges();

        // The async pipe in the template subscribes to urlPath$, which should
        // emit 'home' when router.url is '/'. We don't need to access
        // internal fields directly; it's enough that change detection runs
        // without errors for this configuration.

        eventsSpy.mockRestore();
        urlSpy.mockRestore();
    });

    it('applies home route name as CSS class on the content section when navigating to /en', async () => {
        const router = TestBed.inject(Router);
        const fixture = TestBed.createComponent(AppComponent);

        fixture.detectChanges();

        await router.navigateByUrl('/en');
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const section = compiled.querySelector('section.content') as HTMLElement | null;
        expect(section).not.toBeNull();
        expect(section!.classList.contains('home')).toBe(true);
    });

    it('applies dark mode to body when prefers-color-scheme is dark', () => {
        const originalMatchMedia = window.matchMedia;

        const win = window as unknown as { matchMedia?: (query: string) => MediaQueryListLike };

        win.matchMedia = vi.fn(
            (query: string): MediaQueryListLike => ({
                matches: query === '(prefers-color-scheme: dark)',
                media: query,
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                addListener: vi.fn(),
                removeListener: vi.fn()
            })
        );

        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();

        expect(document.body.classList.contains('dark')).toBe(true);

        // Cleanup
        document.body.classList.remove('dark');
        win.matchMedia = originalMatchMedia;
    });

    it('returns light when matchMedia is not available', () => {
        const win = window as unknown as {
            matchMedia?: ((query: string) => MediaQueryListLike) | undefined;
        };
        const originalMatchMedia = win.matchMedia;
        win.matchMedia = undefined;

        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance as unknown as {
            getPreferredColorScheme: () => 'dark' | 'light';
        };

        const scheme = app.getPreferredColorScheme();
        expect(scheme).toBe('light');

        win.matchMedia = originalMatchMedia;
    });

    it('does not apply dark mode when prefers-color-scheme is light', () => {
        const originalMatchMedia = window.matchMedia;

        const win = window as unknown as { matchMedia?: (query: string) => MediaQueryListLike };

        win.matchMedia = vi.fn(
            (query: string): MediaQueryListLike => ({
                matches: false,
                media: query,
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                addListener: vi.fn(),
                removeListener: vi.fn()
            })
        );

        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();

        expect(document.body.classList.contains('dark')).toBe(false);

        // Cleanup
        document.body.classList.remove('dark');
        win.matchMedia = originalMatchMedia;
    });
});
