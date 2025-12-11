import { ArticleService } from '@/app/services/article/article.service';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { ParamMap } from '@angular/router';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import type { DeepPartial } from '@apollo/client/utilities';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, firstValueFrom, of, throwError } from 'rxjs';
import type { IArticlePartial, IRawArticle } from 'types/article';
import { LanguageEnum } from 'types/translation';
import { vi } from 'vitest';
import { ArticlePageComponent } from './article-page.component';

vi.mock('@/utils/transformers', () => ({
    transformRawArticle: vi.fn(
        (article: DeepPartial<IRawArticle>): IArticlePartial => ({
            id: article.id as string,
            translations: [],
            slug: article.slug
        })
    )
}));

describe('ArticlePageComponent', () => {
    let component: ArticlePageComponent;
    let fixture: ComponentFixture<ArticlePageComponent>;
    let readFragmentMock: ReturnType<typeof vi.fn>;
    let mockApolloClient: Apollo['client'];
    let mockArticleServiceGetBySlug: ReturnType<typeof vi.fn>;
    let paramMapSubject: BehaviorSubject<ParamMap>;

    const createComponent = (): void => {
        fixture = TestBed.createComponent(ArticlePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    };

    beforeEach(async () => {
        readFragmentMock = vi.fn(() => null);
        mockApolloClient = {
            readFragment: readFragmentMock
        } as unknown as Apollo['client'];

        const mockApollo: Partial<Apollo> = {
            client: mockApolloClient
        };

        mockArticleServiceGetBySlug = vi.fn(() => of(null));

        const mockArticleService: Partial<ArticleService> = {
            selectedLanguage: signal(LanguageEnum.EN),
            getArticleBySlug: mockArticleServiceGetBySlug as unknown as ArticleService['getArticleBySlug']
        };

        paramMapSubject = new BehaviorSubject<ParamMap>(convertToParamMap({}));

        await TestBed.configureTestingModule({
            imports: [ArticlePageComponent],
            providers: [
                provideRouter([]),
                { provide: Apollo, useValue: mockApollo },
                { provide: ArticleService, useValue: mockArticleService },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        paramMap: paramMapSubject.asObservable()
                    } satisfies Partial<ActivatedRoute>
                }
            ]
        }).compileComponents();

        vi.clearAllMocks();
    });

    it('should create and render fallback when there is no slug or article', async () => {
        createComponent();

        const id = await firstValueFrom(component.id$);
        const slug = await firstValueFrom(component.slug$);
        const article = await firstValueFrom(component.article$);

        expect(id).toBeNull();
        expect(slug).toBeNull();
        expect(article).toBeNull();

        const fallback = (fixture.nativeElement as HTMLParagraphElement).querySelector('p');
        expect(fallback?.textContent).toContain('Article not found');
    });

    it('loads article from Apollo cache when fragment exists for slug', async () => {
        const rawArticle: DeepPartial<IRawArticle> = {
            id: '1',
            slug: 'cached-slug'
        };
        readFragmentMock.mockReturnValue(rawArticle);

        createComponent();

        paramMapSubject.next(convertToParamMap({ id: '1', slug: 'cached-slug' }));

        const article = await firstValueFrom(component.article$);

        expect(readFragmentMock).toHaveBeenCalledWith(expect.objectContaining({ id: 'ArticleType:cached-slug' }));
        expect(mockArticleServiceGetBySlug).not.toHaveBeenCalled();
        expect(article).toEqual({
            id: '1',
            translations: [],
            slug: 'cached-slug'
        });

        fixture.detectChanges();
        const articleElement = (fixture.nativeElement as HTMLElement).querySelector('app-article');
        expect(articleElement).not.toBeNull();
    });

    it('loads article via ArticleService when fragment is missing and service returns article', async () => {
        readFragmentMock.mockReturnValue(null);

        const serviceArticle: IArticlePartial = {
            id: '2',
            translations: [],
            slug: 'service-slug'
        };
        mockArticleServiceGetBySlug.mockReturnValue(of(serviceArticle));

        createComponent();

        paramMapSubject.next(convertToParamMap({ id: '2', slug: 'service-slug' }));

        const article = await firstValueFrom(component.article$);

        expect(mockArticleServiceGetBySlug).toHaveBeenCalledWith('service-slug');
        expect(article).toEqual(serviceArticle);

        fixture.detectChanges();
        const articleElement = (fixture.nativeElement as HTMLElement).querySelector('app-article');
        expect(articleElement).not.toBeNull();
    });

    it('does not set article when ArticleService returns null', async () => {
        readFragmentMock.mockReturnValue(null);
        mockArticleServiceGetBySlug.mockReturnValue(of(null));

        createComponent();

        paramMapSubject.next(convertToParamMap({ id: '3', slug: 'missing-slug' }));

        const article = await firstValueFrom(component.article$);

        expect(mockArticleServiceGetBySlug).toHaveBeenCalledWith('missing-slug');
        expect(article).toBeNull();

        fixture.detectChanges();
        const fallback = (fixture.nativeElement as HTMLParagraphElement).querySelector('p');
        expect(fallback?.textContent).toContain('Article not found');
    });

    it('logs an error when ArticleService observable errors', () => {
        readFragmentMock.mockReturnValue(null);
        mockArticleServiceGetBySlug.mockReturnValue(throwError(() => new Error('service error')));

        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

        createComponent();

        paramMapSubject.next(convertToParamMap({ id: '4', slug: 'error-slug' }));

        expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching article:', expect.any(Error));

        consoleErrorSpy.mockRestore();
    });

    it('logs an error when slug$ stream errors', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

        fixture = TestBed.createComponent(ArticlePageComponent);
        component = fixture.componentInstance;

        component.slug$ = throwError(() => new Error('slug error'));

        component.ngOnInit();

        expect(consoleErrorSpy).toHaveBeenCalledWith('Subscription error:', expect.any(Error));

        consoleErrorSpy.mockRestore();
    });
});
