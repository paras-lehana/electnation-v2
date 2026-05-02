/**
 * Domain types for Election Yatra.
 *
 * These describe how the app reasons about voters, the election journey,
 * misinformation analysis, quiz content, and gamification rewards. Types are
 * shared across the Next.js frontend and the API backend so both ends agree
 * on shape without drifting.
 */

export type Locale =
  | 'en'
  | 'as'
  | 'bn'
  | 'brx'
  | 'doi'
  | 'gu'
  | 'hi'
  | 'kn'
  | 'ks'
  | 'kok'
  | 'mai'
  | 'ml'
  | 'mni'
  | 'mr'
  | 'ne'
  | 'or'
  | 'pa'
  | 'sa'
  | 'sat'
  | 'sd'
  | 'ta'
  | 'te'
  | 'ur';

export type LiteracyComfort = 'audio-first' | 'easy' | 'standard';
export type AgeBand = '18-24' | '25-34' | '35-49' | '50-64' | '65+';
export type PreferredChannel = 'whatsapp' | 'sms' | 'push' | 'email' | 'none';

export interface VoterPersona {
  id: string;
  ageBand: AgeBand;
  isFirstTime: boolean;
  isMigrant: boolean;
  locale: Locale;
  literacyComfort: LiteracyComfort;
  stateCode?: string;
  constituencyApprox?: string;
  preferredChannel: PreferredChannel;
  createdAt: string;
}

export interface LocalizedString {
  en: string;
  hi?: string;
  [locale: string]: string | undefined;
}

export type ElectionEventKind =
  | 'registration-deadline'
  | 'poll-day'
  | 'awareness'
  | 'result-day'
  | 'campaign-window';

export interface ElectionEvent {
  id: string;
  kind: ElectionEventKind;
  title: LocalizedString;
  description?: LocalizedString;
  startsAt: string;
  endsAt?: string;
  stateCode?: string;
  eciSourceUrl?: string;
}

export interface ElectionSubstep {
  id: string;
  title: LocalizedString;
  body: LocalizedString;
  eciSourceUrl?: string;
}

export interface ElectionStep {
  id: string;
  slug: 'register' | 'verify' | 'candidates' | 'spot-fake' | 'poll-day' | 'reflect';
  order: number;
  title: LocalizedString;
  summary: LocalizedString;
  substeps: ElectionSubstep[];
  remindersSuggested: ElectionEvent[];
}

/**
 * Output of the misinformation/forward analysis flow.
 * `riskLevel` is 1 (benign) to 5 (actively harmful / dangerous claim).
 */
export type ForwardCategory =
  | 'fake-news'
  | 'unverified-rumor'
  | 'misleading-context'
  | 'exaggerated-true'
  | 'benign'
  | 'hate-speech';

export interface ForwardAnalysis {
  id: string;
  inputText: string;
  detectedLocale: Locale;
  category: ForwardCategory;
  riskLevel: 1 | 2 | 3 | 4 | 5;
  explanation: LocalizedString;
  verificationSteps: LocalizedString[];
  eciSources: string[];
  analyzedAt: string;
}

export interface QuizOption {
  id: string;
  label: LocalizedString;
}

export interface QuizQuestion {
  id: string;
  scenario: LocalizedString;
  options: QuizOption[];
  correctOptionId: string;
  explanation: LocalizedString;
  tags: string[];
  xp: number;
  badgeReward?: string;
}

export interface BadgeDefinition {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  icon: string;
  unlockCriteria: LocalizedString;
}

export interface UserProgress {
  personaId: string;
  xp: number;
  streakDays: number;
  lastActiveAt: string;
  completedStepIds: string[];
  seenQuestionIds: string[];
  unlockedBadgeIds: string[];
}

export interface LeaderboardEntry {
  nickname: string;
  city?: string;
  xp: number;
  badgesCount: number;
  updatedAt: string;
}

/** Chat request: user message + persona context; server builds system prompt. */
export interface ChatRequest {
  personaId?: string;
  locale: Locale;
  literacyComfort: LiteracyComfort;
  message: string;
  stepSlug?: ElectionStep['slug'];
}

export interface PollingFacility {
  id: string;
  name: string;
  kind: 'polling-station' | 'ero-office' | 'district-hq';
  lat: number;
  lng: number;
  address: string;
  stateCode: string;
  distanceKm?: number;
  durationMin?: number;
}
