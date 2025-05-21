import { IEntityDates, IRawEntityDates } from './common';
import { IArticleTranslation, IContent, IRawArticleTranslation, LanguageEnum } from './translation';

export interface IRawArticle extends IRawEntityDates {
    id: string;
    translations: IRawArticleTranslation[];
}

export interface IArticle extends IEntityDates {
    id: string;
    translations: IArticleTranslation[];
}

export interface IArticlePartial extends IEntityDates {
    id: string;
    translations: Partial<IArticleTranslation>[];
}

export interface IBaseDateRangeInput {
    from_?: string;
    to_?: string;
}

export interface IArticleInputFilterInput {
    content?: IContent;
    created_at?: IBaseDateRangeInput;
    header?: string;
    ids?: string[];
    is_published?: boolean;
    language?: LanguageEnum;
    published_at?: IBaseDateRangeInput;
    search?: string;
    updated_at?: IBaseDateRangeInput;
    user_id?: string;
}

export interface ISortInput {
    field: string;
    dir: 'asc' | 'desc';
}

export interface IArticleQueryInput {
    entityName: 'article';
    filterInput: IArticleInputFilterInput;
    sortInput?: ISortInput;
    limit?: number;
    skip?: number;
}
