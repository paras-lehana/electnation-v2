'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useEffect, useRef, useState } from 'react';
import { claimScenarioReward, readProgress } from '@/lib/progress';

export default function ScenarioPage() {
  const { id } = useParams();
  const router = useRouter();
  const [step, setStep] = useState(0);

  interface Scenario {
    title: string;
    points: number;
    badgeId: string;
    content: { text: string; image: string }[];
    choices: { text: string; isCorrect: boolean; feedback: string }[];
  }

  // Lookup for different scenarios
  const scenarios: Record<string, Scenario> = {
    'chai-tapri': {
      title: 'Chai Tapri Dilemma',
      points: 50,
      badgeId: 'cvigil-reporter',
      content: [
        { text: "You're at the local tea stall. A representative of a local candidate approaches and offers to pay for everyone's tea and snacks if they promise to vote for their party.", image: '☕' },
        { text: "He hands you a Rs 500 note along with a party pamphlet, winking. 'Rakh lo bhai, vote din yaad rakhna'.", image: '💸' }
      ],
      choices: [
        { text: "Take the money and say yes. (Everyone is doing it).", isCorrect: false, feedback: "Accepting cash for votes is a criminal offense under Section 171B of IPC. It leads to corrupt leaders." },
        { text: "Politely refuse and walk away.", isCorrect: true, feedback: "Good! But you can do better. You should ideally report this." },
        { text: "Refuse, and secretly report the incident via the ECI cVIGIL app.", isCorrect: true, feedback: "Perfect! The cVIGIL app allows citizens to anonymously report Model Code of Conduct violations." }
      ]
    },
    'whatsapp-rush': {
      title: 'WhatsApp Forward Rush',
      points: 150,
      badgeId: 'misinfo-shield',
      content: [
        { text: "Your family group chat is buzzing. Your uncle forwards a message: 'URGENT: EVMs in our ward have been pre-programmed to vote for Party X. Do not go to vote, it is rigged!'", image: '📱' },
        { text: "The message has 'Forwarded many times' label. It also contains a blurry photo of an EVM machine.", image: '🔍' }
      ],
      choices: [
        { text: "Forward it to your friends to warn them.", isCorrect: false, feedback: "Never forward unverified rumors! EVMs are standalone machines and cannot be pre-programmed or hacked remotely. You are spreading misinformation." },
        { text: "Ignore the message completely.", isCorrect: true, feedback: "Ignoring is safe, but as a responsible citizen, you should actively stop misinformation." },
        { text: "Reply with the ECI Myth vs Reality link and ask him not to share rumors.", isCorrect: true, feedback: "Excellent! Countering fake news with official ECI facts (mythvsreality.eci.gov.in) helps maintain election integrity." }
      ]
    },
    'vote-sanrakshan': {
      title: 'Vote Sanrakshan Sabha',
      points: 120,
      badgeId: 'vote-sanrakshak',
      content: [
        { text: "A local contractor tells your basti that everyone will get Rs 1,000 after voting day, but only if they support his preferred candidate.", image: '🛡️' },
        { text: "He adds that he will know who voted against him because his people are watching the booth. Some neighbors look nervous and ask what to do.", image: '👥' }
      ],
      choices: [
        { text: "Accept the cash promise because everyone needs money.", isCorrect: false, feedback: "This normalizes vote buying and coercion. Your vote is secret, and selling it weakens public accountability for everyone." },
        { text: "Tell neighbors their vote is secret, avoid confrontation, and guide them to official complaint channels such as cVIGIL or the election office.", isCorrect: true, feedback: "Correct. This protects people from pressure while using official, safer reporting channels." },
        { text: "Start a loud argument and publicly name everyone involved.", isCorrect: false, feedback: "Safety first. Public confrontation can put voters at risk. Preserve evidence only if safe and use official channels." }
      ]
    },
    'booth-raasta': {
      title: 'Booth ka Raasta',
      points: 100,
      badgeId: 'migrant-ready',
      content: [
        { text: "You have moved to a new city for work. It's election day in your home constituency. You didn't register for postal ballot earlier.", image: '🗺️' },
        { text: "Your friend says you can just go to any polling booth in your current city and show your Aadhar card to vote.", image: '🏢' }
      ],
      choices: [
        { text: "Go to the nearest polling booth in the current city with Aadhar.", isCorrect: false, feedback: "Wrong! You can ONLY vote where your name is registered in the Electoral Roll. Aadhar alone does not allow you to vote anywhere." },
        { text: "Book a train ticket to go back home to vote.", isCorrect: true, feedback: "This works, provided you reach your assigned booth in time. However, to save trouble, you should have filled Form 8 to transfer your constituency." },
        { text: "Fill Form 8 online via Voter Helpline App to transfer your vote to your current city for the NEXT election.", isCorrect: true, feedback: "Smart choice for the future! By filling Form 8 (Shifting of Residence), you can vote in your new city in upcoming elections." }
      ]
    }
  };

  const scenario = typeof id === 'string' && scenarios[id] ? scenarios[id] : scenarios['chai-tapri'];
  const scenarioId = typeof id === 'string' && scenarios[id] ? id : 'chai-tapri';

  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const feedbackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setAlreadyClaimed(readProgress().completedScenarioIds.includes(scenarioId));
  }, [scenarioId]);

  useEffect(() => {
    if (selectedChoice !== null) feedbackRef.current?.focus();
  }, [selectedChoice]);

  const claimReward = () => {
    if (!scenario) return;
    claimScenarioReward({ scenarioId, xp: scenario.points, badgeId: scenario.badgeId });
    setAlreadyClaimed(true);
    router.push('/play');
  };

  if (!scenario) return null;

  if (step === 0) {
    return (
      <main id="main" className="min-h-screen bg-indigo-chakra flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full bg-white text-center p-12 shadow-2xl">
          <div className="text-6xl mb-6">{scenario.content[0]?.image}</div>
          <h1 className="font-display text-4xl font-bold text-ink-900 mb-6">{scenario.title}</h1>
          <p className="text-xl text-ink-700 mb-8 leading-relaxed">{scenario.content[0]?.text}</p>
          <Button className="w-full text-lg py-6 bg-saffron-600 hover:bg-saffron-700 text-white" data-testid="scenario-start" onClick={() => setStep(1)}>
            Continue →
          </Button>
        </Card>
      </main>
    );
  }

  if (step === 1) {
    return (
      <main id="main" className="min-h-screen bg-indigo-chakra flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full bg-white p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">{scenario.content[1]?.image}</div>
            <p className="text-xl text-ink-800 leading-relaxed font-medium">{scenario.content[1]?.text}</p>
          </div>

          <div className="space-y-4">
            <p className="font-bold text-ink-500 uppercase tracking-widest text-sm text-center mb-6">What is your response?</p>
            {scenario.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => setSelectedChoice(index)}
                data-testid={`choice-${index}`}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selectedChoice === index 
                    ? choice.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                    : 'border-khadi-200 hover:border-indigo-chakra hover:bg-khadi-50'
                }`}
                disabled={selectedChoice !== null}
              >
                <span className="font-medium text-ink-900">{choice.text}</span>
              </button>
            ))}
          </div>

          {selectedChoice !== null && scenario.choices[selectedChoice] && (
            <div
              ref={feedbackRef}
              tabIndex={-1}
              role="status"
              aria-live="polite"
              data-testid="feedback-panel"
              className={`mt-8 p-6 rounded-xl animate-in slide-in-from-bottom-4 motion-reduce:animate-none ${scenario.choices[selectedChoice]?.isCorrect ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'}`}
            >
              <h3 className="font-bold text-xl mb-2">
                {scenario.choices[selectedChoice]?.isCorrect ? '🎯 Correct!' : '❌ Think Again!'}
              </h3>
              <p>{scenario.choices[selectedChoice]?.feedback}</p>
              
              <div className="mt-6 flex gap-4">
                <Button variant="ghost" className="flex-1 bg-white" onClick={() => router.push('/play')}>
                  Back to Hub
                </Button>
                {scenario.choices[selectedChoice]?.isCorrect && (
                  <Button
                    className="flex-1 bg-indigo-chakra text-white"
                    onClick={claimReward}
                    disabled={alreadyClaimed}
                    data-testid="claim-xp"
                  >
                    {alreadyClaimed ? 'XP Already Claimed' : `Claim +${scenario.points} XP`}
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>
      </main>
    );
  }

  return null;
}
