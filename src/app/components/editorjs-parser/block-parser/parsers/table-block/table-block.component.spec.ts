import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { BlockToolTypeEnum, IOutputBlockData } from '../../../types';
import { TableBlockComponent } from './table-block.component';
import { IEditorJsTable } from './types';

describe('TableComponent', () => {
    let component: TableBlockComponent;
    let fixture: ComponentFixture<TableBlockComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TableBlockComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TableBlockComponent);
        component = fixture.componentInstance;
        const item: IOutputBlockData<IEditorJsTable> = {
            type: BlockToolTypeEnum.Table,
            data: { content: [], with_headings: false }
        };
        component.item = item;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
