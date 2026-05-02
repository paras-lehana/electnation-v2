import Link from 'next/link';
import {
  getGoogleCivicJourney,
  getGoogleServiceCatalog,
  getGoogleServiceScorecard,
  type GoogleServiceStatus,
} from '@yatra/core/google';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const statusClass: Record<GoogleServiceStatus, string> = {
  implemented: 'bg-leaf-100 text-leaf-900 ring-leaf-200',
  'ready-with-key': 'bg-saffron-100 text-saffron-900 ring-saffron-200',
  planned: 'bg-khadi-100 text-ink-700 ring-khadi-300',
};

const statusLabel: Record<GoogleServiceStatus, string> = {
  implemented: 'Implemented',
  'ready-with-key': 'Ready with key',
  planned: 'Planned scaffold',
};

export default function GoogleServicesPage() {
  const catalog = getGoogleServiceCatalog();
  const scorecard = getGoogleServiceScorecard();
  const journey = getGoogleCivicJourney();
  const featuredServices = catalog.filter((service) => service.status !== 'planned').slice(0, 12);
  const plannedServices = catalog.filter((service) => service.status === 'planned').slice(0, 10);

  return (
    <main id="main" className="min-h-screen bg-tricolor-soft pb-20">
      <section className="border-b border-khadi-200 bg-white py-14 shadow-sm">
        <div className="container-yatra grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-indigo-chakra">
              Google Services evidence
            </p>
            <h1 className="mt-3 font-display text-4xl font-black leading-tight text-ink-900 md:text-6xl">
              A full Google Civic Stack, visible in code.
            </h1>
            <p className="mt-5 max-w-3xl text-lg font-medium text-ink-700">
              Election Yatra uses Google services where they make the voter journey stronger: AI
              reasoning, maps, reminders, voice, translation, abuse protection, deployment, and
              observability. Unkeyed services are labelled honestly as ready-with-key or planned
              scaffolds.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/map">
                <Button>Open Map flow</Button>
              </Link>
              <Link href="/clinic">
                <Button variant="ghost">Test Forward Clinic</Button>
              </Link>
            </div>
          </div>
          <Card className="border-2 border-indigo-chakra/10 bg-indigo-chakra text-white shadow-xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-saffron-200">
              Scorecard
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-4xl font-black">{scorecard.totalServices}</p>
                <p className="text-sm font-bold text-khadi-100">Google service slots</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-4xl font-black">{scorecard.implemented}</p>
                <p className="text-sm font-bold text-khadi-100">implemented</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-4xl font-black">{scorecard.readyWithKey}</p>
                <p className="text-sm font-bold text-khadi-100">key-ready</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-4xl font-black">{scorecard.productFamilies}</p>
                <p className="text-sm font-bold text-khadi-100">product families</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="container-yatra py-12" aria-labelledby="journey-heading">
        <h2 id="journey-heading" className="font-display text-3xl font-bold text-ink-900">
          Google services mapped to the voter journey
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {journey.map((step) => (
            <Card key={step.id} className="border-2 border-khadi-100 bg-white p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-saffron-700">
                {step.label}
              </p>
              <h3 className="mt-2 font-display text-xl font-bold text-ink-900">
                {step.userMoment}
              </h3>
              <p className="mt-3 text-sm font-semibold text-ink-700">{step.proof}</p>
              <p className="mt-4 text-xs font-bold text-indigo-chakra">
                {step.googleServiceIds.length} connected services
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="container-yatra pb-12" aria-labelledby="implemented-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-leaf-700">
              Implemented and key-ready
            </p>
            <h2
              id="implemented-heading"
              className="mt-2 font-display text-3xl font-bold text-ink-900"
            >
              Services reviewers can trace in code
            </h2>
          </div>
          <Link href="/easy-mode" className="text-sm font-bold text-indigo-chakra underline">
            See accessibility proof
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredServices.map((service) => (
            <Card key={service.id} className="bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-ink-500">
                    {service.googleProduct}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-ink-900">
                    {service.serviceName}
                  </h3>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ring-1 ${statusClass[service.status]}`}
                >
                  {statusLabel[service.status]}
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold text-ink-700">{service.userValue}</p>
              <div className="mt-4 rounded-xl bg-khadi-50 p-3 text-xs font-semibold text-ink-700">
                <p>Fallback: {service.fallbackMode}</p>
                <p className="mt-1">Proof: {service.evidenceSignals.slice(0, 2).join(' · ')}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="container-yatra" aria-labelledby="planned-heading">
        <Card className="border-2 border-saffron-100 bg-white p-6">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-saffron-700">
            Boilerplate with a purpose
          </p>
          <h2 id="planned-heading" className="mt-2 font-display text-3xl font-bold text-ink-900">
            Planned services are explicit, not hidden claims
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {plannedServices.map((service) => (
              <div key={service.id} className="rounded-xl border border-khadi-200 bg-khadi-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-ink-900">{service.googleProduct}</h3>
                  <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-ink-600 ring-1 ring-khadi-200">
                    {statusLabel[service.status]}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-ink-700">{service.nextStep}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
}
