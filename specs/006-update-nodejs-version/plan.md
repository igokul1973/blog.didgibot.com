# Implementation Plan: Update Node.js to v24.11.1

**Branch**: `006-update-nodejs-version` | **Date**: 2025-12-19 | **Spec**: [link to spec.md](/workspaces/blog.didgibot.com/specs/006-update-nodejs-version/spec.md)
**Input**: Feature specification from `/specs/006-update-nodejs-version/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Update Node.js version to v24.11.1 across Dockerfiles, CI pipeline, and package.json to ensure consistent runtime environment. Technical approach: Update Docker base images to node:24.11.1, modify Jenkinsfile to use Node 24.11.1, add engines field to package.json specifying node: "24.11.1".

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: Node.js v24.11.1 (target), current version NEEDS CLARIFICATION  
**Primary Dependencies**: Angular 20, existing project dependencies  
**Storage**: Not applicable (infrastructure update)  
**Testing**: Vitest, ensure compatibility with Node.js v24.11.1  
**Target Platform**: Docker containers for deployment, Jenkins CI pipeline  
**Project Type**: Angular web application with static site generation  
**Performance Goals**: Maintain <200ms page load, 90+ Lighthouse performance  
**Constraints**: Node.js v24.11.1 must be available in Docker Hub (NEEDS CLARIFICATION), supported by Jenkins CI (NEEDS CLARIFICATION), compatible with Angular 20 (NEEDS CLARIFICATION)  
**Scale/Scope**: Update 3 files (Dockerfile.base, Dockerfile.production, Jenkinsfile), add engines to package.json

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

<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── app/
│   ├── components/      # Dumb components (presentational)
│   ├── containers/      # Smart components (container components)
│   ├── services/        # Services and API clients
│   ├── models/          # TypeScript interfaces/types
│   ├── shared/          # Shared modules, pipes, directives
│   ├── app.module.ts    # Root module
│   └── app-routing.module.ts # Routing configuration

tests/
├── unit/                # Vitest unit tests
├── integration/         # Integration tests
└── contract/            # Contract tests
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
