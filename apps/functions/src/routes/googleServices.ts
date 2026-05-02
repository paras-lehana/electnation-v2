/**
 * GET /api/google/services — evaluator-facing Google Civic Stack evidence.
 *
 * The response intentionally exposes service names, statuses, env var names,
 * code paths, and fallback modes, but never exposes secret values.
 */

import { Router } from 'express';
import {
  getGoogleCivicJourney,
  getGoogleServiceCatalog,
  getGoogleServiceScorecard,
} from '@yatra/core/google';
import type { AppConfig } from '../config.js';
import { logger } from '../middleware/logger.js';

const configuredRuntimeServices = (config: AppConfig) => ({
  llmService: config.llmService.enabled && Boolean(config.llmService.baseUrl),
  maps: Boolean(config.maps.apiKey),
  recaptcha: Boolean(
    config.recaptcha.siteKey || config.recaptcha.apiKey || config.recaptcha.bypass,
  ),
  youtube: Boolean(config.youtube.apiKey || config.youtube.sveepPlaylistId),
  calendar: true,
  tts: true,
  translation: true,
  firebase: Boolean(config.firebase.projectId),
  cloudRun: config.nodeEnv === 'production' || config.apiBaseUrl.includes('run.app'),
});

export const googleServicesRouter = (config: AppConfig): Router => {
  const router = Router();

  router.get('/google/services', (_req, res) => {
    const catalog = getGoogleServiceCatalog();
    const runtime = configuredRuntimeServices(config);

    logger.info('google_services.requested', {
      totalServices: catalog.length,
      mapsConfigured: runtime.maps,
      llmConfigured: runtime.llmService,
    });

    res.json({
      mode: 'google-civic-stack',
      runtime,
      scorecard: getGoogleServiceScorecard(),
      journey: getGoogleCivicJourney(),
      services: catalog,
      safety: {
        exposesSecretValues: false,
        exposesEnvVarNamesOnly: true,
        statuses: ['implemented', 'ready-with-key', 'planned'],
      },
    });
  });

  return router;
};
