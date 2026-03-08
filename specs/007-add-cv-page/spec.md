# Feature Specification: Add CV Page

**Feature Branch**: `007-add-cv-page`  
**Created**: 2026-03-02  
**Status**: Draft  
**Input**: User description: "Add a page with my CV (see Igor_linked_in_profile_2026-03-02.html for reference - only use text from here). Add a link to the page on the top menu, using some appropriate icon. The link route must be /cv. Use only appropriate already-used libraries, icons and fonts for styling and formatting. The style must be the same as all other pages, such as / (home) or /blog"

## Clarifications

### Session 2026-03-02

- Q: How should the CV content be structured and stored in the Angular application? → A: Store as structured TypeScript data object with proper interfaces for each CV section (Contact, Summary, Skills, Experience, Education)

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

### User Story 1 - Display CV Content (Priority: P1)

As a visitor to the blog, I want to view Igor's professional CV so that I can learn about his qualifications, experience, and background.

**Why this priority**: This is the core functionality - without displaying the CV content, the feature provides no value to users.

**Independent Test**: Can be fully tested by navigating to /cv route and verifying the CV content is properly displayed and readable.

**Acceptance Scenarios**:

1. **Given** I am on any page of the blog, **When** I navigate to the /cv route, **Then** I should see Igor's CV content displayed in a professional, readable format
2. **Given** I am viewing the CV page, **When** the page loads, **Then** all sections of the CV should be properly formatted and accessible
3. **Given** I am viewing the CV page and it styling, background and fonts are the same as other blog pages

---

### User Story 2 - Access CV from Navigation (Priority: P1)

As a visitor to the blog, I want to easily access the CV page from the main navigation so that I can quickly find Igor's professional information.

**Why this priority**: Navigation is essential for discoverability - users should be able to find the CV without knowing the specific URL.

**Independent Test**: Can be fully tested by clicking the CV icon in the header navigation and verifying it navigates to the CV page.

**Acceptance Scenarios**:

1. **Given** I am viewing the blog on desktop, **When** I click the CV icon in the top navigation, **Then** I should be navigated to the /cv route
2. **Given** I am viewing the blog on mobile, **When** I open the mobile menu and tap "My CV", **Then** I should be navigated to the /cv route
3. **Given** I am on any page, **When** I hover over the CV icon, **Then** I should see a tooltip indicating it links to the CV

---

### Edge Cases

- What happens when the CV HTML file is not available or cannot be processed?
- How does the CV page display on very small mobile screens (below 320px width)?
- How does the CV page handle users with high contrast mode or other accessibility settings?
- What happens if the CV content exceeds reasonable page length?

## Requirements _(mandatory)_

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
  CONSTITUTION COMPLIANCE: All requirements must support static site generation,
  accessibility (WCAG 2.1), and Angular 20 best practices.
-->

### Functional Requirements

- **FR-001**: System MUST display Igor's CV content when users navigate to the /cv route
- **FR-002**: System MUST provide a CV navigation icon in the desktop header toolbar
- **FR-003**: System MUST include "My CV" link in the mobile navigation menu
- **FR-004**: System MUST use appropriate Material Design icons for CV navigation
- **FR-005**: System MUST format CV content using Angular Material components, existing fonts and icons
- **FR-009**: System MUST store CV content as structured TypeScript data objects with proper interfaces for each section (Contact, Summary, Skills, Experience, Education)
- **FR-006**: System MUST ensure CV page is accessible with proper ARIA labels and semantic HTML
- **FR-007**: System MUST maintain responsive design across all device sizes
- **FR-008**: System MUST use existing project libraries (Angular Material, Material Icons) without adding new dependencies

### Technical Requirements _(Constitution Compliance)_

- **TR-001**: All components MUST use OnPush change detection strategy by default
- **TR-002**: All TypeScript code MUST follow strict mode with proper interfaces
- **TR-003**: All UI components MUST meet WCAG 2.1 accessibility standards
- **TR-004**: All features MUST support static site generation
- **TR-005**: All new code MUST have Vitest tests with 90% minimum coverage
- **TR-006**: Signals MUST be preferred over RxJS unless RxJS is more appropriate
- **TR-007**: All user inputs MUST be sanitized using Angular's XSS protection

### Key Entities

- **CV Content**: Structured TypeScript data objects with proper interfaces for Contact, Summary, Skills, Experience, and Education sections
- **CV Navigation**: Header icon and mobile menu link for accessing the CV page
- **CV Page**: Dedicated route at /cv displaying formatted resume content using Angular Material components

## Success Criteria _(mandatory)_

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
  CONSTITUTION COMPLIANCE: Include metrics for accessibility, performance, and code quality.
-->

### Measurable Outcomes

- **SC-001**: Users can access the CV page from any page within 2 clicks
- **SC-002**: CV page loads completely within 2 seconds on standard mobile networks
- **SC-003**: CV content remains readable and properly formatted on screen sizes from 320px to 1920px width
- **SC-004**: 100% of CV navigation elements are accessible via keyboard and screen readers

### Constitution Compliance Metrics

- **CC-001**: Lighthouse performance score ≥ 90 for all pages
- **CC-002**: WCAG 2.1 accessibility compliance with zero high-severity violations
- **CC-003**: Vitest test coverage ≥ 90% for all new code
- **CC-004**: ESLint/Prettier compliance with zero errors before commits
- **CC-005**: Static site generation successful with all content properly indexed
- **CC-006**: Bundle size optimization meeting performance budgets
- **CC-007**: Security scan passes with zero high-severity vulnerabilities
