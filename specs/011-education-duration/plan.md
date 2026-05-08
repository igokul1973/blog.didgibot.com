# Implementation Plan: Education Duration Display

**Branch**: `011-education-duration` | **Date**: 2026-05-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/011-education-duration/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Display education duration (start year, end year, and calculated duration text) on the CV page in all supported languages, positioned between institution name and field of study. Duration is CALCULATED at runtime from startYear and endYear (not stored in JSON). Implementation reuses the existing formatDateRange pattern from the Experience section, adapting it for year-based duration instead of month-based dates. This ensures consistency with the existing proven pattern and UI/UX.

## Technical Context

**Language/Version**: TypeScript 5.9.3 with Angular 20.3.15
**Primary Dependencies**: Angular Material 20.2.14, Apollo Client 4.0.9 (GraphQL), Vitest 4.1.0
**Storage**: Static JSON content files (resume data)
**Testing**: Vitest with Angular Testing Utilities (@analogjs/vitest-angular)
**Target Platform**: Static web hosting
**Project Type**: Single-page web application (CV/resume site)
**Performance Goals**: 90+ Lighthouse performance score
**Constraints**: Static site generation, SEO optimization, WCAG 2.1 compliance
**Scale/Scope**: Small scale (≤100 education entries), publicly accessible CV
**Multilingual Support**: Existing infrastructure with English and Russian translations

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Required Compliance Gates

- **Angular-First Architecture**: ✅ PASS - Feature uses Angular 20 patterns, will follow style guide
- **TypeScript Discipline**: ✅ PASS - Strict mode enabled, will use proper interfaces with I prefix
- **Test-First Development**: ✅ PASS - Vitest tests required before implementation, 90% coverage goal
- **Performance-First Design**: ✅ PASS - OnPush change detection required, Signals preferred
- **Static Site Optimization**: ✅ PASS - Feature supports static generation, SEO-optimized
- **Code Quality**: ✅ PASS - ESLint/Prettier compliance, Conventional Commits format required
- **Accessibility**: ✅ PASS - WCAG 2.1 compliance required, semantic HTML, ARIA attributes
- **Security**: ✅ PASS - Angular XSS protection will be used, no user input sanitization needed (display only)

### Post-Design Re-evaluation (Phase 1 Complete)

All gates remain **PASS**. Design decisions:

- Reuses existing formatDateRange pattern from experience section
- No duration field added to IEducation interface (calculated at runtime from startYear/endYear)
- Uses existing IMultilingualText infrastructure
- No new dependencies or complexity introduced
- Tests will be written before implementation (Test-First Development)

### Complexity Justification Required For

- Deviations from OnPush change detection strategy
- RxJS usage when Signals would be more appropriate
- Server-side dependencies in production builds
- Components without proper accessibility attributes
- Code not following TypeScript strict mode requirements

## Project Structure

### Documentation (this feature)

```text
specs/011-education-duration/
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
│   │   ├── cv/          # CV component (main feature area)
│   │   │   ├── cv.component.ts
│   │   │   ├── cv.component.html
│   │   │   ├── cv.component.scss
│   │   │   ├── cv.component.spec.ts
│   │   │   ├── types.ts # IEducation interface
│   │   │   └── resume-data.token.ts
│   │   └── ...          # Other components
│   ├── app.config.ts    # Application configuration
│   └── app.routes.ts    # Routing configuration
```

**Structure Decision**: The feature will modify the existing CV component located at `src/app/components/cv/`. The IEducation interface will be updated in `types.ts` within the cv component directory. Tests will be colocated with the component as per Angular conventions.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
