import { describe, expect, it } from 'vitest';
import { LlmServiceClient } from './llmServiceClient.js';
import type { AppConfig } from '../config.js';

const baseConfig: AppConfig['llmService'] = {
  enabled: true,
  baseUrl: 'https://llm.lehana.in',
  endpointName: 'antigravity-manager',
  model: 'gemini-3-flash',
  provider: 'custom',
  providerBaseUrl: 'https://antigravity.aidhunik.com/v1',
  apiKey: '',
  internalKey: '',
  useByok: false,
  timeoutMs: 5_000,
};

describe('LlmServiceClient', () => {
  it('calls SMK with the configured Antigravity endpoint and model', async () => {
    const calls: Array<{ url: string; init: RequestInit }> = [];
    const fakeFetch: typeof fetch = async (url, init) => {
      calls.push({ url: String(url), init: init ?? {} });
      return new Response(JSON.stringify({ choices: [{ message: { content: 'ok-election-yatra' } }] }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    };

    const client = new LlmServiceClient({ ...baseConfig, internalKey: 'test-internal-key' }, fakeFetch);
    const result = await client.generate({
      systemPrompt: 'system',
      messages: [{ role: 'user', content: 'hello' }],
      temperature: 0,
      maxTokens: 20,
    });

    expect(result.content).toBe('ok-election-yatra');
    expect(result.mode).toBe('smk');
    expect(calls[0]?.url).toBe('https://llm.lehana.in/smk/antigravity-manager');
    expect((calls[0]?.init.headers as Record<string, string>)['x-internal-key']).toBe('test-internal-key');
    expect(JSON.parse(String(calls[0]?.init.body))).toMatchObject({ model: 'gemini-3-flash' });
  });

  it('prefers BYOK when a provider key is configured and falls back to SMK on failure', async () => {
    const paths: string[] = [];
    const fakeFetch: typeof fetch = async (url) => {
      paths.push(String(url));
      if (String(url).endsWith('/byok')) {
        return new Response('auth failed', { status: 401 });
      }
      return new Response(JSON.stringify({ choices: [{ message: { content: '{"category":"benign"}' } }] }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    };

    const client = new LlmServiceClient({ ...baseConfig, apiKey: 'secret-provider-key', useByok: true }, fakeFetch);
    const result = await client.generate({
      systemPrompt: 'system',
      messages: [{ role: 'user', content: 'hello' }],
      temperature: 0,
      maxTokens: 20,
      jsonMode: true,
    });

    expect(paths).toEqual(['https://llm.lehana.in/byok', 'https://llm.lehana.in/smk/antigravity-manager']);
    expect(result.mode).toBe('smk');
  });

  it('does not leak upstream response bodies or auth material in thrown errors', async () => {
    const fakeFetch: typeof fetch = async () =>
      new Response('secret-provider-key x-internal-key=secret-internal-key', { status: 500 });

    const client = new LlmServiceClient(
      { ...baseConfig, internalKey: 'secret-internal-key', endpointName: 'antigravity-manager' },
      fakeFetch,
    );

    await expect(
      client.generate({
        systemPrompt: 'system',
        messages: [{ role: 'user', content: 'hello' }],
        temperature: 0,
        maxTokens: 20,
      }),
    ).rejects.toThrow('llm-service HTTP 500');
  });
});