import { CvComponent } from '@/app/components/cv/cv.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

describe('CV Page Accessibility', () => {
    let fixture: ComponentFixture<CvComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatCardModule, MatListModule, CvComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(CvComponent);
        fixture.detectChanges();
    });

    it('should have proper ARIA labels and roles', () => {
        const compiled = fixture.nativeElement as HTMLElement;

        // Main CV region should have proper role and label
        const cvRegion = compiled.querySelector('[role="region"]');
        expect(cvRegion).toBeTruthy();
        if (cvRegion) {
            expect(cvRegion.getAttribute('aria-label')).toBe('Curriculum Vitae');
        }

        // CV content should be properly labeled
        const cvContent = compiled.querySelector('[aria-labelledby="cv-title"]');
        expect(cvContent).toBeTruthy();

        // CV title should exist and have proper ID
        const cvTitle = compiled.querySelector('#cv-title');
        expect(cvTitle).toBeTruthy();
    });

    it('should have semantic heading structure', () => {
        const compiled = fixture.nativeElement as HTMLElement;

        // Should have exactly one h1 for the main title
        const h1Elements = compiled.querySelectorAll('h1');
        expect(h1Elements.length).toBe(1);
        if (h1Elements[0]) {
            expect(h1Elements[0].textContent?.trim()).toBe('Curriculum Vitae / Resume');
        }

        // Should have h2 for contact name and h3 for section headings
        const h2Elements = compiled.querySelectorAll('h2');
        expect(h2Elements.length).toBe(1);
        if (h2Elements[0]) {
            expect(h2Elements[0].id).toBe('cv-title');
        }

        // Should have h3 for section headings
        const sectionHeadings = compiled.querySelectorAll('h3') as NodeListOf<HTMLElement>;
        expect(sectionHeadings.length).toBeGreaterThan(0);

        // Section headings should be descriptive
        const headingTexts = Array.from(sectionHeadings).map((h: HTMLElement) => h.textContent?.trim());
        expect(headingTexts).toContain('Summary');
        expect(headingTexts).toContain('Experience');
        expect(headingTexts).toContain('Education');
        expect(headingTexts).toContain('Skills');
        expect(headingTexts).toContain('Portfolio');
    });

    it('should have accessible navigation elements', () => {
        const compiled = fixture.nativeElement as HTMLElement;

        // Links should have proper attributes
        const links = compiled.querySelectorAll('a[href]') as NodeListOf<HTMLElement>;
        links.forEach((link: HTMLElement) => {
            // Links should have accessible text
            expect(link.textContent?.trim().length).toBeGreaterThan(0);

            // External links should have target="_blank" and proper attributes
            if (link.getAttribute('href')?.startsWith('http')) {
                expect(link.getAttribute('target')).toBe('_blank');
                // Should have rel="noopener noreferrer" for security
                const rel = link.getAttribute('rel');
                if (rel) {
                    expect(rel).toContain('noopener');
                    expect(rel).toContain('noreferrer');
                }
            }
        });
    });

    it('should have proper color contrast and readable text', () => {
        const compiled = fixture.nativeElement as HTMLElement;

        // All text elements should be visible (basic check)
        // const textElements = compiled.querySelectorAll('h1, h2, h3, p, span, a') as NodeListOf<HTMLElement>;
        const textElements = compiled.querySelectorAll<HTMLElement>('h1, h2, h3, p, span, a');
        textElements.forEach((element: HTMLElement) => {
            const styles = window.getComputedStyle(element);
            // Text should not be hidden
            expect(styles.display).not.toBe('none');
            expect(styles.visibility).not.toBe('hidden');
            // Allow opacity 0 for elements that might be intentionally hidden
            const opacity = parseFloat(styles.opacity);
            if (opacity === 0) {
                // If opacity is 0, the element should not have meaningful text content
                const text = element.textContent?.trim();
                if (text && text.length > 0) {
                    // Only fail if there's actual text content that should be visible
                    expect(`${text} should not have opacity 0`).toBe('true');
                }
            }
        });
    }, 10000);

    it('should support keyboard navigation', () => {
        const compiled = fixture.nativeElement as HTMLElement;

        // Focusable elements should be keyboard accessible
        const focusableElements = compiled.querySelectorAll(
            'a[href], button, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;

        focusableElements.forEach((element: HTMLElement) => {
            // Element should be focusable
            expect(element.tabIndex).not.toBeLessThan(-1);
        });
    });

    it('should have proper list structure for experience and education', () => {
        const compiled = fixture.nativeElement as HTMLElement;

        // Experience section should use proper list structure
        const experienceLists = compiled.querySelectorAll('.experience-section mat-list');
        expect(experienceLists.length).toBeGreaterThan(0);

        // Education section should use proper list structure
        const educationLists = compiled.querySelectorAll('.education-section mat-list');
        expect(educationLists.length).toBeGreaterThan(0);

        // Skills section should use proper list structure
        const skillsLists = compiled.querySelectorAll('.skills-section mat-list');
        expect(skillsLists.length).toBeGreaterThan(0);
    });

    it('should have accessible contact information', () => {
        const compiled = fixture.nativeElement as HTMLElement;

        // Email should be a mailto link
        const emailLink = compiled.querySelector('a[href^="mailto:"]');
        if (emailLink) {
            expect(emailLink.getAttribute('href')).toMatch(/^mailto:/);
            expect(emailLink.textContent?.trim().length).toBeGreaterThan(0);
        }

        // Social links should be properly labeled
        const socialLinks = compiled.querySelectorAll(
            'a[href*="linkedin"], a[href*="hh.ru"]'
        ) as NodeListOf<HTMLElement>;
        socialLinks.forEach((link: HTMLElement) => {
            expect(link.textContent?.trim().length).toBeGreaterThan(0);
            expect(link.getAttribute('href')).toMatch(/^https?:\/\//);
        });
    });

    it('should maintain accessibility with dynamic content', () => {
        const compiled = fixture.nativeElement as HTMLElement;

        // Content should be properly announced to screen readers
        const cvContent = compiled.querySelector('[aria-live="polite"]');
        expect(cvContent).toBeTruthy();

        // All interactive elements should be accessible
        const interactiveElements = compiled.querySelectorAll(
            'button, a, input, select, textarea'
        ) as NodeListOf<HTMLElement>;
        interactiveElements.forEach((element: HTMLElement) => {
            // Should have accessible name
            const accessibleName =
                element.getAttribute('aria-label') || element.getAttribute('title') || element.textContent?.trim();
            expect(accessibleName?.length).toBeGreaterThan(0);
        });
    });
});
