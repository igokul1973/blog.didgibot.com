# Implementation Plan: Add CV Page

**Branch**: `007-add-cv-page` | **Date**: 2026-03-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-add-cv-page/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Create a dedicated CV page displaying Igor's professional resume using structured TypeScript data objects. The feature will add a CV navigation icon to the desktop header (mobile menu already exists) and display CV content using Angular Material components with consistent styling matching existing blog pages. The implementation will extract text content from the HTML reference file and structure it into TypeScript interfaces for Contact, Summary, Skills, Experience, and Education sect

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.9.3 with Angular 20.3.15  
**Primary Dependencies**: Angular Material 20.2.14, Vitest 4.0.15, Material Icons  
**Storage**: Static TypeScript data objects in component files  
**Testing**: Vitest with Angular Testing Utilities  
**Target Platform**: Static web hosting (supports existing blog infrastructure)  
**Project Type**: Single-page web application (blog platform)  
**Performance Goals**: <200ms page load, 90+ Lighthouse performance  
**Constraints**: Static site generation, SEO optimization, WCAG 2.1 compliance, use existing libraries only  
**Scale/Scope**: Single CV page with minimal data, <1000 pages total blog, <10k concurrent users

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

```text
src/
├── app/
│   ├── components/
│   │   ├── cv/                    # CV component (existing - to be enhanced)
│   │   │   ├── cv.component.ts
│   │   │   ├── cv.component.html
│   │   │   ├── cv.component.scss
│   │   │   └── cv.component.spec.ts
│   │   └── header/                # Header component (existing - to be modified)
│   │       ├── header.component.ts
│   │       ├── header.component.html
│   │       ├── header.component.scss
│   │       └── header.component.spec.ts
│   ├── services/                   # Services (existing)
│   ├── models/                     # TypeScript interfaces/types
│   ├── shared/                     # Shared modules, pipes, directives
│   └── app.routes.ts              # Routing configuration (existing)
```

**Structure Decision**: Using existing Angular component structure. CV component will be enhanced with structured data models and Angular Material components. Header component will be modified to add CV navigation icon.

## Phase 1 Complete ✅

### Generated Artifacts

- **research.md**: Technical decisions and implementation strategy
- **data-model.md**: Complete TypeScript interfaces and data structure
- **contracts/cv-data-types.ts**: Type contracts for CV data
- **quickstart.md**: Step-by-step implementation guide

### Constitution Compliance Verification

✅ **Angular-First Architecture**: Components follow Angular 20 patterns  
✅ **TypeScript Discipline**: Strict interfaces, no implicit any  
✅ **Test-First Development**: Testing requirements defined  
✅ **Performance-First Design**: Static data, OnPush ready  
✅ **Static Site Optimization**: No runtime dependencies  
✅ **Code Quality**: ESLint/Prettier compliance planned  
✅ **Accessibility**: WCAG 2.1 compliance in design  
✅ **Security**: Input sanitization with Angular XSS protection

### Ready for Implementation

All technical unknowns resolved. Implementation can proceed using the quickstart guide and defined contracts.
