import { afterEach, describe, expect, it } from 'vitest';

const ORIGINAL_ENV = {
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  ALLOW_NO_ORIGIN_REQUESTS: process.env.ALLOW_NO_ORIGIN_REQUESTS,
  DEMO_MODE: process.env.DEMO_MODE,
  NODE_ENV: process.env.NODE_ENV,
  RECAPTCHA_BYPASS_ALLOWED_ORIGINS: process.env.RECAPTCHA_BYPASS_ALLOWED_ORIGINS,
};

afterEach(() => {
  for (const [key, value] of Object.entries(ORIGINAL_ENV)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

describe('loadConfig', () => {
  it('keeps demo mode opt-in', async () => {
    delete process.env.DEMO_MODE;
    const { loadConfig } = await import('./config.js');
    expect(loadConfig().demoMode).toBe(false);

    process.env.DEMO_MODE = 'true';
    expect(loadConfig().demoMode).toBe(true);
  });

  it('keeps no-origin CORS opt-in for production', async () => {
    delete process.env.ALLOW_NO_ORIGIN_REQUESTS;
    process.env.NODE_ENV = 'production';

    const { loadConfig } = await import('./config.js');
    expect(loadConfig().allowNoOriginRequests).toBe(false);

    process.env.ALLOW_NO_ORIGIN_REQUESTS = 'true';
    expect(loadConfig().allowNoOriginRequests).toBe(true);
  });

  it('scopes reCAPTCHA bypass origins separately from the general CORS list', async () => {
    process.env.ALLOWED_ORIGINS = 'https://web.example,https://preview.example';
    process.env.RECAPTCHA_BYPASS_ALLOWED_ORIGINS = 'https://web.example';

    const { loadConfig } = await import('./config.js');
    const config = loadConfig();

    expect(config.allowedOrigins).toEqual(['https://web.example', 'https://preview.example']);
    expect(config.recaptcha.bypassAllowedOrigins).toEqual(['https://web.example']);
  });
});