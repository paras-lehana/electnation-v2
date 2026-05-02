/**
 * Structured JSON logger. No PII, safe for Cloud Logging ingestion.
 */

type Level = 'debug' | 'info' | 'warn' | 'error';

const emit = (level: Level, msg: string, meta?: Record<string, unknown>) => {
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    level,
    msg,
    ...meta,
  });
  // eslint-disable-next-line no-console
  (level === 'error' ? console.error : console.log)(line);
};

export const logger = {
  debug: (msg: string, meta?: Record<string, unknown>) => emit('debug', msg, meta),
  info: (msg: string, meta?: Record<string, unknown>) => emit('info', msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => emit('warn', msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => emit('error', msg, meta),
};
