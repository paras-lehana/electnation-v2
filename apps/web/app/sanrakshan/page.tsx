import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const SANRAKSHAN_STEPS = [
  {
    title: 'Pause the offer',
    body: 'If someone offers cash, gifts, liquor, fuel, food coupons, or threats for your vote, pause before reacting. Your vote is secret and cannot be checked by them.',
    icon: '✋',
  },
  {
    title: 'Protect your community',
    body: 'Vote buying looks small today, but it makes leaders answerable to money networks instead of voters. The cost returns later as weak services and unfair pressure.',
    icon: '🛡️',
  },
  {
    title: 'Report safely',
    body: 'Use official complaint channels such as cVIGIL or your local election office. Do not argue in a crowd if it puts you at risk.',
    icon: '📲',
  },
];

const QUICK_RESPONSES = [
  'Mera vote secret hai. Main paisa ya gift ke badle vote nahi dunga.',
  'Is message/offer ko main verify karunga, forward nahi karunga.',
  'Agar pressure ho raha hai, main official complaint channel use karunga.',
];

export default function SanrakshanPage() {
  return (
    <main className="min-h-screen bg-khadi-50 pb-20" id="main">
      <section className="bg-white/90 py-14 shadow-sm">
        <div className="container-yatra grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-saffron-700">Vote Sanrakshan</p>
            <h1 className="mt-3 font-display text-4xl font-bold text-ink-900 md:text-5xl">
              Paise, gifts ya pressure ke saamne vote ko kaise bachayein?
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-ink-700">
              A short non-partisan safety module for recognizing vote-buying, coercion, and malpractice without putting yourself or your family at risk.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/play/scenario/vote-sanrakshan">
                <Button className="bg-indigo-chakra hover:bg-indigo-900">Practice the scenario</Button>
              </Link>
              <Link href="/clinic">
                <Button variant="ghost">Check a suspicious forward</Button>
              </Link>
            </div>
          </div>
          <Card className="border-2 border-saffron-200 bg-saffron-50 text-center shadow-lg">
            <div className="text-6xl" aria-hidden="true">🗳️</div>
            <h2 className="mt-4 font-display text-2xl font-bold text-ink-900">Your vote is secret</h2>
            <p className="mt-3 text-ink-700">
              No candidate, party worker, employer, family member, or local strongperson can legally know whom you voted for.
            </p>
          </Card>
        </div>
      </section>

      <section className="container-yatra mt-10 grid gap-5 md:grid-cols-3" aria-label="Vote protection steps">
        {SANRAKSHAN_STEPS.map((step) => (
          <Card key={step.title} className="border-t-4 border-t-leaf-500 bg-white">
            <div className="text-4xl" aria-hidden="true">{step.icon}</div>
            <h2 className="mt-4 font-display text-2xl font-bold text-ink-900">{step.title}</h2>
            <p className="mt-3 text-sm leading-6 text-ink-700">{step.body}</p>
          </Card>
        ))}
      </section>

      <section className="container-yatra mt-10 grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
        <Card className="bg-indigo-chakra text-white">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-100">Chhota script</p>
          <h2 className="mt-3 font-display text-3xl font-bold">Say it simply</h2>
          <ul className="mt-6 space-y-3">
            {QUICK_RESPONSES.map((line) => (
              <li key={line} className="rounded-xl bg-white/10 p-4 text-sm font-semibold text-white">
                “{line}”
              </li>
            ))}
          </ul>
        </Card>

        <Card className="bg-white">
          <h2 className="font-display text-3xl font-bold text-ink-900">What counts as a warning sign?</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {['Cash or UPI for votes', 'Liquor, gifts, fuel, food coupons', 'Threats to job, ration, housing, or safety', 'Instructions to photograph your vote', 'Messages telling people not to vote', 'Fake booth/date change claims'].map((item) => (
              <div key={item} className="rounded-xl border border-khadi-200 bg-khadi-50 p-4 text-sm font-semibold text-ink-800">
                {item}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-ink-600">
            Election Yatra does not collect reports. It guides you to official channels and helps you understand the situation safely.
          </p>
        </Card>
      </section>
    </main>
  );
}
