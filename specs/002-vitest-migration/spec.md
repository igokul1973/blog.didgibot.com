# Feature Specification: Vitest Test Migration

**Feature Branch**: `002-vitest-migration`  
**Created**: 2025-12-03  
**Status**: Draft  
**Input**: User description: "1. Migrate Angular component tests to Vitest format 2. Set up proper Angular test environment for Vitest 3. Update pre-push hook to re-enable test validation using Vitest 4. Remove `test:karma` legacy script and any mentions of Karma and Jasmine in documentation 5. Remove all related Karma and Jasmine npm packages"

## Clarifications

### Session 2025-12-03

- Q: Should this feature migrate all existing specs (including complex integration/system tests) to Vitest, or focus on unit-level specs first? → A: Migrate all unit-level specs now; defer complex integration/system tests to a later feature.

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

### User Story 1 - Run Angular tests with Vitest (Priority: P1)

As a **developer**, I want to **run all Angular component and service tests using Vitest** so that I can get fast, reliable feedback without relying on the deprecated Karma/Jasmine stack.

**Why this priority**: This is the core value of the migration – without working Vitest tests, the rest of the changes (hooks, package cleanup) provide little benefit.

**Independent Test**: Can be fully tested by running `pnpm test` / `pnpm test:headless` and verifying that the Angular test suite executes under Vitest (even if some tests are temporarily skipped), without invoking Karma or Jasmine.

**Acceptance Scenarios**:

1. **Given** a fresh clone of the repo with dependencies installed, **When** I run `pnpm test`, **Then** Vitest starts, executes Angular tests, and exits without attempting to start Karma.
2. **Given** an environment without any Karma/Jasmine packages installed, **When** I run `pnpm test`, **Then** the tests execute successfully using Vitest only (no missing Karma/Jasmine dependency errors).

---

### User Story 2 - Pre-push test validation with Vitest (Priority: P2)

As a **maintainer**, I want the **pre-push hook to run Vitest tests and block pushes on failures** so that broken changes do not reach the remote repository.

**Why this priority**: Once Vitest tests run reliably, enforcing them via git hooks protects main branches and aligns with the project’s quality gates.

**Independent Test**: Can be fully tested by making a failing Vitest test and attempting to push (push is blocked), then fixing the test and pushing again (push succeeds).

**Acceptance Scenarios**:

1. **Given** at least one failing Vitest test, **When** I run `git push`, **Then** the pre-push hook runs `pnpm test:headless`, fails, prints a clear error message, and aborts the push.
2. **Given** all Vitest tests are passing, **When** I run `git push`, **Then** the pre-push hook runs tests successfully and allows the push to complete.

---

### User Story 3 - Clean, single-test-stack project (Priority: P3)

As a **developer joining the project**, I want **documentation, scripts, and dependencies to consistently reference Vitest only** so that there is no confusion about how to run tests or which tools are supported.

**Why this priority**: Reduces cognitive load, removes dead code and unused dependencies, and simplifies future maintenance.

**Independent Test**: Can be fully tested by reviewing `package.json`, documentation (README and testing docs), and installed devDependencies to confirm that Karma/Jasmine are no longer referenced and Vitest is the single source of truth.

**Acceptance Scenarios**:

1. **Given** a fresh clone, **When** I inspect `package.json` and the lockfile, **Then** there are no direct Karma/Jasmine devDependencies and the canonical test scripts all use Vitest.
2. **Given** I read `README.md` and any testing-related docs, **When** I search for “Karma” or “Jasmine”, **Then** I see either no hits or only historical notes indicating they were removed in favor of Vitest.

---

### Edge Cases

- What happens when Vitest is not installed or has a major-version mismatch with Angular CLI expectations?
- How does the system handle running `pnpm test` on CI where only a subset of browsers / DOM APIs are available (jsdom limitations)?
- What happens if some existing Karma/Jasmine tests cannot be immediately migrated (e.g., complex integration tests), and how are these deferred specs tracked for a future feature?
- How does the project behave if developers still have old `karma.conf.js` or Jasmine-specific helpers lying around in their local environment?

