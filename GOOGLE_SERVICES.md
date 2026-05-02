# Google Services Used

Election Yatra now treats Google Services as an inspectable product layer, not a
marketing checklist. The canonical source is
`packages/core/src/google/serviceCatalog.ts`, which records each service's user
value, implementation status, code paths, API surfaces, env vars, fallback mode,
and next step. The running API exposes the same evidence at
`GET /api/google/services`, and the web app renders it at `/google-services`.

## Evidence endpoints

| Surface                                     | Purpose                                                                | Safety note                                              |
| ------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------- |
| `GET /api/google/services`                  | Returns scorecard, journey map, service catalog, and runtime readiness | Exposes env var names only, never secret values          |
| `GET /api/config/public` → `googleServices` | Compact public scorecard for UI use                                    | Count-only summary                                       |
| `/google-services`                          | Judge-facing service proof page                                        | Labels unkeyed integrations as ready-with-key or planned |

## Scorecard in 0.5.0

| Metric               | Target                                                 |
| -------------------- | ------------------------------------------------------ |
| Google service slots | 30+                                                    |
| Implemented paths    | 12+                                                    |
| Product families     | 25+                                                    |
| Civic journey phases | Ask, Verify, Locate, Remember, Learn, Persist, Operate |

Status labels:

- `implemented` — code path is present and validated with tests or browser smoke.
- `ready-with-key` — adapter/contract is present or intentionally scaffolded, waiting for credentials/data.
- `planned` — service has an explicit slot, env contract, fallback, and next implementation step.

