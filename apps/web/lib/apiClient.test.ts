import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  analyzeForwardMessage,
  ApiClientError,
  CHAT_STREAM_FALLBACK_MESSAGE,
  createForwardAnalysisFallback,
  parseSseDataFrames,
  streamChatResponse,
} from './apiClient';

const stubFetch = (response: Response) => {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

const sseResponse = (chunks: string[]) => {
  const encoder = new TextEncoder();
  return new Response(
    new ReadableStream({
      start(controller) {
        chunks.forEach((chunk) => controller.enqueue(encoder.encode(chunk)));
        controller.close();
      },
    }),
  );
};

describe('apiClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('posts Forward Clinic analysis requests through the shared JSON helper', async () => {
    const responseBody = createForwardAnalysisFallback('Check this message');
    const fetchMock = stubFetch(
      new Response(JSON.stringify(responseBody), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(
      analyzeForwardMessage({ text: 'Check this message', locale: 'hi', recaptchaToken: 'token-123' }),
    ).resolves.toMatchObject({ mode: 'fallback', detectedLocale: 'en' });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://electnation-api-767171449038.us-central1.run.app/api/forward/analysis',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Check this message', locale: 'hi', recaptchaToken: 'token-123' }),
      }),
    );
  });

  it('throws a typed API error with server-provided details', async () => {
    stubFetch(
      new Response(JSON.stringify({ error: { code: 'RECAPTCHA_REQUIRED', message: 'Complete verification.' } }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(analyzeForwardMessage({ text: 'Suspicious forward' })).rejects.toMatchObject({
      name: 'ApiClientError',
      status: 403,
      code: 'RECAPTCHA_REQUIRED',
      message: 'Complete verification.',
    });
  });

  it('falls back to generic API errors when the response body is not JSON', async () => {
    stubFetch(new Response('Service unavailable', { status: 503 }));

    await expect(analyzeForwardMessage({ text: 'Suspicious forward' })).rejects.toBeInstanceOf(ApiClientError);
    await expect(analyzeForwardMessage({ text: 'Suspicious forward' })).rejects.toMatchObject({
      status: 503,
      code: 'API_REQUEST_FAILED',
    });
  });

  it('parses completed SSE data frames while preserving partial data', () => {
    expect(parseSseDataFrames('data: {"delta":"A"}\r\n\r\ndata: {"delta":"B"}\n')).toEqual({
      dataFrames: ['{"delta":"A"}'],
      remainder: 'data: {"delta":"B"}\n',
    });
  });

  it('streams chat deltas from split SSE chunks', async () => {
    stubFetch(
      sseResponse([
        'data: {"delta":"Register on "}\n\n',
        'data: {"delta":"voters.eci.gov.in"}\n\ndata: [DONE]\n\n',
      ]),
    );
    const deltas: string[] = [];

    await streamChatResponse(
      { locale: 'en', literacyComfort: 'standard', message: 'How do I register?' },
      (delta) => deltas.push(delta),
    );

    expect(deltas).toEqual(['Register on ', 'voters.eci.gov.in']);
  });

  it('exports one shared safe chat fallback message for UI reuse', () => {
    expect(CHAT_STREAM_FALLBACK_MESSAGE).toMatch(/Maaf karna/);
  });
});