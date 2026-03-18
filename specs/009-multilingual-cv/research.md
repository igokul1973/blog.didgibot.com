# Research: Multilingual CV Support

**Feature**: 009-multilingual-cv  
**Date**: 2026-03-17  
**Phase**: 0 - Outline & Research

## Research Findings

### 1. Multilingual JSON Structure Design

**Decision**: Use nested language object structure with language codes as keys

**Rationale**:

- Maintains data co-location for easy translation management
- Supports future language expansion without structural changes
- Aligns with existing `LanguageEnum` (EN/RU) pattern
- Enables simple fallback mechanisms

**Chosen Structure**:

```typescript
interface IMultilingualText {
    [LanguageEnum.EN]: string;
    [LanguageEnum.RU]?: string;
}

interface IMultilingualTextBlock {
    [LanguageEnum.EN]: ITextBlock;
    [LanguageEnum.RU]?: ITextBlock;
}
```

**Alternatives Considered**:

- Flat structure with separate language files: Rejected due to maintenance complexity
- Database-driven approach: Rejected due to static site generation requirements
- External i18n service: Rejected due to project constraints and simplicity needs

### 2. Translation Fallback Mechanism

**Decision**: Implement hierarchical fallback with English as primary fallback

**Rationale**:

- English is the source language in current data
- Guaranteed fallback availability
- Simple implementation with minimal performance impact
- Follows internationalization best practices

**Implementation Strategy**:

```typescript
private getTranslatedText(multilingualText: IMultilingualText, language: LanguageEnum): string {
  return multilingualText[language] || multilingualText[LanguageEnum.EN] || '';
}
```

**Alternatives Considered**:

- Error-on-missing-translation: Rejected due to poor user experience
- Browser language fallback: Rejected due to URL-based language selection requirement
- Random fallback selection: Rejected due to inconsistency

### 3. CV Component Integration Pattern

**Decision**: Integrate with existing `ArticleService.selectedLanguage` signal

**Rationale**:

- Leverages existing language state management
- Maintains single source of truth for language selection
- Consistent with existing application patterns
- No additional service dependencies required

**Integration Approach**:

```typescript
export class CvComponent {
    private readonly articleService = inject(ArticleService);
    protected readonly currentLanguage = this.articleService.selectedLanguage;

    private getLocalizedData(): IResumeData {
        return this.transformMultilingualData(this.cvData, this.currentLanguage());
    }
}
```

**Alternatives Considered**:

- New dedicated CV language service: Rejected due to unnecessary complexity
- Local component state: Rejected due to integration requirements with header selector
- URL-based direct reading: Rejected due to existing service abstraction

### 4. Multilingual JSON Validation

**Decision**: Extend existing validation approach with multilingual schema checks

**Rationale**:

- Maintains consistency with current data validation patterns
- Leverages existing TypeScript interfaces for type safety
- Provides runtime validation for data integrity
- Supports graceful error handling

**Validation Strategy**:

```typescript
interface IResumeData {
    meta: IMeta; // Non-translatable
    personal: {
        name: IMultilingualText;
        title: IMultilingualText;
        location: ILocation; // Non-translatable
        email: string; // Non-translatable
        // ... other fields
    };
    // ... other sections
}

function validateResumeData(data: unknown): data is IResumeData {
    // Implementation using existing validation patterns
}
```

**Alternatives Considered**:

- JSON Schema validation: Rejected due to added complexity and build-time requirements
- No validation: Rejected due to data integrity risks
- External validation library: Rejected due to project constraints

### 5. Performance Optimization Strategy

**Decision**: Use computed signals for derived multilingual data

**Rationale**:

- Leverages Angular 20 signals performance benefits
- Automatic dependency tracking and memoization
- Minimal re-computation on language changes
- Aligns with constitutional performance requirements

**Optimization Implementation**:

```typescript
export class CvComponent {
    private readonly currentLanguage = this.articleService.selectedLanguage;

    readonly localizedResumeData = computed(() => {
        return this.transformToLocalized(this.cvData, this.currentLanguage());
    });

    readonly localizedPersonal = computed(() => {
        return this.localizedResumeData().personal;
    });
}
```

**Alternatives Considered**:

- OnPush with manual change detection: Rejected due to signals superiority
- RxJS-based transformation: Rejected due to complexity and signals preference
- Real-time transformation: Rejected due to performance concerns

### 6. Testing Strategy with Playwright MCP

**Decision**: Use Playwright MCP server for visual validation of language switching

**Rationale**:

- Provides actual browser environment testing
- Validates visual correctness of language switching
- Tests integration with existing header language selector
- Meets spec requirement for IDE-based validation

**Testing Approach**:

```typescript
// Playwright MCP integration tests
describe('Multilingual CV', () => {
    test('should switch between English and Russian content', async () => {
        await page.goto('http://localhost:4200/en/cv');
        await page.click('[data-testid="language-switcher-ru"]');
        await expect(page.locator('h1')).toContainText('Игорь Кулебякин');
    });
});
```

**Alternatives Considered**:

- Unit-only testing: Rejected due to insufficient UI validation
- Manual testing only: Rejected due to automation requirements
- Cypress testing: Rejected due to Playwright MCP preference

## Resolved Technical Details

### Specific JSON Schema for Nested Multilingual Structure

**Solution**: Defined multilingual interfaces that extend existing types:

- `IMultilingualText` for simple string fields
- `IMultilingualTextBlock` for complex content blocks
- `IResumeData` as root interface (updated with multilingual fields)
- Preserves non-translatable fields (URLs, emails, technical terms)

### Translation Fallback Mechanism Implementation

**Solution**: Hierarchical fallback function:

```typescript
private getTranslation<T>(multilingual: IMultilingual<T>, language: LanguageEnum): T {
  return multilingual[language] || multilingual[LanguageEnum.EN];
}
```

- Graceful degradation to English
- Type-safe fallback handling
- Zero performance overhead for available translations

### CV Component Integration Pattern

**Solution**: Signal-based integration:

- Use existing `ArticleService.selectedLanguage` signal
- Create computed signals for localized data
- Maintain OnPush change detection
- Leverage automatic dependency tracking

### Validation Approach for Multilingual JSON Structure

**Solution**: Extended TypeScript validation:

- New interfaces extending existing types
- Runtime validation using existing patterns
- Type safety throughout the pipeline
- Error handling for malformed data

### Performance Optimization Strategy

**Solution**: Signals and computed values:

- Computed signals for data transformation
- Memoization of localized content
- Minimal re-computation on language changes
- Sub-200ms language switching target

### Testing Strategy Using Playwright MCP

**Solution**: Multi-layered testing approach:

- Unit tests for data transformation logic
- Integration tests for component behavior
- Playwright MCP for visual validation
- Automated language switching verification

## Architecture Decision Summary

All NEEDS CLARIFICATION items have been resolved through research and analysis:

1. ✅ **JSON Schema**: Nested multilingual structure with language-specific objects
2. ✅ **Fallback Mechanism**: Hierarchical fallback with English as primary
3. ✅ **Integration Pattern**: Signal-based integration with existing services
4. ✅ **Validation Approach**: Extended TypeScript interfaces with runtime validation
5. ✅ **Performance Strategy**: Computed signals with memoization
6. ✅ **Testing Strategy**: Multi-layered approach with Playwright MCP integration

## Next Steps

With all technical clarifications resolved, proceed to Phase 1: Design & Contracts to create:

- `data-model.md` with detailed entity definitions
- API contracts in `/contracts/` directory
- `quickstart.md` with implementation guidance
- Agent context updates for new multilingual patterns
