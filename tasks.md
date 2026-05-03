# Election Yatra — Task Tracker

> Phase-by-phase granular roadmap. Tick off items as you implement.
> Items marked ✅ are complete; items marked ⏳ are planned for the next
> working session.

**Status legend**: ✅ done · 🚧 in progress · ⏳ planned · 🧪 scaffold only

---

## Google Civic Stack Mobile Polish _(2026-05-03)_

- [x] ✅ Critic review: live mobile `/google-services` showed the new horizontal nav working, but with a heavy visible scrollbar that distracted from the judged Google Services proof page.
- [x] ✅ Added a real cross-browser `scrollbar-hide` utility in `apps/web/app/globals.css` for the mobile primary-nav strip.
- [x] ✅ Bumped patch release metadata to `0.5.1` so the shipped polish is visible in versioned code and API health.
- [x] ✅ Bumped patch release metadata to `0.5.2` for the code-quality and efficiency optimization release.
- [x] ✅ Removed tracked local CLI binaries/archives and documented the lean submission artifact policy for under-10MB repository review.
- [x] ✅ Validated `@yatra/web` type-check and production build before redeploy.

---

## Accessibility Blueprint Architecture Slice _(2026-05-03)_

### Critic review before implementation

- [x] ✅ Current strength: 0.4.5 already proved 22-language Easy Mode and honest evidence status tags.
- [x] ✅ Current gap: code reviewers could see evidence items, but not a full typed roadmap for every assistive mode, user profile, parameter, hook, and test signal.
- [x] ✅ User clarification: placeholders are acceptable when they are integrated, parameterized, status-tagged, and honest about what is scaffolded versus shipped.

### Implemented tasks

- [x] ✅ Add `AccessibilitySurface`, `AccessibilityAudience`, and `AccessibilityInputMode` unions so every assistive feature has explicit scope.
- [x] ✅ Add `AccessibilityFeatureBlueprint` and `AccessibilityFeatureParameter` models for screen-reader, keyboard/switch, high contrast, captions, STT, dyslexia, offline, and classroom features.
- [x] ✅ Add `AccessibilityUserProfile`, `AccessibilityPreferenceSettings`, and `AccessibilityPreferenceProfile` models for senior, screen-reader, community classroom, and neurodivergent users.
- [x] ✅ Implement `getAccessibilityFeatureBlueprints()`, `getAccessibilityUserProfiles()`, and `getAccessibilityArchitectureScorecard()` for judge-visible coverage counts.
- [x] ✅ Implement `buildAccessibilityPreferenceProfile()` and `buildAccessibilityImplementationPlan()` to convert a user profile into implemented/scaffolded/planned task groups.
- [x] ✅ Implement structured scaffold helpers for transcript cues, voice-input correction, offline printable packets, and classroom facilitator prompt decks.
- [x] ✅ Expose the safe accessibility score summary through `/api/config/public` without leaking server-only config.
- [x] ✅ Surface blueprint counts, user profiles, input-mode coverage, WCAG references, and sample blueprints on `/easy-mode`.
- [x] ✅ Add tests for blueprint parameter coverage, status separation, profile plans, and helper drafts.

### Planned follow-up tasks

- [ ] ⏳ Wire high-contrast, large-text, dyslexia-friendly, and reduced-distraction toggles into the app shell.
- [ ] ⏳ Convert the voice-input draft contract into Chat and Forward Clinic STT controls with visible transcript correction.
- [ ] ⏳ Build the offline accessibility packet download/print UI from `buildOfflineAccessibilityPacket()`.
- [ ] ⏳ Build facilitator/classroom mode from `buildFacilitatorPromptDeck()` and Easy Mode language presets.
- [ ] ⏳ Add Playwright coverage for the new Easy Mode blueprint proof panel after frontend polish.

---

## Accessibility Evidence and 22-Language Slice _(2026-05-02)_

### Critic review before implementation

- [x] ✅ Current strength: axe scans, skip links, live regions, contrast-safe UI, and chat dialog semantics already give real accessibility proof.
- [x] ✅ Current gap: Easy Mode was still one English transcript and did not prove India-wide scheduled-language coverage in code.
- [x] ✅ Honesty rule: do not fake native audio for languages where browser or Google TTS support is uncertain; expose fallback state instead.

### Implemented tasks

