# Research: Education Duration Display

**Feature**: 011-education-duration  
**Date**: 2026-05-08  
**Status**: Complete

## Research Findings

### 1. Existing Date Formatting Logic (Experience Section)

**Location**: `src/app/components/cv/cv.component.ts` (lines 146-193)

**Decision**: Reuse the existing `formatDateRange` function from the experience section for education duration formatting.

**Rationale**:

- The function already handles month/year formatting with multilingual support (English/Russian)
- It properly formats the "Start - End (duration)" pattern required by the spec
- The function uses hardcoded month arrays for both languages, which is appropriate for this CV use case
- Reusing existing code reduces duplication and maintains consistency

**Alternatives Considered**:

- Create a new dedicated education formatter: Rejected because it would duplicate logic
- Use a date library like dayjs: Rejected because the existing solution is simple and works well for the static CV use case

### 2. IEducation Interface Structure

**Current State**: `src/app/components/cv/types.ts` (lines 132-143)

```typescript
export interface IEducation {
    institution: string;
    degree: IMultilingualText;
    fieldOfStudy: IMultilingualText;
    startYear?: number | null;
    endYear?: number | null;
}
```

**Decision**: DO NOT add a duration field to IEducation. Duration will be CALCULATED from startYear and endYear at runtime.

**Rationale**:

- Education entries in the resume JSON only contain startYear and endYear
- Duration is derived data, not stored data
- Calculation allows for dynamic multilingual text generation
- Avoids data duplication and maintenance burden
- Matches the actual data structure in the JSON file

**Alternatives Considered**:

- Add duration field to JSON: Rejected because duration is derived data, not source data
- Store calculated duration in interface: Rejected because it would duplicate data and require manual updates

### 3. Multilingual Infrastructure

**Location**: `src/app/components/cv/types.ts` (lines 245-271)

**Decision**: Use the existing IMultilingualText interface for duration translations.

**Rationale**:

- IMultilingualText is already used throughout the CV data structure
- Provides built-in English/Russian support with LanguageEnum
- The getTextTranslation helper function (cv.component.ts line 138) handles translation retrieval
- English fallback is already implemented in the transformToLocalized function (line 238)

**Alternatives Considered**:

- Create a new duration-specific interface: Rejected as unnecessary complexity
- Use a different translation system: Rejected because the existing infrastructure works well

### 4. Resume JSON Structure

**Location**: `src/assets/igor_kulebyakin_resume.json`

**Current State**: Education entries have startYear and endYear but NO duration field.

**Decision**: DO NOT modify the resume JSON. Duration will be calculated from startYear and endYear at runtime.

**Rationale**:

- JSON contains only source data (years), not derived data (duration)
- Calculation is more maintainable than hardcoded duration text
- Allows for dynamic multilingual text generation based on language
- Avoids data duplication and manual updates when years change

**Alternatives Considered**:

- Add duration field to JSON: Rejected because duration is derived, not source data

### 5. Date Format for Education

**Decision**: Reuse the existing formatDateRange pattern from Experience section, adapting it for year-based duration instead of month-based.

**Rationale**:

- Experience section already has a working pattern for displaying duration
- formatDateRange handles month names and "Present" text in both languages
- Adapt this pattern to work with years (YYYY) instead of dates (YYYY-MM)
- Consistent UI/UX across Experience and Education sections
- Proven, tested code pattern

**Implementation**: Create formatYearRange that mirrors formatDateRange but:

- Takes startYear/endYear instead of startDate/endDate
- Calculates duration as simple year subtraction
- Generates multilingual duration text (English: "X years", Russian: proper grammatical form)

## Implementation Approach Summary

1. **IEducation interface**: Keep as-is (no duration field - calculated at runtime)
2. **Reuse formatDateRange pattern**: Adapt existing formatDateRange function for year-based duration (similar to Experience section)
3. **Calculate duration from years**: Simple subtraction (endYear - startYear) with multilingual text generation
4. **Update CV component template**: Add duration display between institution and field of study using same pattern as Experience section
5. **Write tests**: Add Vitest tests for duration calculation and display

## Technical Considerations

- Duration is calculated at runtime from startYear and endYear
- Duration text must be generated in both English and Russian based on language selection
- Handle null/undefined startYear and endYear gracefully
- Position duration between institution and field of study as specified in the user story
- Apply the same visual styling as the experience section duration
