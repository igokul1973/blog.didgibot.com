# Quickstart: Vitest Everywhere

This quickstart explains how to work with tests after the **Vitest Test Migration** feature is implemented.

## Prerequisites

- Node.js 22+
- pnpm installed
- Project dependencies installed:

```bash
pnpm install
```

## Running Tests

### Run tests in watch mode

```bash
pnpm test
```

- Starts Vitest in watch mode.
- Uses `vitest.config.ts` with `environment: 'jsdom'` and `src/test-setup.ts`.

### Run tests once (CI / pre-push)

```bash
pnpm test:headless
```

- Runs Vitest in single-run mode.
- Intended for CI and the **pre-push** hook.

### Run tests with coverage

```bash
pnpm test:coverage
```

- Generates a coverage report using the V8 provider.

## Git Hooks

### Pre-commit

- Runs:
    - `pnpm lint`
    - `pnpm check:types`
- Blocks commits on lint/type errors.

### Pre-push (after migration)

- Runs:
    - `pnpm test:headless`
- Blocks pushes if any Vitest test fails.

## Writing New Tests

- Place spec files under `src/**/*.spec.ts` alongside the components/services they cover.
- Use Angular’s `TestBed` along with Vitest’s `describe`/`it`/`expect` APIs.
- Rely on `src/test-setup.ts` for browser API mocks (`matchMedia`, `ResizeObserver`, `IntersectionObserver`, etc.).

## Removing Legacy Karma/Jasmine

After the migration feature is complete:

- `test:karma` script will be removed from `package.json`.
- Karma/Jasmine devDependencies will be removed.
- Any remaining `karma.conf.js` or Jasmine-specific helpers should be deleted as part of cleanup.

At that point, **Vitest is the only supported test runner** for this project.
