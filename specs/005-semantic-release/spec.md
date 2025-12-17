# Feature Specification: Semantic Release Integration

**Feature Branch**: `005-semantic-release`  
**Created**: 2025-12-16  
**Status**: Draft  
**Input**: User description: "Implement and configure https://github.com/semantic-release/semantic-release in this codebase. Use most widely-accepted best practices. Change current CI pipelines to run appropriate commands to bump the version the correct way according to documentation. Think about how the major version bump can be done (through a specific commit message format?) Make sure correct commit message is used using pre-commit hooks. Correct commit message starts with `feat:`, `test:`, etc (consult the documentation for `https://github.com/semantic-release/semantic-release` for correct message format.). Update documentation accordingly."

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

### User Story 1 - CI triggers automated releases (Priority: P1)

Engineering teams need CI to publish versions automatically using semantic-release when main branch builds succeed.

**Why this priority**: Ensures consistent, automated versioning and publishing with no manual steps, preventing mistakes.

**Independent Test**: Run CI on a commit with a conventional commit message; confirm semantic-release calculates next version, generates notes, and publishes the release artifact without manual intervention.

**Acceptance Scenarios**:

1. **Given** main branch has a new `feat:` commit, **When** CI runs semantic-release, **Then** the version is bumped per semantic-release rules, release notes are generated, and artifacts are published.
2. **Given** main branch has a `fix:` commit with no breaking changes, **When** CI runs semantic-release, **Then** the patch version increments and the release is published.

---

### User Story 2 - Commit messages enforce conventional format (Priority: P2)

Contributors need guidance and guardrails to produce conventional commit messages so semantic-release can infer correct versions.

**Why this priority**: Prevents malformed commits that would break release automation; keeps versioning predictable.

**Independent Test**: Create commits; pre-commit hook rejects non-conventional messages while accepting valid prefixes and scopes.

**Acceptance Scenarios**:

1. **Given** a developer writes a commit message without a valid type (e.g., `update stuff`), **When** the hook runs, **Then** the commit is blocked with guidance.

---

### User Story 3 - Documentation for releases (Priority: P3)

Team members need clear documentation on how releases are triggered, commit message types, and how to handle breaking changes.

**Why this priority**: Reduces onboarding friction and errors; clarifies how to signal major versions via `feat!` or `BREAKING CHANGE`.

**Independent Test**: A new contributor follows the doc and successfully creates a release-ready commit that triggers the expected version bump.

**Acceptance Scenarios**:

1. **Given** a developer reads the release guide, **When** they follow steps to commit a breaking change (`feat!: ...` or footer `BREAKING CHANGE:`), **Then** semantic-release produces a major version on merge to main.

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

- CI run on a non-default branch should not publish releases unless explicitly configured (e.g., prerelease channels).
- Commits lacking semantic prefixes must fail fast via hooks to avoid silent mis-versioning.
- Dry-run should be available locally to verify release notes without publishing.
- Missing repository credentials or tokens should fail the pipeline with actionable error messaging.
- Jenkins pipeline must remain unchanged except for logic inside `bump_version` stage in `cicd/Dockerfile.production`; semantic-release runs `--dry-run` only to compute version and write it to `package.json`, leaving existing commit/push stage intact.
- The commit in `commit_new_version` MUST use a conventional prefix (e.g., `chore(release): ... [version bump]`) so commitlint passes while the `[version bump]` suffix keeps Jenkins from re-running stages.

## Requirements _(mandatory)_

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
  CONSTITUTION COMPLIANCE: All requirements must support static site generation,
  accessibility (WCAG 2.1), and Angular 20 best practices.
-->

### Functional Requirements

- **FR-001**: CI MUST run semantic-release after successful lint/test/build on the main release branch to compute next version, generate release notes, and publish artifacts/tags per configuration.
- **FR-002**: Project MUST configure semantic-release with conventional-commits preset and plugins for changelog, git tagging, and (if applicable) registry publishing; when invoked in CI `bump_version` stage it MUST use `--dry-run` and only write the computed version into `package.json`, deferring commit/push to the existing pipeline stage.
- **FR-003**: Commit messages MUST follow the Conventional Commits spec (e.g., `feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`) to drive correct version bumps; breaking changes MUST be signaled via `!` in the type/scope or `BREAKING CHANGE:` footer.
- **FR-004**: Pre-commit or commit-msg hooks MUST prevent non-conforming commit messages and provide guidance on allowed formats.
- **FR-005**: Documentation MUST describe how to perform releases, including commit types, breaking-change notation, and how CI triggers semantic-release.

### Technical Requirements _(Constitution Compliance)_

- **TR-001**: All components MUST use OnPush change detection strategy by default
- **TR-002**: All TypeScript code MUST follow strict mode with proper interfaces
- **TR-003**: All UI components MUST meet WCAG 2.1 accessibility standards
- **TR-004**: All features MUST support static site generation
- **TR-005**: All new code MUST have Vitest tests with 90% minimum coverage
- **TR-006**: Signals MUST be preferred over RxJS unless RxJS is more appropriate
- **TR-007**: All user inputs MUST be sanitized using Angular's XSS protection

### Key Entities _(include if feature involves data)_

- **Release**: Semantic-release computed version, notes, and associated git tag.
- **Commit Message**: Conventional commit string containing type, optional scope, subject, and optional breaking-change indicators.

## Success Criteria _(mandatory)_

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
  CONSTITUTION COMPLIANCE: Include metrics for accessibility, performance, and code quality.
-->

### Measurable Outcomes

- **SC-001**: 100% of main-branch CI runs execute semantic-release after passing tests/build without manual version commands.
- **SC-002**: 0 commits merged to main with non-conventional messages (hook enforcement success rate).
- **SC-003**: Release version increments (major/minor/patch) match Conventional Commits semantics in 100% of tested scenarios (feat → minor, fix → patch, feat! or BREAKING CHANGE → major).
- **SC-004**: Release documentation enables a new contributor to trigger a correct release in under 15 minutes following the guide.

### Constitution Compliance Metrics

- **CC-001**: Lighthouse performance score ≥ 90 for all pages
- **CC-002**: WCAG 2.1 accessibility compliance with zero high-severity violations
- **CC-003**: Vitest test coverage ≥ 90% for all new code
- **CC-004**: ESLint/Prettier compliance with zero errors before commits
- **CC-005**: Static site generation successful with all content properly indexed
- **CC-006**: Bundle size optimization meeting performance budgets
- **CC-007**: Security scan passes with zero high-severity vulnerabilities
