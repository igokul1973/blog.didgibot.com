# Quickstart Guide: Multilingual CV Support

**Feature**: 009-multilingual-cv  
**Date**: 2026-03-17  
**Phase**: 1 - Design & Contracts

## Overview

This guide provides step-by-step instructions for implementing multilingual CV support in the blog.didgibot.com Angular application. The feature enables seamless language switching between English and Russian CV content while maintaining all existing functionality.

## Prerequisites

- Angular 20.3.15+
- TypeScript 5.9.3+
- Vitest for testing
- Existing language selector in header
- Static JSON resume data structure

## Implementation Steps

### Step 1: Update TypeScript Interfaces

#### 1.1 Update Existing Interfaces

Update existing interfaces in `/src/app/components/cv/types.ts` to support multilingual content:

````typescript
// Add to existing types.ts file
interface IMultilingualText {
  [LanguageEnum.EN]: string;
  [LanguageEnum.RU]?: string;
}

interface IMultilingualTextBlock {
  [LanguageEnum.EN]: ITextBlock;
  [LanguageEnum.RU]?: ITextBlock;
}

// UPDATE existing interfaces (keep same names, just change structure!)
interface IPersonal {
  name: string;
  title: IMultilingualText;  // CHANGED: Now uses helper
  location: ILocation;
  locationHeadline: IMultilingualText;  // CHANGED: Now uses helper
  email: string;
  linkedin?: string;
  github?: string;
  headhunter?: string;
}

interface IExperience {
  id: number;
  company: string;
  title: IMultilingualText;  // CHANGED: Now uses helper
  employmentType?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  duration: string;
  location: string;
  description?: IMultilingualTextBlock[];  // CHANGED: Now uses helper
  technologies: string[];
  achievements?: IMultilingualTextBlock[];  // CHANGED: Now uses helper
  subRoles?: ISubRole[];
  teamSize?: string;
}

interface IPortfolio {
  name: string;
  description: IMultilingualText;  // CHANGED: Now uses helper
  url: string;
  technologies: string[];
  features?: IMultilingualTextBlock[];  // CHANGED: Now uses helper
}

interface IEducation {
  institution: string;
  degree: IMultilingualText;  // CHANGED: Now uses helper
  fieldOfStudy: IMultilingualText;  // CHANGED: Now uses helper
  startYear?: number | null;
  endYear?: number | null;
}

interface IResumeData {
  meta: IMeta;
  personal: IPersonal;
  summary: IMultilingualTextBlock[];  // CHANGED: Now uses helper
  topSkills: string[];
  certifications: IMultilingualText[];  // CHANGED: Now uses helper
  portfolio: IPortfolio[];
  experience: IExperience[];
  education: IEducation[];
  skills: ISkills;
}

#### 1.2 Add Translation Helper Types

```typescript
// Add to types.ts
interface IMultilingual<T> {
    [LanguageEnum.EN]: T;
    [LanguageEnum.RU]?: T;
}

type TranslationResult<T> = T | null;
````

### Step 2: Update CV Component (No New Services Needed)

#### 2.1 Simplified Approach - Use Existing ArticleService

The CV component can directly use the existing `ArticleService.selectedLanguage` signal and add simple translation helper functions:

```typescript
// Add to cv.component.ts - simple helper functions
private getTranslation<T>(multilingual: IMultilingual<T>, language: LanguageEnum): T {
  return multilingual[language] || multilingual[LanguageEnum.EN];
}

private getTextTranslation(multilingualText: IMultilingualText, language: LanguageEnum): string {
  return multilingualText[language] || multilingualText[LanguageEnum.EN] || '';
}

private getTextBlockTranslation(multilingualBlock: IMultilingualTextBlock, language: LanguageEnum): ITextBlock {
  return multilingualBlock[language] || multilingualBlock[LanguageEnum.EN];
}
```

### Step 3: Update CV Component

#### 3.1 Modify CV Component

Update `/src/app/components/cv/cv.component.ts`:

```typescript
import resumeData from '@/assets/igor_kulebyakin_resume.json';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ArticleService } from '@/app/services/article/article.service';
import {
    IEducation,
    IExperience,
    IPersonal,
    IPortfolio,
    IResumeData,
    ISkills,
    ITextBlock,
    IMultilingualText,
    IMultilingualTextBlock
} from './types';
import { LanguageEnum } from 'types/translation';

