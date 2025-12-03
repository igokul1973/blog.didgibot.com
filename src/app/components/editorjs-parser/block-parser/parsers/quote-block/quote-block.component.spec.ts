import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { BlockToolTypeEnum, IOutputBlockData } from '../../../types';
import { QuoteBlockComponent } from './quote-block.component';
import { IEditorJsQuote, QuoteAlignmentEnum } from './types';

describe('QuoteBlockComponent', () => {
    let component: QuoteBlockComponent;
    let fixture: ComponentFixture<QuoteBlockComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [QuoteBlockComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(QuoteBlockComponent);
        component = fixture.componentInstance;
        const item: IOutputBlockData<IEditorJsQuote> = {
            type: BlockToolTypeEnum.Quote,
            data: {
                text: '',
                caption: '',
                alignment: QuoteAlignmentEnum.left
            }
        };
        component.item = item;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
