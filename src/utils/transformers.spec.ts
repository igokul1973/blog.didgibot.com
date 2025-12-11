import type { DeepPartial } from '@apollo/client/utilities';
import type { IArticlePartial, IRawArticle } from 'types/article';
import type { IRawCategory } from 'types/category';
import type { IRawTag } from 'types/tag';
import type { IContent, IContentBlock, IRawArticleTranslation } from 'types/translation';
import { LanguageEnum } from 'types/translation';

import {
    transformRawArticle,
    transformRawCategory,
    transformRawContent,
    transformRawTag,
    transformRawTags,
    transformRawTranslations
} from './transformers';

describe('transformRawCategory', () => {
    it('creates category with dates by default', () => {
        const created_at = '2024-01-01T00:00:00Z';
        const updated_at = '2024-01-02T00:00:00Z';

        const result = transformRawCategory({
            id: '1',
            name: 'Category',
            created_at,
            updated_at
        });

        expect(result.id).toBe('1');
        expect(result.name).toBe('Category');
        expect(result.createdAt).toBeDefined();
        expect(result.updatedAt).toBeDefined();
    });

    it('omits date fields when isRemoveDateFields is true', () => {
        const result = transformRawCategory(
            {
                id: '1',
                name: 'Category',
                created_at: '2024-01-01T00:00:00Z',
                updated_at: '2024-01-02T00:00:00Z'
            },
            true
        );

        expect(result.createdAt).toBeUndefined();
        expect(result.updatedAt).toBeUndefined();
    });

    it('throws when id or name is missing', () => {
        const invalid: DeepPartial<IRawCategory> = {
            id: undefined,
            name: 'Category'
        };

        expect(() => transformRawCategory(invalid)).toThrow('Category must have id and name');
    });
});

describe('transformRawTag and transformRawTags', () => {
    it('creates tag with dates by default', () => {
        const result = transformRawTag({
            id: 't1',
            name: 'Tag',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-02T00:00:00Z'
        });

        expect(result.id).toBe('t1');
        expect(result.name).toBe('Tag');
        expect(result.createdAt).toBeDefined();
        expect(result.updatedAt).toBeDefined();
    });

    it('throws when tag id or name is missing', () => {
        const invalidTag: DeepPartial<IRawTag> = {
            id: undefined,
            name: 'Tag'
        };

        expect(() => transformRawTag(invalidTag)).toThrow('Tag must have id and name');
    });

    it('omits tag dates when isRemoveDateFields is true and filters undefined tags', () => {
        const tags = transformRawTags(
            [
                undefined,
                {
                    id: 't1',
                    name: 'Tag1',
                    created_at: '2024-01-01T00:00:00Z',
                    updated_at: '2024-01-02T00:00:00Z'
                }
            ],
            true
        );

        expect(tags).toHaveLength(1);
        expect(tags[0].id).toBe('t1');
        // ITag extends IEntityDates, so createdAt is an optional Dayjs field we can assert on directly
        expect(tags[0].createdAt).toBeUndefined();
    });
});

describe('transformRawContent', () => {
    it('strips typenames, filters invalid blocks, and preserves version/time', () => {
        const rawContent: DeepPartial<IContent> = {
            __typename: 'Content',
            version: '2',
            time: 123,
            blocks: [
                {
                    __typename: 'Block',
                    type: 'paragraph',
                    data: { text: 'hello' }
                } as DeepPartial<IContentBlock>,
                {
                    type: 'paragraph',
                    data: undefined
                } as DeepPartial<IContentBlock>
            ]
        };

        const transformed = transformRawContent(rawContent);

        // IContent has optional __typename and a blocks array of IContentBlock
        expect(transformed.__typename).toBeUndefined();
        expect(transformed.blocks).toHaveLength(1);
        expect(transformed.blocks[0].__typename).toBeUndefined();

        // Narrow the block data shape only where we care about text
        expect((transformed.blocks[0].data as { text: string }).text).toBe('hello');

        // IContent.version is a string, time is a number
        expect(transformed.version).toBe('2');
        expect(transformed.time).toBe(123);
    });

    it('returns empty blocks array when blocks are not provided', () => {
        const raw: DeepPartial<IContent> = {
            version: '3',
            time: 456
        };

        const transformed = transformRawContent(raw);

        expect(transformed.blocks).toEqual([]);
        expect(transformed.version).toBe('3');
        expect(transformed.time).toBe(456);
    });

    it('omits version and time when they are null', () => {
        // Backend may explicitly send nulls; this steps slightly outside the TS type
        // to verify the runtime guard `if (version !== null)` / `if (time !== null)`.
        const raw = {
            version: null,
            time: null,
            blocks: []
        } as unknown as DeepPartial<IContent>;

        const transformed = transformRawContent(raw);

        expect(transformed.version).toBeUndefined();
        expect(transformed.time).toBeUndefined();
    });
});

