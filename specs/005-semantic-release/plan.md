# Implementation Plan: Semantic Release Integration

**Branch**: `005-semantic-release` | **Date**: 2025-12-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-semantic-release/spec.md`

## Summary

Automate versioning using semantic-release while preserving the existing Jenkins two-pass pipeline. The `bump_version` stage in `cicd/Dockerfile.production` runs semantic-release in CI mode (not dry-run) to compute the next version, update configured assets, create the release commit/tag, and push the changes back to GitHub. The semantic-release git commit message includes `[skip ci]` so the follow-up Jenkins run (triggered by the push) skips CI stages. Conventional Commits are enforced via commitlint/husky; breaking changes signaled with `feat!` or `BREAKING CHANGE:` drive major bumps.

- Respect existing CI structure: lint/test/build precede release; semantic-release runs from the Dockerfile `bump_version` target.
- Use semantic-release for real to derive and publish the release commit/tag; Jenkins two-pass behavior is handled via `[skip ci]`.
- Enforce Conventional Commits via commitlint (20.x) + husky commit-msg hook.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.9.3 with Angular 20.3.15  
**Primary Dependencies**: Angular Material, Apollo Client (GraphQL), Vitest, semantic-release 25.x, commitlint 20.x  
**Storage**: Static content files + GraphQL API  
**Testing**: Vitest with Angular Testing Utilities  
**Target Platform**: Static web hosting (Vercel, Netlify, etc.)  
**Project Type**: Single-page web application  
**Performance Goals**: <200ms page load, 90+ Lighthouse performance  
**Constraints**: Static site generation, SEO optimization, WCAG 2.1 compliance; Jenkins pipeline must remain unchanged except inside `bump_version` stage; semantic-release runs in CI mode to publish the release commit/tag; follow-up Jenkins run must be skipped via `[skip ci]`.  
**Scale/Scope**: Blog platform with <1000 pages, <10k concurrent users

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Required Compliance Gates

- **Angular-First Architecture**: All components follow Angular 20 patterns and style guide
- **TypeScript Discipline**: Strict mode enabled, proper interfaces, no implicit any
- **Test-First Development**: Vitest tests written before implementation, 90% coverage
- **Performance-First Design**: OnPush change detection, Signals preferred, lazy loading
- **Static Site Optimization**: Features support static generation, SEO-optimized
- **Code Quality**: ESLint/Prettier compliance, Conventional Commits format
- **Accessibility**: WCAG 2.1 compliance, semantic HTML, ARIA attributes
- **Security**: Input sanitization, XSS protection, updated dependencies

### Complexity Justification Required For

- Deviations from OnPush change detection strategy
- RxJS usage when Signals would be more appropriate
- Server-side dependencies in production builds
- Components without proper accessibility attributes
- Code not following TypeScript strict mode requirements

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── app/
│   ├── components/      # Dumb components (presentational)
│   ├── containers/      # Smart components (container components)
│   ├── services/        # Services and API clients
│   ├── models/          # TypeScript interfaces/types
│   ├── shared/          # Shared modules, pipes, directives
│   ├── app.module.ts    # Root module
│   └── app-routing.module.ts # Routing configuration

tests/
├── unit/                # Vitest unit tests
├── integration/         # Integration tests
└── contract/            # Contract tests
```

**Structure Decision**: Use existing monorepo layout; CI artifacts are in `cicd/`, semantic-release config at repo root, husky hooks in `.husky/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| None      | N/A        | N/A                                  |
