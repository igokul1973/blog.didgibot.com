# Quickstart: Update Node.js to v24.11.1

## Overview

This guide provides steps to update the Node.js version to v24.11.1 across the project's Dockerfiles, CI pipeline, and package.json.

## Prerequisites

- Repository access with write permissions
- Docker installed locally for testing
- Access to Jenkins for CI updates
- Node.js 24.11.1 available (confirmed via research)

## Implementation Steps

### 1. Update Docker Base Images

Modify `cicd/Dockerfile.base`:

```dockerfile
FROM node:24.11.1-alpine3.21 AS base
```

Keep the rest of the file unchanged.

### 2. Update Production Dockerfile

Modify `cicd/Dockerfile.production` similarly:

```dockerfile
FROM node:24.11.1-alpine3.21 AS base
```

Adjust as needed based on the current content.

### 3. Update CI Pipeline

Modify `cicd/Jenkinsfile` to use Node.js 24.11.1:

- Update the Node version in the pipeline configuration
- Ensure the pipeline installs or uses Node 24.11.1

### 4. Update Package.json Engines

Modify `package.json`:

```json
"engines": {
  "node": "24.11.1"
}
```

### 5. Test Locally

- Build Docker images: `docker build -f cicd/Dockerfile.base .`
- Run the application: `docker run -p 4200:4200 <image>`
- Execute tests: `pnpm test`
- Build the project: `pnpm build`

### 6. Commit and Deploy

- Commit changes with conventional commit message
- Push to trigger CI pipeline
- Monitor CI for successful builds
- Deploy if all checks pass

## Troubleshooting

- If Docker build fails, verify node:24.11.1 image availability
- If CI fails, check Jenkins Node.js configuration
- If build fails, ensure Angular 20 compatibility (confirmed in research)

## Validation

- Docker images build successfully
- CI pipeline completes without errors
- Application runs and tests pass
