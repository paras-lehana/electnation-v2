import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { buildGoogleTtsRequestDraft } from '../accessibility.js';

let tts: TextToSpeechClient | null = null;

export const getTTSClient = () => {
  if (!tts) {
    tts = new TextToSpeechClient({
      apiKey: process.env.GOOGLE_API_KEY || process.env.GOOGLE_MAPS_API_KEY,
    });
  }
  return tts;
};

export const synthesizeSpeech = async (text: string, languageCode: string = 'hi-IN') => {
  const client = getTTSClient();
  const requestDraft = buildGoogleTtsRequestDraft(text, languageCode);
  const [response] = await client.synthesizeSpeech({
    input: { text: requestDraft.text },
    voice: { languageCode: requestDraft.languageCode, ssmlGender: requestDraft.ssmlGender },
    audioConfig: { audioEncoding: requestDraft.audioEncoding },
  });
  return response.audioContent;
};
