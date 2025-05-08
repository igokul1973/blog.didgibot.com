import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertBlockComponent } from './alert-block.component';

describe('AlertComponent', () => {
    let component: AlertBlockComponent;
    let fixture: ComponentFixture<AlertBlockComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AlertBlockComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(AlertBlockComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