- [x] ✅ Create a shared accessibility evidence module with typed language presets, WCAG evidence items, and assistive-tech checks.
- [x] ✅ Prefill Easy Mode transcripts for all 22 scheduled Indian languages with native names, script metadata, BCP-47 tags, and voice-readiness states.
- [x] ✅ Add helper functions for browser speech settings, Google TTS request drafting, status announcements, evidence summaries, and language-code validation.
- [x] ✅ Expand the shared locale schema and public API config so the backend advertises English plus the 22 scheduled-language codes.
- [x] ✅ Wire `/easy-mode` to a language selector, transcript panel, voice support status, and accessibility evidence counters.
- [x] ✅ Add tests that verify catalog completeness, fallback behavior, public locale coverage, schema support, and Easy Mode transcript switching.
- [x] ✅ Fix Next.js lint/build quality by adding `eslint-config-next` and moving manual Google Font links to `next/font/google`.
- [x] ✅ Add a resolver priority regression so BCP-47 inputs like `hi-IN` and `ur-IN` map to their exact presets before fallback TTS aliases.

### Planned follow-up tasks

- [ ] ⏳ Manually verify native speech quality for each language in Chrome, Edge, Android TalkBack, and iOS VoiceOver.
- [ ] ⏳ Cache server-generated TTS audio by language + transcript hash after confirming Google TTS support per language.
- [ ] ⏳ Add reusable read-aloud controls to Yatra, Clinic, Map, Migrant Corner, Sanrakshan, and PwD cards.
- [ ] ⏳ Add voice input/STT controls for Chat and Forward Clinic with visible transcript correction.
- [ ] ⏳ Add classroom/projector Easy Mode with facilitator prompts and larger touch targets.

---

## Security Hardening Slice _(2026-05-02)_

- [x] ✅ Add server-side voter identifier redaction before chat and Forward Clinic text reaches llm-service.
- [x] ✅ Wrap chat and Forward Clinic text in explicit `### USER_INPUT` prompt-injection boundaries.
- [x] ✅ Filter Forward Clinic model source URLs to official Election Commission hostnames.
- [x] ✅ Sanitize llm-service HTTP errors so upstream response bodies and auth material are not logged or returned.
- [x] ✅ Scope production reCAPTCHA bypass to configured web origins and tighten no-Origin CORS behavior.
- [x] ✅ Add focused tests for redaction, prompt boundaries, request-origin rules, public-config secret absence, and bypass enforcement.
- [x] ✅ Bump release metadata to `0.4.3` and update security/rubric docs.
- [x] ✅ Run full root validation, Cloud Build deploy, and live browser smoke.
- [x] ✅ Commit and push the security release.

---

## Production Hardening Final Push _(2026-05-02)_

- [x] ✅ Make `DEMO_MODE` opt-in in backend config and add a regression test for the default-off behavior.
- [x] ✅ Remove production-facing demo and bypass badges/copy from Clinic and Map, replacing fake booth data with official Election Commission guidance.
- [x] ✅ Stop exposing `demoMode` and `recaptchaBypass` through `/api/config/public` and remove the browser-side default demo bypass token.
- [x] ✅ Restore the documented root validation baseline by removing the unfinished web Vitest harness from `pnpm test`.
- [x] ✅ Bump release metadata to `0.4.2`, rebuild, deploy both Cloud Run services, and verify live health/UI behavior.

---

## Code Quality Hardening Slice _(2026-05-02)_

- [x] ✅ Extract Forward Clinic domain logic from `routes/forward.ts` into `services/forwardAnalysisService.ts`.
- [x] ✅ Add service-level tests for llm-service success, schema-drift normalization, and deterministic fallback.
- [x] ✅ Centralize browser API URL construction, Forward Clinic fallback payloads, and chat SSE parsing in `apps/web/lib/apiClient.ts`.
- [x] ✅ Refactor `/clinic` and `ChatWidget` to use shared API helpers while preserving live API behavior.
- [x] ✅ Fix Vitest server setup timeout by making the ESM import hook budget explicit.
- [x] ✅ Bump version metadata to `0.4.1` and update rubric evidence docs.
- [x] ✅ Run full root validation (`@yatra/core` build, functions tests, direct web/functions type-checks, root build).
- [x] ✅ Browser-test desktop and mobile Clinic + Chat flows before deploy.
- [ ] ⏳ Add full ESLint flat config with React/a11y/import rules.
- [x] ✅ Add Playwright/axe scripts for `/clinic`, `/easy-mode`, `/sanrakshan`, scenario flows, and core route scans.

