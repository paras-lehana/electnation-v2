import type { Express } from 'express';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import type { AppConfig } from './config.js';

process.env.FUNCTIONS_NO_START = '1';
process.env.NODE_ENV = 'test';
process.env.RECAPTCHA_BYPASS = 'true';
process.env.ALLOWED_ORIGINS = 'http://localhost:3000';
process.env.RECAPTCHA_BYPASS_ALLOWED_ORIGINS = 'http://localhost:3000';
process.env.GEMINI_API_KEY = '';
process.env.LLM_SERVICE_ENABLED = 'false';
process.env.GOOGLE_MAPS_API_KEY = '';

let app: Express;
let buildConfiguredApp!: (config?: AppConfig) => Express;
let loadedConfig!: AppConfig;

beforeAll(async () => {
  const [{ buildApp }, { loadConfig }] = await Promise.all([
    import('./server.js'),
    import('./config.js'),
  ]);
  buildConfiguredApp = buildApp;
  loadedConfig = loadConfig();
  app = buildApp(loadedConfig);
}, 30_000);

const productionConfig = (): AppConfig => ({
  ...loadedConfig,
  nodeEnv: 'production',
  allowedOrigins: ['https://web.example'],
  allowNoOriginRequests: false,
  demoMode: true,
  recaptcha: {
    ...loadedConfig.recaptcha,
    bypass: true,
    bypassAllowedOrigins: ['https://web.example'],
  },
});

