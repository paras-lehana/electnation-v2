/**
 * In-memory token-bucket rate limiter. Good enough for single-instance dev
 * and the hackathon demo. Production swaps this for Redis or Memorystore.
 */

import type { Request, Response, NextFunction } from 'express';

interface Bucket {
  count: number;
  resetAt: number;
}

export const createRateLimiter = (opts: { windowMs: number; max: number }) => {
  const buckets = new Map<string, Bucket>();
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip ?? 'unknown';
    const now = Date.now();
    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt < now) {
      buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
      return next();
    }
    if (bucket.count >= opts.max) {
      res.status(429).json({
        error: {
          code: 'RATE_LIMITED',
          message: 'Too many requests. Please slow down.',
        },
      });
      return;
    }
    bucket.count += 1;
    next();
  };
};
