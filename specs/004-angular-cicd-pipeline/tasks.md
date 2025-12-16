# Tasks: Angular frontend CI/CD pipeline

**Input**: Design documents from `specs/004-angular-cicd-pipeline/`

**Organization**: Tasks are grouped by phase and user story so that each story can be implemented and tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Task can run in parallel (different files, no dependencies).
- **[Story]**: User story label (US1, US2, US3) for story-specific phases.
- All tasks include the primary file or location they affect.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare local and CI/CD environment for implementing the new Angular frontend pipeline.

- [x] T001 Review existing CI/CD assets to understand current behaviour in `cicd/Jenkinsfile`, `cicd/Jenkinsfile_test`, `cicd/Dockerfile`, `cicd/Dockerfile.node`, `cicd/Dockerfile.production`, and `cicd/node-git-chromium-pod.yaml`.
- [x] T002 Confirm available `pnpm` scripts for linting, testing, coverage, and build in `package.json` and update the spec/plan if any script names differ from expectations.
- [x] T003 [P] Verify current coverage exclusions for the Angular frontend in `vite.config.ts` `test.coverage.exclude` to ensure they match the spec assumptions.

**Checkpoint**: You understand the current CI setup, scripts, and coverage configuration.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the CI runner Dockerfile and Kubernetes agent pod before changing the pipeline.

- [x] T004 Design the Node-based Jenkins agent image requirements using `cicd/Dockerfile.node` as reference (Node 22, git, Chromium, `pnpm`) and record any deviations in `specs/004-angular-cicd-pipeline/research.md`.
- [x] T005 Implement the new Node-based Jenkins agent Dockerfile in `cicd/Dockerfile.production`, replacing the current Python example with a Node 22 base and required tooling.
- [x] T006 [P] Ensure `cicd/Dockerfile.production` can be built and used as an ephemeral CI runner image by the pipeline (for running lint/test/build/version bump stages) without requiring that image to be published.
- [x] T007 [P] Rename and update the Kubernetes agent pod manifest in `cicd/node-git-chromium-pod.yaml` to `cicd/docker-agent-pod.yaml` so the `node-git-chromium` container is gone as no longer needed. Preserve the existing `kaniko` container configuration and add a container named `docker` based on `igk19/docker:dind1`.

**Checkpoint**: Jenkins agent pod can execute Docker builds (Docker-in-Docker) and run the Node 22 + `pnpm` CI stages via `cicd/Dockerfile.production`.

---

## Phase 3: User Story 1 – Jenkins runs CI/CD for Angular frontend on configured branches (Priority: P1) 🎯 MVP

**Goal**: A Jenkins pipeline definition that, when triggered, runs linting, tests with 90% per-file coverage enforcement, builds the Angular app, and builds/pushes the app Docker image via `kaniko`.

**Independent Test**: Trigger the pipeline from Jenkins on a configured branch and confirm that success/failure and artifacts behave as described in User Story 1.

### Implementation for User Story 1

