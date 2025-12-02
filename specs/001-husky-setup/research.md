# Research: Husky Git Hooks Setup

**Feature**: 001-husky-setup  
**Date**: 2025-12-02  
**Purpose**: Technical research and decision documentation for implementation

## Type Checking Command Research

### Decision: Use Angular CLI `ng build --no-emits` for type checking

**Rationale**:

- Angular CLI provides built-in TypeScript compilation with project-specific configuration
- `--no-emits` flag validates types without generating build artifacts
- Leverages existing tsconfig.json settings and Angular compiler optimizations
- Faster than full tsc compilation due to Angular's incremental compilation
- Integrates seamlessly with existing Angular project structure

**Alternatives Considered**:

- `tsc --noEmit`: Generic TypeScript compiler, slower for Angular projects
- `vue-tsc --noEmit`: Not applicable to Angular
- Custom fork of tsc: Unnecessary complexity

## Husky Version and Setup Research

### Decision: Use Husky v9 with modern configuration

**Rationale**:

- Husky v9 supports automatic install via postinstall script
- Modern API simplifies hook management
- Better pnpm support compared to older versions
- Active maintenance and community adoption
- Supports `.husky/` directory structure for version control

**Alternatives Considered**:

- Husky v8: Legacy API, less flexible
- Simple-git-hooks: Less feature-rich, smaller community
- Lefthook: More complex configuration, YAML-based
- Pre-commit: Python-based, not Node.js native

## Hook Script Implementation Research

### Decision: Use shell scripts with proper error handling

**Rationale**:

- Shell scripts provide maximum compatibility across development environments
- Simple to debug and maintain
- Fast execution with minimal overhead
- Easy to integrate with existing npm/pnpm scripts
- Standard approach in the Node.js ecosystem

**Script Structure**:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run linting
pnpm run lint

# Run type checking
pnpm run check:types
```

**Alternatives Considered**:

- Node.js scripts: Heavier, longer startup time
- Binary executables: Platform-specific, harder to debug
- Makefiles: Overkill for simple hook chains

## Package.json Scripts Research

### Decision: Add dedicated scripts with clear naming

**Rationale**:

- Follows existing project script patterns
- Clear separation of concerns
- Easy to run individually for debugging
- Consistent with Angular CLI conventions

**Scripts to Add**:

```json
{
    "check:types": "ng build --no-emits",
    "prepare": "husky install",
    "postinstall": "husky install"
}
```

**Alternatives Considered**:

- Single combined script: Less flexible, harder to debug
- Using Angular CLI directly: Less discoverable, inconsistent with project patterns

## Performance Optimization Research

### Decision: Use parallel execution where possible

**Rationale**:

- Linting and type checking can run independently
- Reduces total hook execution time
- Modern systems have multiple cores available
- Error handling still works correctly with parallel execution

**Implementation**:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run commands in parallel
pnpm run lint &
LINT_PID=$!
pnpm run check:types &
TYPE_PID=$!

# Wait for both and check exit codes
wait $LINT_PID
LINT_EXIT=$?
wait $TYPE_PID
TYPE_EXIT=$?

if [ $LINT_EXIT -ne 0 ] || [ $TYPE_EXIT -ne 0 ]; then
  exit 1
fi
```

**Alternatives Considered**:

- Sequential execution: Simpler but slower
- Complex job scheduling: Overkill for this use case

## Error Handling Research

### Decision: Fail-fast with clear error messages

**Rationale**:

- Immediate feedback to developers
- Prevents confusing partial success states
- Standard behavior for git hooks
- Easy to understand and debug

**Implementation**:

- Use `set -e` to exit on first error
- Preserve original error output from commands
- No custom error messaging to avoid masking real issues

**Alternatives Considered**:

- Continue on error: Allows bad commits
- Custom error messages: Can mask real issues
- Warning-only approach: Doesn't enforce quality standards

## Integration with Existing Tools Research

### Decision: Minimal integration, leverage existing configurations

**Rationale**:

- Project already has ESLint and Prettier configured
- Angular CLI already configured for TypeScript
- Vitest already configured for testing
- No need to duplicate configuration

**Integration Points**:

- Use existing `pnpm run lint` command
- Use existing `pnpm run test` command
- Create new `check:types` command using Angular CLI
- Add Husky-specific scripts to package.json

**Alternatives Considered**:

- Duplicate configurations: Maintenance overhead
- Replace existing tools: Unnecessary disruption
- Custom configurations: Risk of inconsistency
