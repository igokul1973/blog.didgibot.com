import { ArticleService } from '@/app/services/article/article.service';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { LanguageEnum } from 'types/translation';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BlogComponent } from './blog.component';

describe('BlogComponent', () => {
    let component: BlogComponent;
    let fixture: ComponentFixture<BlogComponent>;

    beforeEach(async () => {
        const mockWatchArticles: ArticleService['watchArticles'] = vi.fn(() =>
            of([])
        ) as unknown as ArticleService['watchArticles'];

        const mockArticleService: Partial<ArticleService> = {
            searchQuery$: of(''),
            selectedLanguage: signal(LanguageEnum.EN),
            watchArticles: mockWatchArticles
        };

        await TestBed.configureTestingModule({
            imports: [BlogComponent],
            providers: [provideRouter([]), { provide: ArticleService, useValue: mockArticleService }]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BlogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
