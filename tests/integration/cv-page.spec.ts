import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { By } from '@angular/platform-browser';
import { CvComponent } from '@/app/components/cv/cv.component';

describe('CV Page Integration', () => {
    let component: CvComponent;
    let fixture: ComponentFixture<CvComponent>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([
                    { path: 'cv', component: CvComponent }
                ]),
                MatCardModule,
                MatListModule
            ],
            declarations: [CvComponent]
        }).compileComponents();

        router = TestBed.inject(Router);
        fixture = TestBed.createComponent(CvComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should render CV page with proper structure', () => {
        const compiled = fixture.nativeElement;
        
        // Check main CV container
        const cvCard = compiled.querySelector('mat-card.cv');
        expect(cvCard).toBeTruthy();
        expect(cvCard.getAttribute('role')).toBe('region');
        expect(cvCard.getAttribute('aria-label')).toBe('Curriculum Vitae');
        
        // Check CV title
        const cvTitle = compiled.querySelector('#cv-title');
        expect(cvTitle).toBeTruthy();
        expect(cvTitle.textContent).toContain('Curriculum Vitae');
        
        // Check card content area
        const cardContent = compiled.querySelector('mat-card-content[aria-labelledby="cv-title"]');
        expect(cardContent).toBeTruthy();
    });

    it('should display contact information section', () => {
        const compiled = fixture.nativeElement;
        
        // Contact section should be present
        const contactSection = compiled.querySelector('.contact-section');
        expect(contactSection).toBeTruthy();
        
        // Contact details should be rendered
        const nameElement = contactSection.querySelector('h2');
        expect(nameElement).toBeTruthy();
        
        const titleElement = contactSection.querySelector('p');
        expect(titleElement).toBeTruthy();
    });

    it('should display professional summary section', () => {
        const compiled = fixture.nativeElement;
        
        const summarySection = compiled.querySelector('.summary-section');
        expect(summarySection).toBeTruthy();
        
        const summaryTitle = summarySection.querySelector('h3');
        expect(summaryTitle).toBeTruthy();
        expect(summaryTitle.textContent).toContain('Summary');
        
        const summaryContent = summarySection.querySelector('p');
        expect(summaryContent).toBeTruthy();
    });

    it('should display work experience section', () => {
        const compiled = fixture.nativeElement;
        
        const experienceSection = compiled.querySelector('.experience-section');
        expect(experienceSection).toBeTruthy();
        
        const experienceTitle = experienceSection.querySelector('h3');
        expect(experienceTitle).toBeTruthy();
        expect(experienceTitle.textContent).toContain('Experience');
        
        // Should have experience list
        const experienceList = experienceSection.querySelector('mat-list');
        expect(experienceList).toBeTruthy();
    });

    it('should display education section', () => {
        const compiled = fixture.nativeElement;
        
        const educationSection = compiled.querySelector('.education-section');
        expect(educationSection).toBeTruthy();
        
        const educationTitle = educationSection.querySelector('h3');
        expect(educationTitle).toBeTruthy();
        expect(educationTitle.textContent).toContain('Education');
        
        // Should have education list
        const educationList = educationSection.querySelector('mat-list');
        expect(educationList).toBeTruthy();
    });

    it('should display skills section', () => {
        const compiled = fixture.nativeElement;
        
        const skillsSection = compiled.querySelector('.skills-section');
        expect(skillsSection).toBeTruthy();
        
        const skillsTitle = skillsSection.querySelector('h3');
        expect(skillsTitle).toBeTruthy();
        expect(skillsTitle.textContent).toContain('Skills');
        
        // Should have skills list
        const skillsList = skillsSection.querySelector('mat-list');
        expect(skillsList).toBeTruthy();
    });

    it('should have proper semantic HTML structure', () => {
        const compiled = fixture.nativeElement;
        
        // Check for proper heading hierarchy
        const headings = compiled.querySelectorAll('h1, h2, h3');
        expect(headings.length).toBeGreaterThan(0);
        
        // Main title should be h1
        const mainTitle = compiled.querySelector('h1');
        expect(mainTitle).toBeTruthy();
        expect(mainTitle.id).toBe('cv-title');
        
        // Section titles should be h2 or h3
        const sectionTitles = compiled.querySelectorAll('h2, h3');
        expect(sectionTitles.length).toBeGreaterThan(0);
    });

    it('should have accessible navigation elements', () => {
        const compiled = fixture.nativeElement;
        
        // Check for proper ARIA labels
        const cvRegion = compiled.querySelector('[role="region"]');
        expect(cvRegion).toBeTruthy();
        expect(cvRegion.getAttribute('aria-label')).toBe('Curriculum Vitae');
        
        // Check for proper ARIA relationships
        const cvContent = compiled.querySelector('[aria-labelledby="cv-title"]');
        expect(cvContent).toBeTruthy();
    });
});
