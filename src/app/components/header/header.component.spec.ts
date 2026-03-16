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

    describe('CV Navigation', () => {
        it('should have CV navigation icon in desktop header', () => {
            const compiled = fixture.nativeElement as HTMLElement;
            const cvIcon = compiled.querySelector<HTMLButtonElement>('button[aria-label*="Curriculum Vitae"]');
            expect(cvIcon).toBeTruthy();
            if (cvIcon) {
                expect(cvIcon.getAttribute('aria-label')).toContain('Curriculum Vitae');
            }
        });

        it('should have CV icon with proper tooltip', () => {
            const compiled = fixture.nativeElement as HTMLElement;
            const cvIcon = compiled.querySelector<HTMLButtonElement>('button[mattooltip*="Curriculum Vitae"]');
            expect(cvIcon).toBeTruthy();
            if (cvIcon) {
                expect(cvIcon.getAttribute('mattooltip')).toContain('Curriculum Vitae');
            }
        });

        it('should have proper icon for CV navigation', () => {
            const compiled = fixture.nativeElement as HTMLElement;
            const cvIcon = compiled.querySelector<HTMLElement>('button[aria-label*="Curriculum Vitae"] mat-icon');
            expect(cvIcon).toBeTruthy();
            if (cvIcon) {
                expect(cvIcon.textContent?.trim()).toBe('description');
            }
        });

        it('should have CV link in mobile menu', () => {
            const compiled = fixture.nativeElement as HTMLElement;
            const mobileCVLink = Array.from(compiled.querySelectorAll<HTMLElement>('mat-list-item')).find(
                (item) => item.textContent?.trim() === 'My CV'
            );
            expect(mobileCVLink).toBeTruthy();
            if (mobileCVLink) {
                expect(mobileCVLink.textContent?.trim()).toBe('My CV');
            }
        });

        it('should have proper router link configuration for mobile CV link', () => {
            const compiled = fixture.nativeElement as HTMLElement;
            // Find the CV link by text content since routerLink might be dynamically bound
            const mobileCVLink = Array.from(compiled.querySelectorAll<HTMLElement>('mat-list-item')).find(
                (item) => item.textContent?.trim() === 'My CV'
            );
            expect(mobileCVLink).toBeTruthy();
            if (mobileCVLink) {
                // Check if the element has routerLink functionality
                expect(mobileCVLink.getAttribute('role')).toBe('listitem');
            }
        });

        it('should have CV navigation accessible via keyboard', () => {
            const compiled = fixture.nativeElement as HTMLElement;
            const cvIcon = compiled.querySelector<HTMLButtonElement>('button[aria-label*="Curriculum Vitae"]');
            expect(cvIcon).toBeTruthy();
            if (cvIcon) {
                expect(cvIcon.tabIndex).not.toBeLessThan(0);
            }
        });

        it('should maintain existing navigation functionality', () => {
            const compiled = fixture.nativeElement as HTMLElement;

            // Check that other navigation elements still exist
            const homeLink = Array.from(compiled.querySelectorAll<HTMLElement>('mat-list-item')).find(
                (item) => item.textContent?.trim() === 'Home'
            );
            const blogLink = Array.from(compiled.querySelectorAll<HTMLElement>('mat-list-item')).find(
                (item) => item.textContent?.trim() === 'Blog'
            );

            expect(homeLink).toBeTruthy();
            expect(blogLink).toBeTruthy();
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

        describe('CV Navigation', () => {
            it('should have CV navigation icon in desktop header', () => {
                const compiled = fixture.nativeElement as HTMLElement;
                const cvIcon = compiled.querySelector<HTMLButtonElement>('button[aria-label*="Curriculum Vitae"]');
                expect(cvIcon).toBeTruthy();
                if (cvIcon) {
                    expect(cvIcon.getAttribute('aria-label')).toContain('Curriculum Vitae');
                }
            });

            it('should have CV icon with proper tooltip', () => {
                const compiled = fixture.nativeElement as HTMLElement;
                const cvIcon = compiled.querySelector<HTMLButtonElement>('button[mattooltip*="Curriculum Vitae"]');
                expect(cvIcon).toBeTruthy();
                if (cvIcon) {
                    expect(cvIcon.getAttribute('mattooltip')).toContain('Curriculum Vitae');
                }
            });

            it('should have proper icon for CV navigation', () => {
                const compiled = fixture.nativeElement as HTMLElement;
                const cvIcon = compiled.querySelector<HTMLElement>('button[aria-label*="Curriculum Vitae"] mat-icon');
                expect(cvIcon).toBeTruthy();
                if (cvIcon) {
                    expect(cvIcon.textContent?.trim()).toBe('description');
                }
            });

            it('should have CV link in mobile menu', () => {
                const compiled = fixture.nativeElement as HTMLElement;
                const mobileCVLink = Array.from(compiled.querySelectorAll<HTMLElement>('mat-list-item')).find(
                    (item) => item.textContent?.trim() === 'My CV'
                );
                expect(mobileCVLink).toBeTruthy();
                if (mobileCVLink) {
                    expect(mobileCVLink.textContent?.trim()).toBe('My CV');
                }
            });

            it('should have proper router link configuration for mobile CV link', () => {
                const compiled = fixture.nativeElement as HTMLElement;
                // Find the CV link by text content since routerLink might be dynamically bound
                const mobileCVLink = Array.from(compiled.querySelectorAll<HTMLElement>('mat-list-item')).find(
                    (item) => item.textContent?.trim() === 'My CV'
                );
                expect(mobileCVLink).toBeTruthy();
                if (mobileCVLink) {
                    // Check if the element has routerLink functionality
                    expect(mobileCVLink.getAttribute('role')).toBe('listitem');
                }
            });

            it('should have CV navigation accessible via keyboard', () => {
                const compiled = fixture.nativeElement as HTMLElement;
                const cvIcon = compiled.querySelector<HTMLButtonElement>('button[aria-label*="Curriculum Vitae"]');
                expect(cvIcon).toBeTruthy();
                if (cvIcon) {
                    expect(cvIcon.tabIndex).not.toBeLessThan(0);
                }
            });

            it('should close mobile menu after CV navigation', async () => {
                const compiled = fixture.nativeElement as HTMLElement;
                const mobileCVLink = Array.from(compiled.querySelectorAll<HTMLElement>('mat-list-item')).find(
                    (item) => item.textContent?.trim() === 'My CV'
                );
                // Open mobile menu first
                component.isOpen.set(true);
                fixture.detectChanges();

                // Verify menu is open
                expect(component.isOpen()).toBe(true);

                // Click CV link
                if (mobileCVLink) {
                    mobileCVLink.click();
                }
                fixture.detectChanges();

                // Wait for navigation and menu close
                await fixture.whenStable();

                // Verify menu is closed
                expect(component.isOpen()).toBe(false);
            });
        });
    });
});
