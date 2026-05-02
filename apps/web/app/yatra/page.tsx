'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_STATIONS = [
  { id: 'registration', title: 'Registration', description: 'Ensure you are in the voter list.', icon: '📝', mission: 'Click "Check Portal" to verify your status.' },
  { id: 'verification', title: 'Verification', description: 'Check your EPIC and details.', icon: '🔍', mission: 'Enter your 10-digit EPIC number.' },
  { id: 'education', title: 'Education', description: 'Learn about candidates and issues.', icon: '📚', mission: 'Analyze a sample message for fake news.' },
  { id: 'planning', title: 'Planning', description: 'Find your booth and timing.', icon: '📅', mission: 'Check your polling booth distance.' },
  { id: 'voting', title: 'The Vote', description: 'Step-by-step guide to the booth.', icon: '🗳️', mission: 'Complete the voting day checklist.' },
  { id: 'celebration', title: 'Celebration', description: 'Share your inked finger and badge.', icon: '🇮🇳', mission: 'Download your Democracy Champion card!' }
];

export default function YatraPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStationIndex, setCurrentStationIndex] = useState(1); // Start at Verification since Registration is usually complete
  const [stationInput, setStationInput] = useState('');
  const [stationError, setStationError] = useState('');

  const downloadCertificate = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#fffbeb'; // khadi-50
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Border
    ctx.strokeStyle = '#f97316'; // saffron-500
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Title
    ctx.fillStyle = '#312e81'; // indigo-chakra
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Democracy Champion', canvas.width / 2, 120);

    // Subtitle
    ctx.fillStyle = '#374151';
    ctx.font = '24px sans-serif';
    ctx.fillText('This certifies that you have completed', canvas.width / 2, 200);
    ctx.fillText('the Election Yatra and are prepared to vote.', canvas.width / 2, 240);

    // Graphic / Placeholder
    ctx.font = '80px sans-serif';
    ctx.fillText('🏆 🇮🇳', canvas.width / 2, 380);

    // Date
    ctx.fillStyle = '#6b7280';
    ctx.font = '18px sans-serif';
    ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, canvas.width / 2, 500);

    // Trigger download
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Election_Yatra_Certificate.png';
    a.click();
  };

  const handleListen = async () => {
    setIsLoading(true);
    try {
      const text = "Your Election Yatra. 6 stations to becoming a responsible voter. Station 1: Registration. Ensure you are in the voter list. Station 2: Verification. Check your EPIC and details. Station 3: Education. Learn about candidates and issues. Station 4: Planning. Find your booth and timing. Station 5: The Vote. Step-by-step guide to the booth. Station 6: Celebration. Share your inked finger and badge.";
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://electnation-api-767171449038.us-central1.run.app';
      const response = await fetch(`${apiUrl}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, languageCode: 'en-IN' }),
      });
      if (!response.ok) throw new Error('TTS failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => setIsPlaying(false);
      audio.play();
      setIsPlaying(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const calendarUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://electnation-api-767171449038.us-central1.run.app'}/api/calendar/ics?source=default`;

  const advanceStation = () => {
    const currentStation = INITIAL_STATIONS[currentStationIndex];
    if (!currentStation) return;
    const currentId = currentStation.id;

    if (currentId === 'registration' && stationInput !== 'checked') {
      setStationError('Please click the "Check Portal" button first.');
      return;
    }
    if (currentId === 'verification' && stationInput.length < 10) {
      setStationError('Please enter a valid 10-digit EPIC number.');
      return;
    }
    if (currentId === 'education' && stationInput.toLowerCase() !== 'fake') {
      setStationError('Correct diagnosis: This message about "EVM Bluetooth" is FAKE.');
      return;
    }
    if (currentId === 'planning' && stationInput !== 'found') {
      setStationError('Please use the map to find your booth first.');
      return;
    }
    if (currentId === 'voting' && stationInput !== 'ready') {
      setStationError('Please check off all items in the list.');
      return;
    }

    setStationError('');
    setStationInput('');
    if (currentStationIndex < INITIAL_STATIONS.length) {
      setCurrentStationIndex(prev => prev + 1);
    }
  };

  const getStatus = (index: number) => {
    if (index < currentStationIndex) return 'completed';
    if (index === currentStationIndex) return 'current';
    return 'upcoming';
  };

  return (
    <main id="main" className="min-h-screen bg-khadi-50 pb-20">
      <div className="bg-white py-12 shadow-sm border-b border-khadi-100">
        <div className="container-yatra">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Button 
                  onClick={handleListen} 
                  disabled={isLoading || isPlaying}
                  className="bg-indigo-chakra text-white rounded-full py-2 px-4 shadow-md"
                  aria-label="Listen to page content"
                >
                  {isLoading ? '⏳ Loading Audio...' : isPlaying ? '🔊 Playing...' : '🎧 Listen to Page'}
                </Button>
                <a href={calendarUrl} data-testid="calendar-ics-link">
                  <Button variant="ghost" className="border-leaf-300 text-leaf-800 hover:bg-leaf-50">
                    📅 Add reminders
                  </Button>
                </a>
              </div>
              <h1 className="font-display text-4xl font-bold text-ink-900">Your <span className="text-indigo-chakra">Election Yatra</span></h1>
              <p className="mt-2 text-ink-700">{INITIAL_STATIONS.length} stations to becoming a responsible voter.</p>
            </div>
            <Card className="bg-saffron-50 border-saffron-200 py-2 px-6 flex items-center gap-3 w-max">
              <span className="text-2xl">{currentStationIndex === INITIAL_STATIONS.length ? '🏆' : '🏅'}</span>
              <div>
                <p className="text-xs font-bold text-saffron-800 uppercase">Current Badge</p>
                <p className="text-sm font-bold text-ink-900">
                  {currentStationIndex === INITIAL_STATIONS.length ? 'Democracy Champion' : 'Inked Apprentice'}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="container-yatra mt-12">
        <div className="relative">
          {/* Journey Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-saffron-300 via-khadi-200 to-leaf-300 hidden md:block opacity-50" />

          <div className="space-y-12">
            {INITIAL_STATIONS.map((station, index) => {
              const status = getStatus(index);
              return (
                <motion.div 
                  key={station.id} 
                  initial={false}
                  animate={{ x: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  className="relative flex items-start gap-8"
                >
                  {/* Status Indicator */}
                  <div className={`z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 shadow-md transition-all duration-500 ${
                    status === 'completed' ? 'bg-leaf-100 border-leaf-500 text-leaf-700 shadow-leaf-500/20 hover:scale-110' :
                    status === 'current' ? 'bg-[#312e81] border-indigo-400 text-white shadow-indigo-500/30 ring-4 ring-indigo-100 hover:scale-110' :
                    'bg-white border-khadi-200 text-khadi-400'
                  }`}>
                    <span className="text-2xl">{status === 'completed' ? '✅' : station.icon}</span>
                  </div>

                  <Card className={`flex-1 transition-all duration-300 border-l-8 ${
                    status === 'completed' ? 'border-l-leaf-500 bg-white hover:shadow-xl' :
                    status === 'current' ? 'border-l-[#312e81] bg-indigo-50/50 scale-[1.02] shadow-xl' :
                    'border-l-khadi-300 bg-khadi-50/50'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className={`font-display text-2xl font-bold ${status === 'current' ? 'text-[#312e81]' : 'text-ink-900'}`}>{station.title}</h3>
                        <p className="mt-1 text-ink-700 font-medium">{station.description}</p>
                      </div>
                        {status === 'current' ? (
                          <div className="flex flex-col gap-4 mt-4 sm:mt-0 items-end w-full sm:w-[300px]">
                            <div className="w-full bg-khadi-100 p-3 rounded-lg border border-khadi-200">
                                <p className="text-xs font-bold text-ink-600 uppercase mb-2">Current Mission</p>
                                <p className="text-sm text-ink-900 font-medium">{station.mission}</p>
                            </div>

                            {station.id === 'registration' && (
                              <Button 
                                onClick={() => setStationInput('checked')}
                                variant="ghost"
                                className="w-full border-saffron-300 text-saffron-800 hover:bg-saffron-50"
                              >
                                {stationInput === 'checked' ? '✅ Portal Verified' : '🌐 Visit ECI Portal'}
                              </Button>
                            )}

                            {station.id === 'verification' && (
                              <div className="w-full">
                                <label htmlFor="epic-number" className="sr-only">Enter EPIC number</label>
                                <input 
                                  id="epic-number"
                                  type="text" 
                                  placeholder="Enter EPIC number (e.g. ABC1234567)" 
                                  className="w-full border border-khadi-300 rounded-lg px-3 py-2 text-sm text-ink-900 focus:border-indigo-500 focus:outline-none"
                                  value={stationInput}
                                  aria-invalid={stationError ? true : undefined}
                                  aria-describedby={stationError ? 'epic-number-error' : undefined}
                                  onChange={(e) => setStationInput(e.target.value.toUpperCase())}
                                />
                                {stationError && <p id="epic-number-error" role="alert" className="text-red-700 text-xs mt-1">{stationError}</p>}
                              </div>
                            )}

                            {station.id === 'education' && (
                              <div className="w-full space-y-2">
                                <p className="text-[10px] text-ink-500 italic">"Vote early to get free snacks at the booth!"</p>
                                <div className="flex gap-2">
                                    <Button onClick={() => setStationInput('real')} className="flex-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100">Real</Button>
                                    <Button onClick={() => setStationInput('fake')} className="flex-1 bg-red-50 text-red-700 border-red-200 hover:bg-red-100">Fake</Button>
                                </div>
                                {stationError && <p role="alert" className="text-red-700 text-[10px]">{stationError}</p>}
                              </div>
                            )}

                            {station.id === 'planning' && (
                              <Button 
                                onClick={() => setStationInput('found')}
                                variant="ghost"
                                className="w-full border-leaf-300 text-leaf-800 hover:bg-leaf-50"
                              >
                                {stationInput === 'found' ? '✅ Booth Found' : '📍 Open Map'}
                              </Button>
                            )}

                            {station.id === 'voting' && (
                              <div className="w-full space-y-1">
                                {['Carry EPIC/ID', 'Check Booth No.', 'Avoid Party Colors'].map(item => (
                                    <label key={item} className="flex items-center gap-2 text-xs text-ink-700 cursor-pointer">
                                        <input type="checkbox" onChange={(e) => {
                                            if (e.target.checked) setStationInput('ready');
                                        }} />
                                        {item}
                                    </label>
                                ))}
                                {stationError && <p role="alert" className="text-red-700 text-[10px]">{stationError}</p>}
                              </div>
                            )}

                            <Button 
                              onClick={advanceStation}
                              className="bg-[#312e81] hover:bg-indigo-800 shadow-md shadow-indigo-900/20 text-white w-full"
                            >
                              Complete Station
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" disabled={status === 'upcoming'} className="w-full sm:w-auto mt-4 sm:mt-0">View Details</Button>
                        )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          
          {currentStationIndex === INITIAL_STATIONS.length && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-16 text-center bg-leaf-50 border-2 border-leaf-200 p-12 rounded-3xl"
            >
              <h2 className="font-display text-4xl font-bold text-leaf-900 mb-4">🎉 Yatra Completed!</h2>
              <p className="text-xl text-leaf-800 mb-8">You are now fully prepared to exercise your democratic right.</p>
              <Button onClick={downloadCertificate} className="bg-leaf-600 hover:bg-leaf-700 text-white text-lg py-6 px-12">Download Certificate</Button>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
