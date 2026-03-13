import { CvComponent } from '@/app/components/cv/cv.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

describe('CvComponent', () => {
    let component: CvComponent;
    let fixture: ComponentFixture<CvComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatCardModule, MatListModule, CvComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(CvComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have contact information', () => {
        expect(component.contact).toBeDefined();
        expect(component.contact.name).toBeTruthy();
        expect(component.contact.email).toBeTruthy();
    });

    it('should have professional summary', () => {
        expect(component.summary).toBeDefined();
        expect(typeof component.summary).toBe('object');
        expect(Array.isArray(component.summary)).toBe(true);
    });

    it('should have experience entries', () => {
        expect(component.experience).toBeDefined();
        expect(Array.isArray(component.experience)).toBe(true);
        expect(component.experience.length).toBeGreaterThan(0);
    });

    it('should have education entries', () => {
        expect(component.education).toBeDefined();
        expect(Array.isArray(component.education)).toBe(true);
    });

    it('should have skills', () => {
        expect(component.skills).toBeDefined();
        expect(component.skillCategories).toBeDefined();
        expect(Array.isArray(component.skillCategories)).toBe(true);
    });

    it('should have display location', () => {
        expect(component.displayLocation).toBeDefined();
        expect(typeof component.displayLocation).toBe('string');
    });
});
