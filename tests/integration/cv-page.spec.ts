import { CvComponent } from '@/app/components/cv/cv.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';

describe('CV Page Integration', () => {
    let fixture: ComponentFixture<CvComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatCardModule, MatListModule, CvComponent],
            providers: [{ provide: Router, useValue: {} }]
        }).compileComponents();

        fixture = TestBed.createComponent(CvComponent);
        fixture.detectChanges();
    });

    it('should render CV page with proper structure', () => {
        const compiled = fixture.nativeElement as HTMLElement;

        // Check main CV container
        const cvCard = compiled.querySelector('mat-card.cv') as HTMLElement | null;
        expect(cvCard).toBeTruthy();
        expect(cvCard?.getAttribute('role')).toBe('region');
        expect(cvCard?.getAttribute('aria-label')).toBe('Curriculum Vitae');

        // Check card content area
        const cardContent = compiled.querySelector('mat-card-content') as HTMLElement | null;
        expect(cardContent).toBeTruthy();
        expect(cardContent?.getAttribute('aria-labelledby')).toBe('cv-title');
        expect(cardContent?.getAttribute('aria-live')).toBe('polite');

        // Check contact section
        const contactSection = compiled.querySelector('section.contact-section') as HTMLElement | null;
        expect(contactSection).toBeTruthy();

        // Check CV title (which is the person's name)
        const cvTitle = compiled.querySelector('#cv-title') as HTMLElement | null;
        expect(cvTitle).toBeTruthy();
        expect(cvTitle?.textContent).toContain('Igor Kulebyakin'); // Actual name from JSON
        expect(cvTitle?.tagName).toBe('H2'); // It's an h2, not h1

        // Check contact information
        const emailLink = compiled.querySelector('a[href^="mailto:"]') as HTMLElement | null;
        expect(emailLink).toBeTruthy();
        expect(emailLink?.textContent).toContain('igokul777@gmail.com');

        const linkedinLink = compiled.querySelector('a[href*="linkedin"]') as HTMLElement | null;
        expect(linkedinLink).toBeTruthy();
    });

    it('should display contact information section', () => {
        const compiled = fixture.nativeElement as HTMLElement;

        // Contact section should be present
        const contactSection = compiled.querySelector('.contact-section') as HTMLElement | null;
        expect(contactSection).toBeTruthy();

        // Contact details should be rendered
        const nameElement = contactSection?.querySelector('h2') as HTMLElement | null;
        expect(nameElement).toBeTruthy();

        const titleElement = contactSection?.querySelector('p') as HTMLElement | null;
        expect(titleElement).toBeTruthy();
    });

    it('should display professional summary section', () => {
        const compiled = fixture.nativeElement as HTMLElement;

        const summarySection = compiled.querySelector('.summary-section') as HTMLElement | null;
        expect(summarySection).toBeTruthy();

        const summaryTitle = summarySection?.querySelector('h3') as HTMLElement | null;
        expect(summaryTitle).toBeTruthy();
        expect(summaryTitle?.textContent).toContain('Summary');

        const summaryContent = summarySection?.querySelector('p') as HTMLElement | null;
        expect(summaryContent).toBeTruthy();
    });

    it('should display work experience section', () => {
        const compiled = fixture.nativeElement as HTMLElement;

        const experienceSection = compiled.querySelector('.experience-section') as HTMLElement | null;
        expect(experienceSection).toBeTruthy();

        const experienceTitle = experienceSection?.querySelector('h3') as HTMLElement | null;
        expect(experienceTitle).toBeTruthy();
        expect(experienceTitle?.textContent).toContain('Experience');

        // Should have experience list
        const experienceList = experienceSection?.querySelector('mat-list') as HTMLElement | null;
        expect(experienceList).toBeTruthy();
    });

    it('should display education section', () => {
        const compiled = fixture.nativeElement as HTMLElement;

        const educationSection = compiled.querySelector('.education-section') as HTMLElement | null;
        expect(educationSection).toBeTruthy();

        const educationTitle = educationSection?.querySelector('h3') as HTMLElement | null;
        expect(educationTitle).toBeTruthy();
        expect(educationTitle?.textContent).toContain('Education');

        // Should have education list
        const educationList = educationSection?.querySelector('mat-list') as HTMLElement | null;
        expect(educationList).toBeTruthy();
    });

    it('should display skills section', () => {
        const compiled = fixture.nativeElement as HTMLElement;

        const skillsSection = compiled.querySelector('.skills-section') as HTMLElement | null;
        expect(skillsSection).toBeTruthy();

        const skillsTitle = skillsSection?.querySelector('h3') as HTMLElement | null;
        expect(skillsTitle).toBeTruthy();
        expect(skillsTitle?.textContent).toContain('Skills');

        // Should have skills list
        const skillsList = skillsSection?.querySelector('mat-list') as HTMLElement | null;
        expect(skillsList).toBeTruthy();
    });

    it('should have proper semantic HTML structure', () => {
        const compiled = fixture.nativeElement as HTMLElement;

        // Main title should be h2 with cv-title id
        const mainTitle = compiled.querySelector('h2#cv-title') as HTMLElement | null;
        expect(mainTitle).toBeTruthy();
        expect(mainTitle?.id).toBe('cv-title');

        // Section titles should be h2 or h3
        const sectionTitles = compiled.querySelectorAll('h2, h3') as NodeListOf<Element>;
        expect(sectionTitles.length).toBeGreaterThan(0);

        // Should have proper landmark elements
        const mainRegion = compiled.querySelector('[role="region"]') as HTMLElement | null;
        expect(mainRegion).toBeTruthy();

        // Should have proper content sections
        const sections = compiled.querySelectorAll('section') as NodeListOf<Element>;
        expect(sections.length).toBeGreaterThan(0);
    });

    it('should have accessible navigation elements', () => {
        const compiled = fixture.nativeElement as HTMLElement;

        // Check for proper ARIA labels
        const cvRegion = compiled.querySelector('[role="region"]') as HTMLElement | null;
        expect(cvRegion).toBeTruthy();
        expect(cvRegion?.getAttribute('aria-label')).toBe('Curriculum Vitae');

        // Check for proper ARIA relationships
        const cvContent = compiled.querySelector('[aria-labelledby="cv-title"]') as HTMLElement | null;
        expect(cvContent).toBeTruthy();
    });
});
