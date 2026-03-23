# Implementation Tasks: CV PDF Download

**Branch**: `010-cv-pdf-download` | **Date**: 2026-03-23 | **Spec**: [spec.md](./spec.md)
**Total Tasks**: 30 | **Estimated Time**: 2-3 days

## Phase 1: Setup

### Goal

Initialize project structure and install dependencies for PDF generation feature.

### Independent Test Criteria

- Project structure created according to implementation plan
- All dependencies installed without conflicts
- Build script integration working

### Tasks

- [ ] T001 Create feature directory structure per implementation plan
- [ ] T002 Install jsPDF library and TypeScript types
- [ ] T003 Create output directory for PDF assets
- [ ] T004 Add build scripts to package.json for PDF generation

---

## Phase 2: Foundational

### Goal

Implement build-time PDF generation infrastructure and core type definitions.

### Independent Test Criteria

- PDF generation script can create basic PDF files
- Type definitions compile without errors
- Build process integrates PDF generation

### Tasks

- [ ] T005 Create PDF download component type definitions
- [ ] T006 Implement build-time PDF generation script
- [ ] T007 Add PDF generation to build pipeline
- [ ] T008 Create PDF asset validation utilities

---

## Phase 3: User Story 1 - Download CV PDF in Selected Language (Priority: P1)

### Goal

Enable users to download PDF version of CV in their selected language via download icon.

### Independent Test Criteria

- User can click download icon and receive PDF in current language
- Download works for both English and Russian languages
- PDF downloads within 3 seconds of clicking
- Error handling displays user-friendly messages

### Tasks

- [ ] T009 [US1] Create PDF download component template
- [ ] T010 [US1] Implement PDF download component logic
- [ ] T011 [US1] Add download button styling and accessibility
- [ ] T012 [US1] Implement language-specific asset URL construction
- [ ] T013 [US1] Add browser download functionality
- [ ] T014 [US1] Implement download state management with signals
- [ ] T015 [US1] Add error handling and user feedback
- [ ] T016 [US1] Integrate PDF download component into CV component
- [ ] T017 [US1] Add language synchronization between CV and download components
- [ ] T026 [US1] Implement PDF asset not found error handling
- [ ] T027 [US1] Add network error recovery mechanisms
- [ ] T030 [US1] Implement snackbar error handling pattern (5000ms duration, right/top positioning, 'error-snackbar' panel class)
- [ ] T031 [US1] Implement download button debouncing (500ms) to prevent rapid clicking

---

## Phase 4: User Story 2 - Professional PDF Layout and Styling (Priority: P2)

### Goal

Ensure downloaded PDFs have professional appearance with proper typography and layout.

### Independent Test Criteria

- PDF displays consistent typography throughout
- Layout remains professional when printed
- Contact information is clearly visible and accessible
- PDF file size is under 500KB
- PDF uses minimal pages while maintaining comfortable reading font size and spacing

### Tasks

- [ ] T018 [US2] Enhance PDF generation with professional typography
- [ ] T019 [US2] Implement proper PDF layout and spacing
- [ ] T020 [US2] Add contact information formatting
- [ ] T021 [US2] Optimize PDF file size and compression
- [ ] T022 [US2] Add print quality optimization (300 DPI)
- [ ] T025 [US2] Implement compact layout optimization for minimal pages while maintaining readability
- [ ] T029 [US2] Implement dynamic content fitting to prevent page overflow

---

## Phase 5: Testing & Quality Assurance

### Goal

Ensure comprehensive test coverage and code quality compliance.

### Independent Test Criteria

- Unit tests achieve 90% coverage for new code
- Integration tests verify end-to-end download flow
- All ESLint/Prettier checks pass
- WCAG 2.1 accessibility compliance verified

### Tasks

- [ ] T023 Create unit tests for PDF download component
- [ ] T024 Create integration tests for CV component with PDF download
- [ ] T028 Create accessibility tests for PDF download component WCAG 2.1 compliance

---

## Dependencies

### Story Completion Order