- [x] T008 [US1] Create a new pipeline definition `cicd/Jenkinsfile_test` that uses the Kubernetes agent pod from `cicd/docker-agent-pod.yaml` (docker + `kaniko`) and defines a clear stage structure (e.g., Prepare, Lint, Test, Build, Image Build/Push).
- [x] T009 [P] [US1] Wire all build, lint, and test steps in `cicd/Jenkinsfile_test` to use `pnpm` and scripts from `package.json`.
- [x] T010 [P] [US1] Add a dedicated `testing` stage in `cicd/Jenkinsfile_test` that runs `pnpm test:coverage` for the Angular frontend and ensures coverage output is written to a known directory (e.g., `coverage/`).
- [x] T011 [US1] Configure `cicd/Jenkinsfile_test` to publish the coverage report as a visible Jenkins artifact (e.g., via HTML or coverage publisher plugin) so it can be opened from the Jenkins UI.
- [x] T012 [US1] Implement coverage enforcement logic in `cicd/Jenkinsfile_test` (or a called script) so that the pipeline fails if any non-excluded file is below 90% test coverage, respecting `vite.config.ts` exclusions.
- [x] T013 [P] [US1] Add a build stage in `cicd/Jenkinsfile_test` that runs the Angular build via the appropriate `pnpm` script from `package.json` and produces the final `dist/` output required by `cicd/Dockerfile`.
- [x] T014 [US1] Implement an image build/push stage in `cicd/Jenkinsfile_test` that uses the `kaniko` container from `cicd/docker-agent-pod.yaml` to build and push the Angular application Docker image, mirroring the behaviour in the legacy pipeline (`cicd/Jenkinsfile_deprecated`).
- [x] T015 [US1] Add clear stage-level error handling and logging in `cicd/Jenkinsfile_test` so that failures in linting, testing/coverage, build, or image push are visible and traceable from Jenkins.

**Checkpoint**: `cicd/Jenkinsfile_test` can be used by a Jenkins job to run the full CI/CD flow for the Angular frontend on configured branches.

---

## Phase 4: User Story 2 – Test pipeline changes on a non-production configuration (Priority: P2)

**Goal**: Safely test the new pipeline on a dedicated branch configuration without disrupting the current production pipeline.

**Independent Test**: Use the existing Jenkins job to run the new pipeline on the `004-angular-cicd-pipeline` branch and verify both success and intentional failure scenarios.

### Implementation for User Story 2

- [x] T016 [US2] Update or create a Jenkins job configuration (via Jenkins UI) to use `cicd/Jenkinsfile_test` as its pipeline definition and to run the job inside the Kubernetes agent pod defined in `cicd/docker-agent-pod.yaml`.
- [x] T017 [US2] Configure that Jenkins job so that, for the testing phase, it is triggered on pushes/merges to both the `main` branch and the `004-angular-cicd-pipeline` branch (Jenkins job configuration, not Jenkinsfile logic).
- [x] T018 [P] [US2] Push a safe change to the `004-angular-cicd-pipeline` branch and verify in Jenkins that all stages in `cicd/Jenkinsfile_test` run successfully, coverage artifacts are published, and the Angular application image is built and pushed.
- [x] T019 [P] [US2] Perform negative coverage validations on the `004-angular-cicd-pipeline` branch:
    - First, push a change that intentionally reduces coverage below 90% for a non-excluded file and verify that the testing/coverage stage and overall pipeline run fail as expected.
    - Then, temporarily misconfigure or remove the coverage output (for example, change the coverage output path or delete the report directory) and verify that, even though tests run, the pipeline fails and clearly reports the missing coverage artifact condition.

**Checkpoint**: The new pipeline has been fully validated on a non-production configuration (including positive and negative coverage scenarios).

---

## Phase 5: User Story 3 – Safely deprecate the old pipeline and promote the new one (Priority: P3)

**Goal**: Promote the new Angular frontend CI/CD pipeline to be the canonical Jenkins pipeline while preserving the old configuration for reference and rollback.

**Independent Test**: Only the new Jenkinsfile is used for routine Angular frontend builds; the old Jenkinsfile is clearly marked as deprecated and not referenced by Jenkins jobs.

### Implementation for User Story 3

- [x] T020 [US3] Rename the existing primary Jenkinsfile from `cicd/Jenkinsfile` to `cicd/Jenkinsfile_deprecated` and add a header comment explaining that it is deprecated and retained only for historical reference and rollback.
- [x] T021 [US3] Rename `cicd/Jenkinsfile_test` to `cicd/Jenkinsfile` and adjust any internal comments or references within that file to reflect its new canonical role.
- [x] T022 [US3] Update the existing Jenkins job configuration (via Jenkins UI) to point to the new `cicd/Jenkinsfile` as the pipeline definition and remove any special triggers for the `004-angular-cicd-pipeline` branch so that only the desired long-term branches (e.g., `main`) trigger the job.
- [x] T023 [US3] Update `specs/004-angular-cicd-pipeline/quickstart.md` and any relevant CI/CD documentation in `README.md` or `development_guidelines.md` to describe the new canonical Jenkinsfile and deprecation status of the old one.

