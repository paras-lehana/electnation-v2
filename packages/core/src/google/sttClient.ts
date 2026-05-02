import { SpeechClient } from '@google-cloud/speech';

let stt: SpeechClient | null = null;

export const getSTTClient = () => {
  if (!stt) {
    stt = new SpeechClient({
      apiKey: process.env.GOOGLE_API_KEY || process.env.GOOGLE_MAPS_API_KEY,
    });
  }
  return stt;
};

export const transcribeAudio = async (audioContent: string | Buffer, languageCode: string = 'hi-IN') => {
  const client = getSTTClient();
  const [response] = await client.recognize({
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode,
    },
    audio: {
      content: typeof audioContent === 'string' ? audioContent : audioContent.toString('base64'),
    },
  });
  return response.results
    ?.map(result => result.alternatives?.[0]?.transcript)
    .join('\n');
};