1. **Phase 1** (Setup) → **Phase 2** (Foundational) → **Phase 3** (US1) → **Phase 4** (US2) → **Phase 5** (Testing)

### Critical Dependencies

- T006 (PDF generation script) must complete before T009 (component template)
- T009 (component template) must complete before T010 (component logic)
- T016 (CV integration) must complete before T017 (language sync)
- T018 (PDF typography) depends on T006 (generation script)

### Parallel Execution Opportunities

**Within Phase 3 (US1)**:

- T009, T011, T012 can be developed in parallel (different files)
- T013, T014, T015 can be developed in parallel (distinct concerns)
- T026, T027, T030 can be developed in parallel (error handling scenarios)
- T031 can be developed independently (debouncing implementation)

**Within Phase 4 (US2)**:

- T018, T019, T020 can be developed in parallel (different PDF sections)
- T021, T022, T025, T029 can be developed in parallel (optimization tasks)

---

## Parallel Execution Examples

### Example 1: Component Development (Phase 3)

```bash
# Parallel development of component files
T009: Developer A works on component template
T011: Developer B works on CSS styling
T012: Developer C works on URL utilities
```

### Example 2: PDF Enhancement (Phase 4)

```bash
# Parallel enhancement of PDF generation
T018: Developer A works on typography
T019: Developer B works on layout
T020: Developer C works on contact formatting
```

---

## Implementation Strategy

### MVP Scope (User Story 1 Only)

For rapid delivery, implement only Phase 1-3:

- Basic PDF generation
- Download functionality
- Language support
- Error handling

This delivers core value with professional PDF downloads in both languages.

### Full Feature Implementation

Complete all phases for comprehensive solution:

- Professional PDF styling
- Print optimization
- Full test coverage
- Performance optimization

### Incremental Delivery

1. **Week 1**: Phases 1-2 (Setup & Foundational)
2. **Week 2**: Phase 3 (Core download functionality)
3. **Week 3**: Phases 4-5 (Polish & testing)

---

## Quality Gates

### Before Each Phase Completion

- [ ] All TypeScript compilation errors resolved
- [ ] ESLint/Prettier checks pass
- [ ] Component follows OnPush change detection
- [ ] Accessibility attributes included (WCAG 2.1)

### Before Final Release

- [ ] 90% test coverage achieved
- [ ] Performance benchmarks met (<3s download)
- [ ] PDF quality verified (300 DPI)
- [ ] Cross-browser compatibility tested
- [ ] Mobile responsiveness confirmed

---

## File Structure Reference

```
src/app/components/cv/
├── pdf-download/
│   ├── pdf-download.component.ts     # T010
│   ├── pdf-download.component.html   # T009
│   ├── pdf-download.component.scss   # T011
│   ├── types.ts                      # T005
│   └── pdf-download.component.spec.ts # T023, T028
├── cv.component.ts                   # Modified in T016
├── cv.component.html                 # Modified in T016
└── cv.component.spec.ts              # Modified in T024

scripts/
└── generate-pdf-assets.ts            # T006

assets/cv/pdfs/
├── igor-kulebyakin-cv-en.pdf         # Generated by T006
└── igor-kulebyakin-cv-ru.pdf         # Generated by T006
```

---

## Success Metrics

### Technical Metrics

- **Build Time**: PDF generation adds <10 seconds to build
- **Download Speed**: <3 seconds for all PDF downloads
- **File Size**: PDF files under 500KB each
- **Test Coverage**: 90%+ for all new code

### User Experience Metrics

- **Success Rate**: >99% successful downloads
- **Error Rate**: <0.1% download failures
- **User Satisfaction**: Professional appearance confirmed

---

## Risk Mitigation

### Technical Risks

- **PDF Generation Failures**: Mitigated by comprehensive error handling (T015)
- **Performance Issues**: Mitigated by static asset serving strategy
- **Cross-browser Compatibility**: Mitigated by standard browser download API

### Timeline Risks

- **jsPDF Learning Curve**: Mitigated by existing quickstart guide
- **Integration Complexity**: Mitigated by clear separation of build-time vs runtime concerns
