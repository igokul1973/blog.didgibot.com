import { IOutputBlockData } from '@/app/components/editorjs-parser/types';

export interface IEditorJsTable {
    with_headings: boolean;
    content: string[][];
}

export interface ITableConfig {
    classNames: {
        tableHeader?: string;
        tableData?: string;
        table?: string;
    };
}

export interface ITableProps {
    item: IOutputBlockData;
    config?: ITableConfig;
}
