/**
 * Election Yatra API server.
 * Same handlers are exported so the app can also run on Cloud Run or as a
 * 2nd-gen Cloud Function (functions-framework) without rewrite.
 */

import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import {
  APP_VERSION,
  getAccessibilityCoverageSummary,
  getGoogleServicesPublicSummary,
  getSupportedLocaleCodes,
} from '@yatra/core';
import { loadConfig } from './config.js';
import { logger } from './middleware/logger.js';
import { createRateLimiter } from './middleware/rateLimit.js';
import { healthRouter } from './routes/health.js';
import { chatRouter } from './routes/chat.js';
import { mapRouter } from './routes/map.js';
import { forwardRouter } from './routes/forward.js';
import { ttsRouter } from './routes/tts.js';
import { translateRouter } from './routes/translate.js';
import { calendarRouter } from './routes/calendar.js';
import { youtubeRouter } from './routes/youtube.js';
import { googleServicesRouter } from './routes/googleServices.js';
import { isCorsOriginAllowed } from './services/requestSecurity.js';

export const buildApp = (config = loadConfig()): Express => {
  const app = express();

  app.disable('x-powered-by');
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          defaultSrc: ["'none'"],
          baseUri: ["'none'"],
          frameAncestors: ["'none'"],
          formAction: ["'none'"],
        },
      },
    }),
  );
  app.use(
    cors({
      origin: (origin, callback) => {
        callback(null, isCorsOriginAllowed(config, origin) ? true : false);
      },
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '32kb' }));

  const limiter = createRateLimiter(config.rateLimit);
  app.use('/api/', limiter);

  app.use('/api', healthRouter(config));
  app.use('/api', chatRouter(config));
  app.use('/api', mapRouter(config));
  app.use('/api/forward', forwardRouter(config));
  app.use('/api/tts', ttsRouter);
  app.use('/api/translate', translateRouter);
  app.use('/api', calendarRouter(config));
  app.use('/api', youtubeRouter(config));
  app.use('/api', googleServicesRouter(config));

  app.get('/api/config/public', (_req, res) => {
    try {
      logger.info('config.public_requested', { hasMapsKey: !!config.maps.apiKey });
      res.json({
        mapsApiKey: config.maps.apiKey || '',
        mapsMapId: config.maps.mapId,
        recaptchaSiteKey: config.recaptcha.siteKey || '',
        supportedLocales: ['en', ...getSupportedLocaleCodes()],
        accessibility: getAccessibilityCoverageSummary(),
        googleServices: getGoogleServicesPublicSummary(),
        featureFlags: {
          calendar: true,
          youtubeSveep: true,
          mapsDirections: Boolean(config.maps.apiKey),
          tts: true,
          translation: true,
        },
      });
    } catch (err) {
      logger.error('config.public_failed', { err: String(err) });
      res.status(500).json({ error: 'Internal server error fetching config' });
    }
  });

  app.get('/', (_req, res) => {
    res.json({
      service: 'election-yatra-api',
      version: APP_VERSION,
      docs: '/api/health',
    });
  });

  app.use((req, res) => {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: `No route for ${req.path}` } });
  });

  return app;
};

// Start the server unless explicitly disabled (e.g. by tests via supertest).
// On Windows, comparing import.meta.url to process.argv[1] is brittle under
// tsx watch, so we invert the default: start unless FUNCTIONS_NO_START=1.
if (process.env.FUNCTIONS_NO_START !== '1') {
  const config = loadConfig();
  const app = buildApp(config);
  app.listen(config.port, () => {
    logger.info('api.listening', { port: config.port, env: config.nodeEnv });
  });
}
