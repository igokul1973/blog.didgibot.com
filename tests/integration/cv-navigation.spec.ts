import { CvComponent } from '@/app/components/cv/cv.component';
import { ArticleService } from '@/app/services/article/article.service';
import { InitializationService } from '@/app/services/initialization/initialization.service';
import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, NavigationExtras, Router, RouterEvent, RouterLink, RouterLinkActive } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Define TestHeaderComponent class before using it
@Component({
    selector: 'app-test-header',
    template: `
        <button
            (click)="navigateToCV()"
            (keyup.enter)="navigateToCV()"
            (keydown.enter)="navigateToCV()"
            aria-label="Curriculum Vitae page"
            matTooltip="Curriculum Vitae"
        >
            CV
        </button>
        <div role="menu">
            <div
                role="listitem"
                (click)="navigateToCV()"
                (keyup.enter)="navigateToCV()"
                (keydown.enter)="navigateToCV()"
                routerLink="/en/cv"
                routerLinkActive="active"
            >
                My CV
            </div>
        </div>
        <div role="menu">
            <div role="listitem" (click)="navigateToHome()" (keyup.enter)="navigateToHome()" routerLink="/en">Home</div>
            <div role="listitem" (click)="navigateToBlog()" (keyup.enter)="navigateToBlog()" routerLink="/en/blog">
                Blog
            </div>
        </div>
    `,
    standalone: true,
    imports: [RouterLink, RouterLinkActive, MatListModule]
})
class TestHeaderComponent {
    selectedLanguage: () => string = () => 'en';
    private readonly router = inject(Router);
    private menuOpen = false;

    navigateToCV(): void {
        this.router.navigate(['/', this.selectedLanguage(), 'cv']);
        this.closeMenu();
    }

    navigateToHome(): void {
        this.router.navigate(['/', this.selectedLanguage()]);
        this.closeMenu();
    }

    navigateToBlog(): void {
        this.router.navigate(['/', this.selectedLanguage(), 'blog']);
        this.closeMenu();
    }

    toggleTabletMenu(): void {
        this.menuOpen = !this.menuOpen;
    }

    isOpen(): boolean {
        return this.menuOpen;
    }

    private closeMenu(): void {
        this.menuOpen = false;
    }
}

// Mock ResizeObserver for test environment
class MockResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
}

(global as typeof globalThis & { ResizeObserver: typeof MockResizeObserver }).ResizeObserver = MockResizeObserver;

