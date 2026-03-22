# Feature Specification: Multilingual CV Support

**Feature Branch**: `009-multilingual-cv`  
**Created**: 2026-03-17  
**Status**: Draft  
**Input**: User description: "Create new specs for multilingual CV support, using docs/multilingual-support-plan.md (which will be deleted after implementation). In a few words, change the src/assets/igor_kulebyakin_resume.json structure and all corresponding resources so that the src/app/components/cv/cv.component.ts could switch between English and Russian. Other language support might be added later. Don't forget all the rules and workflows. The Playwright MCP server should be used to make sure the UI can switch the CV between languages. All tests must pass at the end."

## User Scenarios & Testing _(mandatory)_

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Multilingual Data Structure (Priority: P1)

System needs to store and retrieve CV content in both English and Russian languages (just 2 languages, for now, with possible further expansion into other languages) from a structured JSON format, working with the existing language selector in the header. The new JSON structure must co-locate language translations for easy change of other languages upon changes in the source language.

**Why this priority**: This is the foundational data structure that enables all multilingual functionality - without it, no language switching is possible.

**Independent Test**: The language selector already exists in the header so the feature can be fully tested by using the language selector and verifying that clicking language buttons switches all CV content between English and Russian versions.

**Acceptance Scenarios**:

1. **Given** the updated resume JSON structure, **When** the system loads the data, **Then** all translatable fields contain both English and Russian versions
2. **Given** a field with missing Russian translation, **When** the system displays the CV, **Then** it falls back to English content
3. **Given** the JSON structure, **When** validating the schema, **Then** all required multilingual fields are present and properly formatted
4. **Given** the CV page is loaded in English, **When** user clicks the Russian language button in header, **Then** all translatable CV content displays in Russian
5. **Given** the CV page is loaded in Russian, **When** user clicks the English language button in header, **Then** all translatable CV content displays in English

---

### Edge Cases

- What happens when a specific field is missing Russian translation?
- How does system handle malformed multilingual JSON structure?
- What happens when user's browser language is neither English nor Russian?
- How does system handle RTL language requirements for future languages?
- What happens when JavaScript is disabled and language selector doesn't work?
- How does system handle language switching during page loading or data fetching?
- What happens when URL language parameter is invalid or missing?

## Requirements _(mandatory)_

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
  CONSTITUTION COMPLIANCE: All requirements must support static site generation,
  accessibility (WCAG 2.1), and Angular 20 best practices.
-->

### Functional Requirements

- **FR-001**: System MUST integrate with existing language selection UI in header
- **FR-002**: System MUST store CV content in nested language structure with "en" and "ru" keys
- **FR-003**: System MUST display all translatable content in the selected language
- **FR-004**: System MUST fall back to English content when Russian translation is missing
- **FR-005**: System MUST work with URL-based language selection, using browser language as fallback only if URL parameter is missing
- **FR-006**: System MUST maintain non-translatable fields (URLs, emails, technical terms) in original format
- **FR-007**: System MUST support easy addition of new languages in the future through language-agnostic JSON structure
- **FR-008**: System MUST validate multilingual JSON structure on load using expanded existing validation approach
- **FR-009**: System MUST provide smooth language switching without page reload (target: <1 second)
- **FR-010**: System MUST maintain all existing CV functionality and current (English) data while adding multilingual support
- **FR-011**: System MUST be validated through IDE using Playwright MCP server for visual testing of language switching functionality

### Technical Requirements _(Constitution Compliance)_

- **TR-001**: New components MUST use OnPush change detection strategy by default
- **TR-002**: All TypeScript code MUST follow strict mode with proper interfaces
- **TR-003**: All UI components MUST meet WCAG 2.1 accessibility standards
- **TR-004**: All features MUST support static site generation
- **TR-005**: All new code MUST have Vitest tests with 90% minimum coverage
- **TR-006**: Signals MUST be preferred over RxJS unless RxJS is more appropriate
- **TR-007**: All user inputs MUST be sanitized using Angular's XSS protection

_Example of marking unclear requirements:_

- **FR-006**: System MUST authenticate users via [NEEDS CLARIFICATION: auth method not specified - email/password, SSO, OAuth?]
- **FR-007**: System MUST retain user data for [NEEDS CLARIFICATION: retention period not specified]

### Key Entities

- **Multilingual Resume Data**: JSON structure containing nested language objects for translatable content
- **URL Language Parameter**: Language selection handled via URL paths (no localStorage needed)
- **Existing Language Selector**: Header component that already handles language switching
- **Translation Fallback**: Mechanism to use English content when target language is missing
- **Translatable Field**: All text fields except emails, URLs, company names and technical terms
- **Non-Translatable Field**: Content that remains universal across languages (URLs, emails, company names and technical terms)

## Clarifications

### Session 2026-03-17

- Q: What specific CV fields should be considered "translatable" versus "non-translatable"? → A: All text fields are translatable except emails, URLs, technical terms, technology names (such as programming languages and frameworks) and company names;
- Q: How should the system handle malformed or incomplete multilingual JSON structure during loading? → A: Use existing JSON validation approach expanded for multilingual structure, handle errors exactly as current system does
- Q: What performance expectations exist beyond the 1-second language switching target? → A: No additional performance requirements beyond 1-second switching; maintain current page load speeds and bundle sizes
- Q: How should the system handle browser language detection when the user's preferred language is neither English nor Russian? → A: Use browser language as fallback only if URL language parameter is missing
- Q: What architectural considerations should be made for future language expansion beyond English and Russian? → A: Design JSON structure with language-agnostic nesting pattern that can accommodate any language code without code changes

## Success Criteria _(mandatory)_

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
  CONSTITUTION COMPLIANCE: Include metrics for accessibility, performance, and code quality.
-->

### Measurable Outcomes

- **SC-001**: Users can switch between English and Russian CV content in under 1 second using existing header selector
- **SC-002**: 100% of translatable CV fields have Russian translations available
- **SC-003**: Language switching via URL paths works correctly in 100% of test cases
- **SC-004**: Zero data loss during migration from single-language to multilingual structure
- **SC-005**: All existing CV functionality remains intact after multilingual implementation
- **SC-006**: Language switching functionality works correctly when validated through IDE using Playwright MCP server
- **SC-007**: Visual validation using Playwright MCP server confirms proper
  language switching UI behavior

### Constitution Compliance Metrics

- **CC-001**: Lighthouse performance score ≥ 90 for all pages
- **CC-002**: WCAG 2.1 accessibility compliance with zero high-severity violations
- **CC-003**: Vitest test coverage ≥ 90% for all new code
- **CC-004**: ESLint/Prettier compliance with zero errors before commits
- **CC-005**: Static site generation successful with all content properly indexed
- **CC-006**: Bundle size optimization meeting performance budgets
- **CC-007**: Security scan passes with zero high-severity vulnerabilities
