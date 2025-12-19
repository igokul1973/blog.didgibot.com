# Tasks: Update Node.js to v24.11.1

**Input**: Design documents from `/specs/006-update-nodejs-version/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not requested in feature specification.

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

N/A - This is an update to existing infrastructure, no setup required.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

N/A - No foundational changes required for this update.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Update Docker Images to Node.js v24.11.1 (Priority: P1) 🎯 MVP

**Goal**: Update Docker base images to use Node.js v24.11.1 for consistent containerized environment.

**Independent Test**: Build Docker image from Dockerfile.base and verify Node version inside container is 24.11.1.

### Implementation for User Story 1

- [x] T001 [P] [US1] Update FROM node:22-alpine3.21 to FROM node:24.11.1-alpine3.21 in cicd/Dockerfile.base
- [x] T002 [P] [US1] Update FROM node:22-alpine3.21 to FROM node:24.11.1-alpine3.21 in cicd/Dockerfile.production

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Update CI Pipeline Node Version (Priority: P1)

**Goal**: Modify CI pipeline to use Node.js v24.11.1 for builds and tests.

**Independent Test**: Jenkins pipeline executes successfully with Node version 24.11.1.

### Implementation for User Story 2

- [x] T003 [US2] Update Node.js version to 24.11.1 in cicd/Jenkinsfile

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Update Package.json Engines (Priority: P2)

**Goal**: Specify Node.js v24.11.1 in package.json engines for compatibility declarations.

**Independent Test**: package.json engines field specifies "node": "24.11.1"

### Implementation for User Story 3

- [x] T004 [US3] Update "engines": {"node": ">=22.0.0"} to "engines": {"node": "24.11.1"} in package.json

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T005 Build Docker images and verify Node version
- [x] T006 Run CI pipeline with updated configuration
- [x] T007 Run application build and tests with Node.js v24.11.1
- [x] T008 Update any documentation if needed, such as README.md, quickstart.md, development_quidelines.md, etc.

---

## Dependencies & Execution Order

### Phase Dependencies

- **User Stories (Phase 3-5)**: No dependencies - can proceed in parallel
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start immediately - No dependencies on other stories
- **User Story 2 (P1)**: Can start immediately - No dependencies on other stories
- **User Story 3 (P2)**: Can start immediately - No dependencies on other stories

### Within Each User Story

- Tasks within each story can be parallel where marked [P]

### Parallel Opportunities

- All tasks marked [P] can run in parallel
- All user stories can be implemented in parallel by different team members

---

## Parallel Example: All User Stories

```bash
# Update all files in parallel:
Task: "Update FROM node:22-alpine3.21 to FROM node:24.11.1-alpine3.21 in cicd/Dockerfile.base"
Task: "Update FROM node:22-alpine3.21 to FROM node:24.11.1-alpine3.21 in cicd/Dockerfile.production"
Task: "Update Node.js version to 24.11.1 in cicd/Jenkinsfile"
Task: "Update engines in package.json"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 3: User Story 1
2. Test Docker image build and Node version
3. Deploy/demo if ready

### Incremental Delivery

1. Complete all user stories in parallel
2. Test each independently
3. Validate all together

### Parallel Team Strategy

With multiple developers:

1. Each developer takes one user story
2. Implement and test independently
3. Integrate and validate

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
