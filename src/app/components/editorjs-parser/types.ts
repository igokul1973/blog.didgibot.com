import { TAlertConfig } from './block-parser/parsers/alert-block/types';
import { TCodeConfig } from './block-parser/parsers/code-block/types';
import { TColumnsConfig } from './block-parser/parsers/columns-block/types';
import { TDelimiterConfig } from './block-parser/parsers/delimiter-block/types';
import { TErrorConfig } from './block-parser/parsers/error-block/types';
import { TImageConfig } from './block-parser/parsers/image-block/types';
import { TListConfig } from './block-parser/parsers/list-block/types';
import { TParagraphConfig } from './block-parser/parsers/paragraph-block/types';
import { TQuoteConfig } from './block-parser/parsers/quote-block/types';
import { TTableConfig } from './block-parser/parsers/table-block/types';

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

export enum BlockToolTypeEnum {
    Alert = 'alert',
    Code = 'code',
    Columns = 'columns',
    Delimiter = 'delimiter',
    Header = 'header',
    Image = 'image',
    Quote = 'quote',
    Raw = 'raw',
    List = 'list',
    Paragraph = 'paragraph',
    Table = 'table',
    Error = 'error'
}

export interface IOutputBlockData<Data extends object = any> {
    id?: string;
    type: BlockToolTypeEnum;
    data: TBlockToolData<Data>;
    tunes?: { [name: string]: any };
}

export interface IOutputData {
    version?: string;
    time?: number;
    blocks: IOutputBlockData[];
}

export type TBlockToolData<T extends object = any> = T;
