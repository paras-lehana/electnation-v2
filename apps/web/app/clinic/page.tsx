'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { analyzeForwardMessage, createForwardAnalysisFallback, type ForwardClinicResult } from '@/lib/apiClient';
import { motion } from 'framer-motion';

export default function ClinicPage() {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ForwardClinicResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setErrorMessage('');
    
    try {
      const resultData = await analyzeForwardMessage({ text: inputText, locale: 'en' });
      setResult(resultData);
    } catch (cause) {
      console.error(cause);
      setErrorMessage('Analysis is temporarily unavailable. Showing safe guidance from official election channels.');
      setResult(createForwardAnalysisFallback(inputText, 'en'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 4) return 'bg-red-100 text-red-800 border-red-300';
    if (risk === 3) return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  const getRiskLabel = (risk: number) => {
    if (risk >= 4) return 'HIGH';
    if (risk === 3) return 'MEDIUM';
    return 'LOW';
  };

  return (
    <main id="main" className="min-h-screen bg-tricolor-soft pb-20 overflow-hidden">
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100 py-12 shadow-sm relative z-10">
        <div className="container-yatra text-center relative">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-display text-4xl font-bold text-ink-900 md:text-5xl"
          >
            WhatsApp <span className="text-saffron-700 bg-saffron-50 px-2 rounded-md">Forward Clinic</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 mx-auto max-w-2xl text-lg text-ink-700"
          >
            Paste a suspicious message, rumor, or forward here. Chunav Saathi will help you verify its authenticity against ECI guidelines.
          </motion.p>
        </div>
      </div>

      <div className="container-yatra mt-12 max-w-3xl">
        <motion.div initial={false} animate={{ y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-white shadow-xl hover:shadow-2xl transition-shadow border-t-4 border-t-saffron-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl pointer-events-none">🩺</div>
            <form onSubmit={handleAnalyze} className="relative z-10">
              <label htmlFor="forward-text" className="block text-sm font-semibold text-ink-900 mb-2">
                Paste the message here:
              </label>
              <textarea
                id="forward-text"
                rows={5}
                aria-invalid={Boolean(errorMessage)}
                aria-describedby={errorMessage ? 'forward-error' : undefined}
                data-testid="forward-textarea"
                className="w-full rounded-xl border-2 border-khadi-200 bg-khadi-50 p-4 text-ink-900 focus:border-saffron-500 focus:ring-saffron-500 focus:bg-white transition-all shadow-inner resize-none"
                placeholder="e.g. 'Breaking: EVMs can be hacked using bluetooth...'"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              
              <div className="mt-6 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isAnalyzing || !inputText.trim()}
                  data-testid="analyze-forward"
                  className="bg-saffron-600 hover:bg-saffron-700 shadow-md shadow-saffron-500/30 w-full sm:w-auto"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin text-xl">⏳</span> Analyzing Fact-Check...
                    </span>
                  ) : 'Verify this Forward'}
                </Button>
              </div>
            </form>
            <p className="mt-4 text-xs text-ink-500">Protected with secure abuse checks when verification is required.</p>
            {errorMessage && <p id="forward-error" className="mt-3 text-sm font-semibold text-red-700">{errorMessage}</p>}
          </Card>
        </motion.div>

        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mt-8"
            role="status"
            aria-live="polite"
            data-testid="clinic-result"
          >
            <h2 className="font-display text-2xl font-bold text-ink-900 mb-4 flex items-center gap-2">
              <span className="text-3xl drop-shadow-sm">✅</span> Diagnosis Result
            </h2>
            <Card className={`border-l-8 shadow-lg relative overflow-hidden ${getRiskColor(result.riskLevel)}`}>
              <div className="flex items-start justify-between gap-4 relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-bold text-xl">{result.category}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border shadow-sm ${getRiskColor(result.riskLevel)}`}>
                      {getRiskLabel(result.riskLevel)} RISK · SCORE {result.riskLevel}/5
                    </span>
                  </div>
                  <p className="mt-2 text-ink-800 leading-relaxed text-lg">
                    {result.explanation.en}
                  </p>

                  <ul className="mt-5 space-y-2 text-sm text-ink-800">
                    {result.verificationSteps.map((step, index) => (
                      <li key={`${step.en}-${index}`} className="rounded-lg bg-white/70 p-3 font-medium shadow-sm">
                        {index + 1}. {step.en}
                      </li>
                    ))}
                  </ul>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-black/10 shadow-sm"
                  >
                    <p className="text-sm font-bold text-ink-900 flex items-center gap-2">
                      <span className="text-lg">💡</span> Action to take:
                    </p>
                    <p className="text-md text-ink-800 mt-2 font-medium">{result.recommendedAction}</p>
                  </motion.div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    {result.eciSources.map((source, index) => (
                      <a key={source} href={source} target="_blank" rel="noreferrer" className="rounded-full bg-white px-3 py-1 font-bold text-indigo-chakra underline">
                        Official source {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </main>
  );
}
