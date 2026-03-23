# Feature Specification: CV PDF Download

**Feature Branch**: `010-cv-pdf-download`  
**Created**: 2026-03-23  
**Status**: Draft
**Input**: User description: "Any user should be able to download PDF version of the resume (CV) in Russian or English from the CV page by selecting necessary language in the header's language dropdown and then clicking the Download PDF icon. The icon must be located to the right of, (right-justified) the `Curriculum Vitae / Resume` title. The PDF version of the resume must look professional and compact."

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

### User Story 1 - Download CV PDF in Selected Language (Priority: P1)

Any user visiting the CV page should be able to download a professional-looking PDF version of the resume in their preferred language (Russian or English) by selecting the language from the dropdown and clicking the download icon next to the title.

**Why this priority**: This is the core functionality that delivers immediate value to users who need offline or shareable resume versions.

**Independent Test**: Can be fully tested by navigating to CV page, selecting a language, clicking download, and verifying the pre-compiled PDF is served with correct content and language.

**Acceptance Scenarios**:

1. **Given** user is on the CV page, **When** they select "English" from language dropdown and click download icon, **Then** a professional PDF resume in English is downloaded
2. **Given** user is on the CV page, **When** they select "Russian" from language dropdown and click download icon, **Then** a professional PDF resume in Russian is downloaded
3. **Given** user is on the CV page, **When** they click download icon without changing language, **Then** PDF is downloaded in the currently selected language
4. **Given** user is on mobile device, **When** they click download icon, **Then** PDF downloads successfully with mobile-optimized layout

---

### User Story 2 - Professional PDF Layout and Styling (Priority: P2)

The downloaded PDF must maintain a professional appearance with proper formatting, typography, and layout that reflects well on the candidate's presentation. The layout must be optimized for both printing and reading - compact enough to use minimal pages while maintaining comfortable readability. The color scheme should be consistent with the website's design.

**Why this priority**: Professional appearance is critical for resume effectiveness and user satisfaction.

**Independent Test**: Can be tested by generating pre-compiled PDFs and visually inspecting layout, typography, spacing, and overall professional appearance.

**Acceptance Scenarios**:

1. **Given** pre-compiled PDF is available, **When** opened, **Then** it displays consistent typography and proper spacing throughout
2. **Given** pre-compiled PDF is available, **When** printed, **Then** layout remains professional and readable
3. **Given** pre-compiled PDF contains contact information, **When** viewed, **Then** all links and contact details are clearly visible and accessible
4. **Given** pre-compiled PDF is available, **When** reviewed for page count, **Then** it uses minimal pages while maintaining comfortable reading font size and spacing

---

### Edge Cases

- What happens when PDF generation fails due to missing data for a language? → **Use standard snackbar error handling pattern with 5000ms duration, right/top positioning, and 'error-snackbar' panel class**
- How does system handle very long content that might overflow PDF pages? → **MUST prevent page overflow with dynamic content fitting**
- What happens when user rapidly clicks download multiple times? → **MUST prevent with debouncing (500ms) - debouncing chosen over throttling to ensure only the last click in rapid sequence triggers download, preventing duplicate downloads**

---

## Clarifications

### Session 2026-03-23

- Q: Which PDF library should be used for local frontend PDF generation? → A: jsPDF
- Q: What PDF pre-compilation strategy should be used? → A: Build-time pre-compilation - Generate all PDFs during build, store as assets
- Q: How should PDF generator access CV data from Angular tokens? → A: Use existing RESUME_DATA_TOKEN for runtime language synchronization; build-time generation uses direct JSON import (same data source)
- Q: What print quality specifications should be used for PDFs? → A: 300 DPI with vector fonts and embedded fonts for professional printing
- Q: Where should pre-compiled PDF assets be stored? → A: /assets/cv/pdfs/ - Standard assets folder with language-specific filenames
- Q: What are the styling requirements for PDF layout? → A: PDF styling must be optimized for both printing and reading - compact enough to use minimal pages while maintaining comfortable readability

---

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide a download icon positioned to the right of the CV/Resume title
- **FR-002**: System MUST generate PDF content based on the currently selected language from header dropdown
- **FR-003**: System MUST create professional-looking PDF with proper typography and layout
- **FR-008**: System MUST optimize PDF layout for both printing and reading - compact enough to minimize pages while maintaining comfortable readability
- **FR-009**: System MUST prevent page overflow by dynamically fitting content within page boundaries
- **FR-004**: System MUST support all languages available in the language dropdown
- **FR-005**: System MUST trigger browser download when user clicks the download icon
- **FR-006**: System MUST handle PDF generation errors gracefully with user feedback using standard snackbar pattern (5000ms duration, right/top positioning, 'error-snackbar' panel class)
- **FR-007**: System MUST ensure PDF content matches the displayed CV content in the selected language

### Technical Requirements _(Constitution Compliance)_

- **TR-001**: All components MUST use OnPush change detection strategy by default
- **TR-002**: All TypeScript code MUST follow strict mode with proper interfaces
- **TR-003**: All UI components MUST meet WCAG 2.1 accessibility standards
- **TR-004**: All features MUST support static site generation
- **TR-005**: All new code MUST have Vitest tests with 90% minimum coverage
- **TR-006**: Signals MUST be preferred over RxJS unless RxJS is more appropriate
- **TR-007**: All user inputs MUST be sanitized using Angular's XSS protection
- **TR-008**: PDF generation MUST use jsPDF library with 300 DPI print quality
- **TR-009**: PDFs MUST be pre-compiled during build time and stored in /assets/cv/pdfs/
- **TR-010**: Runtime language synchronization MUST use existing RESUME_DATA_TOKEN; build-time PDF generation uses direct JSON import

### Key Entities _(include if feature involves data)_

- **CV Data**: IResumeData interface with multilingual content (English/Russian) including personal info, experience, education, skills, portfolio
- **RESUME_DATA_TOKEN**: Existing Angular InjectionToken used for runtime language synchronization between CV and PDF download components
- **Language Configuration**: LanguageEnum.EN/RU with IMultilingualText interfaces for content localization
- **PDF Template**: jsPDF-based layout definitions for professional 300 DPI printing
- **Download Event**: User interaction triggering download of pre-compiled PDF assets from /assets/cv/pdfs/

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can download PDF in any supported language within 3 seconds of clicking download
- **SC-002**: PDF generation success rate ≥ 99% across all supported languages
- **SC-003**: 95% of users report PDF quality as "professional" or "very professional" in feedback
- **SC-004**: PDF file size optimized to under 500KB for fast downloads and sharing

### Constitution Compliance Metrics

- **CC-001**: Lighthouse performance score ≥ 90 for all pages
- **CC-002**: WCAG 2.1 accessibility compliance with zero high-severity violations
- **CC-003**: Vitest test coverage ≥ 90% for all new code
- **CC-004**: ESLint/Prettier compliance with zero errors before commits
- **CC-005**: Static site generation successful with all content properly indexed
- **CC-006**: Bundle size optimization meeting performance budgets
- **CC-007**: Security scan passes with zero high-severity vulnerabilities
