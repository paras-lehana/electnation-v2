# Submission Artifact Policy

Election Yatra keeps the submitted Git repository focused on source code,
configuration, tests, and evaluator-facing documentation. Large local tools,
generated screenshots, dependency folders, and build outputs are intentionally
excluded because they do not improve the reviewed product and they make cloning,
installing, and automated analysis slower.

## Omitted Large Artifacts

| Path / Pattern | Why It Is Omitted | How To Recreate Or Review |
| --- | --- | --- |
| `bin/gh.exe` | Local GitHub CLI helper binary; not app code and not used by runtime, tests, or builds. | Install GitHub CLI from the official installer if needed for local repository operations. |
| `gh.zip` | Download archive for the local CLI helper; duplicates the binary and adds repository weight. | Download from the upstream GitHub CLI release page when needed. |
| `public/screenshots/submission/` | Generated visual evidence; useful for human review but not required for the app to build or run. | Run Playwright/browser screenshots against the deployed app after `pnpm dev` or Cloud Run deployment. |
| `node_modules/`, `.next/`, `dist/`, `coverage/`, `playwright-report/`, `test-results/` | Reproducible dependency, build, test, or report output. | Run `pnpm install`, `pnpm build`, `pnpm test`, `pnpm a11y`, or `pnpm e2e:ci`. |

## What Stays Tracked

- Application source for the Next.js web app, Cloud Run functions, and shared core package.
- Tests for core contracts, API behavior, browser UI helpers, accessibility, and streaming chat parsing.
- Root evidence files for the review rubric: `README.md`, `EVALUATION_MAPPING.md`, `GOOGLE_SERVICES.md`, `SECURITY.md`, `ACCESSIBILITY.md`, `TESTING.md`, and `PROMPTS.md`.
- Cloud Build and workspace configuration files needed to reproduce the deployed solution.

## Review Rationale

The judging rubric rewards maintainable code, responsible security, efficient
resource usage, validated functionality, accessibility, and meaningful Google
Services integration. Keeping only reproducible source and evidence files makes
the repository easier for automated evaluators to inspect while preserving every
file needed to rebuild and test the solution.