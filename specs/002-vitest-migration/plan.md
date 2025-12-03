# Implementation Plan: Vitest Test Migration

**Branch**: `002-vitest-migration` | **Date**: 2025-12-03 | **Spec**: `specs/002-vitest-migration/spec.md`
**Input**: Feature specification from `/specs/002-vitest-migration/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Migrate the project to use **Vitest as the single test runner** for Angular components, services, and pipes. This includes:

- Migrating existing Angular tests from Karma/Jasmine to Vitest-compatible patterns where feasible.
- Providing a robust Angular+Vitest test environment (jsdom, Angular `TestBed`, browser API mocks).
- Updating the **pre-push** git hook to run Vitest (`pnpm test:headless`) and block pushes on failures.
- Removing the legacy `test:karma` script, documentation references to Karma/Jasmine, and all direct Karma/Jasmine devDependencies.

The technical approach is to reuse Angular’s testing utilities with Vitest using Angular 20’s experimental Vitest support (configured via Angular CLI and `angular.json`), without custom `vitest.config.ts` or global `src/test-setup.ts` files, and to incrementally migrate tests while keeping hooks and type checking green at all times.

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
specs/002-vitest-migration/
├── spec.md        # Feature specification (Vitest migration)
├── plan.md        # This file (/speckit.plan output)
├── research.md    # Phase 0 research: Vitest + Angular decisions
├── data-model.md  # Phase 1 entities: test commands, hooks, toolchain
└── quickstart.md  # Phase 1 quickstart: how to run and maintain Vitest
```

### Source Code (repository root)

```text
src/
  app/
    components/      # Presentational components
    containers/      # Smart/container components
    services/        # Services and API clients
    models/          # TS interfaces/types
    shared/          # Shared modules, pipes, directives
    app.module.ts    # Root module
    app-routing.module.ts  # Routing configuration

  main.ts            # App bootstrap

tsconfig.json        # Base TS config
tsconfig.check-types.json  # Type-check-only config (no emit)
package.json         # Scripts, dependencies (Vitest-only testing)
.husky/
  pre-commit         # Lint + typecheck
  pre-push           # Will run Vitest tests after migration
```

**Structure Decision**: Vitest is configured via Angular CLI / `angular.json` using Angular 20’s experimental Vitest support, reusing the existing Angular `src/app` layout defined in the constitution. No dedicated `tests/` folder is introduced; specs stay co-located with the Angular code under `src/**/*.spec.ts`, and no standalone `vitest.config.ts` or global `src/test-setup.ts` files are used.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
