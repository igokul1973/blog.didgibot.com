# Quickstart: Implementing the Angular frontend CI/CD pipeline

## 1. Prerequisites

- Active feature branch: `004-angular-cicd-pipeline`.
- Access to the Jenkins server and permission to configure jobs and Kubernetes agents.
- Access to the Docker registry under the `igk19` namespace.
- Local AMD64 Linux machine with Docker installed (for building the Jenkins agent image).

## 2. Create the Node-based Jenkins agent Dockerfile

1. Open `cicd/Dockerfile.node` and note the base image and tools (Node 22, git, Chromium, `pnpm`).
2. Create or update `cicd/Dockerfile.production` so that it:
    - Uses a Node 22 base image instead of Python.
    - Installs the same core tooling as `cicd/Dockerfile.node` (git, Chromium, `pnpm`).
    - Is suitable for running `pnpm`-based lint, test, and build commands for the Angular frontend.

## 3. Build and push the Jenkins agent image (manual step)

On an AMD64 Linux host with access to the repo and Docker registry:

```bash
# From the repository root
docker build --platform linux/amd64 -f cicd/Dockerfile.production -t igk19/node-22:1.0.0 .
docker push igk19/node-22:1.0.0
```

- This image is **not** built by the CI/CD pipeline; it is a one-time (or occasional) operational task.

## 4. Update the Kubernetes agent pod manifest

1. Edit `cicd/node-git-chromium-pod.yaml`.
2. Update the `node-git-chromium` container image reference from `igk19/node-git-chromium:1.0.10` to `igk19/node-22:1.0.0`.
3. Keep the existing `kaniko` container configuration for building and pushing the Angular application image.

## 5. Implement the new Jenkinsfile for the Angular frontend

1. Create or adapt `cicd/Jenkinsfile_test` so that it:
    - Uses the updated Kubernetes agent pod (`node-git-chromium` + `kaniko`).
    - Runs linting and tests via `pnpm` and scripts from `package.json`.
    - Runs `pnpm test:coverage` in a dedicated testing stage and publishes a coverage report artifact.
    - Fails the pipeline if any non-excluded file is below 90% test coverage.
    - Builds and pushes the Angular application Docker image using the `kaniko` container, mirroring the current behaviour in `cicd/Jenkinsfile`.

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

## 7. Promote the new pipeline and deprecate the old one

1. Once validated, rename the current `cicd/Jenkinsfile` to `cicd/Jenkinsfile_deprecated` and add a brief comment header indicating it is retained only for reference.
2. Rename `cicd/Jenkinsfile_test` to `cicd/Jenkinsfile` so that it becomes the canonical Jenkins pipeline for the Angular frontend.
3. Update the Jenkins job configuration to point to the new Jenkinsfile and remove any mentions of the `004-angular-cicd-pipeline` branch.

At this point, the Angular frontend CI/CD pipeline should:

- Run on Jenkins using a Node-based Kubernetes agent image.
- Enforce the 90% per-file coverage threshold for all non-excluded files.
- Build and push the Angular application image to the production Kubernetes cluster's Docker registry.
- Provide a clear deprecation path for the old pipeline configuration.
