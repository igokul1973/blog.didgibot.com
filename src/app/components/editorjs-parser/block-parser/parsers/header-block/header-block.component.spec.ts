import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderBlockComponent } from './header-block.component';

describe('HeaderComponent', () => {
    let component: HeaderBlockComponent;
    let fixture: ComponentFixture<HeaderBlockComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeaderBlockComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(HeaderBlockComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
