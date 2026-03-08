---
description: 'Task list template for feature implementation'
---

# Tasks: Add CV Page

**Input**: Design documents from `/specs/007-add-cv-page/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED - specification mandates 90% coverage with Vitest

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Angular Application**: `src/app/`, `tests/` at repository root
- **Components**: `src/app/components/` (presentational)
- **Services**: `src/app/services/`
- **Models**: `src/app/models/`
- **Shared**: `src/app/shared/`
- **Tests**: `tests/unit/`, `tests/integration/`, `tests/contract/`
- **File naming**: kebab-case for files, dash-case for selectors

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify existing Angular project structure and dependencies
- [x] T002 [P] Verify Vitest testing configuration with Angular Testing Utilities
- [x] T003 [P] Verify ESLint/Prettier configuration for TypeScript strict mode
- [x] T004 Verify OnPush change detection strategy in existing components
- [x] T005 [P] Verify Angular Material theme and shared modules configuration
- [x] T006 [P] Verify accessibility tools and WCAG 2.1 compliance setup

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 [P] Copy CV data interfaces from contracts to src/app/models/cv-data-types.ts
- [x] T008 [P] Verify Angular Material modules (MatCardModule, MatListModule, MatIconModule) are available
- [x] T009 Verify existing CV component structure in src/app/components/cv/
- [x] T010 Verify existing header component structure in src/app/components/header/
- [x] T011 Verify CV route exists in src/app/app.routes.ts
- [x] T012 [P] Verify mobile menu CV link exists in header component

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Display CV Content (Priority: P1) 🎯 MVP

**Goal**: Display Igor's professional CV content at /cv route with proper formatting and styling

**Independent Test**: Navigate to /cv route and verify CV content is properly displayed, readable, and matches blog styling

### Tests for User Story 1 (REQUIRED) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T013 [P] [US1] Unit test for CV component data access in tests/unit/cv.component.spec.ts
- [x] T014 [P] [US1] Unit test for CV data models in tests/unit/cv-data-types.spec.ts
- [x] T015 [P] [US1] Integration test for CV page rendering in tests/integration/cv-page.spec.ts
- [x] T016 [P] [US1] Accessibility test for CV page in tests/integration/cv-accessibility.spec.ts

### Implementation for User Story 1

- [x] T017 [US1] Extract CV content from HTML reference file into TypeScript data in src/app/components/cv/cv.component.ts
- [x] T018 [P] [US1] Import CV data interfaces from src/app/models/cv-data-types.ts in src/app/components/cv/cv.component.ts (from contracts)
- [x] T019 [US1] Populate CV data object with extracted content in src/app/components/cv/cv.component.ts
- [x] T020 [US1] Implement CV component getter methods for data access in src/app/components/cv/cv.component.ts
- [x] T021 [US1] Update CV component template with Angular Material structure in src/app/components/cv/cv.component.html
- [x] T022 [US1] Add CV component styling consistent with blog pages in src/app/components/cv/cv.component.scss
- [x] T023 [US1] Add semantic HTML structure and ARIA attributes in src/app/components/cv/cv.component.html
- [x] T024 [US1] Add responsive design for CV content in src/app/components/cv/cv.component.scss
- [x] T025 [US1] Configure OnPush change detection for CV component in src/app/components/cv/cv.component.ts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Access CV from Navigation (Priority: P1)

**Goal**: Add CV navigation icon to desktop header and ensure mobile menu link works properly

**Independent Test**: Click CV icon in header navigation and verify it navigates to /cv route; test mobile menu navigation

### Tests for User Story 2 (REQUIRED) ⚠️

- [x] T026 [P] [US2] Unit test for header component CV navigation in tests/unit/header.component.spec.ts
- [x] T027 [P] [US2] Unit test for CV navigation functionality in tests/unit/cv-navigation.spec.ts
- [x] T028 [P] [US2] Integration test for CV navigation in tests/integration/cv-navigation.spec.ts

### Implementation for User Story 2

- [x] T029 [US2] Add CV navigation icon to desktop header in src/app/components/header/header.component.html
- [x] T030 [US2] Configure CV icon with proper router link and tooltip in src/app/components/header/header.component.html
- [x] T031 [US2] Add Material Design icon for CV navigation in src/app/components/header/header.component.html
- [x] T032 [US2] Ensure mobile menu CV link works properly in src/app/components/header/header.component.html
- [x] T033 [US2] Add proper ARIA labels and accessibility for CV navigation in src/app/components/header/header.component.html
- [x] T034 [US2] Test CV navigation functionality across different screensrc/app/components/header/header.component.html

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T035 [P] Run complete test suite and verify 90% coverage in tests/
- [x] T036 [P] Accessibility audit and WCAG 2.1 compliance verification for CV page
- [x] T037 [P] Performance optimization for CV page load time (target <2 seconds per SC-002)
- [x] T038 [P] Static site generation verification for CV page
- [x] T039 Bundle size analysis and optimization
- [x] T040 [P] Cross-browser compatibility testing for CV functionality
- [x] T041 [P] Verify CV page styling matches other blog pages
- [x] T042 Documentation updates if needed
- [x] T043 Run quickstart.md validation checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
    - User stories can then proceed in parallel (if staffed)
    - Or sequentially in priority order (US1 → US2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with existing header but independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Models before component implementation
- Component implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- User Story 1 and User Story 2 can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for CV component data access in tests/unit/cv.component.spec.ts"
Task: "Unit test for CV data models in tests/unit/cv-data-types.spec.ts"
Task: "Integration test for CV page rendering in tests/integration/cv-page.spec.ts"
Task: "Accessibility test for CV page in tests/integration/cv-accessibility.spec.ts"

# Launch implementation tasks for User Story 1 together:
Task: "Create CV data interfaces in src/app/models/cv-data-types.ts"
Task: "Extract CV content from HTML reference file into TypeScript data in src/app/components/cv/cv.component.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
    - Developer A: User Story 1
    - Developer B: User Story 2
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Tests are REQUIRED per specification (90% coverage mandate)
