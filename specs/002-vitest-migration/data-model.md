# Data Model: Vitest Test Migration

## Entities

### 1. Test Command

- **Description**: Logical representation of how tests are invoked from the CLI.
- **Attributes**:
    - `name` (string): Script name in `package.json` (e.g., `test`, `test:headless`).
    - `runner` (enum): `vitest` | `karma` (Karma to be removed).
    - `mode` (enum): `watch` | `single-run` | `coverage`.
    - `command` (string): Underlying command (e.g., `vitest`, `vitest run --coverage`).
- **Relationships**:
    - Linked from **Git Hook Configuration** for pre-push validation.

### 2. Git Hook Configuration

- **Description**: Behavior of Husky hooks that gate code quality.
- **Attributes**:
    - `hookName` (enum): `pre-commit` | `pre-push`.
    - `commands` (string[]): List of CLI commands executed in order.
    - `failFast` (boolean): Whether to abort on the first non-zero exit code.
    - `maxDurationSeconds` (number): Target maximum execution time.
- **Relationships**:
    - References **Test Command** entries for which scripts are run.

### 3. Testing Toolchain

- **Description**: Grouping of dependencies and configuration files used for testing.
- **Attributes**:
    - `devDependencies` (string[]): List of testing-related dev dependencies (Vitest, jsdom, Angular testing utilities).
    - `legacyDependencies` (string[]): Karma/Jasmine-related packages slated for removal.
    - `configFiles` (string[]): `vitest.config.ts`, `src/test-setup.ts`, legacy `karma.conf.js` (to be deleted), etc.
- **Relationships**:
    - Used by **Test Command** (defines which runner/config to use).

## Validation Rules

- Test commands pointing to `runner = karma` MUST be removed once Vitest migration is complete.
- Pre-push hook MUST reference a **Test Command** whose `runner` is `vitest` and `mode` is `single-run`.
- `legacyDependencies` MUST be empty at the end of the migration feature.

## State Transitions

1. **Pre-migration**
    - `runner = karma` for the main test command.
    - `legacyDependencies` contains Karma/Jasmine packages.
    - Pre-push hook may be disabled or running non-Vitest tests.

2. **During migration**
    - New or migrated specs use Vitest.
    - Some legacy dependencies may still exist but are not referenced by active scripts.

3. **Post-migration**
    - All active **Test Command** entries use `runner = vitest`.
    - `legacyDependencies` list is empty; Karma/Jasmine packages removed from `devDependencies`.
    - Pre-push hook runs Vitest and blocks failing pushes.
