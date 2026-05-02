/**
 * POST /api/chat — Streaming Chunav Saathi responses through llm-service.
 *
 * Contract
 * - Request body validated against ChatRequestSchema.
 * - Response is Server-Sent Events: each `data: {...}\n\n` frame carries
 *   `{ delta: string }`. A final `data: [DONE]\n\n` marks completion.
 * - In demo mode, server returns a deterministic stream so the frontend can
 *   still be exercised without credentials.
 */

import { Router } from 'express';
import { ChatRequestSchema, buildChunavSaathiPrompt } from '@yatra/core';
import type { AppConfig } from '../config.js';
import { logger } from '../middleware/logger.js';
import { LlmServiceClient } from '../services/llmServiceClient.js';
import { wrapUntrustedUserInput } from '../services/promptBoundary.js';
import { redactSensitiveVoterData } from '../services/privacyRedaction.js';

const DEMO_REPLY =
  'Namaste! Main Chunav Saathi hoon. Aapke liye Election Yatra start karne ke liye tayar hoon. ' +
  'Pehle step — Voter registration. Aap kis state se hain? Main aapko wahaan ke registration ' +
  'portal aur deadlines samjha sakta hoon.\n\n' +
  '• Registration: voters.eci.gov.in par Form 6 bharna hota hai\n' +
  '• Documents: Aadhaar / Passport / Driving License\n' +
  '• Timeline: Chunaav ke 10 din pehle tak\n\n' +
  'Kya aap chahenge main aapko key dates ke liye Calendar reminder bana doon?';

const streamDemo = async (res: import('express').Response) => {
  const tokens = DEMO_REPLY.split(/(\s+)/);
  for (const t of tokens) {
    res.write(`data: ${JSON.stringify({ delta: t })}\n\n`);
    await new Promise((r) => setTimeout(r, 35));
  }
  res.write('data: [DONE]\n\n');
  res.end();
};

const streamText = async (res: import('express').Response, text: string) => {
  const tokens = text.split(/(\s+)/);
  for (const token of tokens) {
    if (token.length === 0) continue;
    res.write(`data: ${JSON.stringify({ delta: token })}\n\n`);
  }
  res.write('data: [DONE]\n\n');
  res.end();
};

export const chatRouter = (config: AppConfig): Router => {
  const r = Router();

  r.post('/chat', async (req, res) => {
    logger.info('chat.request_received', {
      model: config.llmService.model,
      llmServiceEnabled: config.llmService.enabled,
      demoMode: config.demoMode,
    });
    const parsed = ChatRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: {
          code: 'VALIDATION_FAILED',
          message: 'Invalid chat request.',
          issues: parsed.error.issues.map((i) => ({ path: i.path, message: i.message })),
        },
      });
      return;
    }

    res.setHeader('content-type', 'text/event-stream');
    res.setHeader('cache-control', 'no-cache, no-transform');
    res.setHeader('connection', 'keep-alive');
    res.setHeader('x-accel-buffering', 'no');
    res.flushHeaders?.();

    if (config.demoMode || !config.llmService.enabled) {
      logger.warn('chat.demo_mode', { reason: config.demoMode ? 'DEMO_MODE enabled' : 'LLM_SERVICE_DISABLED' });
      await streamDemo(res);
      return;
    }

    const client = new LlmServiceClient(config.llmService);
    const systemInstruction = buildChunavSaathiPrompt({
      locale: parsed.data.locale,
      literacyComfort: parsed.data.literacyComfort,
      stepSlug: parsed.data.stepSlug,
    });
    const redaction = redactSensitiveVoterData(parsed.data.message);

    try {
      const result = await client.generate({
        systemPrompt: systemInstruction,
        messages: [{ role: 'user', content: wrapUntrustedUserInput('CHAT_MESSAGE', redaction.text) }],
        temperature: 0.4,
        maxTokens: 1024,
      });
      logger.info('chat.llm_complete', {
        mode: result.mode,
        model: result.model,
        redactionCount: redaction.totalReplacements,
        redactionKinds: redaction.findings.map((finding) => finding.kind),
      });
      await streamText(res, result.content);
    } catch (cause) {
      logger.error('chat.llm_failed', { cause: 'llm-service request failed' });
      res.write(
        `data: ${JSON.stringify({ error: 'UPSTREAM_FAILURE', message: 'AI service is unavailable right now.' })}\n\n`,
      );
      res.end();
    }
  });

  return r;
};
