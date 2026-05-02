/**
 * Backend-only llm-service adapter.
 *
 * The browser talks only to Election Yatra APIs. This client keeps Antigravity
 * keys and llm-service auth inside Cloud Run env/Secret Manager, then calls
 * llm.lehana.in with OpenAI-compatible messages.
 */

import type { AppConfig } from '../config.js';

type LlmRole = 'system' | 'user' | 'assistant';

export interface LlmMessage {
  role: LlmRole;
  content: string;
}

export interface LlmGenerateInput {
  systemPrompt: string;
  messages: LlmMessage[];
  temperature: number;
  maxTokens: number;
  jsonMode?: boolean;
}

export interface LlmGenerateResult {
  content: string;
  mode: 'byok' | 'smk';
  model: string;
  endpoint?: string;
}

interface LlmAttempt {
  mode: 'byok' | 'smk';
  path: string;
  body: Record<string, unknown>;
}

const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, '');

const readAssistantContent = (payload: unknown): string => {
  const content = (payload as { choices?: Array<{ message?: { content?: unknown } }> })
    ?.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || content.trim().length === 0) {
    throw new Error('llm-service returned an empty assistant message');
  }
  return content;
};

export class LlmServiceClient {
  private readonly config: AppConfig['llmService'];
  private readonly fetchImpl: typeof fetch;

  constructor(config: AppConfig['llmService'], fetchImpl: typeof fetch = fetch) {
    this.config = config;
    this.fetchImpl = fetchImpl;
  }

  isConfigured(): boolean {
    return Boolean(this.config.enabled && this.config.baseUrl && (this.config.endpointName || this.config.apiKey));
  }

  async generate(input: LlmGenerateInput): Promise<LlmGenerateResult> {
    if (!this.isConfigured()) {
      throw new Error('llm-service is not configured');
    }

    const commonBody = {
      messages: input.messages,
      model: this.config.model,
      temperature: input.temperature,
      max_tokens: input.maxTokens,
      stream: false,
      system_prompt: input.systemPrompt,
      json_mode: input.jsonMode ?? false,
    };

    const attempts: LlmAttempt[] = [];
    if (this.config.useByok && this.config.apiKey) {
      attempts.push({
        mode: 'byok',
        path: '/byok',
        body: {
          ...commonBody,
          api_key: this.config.apiKey,
          provider: this.config.provider,
          base_url: this.config.providerBaseUrl,
        },
      });
    }

    if (this.config.endpointName) {
      attempts.push({
        mode: 'smk',
        path: `/smk/${encodeURIComponent(this.config.endpointName)}`,
        body: commonBody,
      });
    }

    let lastError: unknown;
    for (const attempt of attempts) {
      try {
        const payload = await this.postJson(attempt.path, attempt.body);
        return {
          content: readAssistantContent(payload),
          mode: attempt.mode,
          model: this.config.model,
          endpoint: attempt.mode === 'smk' ? this.config.endpointName : undefined,
        };
      } catch (cause) {
        lastError = cause;
      }
    }

    throw lastError instanceof Error ? lastError : new Error('llm-service request failed');
  }

  private async postJson(path: string, body: Record<string, unknown>): Promise<unknown> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);
    const url = `${trimTrailingSlash(this.config.baseUrl)}${path}`;

    try {
      const response = await this.fetchImpl(url, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        await response.body?.cancel().catch(() => undefined);
        throw new Error(`llm-service HTTP ${response.status}`);
      }

      return response.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  private headers(): Record<string, string> {
    const headers: Record<string, string> = { 'content-type': 'application/json' };
    if (this.config.internalKey) {
      headers['x-internal-key'] = this.config.internalKey;
    }
    return headers;
  }
}