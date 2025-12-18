# Tasks: Semantic Release Integration

**Input**: Design documents from `/specs/005-semantic-release/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Ensure tooling and hooks are installed locally.

- [x] T001 Install dependencies with pnpm to ensure hooks are available (root)
- [x] T002 Verify husky installation via `pnpm prepare` if hooks are missing (root)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core configuration before story work.

- [x] T003 Confirm semantic-release config `.releaserc.json` matches CI release behavior (root/.releaserc.json)
- [x] T004 Confirm commitlint conventional config `.commitlintrc.cjs` is present and references `@commitlint/config-conventional` (root/.commitlintrc.cjs)
- [x] T005 Ensure commit-msg hook invokes `pnpm commitlint --edit` (root/.husky/commit-msg)
- [x] T006 Ensure pre-commit hook runs lint and type-check (root/.husky/pre-commit)
- [x] T007 Verify package.json devDependencies include semantic-release 25.x and commitlint 20.x per plan (package.json)

**Checkpoint**: Foundation ready — hooks/config validated.

---

## Phase 3: User Story 1 - CI triggers automated releases (Priority: P1) 🎯 MVP

**Goal**: CI runs semantic-release in bump_version stage to compute next version, update configured assets, create the release commit/tag, and push to GitHub.

**Independent Test**: Run bump_version stage; semantic-release computes version, updates assets, creates the release commit/tag, and pushes; follow-up Jenkins run is skipped via `[skip ci]`.

### Implementation for User Story 1

- [x] T008 [US1] Ensure `cicd/Dockerfile.production` bump_version runs `pnpm release --ci` and performs the release commit/tag push (cicd/Dockerfile.production)
- [x] T009 [US1] Validate git fetch/tags and error handling for failures to compute a next version (cicd/Dockerfile.production)
- [x] T010 [US1] Confirm there is no separate commit/push stage; semantic-release git plugin commits configured assets and includes `[skip ci]` in the release commit message (cicd/Dockerfile.production, .releaserc.json)
- [x] T011 [US1] Confirm `GITHUB_TOKEN`/`GH_TOKEN` env placeholders remain set in bump_version stage to satisfy semantic-release env checks (cicd/Dockerfile.production)

**Checkpoint**: bump_version publishes the release commit/tag; follow-up Jenkins run is skipped via `[skip ci]`.

---

## Phase 4: User Story 2 - Commit messages enforce conventional format (Priority: P2)

**Goal**: Block non-conventional commits; allow conventional ones.

**Independent Test**: Invalid commit message is rejected; valid conventional message passes.

### Implementation for User Story 2

- [x] T012 [US2] Verify commitlint dependency versions and config align with conventional commits (package.json, .commitlintrc.cjs)
- [x] T013 [US2] Ensure commit-msg hook is executable and sourced via husky shim (root/.husky/commit-msg)
- [x] T014 [US2] Add/update contributor docs snippet for acceptable commit types and breaking-change syntax (README.md or docs/release.md)

**Checkpoint**: Non-conforming commits blocked; conforming messages pass.

---

## Phase 5: User Story 3 - Documentation for releases (Priority: P3)

**Goal**: Clear instructions for release flow, commit types, and breaking-change signaling.

**Independent Test**: New contributor follows doc to create a breaking-change commit and sees major bump computed.

### Implementation for User Story 3

- [x] T015 [US3] Document release flow (semantic-release runs in bump_version and pushes release commit/tag) and required env vars (README.md or docs/release.md)
- [x] T016 [US3] Document Conventional Commit types, `feat!`/`BREAKING CHANGE` for majors, and local dry-run command (`pnpm release --ci --dry-run`) (README.md or docs/release.md)

**Checkpoint**: Docs enable a new contributor to trigger correct version computation.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Final verifications and cleanup.

- [x] T017 [P] Re-verify `.releaserc.json` assets list matches desired files (package.json, pnpm-lock.yaml, CHANGELOG.md) (root/.releaserc.json)
- [x] T018 [P] Sanity check package version remains computed by pipeline (no manual bumps) (package.json)

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): none
- Foundational (Phase 2): depends on Phase 1
- User Stories (Phases 3–5): depend on Phase 2 completion
- Polish: depends on prior phases

### User Story Dependencies

- US1 → foundational
- US2 → foundational
- US3 → foundational; can run after US1/US2 knowledge but is largely independent

### Parallel Opportunities

- [P]-marked tasks can run in parallel.
- Documentation (US3) can proceed after foundational while US1/US2 are validated if desired.
