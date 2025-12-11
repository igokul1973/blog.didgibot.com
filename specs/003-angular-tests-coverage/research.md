# Research: Angular Test Coverage with Vitest

## Decisions

- **Coverage Tooling**: Use **Vitest** as the primary test runner and coverage tool for Angular code as it is already set up for the job.
- **Coverable Scope**: Treat all runtime Angular code under `src/app` (components, services, pipes, directives, guards, other non-test logic) as **coverable**, excluding infra/bootstrapping (e.g., `main.ts`, env configs, tooling helpers).
- **Legacy / Untestable Areas**: Allow a **small, explicit exception allowlist** for legacy or structurally untestable code, each with written justification and maintainer approval.
- **Enforcement Model**: Treat ≥ 90% coverage as a **CI-reported guideline** (warnings, not hard failures); reviewers enforce policy in practice.

## Rationale

- Vitest integrates well with TypeScript and fast unit test feedback loops, and it is already mandated by the constitution.
- Focusing on `src/app` keeps expectations clear and aligned with the Angular layout defined in the constitution.
- A controlled exception mechanism avoids blocking progress on truly hard-to-test legacy areas while still preserving a strong coverage standard.
- Soft CI enforcement avoids sudden disruption while still driving behavior via visible coverage signals and review culture.

## Alternatives Considered

- **Jest/Karma**: Rejected because Vitest is already mandated and provides faster feedback and simpler configuration.
- **Global hard coverage gate**: Rejected as too brittle given legacy/hard-to-test areas; would cause frequent CI failures.
- **No exception mechanism**: Rejected because some legacy/3rd-party integrations cannot realistically reach 90% coverage without risky refactors.
