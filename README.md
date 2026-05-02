# Election Yatra — Janta ka Election Saathi

> **Version 0.5.1** — Google Civic Stack release with a typed service catalog, evaluator API, proof page, browser-tested evidence, and polished mobile navigation.

> **An AI companion for Indian voters.** Walk the 6-station yatra from
> registration to polling booth, spot WhatsApp misinformation, find your
> booth on the map, and learn through scenario-based play — all in your
> language.

Built with the **Google Antigravity** stack for the Hack2skill
_Google Prompt Wars_ hackathon (April 2026).

![Tricolor hero](./public/screenshots/hero.png)

---

## Highlights

| Axis                     | How Election Yatra delivers                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Novelty**              | First civic companion that blends Chunav Saathi (conversational AI) + Misinformation Clinic + gamified yatra + voice-first Easy Mode                                                                                                                                                                                                                                                                                                                               |
| **Google services used** | Typed Google Civic Stack catalog with 30+ services: llm-service with Antigravity Gemini (`gemini-3-flash`) · Maps/Places/Directions/Distance Matrix/Street View/Routes/Time Zone/Address Validation · Calendar · YouTube Data v3 · Cloud Text-to-Speech + Speech-to-Text · Cloud Translation · Firebase Auth + Firestore · reCAPTCHA Enterprise · Secret Manager · Cloud Logging/Monitoring/Trace · Cloud Run/Build/Scheduler/Tasks/Pub/Sub/Storage · BigQuery/GA4 |
| **Accessibility**        | WCAG-AA target · Easy Mode (audio-first) · 22 scheduled Indian language presets · read-aloud transcript flow · typed feature blueprints, user profiles, and assistive-tech evidence catalog                                                                                                                                                                                                                                                                        |
| **Security**             | Secret Manager · backend-only llm-service keys · reCAPTCHA Enterprise · origin-scoped demo bypass · prompt-injection boundaries · PII redaction · STRIDE-lite threat model                                                                                                                                                                                                                                                                                         |
| **Made in Bharat**       | Ethnic-modern "Democracy ka Tyohar" aesthetic — Ashoka Chakra, rangoli patterns, khadi palette, Playfair × Noto Serif Devanagari                                                                                                                                                                                                                                                                                                                                   |

---

## File Index / Monorepo Layout

```
election-yatra/
├── apps/
│   ├── web/           # Next.js 14 App Router + Tailwind + Framer Motion
│   └── functions/     # Express on Cloud Run — SSE streaming + APIs
├── packages/
│   └── core/          # Shared types, Zod schemas, Result, AppError, accessibility evidence, Google Civic Stack catalog/clients
├── .gcloudignore      # Cloud Build upload exclusions for secrets/artifacts
├── tasks.md           # Granular task tracker (phase-by-phase)
├── ARCHITECTURE.md    # Data flow + layering
├── GOOGLE_SERVICES.md # Service → file mapping
├── EVALUATION_MAPPING.md  # Rubric ↔ code mapping
├── SECURITY.md
├── ACCESSIBILITY.md
├── TESTING.md
├── PROMPTS.md         # Chunav Saathi prompt engineering
├── SUGGESTIONS.md     # Win-focused roadmap for maps, gamification, UI, tests
└── CHANGELOG.md
```

