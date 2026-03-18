# CV Component Contracts

## Component Implementation Details

### 1. CV Component - Modern Signals Approach

```typescript
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
    private readonly articleService = inject(ArticleService); // NEW: Inject existing service

    // NEW: Signal-based localized data for reactivity
    private readonly localizedData = computed(() => {
        return this.transformToLocalized(this.cvData, this.articleService.selectedLanguage());
    });

    // NEW: Computed signals for template access (reactive to language changes)
    readonly contact = computed(() => this.localizedData().personal);
    readonly summary = computed(() => this.localizedData().summary);
    readonly experience = computed(() => this.localizedData().experience);
    readonly education = computed(() => this.localizedData().education);
    readonly skills = computed(() => this.localizedData().skills);
    readonly portfolio = computed(() => this.localizedData().portfolio);
    readonly topSkills = computed(() => this.localizedData().topSkills);
    readonly certifications = computed(() => this.localizedData().certifications);

    // EXISTING: All existing helper methods remain unchanged (template will use signals instead)
    get skillCategories(): string[] {
        /* existing implementation */
    }
    getSkillsForCategory(category: string): string[] {
        /* existing */
    }
    renderTextBlocks(blocks: ITextBlock[]): string[] {
        /* existing */
    }
    linkify(text: string | undefined): SafeHtml {
        /* existing */
    }
    isListBlock(block: ITextBlock): boolean {
        /* existing */
    }
    isParagraphBlock(block: ITextBlock): boolean {
        /* existing */
    }
    getListItems(block: ITextBlock): string[] {
        /* existing */
    }
    getListHeading(block: ITextBlock): string {
        /* existing */
    }
    formatSkillCategory(key: string): string {
        /* existing */
    }

    // UPDATED: Location display now uses signal data
    get displayLocation(): string {
        return this.isUserFromRussia() ? 'St.Petersburg, Russia' : this.contact().location.display;
    }

    private isUserFromRussia(): boolean {
        /* existing - unchanged */
    }

    // Simple translation helper functions (no separate service needed)
    private getTextTranslation(multilingualText: IMultilingualText, language: LanguageEnum): string {
        return multilingualText[language] || multilingualText[LanguageEnum.EN] || '';
    }

    private getTextBlockTranslation(multilingualBlock: IMultilingualTextBlock, language: LanguageEnum): ITextBlock {
        return multilingualBlock[language] || multilingualBlock[LanguageEnum.EN];
    }

    private getTranslation<T>(multilingual: IMultilingual<T>, language: LanguageEnum): T {
        return multilingual[language] || multilingual[LanguageEnum.EN];
    }

    // NEW: Transform helper
    private transformToLocalized(data: IResumeData, language: LanguageEnum): IResumeData {
        // Convert multilingual to current language
    }
}
```

### 2. Integration with Existing Services

```typescript
// Use existing ArticleService directly - no new interfaces needed!
// ArticleService already has:
// - selectedLanguage: Signal<LanguageEnum>
// - All methods we need

// Use existing UrlService for language switching
// UrlService already has:
// - replaceLanguageParamInUrl(language: LanguageEnum): void
```

## Data Contracts

### 1. Translation Helper Functions

```typescript
// Helper functions are added directly to CvComponent - no interface needed!
private getTextTranslation(multilingualText: IMultilingualText, targetLanguage: LanguageEnum): string {
    return multilingualText[targetLanguage] || multilingualText[LanguageEnum.EN] || '';
}

private getTextBlockTranslation(multilingualBlock: IMultilingualTextBlock, targetLanguage: LanguageEnum): ITextBlock {
    return multilingualBlock[targetLanguage] || multilingualBlock[LanguageEnum.EN];
}

private getTranslation<T>(multilingual: IMultilingual<T>, targetLanguage: LanguageEnum): T {
    return multilingual[targetLanguage] || multilingual[LanguageEnum.EN];
}
```

**Note**: Visual validation is performed using the Playwright MCP server during development, not through automated test files.
