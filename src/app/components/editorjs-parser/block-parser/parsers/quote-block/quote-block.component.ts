import { NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IOutputBlockData } from '../../../types';
import { IEditorJsQuote, IQuoteConfig, QuoteAlignmentEnum } from './types';

const defaultQuoteConfig: IQuoteConfig = {
    classNames: {
        alignCenter: 'text-center',
        alignRight: 'text-right',
        alignLeft: 'text-left',
        quote: 'italic text-lg',
        caption: 'opacity-85 text-sm'
    }
};

@Component({
    selector: 'app-quote-block',
    standalone: true,
    imports: [NgClass],
    templateUrl: './quote-block.component.html',
    styleUrl: './quote-block.component.scss'
})
export class QuoteBlockComponent implements OnInit {
    @Input() item!: IOutputBlockData<IEditorJsQuote>;
    @Input() config?: IQuoteConfig = defaultQuoteConfig;
    public currentConfig!: IQuoteConfig;
    public alertTypeClass?: string;

    ngOnInit(): void {
        this.currentConfig = {
            ...defaultQuoteConfig,
            ...this.config,
            classNames: {
                ...defaultQuoteConfig.classNames,
                ...this.config?.classNames
            }
        };
        this.alertTypeClass =
            {
                [QuoteAlignmentEnum.left]: this.currentConfig.classNames.alignLeft,
                [QuoteAlignmentEnum.center]: this.currentConfig.classNames.alignCenter,
                [QuoteAlignmentEnum.right]: this.currentConfig.classNames.alignRight
            }[this.item.data.alignment] || '';
    }
}
