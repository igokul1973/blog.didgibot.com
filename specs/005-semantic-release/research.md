# Research: Semantic Release Integration

## Decisions

- Run semantic-release within `bump_version` to compute the next version, update configured assets, create the release commit/tag, and push back to GitHub.
- Preserve Jenkins two-pass flow; follow-up build triggered by the release commit is skipped via `[skip ci]` in the semantic-release commit message.
- Enforce Conventional Commits via commitlint 20.x + husky commit-msg hook.
- Keep npm publish disabled; use changelog + git tagging via semantic-release plugins.
- Keep package version updates and other release assets managed by semantic-release git plugin according to `.releaserc.json`.

## Rationale

- Single source of truth: semantic-release owns the release commit/tag to avoid duplicating release logic in separate CI steps.
- Minimizes CI risk by limiting changes to bump_version only and relying on `[skip ci]` to keep the two-pass pipeline behavior stable.
- Conventional Commits ensure predictable version bumps and breaking-change signals (`feat!` or `BREAKING CHANGE`).
- Disabling npm publish matches current pipeline (Docker image build/deploy handles distribution).

## Alternatives considered

- Run semantic-release in dry-run and commit/push version changes via a separate CI step: rejected due to increased complexity and risk of divergence between computed release metadata and the committed assets.
- Move versioning to Jenkinsfile steps: rejected per constraint to leave pipeline unchanged outside bump_version.