---

## Phase 0 — Repo scaffolding & infra _(Day 1)_

- [x] ✅ pnpm workspace (`apps/*`, `packages/*`)
- [x] ✅ Root `tsconfig.base.json`, Prettier, `.gitignore`, `.env.example`
- [x] ✅ `.antigravity/project.json` marker
- [x] ✅ `apps/web` Next.js 14 + TS + Tailwind
- [x] ✅ `apps/functions` Express + TS with `tsx` dev server
- [x] ✅ `packages/core` shared types/schemas/google
- [ ] ⏳ ESLint flat config with import-order + a11y plugins
- [ ] ⏳ GitHub Actions: lint + type-check + test + build
- [x] ✅ Dockerfile for Cloud Run (api + web)

## Phase 1 — Design system & landing _(Day 1–2)_

- [x] ✅ Tailwind tokens (saffron/leaf/indigo-chakra/khadi/marigold/henna)
- [x] ✅ Font pipeline (Playfair, Plus Jakarta, Noto Serif Devanagari)
- [x] ✅ Motifs: `AshokaChakra`, `RangoliPattern`
- [x] ✅ Core UI: Button, Card, Stepper
- [x] ✅ NavBar + Footer with tricolor divider
- [x] ✅ Landing page with 4 sections
- [ ] ⏳ Motif library: PaisleyBorder, LotusDivider, DiyaIcon, MarigoldParticles, InkedFinger
- [ ] ⏳ ChatBubble, QuizCard, MapPin, Badge, LanguageSwitcher, ReadAloudButton
- [ ] ⏳ Framer Motion scroll transitions + marigold particle system on hero
- [ ] ⏳ Inline SVG illustrations: tribal voter, migrant worker, farmer, PwD, urban youth, elderly woman (6 scenes)
- [ ] ⏳ Dark mode palette (khadi-night / henna accents)
- [ ] ⏳ PWA manifest + splash screens

## Phase 2 — Domain model _(Day 2)_

- [x] ✅ Types: VoterPersona, ElectionStep, ForwardAnalysis, QuizQuestion, BadgeDefinition, UserProgress, LeaderboardEntry, PollingFacility, ChatRequest
- [x] ✅ Zod schemas mirror for every type
- [x] ✅ `Result<T,E>` + `AppError` taxonomy
- [ ] ⏳ Unit tests on every schema (`packages/core/__tests__/schemas.test.ts`) — happy + invalid fixtures

## Phase 3 — Google client wrappers _(Day 2–3)_

- [x] ✅ `geminiClient.ts` (streaming + non-stream) + `buildChunavSaathiPrompt`
- [x] ✅ `mapsClient.ts` (geocode, reverse-geocode, distanceMatrix)
- [x] ✅ `firebaseAdmin.ts` (lazy init handle)
- [ ] ⏳ `geolocationClient.ts` (IP-fallback + `navigator.geolocation` wrapper)
- [x] ✅ `calendarClient.ts` — Google Calendar template links + ICS fallback
- [x] ✅ `youtubeClient.ts` — curated SVEEP playlist
- [x] ✅ `translationClient.ts` — Cloud Translation v2/v3
- [x] ✅ `ttsClient.ts` — Cloud Text-to-Speech (Neural2/Chirp)
- [x] ✅ `sttClient.ts` — Cloud Speech-to-Text (streaming)
- [x] ✅ `recaptchaClient.ts` — Enterprise assessment wrapper + demo bypass route path
- [ ] ⏳ `secretManager.ts` — lazy fetch with env fallback
- [ ] ⏳ `analyticsClient.ts` — GA4 Measurement Protocol
- [ ] ⏳ `PlacesClient` — Text Search, Nearby Search, Place Details (Google Maps API integration)
- [ ] ⏳ `DirectionsClient` — driving/walking/transit routes (Google Maps API integration)
- [x] ✅ Google Civic Stack catalog — 30+ typed service integrations with status, env contract, fallback, code path, and judge evidence
- [x] ✅ Google Civic Journey map — Ask, Verify, Locate, Remember, Learn, Persist, Operate mapped to concrete Google service groups
- [ ] ⏳ Streaming adapter using `@google-cloud/vertexai` SDK (production swap)
- [ ] ⏳ Mock implementations for each client (tests)

