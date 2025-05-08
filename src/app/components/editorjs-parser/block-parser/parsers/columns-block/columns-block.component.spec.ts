import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnsBlockComponent } from './columns-block.component';

describe('ColumnsComponent', () => {
    let component: ColumnsBlockComponent;
    let fixture: ComponentFixture<ColumnsBlockComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ColumnsBlockComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ColumnsBlockComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