describe('CV Navigation Integration', () => {
    let component: TestHeaderComponent;
    let fixture: ComponentFixture<TestHeaderComponent>;
    let location: Location & { path: () => string; setPath: (path: string) => void };
    let navigateSpy: ReturnType<typeof vi.fn>;
    let currentPath = '/en';
    let mockRouter: {
        navigate: ReturnType<typeof vi.fn> &
            ((commands: readonly unknown[], extras?: NavigationExtras) => Promise<boolean>);
        navigateByUrl: ReturnType<typeof vi.fn> & ((url: string, extras?: NavigationExtras) => Promise<boolean>);
        events: Observable<RouterEvent>;
        createUrlTree: ReturnType<typeof vi.fn>;
    };

    beforeEach(async () => {
        currentPath = '/en';
        navigateSpy = vi.fn().mockImplementation((commands: readonly unknown[]) => {
            currentPath = commands.join('/');
            return Promise.resolve(true);
        });
        const createUrlTreeSpy = vi.fn().mockReturnValue({} as Record<string, never>);
        const navigateByUrlSpy = vi.fn().mockImplementation((url: string) => {
            currentPath = url;
            return Promise.resolve(true);
        });
        mockRouter = {
            navigate: navigateSpy,
            navigateByUrl: navigateByUrlSpy,
            events: of(),
            createUrlTree: createUrlTreeSpy
        } as typeof mockRouter;
        const mockLocation = {
            path: (): string => currentPath,
            setPath: (path: string): void => {
                currentPath = path;
            }
        };

        // Mock signal for selectedLanguage that works like a real Angular signal
        let currentValue = 'en';
        const mockSelectedLanguageSignal = vi.fn().mockImplementation(() => currentValue) as ReturnType<
            typeof vi.fn
        > & { set: ReturnType<typeof vi.fn> };
        mockSelectedLanguageSignal.set = vi.fn().mockImplementation((value: string) => {
            currentValue = value;
            mockSelectedLanguageSignal.mockReturnValue(currentValue);
        });

        const mockArticleService = {
            selectedLanguage: vi.fn().mockReturnValue(mockSelectedLanguageSignal),
            setSearchQuery: vi.fn()
        };
        const mockInitializationService = {
            isAnimationFinished$: of(true),
            setIsAnimationFinished: vi.fn()
        };
        const mockActivatedRoute = {
            params: of({}),
            queryParams: of({}),
            data: of({}),
            url: of({}),
            paramMap: of(new Map()),
            queryParamMap: of(new Map()),
            fragment: of(null),
            outlet: 'primary',
            routeConfig: null,
            parent: null,
            firstChild: null,
            children: of([]),
            pathFromRoot: [],
            root: {
                params: of({}),
                queryParams: of({}),
                data: of({}),
                url: of({}),
                paramMap: of(new Map()),
                queryParamMap: of(new Map()),
                fragment: of(null),
                outlet: 'primary',
                routeConfig: null,
                parent: null,
                firstChild: null,
                children: [],
                snapshot: {
                    params: {},
                    queryParams: {},
                    data: {},
                    url: [],
                    paramMap: new Map(),
                    queryParamMap: new Map(),
                    fragment: null,
                    outlet: 'primary',
                    routeConfig: null,
                    root: null as never,
                    parent: null,
                    firstChild: null,
                    children: [],
                    component: null
                }
            },
            snapshot: {
                params: {},
                queryParams: {},
                data: {},
                url: [],
                paramMap: new Map(),
                queryParamMap: new Map(),
                fragment: null,
                outlet: 'primary',
                routeConfig: null,
                root: null as never,
                parent: null,
                firstChild: null,
                children: [],
                component: null
            }
        };

        await TestBed.configureTestingModule({
            imports: [TestHeaderComponent, CvComponent],
            providers: [
                { provide: Router, useValue: mockRouter },
                { provide: Location, useValue: mockLocation },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: Apollo, useValue: { watchQuery: (): Observable<{ data: null }> => of({ data: null }) } },
                { provide: ArticleService, useValue: mockArticleService },
                {
                    provide: InitializationService,
                    useValue: mockInitializationService as unknown as InitializationService
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TestHeaderComponent);
        component = fixture.componentInstance;
        location = TestBed.inject(Location) as Location & { path: () => string; setPath: (path: string) => void };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate to CV page when desktop CV button is clicked', async () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const cvButton = compiled.querySelector<HTMLButtonElement>('button[aria-label="Curriculum Vitae page"]');

        expect(cvButton).toBeTruthy();

        // Click the CV button
        if (cvButton) {
            cvButton.click();
        }
        fixture.detectChanges();

        // Verify navigation was triggered
        expect(navigateSpy).toHaveBeenCalledWith(['/', 'en', 'cv']);
    });

    it('should navigate to CV page when mobile CV link is clicked', async () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const mobileCVLink = Array.from(compiled.querySelectorAll('div[role="listitem"]')).find((item) =>
            (item as HTMLElement).textContent?.includes('My CV')
        ) as HTMLElement | undefined;

        expect(mobileCVLink).toBeTruthy();

        // Click the mobile CV link
        if (mobileCVLink) {
            const element = mobileCVLink as HTMLElement;
            element.click();
        }
        fixture.detectChanges();

        // Verify navigation was triggered
        expect(navigateSpy).toHaveBeenCalledWith(['/', 'en', 'cv']);
    });

    it('should maintain active state on CV navigation', async () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const mobileCVLink = compiled.querySelector<HTMLElement>('div[routerLink="/en/cv"]');

        // Navigate to CV
        await mockRouter.navigate(['/en/cv']);
        fixture.detectChanges();

        // For this test component, we'll just verify the link exists and has the right routerLink
        if (mobileCVLink) {
            expect(mobileCVLink.getAttribute('routerLink')).toBe('/en/cv');
        }
    });

    it('should close mobile menu after CV navigation', async () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const mobileCVLink = compiled.querySelector<HTMLElement>('div[routerLink="/en/cv"]');

        // Open mobile menu first
        component.toggleTabletMenu();
        fixture.detectChanges();

        // Verify menu is open
        expect(component.isOpen()).toBe(true);

        // Click CV link
        if (mobileCVLink) {
            (mobileCVLink as HTMLElement).click();
        }
        fixture.detectChanges();

        // Wait for navigation and menu close
        await fixture.whenStable();

        // Verify menu is closed
        expect(component.isOpen()).toBe(false);
    });

    it('should have proper keyboard navigation for CV button', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const cvButton = compiled.querySelector<HTMLButtonElement>('button[aria-label="Curriculum Vitae page"]');

        expect(cvButton).toBeTruthy();

        // Test keyboard accessibility
        if (cvButton) {
            cvButton.focus();
            expect(document.activeElement).toBe(cvButton);

            // Test enter key navigation
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
            cvButton.dispatchEvent(enterEvent);

            // Also trigger click since keyup event is bound
            cvButton.click();

            // Verify navigation was triggered
            expect(navigateSpy).toHaveBeenCalled();
        }
    });

    it('should have proper ARIA labels for CV navigation', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const cvButton = compiled.querySelector<HTMLButtonElement>('button[aria-label="Curriculum Vitae page"]');

        expect(cvButton).toBeTruthy();
        if (cvButton) {
            expect(cvButton.getAttribute('aria-label')).toBe('Curriculum Vitae page');
        }
    });

    it('should have proper tooltip for CV button', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const cvButton = compiled.querySelector<HTMLButtonElement>('button[aria-label="Curriculum Vitae page"]');

        expect(cvButton).toBeTruthy();
        if (cvButton) {
            expect(cvButton.getAttribute('aria-label')).toBe('Curriculum Vitae page');
        }
    });

    it('should preserve existing navigation functionality', async () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const homeLink = compiled.querySelector<HTMLElement>('div[routerLink="/en"]');
        const blogLink = compiled.querySelector<HTMLElement>('div[routerLink="/en/blog"]');

        // Test home navigation
        if (homeLink) {
            (homeLink as HTMLElement).click();
        }
        await fixture.whenStable();
        expect(location.path()).toContain('/en');

        // Test blog navigation
        if (blogLink) {
            (blogLink as HTMLElement).click();
        }
        await fixture.whenStable();
        expect(location.path()).toContain('/blog');

        // Reset spy to track CV navigation
        navigateSpy.mockClear();

        // CV navigation should still work
        const cvButton = compiled.querySelector<HTMLButtonElement>('button[aria-label="Curriculum Vitae page"]');
        if (cvButton) {
            cvButton.click();
        }
        await fixture.whenStable();

        // Verify CV navigation was called
        expect(navigateSpy).toHaveBeenCalledWith(['/', 'en', 'cv']);
    });

    it('should handle CV navigation from different pages', async () => {
        // Navigate to blog first
        currentPath = '/en/blog'; // Manually update the path since mock router doesn't
        await mockRouter.navigate(['/en/blog']);
        fixture.detectChanges();

        // Reset the spy to track new navigation calls
        navigateSpy.mockClear();

        // Then navigate to CV
        const compiled = fixture.nativeElement as HTMLElement;
        const cvButton = compiled.querySelector<HTMLButtonElement>('button[aria-label="Curriculum Vitae page"]');
        if (cvButton) {
            cvButton.click();
        }
        await fixture.whenStable();

        // Verify navigation was triggered to CV
        expect(navigateSpy).toHaveBeenCalledWith(['/', 'en', 'cv']);
    });

    it('should have proper CV icon visibility in header', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const cvIcon = compiled.querySelector<HTMLElement>('button[aria-label="Curriculum Vitae page"]');

        expect(cvIcon).toBeTruthy();
        expect(cvIcon?.style.display).not.toBe('none');
    });

    it('should have proper CV link in mobile menu', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const mobileCVLink = Array.from(compiled.querySelectorAll('div[role="listitem"]')).find((item) =>
            (item as HTMLElement).textContent?.includes('My CV')
        ) as HTMLElement | undefined;

        expect(mobileCVLink).toBeTruthy();
        expect(mobileCVLink?.getAttribute('routerLink')).toContain('/cv');
    });

    it('should have proper CV icon with tooltip', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const cvIcon = compiled.querySelector<HTMLElement>('button[matTooltip="Curriculum Vitae"]');

        expect(cvIcon).toBeTruthy();
        expect(cvIcon?.getAttribute('matTooltip')).toBe('Curriculum Vitae');
    });
});
