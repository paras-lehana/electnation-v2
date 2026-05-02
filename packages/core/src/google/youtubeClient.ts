import { google, youtube_v3 } from 'googleapis';

const clients = new Map<string, youtube_v3.Youtube>();

export const getYoutubeClient = (apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '') => {
  const cacheKey = apiKey || 'default';
  const cached = clients.get(cacheKey);
  if (cached) return cached;

  const youtube = google.youtube({
      version: 'v3',
      auth: apiKey,
  });
  clients.set(cacheKey, youtube);
  return youtube;
};

export const searchSVEEPContent = async (query: string = 'ECI SVEEP', apiKey?: string) => {
  const client = getYoutubeClient(apiKey);
  const response = await client.search.list({
    part: ['snippet'],
    q: query,
    maxResults: 10,
    type: ['video'],
    relevanceLanguage: 'hi',
  });
  return response.data.items;
};

export const getElectionPlaylist = async (playlistId: string, apiKey?: string) => {
  const client = getYoutubeClient(apiKey);
  const response = await client.playlistItems.list({
    part: ['snippet', 'contentDetails'],
    playlistId,
    maxResults: 50,
  });
  return response.data.items;
};
