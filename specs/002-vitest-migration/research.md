# Research: Vitest Test Migration

## Decision 1: Test Runner

- **Decision**: Use **Vitest** as the single test runner for all unit-level Angular tests.
- **Rationale**:
    - Already installed and partially configured in the project.
    - Fast watch mode, good TypeScript support, jsdom environment.
    - Aligns with the constitution’s "Test-First Development" principle and existing tooling (Vite ecosystem).
- **Alternatives Considered**:
    - **Karma/Jasmine** (current legacy stack): Slow, browser-bound, harder to maintain, no longer aligned with project direction.
    - **Jest**: Popular but would add overlapping tooling when Vitest is already in place; less direct integration with Vite.

## Decision 2: Angular Test Environment

- **Decision**: Use Angular’s official testing utilities (`@angular/core/testing` `TestBed`) together with Vitest running in `jsdom`.
- **Rationale**:
    - Minimizes changes needed in existing Angular specs (most `TestBed`-based tests can be adapted rather than rewritten).
    - Keeps parity with historical Angular testing guidance while modernizing the runner.
- **Alternatives Considered**:
    - Rewriting tests to be runner-agnostic without TestBed (plain DOM tests): too costly and not necessary for most components.

## Decision 3: Environment Setup Location

- **Decision**: Centralize browser and Angular testing setup in:
    - `vitest.config.ts` → `test` section with `environment: 'jsdom'`, `setupFiles: ['src/test-setup.ts']`.
    - `src/test-setup.ts` → polyfills/mocks for `matchMedia`, `ResizeObserver`, `IntersectionObserver`, etc.
- **Rationale**:
    - Keeps spec files focused on test logic, not environment plumbing.
    - Single place to adjust for CI/browser differences.
- **Alternatives Considered**:
    - Per-spec custom setup: would duplicate boilerplate and be harder to maintain.

## Decision 4: Git Hooks Strategy

- **Decision**:
    - Keep **pre-commit** focused on fast checks: ESLint + TypeScript type checking.
    - Enable **pre-push** to run `pnpm test:headless` (Vitest) once the migration is stable.
- **Rationale**:
    - Pre-commit needs to stay fast (<30s) for good dev UX; full test runs belong in pre-push/CI.
    - Pre-push is the right place to enforce "no broken tests" before sharing changes.
- **Alternatives Considered**:
    - Running full tests on every commit: too slow and not necessary given pre-push/CI.

## Decision 5: Handling Legacy Karma/Jasmine

- **Decision**: Remove all direct Karma/Jasmine devDependencies and the `test:karma` script once Vitest is fully adopted, while allowing a short transitional period if needed behind a separate branch/feature flag.
- **Rationale**:
    - Simplifies mental model and tooling; avoids confusion about which runner to use.
    - Reduces maintenance and dependency surface area.
- **Alternatives Considered**:
    - Keeping both stacks indefinitely: increases complexity and risk of divergence between test suites.

## Decision 6: Scope of Test Migration

- **Decision**: Focus on **unit-level specs** (components, pipes, services) first; treat any highly coupled integration/system tests as candidates for follow-up work if they require non-trivial adaptation.
- **Rationale**:
    - Delivers most value quickly while keeping risk manageable.
    - Matches the constitution’s emphasis on unit tests and 90% coverage.
- **Alternatives Considered**:
    - Big-bang migration of every existing spec: higher risk and longer time-to-value.
