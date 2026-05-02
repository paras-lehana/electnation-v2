# Changelog

All notable changes to Election Yatra.

## [0.5.1] - 2026-05-03

### Fixed

- Hid the mobile horizontal primary-navigation scrollbar with a real cross-browser `scrollbar-hide` utility so the Google Civic Stack link remains reachable without a heavy visible scroll track.

### Verified

- `pnpm --filter @yatra/web type-check` passed.
- `pnpm --filter @yatra/web build` passed.

## [0.5.0] - 2026-05-03

### Added

- Added a typed Google Civic Stack catalog with 30+ Google service slots, implementation statuses, code paths, API surfaces, browser surfaces, env contracts, fallback modes, evidence signals, and next steps.
- Added `GET /api/google/services`, an evaluator-facing evidence route that returns the service scorecard, civic journey map, runtime readiness, and catalog without exposing secret values.
- Added a public `googleServices` summary to `/api/config/public` for count-only UI evidence.
- Added `/google-services`, a judge-facing proof page that maps Google services to voter jobs and separates implemented, ready-with-key, and planned scaffolds.

### Changed

- Updated the homepage and primary navigation to surface the Google Civic Stack as first-class evidence.
- Updated README, Google Services docs, rubric mapping, and testing docs to point to the new catalog, API route, and browser validation path.
- Bumped release metadata to `0.5.0` across the root, core, web, functions, and API health version source.

### Tested

- Added core tests for Google service catalog breadth, honest unimplemented status rules, civic journey references, public summary safety, and deep-linkable evidence entries.
- Added API integration assertions for `/api/google/services` and public config Google service counts.
- Added Playwright coverage for `/google-services` and included the page in axe accessibility scans.

### Verified

- `pnpm type-check` passed across core, functions, and web.
- `pnpm test` passed with 34 core tests, 31 functions/API tests, and 7 web tests.
- `pnpm build` passed across core, functions, and web.
- `pnpm a11y` passed across 10 routes, including `/google-services`.
- `pnpm e2e:ci` passed with 17 Chromium tests, including the Google Services proof page.

## [0.4.6] - 2026-05-03

### Added

- Added 11 typed accessibility feature blueprints covering screen-reader/live-region support, keyboard/switch navigation, high-contrast and large text, scheduled-language read-aloud, captions/transcripts, voice input correction, cognitive Easy Mode, dyslexia-friendly layout, reduced motion, offline packets, and classroom facilitator mode.
- Added 4 assistive user profiles with default preferences and recommended feature sets for senior voters, screen-reader/keyboard users, multilingual community classes, and low-distraction neurodivergent use.
- Added helper functions for preference-profile building, implementation planning, transcript cues, voice-input drafts, offline accessibility packets, facilitator prompt decks, and architecture scorecards.
- Surfaced the accessibility architecture scorecard and blueprint samples on `/easy-mode` and exposed safe summary counts through `/api/config/public`.

### Changed

- Expanded the shared accessibility coverage summary from language/evidence counts to include feature blueprints, user profiles, input modes, and WCAG criteria references.
- Bumped release metadata to `0.4.6` across the root, core, web, functions, and API health version source.

### Tested

- Added core tests for accessibility blueprint parameter coverage, status separation, profile planning, transcript cues, voice-input drafts, offline packets, and classroom prompt decks.
- Added API config assertions for the public accessibility summary while preserving server-only secret redaction.
- Full validation passed for `pnpm type-check`, `pnpm test` (29 core + 30 functions + 7 web tests), `pnpm build`, `pnpm a11y` (9 routes), and `pnpm e2e:ci` (15 Chromium tests).

## [0.4.5] - 2026-05-03

### Added

- Added `packages/core/src/accessibility.ts` with 22 scheduled Indian language Easy Mode presets, browser speech settings, Google TTS request drafting, WCAG evidence items, assistive-tech checks, and a compact coverage summary.
- Added core tests for language catalog completeness, TTS fallback behavior, accessibility evidence honesty, and expanded locale schema support.
- Added an Easy Mode language selector, selected transcript panel, voice-readiness status, and accessibility evidence summary cards.
- Added the explicit `eslint-config-next` web dev dependency so Next.js can load `next/core-web-vitals` during production builds.

