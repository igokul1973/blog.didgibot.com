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
- **Testing**: Vitest (in progress migration from Karma/Jasmine)
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

pnpm test           # Run Vitest in watch mode
pnpm test:headless  # Run Vitest once (CI-style)
pnpm test:ui        # Vitest UI
pnpm test:coverage  # Vitest with coverage

pnpm test:karma     # Legacy Angular CLI Karma tests (kept for reference; deprecated)

pnpm check:types    # Type check TypeScript (no emit) using a dedicated tsconfig
```

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

- Prints a message that tests are **temporarily disabled** while Angular tests are migrated from Karma/Jasmine to Vitest
- Allows pushes to proceed

Once test migration is complete, this hook can be updated to run `pnpm test:headless` and block pushes on failing tests.

---

## Testing

### Current state

- **Vitest** is configured (see `vitest.config.ts` and `src/test-setup.ts`).
- Existing Angular tests were originally written for Karma/Jasmine and are being migrated to Vitest.
- A legacy `test:karma` script remains for running the old Angular CLI test runner if needed.

### Recommended usage

- For new tests, prefer **Vitest** test files under `src/**/*.spec.ts`.
- Use `pnpm test` during development and `pnpm test:headless` for CI-style runs once migration is complete.

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
