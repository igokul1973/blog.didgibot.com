# Release Guide (Semantic Release + Jenkins)

## Commit messages (Conventional Commits)

- Use standard types: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`, `ci:`, `build:`.
- Breaking changes: add `!` after type/scope (e.g., `feat!: ...`) **or** include a `BREAKING CHANGE:` footer.

## CI flow

- Jenkins uses a two-pass behavior:
    - First run executes lint/test/build and then runs semantic-release inside the `cicd/Dockerfile.production` `bump_version` target.
    - semantic-release computes the next version, updates configured assets, creates the release commit/tag, and pushes back to GitHub.
    - That push triggers a second Jenkins run, but it skips CI stages due to the `[skip ci]` marker in the semantic-release commit message.

## Local dry-run

- To preview the next version and release notes without publishing:
    ```bash
    pnpm release --ci --dry-run
    ```

## Failure behavior (CI bump_version)

- In the `bump_version` stage, semantic-release runs for real; if it cannot compute a version (wrong branch/no tags/non-conventional history) or lacks credentials, the stage fails and the pipeline is aborted (no release commit/tag is pushed).
- The Jenkins pipeline reports this as an aborted job with a message pointing to bump_version logs.
- Allowed release branches (semantic-release): `main`.

## Tokens/Environment

- CI requires `GITHUB_TOKEN`/`GH_TOKEN` for semantic-release to run; bump_version sets placeholders in-container.
- npm publish is disabled; changelog/git/github plugins are active per `.releaserc.json`.

## Do not manually bump

- Avoid manual edits to `package.json` version; let `bump_version` compute and write it.
