# Election Yatra Agent Notes

## Read This First Before Deploying

If a task includes deployment, stop and follow the `Mandatory Google Cloud Deployment Workflow`
section in this file from top to bottom before inventing any commands.

Do not change the Cloud Run service names, GCP project, or region during deployment.
Do not report deployment complete until the post-deploy verification block in this file has passed.

Deployment is expected to take time on this repo because Cloud Build uploads the monorepo,
rebuilds two images, pushes them, creates new Cloud Run revisions, and then shifts traffic.
Typical full-release timing is roughly:

- 3 to 4 minutes for the API image build
- 3 to 5 minutes for the web image build
- 1 to 2 minutes per Cloud Run deploy
- around 10 to 15 minutes total for build, deploy, and verification

Always use this order:

1. Run local validation: `pnpm type-check`, `pnpm test`, `pnpm build`.
2. Run the exact Cloud Build commands from the deployment workflow below.
3. Deploy only `electnation-api` and `electnation-web` in `event-manager-promptwars` / `us-central1`.
4. Run the post-deploy verification commands from the same section.
5. Only then say the deployment is complete.

## Project Shape

- Monorepo root: `c:\Users\paras\code\hackathons\electnation`
- Workspaces: `apps/web`, `apps/functions`, `packages/core`
- Shared package must be built before dependent checks because `@yatra/core` exports from `dist`.

## Local Validation

Run from the repository root:

```powershell
pnpm type-check
pnpm test
pnpm build
```

Expected current baseline:

- `pnpm type-check` passes all workspaces.
- `pnpm test` passes core and functions tests.
- `pnpm build` builds core, functions, and Next.js web.

Focused Code Quality checks when iterating on the Clinic/chat slice:

```powershell
pnpm -C c:\Users\paras\code\hackathons\electnation --filter @yatra/functions test
pnpm -C c:\Users\paras\code\hackathons\electnation --filter @yatra/functions exec tsc --noEmit --pretty false
pnpm -C c:\Users\paras\code\hackathons\electnation --filter @yatra/web exec tsc --noEmit --pretty false
```

`apps/functions/src/server.test.ts` sets env vars before dynamic imports, so its
`beforeAll` hook intentionally has a 30s timeout. If the suite reports a 10s
hook timeout, check that this timeout was not removed before investigating app code.

## Local Dev Servers

Use explicit package names or `pnpm -C` to avoid PowerShell running from the Windows user profile:

```powershell
pnpm -C c:\Users\paras\code\hackathons\electnation --filter @yatra/functions dev
pnpm -C c:\Users\paras\code\hackathons\electnation --filter @yatra/web dev
```

- API: `http://localhost:8080`
- Web: `http://localhost:3000`

## Mandatory Google Cloud Deployment Workflow

Active GCloud project used for this repo: `event-manager-promptwars`.
Region: `us-central1`.
Cloud Run services:

- `electnation-api`
- `electnation-web`

Stable public URLs used for judging and smoke tests:

- Web: `https://electnation-web-767171449038.us-central1.run.app`
- API: `https://electnation-api-767171449038.us-central1.run.app`

Cloud Run may also show shorter `*.a.run.app` hostnames in `gcloud run services describe`,
but the URLs above stay stable as long as the same service names, project, and region are reused.
Always deploy to `electnation-api` and `electnation-web`; do not create new service names.

Deployment can take several minutes because Cloud Build uploads source, rebuilds the monorepo
Docker image, pushes it to Container Registry, creates a new Cloud Run revision, and shifts traffic.
Keep `.gcloudignore` small and correct so `node_modules`, `.next`, `dist`, ignored `docs/`, and
`.env*` files do not slow uploads or leak local material. This repo also excludes `gh.zip`
and `bin/gh.exe` from Cloud Build because they add roughly 60 MB and are not needed in images.

Build images with Cloud Build:

