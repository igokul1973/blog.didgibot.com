# Tasks: Vitest Test Migration

**Input**: Design documents from `/specs/002-vitest-migration/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `quickstart.md`

## Path Conventions

- **Angular Application**: `src/app/`
- **Components**: `src/app/components/` (presentational) and `src/app/containers/` (smart)
- **Services**: `src/app/services/`
- **Models**: `src/app/models/`
- **Shared**: `src/app/shared/`
- **Tests**: `src/**/*.spec.ts` (co-located with app code)
- **Git Hooks**: `.husky/pre-commit`, `.husky/pre-push`
- **Scripts & Deps**: `package.json`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Ensure baseline Vitest tooling and docs exist for migration.

- [x] T001 Create feature documentation skeleton for Vitest migration in `specs/002-vitest-migration/` (spec, plan, research, data-model, quickstart)
- [x] T002 [P] Verify base Vitest dependencies and Node engine in `package.json` (Vitest, jsdom, TypeScript)
- [x] T003 [P] Document Vitest usage in `README.md` overview section (high-level, not migration-specific)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 Ensure Angular CLI / `angular.json` is configured to use the experimental Vitest test runner with an appropriate jsdom-like environment
- [x] T005 [P] Implement or verify any required browser API mocks (e.g. `matchMedia`, `ResizeObserver`, `IntersectionObserver`) using patterns supported by Angular’s Vitest integration (e.g. per-spec setup or Angular-provided utilities), without relying on a global `src/test-setup.ts` file
- [x] T006 [P] Align `tsconfig.json` and `tsconfig.check-types.json` with Vitest usage (paths, includes/excludes, strict mode)
- [x] T007 Confirm `package.json` test scripts (`test`, `test:headless`, `test:coverage`) all invoke Vitest
- [x] T008 [P] Validate Husky pre-commit hook in `.husky/pre-commit` only runs `pnpm lint` and `pnpm check:types` (no Karma/Jasmine assumptions)
- [x] T009 Run `pnpm test:headless` on a clean clone and capture current failures as baseline for migration

**Checkpoint**: Foundation ready – Vitest is wired into the toolchain and ready for story-specific work.

---

## Phase 3: User Story 1 – Run Angular tests with Vitest (Priority: P1)

**Goal**: Execute Angular component, service, and pipe tests using Vitest instead of Karma/Jasmine.

**Independent Test**: Run `pnpm test` / `pnpm test:headless` and verify Angular tests run under Vitest with no Karma/Jasmine runtime.

### Implementation for User Story 1

- [x] T010 [P] Verify that Angular’s experimental Vitest support initializes the Angular testing environment correctly without requiring a custom `TestBed.initTestEnvironment` call or global setup file, and remove any leftover custom setup artifacts (`vitest.config.ts`, `src/test-setup.ts`)
- [x] T012 [P] [US1] Update service and pipe specs in `src/app/services/**/*.spec.ts` and `src/app/pipes/**/*.spec.ts` to be compatible with Vitest + Angular `TestBed`
- [x] T013 [US1] Add or update Angular test environment bootstrap
- [x] T014 [US1] Ensure no spec imports or relies on Jasmine-only globals (e.g. `jasmine.createSpyObj`) without Vitest-compatible equivalents
- [x] T015 [US1] Run `pnpm test` and update failing specs iteratively until the majority of unit-level tests pass under Vitest
- [x] T016 [US1] Run `pnpm test:headless` and verify Vitest completes successfully on a clean clone without Karma/Jasmine installed

**Checkpoint**: At this point, core Angular tests (components, services, pipes) should run under Vitest without invoking Karma/Jasmine.

---

## Phase 4: User Story 2 – Pre-push test validation with Vitest (Priority: P2)

**Goal**: Ensure pre-push hook runs Vitest tests and blocks pushes when tests fail.

**Independent Test**: Make a failing Vitest test and attempt to push (push is blocked), then fix tests and push again (push succeeds).

### Implementation for User Story 2

- [x] T017 [P] Update pre-push hook to run `pnpm test:unit` (focused unit tests) instead of full test suite
- [x] T018 [P] [US2] Verify pre-push hook blocks pushes when Vitest unit tests fail
- [x] T019 [P] [US2] Verify pre-push hook allows pushes when Vitest unit tests pass

**Checkpoint**: Pre-push hook reliably enforces Vitest tests before code reaches remote branches.

---

## Phase 5: User Story 3 – Clean, single-test-stack project (Priority: P3)

**Goal**: Project, documentation, and dependencies consistently reference Vitest as the single supported test runner.

**Independent Test**: Review `package.json`, docs, and devDependencies to confirm Karma/Jasmine are removed and Vitest is the only active runner.

### Implementation for User Story 3

- [x] T020 [P] Remove `test:karma` script from `package.json`
- [x] T021 [P] Remove Karma configuration from `angular.json` (test builder section)
- [x] T022 [P] Delete `karma.conf.js` file from project root
- [x] T023 [P] Update README.md to reflect completed Vitest migration and remove Karma/Jasmine references
- [x] T024 [P] Verify no Karma/Jasmine dependencies remain in `package.json`
- [x] T025 [P] Confirm project documentation consistently references Vitest as the single test runner

**Checkpoint**: Project is clean with Vitest as the single, supported test runner.

---

## Phase 6: User Story 4 – Component template resolution (Priority: P4)

**Goal**: Enable Angular component tests with `templateUrl`/`styleUrl` to run under Vitest.

**Independent Test**: Run `pnpm test:headless` and verify component tests with external templates/styles pass under Vitest.

**Status**: Addressed via Angular 20 experimental Vitest support. Component tests with `templateUrl`/`styleUrl` now run under `ng test` with the Vitest runner; no custom compilation pipeline is required.

### Implementation for User Story 4 (Final)

- [x] T030 [P] Use Angular CLI's experimental Vitest integration for templateUrl/styleUrl resolution (no custom Vitest config or global test setup)
- [x] T031 [P] Ensure component tests exercise real templates/styles where valuable, or override templates selectively when only logic/creation is under test
- [x] T032 [P] Validate that `pnpm test:headless` executes component tests successfully and can be used in CI
- [x] T033 [P] Update documentation (`README.md`, `development_guidelines.md`) to reflect full component testing capabilities and patterns (standalone components, router providers, mocks, browser API stubs)

**Technical Notes**:

- Angular's experimental Vitest runner handles component resource resolution via `angular.json` (`"runner": "vitest"`)
- Browser-only APIs (e.g. `ResizeObserver`, `matchMedia`, `IntersectionObserver`) and animations may still require per-spec stubs or `provideNoopAnimations()`
- Component logic tests remain simple to write and benefit from the same Vitest environment as services and pipes

---

## Migration Summary

✅ **Completed**:

- User Story 1: Unit tests (services, pipes, and Angular components) migrated to Vitest and run via `ng test`/`pnpm test:headless`
- User Story 2: Pre-push hook validation with Vitest (`pnpm test:headless`)
- User Story 3: Complete Karma/Jasmine removal and cleanup
- User Story 4: Component template resolution using Angular 20 experimental Vitest support (no custom Vitest config or global test setup required)

⏳ **Deferred**:

- Phase 6 polish tasks (coverage tuning, additional guidelines, and CI pipeline refinements)

The migration successfully achieves the core objectives: Vitest is the primary test runner, pre-push validation works, and the project is clean of Karma/Jasmine dependencies.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and long-term maintainability.

- [ ] T030 [P] Review Vitest and Angular test configuration (e.g. `angular.json` test options) for coverage thresholds, reporter settings, and performance tuning
- [ ] T031 [P] Add or refine Vitest tests for critical blog features (e.g. key components/services) and validate that coverage for migrated areas reaches at least 90%
- [ ] T032 Update `quickstart.md` and `development_guidelines.md` (if present) to align with the final Vitest workflow
- [ ] T033 Run a full CI-style pipeline locally (`pnpm lint`, `pnpm check:types`, `pnpm test:headless`) to validate the end-to-end developer experience
- [ ] T034 Capture any known limitations or follow-up work (e.g. complex integration tests not yet migrated) in `specs/002-vitest-migration/spec.md`, including a list of deferred specs (file paths + reason) and, when known, a reference to the future feature that will handle them

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies – can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion – BLOCKS all user stories
- **User Stories (Phases 3–5)**: All depend on Foundational phase completion
    - User Story 1 (Vitest test execution) should be completed before Stories 2 and 3
    - User Stories 2 and 3 can proceed in parallel after User Story 1 is stable
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2; no dependencies on other stories
- **User Story 2 (P2)**: Depends on User Story 1 (Vitest tests must run reliably before enforcing via pre-push)
- **User Story 3 (P3)**: Depends on User Story 1 (Vitest must be working before removing Karma/Jasmine), can be done in parallel with User Story 2

### Within Each User Story

- Adjust or add tests in small increments, keeping the suite green as often as possible
- Prefer migrating simpler unit tests first, then more complex integration-style specs
- Keep hooks (pre-commit, pre-push) stable while changing internals

### Parallel Opportunities

- [P] tasks in Phase 1 and Phase 2 can be executed in parallel by different contributors
- In User Story 1, test migration for different feature areas (components vs services) can proceed in parallel as long as specs do not conflict
- User Stories 2 and 3 can largely proceed in parallel once User Story 1 is complete

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 – Vitest executing Angular tests
4. **STOP and VALIDATE**: Ensure `pnpm test` / `pnpm test:headless` work without Karma/Jasmine
5. Optionally ship this as an internal milestone (Vitest runner in place, hooks unchanged)

### Incremental Delivery

1. After MVP (US1), implement User Story 2 to enforce Vitest in pre-push
2. Implement User Story 3 to clean up scripts, dependencies, and docs
3. Use Phase 6 to refine coverage, configuration, and guidelines

---

## Notes

- All tasks follow the required format: `- [ ] TXXX [P?] [Story?] Description`
- Story labels ([US1], [US2], [US3]) are only used for user story tasks
- Tests are integrated into the main implementation tasks rather than as a separate phase, consistent with the constitution’s Test-First principle
- The plan assumes changes are made on branch `002-vitest-migration` and validated via Husky hooks and CI