**Checkpoint**: The new Jenkinsfile is the only file used for the Angular frontend CI/CD pipeline, and documentation clearly reflects the migration.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final checks and improvements across the CI/CD pipeline and documentation.

- [x] T024 [P] Verify that all CI/CD-related files in `cicd/` (Jenkinsfiles, Dockerfiles, pod manifests) follow repository linting/formatting conventions and do not introduce new lint errors.
- [x] T025 [P] Capture a "first successful run" record (screenshots or notes) for the new pipeline and link it from `specs/004-angular-cicd-pipeline/quickstart.md` or `README.md` as a validation reference.
- [x] T026 [P] Review `specs/004-angular-cicd-pipeline/spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/README.md`, and `quickstart.md` for consistency with the final implementation and update any outdated details.
- [ ] T027 Run a final end-to-end test by triggering the Jenkins job on the long-term target branch (e.g., `main`) to confirm that the CI runner build, coverage enforcement, Angular build, and Docker image push all behave as expected.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 – Setup**: No dependencies – can start immediately.
- **Phase 2 – Foundational**: Depends on Phase 1 – blocks all user story phases.
- **Phase 3 – User Story 1 (P1)**: Depends on Foundational – must be implemented first as the CI/CD MVP.
- **Phase 4 – User Story 2 (P2)**: Depends on User Story 1 – requires a working `cicd/Jenkinsfile_test`.
- **Phase 5 – User Story 3 (P3)**: Depends on User Story 2 – promotion only after full validation on the test configuration.
- **Phase 6 – Polish**: Depends on all user story phases being complete.

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories; depends only on Setup and Foundational phases.
- **User Story 2 (P2)**: Depends on User Story 1 (needs working Jenkinsfile_test and Kubernetes pod + CI runner setup).
- **User Story 3 (P3)**: Depends on User Story 2 (pipeline must be validated before promotion).

### Parallel Opportunities

- Setup tasks T002 and T003 can run in parallel after T001 is complete.
- Foundational tasks T006 and T007 can run in parallel once T005 is ready.
- In User Story 1, tasks T009, T010, T011, T013 can often be implemented in parallel by different contributors, coordinating on the final Jenkinsfile layout.
- In User Story 2, validation tasks T018 and T019 can be executed independently after the Jenkins job is configured.
- Polish tasks T024–T026 are largely parallelizable as they touch different files and documentation.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T003).
2. Complete Phase 2: Foundational (T004–T007).
3. Complete Phase 3: User Story 1 (T008–T015).
4. **STOP and VALIDATE**: Use the Jenkins job to run the pipeline on a configured branch and confirm all stages, coverage enforcement, and image push behaviour.

### Incremental Delivery

1. After MVP validation, implement Phase 4 (User Story 2) to validate the pipeline on the `004-angular-cicd-pipeline` branch without disrupting existing flows.
2. Then implement Phase 5 (User Story 3) to promote the new Jenkinsfile and deprecate the old one.
3. Finally, complete Phase 6 (Polish) to tighten quality, documentation, and end-to-end checks.

### Parallel Team Strategy

- After Foundational work is complete:
    - Developer A can focus on Jenkinsfile stages and coverage enforcement (User Story 1 tasks T008–T015).
    - Developer B can focus on Jenkins job configuration and validation scenarios (User Story 2 tasks T016–T019).
    - Developer C can prepare and execute the migration and documentation updates (User Story 3 tasks T020–T023, plus Polish tasks).

Each task is specific enough that an LLM or engineer can work on it with the existing design documents and repository structure.
