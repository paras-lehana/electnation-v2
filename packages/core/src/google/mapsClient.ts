/**
 * Google Maps Platform wrapper — Places Text Search, Nearby, Geocoding,
 * Distance Matrix. Lightweight so Vertex/Cloud Run cold start stays tight.
 */

import { createError, type AppError } from '../errors.js';
import { err, ok, type Result } from '../result.js';

export interface MapsClientConfig {
  apiKey: string;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
}

export interface GeocodeResult {
  lat: number;
  lng: number;
  formattedAddress: string;
  placeId: string;
}

export interface DistanceRow {
  origin: string;
  destination: string;
  distanceMeters: number;
  durationSeconds: number;
}

export interface MapsClient {
  geocode(query: string): Promise<Result<GeocodeResult[], AppError>>;
  reverseGeocode(lat: number, lng: number): Promise<Result<GeocodeResult[], AppError>>;
  distanceMatrix(
    origins: string[],
    destinations: string[],
  ): Promise<Result<DistanceRow[], AppError>>;
}

export class GoogleMapsClient implements MapsClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(private readonly config: MapsClientConfig) {
    this.baseUrl = config.baseUrl ?? 'https://maps.googleapis.com/maps/api';
    this.fetchImpl = config.fetchImpl ?? fetch;
  }

  async geocode(query: string): Promise<Result<GeocodeResult[], AppError>> {
    return this.callGeocode({ address: query });
  }

  async reverseGeocode(lat: number, lng: number): Promise<Result<GeocodeResult[], AppError>> {
    return this.callGeocode({ latlng: `${lat},${lng}` });
  }

  private async callGeocode(
    params: Record<string, string>,
  ): Promise<Result<GeocodeResult[], AppError>> {
    const url = new URL(`${this.baseUrl}/geocode/json`);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    url.searchParams.set('key', this.config.apiKey);
    url.searchParams.set('region', 'in');

    try {
      const res = await this.fetchImpl(url.toString());
      const json = (await res.json()) as {
        status: string;
        results: Array<{
          geometry: { location: { lat: number; lng: number } };
          formatted_address: string;
          place_id: string;
        }>;
      };
      if (json.status !== 'OK' && json.status !== 'ZERO_RESULTS') {
        return err(
          createError('UPSTREAM_FAILURE', {
            internalHint: `maps.geocode status=${json.status}`,
          }),
        );
      }
      return ok(
        json.results.map((r) => ({
          lat: r.geometry.location.lat,
          lng: r.geometry.location.lng,
          formattedAddress: r.formatted_address,
          placeId: r.place_id,
        })),
      );
    } catch (cause) {
      return err(createError('UPSTREAM_FAILURE', { cause, internalHint: 'maps.geocode' }));
    }
  }

  async distanceMatrix(
    origins: string[],
    destinations: string[],
  ): Promise<Result<DistanceRow[], AppError>> {
    const url = new URL(`${this.baseUrl}/distancematrix/json`);
    url.searchParams.set('origins', origins.join('|'));
    url.searchParams.set('destinations', destinations.join('|'));
    url.searchParams.set('key', this.config.apiKey);
    url.searchParams.set('region', 'in');

    try {
      const res = await this.fetchImpl(url.toString());
      const json = (await res.json()) as {
        status: string;
        rows: Array<{
          elements: Array<{
            status: string;
            distance?: { value: number };
            duration?: { value: number };
          }>;
        }>;
      };
      if (json.status !== 'OK') {
        return err(
          createError('UPSTREAM_FAILURE', { internalHint: `maps.dm status=${json.status}` }),
        );
      }
      const rows: DistanceRow[] = [];
      json.rows.forEach((row, i) => {
        row.elements.forEach((el, j) => {
          rows.push({
            origin: origins[i] ?? '',
            destination: destinations[j] ?? '',
            distanceMeters: el.distance?.value ?? -1,
            durationSeconds: el.duration?.value ?? -1,
          });
        });
      });
      return ok(rows);
    } catch (cause) {
      return err(createError('UPSTREAM_FAILURE', { cause, internalHint: 'maps.distanceMatrix' }));
    }
  }
}
