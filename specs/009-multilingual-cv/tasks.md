# Tasks: Multilingual CV Support

**Input**: Design documents from `/specs/009-multilingual-cv/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are included as this is an Angular project with Vitest requirements per constitutional compliance.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Angular Application**: `src/app/`, tests co-located with components
- **Components**: `src/app/components/`
- **Services**: `src/app/services/`
- **Types**: `src/app/components/cv/types.ts`
- **Assets**: `src/assets/`
- **Tests**: Co-located with components using `.spec.ts` suffix

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify feature branch `009-multilingual-cv` is checked out and up to date
- [x] T002 Backup existing resume JSON data to preserve current functionality
- [x] T003 [P] Verify existing Angular 20.3.15 and TypeScript 5.9.3 setup
- [x] T004 [P] Verify Vitest testing configuration is working
- [x] T005 [P] Verify existing ESLint and Prettier configuration
- [x] T006 [P] Verify existing Angular Material setup and OnPush change detection

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Add multilingual type interfaces to src/app/components/cv/types.ts
- [x] T008 Update existing interfaces in src/app/components/cv/types.ts to support multilingual structure
- [x] T009 Verify no duplicate TypeScript types exist in codebase after adding multilingual interfaces
- [x] T010 Verify existing ArticleService.selectedLanguage signal is accessible
- [x] T011 Verify existing UrlService language parameter handling works
- [x] T012 Verify existing header language selector component functions
- [x] T013 Create backup of current igor_kulebyakin_resume.json for migration safety

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Multilingual Data Structure (Priority: P1) 🎯 MVP

**Goal**: System needs to store and retrieve CV content in both English and Russian languages from a structured JSON format, working with the existing language selector in the header.

**Independent Test**: The language selector already exists in the header so the feature can be fully tested by using the language selector and verifying that clicking language buttons switches all CV content between English and Russian versions.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T014 [P] [US1] Unit test for multilingual type interfaces in src/app/components/cv/cv.component.spec.ts
- [x] T015 [P] [US1] Unit test for translation helper functions in src/app/components/cv/cv.component.spec.ts
- [x] T016 [P] [US1] Unit test for signal-based language switching in src/app/components/cv/cv.component.spec.ts
- [x] T017 [P] [US1] Unit test for fallback mechanism in src/app/components/cv/cv.component.spec.ts

### Implementation for User Story 1

- [x] T018 [US1] Transform resume JSON to multilingual structure in src/assets/igor_kulebyakin_resume.json
- [x] T019 [US1] Add translation helper functions to src/app/components/cv/cv.component.ts
- [x] T020 [US1] Add signal-based localized data computation to src/app/components/cv/cv.component.ts
- [x] T021 [US1] Update template to use computed signals in src/app/components/cv/cv.component.html
- [x] T022 [US1] Add transformToLocalized method to src/app/components/cv/cv.component.ts
- [x] T023 [US1] Update component imports to include multilingual types in src/app/components/cv/cv.component.ts
- [x] T024 [US1] Verify all existing helper methods still work with signal-based data in src/app/components/cv/cv.component.ts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: Visual Validation & Polish

**Purpose**: Visual testing using Playwright MCP and final improvements

- [x] T025 [P] Start development server for visual testing
- [x] T026 [P] Use Playwright MCP server to validate language switching UI behavior
- [x] T027 [P] Use Playwright MCP server to verify content display correctness
- [x] T028 [P] Use Playwright MCP server to confirm fallback behavior visualization
- [x] T029 [P] Use Playwright MCP server to validate performance targets
- [x] T030 [P] Run all unit tests to ensure 90% coverage requirement
- [x] T031 [P] Run ESLint and Prettier to verify code quality compliance
- [x] T032 [P] Verify static site generation works with new multilingual structure
- [x] T033 [P] Validate bundle size optimization and performance budgets
- [x] T034 [P] Verify accessibility compliance with WCAG 2.1 standards
- [x] T035 [P] Add comprehensive regression testing to ensure all existing CV functionality remains intact after multilingual implementation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **Visual Validation (Phase 4)**: Depends on User Story 1 completion

### Within User Story 1

- Tests (T014-T017) MUST be written and FAIL before implementation
- JSON transformation (T017) before component updates
- Helper functions (T018) before signal computation (T019)
- Template updates (T020) after component logic is complete

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- All tests for User Story 1 marked [P] can run in parallel
- All Visual Validation tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (ensure they FAIL first):
Task: "Unit test for multilingual type interfaces in src/app/components/cv/cv.component.spec.ts"
Task: "Unit test for translation helper functions in src/app/components/cv/cv.component.spec.ts"
Task: "Unit test for signal-based language switching in src/app/components/cv/cv.component.spec.ts"
Task: "Unit test for fallback mechanism in src/app/components/cv/cv.component.spec.ts"

# Launch all visual validation tasks together:
Task: "Use Playwright MCP server to validate language switching UI behavior"
Task: "Use Playwright MCP server to verify content display correctness"
Task: "Use Playwright MCP server to confirm fallback behavior visualization"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks story)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently with Playwright MCP
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Visual validation and polish → Final deliverable

### Visual Validation Strategy

With Playwright MCP server:

1. Start development server
2. Navigate to CV page
3. Test language switching via header selector
4. Verify content changes between English and Russian
5. Check fallback behavior for missing translations
6. Validate performance targets (<1s switching)

---

## Success Criteria Validation

### Measurable Outcomes

- **SC-001**: Users can switch between English and Russian CV content in under 1 second using existing header selector (validated via Playwright MCP)
- **SC-002**: 100% of translatable CV fields have Russian translations available (validated in JSON structure)
- **SC-003**: Language switching via URL paths works correctly in 100% of test cases (validated via Playwright MCP)
- **SC-004**: Zero data loss during migration from single-language to multilingual structure (validated by backup comparison)
- **SC-005**: All existing CV functionality remains intact after multilingual implementation (validated via existing tests)
- **SC-006**: Language switching functionality works correctly when validated through IDE using Playwright MCP server
- **SC-007**: Visual validation using Playwright MCP server confirms proper language switching UI behavior

### Constitution Compliance Metrics

- **CC-001**: Lighthouse performance score ≥ 90 for all pages (validated via Playwright MCP)
- **CC-002**: WCAG 2.1 accessibility compliance with zero high-severity violations (validated via automated tools)
- **CC-003**: Vitest test coverage ≥ 90% for all new code (validated via test runner)
- **CC-004**: ESLint/Prettier compliance with zero errors before commits (validated via linting tools)
- **CC-005**: Static site generation successful with all content properly indexed (validated via build process)
- **CC-006**: Bundle size optimization meeting performance budgets (validated via build analysis)
- **CC-007**: Security scan passes with zero high-severity vulnerabilities (validated via security tools)

---

## Notes

- [P] tasks = different files, no dependencies
- [US1] label maps task to User Story 1 for traceability
- User Story 1 should be independently completable and testable
- Verify tests fail before implementing (T013-T016)
- Use Playwright MCP server for visual validation (T025-T028)
- Commit after each task or logical group
- Stop at User Story 1 checkpoint to validate independently
- Avoid: vague tasks, same file conflicts, breaking existing functionality
