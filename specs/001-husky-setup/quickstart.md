# Quickstart: Husky Git Hooks Setup

**Feature**: 001-husky-setup  
**Date**: 2025-12-02  
**Purpose**: Developer guide for using the new git hooks system

## Overview

This feature adds automated code quality checks to your development workflow using Husky git hooks. The system enforces linting, type checking, and testing standards before allowing commits and pushes.

## What's Been Added

### New Package.json Scripts

```json
{
    "check:types": "ng build --no-emits",
    "prepare": "husky install",
    "postinstall": "husky install"
}
```

### New Dependencies

- `husky@^9.0.0` (dev dependency)

### Git Hooks

- **Pre-commit**: Runs `pnpm run lint` and `pnpm run check:types`
- **Pre-push**: Runs `pnpm run test` (all unit and integration tests)

## Installation & Setup

### 1. Install Dependencies

```bash
pnpm install
```

This will automatically:

- Install Husky as a dev dependency
- Run the postinstall script to set up git hooks
- Create the `.husky/` directory with hook scripts

### 2. Verify Installation

```bash
# Check if hooks are installed
ls -la .husky/
# Should show: pre-commit, pre-push, and _/husky.sh

# Test type checking
pnpm run check:types

# Test hooks (make a small change and try to commit)
git add .
git commit -m "test: verify hooks are working"
```

## Daily Usage

### Making Commits

1. Make your code changes
2. Stage your changes: `git add .`
3. Attempt to commit: `git commit -m "feat: add new feature"`

**What happens automatically:**

- ESLint runs and checks for code style issues
- TypeScript type checking runs and validates types
- If both pass, your commit is created
- If either fails, the commit is blocked with error messages

### Pushing Code

1. Commit your changes (they must pass hooks first)
2. Push to remote: `git push origin your-branch`

**What happens automatically:**

- All unit and integration tests run
- If tests pass, your push is completed
- If tests fail, the push is blocked with test failure details

### Running Checks Manually

```bash
# Run linting only
pnpm run lint

# Run type checking only
pnpm run check:types

# Run all tests
pnpm run test
```

## Troubleshooting

### Hook Not Running

**Symptoms**: Commit succeeds but no hooks execute
**Solutions**:

```bash
# Reinstall hooks
pnpm run prepare

# Or manually
npx husky install

# Check permissions
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

### Permission Denied Errors

**Symptoms**: "Permission denied" when committing
**Solution**:

```bash
# Fix hook permissions
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

### Type Check Failures

**Symptoms**: TypeScript errors block commit
**Solutions**:

1. Fix the TypeScript errors shown in the output
2. If you believe the error is wrong:
    - Check `tsconfig.json` settings
    - Run `pnpm run check:types` to see full details
    - Consult team for configuration changes

### Test Failures

**Symptoms**: Tests fail and block push
**Solutions**:

1. Run tests locally to see full details: `pnpm run test`
2. Fix failing tests
3. If tests are flaky, address test reliability before pushing

### Hook Timeout

**Symptoms**: Hooks take too long and timeout
**Solutions**:

- Type checking should complete in <10 seconds
- Pre-commit hooks should complete in <30 seconds
- Pre-push hooks should complete in <2 minutes
- If timeouts occur, investigate performance issues or consider test optimization

## Best Practices

### Before Committing

1. Run checks manually to save time:
    ```bash
    pnpm run lint && pnpm run check:types
    ```
2. Fix any issues before attempting to commit
3. Commit frequently with small, focused changes

### Before Pushing

1. Ensure all tests are passing locally:
    ```bash
    pnpm run test
    ```
2. Run the full test suite, not just a subset
3. Push only when you're ready for team review

### Writing Commit Messages

- Use conventional commits: `type(scope): description`
- Examples: `feat(auth): add login component`, `fix(api): handle null response`
- This integrates with the project's existing commit standards

### Performance Tips

- Type checking is fast (<10 seconds) - use it frequently during development
- Run full test suite before pushing to avoid waiting on pre-push hook failures
- Use `git commit --no-verify` only in emergency situations (not recommended)

## Team Collaboration

### Onboarding New Team Members

1. Clone the repository
2. Run `pnpm install` (hooks auto-install)
3. Verify with a test commit
4. Review this quickstart guide

### Sharing Hook Configuration

- Hook scripts are version controlled in `.husky/`
- Configuration updates are shared when team members pull changes
- No manual setup required after initial `pnpm install`

### Modifying Hooks

If you need to modify hook behavior:

1. Edit scripts in `.husky/` directory
2. Test changes with a commit
3. Commit the hook changes to share with team
4. Ensure all team members pull the updates

## Emergency Bypass (Use Sparingly)

If you absolutely need to bypass hooks:

```bash
# Bypass pre-commit hooks
git commit --no-verify -m "emergency commit"

# Bypass pre-push hooks
git push --no-verify origin your-branch
```

**Warning**: Only use this in true emergencies. Bypassing hooks can introduce bugs, style violations, or broken tests to the shared codebase.

## Support

If you encounter issues with the git hooks:

1. Check this troubleshooting section first
2. Consult the project's development guidelines
3. Reach out to the team for help with persistent issues
4. Document new solutions to help future developers
