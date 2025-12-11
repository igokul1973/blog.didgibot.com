# Quickstart: Angular Test Coverage with Vitest

## Prerequisites

- Node and dependencies installed
- Angular workspace configured per constitution

## Run Tests with Coverage

```bash
npm test -- --coverage
```

Verify that:

- Coverage is reported for files under `src/app` (excluding infra/bootstrapping files).
- Overall Angular coverage and per-file coverage are visible.

## Adding Tests for New Angular Code

1. Create or update the Angular element under `src/app`.
2. Add or update its Vitest unit tests (co-located or under `tests/`).
3. Run tests with coverage and confirm ≥ 90% coverage for the new/modified file.
4. Ensure there is no implicit `any` in test code and no deprecated Angular APIs are used.

## Handling Legacy / Untestable Areas

1. Attempt to refactor the code to be testable.
2. If not feasible, propose an entry on the **exceptions allowlist** with:
    - File or element identifier
    - Reason it cannot reasonably be tested
    - Proposed mitigation or monitoring
3. Obtain maintainer approval and record the exception.
