# Election Yatra Suggestions

Purpose: win-focused backlog for improving Election Yatra beyond the current deployed MVP.

## Priority 1 - Google Maps Depth Pack

**Issue**: The map flow proves Maps and Distance Matrix, but judges will notice if it does not feel like a complete voter logistics assistant.

**Plan**:

- Add one-tap geolocation for "near me" civic help.
- Use Places Nearby Search for ERO/BLO offices, polling help desks, public transport, hospitals, police stations, and accessible facilities.
- Use Directions or Routes API for walking, transit, and driving route cards.
- Add Street View Static preview or nearby landmark cards for booth confidence.
- Add Maps Static share cards for WhatsApp-friendly location guidance.

**Why it helps win**: It turns the map from a proof point into a real poll-day utility.

## Priority 2 - Gamified Civic Quest

**Issue**: Current XP and badges work, but the game loop can be more memorable.

**Plan**:

- Add daily civic quests: verify a forward, complete a yatra step, help a first-time voter, learn one right.
- Add streaks, badge collections, district leaderboard, and classroom/team mode.
- Add a Democracy Passport with stamp art for each completed station.
- Add timed misinformation drills with safe explanations after each answer.

**Why it helps win**: Judges remember products that feel alive, replayable, and teach through action.

## Priority 3 - Migrant Voter Planner

**Issue**: Research identified migrants as a high-friction audience, but the current flow is still mostly educational.

**Plan**:

- Ask current city, home constituency, age, and registration status.
- Explain registration/transfer options in simple language.
- Use Geocoding and Places to locate nearby election offices and document help centers.
- Offer Calendar reminders and shareable checklist cards.

**Why it helps win**: It targets a real underserved voter segment with a concrete workflow.

## Priority 4 - AI Coach Upgrade

**Issue**: Chunav Saathi answers questions, but it can become more interactive and evaluator-friendly.

**Plan**:

- Add structured answer modes: simple, detailed, audio-first, classroom.
- Add source cards with official ECI/NVSP links after every answer.
- Add scenario-aware hints inside Play rather than only after answers.
- Add a teacher/facilitator prompt mode for community workshops.

**Why it helps win**: It demonstrates prompt engineering, safety, accessibility, and practical education.

## Priority 5 - Better UI Polish

**Issue**: The current UI has strong identity, but more motion/detail can make it demo-stage memorable.

**Plan**:

- Add a full journey map with animated station progress.
- Add badge cabinet, XP meter, and Democracy Passport visual surface.
- Improve map page density with split map/list panels and quick filters.
- Add mobile-first bottom actions for Easy Mode and Play.

**Why it helps win**: Judges often decide quickly; polish makes the project feel complete.

## Priority 6 - Automated Quality Gates

**Issue**: Manual browser smoke exists, but automated UI/accessibility proof is still pending.

**Plan**:

- Add Playwright smoke tests for `/`, `/chat`, `/clinic`, `/map`, `/easy-mode`, and Play scenarios.
- Add axe checks for primary flows.
- Add a deployment smoke script that validates stable Cloud Run URLs after every deploy.

**Why it helps win**: It strengthens code quality, accessibility, and reliability rubric scores.

## Priority 7 - Native TTS Verification Matrix

**Issue**: Easy Mode now has 22 scheduled-language presets, but actual voice quality varies by browser and Google Cloud Text-to-Speech language availability.

**Plan**:

- Build a small internal matrix that tests each scheduled language in browser speech, Google TTS, Android TalkBack, and iOS VoiceOver.
- Mark each language as native, browser-only, or fallback with evidence from a real device/browser run.
- Cache confirmed server-generated MP3 audio by transcript hash so classroom sessions do not depend on repeated synthesis.

**Why it helps win**: It turns the new language architecture into verified, demo-safe audio coverage instead of a best-effort preset list.

## Priority 8 - Accessibility Blueprint UI Wiring

**Issue**: Version 0.4.6 now has strong typed scaffolding for high contrast, large text, dyslexia-friendly layout, switch access, STT correction, offline packets, and classroom mode, but several of those controls are not yet user-toggleable in the frontend.

**Plan**:

- Add an accessibility preferences drawer using `buildAccessibilityPreferenceProfile()` as the single source of truth.
- Wire high-contrast, text scale, reduced-motion, dyslexia-friendly spacing, captions, and switch-access flags into CSS variables and app-shell state.
- Convert `buildVoiceInputDraft()` into Chat and Forward Clinic voice-input UI with visible transcript correction before submit.
- Convert `buildOfflineAccessibilityPacket()` and `buildFacilitatorPromptDeck()` into printable/downloadable classroom resources.
- Add Playwright and axe coverage for the preference drawer, Easy Mode blueprint panel, STT correction surface, and print packet route.

**Why it helps win**: The code already shows a broad accessibility architecture; wiring these controls will turn scaffolded proof into demo-visible assistive workflows.

## Priority 9 - Live Google Civic Stack Wiring

**Issue**: Version 0.5.0 now exposes a broad typed Google Civic Stack with honest `implemented`, `ready-with-key`, and `planned` statuses. The next scoring lift is converting the strongest key-ready services into live demo-visible paths.

**Plan**:

- Wire a referrer-restricted browser Maps key so `/map` renders real Google tiles in production while keeping the text fallback.
- Add Places Nearby Search and Directions/Routes route cards for polling help, ERO/BLO offices, transit, walking, and accessibility landmarks.
- Add a Google Calendar OAuth write flow while preserving the current ICS fallback.
- Add a YouTube SVEEP frontend section grouped by voter journey step.
- Add Cloud Monitoring uptime checks and a BigQuery/GA4 privacy-safe event schema for operational proof.

**Why it helps win**: The code now proves breadth; keyed live paths will prove depth and make the Google Services rubric unmistakable in both code review and browser demos.
