import { Component, Input, OnInit } from '@angular/core';
import { IOutputBlockData } from '../../../types';
import { IEditorJsTable, ITableConfig } from './types';

const defaultTableConfig: ITableConfig = {
    classNames: {
        tableHeader: 'first:border-l-0 text-left pl-2 last:border-r-0 border-b-2 border',
        tableData: 'first:border-l-0 last:border-r-0 pl-2 border-b border',
        table: 'w-full'
    }
};

@Component({
    selector: 'app-table-block',
    templateUrl: './table-block.component.html',
    styleUrl: './table-block.component.scss'
})
export class TableBlockComponent implements OnInit {
    @Input() item!: IOutputBlockData<IEditorJsTable>;
    @Input() config?: ITableConfig;
    public currentConfig!: ITableConfig;

    ngOnInit(): void {
        this.currentConfig = { ...defaultTableConfig, ...this.config };
    }
}