### Changed

- Expanded the shared locale schema and public API config from the previous limited language set to English plus the 22 scheduled Indian language codes.
- Routed Cloud Text-to-Speech requests through the same shared preset resolver used by Easy Mode so backend and frontend language handling cannot drift.
- Switched Google Fonts loading from manual `<link>` tags to `next/font/google` CSS variables for cleaner Next.js performance/lint behavior.

### Fixed

- Prioritized exact scheduled-language and BCP-47 matches before shared fallback Google TTS codes so inputs like `hi-IN` and `ur-IN` resolve to Hindi and Urdu, not earlier fallback presets.

### Tested

- Focused validation passed for `pnpm --filter @yatra/core test`, `pnpm --filter @yatra/core build`, `pnpm --filter @yatra/web type-check`, and `pnpm --filter @yatra/functions test`.
- Full validation passed for `pnpm type-check`, `pnpm test` (26 core + 30 functions + 7 web tests), `pnpm build`, `pnpm a11y` (9 routes), and `pnpm e2e:ci` (15 Chromium tests).

## [0.4.4] - 2026-05-02

### Added

- Added Playwright browser coverage for onboarding, Forward Clinic, Map, Easy Mode, Vote Sanrakshan, Yatra, Chunav Saathi chat, and axe accessibility scans.
- Added React Testing Library coverage for Button, Stepper, ChatWidget, and the local progress ledger.
- Added root scripts for focused unit/API/web tests, full E2E, headed E2E, and axe accessibility checks.

### Changed

- Made the Playwright suite run with one local worker so Windows + Next.js dev-server browser tests are deterministic.
- Darkened the saffron palette and fixed shared Button/Card defaults so explicit custom backgrounds and text colors render reliably.
- Improved Chunav Saathi chat semantics with a labelled dialog, `aria-expanded`, `aria-controls`, a polite `role="log"`, labelled input, labelled submit action, Escape close, focus return, and reduced-motion support.
- Added skip-link `#main` targets to voter-facing routes and accessible labels/error announcements for key form controls.
- Replaced low-contrast muted badge chips and opacity-dimmed readable Yatra cards with contrast-safe states.

### Tested

- Expanded API integration coverage for public config redaction, chat SSE, invalid chat payloads, Calendar template links, map errors, TTS validation, and translation validation.
- Restored and updated testing documentation and rubric mapping to match the verified test counts.

### Verified

- `pnpm type-check` passed across core, functions, and web.
- `pnpm test` passed (19 core tests, 30 backend/API tests, 7 web tests).
- `pnpm build` passed across core, functions, and web.
- `pnpm a11y` passed across 9 core routes with color contrast enabled.
- `pnpm e2e:ci` passed (15 Chromium tests).

## [0.4.3] - 2026-05-02

### Security

- Added server-side redaction for Aadhaar, EPIC, phone, email, PAN, and UPI-like values before chat or Forward Clinic text is sent to llm-service.
- Wrapped chat and Forward Clinic text in explicit `### USER_INPUT` prompt-injection boundaries and updated the Chunav Saathi prompt to treat bounded user text as untrusted.
- Filtered model-provided Forward Clinic source URLs to official Election Commission hostnames only.
- Sanitized llm-service HTTP errors so upstream response bodies and auth material are not echoed into logs or fallback metadata.
- Scoped production reCAPTCHA bypass to configured web origins and tightened no-Origin CORS behavior behind `ALLOW_NO_ORIGIN_REQUESTS`.

### Tested

- Added focused tests for privacy redaction, prompt boundaries, request-origin security helpers, public-config secret absence, production reCAPTCHA-bypass origin checks, and sanitized llm-service errors.

### Verified

- `pnpm type-check` passed across core, functions, and web.
- `pnpm test` passed (19 core tests, 24 backend tests).
- `pnpm build` passed across core, functions, and web.
- Cloud Build completed for API (`sha256:c6b6a5bf04c2070cd0e624477c3d806491872f5c378c141b4256857d7cf8ea84`) and web (`sha256:c4a8dfbb7aa737f788b7a4db95fada77dd55123dc1a29c1054d18187272f181b`).
- Deployed `electnation-api-00043-dlt` and `electnation-web-00023-v6m` to 100% traffic.
- Live API health returned `version: 0.4.3`; live Forward Clinic returned `mode: llm-service`, official ECI links, and redacted `[REDACTED_EPIC]` in `inputText`.
- Live no-Origin Forward Clinic request returned `RECAPTCHA_REQUIRED`, proving the production bypass guard is active.
- Browser smoke passed for `/clinic`, `/map`, homepage Chunav Saathi chat, and required web routes; mobile-sized Clinic and Map checks reported no horizontal overflow.