```powershell
gcloud builds submit c:\Users\paras\code\hackathons\electnation --config c:\Users\paras\code\hackathons\electnation\cloudbuild-api.yaml
gcloud builds submit c:\Users\paras\code\hackathons\electnation --config c:\Users\paras\code\hackathons\electnation\cloudbuild-web.yaml
```

Fastest safe full deployment sequence from any PowerShell terminal:

```powershell
pnpm -C c:\Users\paras\code\hackathons\electnation type-check
pnpm -C c:\Users\paras\code\hackathons\electnation test
pnpm -C c:\Users\paras\code\hackathons\electnation build

gcloud builds submit c:\Users\paras\code\hackathons\electnation --config c:\Users\paras\code\hackathons\electnation\cloudbuild-api.yaml --project event-manager-promptwars
gcloud builds submit c:\Users\paras\code\hackathons\electnation --config c:\Users\paras\code\hackathons\electnation\cloudbuild-web.yaml --project event-manager-promptwars

gcloud run deploy electnation-api --image gcr.io/event-manager-promptwars/electnation-api --region us-central1 --platform managed --allow-unauthenticated --project event-manager-promptwars
gcloud run deploy electnation-web --image gcr.io/event-manager-promptwars/electnation-web --region us-central1 --platform managed --allow-unauthenticated --project event-manager-promptwars

Invoke-RestMethod https://electnation-api-767171449038.us-central1.run.app/api/health | ConvertTo-Json -Depth 4
$origin = 'https://electnation-web-767171449038.us-central1.run.app'
Invoke-RestMethod https://electnation-api-767171449038.us-central1.run.app/api/forward/analysis -Method Post -Headers @{ Origin = $origin } -ContentType 'application/json' -Body '{"text":"Forwarded many times: EVM bluetooth hack means voting is rigged","locale":"en"}' | ConvertTo-Json -Depth 4
@('/','/easy-mode','/sanrakshan','/clinic','/play/scenario/vote-sanrakshan') | ForEach-Object {
	$url = "https://electnation-web-767171449038.us-central1.run.app$_"
	$response = Invoke-WebRequest $url -UseBasicParsing -TimeoutSec 30
	"$($_) $($response.StatusCode)"
}
```

Let each command finish. Do not interrupt Cloud Build or Cloud Run just because the step has been running for a few minutes.

Deploy images:

```powershell
gcloud run deploy electnation-api --image gcr.io/event-manager-promptwars/electnation-api --region us-central1 --platform managed --allow-unauthenticated
gcloud run deploy electnation-web --image gcr.io/event-manager-promptwars/electnation-web --region us-central1 --platform managed --allow-unauthenticated
```

Use explicit project flags when running from a fresh terminal:

```powershell
gcloud run deploy electnation-api --image gcr.io/event-manager-promptwars/electnation-api --region us-central1 --platform managed --allow-unauthenticated --project event-manager-promptwars
gcloud run deploy electnation-web --image gcr.io/event-manager-promptwars/electnation-web --region us-central1 --platform managed --allow-unauthenticated --project event-manager-promptwars
```

PowerShell gotcha: quote comma-separated Cloud Run env var lists and use the
`--flag="KEY=value,KEY2=value2"` form. Unquoted comma lists can be split before
they reach `gcloud`, leaving only the first env var on the revision.

Post-deploy verification:

```powershell
Invoke-RestMethod https://electnation-api-767171449038.us-central1.run.app/api/health | ConvertTo-Json -Depth 4
(Invoke-RestMethod https://electnation-api-767171449038.us-central1.run.app/api/google/services).scorecard | ConvertTo-Json -Depth 4
@('/','/easy-mode','/sanrakshan','/clinic','/play/scenario/vote-sanrakshan') | ForEach-Object {
	$url = "https://electnation-web-767171449038.us-central1.run.app$_"
	$response = Invoke-WebRequest $url -UseBasicParsing -TimeoutSec 30
	"$($_) $($response.StatusCode)"
}
```

## Backend AI Configuration

Election Yatra must call AI through backend-only `llm-service`, not from the browser
and not through direct provider SDK calls in route handlers.

