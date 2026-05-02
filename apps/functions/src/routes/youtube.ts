import { Router } from 'express';
import { getElectionPlaylist, searchSVEEPContent } from '@yatra/core';
import type { AppConfig } from '../config.js';
import { logger } from '../middleware/logger.js';

const DEMO_VIDEOS = [
  {
    id: 'sveep-demo-1',
    title: 'SVEEP voter awareness: how to verify your name in the electoral roll',
    url: 'https://www.youtube.com/results?search_query=ECI+SVEEP+voter+awareness',
    source: 'demo-search',
  },
  {
    id: 'sveep-demo-2',
    title: 'ECI voter helpline and polling day checklist',
    url: 'https://www.youtube.com/results?search_query=Election+Commission+of+India+Voter+Helpline',
    source: 'demo-search',
  },
];

export const youtubeRouter = (config: AppConfig): Router => {
  const router = Router();

  router.get('/youtube/sveep', async (_req, res) => {
    if (!config.youtube.apiKey && !config.youtube.sveepPlaylistId) {
      logger.info('youtube.demo_response', { reason: 'missing-api-key' });
      res.json({ mode: 'demo', provider: 'youtube-data-api', videos: DEMO_VIDEOS });
      return;
    }

    try {
      const items = config.youtube.sveepPlaylistId
        ? await getElectionPlaylist(config.youtube.sveepPlaylistId, config.youtube.apiKey)
        : await searchSVEEPContent('Election Commission of India SVEEP voter awareness', config.youtube.apiKey);

      const videos = (items ?? []).slice(0, 8).map((item) => {
        const row = item as {
          id?: string | { videoId?: string };
          contentDetails?: { videoId?: string };
          snippet?: {
            title?: string;
            channelTitle?: string;
            thumbnails?: { medium?: { url?: string }; default?: { url?: string } };
          };
        };
        const videoId = typeof row.id === 'object' ? row.id.videoId : row.contentDetails?.videoId;
        return {
          id: videoId ?? (typeof row.id === 'string' ? row.id : 'sveep-video'),
          title: row.snippet?.title ?? 'SVEEP voter awareness video',
          channelTitle: row.snippet?.channelTitle,
          thumbnail: row.snippet?.thumbnails?.medium?.url ?? row.snippet?.thumbnails?.default?.url,
          url: videoId
            ? `https://www.youtube.com/watch?v=${videoId}`
            : 'https://www.youtube.com/results?search_query=ECI+SVEEP',
        };
      });

      logger.info('youtube.sveep_loaded', { count: videos.length });
      res.json({ mode: 'youtube-data-api', provider: 'youtube-data-api', videos });
    } catch (cause) {
      logger.warn('youtube.fallback', { cause: String(cause).slice(0, 160) });
      res.json({ mode: 'fallback', provider: 'youtube-data-api', videos: DEMO_VIDEOS });
    }
  });

  return router;
};
