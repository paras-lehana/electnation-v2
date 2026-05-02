/**
 * Zod schemas mirror the shapes in ../types. They are used at every trust
 * boundary: HTTP body validation, Firestore writes, and LLM tool outputs.
 */

import { z } from 'zod';

export const LocaleSchema = z.enum([
  'en',
  'as',
  'hi',
  'bn',
  'brx',
  'doi',
  'gu',
  'kn',
  'ks',
  'kok',
  'mai',
  'ml',
  'mni',
  'mr',
  'ne',
  'or',
  'pa',
  'sa',
  'sat',
  'sd',
  'ta',
  'te',
  'ur',
]);

export const LiteracyComfortSchema = z.enum(['audio-first', 'easy', 'standard']);
export const AgeBandSchema = z.enum(['18-24', '25-34', '35-49', '50-64', '65+']);
export const PreferredChannelSchema = z.enum(['whatsapp', 'sms', 'push', 'email', 'none']);

export const LocalizedStringSchema = z
  .object({ en: z.string().min(1) })
  .catchall(z.string().optional());

export const VoterPersonaSchema = z.object({
  id: z.string().min(1),
  ageBand: AgeBandSchema,
  isFirstTime: z.boolean(),
  isMigrant: z.boolean(),
  locale: LocaleSchema,
  literacyComfort: LiteracyComfortSchema,
  stateCode: z.string().length(2).optional(),
  constituencyApprox: z.string().max(120).optional(),
  preferredChannel: PreferredChannelSchema,
  createdAt: z.string().datetime(),
});

export const ElectionEventKindSchema = z.enum([
  'registration-deadline',
  'poll-day',
  'awareness',
  'result-day',
  'campaign-window',
]);

export const ElectionEventSchema = z.object({
  id: z.string(),
  kind: ElectionEventKindSchema,
  title: LocalizedStringSchema,
  description: LocalizedStringSchema.optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
  stateCode: z.string().length(2).optional(),
  eciSourceUrl: z.string().url().optional(),
});

export const ForwardCategorySchema = z.enum([
  'fake-news',
  'unverified-rumor',
  'misleading-context',
  'exaggerated-true',
  'benign',
  'hate-speech',
]);

export const ForwardAnalysisSchema = z.object({
  id: z.string(),
  inputText: z.string().min(1).max(4000),
  detectedLocale: LocaleSchema,
  category: ForwardCategorySchema,
  riskLevel: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  explanation: LocalizedStringSchema,
  verificationSteps: z.array(LocalizedStringSchema).max(10),
  eciSources: z.array(z.string().url()).max(10),
  analyzedAt: z.string().datetime(),
});

export const QuizOptionSchema = z.object({
  id: z.string(),
  label: LocalizedStringSchema,
});

export const QuizQuestionSchema = z.object({
  id: z.string(),
  scenario: LocalizedStringSchema,
  options: z.array(QuizOptionSchema).min(2).max(5),
  correctOptionId: z.string(),
  explanation: LocalizedStringSchema,
  tags: z.array(z.string()).max(10),
  xp: z.number().int().min(1).max(200),
  badgeReward: z.string().optional(),
});

export const ChatRequestSchema = z.object({
  personaId: z.string().optional(),
  locale: LocaleSchema,
  literacyComfort: LiteracyComfortSchema,
  message: z.string().min(1).max(2000),
  stepSlug: z
    .enum(['register', 'verify', 'candidates', 'spot-fake', 'poll-day', 'reflect'])
    .optional(),
});

export const ForwardAnalysisRequestSchema = z.object({
  text: z.string().min(10).max(4000),
  locale: LocaleSchema.optional(),
  recaptchaToken: z.string().min(10),
});

export const QuizSubmitRequestSchema = z.object({
  personaId: z.string(),
  questionId: z.string(),
  selectedOptionId: z.string(),
});

export const CalendarAddRequestSchema = z.object({
  events: z.array(ElectionEventSchema).min(1).max(20),
});

export const LeaderboardUpsertSchema = z.object({
  nickname: z
    .string()
    .min(2)
    .max(24)
    .regex(/^[a-zA-Z0-9_\- ]+$/),
  city: z.string().min(2).max(48).optional(),
  xp: z.number().int().min(0).max(1_000_000),
});