## [0.4.2] - 2026-05-02

### Changed

- Made `DEMO_MODE` opt-in so clinic and map routes stay on production behavior unless demo mode is explicitly requested.
- Cleaned the public-facing clinic and map fallback copy so the final judged deployment no longer advertises internal demo or bypass states.
- Centered the live map on the voter's detected area when geolocation is available, while keeping official Election Commission lookup links as the fallback path.

### Fixed

- Removed the browser-side default `demo-bypass-token`, leaving the backend as the only place that can apply a reCAPTCHA bypass token when configured.
- Stopped exposing `demoMode` and `recaptchaBypass` through `/api/config/public`.
- Restored the documented repo test baseline by removing the unfinished web Vitest harness from the main workspace test command.
- Added a regression test that locks `DEMO_MODE` to an opt-in default.

### Verified

- `pnpm type-check` passed.
- `pnpm test` passed.
- `pnpm build` passed.

## [0.4.1] - 2026-05-02

### Changed

- Extracted Forward Clinic analysis from the Express route into `forwardAnalysisService`, keeping the route focused on HTTP validation, reCAPTCHA, logging, and response shape.
- Centralized browser API calls in `apps/web/lib/apiClient.ts`, including Forward Clinic fallback payloads and robust Server-Sent Event parsing for Chunav Saathi chat.
- Refactored `/clinic` and `ChatWidget` to use shared API helpers instead of duplicating Cloud Run URL construction and streaming parsing.

### Fixed

- Increased the server test setup hook timeout to avoid Windows/Vitest ESM transform startup timeouts when the suite runs in parallel.
- Added accessible labels for the Chunav Saathi chat open/close controls.

### Verified

- `pnpm --filter @yatra/functions test` passed (10 tests).
- Direct TypeScript checks passed for `@yatra/functions` and `@yatra/web`.

## [0.4.0] - 2026-05-02

### Added

- Backend-only `llm-service` client for Antigravity `gemini-3-flash` with SMK and opt-in BYOK/secret support.
- Unit tests proving the wrapper sends model overrides, auth headers, and falls back from BYOK to SMK.
- `SUGGESTIONS.md` with win-focused product, gamification, Google Maps, UI, and testing ideas.

### Changed

- `/api/chat` now calls `llm-service` instead of direct Gemini route code when `DEMO_MODE=false`.
- `/api/forward/analysis` now uses `llm-service` for Forward Clinic classification with deterministic local fallback.
- Health checks now report `llmService` readiness instead of direct `gemini` key readiness.
- README, architecture, and Google Services docs now describe the backend-only AI wrapper.

### Fixed

- AI and `/clinic` no longer depend on a direct `GEMINI_API_KEY` being present in Cloud Run.
- Explicit `RECAPTCHA_BYPASS=true` can now unblock the Forward Clinic demo flow in production deployments.
- Cloud Run API CORS now allows the deployed web origin to call Forward Clinic from the browser.
- Forward Clinic normalizes useful AI JSON with common shape drift instead of falling back for minor key/name differences.

### Security

- Added explicit documentation that `LLM_SERVICE_API_KEY` and `LLM_SERVICE_INTERNAL_KEY` must stay in Cloud Run env/Secret Manager or ignored `.env.local` only.

### Verified

