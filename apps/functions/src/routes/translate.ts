import { Router } from 'express';
import { translateText, detectLanguage } from '@yatra/core/google';
import { logger } from '../middleware/logger.js';

export const translateRouter: Router = Router();

translateRouter.post('/', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    
    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Text and targetLanguage are required' });
    }

    logger.info('translate.request', { length: text.length, targetLanguage });
    const translation = await translateText(text, targetLanguage);
    
    res.json({ translation });
  } catch (error) {
    logger.error('translate.error', { error });
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

translateRouter.post('/detect', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });
    const language = await detectLanguage(text);
    res.json({ language });
  } catch (error) {
    logger.error('translate.detect.error', { error });
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
