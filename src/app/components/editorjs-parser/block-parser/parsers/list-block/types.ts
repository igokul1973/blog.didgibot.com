import { IOutputBlockData } from '@/app/components/editorjs-parser/types';
import { NgIterable } from '@angular/core';

export interface IListItem {
    /**
     * list item text content
     */
    content: string;
    /**
     * Meta information of each list item
     */
    meta: object;
    /**
     * sublist items
     */
    items: IListItem[];
}

export type TListItems = IListItem[] | string[];

export type TEditorJsList = {
    style: ListStyleEnum;
    meta: object;
    items: NgIterable<IListItem | string>;
};

export enum ListStyleEnum {
    ordered = 'ordered',
    unordered = 'unordered'
}

export type TListConfig = {
    classNames: {
        unordered?: string;
        ordered?: string;
    };
};

export interface IListProps {
    item: IOutputBlockData<TEditorJsList>;
    config?: TListConfig;
}
