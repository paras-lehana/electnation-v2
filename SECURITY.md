# Security

## Threat model (STRIDE-lite)

| Threat | Surface | Mitigation |
| --- | --- | --- |
| **S**poofing | `/api/leaderboard/me` | Firebase Auth ID-token verification; nickname regex allow-list |
| **T**ampering | `/api/forward/analysis` payload | Zod request schema + Zod output schema + 32 KB JSON body cap + reCAPTCHA Enterprise wrapper |
| **R**epudiation | Public API activity | Structured JSON logs record route metadata, latency, risk score, and redaction counts without raw user text |
| **I**nformation disclosure | Chat and Forward Clinic LLM calls | Aadhaar, EPIC, phone, email, PAN, and UPI-like values are redacted before llm-service calls |
| **D**enial of service | Public API routes | In-memory token bucket rate limiter + small request body cap |
| **E**levation | Browser-to-backend trust boundary | Backend-only llm-service keys, public-config allow-list, CORS allow-list, production-scoped demo reCAPTCHA bypass |

## Prompt injection defense

- System prompt isolated via role tagging; chat and Forward Clinic user text is wrapped between `### USER_INPUT` and `### END_USER_INPUT` by `apps/functions/src/services/promptBoundary.ts`.
- Chat input is capped at 2 KB and Forward Clinic input at 4 KB through shared Zod schemas.
- `buildChunavSaathiPrompt()` explicitly tells the model not to follow role-change, policy-change, or output-format override attempts inside user text.
- Forward Clinic uses JSON mode plus `ForwardAnalysisSchema` normalization; model-provided source URLs are filtered to official ECI hostnames.
- LLM upstream errors are sanitized before logs or fallback metadata so provider response bodies and auth material are not echoed.

## Secret management

All credentials live in Google Secret Manager; the app bootstraps via
workload identity on Cloud Run. Local dev uses `.env.local` (gitignored)
with `.env.example` as the schema-of-record.

Local demo can run with `RECAPTCHA_BYPASS=true`; production demo deployments scope that bypass to `RECAPTCHA_BYPASS_ALLOWED_ORIGINS` so only the official Cloud Run web origin can trigger it. A full production launch should set `RECAPTCHA_BYPASS=false` and provide `RECAPTCHA_PROJECT_ID`, `RECAPTCHA_SITE_KEY`, and `RECAPTCHA_API_KEY`.

## Implemented controls

- Public API rate limit via `apps/functions/src/middleware/rateLimit.ts`.
- Forward Clinic validates both inbound payload and outbound AI-shaped JSON.
- Forward Clinic logs only metadata: mode, category, risk, input length, latency, bypass flag, and redaction categories/counts.
- `apps/functions/src/services/privacyRedaction.ts` removes common voter identifiers before AI calls and before the Forward Clinic response stores `inputText`.
- `apps/functions/src/services/requestSecurity.ts` centralizes CORS and production reCAPTCHA-bypass origin checks.
- reCAPTCHA Enterprise client wrapper is dependency-injected and testable.
- Calendar reminders have a no-OAuth ICS fallback for demo reliability.

## Transport

- HTTPS through Cloud Run TLS.
- Helmet security headers on the API, including HSTS and an API-appropriate CSP with `default-src 'none'` and `frame-ancestors 'none'`.
- CORS reflects only configured origins; no-origin CORS headers are disabled by default in production unless `ALLOW_NO_ORIGIN_REQUESTS=true` is explicitly set.

## Data minimization

- Aadhaar, EPIC, phone, email, PAN, and UPI-like values are redacted before AI calls.
- Forward Clinic returns the redacted `inputText`, not the raw identifier-bearing text.
- The app avoids raw user-message logging; logs use length, category, risk, and redaction metadata.
- Public config returns only browser-safe keys (`mapsApiKey`, `mapsMapId`, `recaptchaSiteKey`, locales, feature flags), never llm-service keys.
