# Data Model: Multilingual CV Support

**Feature**: 009-multilingual-cv  
**Date**: 2026-03-17  
**Phase**: 1 - Design & Contracts

## Entity Definitions

### 1. Text Translation Interfaces

#### IMultilingual<T>

Generic interface for any translatable content with fallback support.

```typescript
interface IMultilingual<T> {
    /** English translation (primary/fallback language) */
    [LanguageEnum.EN]: T;
    /** Russian translation (optional) */
    [LanguageEnum.RU]?: T;
}
```

**Usage**: Generic multilingual content for any data type.

#### IMultilingualText

Core interface for translatable string content with fallback support.

```typescript
interface IMultilingualText {
    /** English translation (primary/fallback language) */
    [LanguageEnum.EN]: string;
    /** Russian translation (optional) */
    [LanguageEnum.RU]?: string;
}
```

**Usage**: Simple text fields like titles, descriptions, headings.

#### IMultilingualTextBlock

Interface for complex content blocks maintaining existing structure.

```typescript
interface IMultilingualTextBlock {
    /** English content block */
    [LanguageEnum.EN]: ITextBlock;
    /** Russian content block (optional) */
    [LanguageEnum.RU]?: ITextBlock;
}

interface ITextBlock {
    type: 'paragraph' | 'list';
    text?: string;
    heading?: string;
    items?: string[];
}
```

**Usage**: Summary descriptions, experience responsibilities, achievements.

### 2. Enhanced Entity Interfaces

#### IPersonal

Personal information with translatable fields, preserving non-translatable contact data.

```typescript
interface IPersonal {
    /** Full name - kept as single field (non-translatable) */
    name: string;
    /** Professional title with translations */
    title: IMultilingualText;
    /** Location information (non-translatable) */
    location: ILocation;
    /** Location headline with translations */
    locationHeadline: IMultilingualText;
    /** Email address (non-translatable) */
    email: string;
    /** LinkedIn profile URL (non-translatable) */
    linkedin?: string;
    /** GitHub profile URL (non-translatable) */
    github?: string;
    /** Headhunter profile URL (non-translatable) */
    headhunter?: string;
}
```

#### IExperience

Work experience with translatable descriptions and achievements.

```typescript
interface IExperience {
    /** Unique identifier */
    id: number;
    /** Company name (non-translatable) */
    company: string;
    /** Job title with translations */
    title: IMultilingualText;
    /** Employment type (non-translatable) */
    employmentType?: string | null;
    /** Start date (non-translatable) */
    startDate: string;
    /** End date (non-translatable) */
    endDate?: string | null;
    /** Current position indicator (non-translatable) */
    isCurrent: boolean;
    /** Duration string (non-translatable) */
    duration: string;
    /** Work location (non-translatable) */
    location: string;
    /** Responsibilities and achievements with translations */
    description?: IMultilingualTextBlock[];
    /** Technologies used (non-translatable) */
    technologies: string[];
    /** Specific achievements with translations */
    achievements?: IMultilingualTextBlock[];
    /** Additional roles (non-translatable structure) */
    subRoles?: ISubRole[];
    /** Team size information (non-translatable) */
    teamSize?: string;
}
```

#### IPortfolio

Project portfolio with translatable descriptions.

```typescript
interface IPortfolio {
    /** Project name (non-translatable) */
    name: string;
    /** Project description with translations */
    description: IMultilingualText;
    /** Project URL (non-translatable) */
    url: string;
    /** Technologies used (non-translatable) */
    technologies: string[];
    /** Key features with translations */
    features?: IMultilingualTextBlock[];
}
```

#### IEducation

Education information with translatable field names.

```typescript
interface IEducation {
    /** Institution name (non-translatable) */
    institution: string;
    /** Degree type with translations */
    degree: IMultilingualText;
    /** Field of study with translations */
    fieldOfStudy: IMultilingualText;
    /** Start year (non-translatable) */
    startYear?: number | null;
    /** End year (non-translatable) */
    endYear?: number | null;
}
```

### 3. Root Data Structure

#### IResumeData

Main resume data structure with multilingual support.

```typescript
interface IResumeData {
    /** Metadata (non-translatable) */
    meta: IMeta;
    /** Personal information */
    personal: IPersonal;
    /** Professional summary */
    summary: IMultilingualTextBlock[];
    /** Top skills (non-translatable technical terms) */
    topSkills: string[];
    /** Certifications with translations */
    certifications: IMultilingualText[];
    /** Project portfolio */
    portfolio: IPortfolio[];
    /** Work experience */
    experience: IExperience[];
    /** Educational background */
    education: IEducation[];
    /** Technical skills by category (non-translatable) */
    skills: ISkills;
}
```

## State Transitions

### 1. Language Selection State

```typescript
// Use existing LanguageEnum from types/translation.ts
type LanguageTransition = {
    from: LanguageEnum;
    to: LanguageEnum;
    timestamp: number;
};
```

### 2. Data Loading States

```typescript
enum CVDataState {
    LOADING = 'loading',
    LOADED = 'loaded',
    ERROR = 'error'
}

type CVDataTransition = {
    state: CVDataState;
    language: LanguageEnum;
    data?: IResumeData;
    error?: string;
};
```

## Validation Rules

### 1. Required Field Validation

````typescript
interface IValidationRule {
    field: string;
    required: boolean;
    type: 'string' | 'array' | 'object';
    minLength?: number;
    pattern?: RegExp;
}

