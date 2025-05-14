import { NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IOutputBlockData } from '../../../types';
import { QuoteAlignmentEnum, TEditorJsQuote, TQuoteConfig } from './types';

const defaultQuoteConfig: TQuoteConfig = {
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
    imports: [NgClass],
    templateUrl: './quote-block.component.html',
    styleUrl: './quote-block.component.scss'
})
export class QuoteBlockComponent implements OnInit {
    @Input() item!: IOutputBlockData<TEditorJsQuote>;
    @Input() config?: TQuoteConfig = defaultQuoteConfig;
    public currentConfig!: TQuoteConfig;
    public alertTypeClass?: string;

    ngOnInit(): void {
        this.currentConfig = { ...defaultQuoteConfig, ...this.config };
        this.alertTypeClass = {
            [QuoteAlignmentEnum.left]: this.currentConfig.classNames.alignLeft,
            [QuoteAlignmentEnum.center]: this.currentConfig.classNames.alignCenter,
            [QuoteAlignmentEnum.right]: this.currentConfig.classNames.alignRight
        }[this.item.data.alignment];
    }
}
