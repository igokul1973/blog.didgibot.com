import { TestBed } from '@angular/core/testing';
import { Apollo } from 'apollo-angular';
import { firstValueFrom, of } from 'rxjs';

import { GET_ARTICLES } from '@/app/operations';
import type { DeepPartial } from '@apollo/client/utilities';
import type { IRawArticle } from 'types/article';
import { LanguageEnum } from 'types/translation';

import { ArticleService } from './article.service';

vi.mock('@/utils/transformers', () => ({
    transformRawArticle: vi.fn((article: DeepPartial<IRawArticle>) => ({
        id: article.id,
        slug: article.slug
    }))
}));

describe('ArticleService', () => {
    let service: ArticleService;
    let apolloMock: { watchQuery: ReturnType<typeof vi.fn>; query: ReturnType<typeof vi.fn> } & Partial<Apollo>;

    beforeEach(() => {
        apolloMock = {
            watchQuery: vi.fn(),
            query: vi.fn()
        } as Partial<Apollo> as typeof apolloMock;

        TestBed.configureTestingModule({
            providers: [{ provide: Apollo, useValue: apolloMock }]
        });

        service = TestBed.inject(ArticleService);
        vi.clearAllMocks();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('has expected initial state', async () => {
        expect(service.selectedLanguage()).toBe(LanguageEnum.EN);
        expect(service.homePageArticles()).toEqual([]);
        expect(service.isArticleFilterSet()).toBe(false);

        const initialSearch = await firstValueFrom(service.searchQuery$);
        expect(initialSearch).toBe('');
    });

    it('setSearchQuery updates searchQuery$', async () => {
        service.setSearchQuery('hello');

        const value = await firstValueFrom(service.searchQuery$);
        expect(value).toBe('hello');
    });

    it('watchArticles maps non-null articles via transformRawArticle', async () => {
        const rawArticles = [{ id: '1', slug: 'a' }, undefined, { id: '2', slug: 'b' }];
        apolloMock.watchQuery.mockReturnValue({
            valueChanges: of({ data: { articles: rawArticles } })
        });

        const result = await firstValueFrom(service.watchArticles({ foo: 'bar' }));

        expect(apolloMock.watchQuery).toHaveBeenCalledWith({
            query: GET_ARTICLES,
            variables: { foo: 'bar' }
        });
        expect(result).toEqual([
            { id: '1', slug: 'a' },
            { id: '2', slug: 'b' }
        ]);
    });

    it('watchArticles returns empty array when there is no data', async () => {
        apolloMock.watchQuery.mockReturnValue({
            valueChanges: of({ data: undefined as unknown as { articles: DeepPartial<IRawArticle>[] } })
        });

        const result = await firstValueFrom(service.watchArticles({ foo: 'bar' }));

        expect(result).toEqual([]);
    });

    it('getArticles flattens and transforms articles', async () => {
        const rawArticles: DeepPartial<IRawArticle>[] = [
            { id: '1', slug: 'a' },
            { id: '2', slug: 'b' }
        ];
        apolloMock.query.mockReturnValue(of({ data: { articles: rawArticles } }));

        const result = await firstValueFrom(service.getArticles({ foo: 'bar' }));

        expect(apolloMock.query).toHaveBeenCalledWith({
            query: GET_ARTICLES,
            variables: { foo: 'bar' }
        });
        expect(result).toEqual([
            { id: '1', slug: 'a' },
            { id: '2', slug: 'b' }
        ]);
    });

    it('getArticles returns empty array when there is no data', async () => {
        apolloMock.query.mockReturnValue(of({ data: undefined }));

        const result = await firstValueFrom(service.getArticles({ foo: 'bar' }));
        expect(result).toEqual([]);
    });

    it('getArticleById queries with id filter and returns first transformed article', async () => {
        const rawArticle: DeepPartial<IRawArticle> = { id: '1', slug: 'slug-1' };
        apolloMock.query.mockReturnValue(of({ data: { articles: [rawArticle] } }));

        const result = await firstValueFrom(service.getArticleById('1'));

        expect(apolloMock.query).toHaveBeenCalledWith({
            query: GET_ARTICLES,
            variables: {
                entityName: 'article',
                filterInput: { ids: ['1'] }
            }
        });
        expect(result).toEqual({ id: '1', slug: 'slug-1' });
    });

    it('getArticleBySlug queries with slug filter and returns first transformed article', async () => {
        const rawArticle: DeepPartial<IRawArticle> = { id: '1', slug: 'slug-1' };
        apolloMock.query.mockReturnValue(of({ data: { articles: [rawArticle] } }));

        const result = await firstValueFrom(service.getArticleBySlug('slug-1'));

        expect(apolloMock.query).toHaveBeenCalledWith({
            query: GET_ARTICLES,
            variables: {
                entityName: 'article',
                filterInput: { slug: 'slug-1' }
            }
        });
        expect(result).toEqual({ id: '1', slug: 'slug-1' });
    });
});
