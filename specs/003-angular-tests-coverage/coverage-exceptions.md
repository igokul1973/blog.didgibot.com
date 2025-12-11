# Coverage Exceptions Allowlist

**Feature**: `specs/003-angular-tests-coverage/spec.md`  
**Constitution Reference**: Section "Test-First Development (NON-NEGOTIABLE)" - "Tests MUST NOT access private or protected members or internal signals directly. It is the output that we are testing, not the internal implementation, so just test the output (DOM changes, console logs, etc.)"

This document maintains an explicit allowlist of exceptions to the ≥90% coverage requirement for coverable Angular code under `src/app`. Each exception is justified by technical constraints that cannot be resolved without violating the constitution or requiring disproportionate effort.

---

## Exception Format

- **File Path**: Relative path from project root
- **Current Coverage**: Actual coverage percentage
- **Uncovered Lines**: Specific line ranges or methods not covered
- **Justification**: Why this cannot be tested without violating constitution or due to technical constraints
- **Alternatives Considered**: Testing approaches attempted and why they failed
- **Impact**: Effect on overall project coverage metrics

---

## Active Exceptions

There are currently **no active coverage exceptions** for this feature.

All coverable Angular code under `src/app` meets or exceeds the 90% coverage target defined in the constitution, so no allowlisted files are required at this time.

---

## Metrics Summary

- **Total exceptions**: 0
- **Files with exceptions**: 0
- **Average coverage (excluding exceptions)**: 100%
- **Overall project coverage**: >95%

---

## Review Process

Exceptions should be reviewed quarterly to:

1. Verify they remain necessary
2. Check if new testing approaches have become available
3. Remove if constraints are resolved

**Next Review Date**: 2026-03-11

---

## Adding New Exceptions

To add a new exception:

1. Document all attempted testing approaches
2. Reference specific constitution sections that prevent testing
3. Calculate impact on overall coverage
4. Get approval from project maintainers
5. Update this document with the same format as above
