# Implementation Plan: CV PDF Download

**Branch**: `010-cv-pdf-download` | **Date**: 2026-03-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/010-cv-pdf-download/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build-time PDF generation for CV/resume download functionality using jsPDF library. The feature will create professional 300 DPI PDFs in English and Russian, stored as static assets (/assets/cv/pdfs/) and served via download icon on CV page. Uses existing RESUME_DATA_TOKEN for runtime language synchronization between CV and PDF download components.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.9.3 with Angular 20.3.15  
**Primary Dependencies**: Angular Material, jsPDF, Vitest  
**Storage**: Static content files (pre-compiled PDFs)  
**Testing**: Vitest with Angular Testing Utilities  
**Target Platform**: Static web hosting (Vercel, Netlify, etc.)  
**Project Type**: Single-page web application  
**Performance Goals**: <3s PDF download, 90+ Lighthouse performance  
**Constraints**: Static site generation, SEO optimization, WCAG 2.1 compliance  
**Scale/Scope**: Blog platform with <1000 pages, <10k concurrent users

**Key Technical Decisions**:

- PDF Library: jsPDF (most popular, secure, free)
- Generation Strategy: Build-time pre-compilation
- Data Access: Existing RESUME_DATA_TOKEN for runtime language synchronization; direct JSON import for build-time generation
- Print Quality: 300 DPI with vector fonts and embedded fonts
- Storage: /assets/cv/pdfs/ with language-specific filenames

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Constitution Check Status: ✅ PASSED (Post-Design Verification)

All required compliance gates are satisfied by the final design:

- **Angular-First Architecture**: ✅ Standard Angular 20 component patterns, proper DI, standalone components
- **TypeScript Discipline**: ✅ Strict interfaces, proper typing, no implicit any, I-prefix conventions
- **Test-First Development**: ✅ Comprehensive Vitest unit and integration tests planned
- **Performance-First Design**: ✅ OnPush strategy, build-time pre-compilation, static assets, signals
- **Static Site Optimization**: ✅ PDFs as static assets, no runtime dependencies, SSG compatible
- **Code Quality**: ✅ Follows project patterns, proper file structure, conventional naming
- **Accessibility**: ✅ WCAG 2.1 compliant component, semantic HTML, ARIA labels
- **Security**: ✅ No user input processing, Angular XSS protection, static asset serving

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
specs/010-cv-pdf-download/
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
│   │   └── cv/                    # CV component and subfeatures
│   │       ├── cv.component.ts
│   │       ├── cv.component.html
│   │       ├── cv.component.scss
│   │       ├── types.ts           # Existing CV types
│   │       ├── resume-data.token.ts # Existing injection token
│   │       ├── pdf-download/      # PDF download subfeature component
│   │       │   ├── pdf-download.component.ts
│   │       │   ├── pdf-download.component.html
│   │       │   ├── pdf-download.component.scss
│   │       │   └── types.ts
│   │       └── cv.component.spec.ts
│   ├── services/
│   └── shared/
└── assets/
    └── cv/
        └── pdfs/                 # Pre-compiled PDF assets
            ├── igor-kulebyakin-cv-en.pdf
            └── igor-kulebyakin-cv-ru.pdf

scripts/
└── generate-pdf-assets.ts  # Build-time PDF generation script
```

**Structure Decision**: PDF download component is organized as a subfeature under the CV component folder, maintaining logical grouping of CV-related functionality. This leverages existing CV component infrastructure with RESUME_DATA_TOKEN, adds dedicated PDF download subcomponent and build-time generation script. PDFs stored as static assets for optimal performance and static site generation compatibility.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
