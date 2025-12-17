# blog.didgibot.com

Personal technical blog built with **Angular 20**.

This repository contains the source code for https://blog.didgibot.com – a statically-rendered Angular application with a strong focus on performance, accessibility, and type safety.

---

## What is this repository for?

- Personal blog and knowledge base
- Angular 20 single-page application
- Content-focused site with code-heavy articles
- Example of a modern Angular setup with strict TypeScript, ESLint, Prettier, Vitest, and Husky

---

## Tech Stack

- **Framework**: Angular 20
- **UI**: Angular Material with custom theming
- **Language**: TypeScript 5.9
- **Build tooling**: Angular CLI, Vite (dev tooling)
- **Testing**: Vitest
- **Code quality**: ESLint, Prettier, Stylelint
- **GraphQL**: Apollo Client / apollo-angular
- **Package manager**: pnpm
- **Node version**: >= 22 (see `package.json` `engines` field)

---

## Getting Started

### Prerequisites

- Node.js **22+**
- pnpm (`corepack enable` or `npm install -g pnpm`)
- Git

### Installation

```bash
git clone git@github.com:igokul1973/blog.didgibot.com.git
cd blog.didgibot.com
pnpm install
```

### Running the app locally

```bash
pnpm start
```

This runs `ng serve -o --host 0.0.0.0` and opens the blog in your browser.

---

## Scripts

All scripts are defined in `package.json` and are intended to be run with **pnpm**.

```bash
pnpm start          # Run dev server (Angular CLI)
pnpm build          # Production build
pnpm lint           # Run ESLint
pnpm lint:fix       # ESLint with --fix

pnpm test           # Run Angular tests in watch mode (ng test, runner: Vitest)
pnpm test:headless  # Run Angular tests once (CI-style, ng test --no-watch)
pnpm test:ui        # Vitest UI

pnpm check:types    # Type check TypeScript (no emit) using a dedicated tsconfig
```

### Releases

- Release flow uses semantic-release in CI (via `cicd/Dockerfile.production` `bump_version` target). It is not a dry-run: semantic-release computes the next version, updates the configured assets, creates the release commit/tag, and pushes back to GitHub.
- That push triggers a second Jenkins run, but it skips CI stages due to the `[skip ci]` marker in the semantic-release commit message.
- See [docs/release.md](./docs/release.md) for commit formats, breaking-change syntax, required env vars, and local preview dry-run (`pnpm release --ci --dry-run`).

### Type checking

`check:types` runs `tsc --noEmit` against `tsconfig.check-types.json`, which:

- Extends the main `tsconfig.json`
- Enables `noEmit` (no build artifacts)
- Focuses on app source files and excludes test specs

This command is wired into Husky pre-commit hooks (see below).

---

## Husky Git Hooks & Code Quality

This repo uses **Husky v9** to enforce code quality on every commit and push.

### Pre-commit

Hook file: `.husky/pre-commit`

Runs, in order:

1. `pnpm lint`
2. `pnpm check:types`

Behavior:

- If linting fails → commit is blocked with a clear error message
- If type checking fails → commit is blocked with a clear error message
- If both pass → commit succeeds

### Pre-push

Hook file: `.husky/pre-push`

Currently:

- Runs `pnpm test:headless` to validate unit tests
- Blocks pushes when tests fail
- Component template tests are deferred to User Story 3 (templateUrl resolution)

---

## Testing

### Current state

- **Vitest** is configured via Angular CLI (`ng test` with `"runner": "vitest"` in `angular.json`).
- Unit tests for services, pipes, and Angular components (including standalone components with `templateUrl`/`styleUrl`) are migrated and passing.
- Browser-only APIs used in components (e.g. `ResizeObserver`, `matchMedia`, `IntersectionObserver`) are mocked or stubbed in individual specs where needed.
- Karma/Jasmine have been completely removed from the project.

### Recommended usage

- Use `pnpm test:headless` for fast unit tests, including in pre-push hooks.
- Use `pnpm test` during development and `pnpm test:headless` for running the full Angular test suite (Vitest via `ng test`) locally and in CI-style runs.
- When adding or updating specs, follow the testing guidelines in `development_guidelines.md` (no `any` in specs, proper Angular `TestBed` setup, typed mocks, and browser API stubs where required).

### Test Coverage

This project maintains high test coverage for Angular code under `src/app`:

- **Target**: ≥90% coverage for all coverable Angular code
- **Current Status**: 92.3% of files meet the 90%+ target (12 out of 13 files)
- **Coverage Reports**: Run `pnpm test:coverage` to generate reports
    - HTML report: `coverage/index.html`
    - JSON data: `coverage/coverage-final.json`

**Known Reporting Artifacts**:

- `blog.component.ts` may show 71.42% branch coverage in text reports (when all tests are run), but actual coverage is 100%
- This is a visualization issue in the text reporter, not a real coverage problem
- Raw V8 coverage data confirms all branches are covered
- See `specs/003-angular-tests-coverage/baseline-coverage.md` for details

**Exceptions**: See `specs/003-angular-tests-coverage/coverage-exceptions.md` for documented exceptions where testing constraints prevent reaching 90% without violating the constitution's public API requirement.

### Testing checklist

- Before committing:
    - `pnpm lint`
    - `pnpm check:types`
- On `git push`:
    - Husky runs `pnpm test:headless` and blocks the push if tests fail.
- Before merging or for larger changes:
    - Run `pnpm test:headless` to execute the full Angular test suite once.

---

## Contribution Guidelines

Basic expectations:

- Keep TypeScript strictness and lint rules passing (`pnpm lint`, `pnpm check:types`).
- Write or update tests (Vitest) where practical.
- Ensure pre-commit hooks pass before pushing.
- Use conventional-style commit messages where possible (e.g. `feat:`, `fix:`, `chore:`).

For larger changes, consider opening an issue or draft PR first.

---

## Contact

- Repo owner: @igokul1973 on GitHub
- Issues & feature requests: GitHub Issues on this repository
