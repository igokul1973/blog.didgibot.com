export type TEditorJsQuote = {
    text: string;
    caption: string;
    alignment: QuoteAlignmentEnum;
};

export enum QuoteAlignmentEnum {
    left = 'left',
    center = 'center',
    right = 'right'
}

export type TQuoteConfig = {
    classNames: {
        alignCenter?: string;
        alignRight?: string;
        alignLeft?: string;
        quote?: string;
        caption?: string;
    };
};
