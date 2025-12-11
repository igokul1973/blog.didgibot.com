# Feature Specification: Angular Test Coverage

**Feature Branch**: `003-angular-tests-coverage`  
**Created**: [DATE]  
**Status**: Draft  
**Input**: User description: "Cover all coverable Angular elements with unit tests directly in code and send for my approval. The coverage must be >= 90%. No implicit any in tests. No deprecated features can be used. Always consult constitution.md if in doubt."

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

### User Story 1 - Maintain high Angular test coverage (Priority: P1)

As a maintainer of the blog application, I want all coverable Angular components, services, pipes, directives, and other testable elements to have unit tests so that I can refactor and extend the codebase with confidence while maintaining at least 90% coverage.

**Why this priority**: This directly protects the stability of the production site and is the main driver for introducing the feature. Without sufficient coverage, regressions are likely when evolving the Angular codebase.

**Independent Test**: Run the automated test suite with coverage reporting for the Angular workspace and verify that overall and per-scope coverage targets (lines, branches, and statements) meet or exceed 90% for coverable Angular code.

**Acceptance Scenarios**:

1. **Given** an existing Angular component/service/pipe/directive with no tests, **When** the feature is implemented and the test suite is executed with coverage reporting, **Then** that element has dedicated unit tests and contributes to an overall Angular code coverage of at least 90% for lines, branches, and statements.
2. **Given** a newly created or modified Angular element, **When** the test suite is run, **Then** coverage for that element is at least 90% and the overall Angular coverage remains at or above 90%.

---

### User Story 2 - Enforce test code quality standards (Priority: P2)

As a maintainer, I want the test codebase to follow strict TypeScript and Angular quality rules (no implicit `any` and no use of deprecated Angular APIs in tests) so that tests remain readable, future-proof, and aligned with the project constitution.

**Why this priority**: Poorly typed or deprecated test code makes the suite fragile and harder to maintain. Enforcing these constraints preserves long-term test quality.

**Independent Test**: Inspect the test TypeScript configuration and static analysis outputs to verify that all test files compile without implicit `any` and contain no references to deprecated Angular APIs.

**Acceptance Scenarios**:

1. **Given** a new or modified test file, **When** static analysis or compilation is run, **Then** there are zero occurrences of implicit `any` in that file.
2. **Given** the full test suite, **When** it is checked for usage of Angular-deprecated APIs, **Then** no deprecated Angular features are referenced from test code.

---

### User Story 3 - Make coverage expectations explicit for contributors (Priority: P3)

As a contributor to the project, I want clear and explicit guidelines that all coverable Angular code must be accompanied by unit tests that achieve at least 90% coverage so that I know what is expected before submitting changes for review.

**Why this priority**: Clear expectations reduce review friction and prevent back-and-forth over minimum coverage or allowed patterns.

**Independent Test**: Review the contributor documentation and project guidelines to confirm that the coverage expectations and test code constraints are clearly documented and referenced from the constitution.

**Acceptance Scenarios**:

1. **Given** a new contributor, **When** they review the project guidelines and constitution, **Then** they can see explicit requirements for 90%+ coverage, no implicit `any` in tests, and no use of deprecated features in test code.
2. **Given** a merge request that adds or modifies Angular code without adequate tests, **When** it is compared against the documented expectations, **Then** the lack of coverage or violation of test constraints is clearly identifiable as non-compliant.

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

- What happens when legacy Angular code relies on browser-only APIs or external libraries that are difficult to unit test while still needing to respect the 90% coverage target? Such areas MAY be added to a small, explicit exception allowlist with clear justification and maintainer approval while the rest of the Angular codebase still upholds the 90% coverage requirement.
- How does system handle areas of code that are structurally untestable or non-deterministic (e.g., integration with third-party scripts), while still keeping overall Angular coverage at or above 90%? These areas MUST either be refactored to become testable or, if that is not feasible, explicitly documented and tracked on the same exception allowlist.