| Path                                                    | Purpose                                                                                                                                               | When to read                                       |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `apps/web/`                                             | Next.js voter-facing experience: Yatra, Clinic, Map, Play, Easy Mode                                                                                  | UI flow changes and browser testing                |
| `apps/web/app/google-services/page.tsx`                 | Evaluator-facing Google Civic Stack proof page with scorecards, service statuses, and voter-journey mapping                                           | Google Services rubric review                      |
| `apps/web/lib/apiClient.ts`                             | Shared browser API URL, JSON request, Forward Clinic fallback, and chat SSE helpers                                                                   | Any frontend API or streaming change               |
| `apps/functions/`                                       | Express API for Cloud Run: health, chat, clinic, maps, calendar, YouTube                                                                              | Backend route and deployment changes               |
| `apps/functions/src/routes/googleServices.ts`           | `/api/google/services` evidence route exposing service catalog, scorecard, journey, and runtime readiness without secret values                       | Google Services rubric review                      |
| `apps/functions/src/services/forwardAnalysisService.ts` | Forward Clinic domain logic: llm-service prompt, redaction, normalization, source filtering, local fallback, recommended action                       | Misinformation analysis behavior changes           |
| `apps/functions/src/services/privacyRedaction.ts`       | Server-side redaction of Aadhaar, EPIC, phone, email, PAN, and UPI-like values before AI calls                                                        | Security/privacy changes                           |
| `apps/functions/src/services/requestSecurity.ts`        | CORS origin checks and production-scoped reCAPTCHA bypass rules                                                                                       | API perimeter changes                              |
| `packages/core/`                                        | Shared schemas, types, Result/AppError helpers, accessibility evidence, Google wrappers, version constant                                             | Cross-app contracts and validation                 |
| `packages/core/src/accessibility.ts`                    | 22 scheduled-language TTS presets, Easy Mode transcript helpers, WCAG evidence catalog, feature blueprints, user profiles, assistive-tech test matrix | Accessibility, language, or judge-evidence changes |
| `packages/core/src/google/serviceCatalog.ts`            | Typed catalog of implemented, key-ready, and planned Google service integrations, fallback modes, env contracts, and judge proof points               | Google Services evidence and roadmap               |
| `tasks.md`                                              | Granular roadmap and code-quality hardening tracker                                                                                                   | Session planning and rubric progress               |
| `EVALUATION_MAPPING.md`                                 | Rubric axis to proof mapping                                                                                                                          | Before submission review                           |

## Local setup

Prerequisites: **Node ≥ 20**, **pnpm ≥ 9**.

```bash
cp .env.example .env.local        # fill what you need; set DEMO_MODE=true only for scripted local demo flows
pnpm install
pnpm dev                           # runs web (:3000) + functions (:8080) in parallel
```

### Demo mode

If `DEMO_MODE=true`, `/api/chat` streams a scripted Hinglish demo reply and
`/api/forward/analysis` uses deterministic local analysis so the UI and tests can
run without credentials. Production uses backend-only `llm-service` with
Antigravity `gemini-3-flash`; secrets stay in Cloud Run env/Secret Manager and
are never exposed through frontend config. `DEMO_MODE` now defaults to `false`
when unset, so production revisions do not silently fall back to demo behavior.

For the hackathon Cloud Run demo, `RECAPTCHA_BYPASS=true` is set on the API so
judges can exercise Forward Clinic without a site-key challenge from the official
web origin. `RECAPTCHA_BYPASS_ALLOWED_ORIGINS` must match the deployed web URL.
Turn bypass off after wiring a production reCAPTCHA site key.

### Smoke tests

```bash
curl http://localhost:8080/api/health
# → 200 {"status":"degraded","version":"0.5.1",...}

curl -N -X POST http://localhost:8080/api/chat \
  -H "content-type: application/json" \
  -d '{"locale":"en","literacyComfort":"standard","message":"How do I register to vote?"}'
# → SSE stream of Chunav Saathi reply
```

## Design notes

Election Yatra intentionally avoids generic AI-assistant aesthetics. The
visual language — **tricolor gradients, rangoli mandalas, paisley
borders, diya glow, khadi textures** — roots the product in Indian
civic culture. The 6-station stepper (_Register → Verify → Candidates →
Spot Fake → Poll Day → Reflect_) reflects the pilgrimage metaphor
announced in the tagline: _"Chalo, apna Bharat samajhte hain — ek
yatra, ek vote."_

## Stack

- **Frontend**: Next.js 14 (App Router), TypeScript strict, Tailwind CSS, Framer Motion
- **Backend**: Express 4 on Cloud Run, TypeScript, Zod validation
- **Shared**: pnpm workspaces, `@yatra/core` package
- **Google**: typed Google Civic Stack catalog · llm-service with Antigravity Gemini · Maps Platform · Calendar · YouTube · TTS · STT · Translation · Firebase · reCAPTCHA Enterprise · Secret Manager · Cloud Run/Build · Cloud Logging/Monitoring/Trace · BigQuery/GA4 scaffolds
- **Testing**: Vitest · Supertest · React Testing Library · Playwright · axe-core · direct TypeScript checks
- **DX**: TypeScript strict · Prettier · Cloud Build docs · planned ESLint/GitHub Actions · Antigravity workspace

## Non-partisan pledge

Election Yatra does **not** endorse any political party or candidate.
All authoritative information links to the
[Election Commission of India](https://eci.gov.in) and the
[National Voters' Services Portal](https://voters.eci.gov.in). Chunav
Saathi's system prompt explicitly refuses partisan content and returns
verified sources instead.

## License

MIT — see `LICENSE`.

---

_Built with_ ❤ _using Google Antigravity._
