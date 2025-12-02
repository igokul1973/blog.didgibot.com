<!--
Sync Impact Report:
- Version change: 0.0.0 → 1.0.0 (initial constitution)
- Modified principles: All 5 principles created from scratch
- Added sections: Development Standards, Project Structure Standards, Governance
- Removed sections: None
- Templates requiring updates: ✅ updated - plan-template.md, spec-template.md, tasks-template.md
- Follow-up TODOs: None - all placeholders filled
-->

# Blog.didgibot.com Constitution

## Core Principles

### I. Angular-First Architecture

Every component MUST follow Angular 20 framework patterns; Components must be self-contained, independently testable, and follow the Angular Style Guide; Clear separation between presentational (components/) and container (containers/) components required; Use object with `next`, `error`, and `complete` when subscribing to observables

### II. TypeScript Discipline

TypeScript strict mode mandatory; All code MUST use proper typing with interfaces over types unless union types needed; Use unknown instead of any; Interfaces must use I prefix; Enums must use Enum suffix; No implicit any types allowed; Use separate files named `types.ts` for types and enums co-located with the components, classes and services that use them; If necessary, use a shared types file in the root of the feature directory;

### III. Test-First Development (NON-NEGOTIABLE)

Vitest tests mandatory for all services, pipes, and components with complex logic; Tests written before implementation; Red-Green-Refactor cycle strictly enforced; Minimum 90% test coverage required; All tests must pass before code review

### IV. Performance-First Design

OnPush change detection strategy required by default; Signals preferred over RxJS unless RxJS is more appropriate; Unsubscribe from observables to prevent memory leaks; Use trackBy with @for; Lazy load feature modules; Performance profiling required for new features

### V. Static Site Optimization

All features MUST support static site generation; Build process must include sitemap generation; Content must be SEO-optimized; Client-side routing must work with static hosting; No server-side dependencies in production build

## Development Standards

### Code Quality Requirements

ESLint and Prettier configuration mandatory; All linting errors must be fixed before commits; Conventional Commits format required for all commit messages; Branch naming must follow feature/, bugfix/, hotfix/, chore/, docs/ pattern; Functions must be small and focused on single responsibility

### Accessibility & Security

WCAG 2.1 guidelines mandatory for all UI components; Semantic HTML required; Proper ARIA attributes must be included; Keyboard navigation must work correctly; All user inputs must be sanitized; Angular's built-in XSS protection must be utilized; Dependencies must be kept updated to avoid vulnerabilities

## Project Structure Standards

### Angular Application Layout

```
src/
  app/
    components/      # Dumb components (presentational)
    containers/      # Smart components (container components)
    services/        # Services and API clients
    models/          # TypeScript interfaces/types
    shared/          # Shared modules, pipes, directives
    app.module.ts    # Root module
    app-routing.module.ts # Routing configuration
```

### File Naming Conventions

kebab-case for file names (e.g., article.service.ts); dash-case for component selectors (e.g., app-article); PascalCase for class names and interfaces; camelCase for variables, functions, and methods; UPPER_CASE for constants

## Governance

This constitution supersedes all other development practices; All pull requests must verify compliance with these principles; Amendments require documentation, team approval, and migration plan; Use development_guidelines.md for runtime development guidance but this consitution still supersedes it; Complexity deviations must be justified in pull request descriptions

**Version**: 1.0.0 | **Ratified**: 2025-12-02 | **Last Amended**: 2025-12-02
