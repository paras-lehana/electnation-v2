import { describe, expect, it } from 'vitest';
import type { AppConfig } from '../config.js';
import { isCorsOriginAllowed, isRecaptchaBypassAllowed } from './requestSecurity.js';

const baseConfig: AppConfig = {
  nodeEnv: 'production',
  port: 8080,
  apiBaseUrl: 'http://localhost:8080',
  webBaseUrl: 'https://web.example',
  allowedOrigins: ['https://web.example'],
  allowNoOriginRequests: false,
  demoMode: false,
  google: { apiKey: '', cloudProject: 'election-yatra', cloudLocation: 'asia-south1' },
  gemini: { apiKey: '', chatModel: 'gemini-flash-latest', analysisModel: 'gemini-pro-latest' },
  llmService: {
    enabled: false,
    baseUrl: 'https://llm.lehana.in',
    endpointName: 'antigravity-manager',
    model: 'gemini-3-flash',
    provider: 'custom',
    providerBaseUrl: 'https://antigravity.aidhunik.com/v1',
    apiKey: '',
    internalKey: '',
    useByok: false,
    timeoutMs: 90_000,
  },
  maps: { apiKey: '', mapId: 'election_yatra_map' },
  recaptcha: {
    projectId: 'election-yatra',
    siteKey: '',
    apiKey: '',
    minScore: 0.5,
    bypass: true,
    bypassAllowedOrigins: ['https://web.example'],
  },
  youtube: { apiKey: '', sveepPlaylistId: '' },
  calendar: { oauthClientId: '', oauthClientSecret: '', oauthRedirectUri: 'http://localhost:3000/callback' },
  firebase: { projectId: 'election-yatra' },
  rateLimit: { windowMs: 60_000, max: 60 },
};

describe('request security helpers', () => {
  it('allows only configured CORS origins in production', () => {
    expect(isCorsOriginAllowed(baseConfig, 'https://web.example')).toBe(true);
    expect(isCorsOriginAllowed(baseConfig, 'https://evil.example')).toBe(false);
    expect(isCorsOriginAllowed(baseConfig, undefined)).toBe(false);
  });

  it('scopes production reCAPTCHA bypass to configured web origins', () => {
    expect(isRecaptchaBypassAllowed(baseConfig, 'https://web.example')).toBe(true);
    expect(isRecaptchaBypassAllowed(baseConfig, 'https://evil.example')).toBe(false);
    expect(isRecaptchaBypassAllowed(baseConfig, undefined)).toBe(false);
  });
});
