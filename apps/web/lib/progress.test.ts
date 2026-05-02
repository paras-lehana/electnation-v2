import { beforeEach, describe, expect, it } from 'vitest';
import { claimScenarioReward, PROGRESS_STORAGE_KEY, readProgress } from './progress';

describe('progress ledger', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('awards scenario XP and badges once', () => {
    const first = claimScenarioReward({
      scenarioId: 'vote-sanrakshan',
      xp: 120,
      badgeId: 'vote-sanrakshak',
    });
    const second = claimScenarioReward({
      scenarioId: 'vote-sanrakshan',
      xp: 120,
      badgeId: 'vote-sanrakshak',
    });

    expect(first.xp).toBe(120);
    expect(second.xp).toBe(120);
    expect(second.completedScenarioIds).toEqual(['vote-sanrakshan']);
    expect(second.earnedBadgeIds).toContain('first-step');
    expect(second.earnedBadgeIds).toContain('vote-sanrakshak');
    expect(JSON.parse(window.localStorage.getItem(PROGRESS_STORAGE_KEY) ?? '{}')).toMatchObject({
      xp: 120,
    });
  });

  it('recovers safely from malformed localStorage', () => {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, '{bad json');
    expect(readProgress()).toMatchObject({ xp: 0, completedScenarioIds: [], earnedBadgeIds: [] });
  });
});
