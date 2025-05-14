import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorBlockComponent } from './error-block.component';

describe('ErrorComponent', () => {
    let component: ErrorBlockComponent;
    let fixture: ComponentFixture<ErrorBlockComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ErrorBlockComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ErrorBlockComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
