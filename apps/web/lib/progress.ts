export interface CivicProgress {
  xp: number;
  completedScenarioIds: string[];
  earnedBadgeIds: string[];
  lastPlayedAt?: string;
}

export interface ScenarioReward {
  scenarioId: string;
  xp: number;
  badgeId: string;
}

export const PROGRESS_STORAGE_KEY = 'election_yatra_progress_v1';

export const BADGE_LABELS: Record<string, string> = {
  'first-step': 'First Step',
  'cvigil-reporter': 'cVIGIL Reporter',
  'vote-sanrakshak': 'Vote Sanrakshak',
  'misinfo-shield': 'Misinfo Shield',
  'migrant-ready': 'Migrant Ready',
};

export const EMPTY_PROGRESS: CivicProgress = {
  xp: 0,
  completedScenarioIds: [],
  earnedBadgeIds: [],
};

const unique = <T>(items: T[]): T[] => Array.from(new Set(items));

export const readProgress = (): CivicProgress => {
  if (typeof window === 'undefined') return EMPTY_PROGRESS;
  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<CivicProgress>;
    return {
      xp: Number(parsed.xp ?? 0),
      completedScenarioIds: Array.isArray(parsed.completedScenarioIds) ? parsed.completedScenarioIds : [],
      earnedBadgeIds: Array.isArray(parsed.earnedBadgeIds) ? parsed.earnedBadgeIds : [],
      lastPlayedAt: parsed.lastPlayedAt,
    };
  } catch {
    return EMPTY_PROGRESS;
  }
};

export const writeProgress = (progress: CivicProgress): CivicProgress => {
  if (typeof window === 'undefined') return progress;
  window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  window.dispatchEvent(new CustomEvent('election-yatra-progress', { detail: progress }));
  return progress;
};

export const claimScenarioReward = (reward: ScenarioReward): CivicProgress => {
  const current = readProgress();
  if (current.completedScenarioIds.includes(reward.scenarioId)) return current;
  return writeProgress({
    xp: current.xp + reward.xp,
    completedScenarioIds: unique([...current.completedScenarioIds, reward.scenarioId]),
    earnedBadgeIds: unique(['first-step', ...current.earnedBadgeIds, reward.badgeId]),
    lastPlayedAt: new Date().toISOString(),
  });
};
