# Contributing

This is a personal portfolio project, but the workflow is standard.

- Read the **Git & commits** section of [`AGENTS.md`](./AGENTS.md) before committing. It defines the commit message format, branch naming, PR rules, and the CI quality gate.
- Commit messages are enforced by a Husky `commit-msg` hook (commitlint) and re-checked in CI.
- Staged files are formatted by `lint-staged` on commit.
- Branch off `main` (never commit to it directly), open a PR, and squash-merge once `ci` is green.

Local verification before opening a PR:

```sh
bun run format
bun run lint
bun run check
bun run test:unit -- --run
```
