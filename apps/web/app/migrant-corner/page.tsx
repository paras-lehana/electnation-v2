'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function MigrantCornerPage() {
  return (
    <main id="main" className="min-h-screen bg-saffron-50 pb-20">
      <div className="bg-white py-16 border-b border-saffron-100 shadow-sm">
        <div className="container-yatra text-center">
          <h1 className="font-display text-4xl font-bold text-ink-900 md:text-5xl">
            Migrant <span className="text-saffron-600">Corner</span>
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-ink-700">
            Away from home for work or studies? Don't miss your chance to vote. Explore postal ballots, address updates, and travel planning.
          </p>
        </div>
      </div>

      <div className="container-yatra mt-12 grid gap-8 md:grid-cols-2">
        <Card className="bg-white p-8 border-t-8 border-t-indigo-chakra">
          <h2 className="font-display text-2xl font-bold text-ink-900 mb-4">Update Address (Form 8)</h2>
          <p className="text-ink-700 mb-6">
            If you have moved to a new city permanently, you can update your assembly constituency so you can vote locally.
          </p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-sm text-ink-800">
              <span className="text-leaf-600">✔</span> Proof of residence required
            </li>
            <li className="flex items-center gap-2 text-sm text-ink-800">
              <span className="text-leaf-600">✔</span> Can be done online via Voter Portal
            </li>
            <li className="flex items-center gap-2 text-sm text-ink-800">
              <span className="text-leaf-600">✔</span> Takes approx 15-30 days for processing
            </li>
          </ul>
          <Button className="w-full bg-indigo-chakra text-white">Start Online Application</Button>
        </Card>

        <Card className="bg-white p-8 border-t-8 border-t-leaf-500">
          <h2 className="font-display text-2xl font-bold text-ink-900 mb-4">Postal Ballot for Migrants</h2>
          <p className="text-ink-700 mb-6">
            For specific categories (like essential services or PwD), ECI provides postal ballot facilities. Check if you qualify.
          </p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-sm text-ink-800">
              <span className="text-leaf-600">✔</span> Vote via mail without traveling
            </li>
            <li className="flex items-center gap-2 text-sm text-ink-800">
              <span className="text-leaf-600">✔</span> Strict deadlines for application
            </li>
            <li className="flex items-center gap-2 text-sm text-ink-800">
              <span className="text-leaf-600">✔</span> Form 12D for senior citizens/PwD
            </li>
          </ul>
          <Button className="w-full bg-leaf-600 text-white">Check Eligibility</Button>
        </Card>

        <Card className="md:col-span-2 bg-indigo-900 text-white p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="text-center md:text-left flex-1">
              <h2 className="font-display text-3xl font-bold mb-4">Plan your Travel Home</h2>
              <p className="text-indigo-100 text-lg">
                If you prefer voting in your hometown, we can help you find the best travel options and set reminders for the voting day.
              </p>
            </div>
            <div className="flex gap-4">
              <Button className="bg-white text-indigo-900 hover:bg-gray-100">Find Trains/Buses</Button>
              <Button variant="ghost" className="border-white text-white hover:bg-indigo-800">Add to Calendar</Button>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
