import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TooltipContentComponent } from './tooltip-content.component';

describe('TooltipContentComponent', () => {
    let component: TooltipContentComponent;
    let fixture: ComponentFixture<TooltipContentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TooltipContentComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TooltipContentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('renders default title and definition when inputs are not provided', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const titleEl = compiled.querySelector('.annotation-tooltip--title') as HTMLElement;
        const defEl = compiled.querySelector('.annotation-tooltip--definition') as HTMLElement;

        expect(titleEl.textContent?.trim()).toBe('Generic title');
        expect(defEl.textContent?.trim()).toBe('Generic definition');
    });

    it('renders provided title and definition inputs', () => {
        component.title = 'Custom title';
        component.definition = 'Custom definition';
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const titleEl = compiled.querySelector('.annotation-tooltip--title') as HTMLElement;
        const defEl = compiled.querySelector('.annotation-tooltip--definition') as HTMLElement;

        expect(titleEl.textContent?.trim()).toBe('Custom title');
        expect(defEl.textContent?.trim()).toBe('Custom definition');
    });
});
