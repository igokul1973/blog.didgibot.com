import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, withRouterConfig } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, of } from 'rxjs';
import { LanguageEnum } from 'types/translation';
import { vi } from 'vitest';

import { routes } from '@/app/app.routes';
import { ArticleService } from '@/app/services/article/article.service';
import { InitializationService } from '@/app/services/initialization/initialization.service';
import { HeaderComponent } from './header.component';

type GlobalWithResizeObserver = typeof globalThis & { ResizeObserver?: typeof ResizeObserver };

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let selectedLanguageSignal: WritableSignal<LanguageEnum>;
    let setSearchQuerySpy: ArticleService['setSearchQuery'];
    let setIsAnimationFinishedSpy: InitializationService['setIsAnimationFinished'];
    let isAnimationFinishedSubject: BehaviorSubject<boolean>;

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
        const mockApollo = {
            watchQuery: vi.fn(() => ({
                valueChanges: {
                    pipe: vi.fn(() => ({
                        subscribe: vi.fn()
                    }))
                }
            }))
        } as unknown as Apollo;

        selectedLanguageSignal = signal<LanguageEnum>(LanguageEnum.EN);
        setSearchQuerySpy = vi.fn() as ArticleService['setSearchQuery'];
        setIsAnimationFinishedSpy = vi.fn() as InitializationService['setIsAnimationFinished'];
        isAnimationFinishedSubject = new BehaviorSubject<boolean>(false);

        const mockArticleService: Partial<ArticleService> = {
            selectedLanguage: selectedLanguageSignal,
            setSearchQuery: setSearchQuerySpy
        };

        const mockInitializationService: Partial<InitializationService> = {
            isAnimationFinished$: isAnimationFinishedSubject.asObservable(),
            setIsAnimationFinished: setIsAnimationFinishedSpy
        };

        await TestBed.configureTestingModule({
            imports: [HeaderComponent],
            providers: [
                { provide: ArticleService, useValue: mockArticleService },
                { provide: InitializationService, useValue: mockInitializationService },
                { provide: Apollo, useValue: mockApollo },
                provideRouter(routes, withRouterConfig({ paramsInheritanceStrategy: 'always' }))
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        component.routeName$ = of('home');
        component.urlPath = '';
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('toggles mobile menu open state when sandwich button is clicked', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const menu = compiled.querySelector('.mobile-menu') as HTMLElement;
        const sandwichButton = compiled.querySelector('button.menu-icon') as HTMLButtonElement;

        expect(menu.classList.contains('open')).toBe(false);

        sandwichButton.click();
        fixture.detectChanges();
        expect(menu.classList.contains('open')).toBe(true);

        sandwichButton.click();
        fixture.detectChanges();
        expect(menu.classList.contains('open')).toBe(false);
    });

    it('closes mobile menu when clicking outside', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const menu = compiled.querySelector('.mobile-menu') as HTMLElement;
        const sandwichButton = compiled.querySelector('button.menu-icon') as HTMLButtonElement;

        sandwichButton.click();
        fixture.detectChanges();
        expect(menu.classList.contains('open')).toBe(true);

        document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        fixture.detectChanges();

        expect(menu.classList.contains('open')).toBe(false);
    });

    it('does not close mobile menu when clicking inside sandwich button', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const menu = compiled.querySelector('.mobile-menu') as HTMLElement;
        const sandwichButton = compiled.querySelector('button.menu-icon') as HTMLButtonElement;

        sandwichButton.click();
        fixture.detectChanges();
        expect(menu.classList.contains('open')).toBe(true);

        sandwichButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        fixture.detectChanges();

        expect(menu.classList.contains('open')).toBe(true);
    });

    it('toggles brightness mode icon between light and dark', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const brightnessButton = Array.from(compiled.querySelectorAll('button')).find((btn) =>
            (btn.textContent ?? '').includes('wb_sunny')
        ) as HTMLButtonElement | undefined;

        expect(brightnessButton).toBeDefined();
        expect(brightnessButton?.classList.contains('info')).toBe(true);

        brightnessButton?.click();
        fixture.detectChanges();

        let updatedButton = Array.from(compiled.querySelectorAll('button')).find((btn) =>
            (btn.textContent ?? '').includes('brightness_2')
        ) as HTMLButtonElement | undefined;

        expect(updatedButton).toBeDefined();
        expect(updatedButton?.classList.contains('info')).toBe(false);

        updatedButton?.click();
        fixture.detectChanges();

        updatedButton = Array.from(compiled.querySelectorAll('button')).find((btn) =>
            (btn.textContent ?? '').includes('wb_sunny')
        ) as HTMLButtonElement | undefined;

        expect(updatedButton).toBeDefined();
        expect(updatedButton?.classList.contains('info')).toBe(true);
    });

    it('debounces search input and navigates to blog when query length is greater than 2', async () => {
        vi.useFakeTimers();

        const router = TestBed.inject(Router);
        const navigateSpy = vi.spyOn(router, 'navigate');

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        component.routeName$ = of('blog');
        component.urlPath = '';
        // Set the search query before change detection so the first debounced
        // emission corresponds to the non-empty user input.
        component.searchQuery.set('abcd');
        fixture.detectChanges();

        await vi.advanceTimersByTimeAsync(500);
        fixture.detectChanges();

        expect(setSearchQuerySpy).toHaveBeenCalledWith('abcd');
        expect(navigateSpy).toHaveBeenCalledWith(['/', LanguageEnum.EN, 'blog']);

        vi.useRealTimers();
    });

    it('does not navigate when search query length is 2 or less', async () => {
        vi.useFakeTimers();

        const router = TestBed.inject(Router);
        const navigateSpy = vi.spyOn(router, 'navigate');

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        component.routeName$ = of('blog');
        component.urlPath = '';
        component.searchQuery.set('ab');
        fixture.detectChanges();

        await vi.advanceTimersByTimeAsync(500);
        fixture.detectChanges();

        expect(setSearchQuerySpy).toHaveBeenCalledWith('ab');
        expect(navigateSpy).not.toHaveBeenCalled();

        vi.useRealTimers();
    });

    it('handles ResizeObserver both when viewport is narrow and wide', () => {
        const globalWithResizeObserver = globalThis as GlobalWithResizeObserver;
        const originalResizeObserver = globalWithResizeObserver.ResizeObserver;
        let capturedCallback: ((entries: { contentRect: { width: number } }[]) => void) | undefined;

        class TestResizeObserver {
            constructor(cb: (entries: { contentRect: { width: number } }[]) => void) {
                capturedCallback = cb;
            }
            observe(): void {
                return;
            }
            unobserve(): void {
                return;
            }
            disconnect(): void {
                return;
            }
        }

        globalWithResizeObserver.ResizeObserver = TestResizeObserver as unknown as typeof ResizeObserver;

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        component.routeName$ = of('home');
        component.urlPath = '';
        fixture.detectChanges();

        component.isOpen.set(true);
        component.ngAfterViewInit();

        // First call with a narrow viewport should leave the menu open.
        capturedCallback?.([{ contentRect: { width: 600 } }]);
        expect(component.isOpen()).toBe(true);

        // Second call with a wide viewport should close the menu.
        capturedCallback?.([{ contentRect: { width: 800 } }]);
        expect(component.isOpen()).toBe(false);

        globalWithResizeObserver.ResizeObserver = originalResizeObserver;
    });
});
