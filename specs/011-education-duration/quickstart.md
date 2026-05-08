# Quickstart: Education Duration Display

**Feature**: 011-education-duration  
**Date**: 2026-05-08  
**Status**: Ready for Implementation

## Overview

This feature adds education duration display to the CV page, showing start year, end year, and duration text for each education entry. The duration is displayed between the institution name and field of study, matching the visual style of the experience section.

## Prerequisites

- Angular 20.3.15
- TypeScript 5.9.3
- Vitest 4.1.0

## Implementation Steps

### Step 1: Add Shared Duration Helper and Year-Based Formatter

**File**: `src/app/components/cv/cv.component.ts`

Add a shared helper for duration text generation (can be reused by both Experience and Education), then add formatYearRange:

```typescript
// Shared helper: Get duration text in the selected language
// This can potentially be reused by formatDateRange in the future
private getDurationText(years: number, language: LanguageEnum): string {
    if (language === LanguageEnum.RU) {
        // Russian: proper grammatical form based on number
        const lastDigit = years % 10;
        const lastTwoDigits = years % 100;

        if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
            return `${years} лет`;
        } else if (lastDigit === 1) {
            return `${years} год`;
        } else if (lastDigit >= 2 && lastDigit <= 4) {
            return `${years} года`;
        } else {
            return `${years} лет`;
        }
    } else {
        // English: singular/plural
        return years === 1 ? '1 year' : `${years} years`;
    }
}

// Format year range with duration: "YYYY - YYYY (X years)"
formatYearRange(
    startYear: number | null | undefined,
    endYear: number | null | undefined,
    language: LanguageEnum
): string {
    const presentText = language === LanguageEnum.RU ? 'Настоящее время' : 'Present';

    const start = startYear ? startYear.toString() : '?';
    const end = endYear ? endYear.toString() : presentText;

    // Calculate duration if both years are present
    let duration: string | undefined;
    if (startYear && endYear) {
        const years = endYear - startYear;
        duration = this.getDurationText(years, language);
    }

    if (duration) {
        return `${start} - ${end} (${duration})`;
    }
    return `${start} - ${end}`;
}
```

### Step 2: Update CV Component Template

**File**: `src/app/components/cv/cv.component.html`

Add duration display between institution and field of study in the education section:

```html
<section class="education-section">
    <h3>{{ getSectionHeading('education') }}</h3>
    @for (edu of education(); track $index) {
    <mat-list-item class="education-item">
        <div class="education-header">
            <h4 class="institution">{{ edu.institution }}</h4>
            @if (edu.startYear || edu.endYear) {
            <p class="duration">{{ formatYearRange(edu.startYear, edu.endYear, articleService.selectedLanguage()) }}</p>
            }
        </div>
        <h5 class="degree">{{ edu.degree }}</h5>
        <p class="field-of-study">{{ edu.fieldOfStudy }}</p>
    </mat-list-item>
    }
</section>
```

### Step 4: Add CSS Styling

**File**: `src/app/components/cv/cv.component.scss`

Add styling for education duration (matching experience section style):

```scss
.education-item {
    .education-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;

        .duration {
            font-size: 0.875rem;
            color: rgba(0, 0, 0, 0.6);
            margin: 0;
        }
    }
}
```

### Step 5: Write Tests

**File**: `src/app/components/cv/cv.component.spec.ts`

Add tests for the new duration display functionality:

```typescript
describe('Education Duration', () => {
    it('should calculate duration text in English', () => {
        const result = component['calculateDurationText'](2005, 2008, LanguageEnum.EN);
        expect(result).toBe('3 years');
    });

    it('should calculate duration text in Russian', () => {
        const result = component['calculateDurationText'](2005, 2008, LanguageEnum.RU);
        expect(result).toBe('3 года');
    });

    it('should handle singular year in English', () => {
        const result = component['calculateDurationText'](2005, 2006, LanguageEnum.EN);
        expect(result).toBe('1 year');
    });

    it('should handle singular year in Russian', () => {
        const result = component['calculateDurationText'](2005, 2006, LanguageEnum.RU);
        expect(result).toBe('1 год');
    });

    it('should return undefined for missing years', () => {
        const result1 = component['calculateDurationText'](2005, null, LanguageEnum.EN);
        const result2 = component['calculateDurationText'](null, 2008, LanguageEnum.EN);
        expect(result1).toBeUndefined();
        expect(result2).toBeUndefined();
    });

    it('should format year range with calculated duration', () => {
        const result = component.formatYearRange(2005, 2008, LanguageEnum.EN);
        expect(result).toBe('2005 - 2008 (3 years)');
    });

    it('should handle missing end year', () => {
        const result = component.formatYearRange(2005, null, LanguageEnum.EN);
        expect(result).toBe('2005 - Present');
    });

    it('should handle missing start year', () => {
        const result = component.formatYearRange(null, 2008, LanguageEnum.EN);
        expect(result).toBe('? - 2008');
    });

    it('should not display duration when both years are null', () => {
        const result = component.formatYearRange(null, null, LanguageEnum.EN);
        expect(result).toBe('? - Present');
    });

    it('should render education duration in Russian', () => {
        fixture.detectChanges();
        const durations = compiled.querySelectorAll('.education-section .duration');
        expect(durations.length).toBeGreaterThan(0);
        // Check for Russian translation
    });
});
```

### Step 6: Verify Implementation

1. Run tests: `pnpm test:headless`
2. Check test coverage: `pnpm test:coverage`
3. Build the project: `pnpm build`
4. Verify CV page displays education duration in both languages
5. Use MCP Playwright to switch languages and verify correct rendering

## Edge Cases to Test

- Education entry with null startYear and valid endYear
- Education entry with valid startYear and null endYear
- Education entry with both null startYear and endYear
- Education entry with only one year (duration cannot be calculated)
- Language switching (English ↔ Russian)
- Singular vs plural duration text (1 year vs 3 years)

## Success Criteria

- [ ] Education duration displays in correct position (between institution and field of study)
- [ ] Duration text is properly translated in both English and Russian
- [ ] Null years are handled gracefully with appropriate placeholders
- [ ] Missing translations fall back to English
- [ ] Visual styling matches experience section
- [ ] All tests pass with 90%+ coverage
- [ ] MCP Playwright verification confirms correct rendering

## Notes

- Duration is CALCULATED at runtime from startYear and endYear, NOT stored in JSON
- Duration text is generated dynamically in both English and Russian based on language selection
- Russian duration text uses proper grammatical forms (год/года/лет) based on the number
- No changes to IEducation interface needed
- No changes to resume JSON needed
- No API changes required (display-only feature)
- Tests must be written before implementation (Test-First Development)
