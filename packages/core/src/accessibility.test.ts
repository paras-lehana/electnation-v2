import { describe, expect, it } from 'vitest';
import {
  buildAccessibilityImplementationPlan,
  buildAccessibilityPreferenceProfile,
  buildAccessibleTranscriptCue,
  buildBrowserSpeechSettings,
  buildFacilitatorPromptDeck,
  buildGoogleTtsRequestDraft,
  buildOfflineAccessibilityPacket,
  buildVoiceInputDraft,
  createAccessibleStatusMessage,
  getAccessibilityArchitectureScorecard,
  getAccessibilityCoverageSummary,
  getAccessibilityEvidenceCatalog,
  getAccessibilityFeatureBlueprints,
  getAccessibilityUserProfiles,
  getAssistiveTechTestMatrix,
  getEasyModeGuideText,
  getScheduledLanguageTtsPreset,
  getScheduledLanguageTtsPresets,
  getSupportedLocaleCodes,
  isScheduledLanguageCode,
} from './accessibility';

describe('accessibility evidence and language presets', () => {
  it('covers all 22 scheduled Indian languages with TTS presets', () => {
    const presets = getScheduledLanguageTtsPresets();

    expect(presets).toHaveLength(22);
    expect(getSupportedLocaleCodes()).toContain('hi');
    expect(getSupportedLocaleCodes()).toContain('sat');
    expect(new Set(presets.map((preset) => preset.code)).size).toBe(22);
    expect(presets.every((preset) => preset.easyModeGuide.length > 40)).toBe(true);
  });

  it('builds browser and Google TTS settings from the same preset source', () => {
    const browserSettings = buildBrowserSpeechSettings('ta');
    const googleDraft = buildGoogleTtsRequestDraft(browserSettings.text, 'ta');

    expect(browserSettings.lang).toBe('ta-IN');
    expect(googleDraft.languageCode).toBe('ta-IN');
    expect(googleDraft.audioEncoding).toBe('MP3');
  });

  it('prioritizes exact BCP-47 language matches before shared fallback TTS codes', () => {
    expect(getScheduledLanguageTtsPreset('hi-IN').code).toBe('hi');
    expect(getScheduledLanguageTtsPreset('ur-IN').code).toBe('ur');
  });

  it('falls back safely for scheduled languages without reliable native TTS voices', () => {
    const preset = getScheduledLanguageTtsPreset('sat');
    const draft = buildGoogleTtsRequestDraft(getEasyModeGuideText('sat'), 'sat');

    expect(preset.voiceReadiness).toBe('fallback-scripted');
    expect(draft.languageCode).toBe('hi-IN');
    expect(createAccessibleStatusMessage('sat', 'ready')).toContain('fallback voice');
  });

  it('exposes honest reviewer evidence instead of fake feature claims', () => {
    const evidence = getAccessibilityEvidenceCatalog();
    const matrix = getAssistiveTechTestMatrix();
    const summary = getAccessibilityCoverageSummary();

    expect(evidence.some((item) => item.status === 'planned')).toBe(true);
    expect(evidence.some((item) => item.status === 'tested')).toBe(true);
    expect(matrix.map((check) => check.inputMode)).toContain('screen-reader');
    expect(summary.scheduledLanguages).toBe(22);
    expect(summary.implementedOrTested).toBeGreaterThan(3);
  });

  it('recognizes only configured scheduled language codes', () => {
    expect(isScheduledLanguageCode('hi')).toBe(true);
    expect(isScheduledLanguageCode('fr')).toBe(false);
  });

  it('exposes broad accessibility blueprints with parameters and status separation', () => {
    const blueprints = getAccessibilityFeatureBlueprints();
    const scorecard = getAccessibilityArchitectureScorecard();

    expect(blueprints.length).toBeGreaterThanOrEqual(10);
    expect(blueprints.every((feature) => feature.parameters.length > 0)).toBe(true);
    expect(getAccessibilityFeatureBlueprints('planned').length).toBeGreaterThanOrEqual(1);
    expect(getAccessibilityFeatureBlueprints('scaffolded').length).toBeGreaterThanOrEqual(3);
    expect(scorecard.inputModesCovered).toBeGreaterThanOrEqual(7);
    expect(scorecard.wcagCriteriaReferenced).toBeGreaterThan(10);
  });

  it('builds accessibility preference profiles and implementation plans', () => {
    const profiles = getAccessibilityUserProfiles();
    const profile = buildAccessibilityPreferenceProfile('audio-first-senior-voter', {
      languageCode: 'ta',
      textScale: 1.3,
    });
    const plan = buildAccessibilityImplementationPlan('audio-first-senior-voter');

    expect(profiles.length).toBeGreaterThanOrEqual(4);
    expect(profile.preferences.languageCode).toBe('ta');
    expect(profile.preferences.textScale).toBe(1.3);
    expect(profile.featureBlueprints.map((feature) => feature.id)).toContain(
      'scheduled-language-read-aloud',
    );
    expect(plan.implemented.length + plan.scaffolded.length + plan.planned.length).toBe(
      profile.featureBlueprints.length,
    );
    expect(plan.nextTestTasks.length).toBeGreaterThan(0);
  });

  it('creates structured helper drafts for transcripts, voice input, offline packets, and classrooms', () => {
    const cue = buildAccessibleTranscriptCue('Read this aloud', 'ur', 2);
    const voiceDraft = buildVoiceInputDraft('Mera naam list mein hai kya?', 'hi');
    const packet = buildOfflineAccessibilityPacket('bn');
    const deck = buildFacilitatorPromptDeck('mr', 20);

    expect(cue.lang).toBe('ur-IN');
    expect(cue.ariaLabel).toContain('Urdu');
    expect(voiceDraft.confirmationRequired).toBe(true);
    expect(voiceDraft.canSubmit).toBe(false);
    expect(packet.officialLinks).toContain('https://voters.eci.gov.in');
    expect(deck.groupSize).toBe(20);
    expect(deck.prompts.length).toBeGreaterThanOrEqual(4);
  });
});
