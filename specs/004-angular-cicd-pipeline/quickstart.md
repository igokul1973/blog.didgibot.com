# Quickstart: Implementing the Angular frontend CI/CD pipeline

## 1. Prerequisites

- Active feature branch: `004-angular-cicd-pipeline`.
- Access to the Jenkins server and permission to configure jobs and Kubernetes agents.
- Access to the Docker registry under the `igk19` namespace.
- Access to the Jenkins Kubernetes agent pod with a `docker` (Docker-in-Docker) container and a `kaniko` container.

## 2. Create the Node-based Jenkins agent Dockerfile

1. Open `cicd/Dockerfile.node` and note the base image and tools (Node 22, git, Chromium, `pnpm`).
2. Create or update `cicd/Dockerfile.production` so that it:
    - Uses a Node 22 base image instead of Python.
    - Installs the same core tooling as `cicd/Dockerfile.node` (git, Chromium, `pnpm`).
    - Is suitable for running `pnpm`-based lint, test, and build commands for the Angular frontend.

## 3. CI runner image (ephemeral)

The pipeline uses `cicd/Dockerfile.production` to build an ephemeral CI runner image inside the Jenkins Kubernetes agent pod (via the `docker` container). This image is used to run lint, tests (including coverage enforcement), build, and version bump stages.

This image is not intended to be pushed/published to a registry.

## 4. Update the Kubernetes agent pod manifest

1. Edit `cicd/docker-agent-pod.yaml`.
2. Ensure the pod contains:
    - A `kaniko` container used to build and push the Angular application image.
    - A privileged `docker` container (Docker-in-Docker) used to execute the CI stages via `cicd/Dockerfile.production`.
3. Ensure the Docker config secret is mounted so both `docker` and `kaniko` can pull/push as needed.

## 5. Implement the new Jenkinsfile for the Angular frontend

1. Create or adapt `cicd/Jenkinsfile_test` so that it:
    - Uses the updated Kubernetes agent pod (`docker` + `kaniko`).
    - Runs linting, tests/coverage enforcement, and build via `cicd/Dockerfile.production` targets.
    - Publishes coverage output as a Jenkins artifact.
    - Fails the pipeline if any non-excluded file is below 90% test coverage.
    - Builds and pushes the Angular application Docker image using the `kaniko` container, mirroring the behaviour previously implemented in the legacy `cicd/Jenkinsfile`.

2. Configure the existing Jenkins job (or a dedicated test job) so that it:
    - Uses `cicd/Jenkinsfile_test` as its pipeline definition.
    - For the testing phase, is triggered on pushes/merges to both the `main` branch and the `004-angular-cicd-pipeline` branch. This configuration is done in the Jenkins job (not in the Jenkinsfile), so the Jenkinsfile itself remains branch-agnostic.

## 6. Validate the pipeline

1. Push a change that should succeed (tests and coverage passing) and confirm that:
    - All stages complete successfully.
    - Coverage artifacts are generated and visible in Jenkins.
    - The Angular application image is built and pushed.

2. Push a change that intentionally reduces coverage for a non-excluded file below 90% and confirm that:
    - The testing/coverage stage fails.
    - The overall pipeline run is marked as failed.

3. Push a follow-up change that restores coverage and confirm the pipeline becomes green again.

## 7. Promote the new pipeline and deprecate the old one

1. Once validated, rename the previous `cicd/Jenkinsfile` to `cicd/Jenkinsfile_deprecated` and add a brief comment header indicating it is retained only for reference.
2. Rename `cicd/Jenkinsfile_test` to `cicd/Jenkinsfile` so that it becomes the canonical Jenkins pipeline for the Angular frontend.
3. Update the Jenkins job configuration to point to the new Jenkinsfile and remove any mentions of the `004-angular-cicd-pipeline` branch.

At this point, the Angular frontend CI/CD pipeline should:

- Run on Jenkins using a Kubernetes agent pod with `docker` (for building the CI runner image) and `kaniko` (for building/pushing the app image).
- Enforce the 90% per-file coverage threshold for all non-excluded files.
- Build and push the Angular application image to the production Kubernetes cluster's Docker registry.
- Provide a clear deprecation path for the old pipeline configuration.
