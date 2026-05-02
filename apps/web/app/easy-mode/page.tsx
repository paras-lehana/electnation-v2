'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  getAccessibilityArchitectureScorecard,
  buildBrowserSpeechSettings,
  createAccessibleStatusMessage,
  getAccessibilityCoverageSummary,
  getAccessibilityFeatureBlueprints,
  getAccessibilityUserProfiles,
  getScheduledLanguageTtsPreset,
  getScheduledLanguageTtsPresets,
  type ScheduledLanguageCode,
} from '@yatra/core/accessibility';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const EASY_ACTIONS = [
  {
    href: '/yatra',
    label: 'Mera voting process',
    helper: 'Registration se polling booth tak',
    icon: '🛤️',
  },
  {
    href: '/clinic',
    label: 'Forward check karo',
    helper: 'WhatsApp rumor ko verify karo',
    icon: '🩺',
  },
  { href: '/map', label: 'Booth aur office dekho', helper: 'Map aur text list dono', icon: '🗺️' },
  {
    href: '/migrant-corner',
    label: 'Shehar badla hai?',
    helper: 'Migrant voter ke options',
    icon: '🚆',
  },
  {
    href: '/sanrakshan',
    label: 'Vote bachao',
    helper: 'Paise, gift, pressure se bachav',
    icon: '🛡️',
  },
  {
    href: '/pwd',
    label: 'Accessibility help',
    helper: 'PwD aur senior citizen support',
    icon: '♿',
  },
];

const LANGUAGE_PRESETS = getScheduledLanguageTtsPresets();
const COVERAGE_SUMMARY = getAccessibilityCoverageSummary();
const ARCHITECTURE_SCORECARD = getAccessibilityArchitectureScorecard();
const FEATURE_BLUEPRINTS = getAccessibilityFeatureBlueprints().slice(0, 4);
const USER_PROFILES = getAccessibilityUserProfiles();

const getVoiceSupportLabel = (voiceReadiness: string) => {
  if (voiceReadiness === 'native-google-tts') return 'Native read-aloud ready';
  if (voiceReadiness === 'browser-dependent') return 'Browser voice dependent';
  return 'Hindi fallback transcript';
};

