import { TAlertConfig } from './block-parser/parsers/alert/types';
import { TCodeConfig } from './block-parser/parsers/code/types';
import { TColumnsConfig } from './block-parser/parsers/columns/types';
import { TDelimiterConfig } from './block-parser/parsers/delimiter/types';
import { TErrorConfig } from './block-parser/parsers/error/types';
import { TImageConfig } from './block-parser/parsers/image/types';
import { TListConfig } from './block-parser/parsers/list/types';
import { TParagraphConfig } from './block-parser/parsers/paragraph/types';
import { TQuoteConfig } from './block-parser/parsers/quote/types';
import { TTableConfig } from './block-parser/parsers/table/types';

export interface IBlockParserProps {
    data: IOutputData;
    config?: IBlockParserConfig;
}

export interface IBlockParserConfig {
    alert?: TAlertConfig;
    code?: TCodeConfig;
    columns?: TColumnsConfig;
    table?: TTableConfig;
    image?: TImageConfig;
    paragraph?: TParagraphConfig;
    list?: TListConfig;
    quote?: TQuoteConfig;
    delimiter?: TDelimiterConfig;
    error?: TErrorConfig;
}

export interface IOutputBlockData<Data extends object = any> {
    id?: string;
    type: string;
    data: TBlockToolData<Data>;
    tunes?: { [name: string]: any };
}

export interface IOutputData {
    version?: string;
    time?: number;
    blocks: IOutputBlockData[];
}

export type TBlockToolData<T extends object = any> = T;
