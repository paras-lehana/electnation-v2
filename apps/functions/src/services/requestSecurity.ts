import type { AppConfig } from '../config.js';

const listAllowsOrigin = (allowedOrigins: string[], origin: string): boolean =>
  allowedOrigins.includes('*') || allowedOrigins.includes(origin);

export const isCorsOriginAllowed = (config: AppConfig, origin: string | undefined): boolean => {
  if (!origin) return config.allowNoOriginRequests;
  return listAllowsOrigin(config.allowedOrigins, origin);
};

export const isRecaptchaBypassAllowed = (config: AppConfig, origin: string | undefined): boolean => {
  if (!config.recaptcha.bypass) return false;
  if (config.nodeEnv !== 'production') return true;
  if (!origin) return false;

  return listAllowsOrigin(config.recaptcha.bypassAllowedOrigins, origin) || listAllowsOrigin(config.allowedOrigins, origin);
};
