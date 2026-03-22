---
trigger: always_on
---

1. Use `pnpm` instead of `npm`.
2. Always use scripts defined in `package.json` `scripts` section instead of some ad-hoc shell command sequences.
3. No explicit `any` types in TypeScript.
4. Montitor and stop execution of the terminal commands if they runs unusually long. If tests, for example, run longer than 20 seconds - that is too long and it means there is an execution loop that never exists.
5. Max run length of any terminal command must be 2 minutes. If longer - exit its execution and analyze why it happened. Make necessary corrections.
