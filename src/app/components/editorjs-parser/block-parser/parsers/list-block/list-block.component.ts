import { Component, Input, OnInit } from '@angular/core';
import { BlockToolTypeEnum, IOutputBlockData } from '../../../types';
import { IEditorJsList, IListConfig, IListItem, ListStyleEnum } from './types';

const defaultListConfig: IListConfig = {
    classNames: {
        unordered: 'list-disc ml-7',
        ordered: 'list-decimal ml-7'
    }
};

@Component({
    selector: 'app-list-block',
    imports: [ListBlockComponent],
    templateUrl: './list-block.component.html',
    styleUrl: './list-block.component.scss'
})
export class ListBlockComponent implements OnInit {
    @Input() item!: IOutputBlockData<IEditorJsList>;
    @Input() config?: IListConfig;
    public currentConfig!: IListConfig;
    public currentClasses!: IListConfig['classNames'];
    public listElements: string[] = [];
    public readonly blockToolTypeEnum = BlockToolTypeEnum;

    ngOnInit(): void {
        this.currentConfig = { ...defaultListConfig, ...this.config };
        this.currentClasses = this.currentConfig.classNames;
    }

    public identify(index: number, item: IListItem | string) {
        if (typeof item === 'string') {
            return index + item;
        }
        return index + item.content;
    }
    public isStringInstance(obj: unknown): boolean {
        return obj instanceof String;
    }

    public isOrderedList(style: ListStyleEnum): boolean {
        return style === ListStyleEnum.ordered;
    }
}
