import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { CvComponent } from '@/app/components/cv/cv.component';
import { ICVContact, ICVExperience, ICVEducation, ICVSkill } from '@/app/models/cv-data-types';

describe('CvComponent', () => {
    let component: CvComponent;
    let fixture: ComponentFixture<CvComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatCardModule, MatListModule],
            declarations: [CvComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(CvComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display contact information', () => {
        const contact: ICVContact = component.contact;
        expect(contact.name).toBeDefined();
        expect(contact.title).toBeDefined();
        expect(contact.location).toBeDefined();
        expect(contact.email).toBeDefined();
        expect(contact.linkedIn).toBeDefined();
        expect(contact.linkedInText).toBeDefined();
        expect(contact.headHunter).toBeDefined();
        expect(contact.headHunterText).toBeDefined();
    });

    it('should display professional summary', () => {
        const summary = component.summary;
        expect(summary).toBeDefined();
        expect(typeof summary).toBe('string');
        expect(summary.length).toBeGreaterThan(0);
    });

    it('should display work experience entries', () => {
        const experience: ICVExperience[] = component.experience;
        expect(experience).toBeDefined();
        expect(Array.isArray(experience)).toBe(true);
        expect(experience.length).toBeGreaterThan(0);
        
        // Check first experience entry structure
        const firstExperience = experience[0];
        expect(firstExperience.company).toBeDefined();
        expect(firstExperience.position).toBeDefined();
        expect(firstExperience.duration).toBeDefined();
        expect(firstExperience.location).toBeDefined();
        expect(firstExperience.description).toBeDefined();
        expect(Array.isArray(firstExperience.description)).toBe(true);
    });

    it('should display education entries', () => {
        const education: ICVEducation[] = component.education;
        expect(education).toBeDefined();
        expect(Array.isArray(education)).toBe(true);
        expect(education.length).toBeGreaterThan(0);
        
        // Check first education entry structure
        const firstEducation = education[0];
        expect(firstEducation.institution).toBeDefined();
        expect(firstEducation.degree).toBeDefined();
        expect(firstEducation.duration).toBeDefined();
    });

    it('should display skills categories', () => {
        const skills: ICVSkill[] = component.skills;
        expect(skills).toBeDefined();
        expect(Array.isArray(skills)).toBe(true);
        expect(skills.length).toBeGreaterThan(0);
        
        // Check first skills category structure
        const firstSkillCategory = skills[0];
        expect(firstSkillCategory.category).toBeDefined();
        expect(firstSkillCategory.skills).toBeDefined();
        expect(Array.isArray(firstSkillCategory.skills)).toBe(true);
    });

    it('should have proper semantic HTML structure', () => {
        const compiled = fixture.nativeElement;
        const cvRegion = compiled.querySelector('[role="region"][aria-label="Curriculum Vitae"]');
        expect(cvRegion).toBeTruthy();
        
        const cvTitle = compiled.querySelector('#cv-title');
        expect(cvTitle).toBeTruthy();
        expect(cvTitle.textContent).toContain('Curriculum Vitae');
    });

    it('should be accessible with proper ARIA labels', () => {
        const compiled = fixture.nativeElement;
        const cvContent = compiled.querySelector('[aria-labelledby="cv-title"]');
        expect(cvContent).toBeTruthy();
    });
});