describe('Election Yatra API', () => {
  it('reports health with dependency readiness', async () => {
    const response = await request(app).get('/api/health').expect(200);
    expect(response.body.status).toMatch(/healthy|degraded/);
    expect(response.body.dependencies).toHaveProperty('llmService');
  });

  it('returns schema-shaped demo forward analysis', async () => {
    const response = await request(app)
      .post('/api/forward/analysis')
      .set('Origin', 'http://localhost:3000')
      .send({
        text: 'Forwarded many times: EVM bluetooth hack means voting is rigged',
        locale: 'en',
      })
      .expect(200);

    expect(response.body.mode).toBe('demo');
    expect(response.body.category).toBe('fake-news');
    expect(response.body.riskLevel).toBe(5);
    expect(response.body.eciSources[0]).toContain('eci.gov.in');
  });

  it('rejects invalid forward analysis payloads', async () => {
    const response = await request(app)
      .post('/api/forward/analysis')
      .set('Origin', 'http://localhost:3000')
      .send({ text: 'short' })
      .expect(400);
    expect(response.body.error.code).toBe('VALIDATION_FAILED');
  });

  it('sets CORS only for configured browser origins', async () => {
    const allowed = await request(app)
      .get('/api/health')
      .set('Origin', 'http://localhost:3000')
      .expect(200);
    expect(allowed.headers['access-control-allow-origin']).toBe('http://localhost:3000');

    const denied = await request(app)
      .get('/api/health')
      .set('Origin', 'https://evil.example')
      .expect(200);
    expect(denied.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('does not expose server-only secrets in public config', async () => {
    const response = await request(app).get('/api/config/public').expect(200);
    const serialized = JSON.stringify(response.body);

    expect(response.body).toHaveProperty('mapsApiKey');
    expect(response.body.supportedLocales).toHaveLength(23);
    expect(response.body.supportedLocales).toContain('sat');
    expect(response.body.supportedLocales).toContain('ur');
    expect(response.body.accessibility).toMatchObject({
      scheduledLanguages: 22,
      featureBlueprints: expect.any(Number),
      userProfiles: expect.any(Number),
      inputModesCovered: expect.any(Number),
    });
    expect(response.body.googleServices).toMatchObject({
      totalServices: expect.any(Number),
      implemented: expect.any(Number),
      readyWithKey: expect.any(Number),
      planned: expect.any(Number),
      productFamilies: expect.any(Number),
    });
    expect(response.body.googleServices.totalServices).toBeGreaterThanOrEqual(30);
    expect(response.body.featureFlags).toMatchObject({
      calendar: true,
      youtubeSveep: true,
      tts: true,
    });
    expect(serialized).not.toContain('LLM_SERVICE_INTERNAL_KEY');
    expect(serialized).not.toContain('LLM_SERVICE_API_KEY');
    expect(serialized).not.toContain('GOOGLE_OAUTH_CLIENT_SECRET');
    expect(serialized).not.toContain('llmService');
    expect(serialized).not.toContain('recaptchaBypass');
  });

  it('serves an evaluator-facing Google Civic Stack catalog without secret values', async () => {
    const response = await request(app).get('/api/google/services').expect(200);
    const serialized = JSON.stringify(response.body);

    expect(response.body.mode).toBe('google-civic-stack');
    expect(response.body.scorecard.totalServices).toBeGreaterThanOrEqual(30);
    expect(response.body.scorecard.implemented).toBeGreaterThanOrEqual(12);
    expect(response.body.journey).toHaveLength(7);
    expect(response.body.services).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'antigravity-gemini-chat', status: 'implemented' }),
        expect.objectContaining({ id: 'maps-javascript', status: 'implemented' }),
        expect.objectContaining({ id: 'places-new', status: 'ready-with-key' }),
        expect.objectContaining({ id: 'bigquery', status: 'planned' }),
      ]),
    );
    expect(response.body.safety.exposesSecretValues).toBe(false);
    expect(serialized).not.toContain('super-secret-google-key-value');
  });

  it('streams demo chat as server-sent events', async () => {
    const response = await request(app)
      .post('/api/chat')
      .set('Origin', 'http://localhost:3000')
      .send({ locale: 'en', literacyComfort: 'standard', message: 'How do I register to vote?' })
      .expect(200);

    expect(response.headers['content-type']).toContain('text/event-stream');
    expect(response.text).toContain('data:');
    expect(response.text).toContain('[DONE]');
    expect(response.text).toContain('"delta":"Chunav"');
    expect(response.text).toContain('"delta":"Saathi"');
  });

  it('rejects invalid chat payloads before streaming', async () => {
    const response = await request(app)
      .post('/api/chat')
      .set('Origin', 'http://localhost:3000')
      .send({ locale: 'en', literacyComfort: 'standard', message: '' })
      .expect(400);

    expect(response.body.error.code).toBe('VALIDATION_FAILED');
  });

  it('allows production reCAPTCHA bypass only from the configured web origin', async () => {
    const productionApp = buildConfiguredApp(productionConfig());

    const allowed = await request(productionApp)
      .post('/api/forward/analysis')
      .set('Origin', 'https://web.example')
      .send({
        text: 'Forwarded many times: EVM bluetooth hack means voting is rigged',
        locale: 'en',
      })
      .expect(200);
    expect(allowed.body.recaptcha.bypassed).toBe(true);

    const denied = await request(productionApp)
      .post('/api/forward/analysis')
      .set('Origin', 'https://evil.example')
      .send({
        text: 'Forwarded many times: EVM bluetooth hack means voting is rigged',
        locale: 'en',
      })
      .expect(400);
    expect(denied.body.error.code).toBe('RECAPTCHA_REQUIRED');
  });

  it('serves an ICS calendar reminder file', async () => {
    const response = await request(app).get('/api/calendar/ics?source=default').expect(200);
    expect(response.text).toContain('BEGIN:VCALENDAR');
    expect(response.text).toContain('BEGIN:VEVENT');
  });

  it('creates Google Calendar template links for valid reminder batches', async () => {
    const response = await request(app)
      .post('/api/calendar/add')
      .send({
        events: [
          {
            id: 'poll-day',
            kind: 'poll-day',
            title: { en: 'Polling day reminder' },
            startsAt: '2026-05-31T07:00:00.000Z',
            endsAt: '2026-05-31T07:30:00.000Z',
            eciSourceUrl: 'https://eci.gov.in',
          },
        ],
      })
      .expect(200);

    expect(response.body.mode).toBe('google-calendar-template');
    expect(response.body.links[0].googleCalendarUrl).toContain('calendar.google.com');
    expect(response.body.icsUrl).toBe('/api/calendar/ics?source=default');
  });

  it('returns a typed map configuration error when Maps keys are absent outside demo mode', async () => {
    const response = await request(app)
      .get('/api/map/nearest-facilities?lat=28.61&lng=77.21')
      .expect(503);

    expect(response.body.error.code).toBe('MAPS_CONFIG_MISSING');
  });

  it('rejects invalid map coordinates', async () => {
    const response = await request(app)
      .get('/api/map/nearest-facilities?lat=abc&lng=77.21')
      .expect(400);

    expect(response.body.error.message).toContain('Invalid lat/lng');
  });

  it('validates TTS and translation request bodies before upstream calls', async () => {
    await request(app).post('/api/tts').send({ languageCode: 'en-IN' }).expect(400);
    await request(app).post('/api/translate').send({ text: 'Namaste' }).expect(400);
    await request(app).post('/api/translate/detect').send({}).expect(400);
  });

  it('serves demo YouTube SVEEP content without API keys', async () => {
    const response = await request(app).get('/api/youtube/sveep').expect(200);
    expect(response.body.mode).toBe('demo');
    expect(response.body.videos.length).toBeGreaterThan(0);
  });
});
