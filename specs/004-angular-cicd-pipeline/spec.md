# Feature Specification: Angular frontend CI/CD pipeline

**Feature Branch**: `[004-angular-cicd-pipeline]`  
**Created**: 2025-12-12  
**Status**: Draft  
**Input**: User description: "Define Jenkins/Docker-based CI/CD for the Angular frontend, mirroring the existing Python backend pipeline as described in .tasks/cicd.txt"

## Clarifications

### Session 2025-12-12

- Q: How should branch triggers be handled between the Jenkinsfile and Jenkins configuration? → A: The Jenkinsfile MUST remain branch-agnostic; all branch and event triggers are configured in Jenkins job settings, not inside the Jenkinsfile.

- Q: For the 90% coverage threshold, which files are considered in scope? → A: All non-excluded files defined by the project's coverage configuration (for example, Vite test coverage `exclude` patterns) must meet ≥ 90% coverage.

- Q: How should the CI runner image be built? → A: Use `cicd/Dockerfile.production` to build an ephemeral CI runner image inside the Jenkins Kubernetes agent pod (via the `docker` container). This image is used to run lint/test/build/version bump stages and is not intended to be published to a registry.

_Note_: The project constitution describes coverage below 90% as being reported by CI as warnings. For this feature, the Angular frontend pipeline intentionally treats coverage below 90% for any non-excluded file as a hard failure condition while still surfacing coverage information in Jenkins. In a future task, the coverage below 90% will be reported as failure both in CI and in pre-deployment checks.

## User Scenarios & Testing _(mandatory)_

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Jenkins runs CI/CD for Angular frontend on configured branches (Priority: P1)

When a developer pushes or merges changes to a branch that Jenkins is configured to build for the Angular frontend, a Jenkins CI/CD pipeline runs automatically to validate the change (lint, tests with coverage, build, image build/push) and reports a clear pass/fail status.

**Why this priority**: This flow protects the branches used for integration and deployment and ensures the deployed frontend remains stable, with fast feedback whenever code changes are integrated.

**Independent Test**: Can be fully tested by pushing a known-good and a known-bad change to branches that Jenkins is configured to build and verifying that Jenkins runs the pipeline, exposes coverage and other artifacts, and marks runs as success/failure correctly.

**Acceptance Scenarios**:

1. **Given** a successful buildable change on a branch that Jenkins is configured to build, **When** Jenkins runs the CI/CD pipeline, **Then** all stages complete successfully and the run is marked as "successful" with coverage reports available.
2. **Given** a change on such a branch that causes tests or coverage checks to fail, **When** Jenkins runs the CI/CD pipeline, **Then** the run is marked as "failed" with clear indication of the failing stage (e.g., testing/coverage) and links to relevant logs and reports.

---

### User Story 2 - Test pipeline changes on a non-production configuration (Priority: P2)

When a developer is working on the new Angular CI/CD configuration, they can push changes to a branch that Jenkins is configured to use for testing the new pipeline and have Jenkins run the same stages as the eventual production pipeline, without affecting the currently active production pipeline definition.

**Why this priority**: This enables safe iteration on the new pipeline and Docker image while keeping the current production pipeline running until the new one is validated.

**Independent Test**: Can be fully tested by configuring Jenkins to trigger a test pipeline job for a designated non-production branch, pushing CI-related changes, and confirming that the test pipeline runs the expected stages and uses the new Docker image configuration without impacting the currently active production pipeline.

**Acceptance Scenarios**:

1. **Given** a non-production branch is configured as a Jenkins pipeline target, **When** a developer pushes a CI configuration change to that branch, **Then** Jenkins runs the pipeline using the new configuration and containers, and the run status is visible in Jenkins.

---

### User Story 3 - Safely deprecate the old pipeline and promote the new one (Priority: P3)

When the new Angular frontend CI/CD pipeline is validated, the maintainer can promote it to be the canonical Jenkins pipeline by renaming `cicd/Jenkinsfile_test` to `cicd/Jenkinsfile` and renaming the legacy `cicd/Jenkinsfile` to `cicd/Jenkinsfile_deprecated`, with clear comments indicating its deprecated status.

**Why this priority**: This ensures there is a single, clearly defined pipeline for the Angular frontend while still preserving the old configuration for reference and rollback if needed.

**Independent Test**: Can be fully tested by completing validation on the feature branch, renaming the Jenkinsfiles as specified, and verifying that new runs use the new pipeline while the deprecated pipeline is no longer used for normal builds.

**Acceptance Scenarios**:

1. **Given** the new CI/CD pipeline has been validated, **When** the Jenkinsfiles are renamed according to the deprecation plan, **Then** future Jenkins runs for the Angular frontend use the new pipeline definition.
2. **Given** the old `cicd/Jenkinsfile` is now renamed to `cicd/Jenkinsfile_deprecated`, **When** a maintainer inspects the repository, **Then** they can clearly see from the filename and in-file comments that this pipeline is deprecated and retained only for reference.

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- What happens when tests pass but coverage for at least one non-excluded file is below the 90% threshold? (Expected: pipeline fails with a clear indication of which files are below threshold.)
- How does the system handle changes to files that are listed in the coverage exclusion configuration (for example, patterns in `vite.config.ts` `test.coverage.exclude`)? (Expected: these files do not affect coverage-based pipeline failure.)
- What happens when the Docker image build or push for the Angular application Docker image (built via the `kaniko` container in the Jenkins Kubernetes pod) fails while all tests and linting pass? (Expected: the pipeline fails with a clear indication that the image build/push stage failed and the image is not treated as deployable.)
- How does the system behave if the coverage report artifact is not generated (for example, due to a misconfigured test command), even though tests themselves have run? (Expected: pipeline is treated as failed and the issue is clearly surfaced.)

