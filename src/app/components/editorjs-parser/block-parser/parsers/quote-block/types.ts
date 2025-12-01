export interface IEditorJsQuote {
    text: string;
    caption: string;
    alignment: QuoteAlignmentEnum;
}

export enum QuoteAlignmentEnum {
    left = 'left',
    center = 'center',
    right = 'right'
}

export interface IQuoteConfig {
    classNames: {
        alignCenter?: string;
        alignRight?: string;
        alignLeft?: string;
        quote?: string;
        caption?: string;
    };
}
