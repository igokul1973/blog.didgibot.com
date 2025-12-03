import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { BlockToolTypeEnum, IOutputBlockData } from '../../../types';
import { RawBlockComponent } from './raw-block.component';
import { IEditorJsRaw } from './types';

describe('RawBlockComponent', () => {
    let component: RawBlockComponent;
    let fixture: ComponentFixture<RawBlockComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RawBlockComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(RawBlockComponent);
        component = fixture.componentInstance;
        const item: IOutputBlockData<IEditorJsRaw> = {
            type: BlockToolTypeEnum.Raw,
            data: { html: '' }
        };
        component.item = item;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