describe('transformRawTranslations', () => {
    const rawCategory: IRawCategory = {
        id: 'c1',
        name: 'Category',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z'
    };

    const rawTags: IRawTag[] = [
        {
            id: 't1',
            name: 'Tag1',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-02T00:00:00Z'
        }
    ];

    const rawContent: IContent = {
        __typename: 'Content',
        version: '1',
        time: 111,
        blocks: [
            {
                __typename: 'Block',
                type: 'paragraph',
                data: { text: 'hello' }
            } as IContentBlock
        ]
    };

    it('transforms translations with dates and full structure', () => {
        const rawTranslation: DeepPartial<IRawArticleTranslation> = {
            language: LanguageEnum.EN,
            header: 'Header',
            content: rawContent,
            category: rawCategory,
            tags: rawTags,
            is_published: true,
            published_at: '2024-01-03T00:00:00Z'
        };

        const translations = transformRawTranslations([rawTranslation]);

        expect(translations).toHaveLength(1);
        const t = translations[0];
        expect(t.language).toBe(LanguageEnum.EN);
        expect(t.header).toBe('Header');
        expect(t.isPublished).toBe(true);
        expect(t.category).toBeDefined();
        expect(t.category!.id).toBe('c1');

        expect(t.tags).toBeDefined();
        expect(t.tags!.length).toBe(1);
        expect(t.tags![0]!.id).toBe('t1');
        expect(t.publishedAt).toBeDefined();
    });

    it('throws when required relations are missing', () => {
        const incomplete: DeepPartial<IRawArticleTranslation> = {
            language: LanguageEnum.EN,
            header: 'Header',
            is_published: true
        };

        expect(() => transformRawTranslations([incomplete])).toThrow(
            'category, content, and tags are required for translation transformation'
        );
    });

    it('removes specified translation fields and typenames, and can omit date fields', () => {
        const rawWithTypename: DeepPartial<IRawArticleTranslation> = {
            language: LanguageEnum.EN,
            header: 'Header',
            content: rawContent,
            category: rawCategory,
            tags: rawTags,
            is_published: true,
            published_at: '2024-01-03T00:00:00Z',
            __typename: 'ArticleTranslation'
        };

        const translations = transformRawTranslations([rawWithTypename], ['__typename', 'publishedAt'], true);

        const t = translations[0];

        expect('publishedAt' in t).toBe(false);
        expect('__typename' in t).toBe(false);

        expect(t.category?.createdAt).toBeUndefined();
        expect(t.tags?.[0]?.createdAt).toBeUndefined();
        expect(t.content?.__typename).toBeUndefined();
    });
});

describe('transformRawArticle', () => {
    const rawCategory: IRawCategory = {
        id: 'c1',
        name: 'Category',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z'
    };

    const rawTags: IRawTag[] = [
        {
            id: 't1',
            name: 'Tag1',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-02T00:00:00Z'
        }
    ];

    const rawContent: IContent = {
        version: '1',
        time: 111,
        blocks: []
    };

    const baseArticle: DeepPartial<IRawArticle> = {
        id: 'a1',
        slug: 'slug',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        translations: [
            {
                language: LanguageEnum.EN,
                header: 'Header',
                content: rawContent,
                category: rawCategory,
                tags: rawTags,
                is_published: true
            }
        ]
    };

    it('transforms article including dates and translations', () => {
        const article: IArticlePartial = transformRawArticle(baseArticle);

        expect(article.id).toBe('a1');
        expect(article.slug).toBe('slug');
        expect(article.translations).toHaveLength(1);
        expect(article.translations[0].language).toBe(LanguageEnum.EN);
        expect(article.createdAt).toBeDefined();
    });

    it('omits article date fields when isRemoveDateFields is true', () => {
        const article: IArticlePartial = transformRawArticle(baseArticle, [], true);

        expect(article.createdAt).toBeUndefined();
        expect(article.updatedAt).toBeUndefined();
    });

    it('throws when required article fields are missing', () => {
        const incomplete: DeepPartial<IRawArticle> = {
            id: undefined,
            created_at: undefined,
            updated_at: undefined
        };

        expect(() => transformRawArticle(incomplete)).toThrow(
            '"id", "created_at" and "updated_at" are required for article transformation'
        );
    });
});
