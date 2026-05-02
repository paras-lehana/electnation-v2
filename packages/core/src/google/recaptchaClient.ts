/**
 * reCAPTCHA Enterprise wrapper used by public AI endpoints.
 * The client is dependency-injected and returns Result so route handlers can
 * keep a stable error surface in production and deterministic bypass in tests.
 */

import { createError, type AppError } from '../errors.js';
import { err, ok, type Result } from '../result.js';

export interface RecaptchaClientConfig {
  projectId: string;
  siteKey: string;
  apiKey: string;
  minScore?: number;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
}

export interface RecaptchaVerificationInput {
  token: string;
  expectedAction: string;
  userIpAddress?: string;
  userAgent?: string;
}

export interface RecaptchaVerification {
  valid: boolean;
  score: number;
  reasons: string[];
  action?: string;
}

export interface RecaptchaClient {
  verify(input: RecaptchaVerificationInput): Promise<Result<RecaptchaVerification, AppError>>;
}

export class GoogleRecaptchaEnterpriseClient implements RecaptchaClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(private readonly config: RecaptchaClientConfig) {
    this.baseUrl = config.baseUrl ?? 'https://recaptchaenterprise.googleapis.com/v1';
    this.fetchImpl = config.fetchImpl ?? fetch;
  }

  async verify(input: RecaptchaVerificationInput): Promise<Result<RecaptchaVerification, AppError>> {
    if (!this.config.projectId || !this.config.siteKey || !this.config.apiKey) {
      return err(
        createError('CONFIG_MISSING', {
          internalHint: 'recaptcha.projectId/siteKey/apiKey missing',
        }),
      );
    }

    const url = new URL(`${this.baseUrl}/projects/${this.config.projectId}/assessments`);
    url.searchParams.set('key', this.config.apiKey);

    try {
      const response = await this.fetchImpl(url.toString(), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          event: {
            token: input.token,
            siteKey: this.config.siteKey,
            expectedAction: input.expectedAction,
            userIpAddress: input.userIpAddress,
            userAgent: input.userAgent,
          },
        }),
      });

      if (!response.ok) {
        const body = await response.text().catch(() => '');
        return err(
          createError('UPSTREAM_FAILURE', {
            internalHint: `recaptcha.http.${response.status}.${body.slice(0, 120)}`,
          }),
        );
      }

      const json = (await response.json()) as {
        tokenProperties?: { valid?: boolean; action?: string; invalidReason?: string };
        riskAnalysis?: { score?: number; reasons?: string[] };
      };
      const score = json.riskAnalysis?.score ?? 0;
      const valid = Boolean(json.tokenProperties?.valid) && score >= (this.config.minScore ?? 0.5);

      return ok({
        valid,
        score,
        action: json.tokenProperties?.action,
        reasons: [
          ...(json.riskAnalysis?.reasons ?? []),
          ...(json.tokenProperties?.invalidReason ? [json.tokenProperties.invalidReason] : []),
        ],
      });
    } catch (cause) {
      return err(createError('UPSTREAM_FAILURE', { cause, internalHint: 'recaptcha.verify' }));
    }
  }
}
