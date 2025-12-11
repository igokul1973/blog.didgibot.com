import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockToolTypeEnum, IOutputBlockData } from '../../../types';
import { DelimiterBlockComponent } from './delimiter-block.component';

describe('DelimiterComponent', () => {
    let component: DelimiterBlockComponent;
    let fixture: ComponentFixture<DelimiterBlockComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DelimiterBlockComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(DelimiterBlockComponent);
        component = fixture.componentInstance;
        const item: IOutputBlockData<Record<string, never>> = {
            type: BlockToolTypeEnum.Delimiter,
            data: {}
        };
        component.item = item;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
