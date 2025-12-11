# Implementation Plan: Angular Test Coverage

**Branch**: `003-angular-tests-coverage` | **Date**: 2025-12-04 | **Spec**: `specs/003-angular-tests-coverage/spec.md`
**Input**: Feature specification from `specs/003-angular-tests-coverage/spec.md`

**Note**: Plan generated via `/speckit.plan` for enforcing and documenting Angular test coverage with Vitest.

## Summary

Ensure that all **coverable** Angular code under `src/app` has unit tests written with **Vitest**, achieving **≥ 90% coverage** for new and existing coverable code, while respecting the project constitution. Coverage is treated as a **strong, CI-reported guideline** (warnings, not hard failures), with a small, explicitly documented exception allowlist for legacy or structurally untestable areas. The work includes tightening test/coverage tooling, clarifying “coverable” scope, and making expectations visible to contributors. Tests can not introduce any linting errors. Tests can not use deprecated features of Angular or any other packages unless newer feature is not available. No explicit `any` in tests. Use only public API of components, classes and services in tests, and the rendered DOM. Tests can not use private or protected members or internal signals directly. It is the output that we are testing, not the internal implementation, so just test the output (DOM changes, console logs, etc.)

## Technical Context

**Language/Version**: TypeScript (strict mode) with Angular 20  
**Primary Dependencies**: Angular core & router, Angular Material (where used), Apollo Client (GraphQL, where used), **Vitest** as primary test runner, Angular Testing Utilities  
**Storage**: Static content + external GraphQL API (read-only blog content)  
**Testing**: Vitest unit tests for all coverable Angular elements; focus on behavior, not implementation details; coverage reports used as primary signal for enforcement  
**Target Platform**: Static web hosting (e.g., Netlify/Vercel) with static site generation enabled  
**Project Type**: Angular blog application with primarily read-only flows  
**Performance Goals**: ≥ 90 Lighthouse performance, OnPush change detection, Signals preferred over RxJS, lazy loading for heavier routes  
**Constraints**: Static site generation, SEO optimization, WCAG 2.1 compliance, no deprecated Angular APIs, no implicit `any` in tests  
**Scale/Scope**: Single Angular app with modest traffic; coverage feature scoped to Angular code under `src/app`

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Required Compliance Gates

- **Angular-First Architecture**: All components follow Angular 20 patterns and style guide
- **TypeScript Discipline**: Strict mode enabled, proper interfaces, no implicit any
- **Test-First Development**: Vitest tests written before implementation unless implementation is already in place, 90% coverage
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
  app/
    components/        # Presentational components
    containers/        # Smart/container components
    services/          # Services and API clients
    models/            # TS interfaces/types (I-prefixed interfaces)
    shared/            # Shared modules, pipes, directives
    app.module.ts      # Root module
    app-routing.module.ts

tests/                 # Vitest tests (may co-locate or live here)
  unit/                # Unit tests for services/components
  integration/         # Optional higher-level tests
```

**Structure Decision**: Use the constitution’s Angular layout under `src/app` as the canonical source of **coverable** code, and keep Vitest tests either co-located with features or under `tests/` while ensuring coverage configuration treats `src/app` (excluding infra files) as the coverage root.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