export default function EasyModePage() {
  const [selectedLanguage, setSelectedLanguage] = useState<ScheduledLanguageCode>('hi');
  const [status, setStatus] = useState(createAccessibleStatusMessage('hi', 'ready'));

  const selectedPreset = getScheduledLanguageTtsPreset(selectedLanguage);
  const speechSettings = buildBrowserSpeechSettings(selectedLanguage);

  const speakGuide = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setStatus(
        'Audio is not available in this browser. The selected transcript is visible below.',
      );
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(speechSettings.text);
    utterance.lang =
      selectedPreset.voiceReadiness === 'fallback-scripted'
        ? speechSettings.fallbackLanguageCode
        : speechSettings.lang;
    utterance.rate = speechSettings.rate;
    utterance.pitch = speechSettings.pitch;
    utterance.onstart = () => setStatus(createAccessibleStatusMessage(selectedLanguage, 'reading'));
    utterance.onend = () => setStatus(createAccessibleStatusMessage(selectedLanguage, 'finished'));
    utterance.onerror = () =>
      setStatus('This browser could not start audio. The selected transcript is visible below.');
    window.speechSynthesis.speak(utterance);
  };

  const updateLanguage = (nextLanguage: ScheduledLanguageCode) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSelectedLanguage(nextLanguage);
    setStatus(createAccessibleStatusMessage(nextLanguage, 'ready'));
  };

  return (
    <main className="min-h-screen bg-leaf-50 pb-20" id="main">
      <section className="bg-white py-12 shadow-sm">
        <div className="container-yatra text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf-700">Easy Mode</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-ink-900 md:text-5xl">
            Bade buttons. Kam shabd. Audio-first.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-700">
            For community classes, low-literacy users, seniors, and anyone who wants the simplest
            path through Election Yatra.
          </p>
          <div className="mx-auto mt-7 grid max-w-3xl gap-4 rounded-2xl border border-leaf-100 bg-leaf-50 p-4 text-left shadow-sm md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <label
                htmlFor="easy-mode-language"
                className="text-sm font-bold uppercase tracking-[0.16em] text-leaf-800"
              >
                Read-aloud language
              </label>
              <select
                id="easy-mode-language"
                value={selectedLanguage}
                onChange={(event) => updateLanguage(event.target.value as ScheduledLanguageCode)}
                className="mt-2 min-h-12 w-full rounded-xl border-2 border-leaf-200 bg-white px-4 text-lg font-bold text-ink-900 focus:border-leaf-600 focus:outline-none focus:ring-4 focus:ring-leaf-200"
                aria-describedby="easy-mode-language-help"
                data-testid="easy-mode-language"
              >
                {LANGUAGE_PRESETS.map((preset) => (
                  <option key={preset.code} value={preset.code}>
                    {preset.nativeName} — {preset.englishName}
                  </option>
                ))}
              </select>
              <p id="easy-mode-language-help" className="mt-2 text-sm font-semibold text-ink-700">
                22 scheduled Indian language presets are prefilled with a text transcript and safe
                speech fallback.
              </p>
            </div>
            <Button
              onClick={speakGuide}
              className="min-h-14 bg-leaf-600 px-8 text-lg hover:bg-leaf-700"
              data-testid="easy-mode-listen"
            >
              🔊 Listen
            </Button>
          </div>
          <div className="mt-4 flex flex-col items-center gap-2">
            <p
              role="status"
              aria-live="polite"
              className="text-sm font-semibold text-ink-700"
              data-testid="easy-mode-status"
            >
              {status}
            </p>
            <p className="text-sm font-bold text-leaf-800" data-testid="easy-mode-voice-support">
              {selectedPreset.nativeName} ({selectedPreset.englishName}):{' '}
              {getVoiceSupportLabel(selectedPreset.voiceReadiness)}
            </p>
          </div>
        </div>
      </section>

      <section
        className="container-yatra mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Easy Mode actions"
      >
        {EASY_ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="block rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-leaf-500"
          >
            <Card
              className="min-h-52 border-2 border-leaf-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-leaf-300 hover:shadow-lg motion-reduce:hover:translate-y-0"
              data-testid={`easy-action-${action.href.slice(1)}`}
            >
              <div className="text-5xl" aria-hidden="true">
                {action.icon}
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold text-ink-900">{action.label}</h2>
              <p className="mt-3 text-base font-semibold text-ink-600">{action.helper}</p>
            </Card>
          </Link>
        ))}
      </section>

      <section className="container-yatra mt-8">
        <Card className="bg-white p-6 text-lg leading-8 text-ink-800">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-leaf-700">
                Selected transcript
              </p>
              <h2 className="font-display text-2xl font-bold text-ink-900">
                {selectedPreset.nativeName} guide
              </h2>
            </div>
            <span className="w-fit rounded-full bg-leaf-100 px-3 py-1 text-sm font-bold text-leaf-900">
              {selectedPreset.bcp47}
            </span>
          </div>
          <p className="mt-4" lang={selectedPreset.bcp47} data-testid="easy-mode-transcript">
            {selectedPreset.easyModeGuide}
          </p>
          <p className="mt-4 text-base font-semibold text-ink-600">
            If you are confused, start with “Mera voting process”. If a message feels suspicious,
            use “Forward check karo”. If someone offers money, gifts, or pressure, open “Vote
            bachao”.
          </p>
        </Card>
      </section>

      <section className="container-yatra mt-8" aria-labelledby="accessibility-evidence-heading">
        <Card className="border-2 border-leaf-100 bg-white p-6 text-ink-800">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-leaf-700">
            Accessibility evidence
          </p>
          <h2
            id="accessibility-evidence-heading"
            className="mt-2 font-display text-2xl font-bold text-ink-900"
          >
            Built for assisted, mobile, and classroom use
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-leaf-50 p-4">
              <p className="text-3xl font-black text-leaf-900">
                {COVERAGE_SUMMARY.scheduledLanguages}
              </p>
              <p className="mt-1 text-sm font-bold text-ink-700">language presets</p>
            </div>
            <div className="rounded-xl bg-saffron-50 p-4">
              <p className="text-3xl font-black text-saffron-900">
                {COVERAGE_SUMMARY.implementedOrTested}
              </p>
              <p className="mt-1 text-sm font-bold text-ink-700">implemented or tested aids</p>
            </div>
            <div className="rounded-xl bg-white p-4 ring-1 ring-ink-100">
              <p className="text-3xl font-black text-ink-900">
                {COVERAGE_SUMMARY.nativeGoogleTtsLanguages}
              </p>
              <p className="mt-1 text-sm font-bold text-ink-700">native TTS-ready groups</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-white p-4 ring-1 ring-ink-100">
              <p className="text-2xl font-black text-ink-900">
                {ARCHITECTURE_SCORECARD.featureBlueprints}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-ink-600">
                feature blueprints
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 ring-1 ring-ink-100">
              <p className="text-2xl font-black text-ink-900">
                {ARCHITECTURE_SCORECARD.userProfiles}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-ink-600">
                user profiles
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 ring-1 ring-ink-100">
              <p className="text-2xl font-black text-ink-900">
                {ARCHITECTURE_SCORECARD.inputModesCovered}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-ink-600">
                input modes
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 ring-1 ring-ink-100">
              <p className="text-2xl font-black text-ink-900">
                {ARCHITECTURE_SCORECARD.wcagCriteriaReferenced}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-ink-600">
                WCAG refs
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2" data-testid="accessibility-blueprints">
            {FEATURE_BLUEPRINTS.map((feature) => (
              <div key={feature.id} className="rounded-xl border border-leaf-100 bg-leaf-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-ink-900">{feature.title}</h3>
                  <span className="rounded-full bg-white px-2 py-1 text-xs font-black uppercase tracking-[0.12em] text-leaf-800 ring-1 ring-leaf-100">
                    {feature.status}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-ink-700">
                  {feature.parameters.length} parameters · {feature.inputModes.join(', ')}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm font-semibold text-ink-700">
            Profile presets: {USER_PROFILES.map((profile) => profile.title).join(' · ')}.
          </p>
        </Card>
      </section>
    </main>
  );
}
