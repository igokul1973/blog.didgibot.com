# Feature Specification: Update Node.js to v24.11.1

**Feature Branch**: `006-update-nodejs-version`  
**Created**: 2025-12-19  
**Status**: Draft  
**Input**: User description: "As a developer I want node.js in this codebase, dockerfiles, ci pipeline, and everywhere to be v24.11.1. If any changes in Angular or package.json files need to be done - do them. Make sure everything works."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Update Docker Images to Node.js v24.11.1 (Priority: P1)

As a developer, I want the Dockerfiles to specify Node.js v24.11.1 so that the application runs on the correct Node version in containers.

**Why this priority**: Essential for consistency in deployment environments and ensuring the application uses the specified version.

**Independent Test**: Can be tested by building the Docker image and verifying the Node version inside the container using `node --version`.

**Acceptance Scenarios**:

1. **Given** Dockerfile.base exists, **When** I build the image, **Then** the base image uses `node:24.11.1`
2. **Given** Dockerfile.production exists, **When** I build the image, **Then** it uses `node:24.11.1`

---

### User Story 2 - Update CI Pipeline Node Version (Priority: P1)

As a developer, I want the CI pipeline to use Node.js v24.11.1 for building and testing.

**Why this priority**: Ensures builds match production environment and the specified version is used throughout the pipeline.

**Independent Test**: CI builds pass with Node 24.11.1 and no version mismatch errors.

**Acceptance Scenarios**:

1. **Given** Jenkinsfile exists, **When** the pipeline runs, **Then** it uses Node 24.11.1 for all Node-related steps

---

### User Story 3 - Update Package.json Engines (Priority: P2)

As a developer, I want package.json to specify Node.js v24.11.1 in the engines field.

**Why this priority**: Ensures compatibility declarations and informs tools of the required Node version.

**Independent Test**: package.json contains `"node": "24.11.1"` in engines, and npm warns if wrong version is used.

**Acceptance Scenarios**:

1. **Given** package.json exists, **When** I check the engines field, **Then** it specifies `"node": "24.11.1"`

---

### Edge Cases

- What happens if Docker Hub does not have the node:24.11.1 image?
- How does the system handle if the current Angular version is incompatible with Node.js v24.11.1?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Dockerfiles MUST specify Node.js v24.11.1 as the base image
- **FR-002**: CI pipeline MUST use Node.js v24.11.1
- **FR-003**: package.json MUST specify "node": "24.11.1" in engines
- **FR-004**: Application MUST build and run successfully with Node.js v24.11.1

### Technical Requirements _(Constitution Compliance)_

- **TR-001**: All components MUST use OnPush change detection strategy by default
- **TR-002**: All TypeScript code MUST follow strict mode with proper interfaces
- **TR-003**: All UI components MUST meet WCAG 2.1 accessibility standards
- **TR-004**: All features MUST support static site generation
- **TR-005**: All new code MUST have Vitest tests with 90% minimum coverage
- **TR-006**: Signals MUST be preferred over RxJS unless RxJS is more appropriate
- **TR-007**: All user inputs MUST be sanitized using Angular's XSS protection

## Success Criteria _(mandatory)_

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
  CONSTITUTION COMPLIANCE: Include metrics for accessibility, performance, and code quality.
-->

### Measurable Outcomes

- **SC-001**: Docker images build successfully using Node.js v24.11.1
- **SC-002**: CI pipeline executes without Node version-related errors
- **SC-003**: Application starts and functions correctly with Node.js v24.11.1
- **SC-004**: All tests pass with Node.js v24.11.1

### Constitution Compliance Metrics

- **CC-001**: Lighthouse performance score ≥ 90 for all pages
- **CC-002**: WCAG 2.1 accessibility compliance with zero high-severity violations
- **CC-003**: Vitest test coverage ≥ 90% for all new code
- **CC-004**: ESLint/Prettier compliance with zero errors before commits
- **CC-005**: Static site generation successful with all content properly indexed
- **CC-006**: Bundle size optimization meeting performance budgets
- **CC-007**: Security scan passes with zero high-severity vulnerabilities
