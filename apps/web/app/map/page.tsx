'use client';

import { useState, useEffect, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

const INDIA_CENTER = { lat: 22.5937, lng: 78.9629 };
const DEFAULT_MAP_ID = 'election_yatra_map';

export default function MapPage() {
  const [apiKey, setApiKey] = useState('');
  const [mapId, setMapId] = useState(DEFAULT_MAP_ID);
  const [isConfigLoading, setIsConfigLoading] = useState(true);
  const [configError, setConfigError] = useState('');
  const [mapCenter, setMapCenter] = useState(INDIA_CENTER);
  const [hasPreciseLocation, setHasPreciseLocation] = useState(false);

  const loadPublicConfig = useCallback(async () => {
    setIsConfigLoading(true);
    setConfigError('');

    const buildTimeKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (buildTimeKey) {
      setApiKey(buildTimeKey);
      setIsConfigLoading(false);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://electnation-api-767171449038.us-central1.run.app';
    try {
      const res = await fetch(`${apiUrl}/api/config/public`);
      const data = await res.json();
      if (data.mapsApiKey) setApiKey(data.mapsApiKey);
      if (data.mapsMapId) setMapId(data.mapsMapId);
      if (!data.mapsApiKey) {
        setConfigError('Map services are temporarily unavailable. Use the official lookup links below for polling booth and ERO details.');
      }
    } catch {
      setConfigError('Could not reach the map service. Use the official lookup links below while we reconnect it.');
    } finally {
      setIsConfigLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPublicConfig();
  }, [loadPublicConfig]);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setMapCenter({ lat: coords.latitude, lng: coords.longitude });
        setHasPreciseLocation(true);
      },
      () => undefined,
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 300_000 },
    );
  }, []);

  const renderMapArea = () => {
    if (!apiKey) {
      return (
        <Card className="flex h-[600px] flex-col items-center justify-center border-2 border-dashed border-indigo-chakra/20 bg-saffron-50 p-8 text-center shadow-inner" data-testid="map-fallback">
          <span className="text-4xl mb-4 animate-pulse">📡</span>
          <h3 className="font-display text-xl font-bold text-ink-900">{isConfigLoading ? 'Connecting to Election Services...' : 'Map service unavailable'}</h3>
          <p className="mt-2 text-sm text-ink-700 max-w-md">{configError || 'We are fetching secure map tiles for your constituency. This usually takes a second.'}</p>
          <Button
            variant="ghost" 
            className="mt-6 border-saffron-300 text-saffron-700"
            onClick={loadPublicConfig}
            data-testid="map-config-retry"
          >
            Retry secure map
          </Button>
        </Card>
      );
    }

    return (
      <Card className="overflow-hidden p-0 rounded-2xl h-[600px] border-2 border-indigo-chakra/20 shadow-lg relative">
        <APIProvider apiKey={apiKey}>
          <Map center={mapCenter} defaultCenter={INDIA_CENTER} defaultZoom={hasPreciseLocation ? 14 : 5} zoom={hasPreciseLocation ? 14 : 5} mapId={mapId} disableDefaultUI={false} className="w-full h-full">
            {hasPreciseLocation && (
              <AdvancedMarker position={mapCenter} title="Your current area">
                <Pin background={'#4f46e5'} borderColor={'#312e81'} glyphColor={'#fff'} />
              </AdvancedMarker>
            )}
          </Map>
        </APIProvider>
      </Card>
    );
  };

  return (
    <main id="main" className="min-h-screen bg-tricolor-soft pb-20 overflow-hidden">
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-12 shadow-sm relative z-10">
        <div className="container-yatra relative">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold text-ink-900 md:text-5xl"
          >
            Map your <span className="text-leaf-500 bg-leaf-50 px-2 rounded-md">Booth</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 max-w-2xl text-lg text-ink-700"
          >
            Use official Election Commission resources to locate your assigned polling booth, reach your ERO, and plan corrections or travel support.
          </motion.p>
        </div>
      </div>

      <div className="container-yatra mt-8 grid gap-8 md:grid-cols-[1fr_350px]">
        {/* Map Container */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-leaf-400 to-indigo-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          {renderMapArea()}
          {hasPreciseLocation && (
            <p className="mt-3 text-sm text-ink-600">Map centered on your current area to help you orient yourself before opening the official lookup tools.</p>
          )}
        </motion.div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card withPaisley className="bg-white border-leaf-100 border-2 hover:shadow-lg transition-shadow" data-testid="facility-booth-card">
              <h3 className="font-display text-xl font-bold text-leaf-700 flex items-center gap-2">
                <span className="text-2xl drop-shadow-sm">🗳️</span> Your Polling Booth
              </h3>
              <p className="mt-2 text-sm text-ink-800 font-medium bg-leaf-50 p-2 rounded-md border border-leaf-100">Use the official Voter Portal to confirm the exact polling station assigned to your EPIC details.</p>
              <p className="text-xs text-ink-500 mt-2">Recommended before polling day, travel planning, or address corrections.</p>
              <div className="mt-4 flex gap-2">
                <a href="https://voters.eci.gov.in" target="_blank" rel="noreferrer" className="w-full">
                  <Button className="w-full bg-leaf-600 hover:bg-leaf-700 text-white shadow-md shadow-leaf-500/20">Open voter portal</Button>
                </a>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="bg-gradient-to-br from-saffron-50 to-white border-saffron-200 border-2 hover:shadow-lg transition-shadow" data-testid="facility-ero-card">
              <h3 className="font-display text-xl font-bold text-saffron-800 flex items-center gap-2">
                <span className="text-2xl drop-shadow-sm">🏛️</span> ERO Office
              </h3>
              <p className="mt-2 text-sm text-saffron-900 font-medium">For corrections, transfers, or roll issues, use the official Election Commission workflow for your constituency.</p>
              <p className="text-xs text-saffron-700 mt-1">Keep your EPIC number and address details handy before you start.</p>
              <a href="https://voters.eci.gov.in" target="_blank" rel="noreferrer" className="w-full block mt-4">
                <Button variant="ghost" className="w-full border-saffron-300 text-saffron-800 hover:bg-saffron-100 bg-white">
                  Find correction support
                </Button>
              </a>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card className="bg-[#312e81] border-2 border-indigo-400 text-white text-center shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#312e81] to-[#4f46e5] opacity-80 z-0"></div>
              <div className="relative z-10">
                <h3 className="font-display text-xl font-bold text-white tracking-wide flex items-center justify-center gap-2">
                  <span>🚆</span> Migrant Voter?
                </h3>
                <p className="mt-3 text-sm text-indigo-100 font-medium">
                  If you are living away from your home state, find out how you can still participate.
                </p>
                <a href="https://voters.eci.gov.in/migrant-voters" target="_blank" rel="noreferrer" className="w-full block mt-5">
                  <Button className="bg-white text-[#312e81] hover:bg-indigo-50 font-bold w-full shadow-lg">
                    Explore Options
                  </Button>
                </a>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      <section className="container-yatra mt-8" aria-label="Official lookup checklist">
        <Card className="bg-white/90 text-sm text-ink-700">
          <h2 className="font-display text-xl font-bold text-ink-900">Official lookup checklist</h2>
          <p className="mt-2">For keyboard and screen-reader users, these official steps replace any map-only interaction.</p>
          <ol className="mt-4 grid gap-3 md:grid-cols-3">
            <li><strong>1. Verify your profile:</strong> Open <a className="underline" href="https://voters.eci.gov.in" target="_blank" rel="noreferrer">voters.eci.gov.in</a> and confirm your name, EPIC, and constituency.</li>
            <li><strong>2. Find your booth:</strong> Use the official polling station lookup linked to your voter record instead of relying on a sample location.</li>
            <li><strong>3. Fix issues:</strong> If anything is outdated, use the same portal or the Voter Helpline app to reach your ERO support flow.</li>
          </ol>
        </Card>
      </section>
    </main>
  );
}
