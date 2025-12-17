# Research: Semantic Release Integration

## Decisions

- Use semantic-release in `--dry-run` within `bump_version` to compute the next version; keep existing commit/push stage intact.
- Preserve Jenkins two-pass flow; no Jenkinsfile logic changes.
- Enforce Conventional Commits via commitlint 20.x + husky commit-msg hook.
- Keep npm publish disabled; use changelog + git tagging via semantic-release plugins.
- Keep package version priming in bump_version by writing computed version to package.json.

## Rationale

- Dry-run avoids duplicate commits/tags while still deriving correct versions for the existing commit stage.
- Minimizes CI risk by limiting changes to bump_version only, per constraint.
- Conventional Commits ensure predictable version bumps and breaking-change signals (`feat!` or `BREAKING CHANGE`).
- Disabling npm publish matches current pipeline (Docker image build/deploy handles distribution).

## Alternatives considered

- Run semantic-release for real (no dry-run) to handle commits/tags: rejected because it would conflict with the existing manual commit/push stage and Jenkins two-pass design.
- Move versioning to Jenkinsfile steps: rejected per constraint to leave pipeline unchanged outside bump_version.
