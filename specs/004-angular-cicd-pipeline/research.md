# Research & Decisions: Angular frontend CI/CD pipeline

## Decision 1: Branch triggers vs Jenkinsfile logic

- **Decision**: Keep the Jenkinsfile branch-agnostic and configure all branch/event triggers in Jenkins job settings.
- **Rationale**: Matches existing Jenkins practices; simplifies the pipeline definition; avoids hard-coding branch names and makes it easier to reuse the same Jenkinsfile across different jobs.
- **Alternatives considered**:
    - Encode branch conditions directly inside the Jenkinsfile.
    - Use a dedicated multibranch pipeline job with branch discovery logic.

## Decision 2: Coverage scope for 90% threshold

- **Decision**: Apply the 90% coverage threshold to all non-excluded files, using the coverage exclude configuration from `vite.config.ts` to define out-of-scope files.
- **Rationale**: Aligns with the requirement that the pipeline must fail when any in-scope tested file falls below 90% coverage, while respecting intentional exclusions (environments, routes, operations, etc.).
- **Alternatives considered**:
    - Enforce 90% coverage only for newly added or changed files.
    - Use a lower global threshold and rely on manual review for weakly covered areas.

## Decision 3: CI runner image build strategy

- **Decision**: Use `cicd/Dockerfile.production` to build an ephemeral CI runner image inside the Jenkins Kubernetes agent pod (via the `docker` container). The pipeline uses that image to run lint/test/build/version bump stages and does not publish it.
- **Rationale**: Keeps the pipeline self-contained without introducing an additional published image; avoids maintaining a separate prebuilt agent image lifecycle.
- **Alternatives considered**:
    - Maintain a separate prebuilt agent image and update the Kubernetes agent pod to use it.
    - Use the existing `igk19/node-git-chromium:1.0.10` image without aligning it to the Node 22 toolchain.

## Decision 4: Application image build mechanism

- **Decision**: Continue to build and push the Angular application Docker image via a dedicated image-builder container (e.g., `kaniko`) within the Jenkins Kubernetes pod, mirroring the current behaviour in `cicd/Jenkinsfile`, but updated for the Node-based agent and Angular frontend.
- **Rationale**: Reuses a proven pattern for building and pushing images from within Kubernetes; keeps Docker credentials isolated inside the image-builder container; avoids running Docker-in-Docker on the agent.
- **Alternatives considered**:
    - Build the Angular image directly on the Jenkins master/agent host (no Kubernetes pod).
    - Rely on an external registry build service instead of `kaniko`.

## CI Runner Image Requirements (T004)

- Base: Node 22 (alpine) with git, Chromium, pnpm installed for Angular lint/test/build.
- Built inside the pipeline as needed from `cicd/Dockerfile.production`.
- Tooling parity with `cicd/Dockerfile.node` retained; no deviations required.
