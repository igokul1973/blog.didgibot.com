# Feature Specification: CV Source of Truth Refactor

**Feature Branch**: `008-cv-source-refactor`  
**Created**: 2025-03-08  
**Status**: Draft  
**Input**: User description: "Recreate CV feature. It is now based on a single source of truth - igor_kulebyakin_resume.json. First the json itself must be redone with camelCase keys. Second, redo all the contracts/interfaces as well as reference to them in src/app/components/cv/cv.component.ts and elsewhere where those references can be used based on this new JSON file. The sole purpose of this fix is to have a new source of truth for the existing CV feature/page."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - JSON Structure Standardization (Priority: P1)

As a developer maintaining the CV data, I want all JSON keys to follow camelCase naming convention so that the data structure is consistent with TypeScript/JavaScript standards and easier to work with programmatically.

**Why this priority**: This is foundational work that enables all subsequent development and ensures consistency with modern JavaScript/TypeScript practices.

**Independent Test**: Can be fully tested by validating that all JSON keys follow camelCase convention and that the JSON file remains valid and parseable.

**Acceptance Scenarios**:

1. **Given** the original resume JSON with snake_case and mixed-case keys, **When** the refactoring script runs, **Then** all keys are converted to camelCase while preserving all data values and structure
2. **Given** the refactored JSON file, **When** parsed by JSON.parse(), **Then** it successfully parses without errors and maintains all original data integrity

---

### User Story 2 - Interface Contracts Update (Priority: P1)

As a developer working on the CV component, I want TypeScript interfaces that match the new JSON structure so that I have proper type safety and autocompletion when working with CV data.

**Why this priority**: Type safety is critical for maintaining code quality and preventing runtime errors in the CV component.

**Independent Test**: Can be fully tested by compiling the TypeScript code and verifying that all interfaces correctly match the JSON structure without type errors.

**Acceptance Scenarios**:

1. **Given** the new camelCase JSON structure, **When** the interfaces are generated/updated, **Then** all interface properties match the JSON keys exactly
2. **Given** the updated interfaces, **When** the CV component compiles, **Then** there are zero TypeScript type errors related to CV data structures

---

### User Story 3 - CV Component Integration (Priority: P1)

As a user viewing the CV page, I want to see the same professional information displayed correctly so that the CV functionality remains intact while using the new data source.

**Why this priority**: This ensures the end-user experience remains unchanged while the underlying architecture is improved.

**Independent Test**: Can be fully tested by loading the CV page and verifying all data sections display correctly with the new JSON structure.

**Acceptance Scenarios**:

1. **Given** the updated CV component using new interfaces, **When** the CV page loads, **Then** all personal information displays correctly
2. **Given** the new data structure, **When** the experience section renders, **Then** all work history entries appear with correct company names, positions, durations, and descriptions
3. **Given** the refactored data source, **When** the education and skills sections load, **Then** all data displays accurately and completely

---

### Edge Cases

- What happens when the JSON file contains missing or null fields?
- How does system handle malformed JSON during the transition period?
- What happens if interface properties don't match JSON keys after refactoring?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST convert all JSON keys from snake_case/mixed-case to camelCase format
- **FR-002**: System MUST preserve all data values and structural hierarchy during key conversion
- **FR-003**: System MUST update TypeScript interfaces to exactly match the new JSON structure
- **FR-004**: System MUST maintain CV component functionality with zero display changes for end users
- **FR-005**: System MUST validate JSON integrity after key conversion process
- **FR-006**: System MUST provide type safety for all CV data access patterns

### Technical Requirements _(Constitution Compliance)_

- **TR-001**: All components MUST use OnPush change detection strategy by default
- **TR-002**: All TypeScript code MUST follow strict mode with proper interfaces
- **TR-003**: All UI components MUST meet WCAG 2.1 accessibility standards
- **TR-004**: All features MUST support static site generation
- **TR-005**: All new code MUST have Vitest tests with 90% minimum coverage
- **TR-006**: Signals MUST be preferred over RxJS unless RxJS is more appropriate
- **TR-007**: All user inputs MUST be sanitized using Angular's XSS protection

### Key Entities _(include if feature involves data)_

- **ResumeData**: The complete CV information structure containing personal details, experience, education, skills, and projects
- **IPersonal**: Personal contact information including name, title, location, email, and social profiles (consistent with interface naming)
- **IExperience**: Professional work history entries with company details, positions, durations, and responsibilities
- **IEducation**: Academic background information including institutions, degrees, and time periods
- **ISkills**: Categorized technical skills organized by technology domains

## Clarifications

### Session 2025-03-08

- Q: Data Migration Strategy - Should the CV component continue using hardcoded data as fallback during the transition, or should it immediately switch to using only the JSON file as the single source of truth? → A: Immediately switch to JSON-only approach to establish true single source of truth and eliminate data duplication.
- Q: JSON Loading Strategy - How should the CV component load and access the JSON data file? → A: Import JSON as TypeScript module at build time for static site generation.
- Q: Interface Generation Approach - Should the TypeScript interfaces be manually written based on the JSON structure, or automatically generated from the JSON schema? → A: Manually create interfaces for precise control and optimal TypeScript typing.
- Q: Error Handling Strategy - How should the CV component handle JSON parsing errors or missing data fields? → A: Fail fast with error page and detailed error logging.
- Q: Testing Scope for JSON Validation - What level of automated testing should be implemented for JSON structure validation? → A: Unit tests for interface compliance plus integration tests for component rendering.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of JSON keys follow camelCase naming convention
- **SC-002**: Zero TypeScript compilation errors related to CV data structures
- **SC-003**: CV page displays all sections correctly with no data loss
- **SC-004**: Developer productivity improved through better type safety and autocompletion

### Constitution Compliance Metrics

- **CC-001**: Lighthouse performance score ≥ 90 for all pages
- **CC-002**: WCAG 2.1 accessibility compliance with zero high-severity violations
- **CC-003**: Vitest test coverage ≥ 90% for all new code
- **CC-004**: ESLint/Prettier compliance with zero errors before commits
- **CC-005**: Static site generation successful with all content properly indexed
- **CC-006**: Bundle size optimization meeting performance budgets
- **CC-007**: Security scan passes with zero high-severity vulnerabilities
