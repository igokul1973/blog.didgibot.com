import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { BlockToolTypeEnum, IOutputBlockData, IOutputData } from '../../../types';
import { BlockParserComponent } from '../../block-parser.component';
import { ColumnsBlockComponent } from './columns-block.component';
import { IEditorJsColumns } from './types';

describe('ColumnsComponent', () => {
    let component: ColumnsBlockComponent;
    let fixture: ComponentFixture<ColumnsBlockComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ColumnsBlockComponent, BlockParserComponent]
        })
            .overrideComponent(ColumnsBlockComponent, {
                set: {
                    template: '<div></div>'
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(ColumnsBlockComponent);
        component = fixture.componentInstance;

        const emptyOutputData: IOutputData = { blocks: [] };
        const item: IOutputBlockData<IEditorJsColumns> = {
            type: BlockToolTypeEnum.Columns,
            data: { cols: [emptyOutputData, emptyOutputData] }
        };

        component.item = item;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
