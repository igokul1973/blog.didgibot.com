# CI/CD Contracts: Angular frontend pipeline

This feature does **not** introduce new external HTTP APIs or GraphQL schemas. Instead, it defines operational contracts between Jenkins, Docker, Kubernetes, and the Angular repository.

## Jenkins job configuration

- Jenkins jobs must be configured to:
    - Use the repository's `cicd/Jenkinsfile` as the pipeline definition.
    - Run using the Kubernetes agent pod defined in `cicd/docker-agent-pod.yaml`.
    - Configure which branches or refs trigger the pipeline (the Jenkinsfile remains branch-agnostic).

## Kubernetes agent pod contract

- The Kubernetes agent pod must provide:
    - A `docker` container (Docker-in-Docker) to build and run the ephemeral CI runner image from `cicd/Dockerfile.production`.
    - A `kaniko` container used to build and push the Angular application Docker image.

## Angular application image contract

- The pipeline builds and pushes the Angular application Docker image using a containerized image builder (e.g., `kaniko`).
- The image name and tag format must be consistent with the current production expectations (e.g., repository name and tag based on build number or semantic version), as defined in `cicd/Jenkinsfile`.
- The image must contain the built Angular app from the `dist/` output.

## Coverage and quality contract

- The Vitest/Vite configuration (`vite.config.ts`) defines which files are excluded from coverage.
- For all non-excluded files:
    - Per-file coverage MUST be ≥ 90%.
    - The pipeline MUST fail if any such file falls below the threshold.
- Coverage reports (HTML or equivalent) must be published as artifacts visible in Jenkins.

## Environment variables and secrets (high-level)

- Jenkins jobs and the Kubernetes agent pod must provide the environment needed to:
    - Authenticate to the Docker registry used for pushing the Angular application image.
    - Access any required SSH/HTTP credentials for interacting with the Git repository (as already done in the current `cicd/Jenkinsfile`).
- Exact credential IDs and secret names are managed in Jenkins and Kubernetes, not hard-coded in this spec.