Production settings:

- `ALLOWED_ORIGINS=https://electnation-web-767171449038.us-central1.run.app`
- `RECAPTCHA_BYPASS_ALLOWED_ORIGINS=https://electnation-web-767171449038.us-central1.run.app`
- `ALLOW_NO_ORIGIN_REQUESTS=false` unless a trusted server-to-server client needs no-Origin CORS headers.
- `LLM_SERVICE_URL=https://llm.lehana.in`
- `LLM_SERVICE_ENDPOINT=antigravity-manager`
- `LLM_SERVICE_MODEL=gemini-3-flash`
- `LLM_SERVICE_PROVIDER=custom`
- `LLM_SERVICE_PROVIDER_BASE_URL=https://antigravity.aidhunik.com/v1`
- `LLM_SERVICE_BYOK=false` for the working SMK path.
- `LLM_SERVICE_INTERNAL_KEY` must come from Cloud Run env/Secret Manager only.
- `LLM_SERVICE_API_KEY` is optional and should only be set when `/byok` auth is enabled.

Never expose `LLM_SERVICE_API_KEY` or `LLM_SERVICE_INTERNAL_KEY` through `NEXT_PUBLIC_*`,
`/api/config/public`, client components, screenshots, or committed docs. If local testing
needs real AI, put values in ignored `.env.local`.

Cloud Run secret wiring pattern:

```powershell
gcloud secrets create electnation-llm-service-key --replication-policy=automatic --project event-manager-promptwars
gcloud secrets versions add electnation-llm-service-key --data-file=- --project event-manager-promptwars
gcloud run services update electnation-api --region us-central1 --project event-manager-promptwars --set-env-vars="DEMO_MODE=false,RECAPTCHA_BYPASS=true,RECAPTCHA_BYPASS_ALLOWED_ORIGINS=https://electnation-web-767171449038.us-central1.run.app,ALLOWED_ORIGINS=https://electnation-web-767171449038.us-central1.run.app,ALLOW_NO_ORIGIN_REQUESTS=false,LLM_SERVICE_ENABLED=true,LLM_SERVICE_URL=https://llm.lehana.in,LLM_SERVICE_ENDPOINT=antigravity-manager,LLM_SERVICE_MODEL=gemini-3-flash,LLM_SERVICE_PROVIDER=custom,LLM_SERVICE_PROVIDER_BASE_URL=https://antigravity.aidhunik.com/v1,LLM_SERVICE_BYOK=false" --set-secrets LLM_SERVICE_INTERNAL_KEY=electnation-llm-service-key:latest
```

For the hackathon demo deployment, `/clinic` uses `RECAPTCHA_BYPASS=true` so judges
can test the AI analysis without a production site-key challenge from the official web origin. Do not remove the
reCAPTCHA route code; turn the bypass off when a live reCAPTCHA site key is wired.
`DEMO_MODE` is opt-in and should stay unset or explicitly `false` for production revisions.

## Gotchas

- `docs/` is intentionally gitignored for research and session logs.
- Google Services evidence lives in `packages/core/src/google/serviceCatalog.ts`, `GET /api/google/services`, and `/google-services`; keep statuses honest (`implemented`, `ready-with-key`, `planned`) when adding new Google APIs.
- Do not commit real `.env` secrets.
- AI keys are backend-only. Use Cloud Secret Manager or ignored `.env.local`.
- The web Dockerfile must set `NEXT_STANDALONE=true`; local Windows builds should not require standalone output.
- Avoid old pnpm filters like `web` or `functions`; use `@yatra/web` and `@yatra/functions`.
- When PowerShell cwd drifts to `C:\Users\paras`, use `pnpm -C c:\Users\paras\code\hackathons\electnation ...` or absolute paths.
- If a local Next.js build is interrupted and later fails with `PageNotFoundError: Cannot find module for page: /_document`, remove only the generated `apps\web\.next` folder and rerun the focused web type-check/build.
