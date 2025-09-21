# Repository Guidelines

## Project Structure & Module Organization
Source lives in `src/`: routing under `src/pages`, shared UI in `src/components`, hooks in `src/hooks`, domain types in `src/types`, and Tailwind helpers in `src/styles`. Data access goes through `src/data`, which re-exports the generated modules in `public/`. Static assets, favicons, and Open Graph images stay in `public/`. End-to-end specs reside in `tests/e2e`, while supporting utilities sit in `tests/utils`. Keep CSV exports in the repo root (`export.json`); regenerate `public/books.ts` with `npm run convert` (alias: `npm run books:update`).

## Build, Test, and Development Commands
- `npm run dev` — Start the Next.js dev server at `http://127.0.0.1:3000` with hot reload.
- `npm run build` — Produce the production bundle; keep this passing before merging.
- `npm run start` — Serve the built app; useful for validating production output.
- `npm run lint` / `npm run lint:fix` — Run Biome lint checks, optionally applying safe fixes.
- `npm run format` — Enforce the repository formatting profile.
- `npm run test` — Execute Vitest unit suites.
- `npm run test:e2e` — Launch Playwright tests; the config auto-starts the dev server.

## Coding Style & Naming Conventions
TypeScript strict mode is enabled. Use functional React components with explicit prop interfaces. Order imports with external modules first, then `@/` aliases, then relative paths. Components, templates, and types use PascalCase; hooks are `use`-prefixed camelCase; utilities stay camelCase. Indent with two spaces, avoid trailing whitespace, and rely on Tailwind utility classes before adding bespoke styles. Run `npm run format` before committing.

## Testing Guidelines
Vitest lives in `tests/utils` today; place new unit specs alongside features or in that folder. End-to-end flows belong in `tests/e2e/<feature>.spec.ts`, using Playwright’s `@playwright/test`. Target critical paths: year filtering, infinite scroll, detail navigation, and ISBN links. Always run `npm run lint`, `npm run build`, and `npm run test:e2e` (or document why not) prior to review. Capture failing repro steps in PR discussions.

## Commit & Pull Request Guidelines
Follow Conventional Commits (`feat:`, `fix:`, `chore:`, etc.). Each PR should summarize scope, link relevant issues, and include before/after screenshots for UI changes. Note any data regeneration commands executed (`npm run books:update`). Keep branches rebased on `main`, ensure lint/build/test suites are green, and flag known gaps or TODOs in the description.

## Environment & Configuration
Use Node.js 18+ to match Next.js expectations. Store secrets in `.env.local` only. Restart the dev server after running conversion scripts so regenerated book data loads. When debugging Playwright locally, export `PLAYWRIGHT_BASE_URL` to point at an existing server to skip auto-start.
