# Repository Guidelines

## Project Structure & Module Organization
Source code lives in `src/`, with routing under `src/pages`, shared UI in `src/components`, hooks in `src/hooks`, and TypeScript contracts in `src/types`. Tailwind-first styling is extended through modules in `src/styles`. Public assets, favicons, and Open Graph images belong in `public/`. CSV exports tracked in `export.json` feed the conversion scripts at the repo root (`convert.js`, `npm run books:update`) to regenerate typed data.

## Build, Test, and Development Commands
- `npm run dev`: Start the Next.js dev server on http://localhost:3000 with hot reload.
- `npm run build`: Produce the production bundle; keep it passing before PR merge.
- `npm run lint`: Run Biome lint rules for formatting and quality checks.
- `npm run format`: Apply Biome formatting; use `npm run lint:fix` for autofixes.
- `npm run convert` / `npm run books:update`: Rebuild TypeScript data from the CSV exports.

## Coding Style & Naming Conventions
TypeScript strict mode is enabled; define explicit prop interfaces and prefer functional components. Imports use the `@/` alias, ordered with external packages before internal modules. Components and types use PascalCase, hooks use `use`-prefixed camelCase, and utilities stay camelCase. Indent with two spaces and avoid trailing whitespace. Compose layouts with Tailwind classes, adding module overrides only when the utility palette falls short.

## Testing Guidelines
Playwright is available for e2e coverage. Place specs under `tests/e2e` and name them `<feature>.spec.ts`. Run suites with `npx playwright test` and document any fixtures or auth steps in the PR description. When tests are absent, verify `npm run lint` and `npm run build` locally before opening a PR.

## Commit & Pull Request Guidelines
Follow Conventional Commits (`feat:`, `fix:`, `chore:`) with concise imperatives. PRs should describe the change, link relevant issues, and include before/after screenshots for UI updates. Mention data regeneration commands (e.g., `npm run books:update`) so reviewers can confirm generated diffs. Keep branches up to date with `main` and ensure lint/build checks succeed before requesting review.

## Environment & Tooling Notes
Node.js 18+ keeps parity with the Next.js toolchain. Configure editor integrations for Tailwind IntelliSense and Biome to catch style issues early. ENV secrets belong in `.env.local` (never commit). Restart the dev server after updating conversion outputs to ensure hot data reloads.
