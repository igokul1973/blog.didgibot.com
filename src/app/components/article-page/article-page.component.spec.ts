import { ArticleService } from '@/app/services/article/article.service';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';
import { LanguageEnum } from 'types/translation';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ArticlePageComponent } from './article-page.component';

describe('ArticlePageComponent', () => {
    let component: ArticlePageComponent;
    let fixture: ComponentFixture<ArticlePageComponent>;

    beforeEach(async () => {
        const mockApolloClient: Apollo['client'] = {
            readFragment: vi.fn(() => null)
        } as unknown as Apollo['client'];

        const mockApollo: Partial<Apollo> = {
            client: mockApolloClient
        };

        const mockArticleServiceGetBySlug: ArticleService['getArticleBySlug'] = vi.fn(() =>
            of(null)
        ) as unknown as ArticleService['getArticleBySlug'];

        const mockArticleService: Partial<ArticleService> = {
            selectedLanguage: signal(LanguageEnum.EN),
            getArticleBySlug: mockArticleServiceGetBySlug
        };

        await TestBed.configureTestingModule({
            imports: [ArticlePageComponent],
            providers: [
                provideRouter([]),
                { provide: Apollo, useValue: mockApollo },
                { provide: ArticleService, useValue: mockArticleService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ArticlePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
