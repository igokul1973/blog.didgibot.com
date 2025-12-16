# Implementation Plan: Angular frontend CI/CD pipeline

**Branch**: `[004-angular-cicd-pipeline]` | **Date**: 2025-12-12 | **Spec**: [Feature spec](./spec.md)
**Input**: Feature specification from `./spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a Jenkins/Kubernetes-based CI/CD pipeline for the Angular frontend that runs inside a Kubernetes agent pod (with `docker` for building/running an ephemeral CI runner image from `cicd/Dockerfile.production` and `kaniko` for building/pushing the Angular application image), enforces 90% per-file test coverage for all non-excluded files, and deprecates the old pipeline while keeping a clear migration and rollback path.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.9.3 with Angular 20.3.15  
**Primary Dependencies**: Angular Material, Apollo Client (GraphQL), Vitest  
**Storage**: Static content files + GraphQL API  
**Testing**: Vitest with Angular Testing Utilities  
**Target Platform**: Static web hosting (Vercel, Netlify, etc.)  
**Project Type**: Single-page web application  
**Performance Goals**: <200ms page load, 90+ Lighthouse performance  
**Constraints**: Static site generation, SEO optimization, WCAG 2.1 compliance  
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

**Structure Decision**: This feature does not introduce new Angular application structure. It reuses the existing `src/app` layout and focuses solely on CI/CD infrastructure in the `cicd/` and `specs/004-angular-cicd-pipeline/` directories.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