| #   | Google service                       | Purpose in Election Yatra                                                                                           | Code entry point                                                                                                               |
| --- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **llm-service + Antigravity Gemini** | Chunav Saathi conversational chat and Forward Clinic classification via backend-only wrapper using `gemini-3-flash` | `apps/functions/src/services/llmServiceClient.ts`, `apps/functions/src/routes/chat.ts`, `apps/functions/src/routes/forward.ts` |
| 2   | **Google Maps JavaScript API**       | Booth/ERO map, Street View preview of polling booths                                                                | `apps/web/app/map/*`                                                                                                           |
| 3   | **Geocoding API**                    | Address → lat/lng for onboarding & booth lookup                                                                     | `packages/core/src/google/mapsClient.ts`                                                                                       |
| 4   | **Places API (New)**                 | Nearest polling station, ERO office, BLO help desk, accessibility facilities, public transport landmarks            | `packages/core/src/google/mapsClient.ts` → planned `PlacesClient`                                                              |
| 5   | **Distance Matrix API**              | Travel time estimate to booth                                                                                       | `packages/core/src/google/mapsClient.ts#distanceMatrix`                                                                        |
| 6   | **Directions API**                   | Route polyline with walking / transit / driving modes and accessible route hints                                    | planned `DirectionsClient`                                                                                                     |
| 7   | **Street View Static API**           | Preview image of user's polling booth or nearby landmark for confidence before poll day                             | planned                                                                                                                        |
| 8   | **Google Calendar API**              | Add registration-deadline / poll-day reminders via OAuth-ready template links and ICS fallback                      | `packages/core/src/google/calendarClient.ts`, `apps/functions/src/routes/calendar.ts`                                          |
| 9   | **YouTube Data API v3**              | Curated SVEEP educational playlist (non-partisan) with demo fallback                                                | `packages/core/src/google/youtubeClient.ts`, `apps/functions/src/routes/youtube.ts`                                            |
| 10  | **Cloud Text-to-Speech**             | ✅ Read-aloud on content cards (Neural2 / Chirp)                                                                    | `apps/functions/src/routes/tts.ts` + `/api/tts`                                                                                |
| 11  | **Cloud Speech-to-Text**             | 🧱 Mic input interface (stubs)                                                                                      | planned `STTClient`                                                                                                            |
| 12  | **Cloud Translation API v3**         | ✅ UI fallback + Chunav Saathi reply localization                                                                   | `apps/functions/src/routes/translate.ts` + `/api/translate`                                                                    |
| 13  | **Firebase Authentication**          | Optional login for progress sync + calendar consent                                                                 | planned                                                                                                                        |
| 14  | **Firestore**                        | User progress, quiz answers, forward-clinic history, leaderboard                                                    | `packages/core/src/google/firebaseAdmin.ts`                                                                                    |
| 15  | **Firebase Hosting**                 | Static Next.js deploy alongside Cloud Run backend                                                                   | planned (CI)                                                                                                                   |
| 16  | **reCAPTCHA Enterprise**             | Abuse protection on Forward Clinic with production verification and local demo bypass                               | `packages/core/src/google/recaptchaClient.ts`, `apps/functions/src/routes/forward.ts`                                          |
| 17  | **Secret Manager**                   | ✅ Secure API key storage (Gemini/Maps/Calendar)                                                                    | Cloud Run Config → `process.env`                                                                                               |
| 18  | **Cloud Logging**                    | ✅ Structured JSON logs sink                                                                                        | `apps/functions/src/middleware/logger.ts`                                                                                      |
| 19  | **Cloud Run**                        | ✅ Backend container runtime                                                                                        | `cloudbuild-api.yaml` + `cloudbuild-web.yaml`                                                                                  |
| 20  | **Google Cloud Scheduler**           | Weekly leaderboard rollover job                                                                                     | planned                                                                                                                        |
| 21  | **Google Analytics 4**               | Anonymous usage analytics                                                                                           | planned `analyticsClient`                                                                                                      |
| 22  | **Routes API**                       | Future multimodal route compute with field masks                                                                    | `packages/core/src/google/serviceCatalog.ts`                                                                                   |
| 23  | **Time Zone API**                    | Future poll-reminder timezone resolution for migrant flows                                                          | `packages/core/src/google/serviceCatalog.ts`                                                                                   |
| 24  | **Address Validation API**           | Future migrant address cleanup before Form 8 guidance                                                               | `packages/core/src/google/serviceCatalog.ts`                                                                                   |
| 25  | **Cloud Build**                      | Reproducible API/web container builds                                                                               | `cloudbuild-api.yaml`, `cloudbuild-web.yaml`                                                                                   |
| 26  | **Cloud Monitoring**                 | Future uptime checks backed by `/api/health`                                                                        | `apps/functions/src/routes/health.ts`                                                                                          |
| 27  | **Error Reporting**                  | Future grouped production exception tracking                                                                        | `apps/functions/src/middleware/logger.ts`                                                                                      |
| 28  | **Cloud Trace**                      | Future AI/map latency tracing                                                                                       | `packages/core/src/google/serviceCatalog.ts`                                                                                   |
| 29  | **Pub/Sub**                          | Future async civic event processing                                                                                 | `packages/core/src/google/serviceCatalog.ts`                                                                                   |
| 30  | **Cloud Tasks**                      | Future deferred share-card/audio/report jobs                                                                        | `packages/core/src/google/serviceCatalog.ts`                                                                                   |
| 31  | **Cloud Storage**                    | Future generated civic media/offline packet storage                                                                 | `packages/core/src/google/serviceCatalog.ts`                                                                                   |
| 32  | **BigQuery**                         | Future privacy-safe impact analytics warehouse                                                                      | `packages/core/src/google/serviceCatalog.ts`                                                                                   |

## High-impact Google additions to consider next

- **Geolocation API + Places Nearby Search**: one-tap "find help near me" flow for ERO/BLO offices, polling help desks, police stations, hospitals, bus stands, railway stations, and accessible facilities.
- **Routes API / Directions API**: multimodal booth route cards with walking, transit, driving, travel time, and "leave by" reminders.
- **Geocoding + Address Validation**: cleaner address entry for migrant voters and first-time users who only know locality names.
- **Street View Static API**: landmark preview cards so low-literacy users can recognize the booth area before election day.
- **Maps Static API share cards**: lightweight booth/help-location cards that can be shared on WhatsApp without loading the full map UI.
- **Places Details**: phone, opening hours, and official website fields for nearby election offices where available.
- **Cloud Translation + Speech-to-Text**: voice question input in Hindi/regional languages, then translate before sending to Chunav Saathi.
- **Firestore + Firebase Auth**: cross-device XP, badges, class progress, and teacher/community facilitator dashboards.

> **Demo-mode rule**: when credentials are absent, user-facing routes return explicit
> `mode: "demo"` or `mode: "fallback"` payloads. This keeps the prototype runnable
> for judges while making production integration points visible and honest.
