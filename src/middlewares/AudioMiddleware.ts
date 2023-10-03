import { createWriteStream, createReadStream, readFileSync } from 'fs'
import axios from 'axios'
import { eventHandlerParamType } from '../routers/types/LiveRouterTypes'

export default class AudioMiddleware {
  basePath: string;
  elevenLabsKey: string;
  voiceId: string;
  ttsBody: {
    model_id: string,
    voice_settings: {
      stability: number,
      similarity_boost: number,
      style: number,
      use_speaker_boost: boolean,
    },
  };
  giftsStrategy: any;

  constructor () {
    this.basePath = `${process.cwd()}/assets/audios/`;
    this.elevenLabsKey = process.env.ELEVEN_LABS_KEY || '';
    this.voiceId = process.env.VOICE_ID || ''; // Gigi
    this.ttsBody = {
      model_id: 'eleven_multilingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.3,
        style: 0,
        use_speaker_boost: true,
      },
    };

    this.giftsStrategy = JSON.parse(readFileSync(`${process.cwd()}/assets/json/giftsStrategy.json`).toString());
  }

  async saveAudio (path: string, fileName: string, file: any): Promise<void> {
    const writable = createWriteStream(`${this.basePath}${path}/${fileName}.mp3`);

    file
      .on('error', (err: Error) => { throw err })
      .pipe(writable, { end: true });
  }

  getAudio (type: 'gifts' | 'users' | any, name: string) {
    const fullPath = this.audioPath(type, name);

    try {
      return createReadStream(fullPath);
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  audioPath (type: 'gifts' | 'users' | any, name: string) {
    return `${this.basePath}${type}/${name}.mp3`;
  }

  async generateTTS (text: string) {
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}/stream`;
    const body = { text, ...this.ttsBody };

    type configType = {
      headers: any,
      responseType: 'stream',
    };

    const config: configType = {
      headers: {
        'xi-api-key': this.elevenLabsKey,
        'accept': 'audio/mpeg'
      },
      responseType: 'stream',
    };

    const { data: file } = await axios.post(url, body, config);

    return file;
  }

  async handleGift (data: eventHandlerParamType) {
    const { text, withUser } = this.giftsStrategy[data.giftId] ?? this.giftsStrategy.default;

    const audios: { gift: string, user: string | null } = { gift: '', user: null };

    const giftAudio = this.getAudio('gifts', data.giftId.toString());

    if (!giftAudio) {
      const audioStream = await this.generateTTS(text);
      await this.saveAudio('gifts', data.userId, audioStream);
    }

    audios.gift = this.audioPath('gifts', data.giftId.toString());

    if (withUser) {
      const userAudio = this.getAudio('users', data.userId);

      if (!userAudio) {
        const audioStream = await this.generateTTS(data.nickname);
        await this.saveAudio('users', data.userId, audioStream);
      }

      audios.user = this.audioPath('users', data.userId);
    }

    return audios;
  }
}
