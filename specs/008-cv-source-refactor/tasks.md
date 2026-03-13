---
description: 'Task list for CV Source of Truth Refactor implementation'
---

# Tasks: CV Source of Truth Refactor

**Input**: Design documents from `/specs/008-cv-source-refactor/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Unit tests for interface compliance and integration tests for component rendering are included as specified in the feature requirements.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Angular Application**: `src/app/`, `tests/` at repository root
- **Components**: `src/app/components/` (presentational) and `src/app/containers/` (smart)
- **Services**: `src/app/services/`
- **Models**: `src/app/models/`
- **Shared**: `src/app/shared/`
- **Tests**: `tests/unit/`, `tests/integration/`, `tests/contract/`
- **File naming**: kebab-case for files, dash-case for selectors

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Backup current JSON file and verify project structure
- [x] T002 Verify TypeScript configuration supports JSON module imports
- [x] T003 [P] Verify Vitest testing configuration is working
- [x] T004 Verify OnPush change detection is configured as default
- [x] T005 [P] Verify ESLint and Prettier configurations are active
- [x] T006 Verify Angular Material imports and accessibility setup

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Move JSON file to assets folder for proper Angular import structure
- [x] T008 Verify JSON file is accessible for TypeScript module import
- [x] T009 Create error handling infrastructure for JSON loading failures
- [x] T010 Setup logging infrastructure for CV data validation
- [x] T011 Configure build process to include JSON assets

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - JSON Structure Standardization (Priority: P1) 🎯 MVP

**Goal**: Convert all JSON keys to camelCase format while preserving data integrity

**Independent Test**: Validate that all JSON keys follow camelCase convention and JSON file remains valid and parseable

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T012 [P] [US1] Unit test for JSON structure validation in tests/unit/cv/cv-json-structure.spec.ts
- [x] T013 [P] [US1] Unit test for camelCase key conversion in tests/unit/cv/cv-key-conversion.spec.ts

### Implementation for User Story 1

- [x] T014 [US1] Convert all JSON keys from snake_case/mixed-case to camelCase in igor_kulebyakin_resume.json
- [x] T015 [US1] Verify JSON file remains valid after key conversion
- [x] T016 [US1] Validate all data values are preserved during key conversion
- [x] T017 [US1] Add JSON structure validation logging
- [x] T018 [US1] Run JSON parsing test to ensure file integrity
- [x] T019 [US1] Implement JSON integrity validation per FR-005 in igor_kulebyakin_resume.json

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Interface Contracts Update (Priority: P1)

**Goal**: Update TypeScript interfaces to exactly match the new JSON structure

**Independent Test**: Compile TypeScript code and verify all interfaces match JSON structure with zero type errors

### Tests for User Story 2 ⚠️

- [x] T020 [P] [US2] Unit test for interface compliance in tests/unit/cv/cv-data-types.spec.ts
- [x] T021 [P] [US2] Integration test for TypeScript compilation in tests/unit/cv/cv-compilation.spec.ts

### Implementation for User Story 2

- [x] T022 [P] [US2] Replace existing interfaces in src/app/models/cv-data-types.ts with contracts from specs/008-cv-source-refactor/contracts/cv-data-types.ts
- [x] T023 [P] [US2] Update import statements in CV component to use new interfaces
- [x] T024 [US2] Verify TypeScript compilation succeeds with new interfaces
- [x] T025 [US2] Add interface validation tests for type safety
- [x] T026 [US2] Update any other files that reference old interface names

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - CV Component Integration (Priority: P1)

**Goal**: Modify CV component to import and use JSON data exclusively, removing all hardcoded data

**Independent Test**: Load CV page and verify all data sections display correctly with new JSON structure

### Tests for User Story 3 ⚠️

- [x] T027 [P] [US3] Integration test for CV component rendering in tests/unit/cv/cv-component.spec.ts
- [ ] T028 [P] [US3] Unit test for data loading in tests/unit/cv/cv-data-loading.spec.ts

### Implementation for User Story 3

- [x] T027 [P] [US3] Replace hardcoded data in CV component with JSON import
- [x] T028 [P] [US3] Update CV component template to use new interface properties
- [x] T029 [P] [US3] Update getter methods to match new data structure
- [x] T030 [US3] Verify CV component compiles and displays correctlyd data
- [ ] T033 [US3] Add fail-fast error handling for JSON loading failures
- [ ] T034 [US3] Add data validation in component constructor
- [ ] T035 [US3] Verify template bindings work with new data structure
- [ ] T036 [US3] Test component displays all personal information correctly
- [ ] T037 [US3] Test component displays all experience entries correctly
- [ ] T038 [US3] Test component displays all education entries correctly
- [ ] T039 [US3] Test component displays all skills categories correctly

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T040 [P] Update CV component tests to use new data structure in src/app/components/cv/cv.component.spec.ts
- [ ] T041 [P] Add comprehensive error logging for debugging
- [ ] T042 [P] Verify accessibility compliance remains intact
- [ ] T043 [P] Add XSS protection validation per TR-007 in tests/unit/cv/cv-xss.spec.ts
- [ ] T044 [P] Run performance tests to ensure no regression
- [ ] T045 [P] Verify static site generation works correctly
- [ ] T046 [P] Run Lighthouse audit for performance metrics
- [ ] T047 [P] Validate ESLint/Prettier compliance
- [ ] T048 Code cleanup and remove any unused imports
- [ ] T049 Update any documentation references to old data structure
- [ ] T050 Run quickstart.md validation checklist
- [ ] T051 Final integration test of complete CV page functionality
- [ ] T052 [P] Add edge case handling for missing/null JSON fields in src/app/components/cv/cv.component.ts
- [ ] T053 [P] Add malformed JSON error handling per edge cases in src/app/components/cv/cv.component.ts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
    - User stories can then proceed in parallel (if staffed)
    - Or sequentially in priority order (US1 → US2 → US3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (US1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (US2)**: Can start after Foundational (Phase 2) - Depends on US1 completion for JSON structure
- **User Story 3 (US3)**: Can start after Foundational (Phase 2) - Depends on US1 and US2 completion for JSON structure and interfaces

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- JSON structure work before interface work
- Interface work before component integration
- Core implementation before testing
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Tests for each user story marked [P] can run in parallel
- Different user stories can be worked on sequentially (recommended for this single-developer feature)

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for JSON structure validation in tests/unit/cv/cv-json-structure.spec.ts"
Task: "Unit test for camelCase key conversion in tests/unit/cv/cv-key-conversion.spec.ts"

# JSON structure work (single file, sequential):
Task: "Convert all JSON keys from snake_case/mixed-case to camelCase in igor_kulebyakin_resume.json"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Verify JSON structure is correctly converted

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Validate JSON structure
3. Add User Story 2 → Test independently → Validate TypeScript compilation
4. Add User Story 3 → Test independently → Validate CV page functionality
5. Complete Polish phase → Final validation and deployment

### Sequential Strategy (Recommended for Single Developer)

1. **Phase 1-2**: Complete setup and foundational work
2. **Phase 3**: Complete JSON structure standardization
3. **Phase 4**: Complete interface updates
4. **Phase 5**: Complete component integration
5. **Phase 6**: Complete polish and cross-cutting concerns
6. **Final**: End-to-end validation of complete feature

---

## Task Summary

**Total Tasks**: 53

- **Setup Phase**: 6 tasks
- **Foundational Phase**: 5 tasks
- **User Story 1**: 8 tasks (3 tests + 5 implementation)
- **User Story 2**: 7 tasks (2 tests + 5 implementation)
- **User Story 3**: 13 tasks (2 tests + 11 implementation)
- **Polish Phase**: 14 tasks

**Parallel Opportunities**: 27 tasks marked with [P]
**Critical Path**: 26 tasks (sequential dependencies)

**MVP Scope**: User Story 1 (14 tasks total) - JSON structure standardization only
**Full Feature**: All user stories (28 tasks total) + polish phase

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD approach)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Estimated implementation time: 2-4 hours for experienced Angular developer
- Risk level: LOW - well-understood technology stack and clear requirements
