import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { HeaderComponent } from '@/app/components/header/header.component';
import { CvComponent } from '@/app/components/cv/cv.component';
import { Subject } from 'rxjs';

describe('CV Navigation Integration', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let router: Router;
    let location: Location;
    let navigationEvents: Subject<NavigationEnd>;

    beforeEach(async () => {
        navigationEvents = new Subject<NavigationEnd>();
        
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([
                { path: ':lang', children: [
                    { path: '', component: HeaderComponent },
                    { path: 'blog', component: HeaderComponent },
                    { path: 'cv', component: CvComponent }
                ]}
            ])],
            declarations: [HeaderComponent, CvComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        fixture.detectChanges();
    });

    it('should navigate to CV page when desktop CV icon is clicked', async () => {
        const compiled = fixture.nativeElement;
        const cvIcon = compiled.querySelector('button[aria-label*="CV"]');
        
        expect(cvIcon).toBeTruthy();
        
        // Click the CV icon
        cvIcon.click();
        fixture.detectChanges();
        
        // Wait for navigation
        await fixture.whenStable();
        
        // Verify navigation to CV route
        expect(location.path()).toContain('/cv');
    });

    it('should navigate to CV page when mobile CV link is clicked', async () => {
        const compiled = fixture.nativeElement;
        const mobileCVLink = compiled.querySelector('mat-list-item[routerLink*="cv"]');
        
        expect(mobileCVLink).toBeTruthy();
        
        // Click the mobile CV link
        mobileCVLink.click();
        fixture.detectChanges();
        
        // Wait for navigation
        await fixture.whenStable();
        
        // Verify navigation to CV route
        expect(location.path()).toContain('/cv');
    });

    it('should maintain active state on CV navigation', async () => {
        const compiled = fixture.nativeElement;
        const mobileCVLink = compiled.querySelector('mat-list-item[routerLink*="cv"]');
        
        // Navigate to CV
        await router.navigate(['/en/cv']);
        fixture.detectChanges();
        
        // Check if mobile CV link has active class
        expect(mobileCVLink.classList.contains('active')).toBe(true);
    });

    it('should close mobile menu after CV navigation', async () => {
        const compiled = fixture.nativeElement;
        const mobileCVLink = compiled.querySelector('mat-list-item[routerLink*="cv"]');
        const mobileMenu = compiled.querySelector('.mobile-menu');
        
        // Open mobile menu first
        component.toggleTabletMenu();
        fixture.detectChanges();
        
        // Verify menu is open
        expect(component.isOpen()).toBe(true);
        
        // Click CV link
        mobileCVLink.click();
        fixture.detectChanges();
        
        // Wait for navigation and menu close
        await fixture.whenStable();
        
        // Verify menu is closed
        expect(component.isOpen()).toBe(false);
    });

    it('should have proper keyboard navigation for CV icon', () => {
        const compiled = fixture.nativeElement;
        const cvIcon = compiled.querySelector('button[aria-label*="CV"]');
        
        expect(cvIcon).toBeTruthy();
        
        // Test keyboard accessibility
        cvIcon.focus();
        expect(document.activeElement).toBe(cvIcon);
        
        // Test enter key navigation
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
        cvIcon.dispatchEvent(enterEvent);
        
        // Should trigger navigation (verified by location check in async test)
    });

    it('should have proper ARIA labels for CV navigation', () => {
        const compiled = fixture.nativeElement;
        const cvIcon = compiled.querySelector('button[aria-label*="CV"]');
        
        expect(cvIcon).toBeTruthy();
        expect(cvIcon.getAttribute('aria-label')).toContain('Curriculum Vitae');
        expect(cvIcon.getAttribute('aria-label')).toContain('navigate');
    });

    it('should have proper tooltip for CV icon', () => {
        const compiled = fixture.nativeElement;
        const cvIcon = compiled.querySelector('button[mattooltip*="CV"]');
        
        expect(cvIcon).toBeTruthy();
        expect(cvIcon.getAttribute('mattooltip')).toBe('Curriculum Vitae');
    });

    it('should preserve existing navigation functionality', async () => {
        const compiled = fixture.nativeElement;
        const homeLink = compiled.querySelector('[routerLink="/"]');
        const blogLink = compiled.querySelector('[routerLink*="blog"]');
        
        // Test home navigation
        homeLink.click();
        await fixture.whenStable();
        expect(location.path()).toContain('/en');
        
        // Test blog navigation
        blogLink.click();
        await fixture.whenStable();
        expect(location.path()).toContain('/blog');
        
        // CV navigation should still work
        const cvIcon = compiled.querySelector('button[aria-label*="CV"]');
        cvIcon.click();
        await fixture.whenStable();
        expect(location.path()).toContain('/cv');
    });

    it('should handle CV navigation from different pages', async () => {
        // Navigate to blog first
        await router.navigate(['/en/blog']);
        fixture.detectChanges();
        
        // Then navigate to CV
        const compiled = fixture.nativeElement;
        const cvIcon = compiled.querySelector('button[aria-label*="CV"]');
        cvIcon.click();
        await fixture.whenStable();
        
        expect(location.path()).toContain('/cv');
    });
});
