# Implementation Plan: Semantic Release Integration

**Branch**: `005-semantic-release` | **Date**: 2025-12-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-semantic-release/spec.md`

## Summary

Automate versioning using semantic-release while preserving the existing Jenkins two-pass pipeline. Only the `bump_version` stage in `cicd/Dockerfile.production` is adjusted to run semantic-release in `--dry-run` mode to compute the next version, write it into `package.json`, and allow the existing commit stage to push. No other pipeline stages change. Conventional Commits are enforced via commitlint/husky; breaking changes signaled with `feat!` or `BREAKING CHANGE:` drive major bumps.

- Respect existing CI structure: no changes to Jenkinsfile logic; only `bump_version` stage logic updated.
- Use semantic-release dry-run to derive version; manual commit stage remains authoritative for pushing changes.
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
**Constraints**: Static site generation, SEO optimization, WCAG 2.1 compliance; Jenkins pipeline must remain unchanged except inside `bump_version` stage; semantic-release runs `--dry-run` only to compute version; manual commit stage retained.  
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
