import { IArticleInputFilterInput, IArticleQueryInput, ISortInput } from 'types/article';

export const filter: IArticleInputFilterInput = { updated_at: { from_: '2022-01-01' } };
export const sort: ISortInput = { field: 'updated_at', dir: 'desc' };
export const limit: IArticleQueryInput['limit'] = 20;