const CV_VALIDATION_RULES: IValidationRule[] = [
    { field: 'personal.name', required: true, type: 'string', minLength: 1 },
    { field: 'personal.title', required: true, type: 'string', minLength: 1 },
    { field: 'personal.email', required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    { field: 'experience', required: true, type: 'array', minLength: 0 },
    { field: 'education', required: true, type: 'array', minLength: 0 },
    { field: 'skills', required: true, type: 'object' }
];

### 2. Translatable Content Validation

```typescript
interface IMultilingualValidationRule {
    field: string;
    primaryLanguage: LanguageEnum;
    fallbackAllowed: boolean;
    maxLength?: number;
}

const MULTILINGUAL_VALIDATION_RULES: IMultilingualValidationRule[] = [
    { field: 'personal.title', primaryLanguage: LanguageEnum.EN, fallbackAllowed: true, maxLength: 100 },
    { field: 'experience.*.title', primaryLanguage: LanguageEnum.EN, fallbackAllowed: true, maxLength: 100 },
    { field: 'portfolio.*.description', primaryLanguage: LanguageEnum.EN, fallbackAllowed: true, maxLength: 500 },
    { field: 'education.*.degree', primaryLanguage: LanguageEnum.EN, fallbackAllowed: true, maxLength: 100 }
];
````

## Data Transformation Patterns

### 1. Monolingual to Multilingual Migration

```typescript
interface IMigrationPattern<T> {
    sourceField: string;
    targetField: string;
    transform: (value: T) => IMultilingualText;
}

const MIGRATION_PATTERNS: IMigrationPattern<string>[] = [
    {
        sourceField: 'personal.title',
        targetField: 'personal.title',
        transform: (value) => ({ [LanguageEnum.EN]: value })
    },
    {
        sourceField: 'experience.*.title',
        targetField: 'experience.*.title',
        transform: (value) => ({ [LanguageEnum.EN]: value })
    }
];
```

### 2. Localization Transformation

```typescript
interface ILocalizationPattern {
    language: LanguageEnum;
    fallback: LanguageEnum;
    transform: (data: IResumeData, targetLanguage: LanguageEnum) => IResumeData;
}

const LOCALIZATION_PATTERN: ILocalizationPattern = {
    language: LanguageEnum.EN,
    fallback: LanguageEnum.EN,
    transform: (data, targetLanguage) => {
        return {
            ...data,
            personal: {
                ...data.personal,
                title: getTranslation(data.personal.title, targetLanguage),
                locationHeadline: getTranslation(data.personal.locationHeadline, targetLanguage)
            }
            // ... transform other sections
        };
    }
};
```

## Performance Considerations

### 1. Memoization Strategy

```typescript
interface IMemoizationKey {
    dataHash: string;
    language: LanguageEnum;
    timestamp: number;
}

interface IMemoizationCache {
    get(key: IMemoizationKey): IResumeData | null;
    set(key: IMemoizationKey, value: IResumeData): void;
    clear(): void;
}
```

### 2. Lazy Loading Patterns

```typescript
interface ILazyLoadSection {
    section: keyof IResumeData;
    loadPriority: number;
    dependencies: string[];
}

const LAZY_LOAD_SECTIONS: ILazyLoadSection[] = [
    { section: 'personal', loadPriority: 1, dependencies: [] },
    { section: 'summary', loadPriority: 2, dependencies: ['personal'] },
    { section: 'experience', loadPriority: 3, dependencies: ['personal'] },
    { section: 'education', loadPriority: 4, dependencies: ['personal'] },
    { section: 'portfolio', loadPriority: 5, dependencies: ['experience'] },
    { section: 'skills', loadPriority: 6, dependencies: ['experience'] }
];
```

## Error Handling

### 1. Data Validation Errors

```typescript
interface IValidationError {
    field: string;
    message: string;
    code: 'MISSING_TRANSLATION' | 'INVALID_FORMAT' | 'REQUIRED_FIELD';
    severity: 'error' | 'warning';
}

interface ITranslationError extends IValidationError {
    missingLanguages: LanguageEnum[];
    availableLanguages: LanguageEnum[];
    suggestedFallback: LanguageEnum;
}
```

### 2. Fallback Error Handling

```typescript
interface IFallbackStrategy {
    primary: LanguageEnum;
    fallback: LanguageEnum;
    onError: (error: ITranslationError) => void;
    onFallback: (from: LanguageEnum, to: LanguageEnum) => void;
}

const DEFAULT_FALLBACK_STRATEGY: IFallbackStrategy = {
    primary: LanguageEnum.EN,
    fallback: LanguageEnum.EN,
    onError: (error) => console.warn(`Translation error: ${error.message}`),
    onFallback: (from, to) => console.info(`Falling back from ${from} to ${to}`)
};
```

## Integration Points

### 1. ArticleService Integration

```typescript
// Use existing ArticleService directly - no new interfaces needed!
// ArticleService already provides:
// - selectedLanguage: Signal<LanguageEnum>
// - All language management functionality
```

### 2. Component Integration

```typescript
// Use existing CvComponent - no new interfaces needed!
export class CvComponent {
    // Signal-based localized data using existing ArticleService
    readonly localizedData = computed(() => {
        return this.transformToLocalized(this.cvData, this.articleService.selectedLanguage());
    });

    // Computed getters for template access
    readonly contact = computed(() => this.localizedData().personal);
    readonly summary = computed(() => this.localizedData().summary);
    readonly experience = computed(() => this.localizedData().experience);
    readonly education = computed(() => this.localizedData().education);
    readonly skills = computed(() => this.localizedData().skills);
    readonly portfolio = computed(() => this.localizedData().portfolio);
    readonly topSkills = computed(() => this.localizedData().topSkills);
    readonly certifications = computed(() => this.localizedData().certifications);

    // Simple translation helper functions
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

This data model provides a comprehensive foundation for implementing multilingual CV support while maintaining compatibility with existing architecture and following constitutional requirements.
