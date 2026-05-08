# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`  
**Created**: [DATE]  
**Status**: Draft  
**Input**: User description: "$ARGUMENTS"

## Clarifications

### Session 2026-05-08

- Q: What is the expected data volume/scale for education entries? → A: Small scale (≤100 education entries) with static JSON files
- Q: How should the system handle JSON loading failures? → A: JSON does not fail to load as it already has built-in json-failure handling
- Q: What user roles/personas should be supported? → A: Remove any authentication requirements as it is accessible to anyone
- Q: How should missing translations be handled? → A: Fall back to English if translation is missing
- Q: What features are explicitly out of scope? → A: Only duration display (no editing, no analytics, no search)

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

### User Story 1 - View Education Duration in Any Language on CV page (Priority: P1)

A visitor (no authentication required, publicly accessible) viewing the CV page in any supported language sees the duration (start year, end year, and duration text) displayed for each education entry, positioned between the institution name and field of study, matching the visual style of the experience section. The duration text must be properly translated to the selected language using the existing multilingual infrastructure, falling back to English if translation is missing.

**Why this priority**: This is the core functionality requested by the user - displaying education duration information in a consistent, user-friendly manner across all supported languages.

**Independent Test**: Can be fully tested by loading the CV page in each supported language and verifying that education entries display duration information in the correct position and format with proper translations. Must use MCP Playwright to switch languages and verify correct rendering.

**Acceptance Scenarios**:

1. **Given** the CV page is loaded in any supported language, **When** the user views the Education section, **Then** each education entry with valid start/end years displays duration formatted as "Start Year - End Year (duration text)" in the selected language
2. **Given** an education entry has startYear=2005 and endYear=2008, **When** rendered in any language, **Then** the duration displays with the year range and the duration text translated to that language
3. **Given** an education entry has null startYear and endYear, **When** rendered in any language, **Then** no duration is displayed for that entry
4. **Given** the user switches to a different language, **When** the Education section updates, **Then** all duration text updates to the new language without page reload
5. **Given** the CV page is loaded in a language where duration cannot be calculated (missing year data), **When** rendered, **Then** the system displays only the year range without duration text

---

### Edge Cases

- What happens when an education entry has null startYear but valid endYear? Display "? - End Year" (duration cannot be calculated)
- What happens when an education entry has valid startYear but null endYear? Display "Start Year - Present" (duration cannot be calculated)
- What happens when an education entry has both null startYear and endYear? Don't display duration for that entry
- How does the system handle education entries with only one year specified? Display the available year with "?" placeholder for the missing year

### Out of Scope

- Education entry editing or modification (display only)
- Analytics or tracking of education entry views
- Search or filtering capabilities for the education section
- User authentication or authorization (publicly accessible CV)

## Requirements _(mandatory)_

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
  CONSTITUTION COMPLIANCE: All requirements must support static site generation,
  accessibility (WCAG 2.1), and Angular 20 best practices.
-->

### Functional Requirements

- **FR-001**: System MUST display education duration for each education entry that has startYear or endYear data
- **FR-002**: System MUST position the duration display between the institution name and field of study in the Education section
- **FR-003**: System MUST format duration as "Start Year - End Year (duration text)" matching the experience section style
- **FR-004**: System MUST support multilingual duration text for ALL supported languages using the existing multilingual infrastructure
- **FR-005**: System MUST handle null startYear or endYear gracefully with appropriate placeholder text
- **FR-006**: System MUST not display duration for education entries where both startYear and endYear are null
- **FR-007**: System MUST reuse existing date formatting logic from the experience section where possible
- **FR-008**: System MUST create or update tests to verify education duration rendering across ALL supported languages
- **FR-009**: System MUST use MCP Playwright to switch languages and verify correct duration rendering in each language

### Technical Requirements _(Constitution Compliance)_

- **TR-001**: All components MUST use OnPush change detection strategy by default
- **TR-002**: All TypeScript code MUST follow strict mode with proper interfaces (no explicit any types)
- **TR-003**: All UI components MUST meet WCAG 2.1 accessibility standards
- **TR-004**: All features MUST support static site generation
- **TR-005**: All new code MUST have Vitest tests with 90% minimum coverage
- **TR-006**: Signals MUST be preferred over RxJS unless RxJS is more appropriate
- **TR-007**: All user inputs MUST be sanitized using Angular's XSS protection
- **TR-008**: Education duration formatting logic MUST be testable in isolation
- **TR-009**: Type definitions MUST be updated before implementation to ensure type safety
- **TR-010**: All tests MUST pass before feature completion

### Key Entities _(include if feature involves data)_

- **Education Entry**: Represents a single educational credential with institution, degree, field of study, start year, end year, and duration text
- **Duration Text**: Multilingual text object containing English and Russian translations of the duration description (e.g., "3 years" / "3 года")
- **Year Range**: Formatted string combining start year, end year, and duration text for display

## Success Criteria _(mandatory)_

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
  CONSTITUTION COMPLIANCE: Include metrics for accessibility, performance, and code quality.
-->

### Measurable Outcomes

- **SC-001**: Users viewing the CV in ANY supported language can see education duration for all entries with year data
- **SC-002**: Education duration displays with proper translations in all supported languages
- **SC-003**: Education duration displays in the correct position (between institution and field of study) with consistent styling
- **SC-004**: All existing tests continue to pass after implementation
- **SC-005**: New tests for education duration achieve 90%+ code coverage across all supported languages
- **SC-006**: MCP Playwright verification confirms correct duration rendering when switching between languages

### Constitution Compliance Metrics

- **CC-001**: Lighthouse performance score ≥ 90 for all pages
- **CC-002**: WCAG 2.1 accessibility compliance with zero high-severity violations
- **CC-003**: Vitest test coverage ≥ 90% for all new code
- **CC-004**: ESLint/Prettier compliance with zero errors before commits
- **CC-005**: Static site generation successful with all content properly indexed
- **CC-006**: Bundle size optimization meeting performance budgets
- **CC-007**: Security scan passes with zero high-severity vulnerabilities
