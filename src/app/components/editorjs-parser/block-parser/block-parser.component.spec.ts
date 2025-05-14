import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockParserComponent } from './block-parser.component';

describe('BlockParserComponent', () => {
    let component: BlockParserComponent;
    let fixture: ComponentFixture<BlockParserComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BlockParserComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(BlockParserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
