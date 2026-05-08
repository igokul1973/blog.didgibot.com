# Tasks: Education Duration Display

**Feature**: 011-education-duration  
**Branch**: `011-education-duration`  
**Date**: 2026-05-08  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Task Summary

- **Total Tasks**: 8
- **Tasks per User Story**: 8 (US1)
- **Parallel Opportunities**: 2
- **Independent Test Criteria**: Can be tested by loading CV page in each supported language and verifying duration display with proper translations using MCP Playwright
- **MVP Scope**: User Story 1 (complete feature - only story)

---

## Phase 1: Setup

### Goal

Prepare the development environment and verify prerequisites.

- [x] T001 Verify branch `011-education-duration` is checked out and clean
- [x] T002 Verify dependencies are installed (Angular 20.3.15, TypeScript 5.9.3, Vitest 4.1.0)

---

## Phase 2: Foundational

### Goal

Ensure the CV component structure is ready for modifications.

- [x] T003 Verify CV component structure exists at `src/app/components/cv/`
- [x] T004 Review existing formatDateRange implementation in `src/app/components/cv/cv.component.ts` for reference

---

## Phase 3: User Story 1 - View Education Duration in Any Language on CV page (P1)

### Goal

Display education duration (start year, end year, and calculated duration text) on the CV page in all supported languages, positioned between institution name and field of study.

**Independent Test Criteria**: Load CV page in English and Russian, verify education entries display duration formatted as "Start Year - End Year (duration text)" in the correct position with proper translations. Use MCP Playwright to switch languages and verify correct rendering.

### Implementation Tasks

- [x] T005 [US1] Add getDurationText helper method in `src/app/components/cv/cv.component.ts`
- [x] T006 [US1] Add formatYearRange method in `src/app/components/cv/cv.component.ts`
- [x] T007 [P] [US1] Update education section template in `src/app/components/cv/cv.component.html` to display duration
- [x] T008 [P] [US1] Add CSS styling for education duration in `src/app/components/cv/cv.component.scss`

### Test Tasks

- [x] T009 [US1] Write tests for getDurationText helper in `src/app/components/cv/cv.component.spec.ts`
- [x] T010 [US1] Write tests for formatYearRange in `src/app/components/cv/cv.component.spec.ts`
- [x] T011 [US1] Write integration test for education duration rendering in `src/app/components/cv/cv.component.spec.ts`

---

## Phase 4: Polish & Cross-Cutting Concerns

### Goal

Verify implementation meets all quality standards and requirements.

- [x] T012 Run all tests with `pnpm test:headless` and verify 90%+ coverage
- [x] T013 Build project with `pnpm build` and verify no errors
- [x] T014 Verify CV page displays education duration in English using MCP Playwright
- [x] T015 Verify CV page displays education duration in Russian using MCP Playwright
- [x] T016 Run ESLint and Prettier to ensure code quality compliance

---

## Dependencies

```
Phase 1 (Setup)
  ↓
Phase 2 (Foundational)
  ↓
Phase 3 (US1) ← T005 → T006 → {T007, T008} [parallel] → {T009, T010, T011}
  ↓
Phase 4 (Polish)
```

**Story Dependencies**: None (single story)

---

## Parallel Execution Examples

### Within US1 Phase:

- T007 and T008 can run in parallel (different files, no dependencies)
- T009, T010, and T011 can run in parallel (all test files, no interdependencies)

---

## Implementation Strategy

### MVP Approach

Since this is a single-user-story feature, the MVP is the complete implementation of User Story 1. There are no lower-priority stories to defer.

### Incremental Delivery

1. **Tests First**: Write tests for duration calculation logic before implementation (T009, T010)
2. **Logic Implementation**: Add getDurationText and formatYearRange methods (T005, T006)
3. **UI Implementation**: Update template and styling (T007, T008)
4. **Integration**: Add integration test (T011)
5. **Verification**: Run tests and Playwright verification (T012-T016)

### Risk Mitigation

- Tests written before implementation ensure behavior is correct
- Reusing existing formatDateRange pattern reduces risk
- No interface changes minimize breaking changes
- No JSON changes prevent data corruption

---

## Task Validation

All tasks follow the required checklist format:

- ✅ Checkbox: `- [ ]`
- ✅ Task ID: Sequential (T001-T016)
- ✅ [P] marker: Included for parallelizable tasks (T007, T008, T009, T010, T011)
- ✅ [Story] label: Included for US1 tasks (T005-T011)
- ✅ Description: Clear action with exact file path
