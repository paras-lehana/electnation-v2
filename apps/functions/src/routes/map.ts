import { Router } from 'express';
import { GoogleMapsClient } from '@yatra/core/google';
import type { AppConfig } from '../config.js';

const getMapsClient = (config: AppConfig) => {
  const apiKey = config.maps.apiKey;
  return new GoogleMapsClient({ apiKey });
};

export const mapRouter = (config: AppConfig): Router => {
  const r = Router();

  r.get('/map/nearest-facilities', async (req, res) => {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lng = parseFloat(req.query.lng as string);

      if (isNaN(lat) || isNaN(lng)) {
        res.status(400).json({ error: { message: 'Invalid lat/lng parameters' } });
        return;
      }

      const client = getMapsClient(config);
      if (!config.maps.apiKey) {
        if (config.demoMode) {
          res.json({
            mode: 'demo',
            status: 'ok',
            booth: { lat: 28.612, lng: 77.21, name: 'Sample Polling Booth', distanceMeters: 1200 },
            ero: { lat: 28.615, lng: 77.215, name: 'Sample ERO Office', distanceMeters: 2500 },
          });
          return;
        }

        res.status(503).json({
          error: {
            code: 'MAPS_CONFIG_MISSING',
            message: 'Map services are not configured right now.',
          },
        });
        return;
      }

      const origins = [`${lat},${lng}`];
      // In a real app, these would come from a database query of nearby booths
      const destinations = ['28.612,77.21', '28.615,77.215']; 

      const result = await client.distanceMatrix(origins, destinations);
      
      if (!result.ok) {
        res.status(500).json({ error: { message: result.error.safeMessage?.en || 'Map API Error' } });
        return;
      }

      res.json({
        mode: 'google-distance-matrix',
        status: 'ok',
        data: result.value,
      });
    } catch (error) {
      res.status(500).json({ error: { message: 'Internal server error' } });
    }
  });

  return r;
};
