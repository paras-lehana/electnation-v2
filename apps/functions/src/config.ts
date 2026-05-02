/**
 * Central config loader. Reads from process.env so the rest of the backend
 * can accept a typed `AppConfig` via dependency injection and stay testable.
 */

import 'dotenv/config';

export interface AppConfig {
  nodeEnv: 'development' | 'production' | 'test';
  port: number;
  apiBaseUrl: string;
  webBaseUrl: string;
  allowedOrigins: string[];
  allowNoOriginRequests: boolean;
  demoMode: boolean;

  google: {
    apiKey: string;
    cloudProject: string;
    cloudLocation: string;
  };

  gemini: {
    apiKey: string;
    chatModel: string;
    analysisModel: string;
  };

  llmService: {
    enabled: boolean;
    baseUrl: string;
    endpointName: string;
    model: string;
    provider: string;
    providerBaseUrl: string;
    apiKey: string;
    internalKey: string;
    useByok: boolean;
    timeoutMs: number;
  };

  maps: {
    apiKey: string;
    mapId: string;
  };

  recaptcha: {
    projectId: string;
    siteKey: string;
    apiKey: string;
    minScore: number;
    bypass: boolean;
    bypassAllowedOrigins: string[];
  };

  youtube: {
    apiKey: string;
    sveepPlaylistId: string;
  };

  calendar: {
    oauthClientId: string;
    oauthClientSecret: string;
    oauthRedirectUri: string;
  };

  firebase: {
    projectId: string;
  };

  rateLimit: {
    windowMs: number;
    max: number;
  };
}

const require_ = (key: string, fallback?: string): string => {
  const v = process.env[key] ?? fallback;
  if (!v) {
    // We do not crash in dev so the scaffold can boot without full creds;
    // the handlers themselves return a typed CONFIG_MISSING error if called.
    return '';
  }
  return v;
};

const csvList = (value: string | undefined, fallback: string): string[] =>
  (value ?? fallback)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

export const loadConfig = (): AppConfig => ({
  nodeEnv: (process.env.NODE_ENV as AppConfig['nodeEnv']) ?? 'development',
  port: Number(process.env.PORT ?? 8080),
  apiBaseUrl: process.env.API_BASE_URL ?? 'http://localhost:8080',
  webBaseUrl: process.env.WEB_BASE_URL ?? 'http://localhost:3000',
  allowedOrigins: csvList(process.env.ALLOWED_ORIGINS, 'http://localhost:3000'),
  allowNoOriginRequests:
    process.env.ALLOW_NO_ORIGIN_REQUESTS === 'true' ||
    (process.env.ALLOW_NO_ORIGIN_REQUESTS !== 'false' && process.env.NODE_ENV !== 'production'),
  demoMode: process.env.DEMO_MODE === 'true',

  google: {
    apiKey: require_('GOOGLE_API_KEY', process.env.GOOGLE_MAPS_API_KEY),
    cloudProject: require_('GOOGLE_CLOUD_PROJECT', 'election-yatra'),
    cloudLocation: require_('GOOGLE_CLOUD_LOCATION', 'asia-south1'),
  },

  gemini: {
    apiKey: require_('GEMINI_API_KEY', process.env.GOOGLE_API_KEY),
    chatModel: process.env.VERTEX_MODEL_CHAT ?? 'gemini-flash-latest',
    analysisModel: process.env.VERTEX_MODEL_ANALYSIS ?? 'gemini-pro-latest',
  },

  llmService: {
    enabled: process.env.LLM_SERVICE_ENABLED !== 'false',
    baseUrl: process.env.LLM_SERVICE_URL ?? 'https://llm.lehana.in',
    endpointName: process.env.LLM_SERVICE_ENDPOINT ?? 'antigravity-manager',
    model: process.env.LLM_SERVICE_MODEL ?? 'gemini-3-flash',
    provider: process.env.LLM_SERVICE_PROVIDER ?? 'custom',
    providerBaseUrl: process.env.LLM_SERVICE_PROVIDER_BASE_URL ?? 'https://antigravity.aidhunik.com/v1',
    apiKey: require_('LLM_SERVICE_API_KEY'),
    internalKey: require_('LLM_SERVICE_INTERNAL_KEY', process.env.LLM_SERVICE_API_KEY),
    useByok: process.env.LLM_SERVICE_BYOK === 'true',
    timeoutMs: Number(process.env.LLM_SERVICE_TIMEOUT_MS ?? 90_000),
  },

  maps: {
    apiKey: require_('GOOGLE_MAPS_API_KEY'),
    mapId: process.env.GOOGLE_MAPS_MAP_ID ?? 'election_yatra_map',
  },

  recaptcha: {
    projectId: require_('RECAPTCHA_PROJECT_ID', process.env.GOOGLE_CLOUD_PROJECT),
    siteKey: require_('RECAPTCHA_SITE_KEY', process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
    apiKey: require_('RECAPTCHA_API_KEY', process.env.GOOGLE_API_KEY),
    minScore: Number(process.env.RECAPTCHA_MIN_SCORE ?? 0.5),
    bypass:
      process.env.RECAPTCHA_BYPASS === 'true' ||
      (process.env.RECAPTCHA_BYPASS !== 'false' && process.env.NODE_ENV !== 'production'),
    bypassAllowedOrigins: csvList(
      process.env.RECAPTCHA_BYPASS_ALLOWED_ORIGINS,
      process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000',
    ),
  },

  youtube: {
    apiKey: require_('YOUTUBE_API_KEY', process.env.GOOGLE_API_KEY),
    sveepPlaylistId: process.env.YOUTUBE_SVEEP_PLAYLIST_ID ?? '',
  },

  calendar: {
    oauthClientId: require_('GOOGLE_OAUTH_CLIENT_ID'),
    oauthClientSecret: require_('GOOGLE_OAUTH_CLIENT_SECRET'),
    oauthRedirectUri:
      process.env.GOOGLE_OAUTH_REDIRECT_URI ?? 'http://localhost:3000/api/auth/google/callback',
  },

  firebase: {
    projectId: require_('FIREBASE_PROJECT_ID', 'election-yatra'),
  },

  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000),
    max: Number(process.env.RATE_LIMIT_MAX ?? 60),
  },
});