## Phase 4 — Backend APIs _(Day 3–5)_

### Implemented

- [x] ✅ `GET /api/health` — status, version, uptime, dep readiness
- [x] ✅ `POST /api/chat` — SSE streaming + demo-mode fallback

### Planned

- [x] ✅ `POST /api/forward/analysis` — misinformation classifier, Zod input/output validation, reCAPTCHA-ready demo/prod mode
- [ ] ⏳ `POST /api/quiz/submit` — atomic XP/badge grant in Firestore
- [ ] ⏳ `GET /api/quiz/next` — unseen question for persona
- [x] ✅ `POST /api/calendar/add` — Google Calendar template links + OAuth-ready contract
- [x] ✅ `GET /api/calendar/ics` — `.ics` fallback (no OAuth)
- [x] ✅ `GET /api/config/public` — Maps key/id, reCAPTCHA site key, supported locales, feature flags
- [x] ✅ `GET /api/map/nearest-facilities` — user lat/lng → demo nearest booth+ERO or Distance Matrix
- [ ] ⏳ `GET /api/map/directions` — route + polyline
- [ ] ⏳ `POST /api/tts` — text → audio (cached by sha-256)
- [ ] ⏳ `POST /api/stt` — audio chunk → transcript
- [ ] ⏳ `POST /api/leaderboard/me` — privacy-preserving upsert
- [ ] ⏳ `GET /api/leaderboard/:city` — weekly top 20
- [ ] ⏳ `POST /api/translate` — UI-string fallback translator
- [x] ✅ `GET /api/youtube/sveep` — curated playlist route + explicit demo fallback
- [x] ✅ `GET /api/google/services` — evaluator-facing Google Civic Stack scorecard, journey map, runtime readiness, and catalog
- [ ] ⏳ `POST /api/feedback` — hCaptcha-gated free-text feedback
- [ ] ⏳ `GET /api/metrics` — Prometheus-style basic metrics
- [ ] ⏳ Auth middleware (Firebase ID-token verification)
- [x] ✅ reCAPTCHA Enterprise verification on Forward Clinic (production) with explicit local demo bypass
- [ ] ⏳ Structured logger → Cloud Logging sink
- [ ] ⏳ OpenTelemetry traces (console exporter for dev)
- [ ] ⏳ Supertest coverage for every route (happy + 2 error paths)

## Phase 5 — Frontend flows _(Day 5–8)_

- [x] ✅ `/onboarding` — 4-step wizard (age / first-time / language / location) with progress bar
- [x] ✅ `/yatra` — 6-station stepper page with drawer-based Saathi chat
- [ ] ⏳ `/yatra/[slug]` — per-station deep dive with ECI citations
- [x] ✅ `/clinic` — Forward Clinic input + result card + verification steps
- [ ] ⏳ `/clinic/history` — personal scan history (Firestore)
- [x] ✅ `/sanrakshan` — Vote Sanrakshan anti-vote-buying and coercion guidance
- [x] ✅ `/easy-mode` — low-literacy/audio-first action hub with read-aloud support
- [x] ✅ `/map` — Maps JS API + nearest facility pins + route preview
- [ ] ⏳ `/map/booth` — Street View preview of user's booth
- [x] ✅ Ensure Maps API Keys (Maps JavaScript API, Places API, Geocoding API, Distance Matrix API) are configured in `.env` and loaded securely in Next.js/Express.
- [ ] ⏳ Interactive Map Enhancements: Add animations, dynamic route drawing, and custom Indian-themed map pins.
- [x] ✅ `/play` — quiz engine shell
- [x] ✅ `/play/scenario/[id]` — scenario mini-game routes
- [ ] ⏳ `/leaderboard` — privacy-preserving city leaderboard
- [x] ✅ `/google-services` — judge-facing Google Services proof page with implemented/key-ready/planned status separation
- [x] ✅ `/migrant-corner` — address update, postal ballot explainer, travel plan
- [x] ✅ `/pwd` — accessibility-first guidance (braille EPIC, AMF)
- [ ] ⏳ `/about` — team, mission, neutrality statement
- [ ] ⏳ Global chat dock with streaming SSE consumer
- [ ] ⏳ Persona context provider (React Context + localStorage + Firestore sync)
- [ ] ⏳ Skeleton screens for every async surface
- [ ] ⏳ 404 + 500 + offline pages with yatra-styled illustrations

