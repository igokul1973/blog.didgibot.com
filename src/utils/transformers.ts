import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { IArticle, IArticlePartial, IRawArticle } from 'types/article';
import { ICategory, IRawCategory } from 'types/category';
import { IRawTag, ITag } from 'types/tag';
import { IArticleTranslation, IContent, IRawArticleTranslation } from 'types/translation';

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(timezone);

export const transformRawCategory = (category: IRawCategory, isRemoveDateFields = false): ICategory => {
    let { id, name, created_at, updated_at } = category;
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

export const transformRawCategories = (categories: IRawCategory[], isRemoveDateFields = false): ICategory[] => {
    return categories.map((category) => transformRawCategory(category, isRemoveDateFields));
};

export const transformRawTag = (tag: IRawTag, isRemoveDateFields = false): ITag => {
    let { id, name, created_at, updated_at } = tag;
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

export const transformRawTags = (tags: IRawTag[], isRemoveDateFields = false): ITag[] => {
    return tags.map((tag) => transformRawTag(tag, isRemoveDateFields));
};

export function transformRawContent(rawContent: IContent) {
    const { __typename, version, time, blocks, ...content } = rawContent;
    const transformedBlocks = [];
    for (const block of blocks) {
        const { __typename, ...blockRest } = block;
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
    translations: IRawArticleTranslation[],
    removeTranslationFields: (keyof IArticleTranslation)[] = [],
    isRemoveDateFields = false
) => {
    return translations.map((t) => {
        const { is_published, published_at, category: rawCategory, content: rawContent, tags: rawTags, ...rest } = t;

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
                    // @ts-expect-error
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
    article: IRawArticle,
    removeTranslationFields: (keyof IArticle['translations'][number] | '__typename')[] = [],
    isRemoveDateFields = false
): IArticlePartial => {
    const { id, translations: rawTranslations, created_at, updated_at } = article;
    const translations = transformRawTranslations(rawTranslations, removeTranslationFields, isRemoveDateFields);
    let a: IArticlePartial = {
        id,
        translations
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

export const transformRawArticles = (rawArticles: IRawArticle[]): IArticlePartial[] => {
    return rawArticles.map((rawArticle: IRawArticle): IArticlePartial => {
        return transformRawArticle(rawArticle);
    });
};
