import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockToolTypeEnum, IOutputBlockData, IOutputData } from '../../../types';
import { BlockParserComponent } from '../../block-parser.component';
import { ColumnsBlockComponent } from './columns-block.component';
import { IColumnsConfig, IEditorJsColumns } from './types';

describe('ColumnsBlockComponent', () => {
    let component: ColumnsBlockComponent;
    let fixture: ComponentFixture<ColumnsBlockComponent>;

    const createComponent = (item: IOutputBlockData<IEditorJsColumns>, config?: IColumnsConfig): void => {
        fixture = TestBed.createComponent(ColumnsBlockComponent);
        component = fixture.componentInstance;
        component.item = item;
        if (config) {
            component.config = config;
        }
        fixture.detectChanges();
    };

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
    });

    it('initializes currentConfig and cols based on item data', () => {
        const emptyOutputData: IOutputData = { blocks: [] };
        const item: IOutputBlockData<IEditorJsColumns> = {
            type: BlockToolTypeEnum.Columns,
            data: { cols: [emptyOutputData, emptyOutputData] }
        };

        createComponent(item);

        expect(component.currentConfig.classNames?.outerContainer).toContain('my-2');
        expect(component.cols).toBe(2);
        expect(component.getClasses()).toContain('md:grid-cols-2');
    });

    it('getClasses returns correct classes for three columns', () => {
        const emptyOutputData: IOutputData = { blocks: [] };
        const item: IOutputBlockData<IEditorJsColumns> = {
            type: BlockToolTypeEnum.Columns,
            data: { cols: [emptyOutputData, emptyOutputData, emptyOutputData] }
        };

        const config: IColumnsConfig = {
            classNames: {
                outerContainer: 'outer',
                innerBlocksContainers: 'inner',
                twoColumns: 'two-cols',
                threeColumns: 'three-cols'
            }
        };

        createComponent(item, config);

        expect(component.cols).toBe(3);
        expect(component.getClasses()).toBe('three-cols');
    });

    it('identify returns unique keys based on time and index', () => {
        fixture = TestBed.createComponent(ColumnsBlockComponent);
        component = fixture.componentInstance;

        const col: IOutputData = { blocks: [], time: 123 }; // time is part of IOutputData
        const key = component.identify(2, col);

        expect(key).toBe('1232');
    });
});