@Component({
    selector: 'app-cv',
    imports: [CommonModule, MatCardModule, MatListModule, MatChipsModule],
    templateUrl: './cv.component.html',
    styleUrl: './cv.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CvComponent {
    private readonly cvData: IResumeData = resumeData as IResumeData; // Load multilingual JSON directly
    private readonly sanitizer = inject(DomSanitizer);
    private readonly articleService = inject(ArticleService);

    // Signal-based localized data using existing ArticleService
    readonly localizedData = computed(() => {
        return this.transformToLocalized(this.cvData, this.articleService.selectedLanguage());
    });

    // Simple translation helper functions (no separate service needed)
    private getTranslation<T>(multilingual: IMultilingual<T>, language: LanguageEnum): T {
        return multilingual[language] || multilingual[LanguageEnum.EN];
    }

    private getTextTranslation(multilingualText: IMultilingualText, language: LanguageEnum): string {
        return multilingualText[language] || multilingualText[LanguageEnum.EN] || '';
    }

    private getTextBlockTranslation(multilingualBlock: IMultilingualTextBlock, language: LanguageEnum): ITextBlock {
        return multilingualBlock[language] || multilingualBlock[LanguageEnum.EN];
    }

    // Computed getters for template access
    readonly contact = computed(() => this.localizedData().personal);
    readonly summary = computed(() => this.localizedData().summary);
    readonly experience = computed(() => this.localizedData().experience);
    readonly education = computed(() => this.localizedData().education);
    readonly skills = computed(() => this.localizedData().skills);
    readonly portfolio = computed(() => this.localizedData().portfolio);
    readonly topSkills = computed(() => this.localizedData().topSkills);
    readonly certifications = computed(() => this.localizedData().certifications);

    // Transform translatable to localized data using helper functions
    private transformToLocalized(data: IResumeData, language: LanguageEnum): IResumeData {
        return {
            ...data,
            personal: {
                ...data.personal,
                title: this.getTextTranslation(data.personal.title, language),
                locationHeadline: this.getTextTranslation(data.personal.locationHeadline, language)
            },
            summary: data.summary.map((block) => this.getTextBlockTranslation(block, language)),
            certifications: data.certifications.map((cert) => this.getTextTranslation(cert, language)),
            experience: data.experience.map((exp) => ({
                ...exp,
                title: this.getTextTranslation(exp.title, language),
                description: exp.description?.map((block) => this.getTextBlockTranslation(block, language)),
                achievements: exp.achievements?.map((block) => this.getTextBlockTranslation(block, language))
            })),
            portfolio: data.portfolio.map((port) => ({
                ...port,
                description: this.getTextTranslation(port.description, language),
                features: port.features?.map((block) => this.getTextBlockTranslation(block, language))
            })),
            education: data.education.map((edu) => ({
                ...edu,
                degree: this.getTextTranslation(edu.degree, language),
                fieldOfStudy: this.getTextTranslation(edu.fieldOfStudy, language)
            }))
        };
    }

    // Helper methods for template (unchanged)
    get skillCategories(): string[] {
        return Object.keys(this.skills());
    }

    getSkillsForCategory(category: string): string[] {
        return this.skills()[category as keyof ISkills];
    }

    renderTextBlocks(blocks: ITextBlock[]): string[] {
        return blocks.map((block) => block.text || '').filter((text) => text !== '');
    }

    linkify(text: string | undefined): SafeHtml {
        if (!text) return '';
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const linkified = text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
        return this.sanitizer.bypassSecurityTrustHtml(linkified);
    }

    isListBlock(block: ITextBlock): boolean {
        return block.type === 'list';
    }

    isParagraphBlock(block: ITextBlock): boolean {
        return block.type === 'paragraph';
    }

    getListItems(block: ITextBlock): string[] {
        return block.items || [];
    }

    getListHeading(block: ITextBlock): string {
        return block.heading || '';
    }

    formatSkillCategory(key: string): string {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())
            .trim();
    }

    get displayLocation(): string {
        return this.isUserFromRussia() ? 'St.Petersburg, Russia' : this.contact().location.display;
    }

    private isUserFromRussia(): boolean {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const language = navigator.language || navigator.languages?.[0] || '';

        const russianTimezones = [
            'Europe/Moscow',
            'Europe/Samara',
            'Asia/Yekaterinburg',
            'Asia/Omsk',
            'Asia/Krasnoyarsk',
            'Asia/Irkutsk',
            'Asia/Yakutsk',
            'Asia/Vladivostok',
            'Asia/Magadan',
            'Asia/Kamchatka'
        ];

        const isRussianLanguage = language.toLowerCase().includes('ru');
        return russianTimezones.includes(timezone) || isRussianLanguage;
    }
}
```

#### 3.2 Update CV Template

Update `/src/app/components/cv/cv.component.html` to use computed signals:

````html
<!-- Replace static property access with signal-based access -->
<div class="cv-header">
    <h1>{{ contact().name }}</h1>
    <h2>{{ contact().title }}</h2>
    <p>{{ contact().email }}</p>
</div>

<!-- Update other sections similarly -->
<section class="summary">
    <h3>Professional Summary</h3>
    <div *ngFor="let block of summary()">
        <div *ngIf="isParagraphBlock(block)" [innerHTML]="linkify(block.text)"></div>
        <div *ngIf="isListBlock(block)">
            <h4 *ngIf="getListHeading(block)">{{ getListHeading(block) }}</h4>
            <ul>
                <li *ngFor="let item of getListItems(block)">{{ item }}</li>
            </ul>
        </div>
    </div>
</section>
``` ### Step 4: Update Resume JSON Data #### 4.1 Create Multilingual JSON Structure Update
`/src/assets/igor_kulebyakin_resume.json` to include Russian translations. **Note**: JSON uses string keys (`"en"`,
`"ru"`), but TypeScript interfaces use `LanguageEnum.EN`, `LanguageEnum.RU` for type safety. ### Step 5: Add Tests ####
5.1 Create CV Component Tests Update `/src/app/components/cv/cv.component.spec.ts` (co-located with component):
```typescript import { ComponentFixture, TestBed } from '@angular/core/testing'; import { CvComponent } from
'./cv.component'; import { ArticleService } from '@/app/services/article/article.service'; import { LanguageEnum } from
'types/translation'; import { signal } from '@angular/core'; describe('CvComponent', () => { let component: CvComponent;
let fixture: ComponentFixture<CvComponent
    >; let mockArticleService: jasmine.SpyObj<ArticleService
        >; beforeEach(async () => { const articleServiceSpy = jasmine.createSpyObj('ArticleService', [], {
        selectedLanguage: signal(LanguageEnum.EN) }); await TestBed.configureTestingModule({ imports: [CvComponent],
        providers: [ { provide: ArticleService, useValue: articleServiceSpy } ] }).compileComponents(); fixture =
        TestBed.createComponent(CvComponent); component = fixture.componentInstance; mockArticleService =
        TestBed.inject(ArticleService) as jasmine.SpyObj<ArticleService
            >; }); it('should create', () => { expect(component).toBeTruthy(); }); it('should display localized content
            based on language', () => { mockArticleService.selectedLanguage.set(LanguageEnum.RU);
            fixture.detectChanges(); expect(component.contact().title).toBe('Разработчик'); // Assuming Russian
            translation exists }); it('should fallback to English when Russian translation missing', () => {
            mockArticleService.selectedLanguage.set(LanguageEnum.RU); fixture.detectChanges();
            expect(component.contact().title).toBe('Javascript Fullstack Developer'); // Fallback to English });
            it('should switch languages when signal changes', () => { // Start with English
            mockArticleService.selectedLanguage.set(LanguageEnum.EN); fixture.detectChanges();
            expect(component.contact().title).toBe('Javascript Fullstack Developer'); // Switch to Russian
            mockArticleService.selectedLanguage.set(LanguageEnum.RU); fixture.detectChanges();
            expect(component.contact().title).toBe('Разработчик'); }); }); ``` ### Step 6: Visual Validation with
            Playwright MCP Server #### 6.1 Use Playwright MCP for Visual Testing During development, use the Playwright
            MCP server to validate language switching: 1. **Start the development server**: `pnpm start` 2. **Open
            browser with Playwright MCP**: Navigate to `http://localhost:4200` 3. **Test language switching**: Click the
            language selector in the header 4. **Verify content changes**: Confirm CV content switches between English
            and Russian 5. **Check fallback behavior**: Verify missing translations fall back to English **No test files
            needed** - use MCP server for interactive visual validation. ### Step 7: Performance Optimization #### 7.1
            Add Memoization Add simple caching to the CV component helper methods: ```typescript // Add to CV component
            - simple memoization private readonly translationCache = new Map<string, string | ITextBlock
                >(); private getTextTranslation(multilingualText: IMultilingualText, language: LanguageEnum): string {
                const cacheKey = `${JSON.stringify(multilingualText)}-${language}`; if
                (this.translationCache.has(cacheKey)) { return this.translationCache.get(cacheKey) as string; } const
                result = multilingualText[language] || multilingualText[LanguageEnum.EN] || '';
                this.translationCache.set(cacheKey, result); return result; } ``` ## Testing Checklist ### Unit Tests
                (Co-located) - [ ] CV component tests in `/src/app/components/cv/cv.component.spec.ts` - [ ] Language
                switching functionality tests - [ ] Fallback mechanism tests - [ ] Signal integration tests ### Visual
                Validation (Playwright MCP Server) - [ ] Language switching UI behavior validated via MCP server - [ ]
                Content display correctness verified interactively - [ ] Fallback behavior visualization confirmed - [ ]
                Performance validated through browser testing ## Performance Targets - [ ] Language switching < 1 second
                - [ ] Page load time < 200ms - [ ] Bundle size optimization - [ ] Memory usage efficiency ## Deployment
                Notes 1. **Build Process**: Ensure multilingual JSON is included in build 2. **Static Generation**:
                Verify static site generation works with new structure 3. **SEO**: Check that both language versions are
                properly indexed 4. **Cache**: Implement appropriate caching strategies ## Troubleshooting ### Common
                Issues 1. **Missing Translations**: Check JSON structure and fallback logic 2. **Performance Issues**:
                Verify signal usage and memoization 3. **Language State**: Ensure ArticleService integration is correct
                4. **Type Errors**: Validate TypeScript interfaces are properly imported ### Debug Steps 1. Check
                browser console for errors 2. Verify network requests for JSON data 3. Test with Playwright MCP for
                visual validation 4. Use Angular DevTools for signal inspection ### Visual Validation (Playwright MCP
                Server) - [ ] Language switching UI behavior validated via MCP server - [ ] Content display correctness
                verified interactively - [ ] Fallback behavior visualization confirmed - [ ] Performance validated
                through browser testing ## Performance Targets - [ ] Language switching < 1 second - [ ] Page load time
                < 200ms - [ ] Bundle size optimization - [ ] Memory usage efficiency ## Deployment Notes 1. **Build
                Process**: Ensure multilingual JSON is included in build 2. **Static Generation**: Verify static site
                generation works with new structure 3. **SEO**: Check that both language versions are properly indexed
                4. **Cache**: Implement appropriate caching strategies ## Troubleshooting ### Common Issues 1. **Missing
                Translations**: Check JSON structure and fallback logic 2. **Performance Issues**: Verify signal usage
                and memoization 3. **Language State**: Ensure ArticleService integration is correct 4. **Type Errors**:
                Validate TypeScript interfaces are properly imported ### Debug Steps 1. Check browser console for errors
                2. Verify network requests for JSON data 3. Test with Playwright MCP for visual validation 4. Use
                Angular DevTools for signal inspection This quickstart guide provides a complete implementation path for
                multilingual CV support while maintaining constitutional compliance and existing functionality. ```
                ```</string,
            ></ArticleService
        ></ArticleService
    ></CvComponent
>
````
