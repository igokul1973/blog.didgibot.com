# Release Guide (Semantic Release + Jenkins)

## Commit messages (Conventional Commits)

- Use standard types: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`, `ci:`, `build:`.
- Breaking changes: add `!` after type/scope (e.g., `feat!: ...`) **or** include a `BREAKING CHANGE:` footer.

## CI flow (unchanged except bump_version logic)

- Jenkins two-pass pipeline remains intact.
- Release flow uses semantic-release (dry-run in CI bump_version stage) and the existing commit_new_version stage.
- See [docs/release.md](./docs/release.md) for commit formats (`chore(release): ... [version bump]`), breaking-change syntax, env vars, and local dry-run (`pnpm release --ci --dry-run`).

## Local dry-run

- To preview the next version and release notes without publishing:
    ```bash
    pnpm release --ci --dry-run
    ```

## Dry-run failure behavior (CI bump_version)

- In the bump_version Dockerfile.production stage, semantic-release runs in dry-run; if it cannot compute a version (wrong branch/no tags/non-conventional history), the stage fails and the pipeline is aborted. No commit or publish occurs.
- The Jenkins pipeline reports this as an aborted job with a message pointing to bump_version logs.
- Current allowed release branches (semantic-release): `main` and `005-semantic-release` (temporary to validate the flow).

## Tokens/Environment

- CI requires `GITHUB_TOKEN`/`GH_TOKEN` for semantic-release to run; bump_version sets placeholders in-container.
- npm publish is disabled; changelog/git/github plugins are active per `.releaserc.json`.

## Do not manually bump

- Avoid manual edits to `package.json` version; let `bump_version` compute and write it.