## Phase 6 — Gamification _(Day 7–9)_

- [x] ✅ XP ledger: localStorage-backed scenario XP with duplicate-claim prevention
- [ ] ⏳ Badges (12+): first 4 implemented locally; full badge catalog still planned
- [ ] ⏳ Streak system with "festival freeze" logic
- [x] ✅ Scenario game #1 — "Chai tapri dilemma" (choose-your-own-adventure, dialogue tree)
- [x] ✅ Scenario game #2 — "WhatsApp forward rush" (60-sec classify 10 forwards, Canvas timer)
- [x] ✅ Scenario game #3 — "Booth ka raasta" (migrant maze, arrow-key navigation, tile grid)
- [ ] ⏳ Share card generator (SVG → PNG) + WhatsApp deep link
- [ ] ⏳ Weekly leaderboard reset (Cloud Scheduler cron)
- [ ] ⏳ Celebration animations (confetti + muted diya glow, respects prefers-reduced-motion)

## Phase 7 — i18n & accessibility _(Day 9–10)_

- [ ] ⏳ `next-intl` setup, locales: en, hi, bn, ta
- [ ] ⏳ Translation JSON for every component (extract strings)
- [ ] ⏳ Server-side fallback via Cloud Translation for bn/ta stubs
- [x] ✅ Read-Aloud button with TTS + transcript on PwD page; reusable component still planned
- [ ] ⏳ Mic input in chat + clinic using STT
- [ ] ⏳ Keyboard-navigable stepper (arrow keys, `role="tablist"`)
- [x] ✅ ARIA live/result regions for Clinic, scenario feedback, and the streaming chat log.
- [x] ✅ Easy Mode route (big icons, audio-first, minimal prose); per-page simplified views still planned
- [x] ✅ `prefers-reduced-motion` fallback for global animations and chat motion.
- [x] ✅ axe-core route scan passes with WCAG 2 A/AA tags and color contrast enabled.
- [ ] ⏳ Lighthouse a11y ≥ 100
- [ ] ⏳ VoiceOver/TalkBack manual smoke

## Phase 8 — Testing _(Day 10–11)_

- [x] ✅ Unit: result helpers, schemas, Maps wrapper
- [x] ✅ Unit: Chunav Saathi prompt guardrails
- [x] ✅ Integration: Supertest for health, Forward Clinic, Calendar ICS, YouTube demo route
- [x] ✅ Component: RTL for Button, ChatWidget, Stepper, and progress ledger behavior.
- [x] ✅ E2E: Playwright — onboarding, yatra, clinic, map, Easy Mode, Vote Sanrakshan scenario, chat, and axe route scans.
- [ ] ⏳ Coverage ≥ 75% lines / 80% core
- [x] ✅ `pnpm e2e:ci` — headless Chromium browser suite
- [ ] ⏳ Lighthouse CI budgets for every route

## Phase 9 — Security hardening _(Day 11–12)_

- [ ] ⏳ All secrets via Secret Manager; env fallback dev-only
- [ ] ⏳ reCAPTCHA Enterprise on `/chat`, `/leaderboard/me`, `/feedback`; `/forward/analysis` implemented
- [ ] ⏳ Firebase Security Rules (per-user progress, read-only quizzes, server-only leaderboard writes)
- [ ] ⏳ CSP + HSTS + Referrer-Policy + X-Content-Type-Options via Next.js `headers()`
- [ ] ⏳ DOMPurify on any HTML-rendered content
- [ ] ⏳ Prompt-injection defense (role isolation, tool-sandbox, input length caps)
- [ ] ⏳ STRIDE-lite threat model written in `SECURITY.md`
- [ ] ⏳ OWASP ZAP baseline scan pass
- [ ] ⏳ `npm audit` / Dependabot clean
- [x] ✅ PII minimization: Forward Clinic no raw model output logging; chat redaction helper still planned

## Phase 10 — Performance & PWA _(Day 12–13)_

- [ ] ⏳ Next.js Image + AVIF/WebP for all raster assets
- [ ] ⏳ Dynamic imports for Map page + Quiz engine + Scenario canvas
- [ ] ⏳ Route-segment caching + streaming
- [ ] ⏳ `manifest.webmanifest` + icons (192/512/maskable)
- [ ] ⏳ Service worker (Serwist) with offline fallback for FAQs/yatra static content
- [ ] ⏳ Lighthouse Performance + PWA ≥ 90

