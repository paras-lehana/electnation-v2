import { describe, expect, it } from 'vitest';
import {
  LocaleSchema,
  ChatRequestSchema,
  ForwardAnalysisRequestSchema,
  ForwardAnalysisSchema,
  CalendarAddRequestSchema,
} from './schemas/index.js';

describe('shared Zod schemas', () => {
  it('accepts Election Yatra scheduled language locales', () => {
    expect(LocaleSchema.safeParse('sat').success).toBe(true);
    expect(LocaleSchema.safeParse('doi').success).toBe(true);
    expect(LocaleSchema.safeParse('fr').success).toBe(false);
  });

  it('validates chat requests for Chunav Saathi', () => {
    const parsed = ChatRequestSchema.safeParse({
      locale: 'hi',
      literacyComfort: 'easy',
      message: 'Mera voter registration kaise check karu?',
      stepSlug: 'register',
    });
    expect(parsed.success).toBe(true);
  });

  it('rejects unsafe short forward analysis payloads', () => {
    const parsed = ForwardAnalysisRequestSchema.safeParse({
      text: 'fake',
      recaptchaToken: 'demo-bypass-token',
    });
    expect(parsed.success).toBe(false);
  });

  it('validates forward analysis output shape', () => {
    const parsed = ForwardAnalysisSchema.safeParse({
      id: 'analysis-1',
      inputText: 'EVM bluetooth hack rumor forwarded many times',
      detectedLocale: 'en',
      category: 'fake-news',
      riskLevel: 5,
      explanation: { en: 'High-risk misinformation pattern.' },
      verificationSteps: [{ en: 'Verify on eci.gov.in.' }],
      eciSources: ['https://eci.gov.in'],
      analyzedAt: new Date().toISOString(),
    });
    expect(parsed.success).toBe(true);
  });

  it('validates calendar reminder batches', () => {
    const parsed = CalendarAddRequestSchema.safeParse({
      events: [
        {
          id: 'poll-day',
          kind: 'poll-day',
          title: { en: 'Polling day reminder' },
          startsAt: '2026-05-31T07:00:00.000Z',
          endsAt: '2026-05-31T07:30:00.000Z',
        },
      ],
    });
    expect(parsed.success).toBe(true);
  });
});
