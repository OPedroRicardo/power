import { NextFunction, Request, Response } from "express";
import AudioMiddleware from '../middlewares/AudioMiddleware';

export default class AudioController {
  audioTypes: string[];

  constructor () {
    this.audioTypes = ['users', 'gifts'];
  }

  getAudio (req: Request, res: Response, next: NextFunction) {
    const { type, id } = req.params;

    if (!this.audioTypes.includes(type))
      return res.status(400).json({ status: 400, error: "Invalid argument 'type'" });

    const audioMiddleware = new AudioMiddleware();
    const audioStream = audioMiddleware.getAudio(type, id);

    if (!audioStream)
      return res.status(400).json({ status: 400, data: 'Could not find file' });

    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': `attachment; filename="${id}.mp3"`
    });

    audioStream.pipe(res, { end: true });
  }

  async setAudioTTS (req: Request, res: Response, next: NextFunction) {
    const { text, type, id } = req.body;

    if (!this.audioTypes.includes(type))
      return res.status(400).json({ status: 400, error: "Invalid argument 'type'" });

    const audioMiddleware = new AudioMiddleware();

    const audioStream = await audioMiddleware.generateTTS(text);
    await audioMiddleware.saveAudio(type, id, audioStream);

    res.status(200).json({ status: 200, data: 'Saved!' });
  }
}
