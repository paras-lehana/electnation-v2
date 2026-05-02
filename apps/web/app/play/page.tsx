'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BADGE_LABELS, readProgress, type CivicProgress } from '@/lib/progress';

const SCENARIOS = [
  {
    id: 'chai-tapri',
    title: 'Chai Tapri Dilemma',
    description: 'A local candidate offers free gifts at the tea stall. What do you do?',
    icon: '☕',
    difficulty: 'Easy',
    points: 50,
  },
  {
    id: 'whatsapp-rush',
    title: 'WhatsApp Forward Rush',
    description: 'You have 60 seconds to classify 10 election forwards as real or fake.',
    icon: '📱',
    difficulty: 'Hard',
    points: 150,
  },
  {
    id: 'vote-sanrakshan',
    title: 'Vote Sanrakshan Sabha',
    description: 'A contractor offers cash and pressure before polling day. Protect your vote safely.',
    icon: '🛡️',
    difficulty: 'Medium',
    points: 120,
  },
  {
    id: 'booth-raasta',
    title: 'Booth ka Raasta',
    description: 'Navigate a migrant worker through the maze to register for a postal ballot.',
    icon: '🗺️',
    difficulty: 'Medium',
    points: 100,
  }
];

export default function PlayPage() {
  const [progress, setProgress] = useState<CivicProgress>(() => readProgress());

  useEffect(() => {
    const refresh = () => setProgress(readProgress());
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('election-yatra-progress', refresh as EventListener);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('election-yatra-progress', refresh as EventListener);
    };
  }, []);

  return (
    <main id="main" className="min-h-screen bg-khadi-50 pb-20">
      <div className="bg-saffron-50 py-16 border-b border-saffron-100">
        <div className="container-yatra text-center">
          <span className="inline-block px-4 py-1 bg-saffron-200 text-saffron-800 rounded-full text-sm font-bold mb-4 tracking-wider">
            DEMOCRACY KA TYOHAR
          </span>
          <h1 className="font-display text-4xl font-bold text-ink-900 md:text-5xl">
            Play & <span className="text-leaf-600">Learn</span>
          </h1>
          <p className="mt-4 mx-auto max-w-xl text-lg text-ink-700">
            Earn <strong>Chakra Points</strong> and badges by completing these real-world election scenarios.
          </p>
          
          <div className="mt-8 flex justify-center gap-6">
            <div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-sm border border-khadi-200 min-w-32">
              <span className="text-3xl">🎯</span>
              <span className="text-xl font-bold text-indigo-chakra mt-2" data-testid="xp-total">{progress.xp}</span>
              <span className="text-xs text-ink-500 uppercase tracking-wide">Points</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-sm border border-khadi-200 min-w-32">
              <span className="text-3xl">🏅</span>
              <span className="text-xl font-bold text-saffron-600 mt-2" data-testid="badge-count">{progress.earnedBadgeIds.length}/12</span>
              <span className="text-xs text-ink-500 uppercase tracking-wide">Badges</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2" aria-label="Unlocked democracy badges">
            {Object.entries(BADGE_LABELS).map(([badgeId, label]) => {
              const earned = progress.earnedBadgeIds.includes(badgeId);
              return (
                <span
                  key={badgeId}
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${
                    earned ? 'border-leaf-300 bg-leaf-50 text-leaf-700' : 'border-khadi-300 bg-white text-ink-700'
                  }`}
                >
                  {earned ? '✓ ' : ''}{label}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container-yatra mt-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SCENARIOS.map((scenario) => (
            <Card key={scenario.id} data-testid={`scenario-card-${scenario.id}`} className="flex flex-col justify-between hover:-translate-y-1 motion-reduce:hover:translate-y-0 transition-transform motion-reduce:transition-none duration-300 border-2 border-transparent hover:border-indigo-chakra/20 shadow-md">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{scenario.icon}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                    scenario.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    scenario.difficulty === 'Medium' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {scenario.difficulty}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold text-ink-900 mb-2">
                  {scenario.title}
                </h3>
                <p className="text-ink-700 text-sm mb-6">
                  {scenario.description}
                </p>
              </div>
              <div className="pt-4 border-t border-khadi-100 flex items-center justify-between">
                <span className="text-sm font-bold text-saffron-600">+{scenario.points} XP</span>
                {progress.completedScenarioIds.includes(scenario.id) && (
                  <span className="rounded-full bg-leaf-50 px-3 py-1 text-xs font-bold text-leaf-700" data-testid="scenario-completed">
                    Completed
                  </span>
                )}
                <Link href={`/play/scenario/${scenario.id}`}>
                  <Button className="bg-indigo-chakra hover:bg-indigo-900 text-white rounded-full">
                    Play Now
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
