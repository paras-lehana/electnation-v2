import { Router } from 'express';
import { synthesizeSpeech } from '@yatra/core/google';
import { logger } from '../middleware/logger.js';

export const ttsRouter: Router = Router();

ttsRouter.post('/', async (req, res) => {
  try {
    const { text, languageCode } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    logger.info('tts.request', { length: text.length, languageCode });
    const audioContent = await synthesizeSpeech(text, languageCode);
    
    if (!audioContent) {
      return res.status(500).json({ error: 'Failed to generate audio' });
    }

    // audioContent is usually a Uint8Array, we can send it directly as binary
    // or base64 encode it. Standard is binary with audio/mpeg
    res.set('Content-Type', 'audio/mpeg');
    res.send(audioContent);
  } catch (error) {
    logger.error('tts.error', { error });
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
