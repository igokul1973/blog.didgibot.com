import type { DeepPartial } from '@apollo/client/utilities';
import dayjs from 'dayjs/esm';
import customParseFormat from 'dayjs/esm/plugin/customParseFormat';
import localizedFormat from 'dayjs/esm/plugin/localizedFormat';
import timezone from 'dayjs/esm/plugin/timezone';
import utc from 'dayjs/esm/plugin/utc';
import { IArticle, IArticlePartial, IRawArticle } from 'types/article';
import { ICategory, IRawCategory } from 'types/category';
import { IRawTag, ITag } from 'types/tag';
import { IArticleTranslation, IContent, IContentBlock, IRawArticleTranslation } from 'types/translation';

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(timezone);

export const transformRawCategory = (category: DeepPartial<IRawCategory>, isRemoveDateFields = false): ICategory => {
    const { id, name, created_at, updated_at } = category;

    if (!id || !name) {
        throw new Error('Category must have id and name');
    }

    let c: ICategory = { id, name };

    if (!isRemoveDateFields) {
        c = {
            ...c,
            createdAt: dayjs.utc(created_at),
            updatedAt: dayjs.utc(updated_at)
        };
    }
    return c;
};

export const transformRawTag = (tag: DeepPartial<IRawTag>, isRemoveDateFields = false): ITag => {
    const { id, name, created_at, updated_at } = tag;

    if (!id || !name) {
        throw new Error('Tag must have id and name');
    }

    let t: ITag = { id, name };

    if (!isRemoveDateFields) {
        t = {
            ...t,
            createdAt: dayjs.utc(created_at),
            updatedAt: dayjs.utc(updated_at)
        };
    }
    return t;
};

export const transformRawTags = (tags: (DeepPartial<IRawTag> | undefined)[], isRemoveDateFields = false): ITag[] => {
    const filteredTags = tags.filter((tag): tag is DeepPartial<IRawTag> => tag !== undefined);
    return filteredTags.map((tag) => transformRawTag(tag, isRemoveDateFields));
};

export function transformRawContent(rawContent: DeepPartial<IContent>): IContent {
    const { __typename: _typename, version, time, blocks, ...content } = rawContent;
    const filteredBlocks =
        blocks?.filter((block): block is IContentBlock => !!block && !!block.type && !!block.data) || [];
    void _typename;
    const transformedBlocks: IContent['blocks'] = [];
    for (const block of filteredBlocks) {
        const { __typename: _blockTypename, ...blockRest } = block;
        void _blockTypename;
        transformedBlocks.push(blockRest);
    }

    const transformedContent: IContent = {
        ...content,
        blocks: transformedBlocks
    };

    if (version !== null) {
        transformedContent.version = version;
    }

    if (time !== null) {
        transformedContent.time = time;
    }

    return transformedContent;
}

export const transformRawTranslations = (
    translations: DeepPartial<IRawArticleTranslation>[],
    removeTranslationFields: (keyof IArticleTranslation)[] = [],
    isRemoveDateFields = false
): Partial<IArticleTranslation>[] => {
    return translations.filter(Boolean).map((t) => {
        const { is_published, published_at, category: rawCategory, content: rawContent, tags: rawTags, ...rest } = t;
        if (!rawCategory || !rawContent || !rawTags) {
            throw new Error('category, content, and tags are required for translation transformation');
        }

        const category = transformRawCategory(rawCategory, isRemoveDateFields);
        const tags = transformRawTags(rawTags, isRemoveDateFields);
        const content = removeTranslationFields.includes('__typename') ? transformRawContent(rawContent) : rawContent;

        const transformedTranslation = {
            ...rest,
            content,
            category,
            tags,
            isPublished: is_published,
            publishedAt: published_at ? dayjs.utc(published_at) : undefined
        } as IArticleTranslation;

        type TTransformedTranslationKeys = keyof typeof transformedTranslation;

        if (removeTranslationFields.length > 0) {
            const newTranslation = (Object.keys(transformedTranslation) as TTransformedTranslationKeys[]).reduce<
                Partial<IArticleTranslation>
            >((acc, key) => {
                if (!removeTranslationFields.includes(key)) {
                    const s = transformedTranslation[key];
                    // @ts-expect-error - assigning dynamic key from transformedTranslation
                    acc[key] = s;
                }
                return acc;
            }, {} as Partial<IArticleTranslation>);

            return newTranslation;
        }

        return transformedTranslation;
    });
};

export const transformRawArticle = (
    article: DeepPartial<IRawArticle>,
    removeTranslationFields: (keyof IArticle['translations'][number] | '__typename')[] = [],
    isRemoveDateFields = false
): IArticlePartial => {
    const { id, translations: rawTranslations, created_at, updated_at, ...rest } = article;
    if (!id || !created_at || !updated_at) {
        throw new Error('"id", "created_at" and "updated_at" are required for article transformation');
    }
    const filteredTranslations = rawTranslations?.filter(Boolean) as DeepPartial<IRawArticleTranslation>[];
    const translations = transformRawTranslations(filteredTranslations, removeTranslationFields, isRemoveDateFields);
    let a: IArticlePartial = {
        id,
        translations,
        ...rest
    };

    if (!isRemoveDateFields) {
        a = {
            ...a,
            createdAt: dayjs.utc(created_at),
            updatedAt: dayjs.utc(updated_at)
        };
    }

    return a;
};
