'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const STEPS = [
  { id: 'age', title: 'Age Eligibility', description: 'Are you 18 or older?' },
  { id: 'first-time', title: 'First-time Voter', description: 'Is this your first time voting?' },
  { id: 'language', title: 'Preferred Language', description: 'Choose your language for the Yatra.' },
  { id: 'location', title: 'Current Location', description: 'Where are you currently residing?' }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    age: '',
    firstTime: '',
    language: 'en',
    location: ''
  });

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save to localStorage or state and redirect
      localStorage.setItem('voter_persona', JSON.stringify(formData));
      router.push('/yatra');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <Button 
              variant="ghost"
              className={`w-full py-6 text-lg ${formData.age === 'yes' ? '!bg-leaf-600 !text-white !border-leaf-600' : 'bg-white text-ink-900 border-2 border-khadi-200 hover:bg-khadi-50'}`}
              onClick={() => setFormData({...formData, age: 'yes'})}
            >
              ✅ Yes, I am 18+
            </Button>
            <Button 
              variant="ghost"
              className={`w-full py-6 text-lg ${formData.age === 'no' ? '!bg-red-600 !text-white !border-red-600' : 'bg-white text-ink-900 border-2 border-khadi-200 hover:bg-khadi-50'}`}
              onClick={() => setFormData({...formData, age: 'no'})}
            >
              ❌ No, I am younger
            </Button>
          </div>
        );
      case 1:
        return (
            <div className="space-y-4">
              <Button 
                variant="ghost"
                className={`w-full py-6 text-lg ${formData.firstTime === 'yes' ? '!bg-indigo-chakra !text-white !border-indigo-chakra' : 'bg-white text-ink-900 border-2 border-khadi-200 hover:bg-khadi-50'}`}
                onClick={() => setFormData({...formData, firstTime: 'yes'})}
              >
                🎉 Yes, my first time!
              </Button>
              <Button 
                variant="ghost"
                className={`w-full py-6 text-lg ${formData.firstTime === 'no' ? '!bg-indigo-chakra !text-white !border-indigo-chakra' : 'bg-white text-ink-900 border-2 border-khadi-200 hover:bg-khadi-50'}`}
                onClick={() => setFormData({...formData, firstTime: 'no'})}
              >
                🗳️ No, I have voted before
              </Button>
            </div>
          );
      case 2:
        return (
          <div className="grid grid-cols-2 gap-4">
            {['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi'].map(lang => (
                <Button 
                  key={lang}
                  variant="ghost"
                  className={`py-4 ${formData.language === lang.toLowerCase() ? '!bg-saffron-600 !text-white !border-saffron-600' : 'bg-white text-ink-900 border-2 border-khadi-200 hover:bg-khadi-50'}`}
                  onClick={() => setFormData({...formData, language: lang.toLowerCase()})}
                >
                  {lang}
                </Button>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <label htmlFor="voter-location" className="sr-only">Enter your city or ZIP code</label>
            <input 
              id="voter-location"
              type="text" 
              placeholder="Enter your City or ZIP code"
              className="w-full p-4 rounded-xl border-2 border-khadi-200 focus:border-indigo-chakra"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
            <p className="text-xs text-ink-500">We use this to find your nearest polling booth.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main id="main" className="min-h-screen bg-tricolor-soft flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="mb-8 flex justify-between gap-2">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-2 flex-1 rounded-full ${i <= currentStep ? 'bg-indigo-chakra' : 'bg-khadi-200'}`} />
          ))}
        </div>

        <Card className="bg-white shadow-2xl p-8">
          <span className="text-sm font-bold text-saffron-700 uppercase tracking-widest mb-2 block">Step {currentStep + 1} of 4</span>
          <h1 className="font-display text-3xl font-bold text-ink-900 mb-2">{STEPS[currentStep]?.title}</h1>
          <p className="text-ink-700 mb-8">{STEPS[currentStep]?.description}</p>
          
          {renderStep()}

          <div className="mt-12 flex justify-between gap-4">
            <Button 
              variant="ghost" 
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Back
            </Button>
            <Button 
              className="flex-1 bg-indigo-chakra text-white"
              disabled={
                (currentStep === 0 && !formData.age) ||
                (currentStep === 1 && !formData.firstTime) ||
                (currentStep === 3 && !formData.location)
              }
              onClick={handleNext}
            >
              {currentStep === STEPS.length - 1 ? 'Start my Yatra' : 'Continue'}
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