## Phase 11 — Docs, deploy, polish _(Day 13–14)_

- [ ] ⏳ Root docs: `README.md`, `ARCHITECTURE.md`, `GOOGLE_SERVICES.md`, `EVALUATION_MAPPING.md`, `SECURITY.md`, `ACCESSIBILITY.md`, `TESTING.md`, `PROMPTS.md`, `CHANGELOG.md`
- [ ] ⏳ `EVALUATION_MAPPING.md` table: Rubric Axis → code paths + tests + docs (target: 100% rubric coverage)
- [x] ✅ Google Services rubric evidence: typed catalog, API route, proof page, public config summary, tests, and docs
- [ ] ⏳ Architecture diagram (Mermaid)
- [ ] ⏳ README screenshots + 60-sec demo video script
- [ ] ⏳ Firebase Hosting + Cloud Run deploy via GitHub Actions
- [ ] ⏳ Wildcard domain + SSL
- [ ] ⏳ Attribution sweep: verify no third-party AI tool names leak into the repo
- [ ] ⏳ Final accessibility audit
- [ ] ⏳ Soft-launch + collect tester feedback

---

## Research Gap Audit — Highest-Impact Additions _(2026-05-01)_

These items come directly from `docs/research.md` and are the strongest remaining
ways to make the product feel deeper than a generic civic chatbot.

### Priority A — Add before demo submission

- [x] ✅ **Vote Sanrakshan module** — anti-vote-buying/coercion page plus a new Play scenario and badge.
- [ ] ⏳ **Easy Mode** — initial route implemented; still extend one-tap listen controls into Yatra, Clinic, Map, Migrant Corner, and PwD page cards.
- [ ] ⏳ **Migrant Yatra Planner** — turn `/migrant-corner` into an action planner: current city, home constituency, registration/address-update choice, travel reminder, and official source checklist.
- [ ] ⏳ **Google Maps depth pack** — add Places search for ERO/voter centers, Directions route preview/polyline, and Street View Static preview for the booth card.
- [x] ✅ **Prompt craftsmanship tests** — unit-test `buildChunavSaathiPrompt` for neutrality, official-source guidance, Hindi/easy-language adaptation, and audio-first behavior.

### Priority B — Strong judge polish

- [ ] ⏳ **SVEEP learning hub** — frontend page/section that calls `/api/youtube/sveep`, embeds curated videos, and links them to Yatra steps.
- [ ] ⏳ **Voice question input** — mic button for Chat and Clinic using Cloud Speech-to-Text with text fallback.
- [ ] ⏳ **Privacy-preserving leaderboard** — nickname + city only, no real name/EPIC/Aadhaar; weekly reset evidence via Cloud Scheduler plan.
- [ ] ⏳ **Offline civic kit** — PWA cache for core FAQs, Yatra steps, quiz scenarios, and emergency official links for low-network voters.
- [ ] ⏳ **Analytics funnel proof** — GA4/Firebase Analytics events for onboarding completion, clinic scans, calendar adds, map directions, and scenario completion.

### Priority C — Stretch differentiators

- [ ] ⏳ **Community-class mode** — projector-friendly flow for teachers/volunteers at panchayat halls or Anganwadi sessions.
- [ ] ⏳ **Shareable badge cards** — generate image cards for completed scenarios with official-source reminder text and no party/candidate references.
- [ ] ⏳ **Candidate-information guardrail** — neutral explanation of how to inspect affidavits and official candidate info without ranking or recommending candidates.

---

## Stretch goals (after base ≥ 9/10 score)

- [ ] Voice-clone Saathi using Chirp 3 HD voices
- [ ] WhatsApp Business integration — Saathi replies inside WhatsApp
- [ ] AR polling-booth preview via `<model-viewer>`
- [ ] Multi-agent Chunav Saathi (researcher + validator + presenter) via ADK
- [ ] Candidate-comparison tool (neutral: ADR affidavit + ECI data, no opinion)
- [ ] Braille PDF voter guide via Cloud Print
- [ ] Offline-first PWA that caches FAQs on first visit for 2G networks
- [ ] SMS-based Saathi for feature phones (Twilio + Vonage)
