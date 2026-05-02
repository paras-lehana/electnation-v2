import { describe, expect, it } from 'vitest';
import { GoogleMapsClient } from './mapsClient.js';

const jsonResponse = (body: unknown, ok = true, status = 200) =>
  ({ ok, status, json: async () => body, text: async () => JSON.stringify(body) }) as Response;

describe('GoogleMapsClient', () => {
  it('maps geocoding responses into typed results', async () => {
    const fetchImpl = async () =>
      jsonResponse({
        status: 'OK',
        results: [
          {
            geometry: { location: { lat: 28.6139, lng: 77.209 } },
            formatted_address: 'New Delhi, India',
            place_id: 'place-delhi',
          },
        ],
      });

    const client = new GoogleMapsClient({ apiKey: 'test-key', fetchImpl: fetchImpl as typeof fetch });
    const result = await client.geocode('New Delhi');

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value[0]?.formattedAddress).toBe('New Delhi, India');
  });

  it('maps distance matrix rows into typed distance values', async () => {
    const fetchImpl = async () =>
      jsonResponse({
        status: 'OK',
        rows: [{ elements: [{ status: 'OK', distance: { value: 1200 }, duration: { value: 900 } }] }],
      });

    const client = new GoogleMapsClient({ apiKey: 'test-key', fetchImpl: fetchImpl as typeof fetch });
    const result = await client.distanceMatrix(['28.6139,77.209'], ['28.612,77.21']);

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value[0]?.distanceMeters).toBe(1200);
  });
});
