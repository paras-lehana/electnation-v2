import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Stepper } from '@/components/ui/Stepper';
import { AshokaChakra } from '@/components/motifs/AshokaChakra';
import { RangoliPattern } from '@/components/motifs/RangoliPattern';
import { getGoogleServiceScorecard } from '@yatra/core/google';

const yatraSteps = [
  { id: 'register', title: 'Register', hindi: 'नाम दर्ज' },
  { id: 'verify', title: 'Verify', hindi: 'सत्यापन' },
  { id: 'candidates', title: 'Candidates', hindi: 'उम्मीदवार' },
  { id: 'spot-fake', title: 'Spot Fake', hindi: 'अफ़वाह पहचान' },
  { id: 'poll-day', title: 'Poll Day', hindi: 'मतदान' },
  { id: 'reflect', title: 'Reflect', hindi: 'विचार' },
];

export default function HomePage() {
  const googleScorecard = getGoogleServiceScorecard();

  return (
    <>
      <main id="main">
        {/* HERO */}
        <section className="relative overflow-hidden bg-tricolor-soft">
          <RangoliPattern className="pointer-events-none absolute -left-20 top-10 h-[480px] w-[480px] opacity-60" />
          <RangoliPattern className="pointer-events-none absolute -right-24 bottom-0 h-[380px] w-[380px] opacity-40" />
          <div className="container-yatra relative grid gap-12 py-20 md:grid-cols-[1.3fr_1fr] md:py-28">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-saffron-300 bg-saffron-50 px-4 py-1 text-sm font-semibold text-saffron-700">
                <span className="h-2 w-2 rounded-full bg-leaf-500" />
                Democracy ka Tyohar · 2026
              </span>
              <h1 className="mt-6 font-display text-5xl font-black leading-[1.05] text-ink-900 md:text-7xl">
                Chalo, apna
                <br />
                <span className="text-saffron-500">Bharat</span> samajhte hain —
                <br />
                ek <span className="text-leaf-500">yatra</span>, ek vote.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-ink-700 devanagari-aware">
                Meet <strong>Chunav Saathi</strong> — an AI companion that walks with you from
                registration to polling booth. In your language. For every voter.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/onboarding">
                  <Button className="animate-diya-flicker">Start your Yatra →</Button>
                </Link>
                <Link href="/clinic">
                  <Button variant="ghost">Check a WhatsApp forward</Button>
                </Link>
              </div>
              <p className="mt-6 text-xs text-ink-500">
                Non-partisan · Free forever · Data citations from eci.gov.in
              </p>
            </div>

            {/* Saathi preview card */}
            <Card withPaisley className="self-start">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-chakra text-white">
                  <AshokaChakra size={28} />
                </div>
                <div>
                  <p className="font-semibold text-ink-900">Chunav Saathi</p>
                  <p className="text-xs text-ink-500">AI companion · politically neutral</p>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-2xl rounded-tl-md bg-khadi-100 p-3 text-ink-900">
                  Namaste! Main Chunav Saathi hoon. Kya aap first-time voter ho?
                </div>
                <div className="ml-6 rounded-2xl rounded-tr-md bg-saffron-500 p-3 text-white">
                  Haan, registration kaise karu?
                </div>
                <div className="rounded-2xl rounded-tl-md bg-khadi-100 p-3 text-ink-900">
                  Aap{' '}
                  <a
                    className="underline"
                    href="https://voters.eci.gov.in"
                    target="_blank"
                    rel="noreferrer"
                  >
                    voters.eci.gov.in
                  </a>{' '}
                  par Form 6 bhar sakte hain. Main aapko steps dikha doon?
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* YATRA STEPS */}
        <section className="container-yatra py-16 md:py-24">
          <div className="max-w-3xl">
            <h2 className="font-display text-4xl font-bold text-ink-900 md:text-5xl">
              Your journey in <span className="text-leaf-500">six stations</span>
            </h2>
            <p className="mt-4 text-lg text-ink-700">
              Each step is a short, friendly conversation — read it, listen to it, or ask Saathi
              anything. Adapted for first-time voters, migrants, and seniors.
            </p>
          </div>
          <div className="mt-10 overflow-x-auto pb-4">
            <Stepper steps={yatraSteps} activeId="register" />
          </div>
        </section>

        {/* PILLARS */}
        <section className="bg-white/60 py-16 md:py-24">
          <div className="container-yatra">
            <h2 className="font-display text-4xl font-bold text-ink-900 md:text-5xl">
              Built for <span className="text-saffron-500">every</span> voter
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
              <Card>
                <div className="text-3xl">🧠</div>
                <h3 className="mt-3 font-display text-xl font-bold">Misinformation Clinic</h3>
                <p className="mt-2 text-sm text-ink-700">
                  Paste any WhatsApp forward. Saathi tells you if it's verified, misleading, or fake
                  — with ECI sources to cross-check.
                </p>
              </Card>
              <Card>
                <div className="text-3xl">🗺️</div>
                <h3 className="mt-3 font-display text-xl font-bold">Map your Booth</h3>
                <p className="mt-2 text-sm text-ink-700">
                  Find your polling station, ERO office, and plan the route. Migrants get a
                  dedicated corner for postal ballots and address updates.
                </p>
              </Card>
              <Card>
                <div className="text-3xl">🎮</div>
                <h3 className="mt-3 font-display text-xl font-bold">Play & Learn</h3>
                <p className="mt-2 text-sm text-ink-700">
                  Gamified scenarios — chai tapri bribes, fake forwards, booth rush — earn Chakra
                  Champion badges with your community.
                </p>
              </Card>
              <Card>
                <div className="text-3xl">🛡️</div>
                <h3 className="mt-3 font-display text-xl font-bold">Vote Sanrakshan</h3>
                <p className="mt-2 text-sm text-ink-700">
                  Learn how to respond safely when money, gifts, fear, or pressure enter the voting
                  conversation.
                </p>
              </Card>
              <Card>
                <div className="text-3xl">🔊</div>
                <h3 className="mt-3 font-display text-xl font-bold">Easy Mode</h3>
                <p className="mt-2 text-sm text-ink-700">
                  Big buttons, less prose, and audio-first guidance for seniors, low-literacy users,
                  and community classes.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* ACCESSIBILITY */}
        <section className="container-yatra py-16 md:py-24">
          <Card className="overflow-hidden bg-indigo-chakra text-white">
            <div className="grid gap-6 md:grid-cols-[2fr_1fr] md:items-center">
              <div>
                <h3 className="font-display text-3xl font-bold">
                  Voice-first. Language-first. <br />
                  <span className="text-saffron-300">Bharat-first.</span>
                </h3>
                <p className="mt-4 text-khadi-100">
                  Speak your doubt in Hindi, Bengali, Tamil, Marathi. Read-aloud on every card via
                  Google Text-to-Speech. Easy Mode strips the UI to big audio-first cards for
                  community classes and Anganwadi sessions.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                  <AshokaChakra size={120} className="text-saffron-300" />
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* GOOGLE CIVIC STACK */}
        <section className="bg-white/70 py-16 md:py-24" aria-labelledby="google-stack-heading">
          <div className="container-yatra grid gap-6 md:grid-cols-[1fr_1.1fr] md:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-indigo-chakra">
                Google Civic Stack
              </p>
              <h2
                id="google-stack-heading"
                className="mt-3 font-display text-4xl font-bold text-ink-900 md:text-5xl"
              >
                Google services are mapped to real voter jobs.
              </h2>
              <p className="mt-4 text-lg text-ink-700">
                AI, Maps, Calendar, YouTube, voice, translation, reCAPTCHA, Cloud Run, Cloud Build,
                Secret Manager, and analytics scaffolds are tracked as code with honest
                implementation status and fallback modes.
              </p>
              <div className="mt-6">
                <Link href="/google-services">
                  <Button>Review Google stack →</Button>
                </Link>
              </div>
            </div>
            <Card className="border-2 border-indigo-chakra/10 bg-white shadow-lg">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl bg-indigo-50 p-4">
                  <p className="text-3xl font-black text-indigo-chakra">
                    {googleScorecard.totalServices}
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-ink-600">
                    services
                  </p>
                </div>
                <div className="rounded-2xl bg-leaf-50 p-4">
                  <p className="text-3xl font-black text-leaf-900">{googleScorecard.implemented}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-ink-600">
                    live paths
                  </p>
                </div>
                <div className="rounded-2xl bg-saffron-50 p-4">
                  <p className="text-3xl font-black text-saffron-900">
                    {googleScorecard.readyWithKey}
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-ink-600">
                    key-ready
                  </p>
                </div>
                <div className="rounded-2xl bg-khadi-100 p-4">
                  <p className="text-3xl font-black text-ink-900">
                    {googleScorecard.productFamilies}
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-ink-600">
                    products
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm font-semibold text-ink-700">
                Public route: <span className="font-black">/api/google/services</span>. It exposes
                service names, statuses, and code paths, never secret values.
              </p>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
