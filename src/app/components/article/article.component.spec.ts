import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IArticlePartial } from 'types/article';
import { IContent, LanguageEnum } from 'types/translation';
import { vi } from 'vitest';
import { ArticleComponent } from './article.component';

describe('ArticleComponent', () => {
    let component: ArticleComponent;
    let fixture: ComponentFixture<ArticleComponent>;
    let locationSpy: { back: ReturnType<typeof vi.fn> };

    beforeEach(async () => {
        locationSpy = {
            back: vi.fn()
        };

        await TestBed.configureTestingModule({
            imports: [ArticleComponent],
            providers: [provideRouter([]), { provide: Location, useValue: locationSpy }]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ArticleComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('renders article header and Go Back button in EN and calls location.back on click', () => {
        const content: IContent = {
            time: 0,
            version: '2.0.0',
            blocks: []
        };

        const article: IArticlePartial = {
            id: '1',
            translations: [
                {
                    language: LanguageEnum.EN,
                    header: 'Test header EN',
                    content
                }
            ]
        };

        fixture.componentRef.setInput('selectedLanguage', LanguageEnum.EN);
        fixture.componentRef.setInput('articleInput', article);
        component.isPreview = false;

        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const backButton = compiled.querySelector('button.back-btn') as HTMLButtonElement | null;

        expect(backButton).not.toBeNull();
        const textContent = backButton?.textContent ?? '';
        expect(textContent).toContain('Go Back');

        backButton?.click();

        expect(locationSpy.back).toHaveBeenCalled();
    });

    it('renders preview CTA with RU text when isPreview is true', () => {
        const content: IContent = {
            time: 0,
            version: '2.0.0',
            blocks: []
        };

        const article: IArticlePartial = {
            id: '2',
            translations: [
                {
                    language: LanguageEnum.RU,
                    header: 'Тестовый заголовок',
                    content
                }
            ],
            slug: 'test-slug'
        };

        fixture.componentRef.setInput('selectedLanguage', LanguageEnum.RU);
        fixture.componentRef.setInput('articleInput', article);
        component.isPreview = true;

        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const backButton = compiled.querySelector('button.back-btn');
        expect(backButton).toBeNull();

        const ctaButton = compiled.querySelector('mat-card-actions button.action-btn') as HTMLButtonElement | null;
        expect(ctaButton).not.toBeNull();
        const ctaText = ctaButton?.textContent ?? '';
        expect(ctaText).toContain('Перейти в статью');
    });

    it('renders app-block-parser when translation content exists', () => {
        const content: IContent = {
            time: 0,
            version: '2.0.0',
            blocks: []
        };

        const article: IArticlePartial = {
            id: '3',
            translations: [
                {
                    language: LanguageEnum.EN,
                    header: 'Block parser header',
                    content
                }
            ]
        };

        fixture.componentRef.setInput('selectedLanguage', LanguageEnum.EN);
        fixture.componentRef.setInput('articleInput', article);
        component.isPreview = false;

        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const blockParserEl = compiled.querySelector('app-block-parser');
        expect(blockParserEl).not.toBeNull();
    });

    it('should call location.back() when goBack() is called directly', () => {
        fixture.detectChanges();
        component.goBack();
        expect(locationSpy.back).toHaveBeenCalled();
    });
});
