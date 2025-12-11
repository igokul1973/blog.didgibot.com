# Data Model: Angular Test Coverage

## Entities

### Angular Element Under Test

- **id**: unique identifier (file path + export name)
- **type**: component | service | pipe | directive | guard
- **path**: source file path under `src/app`
- **coverable**: boolean (true when in coverable scope)
- **coverage**: line/branch/statement percentages
- **lastTestedAt**: timestamp of last coverage run

### Test Suite / Test Case

- **id**: unique test identifier
- **targetElementId**: reference to Angular Element Under Test
- **status**: passed | failed | skipped
- **type**: unit | integration

### Coverage Summary

- **overallAngularCoverage**: aggregate coverage for coverable Angular code
- **perFileCoverage**: mapping from file path to coverage metrics
- **exceptionsAllowlist**: list of legacy/untestable entries with justification and approver

## Relationships

- One Angular Element Under Test may be covered by multiple Test Cases.
- Each Coverage Summary references many Angular Elements Under Test.
- Exceptions on the allowlist are still tracked as elements but are excluded from enforcement metrics.
