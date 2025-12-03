import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { IOutputBlockData } from '@/app/components/editorjs-parser/types';
import { ParagraphBlockComponent } from './paragraph-block.component';
import { IEditorJsParagraph } from './types';

describe('ParagraphBlockComponent', () => {
    let component: ParagraphBlockComponent;
    let fixture: ComponentFixture<ParagraphBlockComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ParagraphBlockComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ParagraphBlockComponent);
        component = fixture.componentInstance;
        const item: IOutputBlockData<IEditorJsParagraph> = {
            type: 0 as never,
            data: { text: '' }
        };
        component.item = item;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
