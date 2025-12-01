import { NgClass } from '@angular/common';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { IBlockParserConfig, IOutputBlockData, IOutputData } from '../../../types';
import { BlockParserComponent } from '../../block-parser.component';
import { IColumnsConfig, IEditorJsColumns } from './types';

const defaultColumnsConfig: IColumnsConfig = {
    classNames: {
        outerContainer: 'my-2 md:grid md:gap-4',
        innerBlocksContainers: 'self-center',
        twoColumns: 'md:grid-cols-2',
        threeColumns: 'lg:grid-cols-3 md:grid-cols-2'
    }
};

@Component({
    selector: 'app-columns-block',
    imports: [NgClass, forwardRef(() => BlockParserComponent)],
    templateUrl: './columns-block.component.html',
    styleUrl: './columns-block.component.scss'
})
export class ColumnsBlockComponent implements OnInit {
    @Input() item!: IOutputBlockData<IEditorJsColumns>;
    @Input() config?: IColumnsConfig;
    @Input() blockRendererConfig?: IBlockParserConfig;
    public currentConfig!: IColumnsConfig;
    public cols!: number;
    ngOnInit(): void {
        this.currentConfig = { ...defaultColumnsConfig, ...this.config };
        this.cols = this.item.data.cols.length;
    }

    identify(index: number, col: IOutputData) {
        return col.time + index.toString();
    }

    getClasses() {
        return {
            2: this.currentConfig.classNames?.twoColumns,
            3: this.currentConfig.classNames?.threeColumns
        }[this.cols];
    }
}