## Requirements _(mandatory)_

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
  CONSTITUTION COMPLIANCE: All requirements must support static site generation,
  accessibility (WCAG 2.1), and Angular 20 best practices.
-->

### Functional Requirements

- **FR-001**: System MUST provide an automated Jenkins CI/CD pipeline dedicated to the Angular frontend repository.
- **FR-002**: The CI/CD pipeline MUST run whenever the corresponding Jenkins job for the Angular frontend repository is triggered, with all branch and event triggers configured at the Jenkins job level (not inside the Jenkinsfile).
- **FR-003**: The CI/CD pipeline MUST execute logical stages equivalent to the existing Python backend pipeline, adapted for the Angular frontend (for example: checkout, dependency installation, linting, testing with coverage, build, image build/push, and any necessary post-steps).
- **FR-004**: All build, lint, test, and build-related commands executed in the CI container MUST be invoked via scripts defined in the project's `package.json` `scripts` section, rather than ad-hoc shell command sequences.
- **FR-005**: The pipeline MUST include a dedicated `testing` stage that runs the project's automated test suite with coverage measurement. Where supported by Jenkins and the pipeline design, this `testing` stage SHOULD run in parallel with the linting stage; otherwise it MUST run in its own clearly defined stage.
- **FR-006**: The testing stage MUST generate a visual coverage artifact (for example, an HTML report) that Jenkins can expose and that can be inspected from the Jenkins UI for each pipeline run.
- **FR-007**: The pipeline MUST enforce a minimum of 90% coverage for every tested file that is not excluded by the project's coverage configuration (currently `vite.config.ts` `test.coverage.exclude`), failing the pipeline if any such file is below this threshold.
- **FR-008**: After the new Angular frontend CI/CD pipeline is validated, the existing Jenkins pipeline MUST be deprecated by renaming the current `cicd/Jenkinsfile` to `cicd/Jenkinsfile_deprecated` and promoting `cicd/Jenkinsfile_test` to `cicd/Jenkinsfile`, so there is a single canonical pipeline definition.
- **FR-009**: The CI/CD pipeline MUST build and publish the Angular application Docker image used for deployment to the Kubernetes cluster, using a containerized image builder (for example, the `kaniko` container currently defined alongside the Jenkins agent) in a way that is functionally equivalent to the current behaviour implemented in `cicd/Jenkinsfile` (building and pushing the application image to the production cluster's Docker repository).
- **FR-010**: A new `cicd/Dockerfile.production` MUST be created for the CI runner image used by the pipeline, using Node.js (re-using the Node version and core tooling assumptions from `cicd/Dockerfile.node`, such as git, Chromium, and `pnpm`) instead of the current Python-based example.
- **FR-011**: The current pod manifest `cicd/node-git-chromium-pod.yaml` MUST be renamed to `cicd/docker-agent-pod.yaml` and MUST include a `docker` (Docker-in-Docker) container used to build/run the CI runner image from `cicd/Dockerfile.production`, alongside the existing `kaniko` container used for application image build/push.

### Key Entities _(include if feature involves data)_

- **CI/CD Pipeline Run**: Represents a single Jenkins execution of the Angular frontend pipeline job, including status (success/failure), stage results, and associated artifacts (logs, coverage reports, build artifacts).
- **Coverage Report Artifact**: Visual representation of test coverage (for example, HTML report) generated by the testing stage, including per-file coverage metrics and any files below the 90% threshold.
- **CI Runner Docker Image (ephemeral)**: Docker image built from `cicd/Dockerfile.production` inside the Jenkins Kubernetes agent pod and used to run CI stages; this image is not published to a registry.
- **Angular Application Docker Image**: Docker image built by the CI/CD pipeline for the Angular frontend itself and deployed to the production Kubernetes cluster via the cluster's Docker repository.

## Success Criteria _(mandatory)_

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
  CONSTITUTION COMPLIANCE: Include metrics for accessibility, performance, and code quality.
-->

### Measurable Outcomes

- **SC-001**: 100% of events configured to trigger the Angular frontend CI/CD Jenkins job result in a corresponding pipeline run in the configured build system that reaches a terminal status (success or failure) without manual intervention.
- **SC-002**: For at least 95% of successful CI/CD runs of the full Angular frontend pipeline (including tests, coverage, build, and image build/push), the pipeline completes within 20 minutes under normal load.
- **SC-003**: For 100% of CI/CD runs on branches where tests are enabled, a coverage report artifact is generated and accessible from the build system's UI, and the pipeline enforces the 90% coverage threshold as defined in the requirements (respecting coverage exclusions).
- **SC-004**: After promotion of the new pipeline, 100% of routine Angular frontend CI/CD activity uses the new pipeline definition, and the deprecated pipeline definition is no longer used for normal builds (only retained for reference/rollback).

### Constitution Compliance Metrics

- **CC-001**: Lighthouse performance score ≥ 90 for all pages
- **CC-002**: WCAG 2.1 accessibility compliance with zero high-severity violations
- **CC-003**: Vitest test coverage ≥ 90% for all new code
- **CC-004**: ESLint/Prettier compliance with zero errors before commits
- **CC-005**: Static site generation successful with all content properly indexed
- **CC-006**: Bundle size optimization meeting performance budgets
- **CC-007**: Security scan passes with zero high-severity vulnerabilities
