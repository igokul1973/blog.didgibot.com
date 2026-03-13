# Implementation Plan: CV Source of Truth Refactor

**Branch**: `008-cv-source-refactor` | **Date**: 2025-03-08 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/008-cv-source-refactor/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Refactor the CV feature to establish `igor_kulebyakin_resume.json` as the single source of truth by: 1) Converting all JSON keys to camelCase format, 2) Updating TypeScript interfaces to match the new structure, 3) Modifying the CV component to import and use the JSON data exclusively, 4) Removing hardcoded data from the component. This ensures type safety, maintainability, and eliminates data duplication while preserving the existing user experience.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.9.3 with Angular 20.3.15  
**Primary Dependencies**: Angular Material, Vitest  
**Storage**: Static JSON file (igor_kulebyakin_resume.json)  
**Testing**: Vitest with Angular Testing Utilities  
**Target Platform**: Static web hosting (Vercel, Netlify, etc.)  
**Project Type**: Single-page web application  
**Performance Goals**: <200ms page load, 90+ Lighthouse performance  
**Constraints**: Static site generation, SEO optimization, WCAG 2.1 compliance  
**Scale/Scope**: CV page with single JSON data source, minimal runtime processing

**Key Technical Decisions**:

- JSON import as TypeScript module for build-time processing
- Manual interface creation for precise type safety
- Fail-fast error handling with detailed logging
- Unit + integration testing approach for validation

## Constitution Check

### Pre-Implementation Status: ✅ PASSED

### Post-Implementation Status: ✅ PASSED

_Both gates passed - no complexity justifications required._

### Required Compliance Gates

- **Angular-First Architecture**: ✅ All components follow Angular 20 patterns and style guide
- **TypeScript Discipline**: ✅ Strict mode enabled, proper interfaces, no implicit any
- **Test-First Development**: ✅ Vitest tests written before implementation, 90% coverage
- **Performance-First Design**: ✅ OnPush change detection, Signals preferred, lazy loading
- **Static Site Optimization**: ✅ Features support static generation, SEO-optimized
- **Code Quality**: ✅ ESLint/Prettier compliance, Conventional Commits format
- **Accessibility**: ✅ WCAG 2.1 compliance, semantic HTML, ARIA attributes
- **Security**: ✅ Input sanitization, XSS protection, updated dependencies

### Complexity Justification Required For

- Deviations from OnPush change detection strategy
- RxJS usage when Signals would be more appropriate
- Server-side dependencies in production builds
- Components without proper accessibility attributes
- Code not following TypeScript strict mode requirements

**Status**: No violations identified - implementation follows constitutional requirements.

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
│   ├── components/
│   │   └── cv/
│   │       ├── cv.component.ts         # Updated to use JSON data
│   │       ├── cv.component.html        # Template (unchanged)
│   │       └── cv.component.spec.ts     # Updated tests
│   ├── models/
│   │   └── cv-data-types.ts             # Updated interfaces
│   └── assets/
│       └── igor_kulebyakin_resume.json  # Refactored JSON with camelCase

tests/
├── unit/
│   └── cv/
│       ├── cv-data-types.spec.ts        # Interface compliance tests
│       └── cv-component.spec.ts          # Component integration tests
```

**Structure Decision**: Standard Angular component structure with JSON asset in assets folder. The CV component remains in its existing location but will be modified to import data from the JSON file instead of using hardcoded data.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
