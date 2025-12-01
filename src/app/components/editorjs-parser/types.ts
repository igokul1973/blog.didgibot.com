import { IAlertConfig } from './block-parser/parsers/alert-block/types';
import { ICodeConfig } from './block-parser/parsers/code-block/types';
import { IColumnsConfig } from './block-parser/parsers/columns-block/types';
import { IDelimiterConfig } from './block-parser/parsers/delimiter-block/types';
import { IErrorConfig } from './block-parser/parsers/error-block/types';
import { IImageConfig } from './block-parser/parsers/image-block/types';
import { IListConfig } from './block-parser/parsers/list-block/types';
import { IParagraphConfig } from './block-parser/parsers/paragraph-block/types';
import { IQuoteConfig } from './block-parser/parsers/quote-block/types';
import { ITableConfig } from './block-parser/parsers/table-block/types';

export interface IBlockParserProps {
    data: IOutputData;
    config?: IBlockParserConfig;
}

export interface IBlockParserConfig {
    alert?: IAlertConfig;
    code?: ICodeConfig;
    columns?: IColumnsConfig;
    table?: ITableConfig;
    image?: IImageConfig;
    paragraph?: IParagraphConfig;
    list?: IListConfig;
    quote?: IQuoteConfig;
    delimiter?: IDelimiterConfig;
    error?: IErrorConfig;
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

export interface IOutputBlockData<Data extends object = Record<string, unknown>> {
    id?: string;
    type: BlockToolTypeEnum;
    data: TBlockToolData<Data>;
    tunes?: Record<string, unknown>;
}

export interface IOutputData {
    version?: string;
    time?: number;
    blocks: IOutputBlockData[];
}

export type TBlockToolData<T extends object = Record<string, unknown>> = T;
