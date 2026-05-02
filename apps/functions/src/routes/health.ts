/**
 * GET /api/health — Lehana-standard health endpoint.
 * Returns status, version, uptime, and per-dependency readiness.
 */

import { Router } from 'express';
import { APP_VERSION } from '@yatra/core';
import type { AppConfig } from '../config.js';

const startedAt = Date.now();

export const healthRouter = (config: AppConfig): Router => {
  const r = Router();

  r.get('/health', (_req, res) => {
    const deps = {
      llmService: config.llmService.enabled && Boolean(config.llmService.baseUrl) ? 'configured' : 'disabled',
      maps: Boolean(config.maps.apiKey) ? 'configured' : 'missing-key',
      firebase: Boolean(config.firebase.projectId) ? 'configured' : 'missing-project',
    };
    const allGood = Object.values(deps).every((v) => v === 'configured');
    res.status(allGood ? 200 : 200).json({
      status: allGood ? 'healthy' : 'degraded',
      version: APP_VERSION,
      uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
      environment: config.nodeEnv,
      dependencies: deps,
      timestamp: new Date().toISOString(),
    });
  });

  return r;
};
