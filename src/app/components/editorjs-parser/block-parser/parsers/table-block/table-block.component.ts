import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IOutputBlockData } from '../../../types';
import { TEditorJsTable, TTableConfig } from './types';

const defaultTableConfig: TTableConfig = {
    classNames: {
        tableHeader: 'first:border-l-0 text-left pl-2 last:border-r-0 border-b-2 border',
        tableData: 'first:border-l-0 last:border-r-0 pl-2 border-b border',
        table: 'w-full'
    }
};

@Component({
    selector: 'app-table-block',
    imports: [NgIf, NgFor],
    templateUrl: './table-block.component.html',
    styleUrl: './table-block.component.scss'
})
export class TableBlockComponent implements OnInit {
    @Input() item!: IOutputBlockData<TEditorJsTable>;
    @Input() config?: TTableConfig;
    public currentConfig!: TTableConfig;

    ngOnInit(): void {
        this.currentConfig = { ...defaultTableConfig, ...this.config };
    }
}