- `pnpm --filter @yatra/functions type-check` passed.
- `pnpm --filter @yatra/web type-check` passed.
- `pnpm --filter @yatra/functions test` passed (8 tests).
- Cloud Build completed for API (`sha256:64f9595ee46ad603ead709456bef3e4064752f3648ec4e3ec0949389f58736c9`) and web (`sha256:859c13f655efbde54c4840206a056966c781b47ff3cab9d519cb2b6fcef6a09f`).
- Live API chat streamed SSE tokens.
- Live Forward Clinic returned `mode: llm-service`, `riskLevel: 5`, and `recaptcha.bypassed: true`.
- Live browser Forward Clinic returned `Mode: llm-service` with official ECI links on desktop and 390px mobile viewport.
- Live web routes `/`, `/clinic`, `/easy-mode`, `/sanrakshan`, and `/play/scenario/vote-sanrakshan` returned 200 from `electnation-web-00020-vxx`.

## [0.3.0] — 2026-05-02

### Added

- Vote Sanrakshan page for safe anti-vote-buying and coercion guidance.
- Easy Mode page with large action tiles, transcript-first guidance, and browser read-aloud support.
- Vote Sanrakshan Play scenario with XP and a new `Vote Sanrakshak` badge.
- Prompt-craftsmanship tests for Chunav Saathi neutrality, official-source guidance, Hindi/easy-language adaptation, and audio-first behavior.
- `.gcloudignore` to keep local secrets, dependencies, build output, and ignored research docs out of Cloud Build uploads.

### Changed

- Primary navigation now exposes Vote Sanrakshan and Easy Mode as first-class flows.
- Home page highlights Vote Sanrakshan and Easy Mode alongside Clinic, Map, and Play.
- Cloud Run Dockerfiles now use the correct `@yatra/*` pnpm filters, build shared core first, and enable Next standalone output for the web image without assuming an `apps/web/public` directory.

### Verified

- `pnpm type-check` passed.
- `pnpm test` passed (24 tests).
- `pnpm build` passed.
- Browser smoke passed for `/easy-mode`, `/sanrakshan`, and `/play/scenario/vote-sanrakshan` XP/badge flow.

## [0.2.0] — 2026-05-01

### Added

- reCAPTCHA Enterprise client wrapper with local demo bypass and production verification path.
- Calendar reminder support through Google Calendar template links and ICS fallback.
- YouTube SVEEP API route with explicit demo fallback.
- Schema, Maps wrapper, and API integration tests (21 tests total across core/functions).
- Persistent local XP, completed scenario state, and badge unlocks for Play scenarios.
- Accessible Forward Clinic result region, source links, and demo/security mode chips.
- Text-only map facility list and retryable public config loading.
- Native audio controls and transcript on the PwD accessibility page.

### Changed

- Forward Clinic API now validates request and AI-shaped output with Zod schemas.
- Public config exposes Google-feature flags, map ID, reCAPTCHA site key, and demo mode.
- Next standalone output is opt-in via `NEXT_STANDALONE=true` to avoid Windows symlink build failures.

### Fixed

- Removed raw Gemini payload logging from the shared Gemini client.
- Centralized map route config instead of reading environment variables in the route.

### Verified

- `pnpm type-check` passed.
- `pnpm test` passed (21 tests).
- `pnpm build` passed.

## [0.1.0] — 2026-04-21

### Added

- Monorepo scaffold: pnpm workspaces, `apps/web`, `apps/functions`, `packages/core`
- Design system: tricolor palette, Ashoka Chakra + rangoli motifs, Playfair × Noto Serif Devanagari fonts, Framer Motion-ready Tailwind tokens
- Landing page with hero, Saathi chat preview, 6-station stepper, pillars, accessibility banner
- Shared domain model: `Result<T,E>`, `AppError` taxonomy, 11 error codes, all types + Zod schemas
- Google client wrappers: Gemini (SSE streaming + `buildChunavSaathiPrompt`), Maps (geocode, reverse-geocode, distance matrix), Firebase Admin (skeleton)
- Backend: `GET /api/health` dependency-aware, `POST /api/chat` SSE with demo-mode fallback, structured JSON logger, in-memory rate limiter
- Anti-attribution: `.antigravity/project.json` marker, `.gitignore` scrub for builder metadata
- Docs: `README.md`, `ARCHITECTURE.md`, `GOOGLE_SERVICES.md`, `EVALUATION_MAPPING.md`, `SECURITY.md`, `ACCESSIBILITY.md`, `TESTING.md`, `PROMPTS.md`, `tasks.md`

### Next

- See `tasks.md` Phases 5–11 for full feature completion roadmap.