## Requirements _(mandatory)_

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
  CONSTITUTION COMPLIANCE: All requirements must support static site generation,
  accessibility (WCAG 2.1), and Angular 20 best practices.
-->

### Functional Requirements

- **FR-001**: System MUST execute Angular component, service, and pipe tests using Vitest (no Karma/Jasmine runtime).
- **FR-002**: System MUST provide a working Angular+Vitest test environment using the official Angular 20 experimental Vitest support (no custom `vitest.config.ts` or global `test-setup.ts` files) that allows existing Angular tests to run with minimal changes.
- **FR-003**: System MUST configure the pre-push git hook to run Vitest (e.g., `pnpm test:headless`) and block pushes when tests fail.
- **FR-004**: System MUST remove the `test:karma` legacy script from `package.json` and ensure primary test scripts (`test`, `test:headless`, etc.) reference Vitest only.
- **FR-005**: System MUST remove all direct Karma and Jasmine npm devDependencies that are no longer required after migration.
- **FR-006**: System MUST update documentation (including `README.md`) to describe how to run Vitest tests and MUST remove references that imply Karma/Jasmine are the primary or recommended runners.
- **FR-007**: System MUST ensure Husky pre-commit hooks continue to work with the new test setup and do not reintroduce Karma/Jasmine.
- **FR-008**: System SHOULD migrate all feasible unit-level specs (components, services, pipes) to Vitest in this feature and MAY explicitly defer complex integration/system tests to a future feature.

### Technical Requirements _(Constitution Compliance)_

- **TR-001**: Vitest configuration MUST follow Angular 20 experimental Vitest guidance and be driven by Angular CLI / `angular.json` (no standalone `vitest.config.ts` or `src/test-setup.ts` configuration files).
- **TR-002**: Vitest MUST run in a jsdom-based or equivalent environment as provided by Angular’s experimental Vitest support, suitable for Angular component tests.
- **TR-003**: Test scripts MUST be executable via `pnpm` and must not rely on globally-installed CLIs.
- **TR-004**: Husky pre-push hook MUST call a Vitest command that can run headless in CI (no interactive UI, no real browser requirement).
- **TR-005**: All new or migrated tests MUST follow existing ESLint and formatting rules, including TypeScript strict mode.
- **TR-006**: CI configuration changes are OUT OF SCOPE for this feature; any existing CI steps that still use Karma/Jasmine MUST be documented as legacy and scheduled for a future CI migration feature.
- **TR-007**: No remaining direct Karma/Jasmine packages MUST be present in `devDependencies` after migration; any transitive occurrences (from other tools) MUST not be used as test runners.

### Key Entities _(include if feature involves data)_

- **Test Command**: Logical representation of how tests are invoked (script name, underlying runner, options).
- **Git Hook Configuration**: Pre-commit and pre-push behavior related to testing and quality gates.
- **Testing Toolchain**: The set of npm devDependencies and config files that define how tests are executed (Angular CLI test configuration in `angular.json`, Vitest devDependencies, and legacy Karma/Jasmine configs to be removed).

## Success Criteria _(mandatory)_

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
  CONSTITUTION COMPLIANCE: Include metrics for accessibility, performance, and code quality.
-->

### Measurable Outcomes

- **SC-001**: `pnpm test:headless` completes successfully on a clean clone without requiring any Karma/Jasmine dependencies.
- **SC-002**: Pre-push hook blocks pushes when Vitest reports failing tests and allows pushes when tests pass.
- **SC-003**: All direct Karma/Jasmine devDependencies are removed from `package.json`, and no references remain in README or primary docs.
- **SC-004**: Developers can follow the README instructions to run tests with Vitest without encountering configuration errors.

### Constitution Compliance Metrics

- **CC-001**: Vitest test coverage ≥ 90% for all newly migrated or added tests in this feature.
- **CC-002**: ESLint/Prettier compliance with zero errors before commits (pre-commit hooks continue to enforce this).
- **CC-003**: Pre-push hook test run adds no more than 30 seconds to the push process under typical conditions.
- **CC-004**: No regression in static site generation behavior due to test tooling changes.
- **CC-005**: No high-severity security warnings introduced by new testing dependencies.
