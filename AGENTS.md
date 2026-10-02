# portfolio-2026

SvelteKit 5 (runes-only) static portfolio deployed to GitHub Pages. TypeScript, bun.

## Commands

- Install: `bun install --frozen-lockfile`
- Dev server: `bun run dev`
- Typecheck: `bun run check` (runs `svelte-kit sync` + `svelte-check`)
- Lint: `bun run lint` (prettier `--check` then eslint); format: `bun run format`
- Unit/component tests: `bun run test:unit -- --run` (bare `test:unit` watches)
- E2E: `bun run test:e2e` (installs Playwright, then builds + previews on :4173)
- Everything: `bun run test` → unit then e2e
- Build: `bun run build`; Storybook: `bun run storybook`

Verify in this order: format/lint → `check` → tests.

## Gotchas

- Package manager is **bun** even though `README.md` shows npm; CI uses bun.
- There is **no `svelte.config.js`**. All SvelteKit config lives in `vite.config.ts`: `adapter-static` (fallback `404.html`), mdsvex (`.md`/`.svx` valid routes/components), and `runes: true` forced for every file outside `node_modules`. Edit `vite.config.ts`, not a SvelteKit config file.
- Static-only: `src/routes/+layout.ts` sets `prerender = true` and `trailingSlash = 'always'`. Every route must prerender — no server routes, form actions, or dynamic SSR.
- `BASE_PATH` is baked in at **build** time (dev base is `''`). The deploy workflow sets `BASE_PATH=/<repo>`; reproduce a Pages build with `BASE_PATH=/portfolio-2026 bun run build`.
- Deploy: push to `main` → `.github/workflows/deploy.yml` → GitHub Pages.
- Svelte 5 runes only (no `export let`, `on:click`, `<slot>`).
- Prettier: tabs, single quotes, no trailing commas, printWidth 100, Tailwind class sorting keyed to `src/routes/layout.css`. Run `format` before committing.
- Vitest has `expect.requireAssertions: true` — every test needs an assertion.
- Test naming decides the runner: vitest needs `*.{test,spec}.*` (`.svelte.` prefix = browser project), Playwright needs `*.e2e.{ts,js}`.
- Storybook stories are `*.stories.svelte` (svelte-csf addon), not `*.stories.ts`.
- `src/stories/`, `src/lib/vitest-examples/`, and `src/routes/demo/` are generated scaffold — not portfolio code. Tailwind v4 is CSS-first (`@import 'tailwindcss'` in `src/routes/layout.css`); there is no `tailwind.config`.

## Git & commits

- Commit messages are **Conventional Commits**: `type(scope): subject`. Enforced by commitlint (`.husky/commit-msg` locally, CI on PR titles and pushed commits).
- Types: `feat fix chore docs style refactor test build ci perf revert`. Scopes (optional): `routes lib stories build ci deps docs`. Subject is imperative, lowercase, no trailing period, header ≤72 chars. Use a body only when the _why_ isn't obvious; add a `BREAKING CHANGE:` footer for breaks.
- Solo repo: commit directly to `main`. For risky or multi-step work you may use a short-lived branch (`feat/… fix/… chore/… docs/… ci/… refactor/… test/… deps/…` + kebab-case slug); if you open a PR, **squash-merge** it and make the PR title a valid Conventional Commit (it becomes the commit on `main`).
- `main` is production and continuously deployed. No release tags. Don't rewrite pushed `main` history.
- Husky runs `lint-staged` (`prettier --write`) on `pre-commit`. Don't use `--no-verify`; CI re-checks.
- Verify before pushing: `bun run format` → `bun run lint` → `bun run check` → `bun run test:unit -- --run`. CI enforces lint, typecheck, and `test:unit` — which includes the browser and Storybook vitest projects, so it installs Chromium; Playwright e2e and `build-storybook` stay local. One logical change per commit; commit `bun.lock` with any `package.json` change; no `wip`/`fixup` commits on `main`; no AI-attribution trailers.
- Never commit `build/`, `.svelte-kit/`, `storybook-static/`, or `test-results/`.

## Svelte authoring

Validate any `.svelte` / `.svelte.ts` change with the Svelte autofixer before finalizing. If the Svelte MCP tools are available use them; otherwise use the CLI documented in `.github/skills/svelte-code-writer/SKILL.md` (`npx @sveltejs/mcp …`, escape `$` as `\$` in shell). There is also a `.github/agents/svelte-file-editor.agent.md` workflow.
