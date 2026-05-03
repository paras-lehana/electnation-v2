/**
 * Browser-side Election Yatra API client.
 *
 * Client components import this module instead of hand-building API URLs,
 * JSON requests, fallback payloads, or Server-Sent Event parsing in each UI.
 */

import type { ForwardAnalysis, LiteracyComfort, Locale } from '@yatra/core';

export type ForwardClinicMode = 'llm-service' | 'demo' | 'fallback';

export type ForwardClinicResult = ForwardAnalysis & {
  recommendedAction: string;
  mode: ForwardClinicMode;
  recaptcha?: { bypassed: boolean };
};

export interface AnalyzeForwardMessageRequest {
  text: string;
  locale?: Locale;
  recaptchaToken?: string;
}

export interface ChatStreamRequest {
  locale: Locale;
  literacyComfort: LiteracyComfort;
  message: string;
}

interface ApiErrorPayload {
  error?: {
    code?: string;
    message?: string;
  };
}

const DEFAULT_API_BASE_URL = 'https://electnation-api-767171449038.us-central1.run.app';
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/+$/, '');
export const CHAT_STREAM_FALLBACK_MESSAGE = 'Maaf karna, abhi main thoda busy hoon. Kripya baad mein try karein.';

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status: number, code = 'API_REQUEST_FAILED') {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
  }
}

const apiUrl = (path: string): string => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

const readErrorMessage = async (response: Response): Promise<{ message: string; code: string }> => {
  const fallback = { message: `API request failed with HTTP ${response.status}.`, code: 'API_REQUEST_FAILED' };
  try {
    const payload = (await response.json()) as ApiErrorPayload;
    return {
      message: payload.error?.message ?? fallback.message,
      code: payload.error?.code ?? fallback.code,
    };
  } catch {
    return fallback;
  }
};

const assertOkResponse = async (response: Response): Promise<void> => {
  if (response.ok) return;

  const error = await readErrorMessage(response);
  throw new ApiClientError(error.message, response.status, error.code);
};

const postJson = async <ResponseBody>(path: string, body: unknown): Promise<ResponseBody> => {
  const response = await fetch(apiUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  await assertOkResponse(response);

  return response.json() as Promise<ResponseBody>;
};

export const analyzeForwardMessage = async ({
  text,
  locale = 'en',
  recaptchaToken,
}: AnalyzeForwardMessageRequest): Promise<ForwardClinicResult> =>
  postJson<ForwardClinicResult>('/api/forward/analysis', {
    text,
    locale,
    ...(recaptchaToken ? { recaptchaToken } : {}),
  });

export const createForwardAnalysisFallback = (text: string, locale: Locale = 'en'): ForwardClinicResult => ({
  id: 'browser-fallback-forward-analysis',
  inputText: text,
  detectedLocale: locale,
  analyzedAt: new Date().toISOString(),
  category: 'unverified-rumor',
  riskLevel: 3,
  explanation: {
    en: 'We encountered an error while analyzing this message. Please try again later or consult official ECI channels.',
  },
  verificationSteps: [{ en: 'Visit eci.gov.in or voters.eci.gov.in for official information.' }],
  eciSources: ['https://eci.gov.in', 'https://voters.eci.gov.in'],
  recommendedAction: 'Visit eci.gov.in for official information.',
  mode: 'fallback',
  recaptcha: { bypassed: true },
});

export const parseSseDataFrames = (buffer: string): { dataFrames: string[]; remainder: string } => {
  const normalized = buffer.replace(/\r\n/g, '\n');
  const blocks = normalized.split('\n\n');
  const remainder = blocks.pop() ?? '';
  const dataFrames = blocks.flatMap((block) => {
    const dataLines = block
      .split('\n')
      .map((line) => line.trimEnd())
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice('data:'.length).trimStart());

    return dataLines.length > 0 ? [dataLines.join('\n')] : [];
  });

  return { dataFrames, remainder };
};

const handleChatDataFrame = (dataFrame: string, onDelta: (delta: string) => void): boolean => {
  if (dataFrame === '[DONE]') return true;

  const payload = JSON.parse(dataFrame) as { delta?: unknown; error?: unknown; message?: unknown };
  if (typeof payload.error === 'string') {
    throw new ApiClientError(typeof payload.message === 'string' ? payload.message : payload.error, 502, payload.error);
  }
  if (typeof payload.delta === 'string') onDelta(payload.delta);
  return false;
};

export const streamChatResponse = async (
  request: ChatStreamRequest,
  onDelta: (delta: string) => void,
): Promise<void> => {
  const response = await fetch(apiUrl('/api/chat'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  await assertOkResponse(response);

  const reader = response.body?.getReader();
  if (!reader) throw new ApiClientError('Streaming response body is unavailable.', 0, 'STREAM_UNAVAILABLE');

  const decoder = new TextDecoder();
  let buffer = '';
  let streamCompleted = false;

  while (!streamCompleted) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parsed = parseSseDataFrames(buffer);
    buffer = parsed.remainder;

    for (const dataFrame of parsed.dataFrames) {
      streamCompleted = handleChatDataFrame(dataFrame, onDelta);
      if (streamCompleted) break;
    }
  }

  buffer += decoder.decode();
  if (!streamCompleted && buffer.trim()) {
    const parsed = parseSseDataFrames(`${buffer}\n\n`);
    for (const dataFrame of parsed.dataFrames) {
      streamCompleted = handleChatDataFrame(dataFrame, onDelta);
      if (streamCompleted) break;
    }
  }
};