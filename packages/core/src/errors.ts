/**
 * Application-wide error taxonomy.
 * All backend handlers convert thrown/unknown errors into AppError before
 * shaping an HTTP response, so clients see a stable, localized surface.
 */

export type ErrorCode =
  | 'VALIDATION_FAILED'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'RATE_LIMITED'
  | 'RECAPTCHA_FAILED'
  | 'UPSTREAM_TIMEOUT'
  | 'UPSTREAM_FAILURE'
  | 'GEMINI_SAFETY_BLOCK'
  | 'NOT_FOUND'
  | 'CONFIG_MISSING'
  | 'INTERNAL';

export interface LocalizedMessage {
  en: string;
  hi?: string;
  [locale: string]: string | undefined;
}

export interface AppError {
  code: ErrorCode;
  httpStatus: number;
  safeMessage: LocalizedMessage;
  cause?: unknown;
  /** Optional breadcrumb useful in logs but never sent to client. */
  internalHint?: string;
}

const DEFAULT_STATUS: Record<ErrorCode, number> = {
  VALIDATION_FAILED: 400,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  RATE_LIMITED: 429,
  RECAPTCHA_FAILED: 400,
  UPSTREAM_TIMEOUT: 504,
  UPSTREAM_FAILURE: 502,
  GEMINI_SAFETY_BLOCK: 451,
  NOT_FOUND: 404,
  CONFIG_MISSING: 500,
  INTERNAL: 500,
};

const DEFAULT_MESSAGE: Record<ErrorCode, LocalizedMessage> = {
  VALIDATION_FAILED: {
    en: 'The request could not be validated.',
    hi: 'Anurodh sahi nahi hai. Kripya dobara prayaas karein.',
  },
  UNAUTHENTICATED: {
    en: 'Please sign in to continue.',
    hi: 'Kripya pehle sign in karein.',
  },
  FORBIDDEN: { en: 'You do not have access to this resource.', hi: 'Aapko is sevaa ka adhikaar nahi hai.' },
  RATE_LIMITED: { en: 'Too many requests. Please slow down.', hi: 'Bahut jyada anurodh. Thoda rukiye.' },
  RECAPTCHA_FAILED: { en: 'Captcha verification failed.', hi: 'Captcha satyapan vifal raha.' },
  UPSTREAM_TIMEOUT: { en: 'Upstream service timed out.', hi: 'Sevaa me der ho rahi hai.' },
  UPSTREAM_FAILURE: { en: 'Upstream service failed.', hi: 'Sevaa uplabdh nahi hai.' },
  GEMINI_SAFETY_BLOCK: {
    en: 'The AI declined to respond to that prompt for safety reasons.',
    hi: 'AI ne suraksha karan is prashn ka uttar dene se mana kiya.',
  },
  NOT_FOUND: { en: 'Resource not found.', hi: 'Sevaa nahi mili.' },
  CONFIG_MISSING: { en: 'Server configuration is incomplete.', hi: 'Server configuration adhura hai.' },
  INTERNAL: { en: 'Something went wrong on our side.', hi: 'Humari taraf se kuch galat hua.' },
};

export const createError = (
  code: ErrorCode,
  overrides: Partial<Omit<AppError, 'code'>> = {},
): AppError => ({
  code,
  httpStatus: overrides.httpStatus ?? DEFAULT_STATUS[code],
  safeMessage: overrides.safeMessage ?? DEFAULT_MESSAGE[code],
  cause: overrides.cause,
  internalHint: overrides.internalHint,
});
