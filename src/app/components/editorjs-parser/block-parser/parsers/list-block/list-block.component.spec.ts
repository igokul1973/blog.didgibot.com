import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { BlockToolTypeEnum, IOutputBlockData } from '../../../types';
import { ListBlockComponent } from './list-block.component';
import { IEditorJsList, ListStyleEnum } from './types';

describe('ListBlockComponent', () => {
    let component: ListBlockComponent;
    let fixture: ComponentFixture<ListBlockComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ListBlockComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ListBlockComponent);
        component = fixture.componentInstance;
        const item: IOutputBlockData<IEditorJsList> = {
            type: BlockToolTypeEnum.List,
            data: { style: ListStyleEnum.unordered, meta: {}, items: [] }
        };
        component.item = item;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
