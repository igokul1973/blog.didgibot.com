import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrollToTopComponent } from './scroll-to-top.component';

describe('ScrollToTopComponent', () => {
    let component: ScrollToTopComponent;
    let fixture: ComponentFixture<ScrollToTopComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ScrollToTopComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ScrollToTopComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should register scroll listener on ngAfterViewInit', () => {
        const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

        component.ngAfterViewInit();

        expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('should set showButton to false when scroll position is below or equal to threshold', () => {
        (window as Window & { scrollY: number }).scrollY = 100;

        component.checkScrollPosition();

        const instance = component as unknown as { showButton: boolean };
        expect(instance.showButton).toBe(false);
    });

    it('should set showButton to true when scroll position is above threshold', () => {
        (window as Window & { scrollY: number }).scrollY = 250;

        component.checkScrollPosition();

        const instance = component as unknown as { showButton: boolean };
        expect(instance.showButton).toBe(true);
    });

    it('scrollToTop should call window.scrollTo with top 0 and smooth behavior', () => {
        const scrollToSpy = vi.spyOn(window, 'scrollTo');

        component.scrollToTop();

        expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });
});
