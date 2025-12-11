# Tasks: Angular Test Coverage

**Input**: Design documents from `/specs/003-angular-tests-coverage/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: This feature explicitly requires strong test coverage; test tasks are included and should generally be done first for each story where practical.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm Vitest-based coverage tooling and Angular layout are correctly wired for this repo.

- [ ] T001 Verify Angular app layout under `src/app/` matches constitution in src/app/\*\*
- [x] T002 Ensure Vitest is installed and configured as primary test runner in `package.json`
- [x] T003 [P] Confirm TypeScript strict mode is enabled in `tsconfig.json`
- [ ] T004 [P] Verify ESLint/Prettier configuration is present and passing for current code in repo root
- [x] T005 [P] Confirm existing Angular test files run successfully with Vitest (no global breakage)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core coverage and linting infrastructure that MUST be complete before changing or adding tests for stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T006 Define "coverable" Angular scope in coverage config (include `src/app/**` excluding infra like `main.ts` and env files) in `vitest.config.*`
- [x] T007 [P] Ensure coverage reporters (text + HTML) are enabled in `vitest.config.*`
- [x] T008 [P] Add or update npm script to run tests with coverage (e.g., `npm test -- --coverage`) in `package.json`
- [ ] T009 Add initial documentation note in `README.md` or equivalent referencing Angular coverage feature and pointing to `specs/003-angular-tests-coverage/spec.md`
- [x] T010 [P] Ensure existing Angular components/services/pipes/directives under `src/app/` are detected by coverage tooling (run coverage once and confirm files appear in report)

**Checkpoint**: Coverage tooling and configuration ready – user story implementation can now begin.

---

## Phase 3: User Story 1 - Maintain high Angular test coverage (Priority: P1) 🎯 MVP

**Goal**: Ensure all **coverable** Angular elements under `src/app` have sufficient Vitest unit tests to achieve ≥ 90% coverage, with exceptions tracked explicitly.

**Independent Test**: Run the automated test suite with coverage and verify that overall and per-file coverage for coverable Angular code is ≥ 90%, or that any shortfalls are explained via the exceptions allowlist.

### Tests for User Story 1

- [x] T011 [P] [US1] Identify current per-file Angular coverage baseline from Vitest report and export to `specs/003-angular-tests-coverage/baseline-coverage.md`
- [x] T012 [P] [US1] List Angular elements under `src/app/` (components/services/pipes/directives/guards) and map each to existing tests in `specs/003-angular-tests-coverage/coverage-inventory.md`
- [x] T013 [P] [US1] For each Angular element below 90% coverage, create a TODO section in `coverage-inventory.md` with required scenarios to reach ≥ 90%

### Implementation for User Story 1

- [ ] T014 [P] [US1] Create or update coverage root configuration for Angular code in `vitest.config.*` (include `src/app/**`, exclude infra paths)
- [ ] T015 [P] [US1] Implement or update Vitest unit tests for lowest-covered Angular components in `tests/unit/` or co-located `*.spec.ts` files under `src/app/`
- [ ] T016 [P] [US1] Implement or update Vitest unit tests for lowest-covered Angular services in `tests/unit/` or co-located `*.spec.ts` files under `src/app/services/`
- [ ] T017 [P] [US1] Implement or update Vitest unit tests for lowest-covered pipes/directives/guards in `tests/unit/` or co-located `*.spec.ts` files under `src/app/shared/` and related folders
- [ ] T018 [US1] Introduce and document the exceptions allowlist structure in `specs/003-angular-tests-coverage/coverage-exceptions.md` and reference it from `specs/003-angular-tests-coverage/spec.md`
- [ ] T019 [US1] Populate initial entries in `coverage-exceptions.md` for any legacy or structurally untestable areas, including justification and approver fields
- [ ] T020 [US1] Run Vitest with coverage and update `baseline-coverage.md` and `coverage-inventory.md` to confirm ≥ 90% coverage for coverable code or documented exceptions

**Checkpoint**: User Story 1 is complete when coverage reports show ≥ 90% for coverable Angular code or explicit exceptions, and inventory/exception docs are in place.

---

## Phase 4: User Story 2 - Enforce test code quality standards (Priority: P2)

**Goal**: Ensure that Angular test code respects strict TypeScript and Angular quality rules (no implicit `any`, no deprecated Angular APIs).

**Independent Test**: Run static analysis and build to verify that test code compiles with no implicit `any` and contains no references to deprecated Angular APIs.

### Tests / Checks for User Story 2

- [ ] T021 [P] [US2] Configure or confirm TypeScript settings that prevent implicit `any` in test files in `tsconfig.spec.json` or equivalent
- [ ] T022 [P] [US2] Ensure ESLint rules for tests disallow `any` and flag deprecated Angular APIs in `.eslintrc.*`

### Implementation for User Story 2

- [ ] T023 [P] [US2] Run linting and TypeScript checks for existing test files under `tests/` and `src/app/**.spec.ts`, capturing violations in `specs/003-angular-tests-coverage/test-quality-report.md`
- [ ] T024 [P] [US2] Fix implicit `any` issues in test files in `tests/` and `src/app/**.spec.ts` (update types and interfaces as needed)
- [ ] T025 [P] [US2] Replace any deprecated Angular APIs used in tests with supported alternatives in relevant `*.spec.ts` files
- [ ] T026 [US2] Re-run linting and TypeScript checks to confirm zero implicit `any` and zero deprecated Angular API usage, then update `test-quality-report.md` with before/after summary

**Checkpoint**: User Story 2 is complete when test quality report shows no implicit `any` and no deprecated Angular APIs in tests.

---

## Phase 5: User Story 3 - Make coverage expectations explicit for contributors (Priority: P3)

**Goal**: Document coverage and test-quality expectations so contributors understand requirements before submitting changes.

**Independent Test**: A new contributor can read the docs and clearly understand coverage targets, exceptions, and test-quality rules.

### Documentation Tasks for User Story 3

- [ ] T027 [P] [US3] Update `README.md` or main contributor docs to describe:
    - ≥ 90% coverage expectation for coverable Angular code
    - Definition of "coverable" under `src/app`
    - Exception allowlist rules
- [ ] T028 [P] [US3] Link from contributor guidelines to `specs/003-angular-tests-coverage/spec.md`, `research.md`, and `quickstart.md`
- [ ] T029 [P] [US3] Document how to run Vitest with coverage and interpret coverage reports in `specs/003-angular-tests-coverage/quickstart.md` (update if needed)
- [ ] T030 [US3] Add a short checklist section for reviewers to validate coverage and test-quality expectations in `specs/003-angular-tests-coverage/test-review-checklist.md`

**Checkpoint**: User Story 3 is complete when docs clearly state expectations and are linked from main contributor entry points.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Consolidate improvements and ensure all stories integrate cleanly.

- [ ] T031 [P] Run full Vitest suite with coverage and linting together and record final status in `specs/003-angular-tests-coverage/final-report.md`
- [ ] T032 [P] Clean up any duplicated or obsolete test files uncovered during coverage work in `tests/` and `src/app/**.spec.ts`
- [ ] T033 Ensure all new/updated documents (`baseline-coverage.md`, `coverage-inventory.md`, `coverage-exceptions.md`, `test-quality-report.md`, `final-report.md`) are referenced from `specs/003-angular-tests-coverage/plan.md` or `spec.md` where appropriate
- [ ] T034 [P] Verify that static site generation and existing site behavior are unaffected by coverage and test changes (run build and smoke test key routes)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup** – No dependencies, can start immediately.
- **Phase 2: Foundational** – Depends on Phase 1; BLOCKS all user stories.
- **Phase 3: US1 (P1)** – Depends on Phase 2; MVP.
- **Phase 4: US2 (P2)** – Depends on Phase 2; can run in parallel with Phase 3 once foundations are ready.
- **Phase 5: US3 (P3)** – Depends on Phase 2; can run in parallel with Phases 3–4.
- **Phase 6: Polish** – Depends on completion of all desired user story phases.

### User Story Dependencies

- **US1 (P1)**: No dependencies on other stories; establishes coverage baseline and improvements.
- **US2 (P2)**: Independent of US1, but benefits from improved tests; focuses on test-quality constraints.
- **US3 (P3)**: Depends on clarity from US1/US2 outputs for documentation content but can be drafted in parallel.

### Parallel Opportunities

- Tasks marked `[P]` in any phase can be safely parallelized (different files, no direct dependencies).
- After Phase 2, US1, US2, and US3 can be worked on concurrently by different contributors.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup).
2. Complete Phase 2 (Foundational).
3. Complete Phase 3 (US1) to raise coverage and document exceptions.
4. Validate coverage and exception docs via `baseline-coverage.md` and `coverage-inventory.md`.

### Incremental Delivery

1. After MVP (US1), implement US2 to enforce test-quality standards.
2. Then implement US3 to update contributor documentation and review checklists.
3. Finish with Phase 6 (Polish) to consolidate reports and verify builds.

### Team Parallelization

- One contributor can focus on coverage improvements (US1).
- A second contributor can focus on test-quality enforcement (US2).
- A third contributor can focus on documentation and contributor guidance (US3).
