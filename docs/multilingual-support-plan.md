# Multilingual Resume Support Plan

This plan outlines the approach to implement multilingual support for the resume JSON data using a nested language structure, starting with English and Russian, while preserving all non-translatable technical data.

## Current State Analysis

The existing resume JSON (`src/assets/igor_kulebyakin_resume.json`) contains:

- Personal information (name, title, location)
- Summary paragraphs and job descriptions
- Skills, certifications, and technical data
- Portfolio projects with descriptions
- Work experience and education details

## Proposed Multilingual Structure

### Language Mapping Strategy

All translatable text fields will be converted to nested objects with language keys:

```json
{
    "personal": {
        "title": {
            "en": "Javascript Fullstack Developer",
            "ru": "JavaScript Fullstack Разработчик"
        },
        "location": {
            "city": "Happy Valley",
            "state": "Oregon",
            "country": "USA",
            "display": {
                "en": "Happy Valley, Oregon, USA",
                "ru": "Хэппи Вэлли, Орегон, США"
            }
        }
    }
}
```

The language sections must be co-located with one another so it was easier to make corresponding changes in another language(s) when the source language text changed.

### Translatable Fields Classification

**Always Translatable:**

- Personal title, location display text
- Summary paragraph text content
- Job description text content
- Portfolio project descriptions
- Education degree fields and institution names
- Dates and date ranges

**Never Translatable (Universal):**

- URLs (LinkedIn, GitHub, portfolio links)
- Technical skill names
- Technology stack names
- Email addresses
- Meta information

**Conditional Translation:**

- Location city/state names (can remain in original form)
- Certification names (if they have official translations)
- Company names. Upon initial translation Russian version must have the same text as the English one, the Russian translation will be made, if needed, manually.

## Implementation Phases

### Phase 1: Structure Design

1. Create field mapping of all translatable content
2. Change existing JSON schema validation (check the appropriate tests)
3. Update TypeScript interfaces for new structure

### Phase 2: Data Migration

1. Migrate existing English content to new nested structure
2. Add Russian translations for all identified fields
3. Validate structure completeness

### Phase 3: Integration Support

1. Update any components consuming the resume data (main component - `cv.component.ts`)
2. Add language selection logic
3. Implement fallback to English for missing translations

## Validation Criteria

- Tests are changed and to reflect current changes
- All existing English content preserved in new structure
- Russian translations provided for all translatable fields
- Non-translatable fields remain unchanged
- JSON structure remains valid and parseable
- TypeScript interfaces updated for type safety

## Success Metrics

- 100% of translatable fields have Russian translations
- Zero data loss during migration
- All existing functionality preserved
- Structure supports easy addition of new languages
- All tests are passing
