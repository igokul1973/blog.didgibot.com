# Implementation Plan: Multilingual CV Support

**Branch**: `009-multilingual-cv` | **Date**: 2026-03-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/009-multilingual-cv/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Create multilingual support for the CV component by restructuring the resume JSON data to support nested language objects (en/ru), integrating with the existing header language selector, and providing fallback mechanisms for missing translations. The feature will enable seamless language switching between English and Russian CV content without page reload while maintaining all existing functionality.

## Technical Context

**Language/Version**: TypeScript 5.9.3 with Angular 20.3.15  
**Primary Dependencies**: Angular Material, Apollo Client (GraphQL), Vitest  
**Storage**: Static JSON files in `/src/assets/` directory  
**Testing**: Vitest with Angular Testing Utilities  
**Target Platform**: Static web hosting (Vercel, Netlify, etc.)  
**Project Type**: Single-page web application with multilingual CV support  
**Performance Goals**: <200ms page load, 90+ Lighthouse performance, <1s language switching  
**Constraints**: Static site generation, SEO optimization, WCAG 2.1 compliance  
**Scale/Scope**: Blog platform with <1000 pages, <10k concurrent users

**Current Architecture**:

- CV component loads static JSON from `/src/assets/igor_kulebyakin_resume.json`
- Language switching handled by `LanguageSwitcherComponent` via URL parameters
- `ArticleService` manages current language signal (`LanguageEnum.EN | LanguageEnum.RU`)
- Header contains existing language selector that integrates with URL routing
- CV component uses OnPush change detection and follows Angular 20 patterns

**Integration Points**:

- Existing `LanguageEnum` (EN/RU) from `types/translation.ts`
- `ArticleService.selectedLanguage` signal for current language state
- URL-based language parameter handling via `UrlService`
- Header language selector component for user interaction

**Data Migration Requirements**:

- Transform monolingual JSON structure to nested multilingual format
- Maintain all existing data integrity during migration
- Preserve non-translatable fields (URLs, emails, technical terms, company names)
- Add Russian translations for all translatable text content

**Technical Details Resolved**:

- ✅ Specific JSON schema for nested multilingual structure defined in data-model.md
- ✅ Translation fallback mechanism implementation details specified in contracts/api-contracts.md
- ✅ CV component integration pattern with existing language service clarified in quickstart.md
- ✅ Validation approach for multilingual JSON structure established in data-model.md
- ✅ Performance optimization strategy for language switching defined in research.md
- ✅ Testing strategy for multilingual functionality using Playwright MCP documented in quickstart.md

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

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

### Constitution Compliance Assessment

**STATUS: ✅ PASSED** - All constitutional requirements are addressed:

1. **Angular-First Architecture**: Feature integrates with existing Angular 20 components (`LanguageSwitcherComponent`, `ArticleService`) and follows established patterns
2. **TypeScript Discipline**: Uses existing `LanguageEnum` and type-safe interfaces, maintains strict typing
3. **Test-First Development**: Plan includes Vitest tests with Playwright MCP integration for UI testing
4. **Performance-First Design**: Uses existing OnPush change detection in CV component, leverages Signals for language state
5. **Static Site Optimization**: Maintains static JSON file approach, supports static site generation
6. **Code Quality**: Follows existing project patterns and conventions
7. **Accessibility**: Integrates with existing accessible header components
8. **Security**: Uses Angular's built-in XSS protection for content rendering

**No complexity justifications required** - feature follows all constitutional principles.

## Project Structure

### Documentation (this feature)

```text
specs/009-multilingual-cv/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command) ✓ COMPLETED
├── data-model.md        # Phase 1 output (/speckit.plan command) ✓ COMPLETED
├── quickstart.md        # Phase 1 output (/speckit.plan command) ✓ COMPLETED
├── contracts/           # Phase 1 output (/speckit.plan command) ✓ COMPLETED
│   └── api-contracts.md # API contracts and interfaces
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── components/
│   │   ├── cv/
│   │   │   ├── cv.component.ts          # Updated with multilingual support
│   │   │   ├── cv.component.html        # Updated template
│   │   │   ├── cv.component.scss         # Existing styles
│   │   │   ├── types.ts                  # Updated with multilingual interfaces
│   │   │   └── cv.component.spec.ts     # Updated tests (co-located)
│   │   ├── header/
│   │   │   ├── header.component.ts      # Existing (integrates with language service)
│   │   │   ├── header.component.spec.ts # Existing tests (co-located)
│   │   │   └── language-switcher/        # Existing language selector
│   │   │       ├── language-switcher.component.ts
│   │   │       └── language-switcher.component.spec.ts # Co-located tests
│   │   └── ...
│   ├── services/
│   │   └── article/
│   │       ├── article.service.ts       # Existing (language signal integration)
│   │       └── article.service.spec.ts  # Existing tests (co-located)
│   └── assets/
│       └── igor_kulebyakin_resume.json  # Updated with multilingual structure

- Use Playwright MCP server for visual validation during development
```

**Structure Decision**: Extends existing Angular component structure with new multilingual services while preserving all current functionality. Uses established patterns for services, types, and testing.

## Complexity Tracking

> **No constitutional violations or complexity justifications required**

| Violation | Why Needed | Simpler Alternative Rejected Because          |
| --------- | ---------- | --------------------------------------------- |
| None      | N/A        | Feature follows all constitutional principles |

## Phase Completion Status

### Phase 0: Research ✅ COMPLETED

- [x] Resolved all NEEDS CLARIFICATION items
- [x] Created `research.md` with technical decisions
- [x] Defined multilingual JSON structure approach
- [x] Established translation fallback strategy
- [x] Confirmed integration patterns with existing services

### Phase 1: Design & Contracts ✅ COMPLETED

- [x] Created `data-model.md` with entity definitions
- [x] Generated API contracts in `/contracts/`
- [x] Created `quickstart.md` with implementation guide
- [x] Updated agent context for Windsurf
- [x] Re-evaluated Constitution Check post-design

### Phase 2: Implementation (Next)

- [ ] Execute `/speckit.tasks` to generate implementation tasks
- [ ] Implement multilingual JSON structure
- [ ] Create translation service
- [ ] Update CV component with signal integration
- [ ] Add comprehensive tests
- [ ] Validate with Playwright MCP server

## Final Constitution Compliance Assessment

**STATUS: ✅ PASSED - Post Design Validation**

All constitutional requirements maintained throughout Phase 1 design:

1. **✅ Angular-First Architecture**: Uses existing Angular 20 components and patterns
2. **✅ TypeScript Discipline**: Strict typing with proper interfaces, no implicit any
3. **✅ Test-First Development**: Comprehensive testing strategy with Vitest + Playwright MCP
4. **✅ Performance-First Design**: Signals with computed values, OnPush change detection
5. **✅ Static Site Optimization**: Maintains static JSON approach, supports SSG
6. **✅ Code Quality**: Follows project conventions, ESLint/Prettier compliance
7. **✅ Accessibility**: Integrates with existing accessible components
8. **✅ Security**: Uses Angular's built-in XSS protection

**Ready for Phase 2**: Proceed with `/speckit.tasks` to generate implementation tasks.
