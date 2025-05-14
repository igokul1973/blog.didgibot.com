import { IOutputBlockData } from '@/app/components/editorjs-parser/types';

export type TEditorJsTable = {
    with_headings: boolean;
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