## Requirements _(mandatory)_

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
  CONSTITUTION COMPLIANCE: All requirements must support static site generation,
  accessibility (WCAG 2.1), and Angular 20 best practices.
-->

### Functional Requirements

- **FR-001**: System MUST ensure that all coverable Angular components, services, pipes, directives, and other testable elements have associated unit tests such that overall Angular code coverage (lines, branches, and statements) is at least 90%.
- **FR-002**: System MUST define and document "coverable" Angular code as all runtime Angular code under `src/app` (components, services, pipes, directives, guards, and other non-test application logic), excluding clearly documented infrastructure or bootstrapping files (such as `main.ts`, environment configuration files, and tooling-only helpers), so that coverage expectations are unambiguous.
- **FR-003**: System MUST ensure that new or modified Angular code cannot be considered complete unless unit tests are added or updated to keep coverage for that code at or above 90%.
- **FR-004**: System MUST ensure that all test TypeScript code avoids implicit `any` types, making type information explicit wherever it is otherwise inferred as `any`.
- **FR-005**: System MUST ensure that Angular test code does not rely on deprecated Angular APIs or features as defined by the current Angular version used in the project.
- **FR-006**: System MUST support a small, explicitly documented exception allowlist for legacy or structurally untestable Angular areas, where each exception includes a justification and maintainer approval, while still enforcing the 90% coverage target for all non-exempt coverable code.

### Technical Requirements _(Constitution Compliance)_

- **TR-001**: All components MUST use OnPush change detection strategy by default
- **TR-002**: All TypeScript code MUST follow strict mode with proper interfaces
- **TR-003**: All UI components MUST meet WCAG 2.1 accessibility standards
- **TR-004**: All features MUST support static site generation
- **TR-005**: All new code MUST have Vitest tests with 90% minimum coverage
- **TR-006**: Signals MUST be preferred over RxJS unless RxJS is more appropriate
- **TR-007**: All user inputs MUST be sanitized using Angular's XSS protection

### Key Entities _(include if feature involves data)_

- **Angular Element Under Test**: Represents any Angular construct (component, service, pipe, directive) that is expected to have associated unit tests and participate in coverage metrics.
- **Test Suite and Test Cases**: Represent the organized collection of unit tests mapped to Angular elements, used to measure coverage and enforce quality constraints.

## Success Criteria _(mandatory)_

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
  CONSTITUTION COMPLIANCE: Include metrics for accessibility, performance, and code quality.
-->

### Measurable Outcomes

- **SC-001**: Overall coverage for Angular application code (lines, branches, and statements) is ≥ 90% as reported by the standardized coverage tool, with shortfalls highlighted as warnings rather than hard CI failures.
- **SC-002**: For any newly added or modified Angular file, individual coverage for that file is ≥ 90% for lines and branches.
- **SC-003**: Static analysis of test TypeScript files reports zero instances of implicit `any`.
- **SC-004**: Static analysis and review of test code report zero uses of Angular APIs or features marked as deprecated for the project’s Angular version.

### Constitution Compliance Metrics

- **CC-001**: Lighthouse performance score ≥ 90 for all pages
- **CC-002**: WCAG 2.1 accessibility compliance with zero high-severity violations
- **CC-003**: Vitest test coverage ≥ 90% for all new code
- **CC-004**: ESLint/Prettier compliance with zero errors before commits
- **CC-005**: Static site generation successful with all content properly indexed
- **CC-006**: Bundle size optimization meeting performance budgets
- **CC-007**: Security scan passes with zero high-severity vulnerabilities

## Clarifications

### Session 2025-12-04

- Q: How should we handle legacy/structurally untestable Angular code with respect to the 90% coverage requirement? → A: Controlled exceptions via explicit allowlist with justification and maintainer approval.
- Q: How should the ≥ 90% coverage requirement be enforced? → A: As a soft guideline reported by CI (warnings), not a hard gate that alone blocks merges.
