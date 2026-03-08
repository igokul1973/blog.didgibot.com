import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HeaderComponent } from '@/app/components/header/header.component';

describe('HeaderComponent CV Navigation', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let router: Router;
    let location: Location;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([
                { path: ':lang/cv', component: HeaderComponent }
            ])],
            declarations: [HeaderComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have CV navigation icon in desktop header', () => {
        const compiled = fixture.nativeElement;
        const cvIcon = compiled.querySelector('button[aria-label*="CV"], button[mattooltip*="CV"]');
        expect(cvIcon).toBeTruthy();
        expect(cvIcon.getAttribute('aria-label')).toContain('CV');
    });

    it('should have CV icon with proper tooltip', () => {
        const compiled = fixture.nativeElement;
        const cvIcon = compiled.querySelector('button[mattooltip*="CV"]');
        expect(cvIcon).toBeTruthy();
        expect(cvIcon.getAttribute('mattooltip')).toContain('Curriculum Vitae');
    });

    it('should have proper icon for CV navigation', () => {
        const compiled = fixture.nativeElement;
        const cvIcon = compiled.querySelector('button[aria-label*="CV"] mat-icon');
        expect(cvIcon).toBeTruthy();
        expect(cvIcon.textContent?.trim()).toBe('description');
    });

    it('should navigate to CV route when CV icon is clicked', async () => {
        const compiled = fixture.nativeElement;
        const cvIcon = compiled.querySelector('button[aria-label*="CV"]');
        
        expect(cvIcon).toBeTruthy();
        
        cvIcon.click();
        fixture.detectChanges();
        
        // Wait for navigation
        await fixture.whenStable();
        
        // Verify navigation occurred
        expect(location.path()).toContain('/cv');
    });

    it('should have CV link in mobile menu', () => {
        const compiled = fixture.nativeElement;
        const mobileCVLink = compiled.querySelector('mat-list-item[routerLink*="cv"]');
        expect(mobileCVLink).toBeTruthy();
        expect(mobileCVLink.textContent?.trim()).toBe('My CV');
    });

    it('should have proper router link configuration for mobile CV link', () => {
        const compiled = fixture.nativeElement;
        const mobileCVLink = compiled.querySelector('mat-list-item[routerLink*="cv"]');
        expect(mobileCVLink).toBeTruthy();
        expect(mobileCVLink.getAttribute('routerlink')).toContain('/cv');
    });

    it('should have CV navigation accessible via keyboard', () => {
        const compiled = fixture.nativeElement;
        const cvIcon = compiled.querySelector('button[aria-label*="CV"]');
        
        expect(cvIcon).toBeTruthy();
        expect(cvIcon.tabIndex).not.toBeLessThan(0);
    });

    it('should maintain existing navigation functionality', () => {
        const compiled = fixture.nativeElement;
        
        // Check that other navigation elements still exist
        const homeLink = compiled.querySelector('[routerLink="/"]');
        const blogLink = compiled.querySelector('[routerLink*="blog"]');
        
        expect(homeLink).toBeTruthy();
        expect(blogLink).toBeTruthy();
    });
});
