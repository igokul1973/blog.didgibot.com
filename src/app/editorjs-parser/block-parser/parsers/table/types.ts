import { IOutputBlockData } from '@/app/editorjs-parser/types';

export type TEditorJsTable = {
    withHeadings: boolean;
    content: Array<string[]>;
};

export type TTableConfig = {
    classNames: {
        tableHeader?: string;
        tableData?: string;
        table?: string;
    };
};

export interface ITableProps {
    item: IOutputBlockData<TEditorJsTable>;
    config?: TTableConfig;
}
