import express, { NextFunction, Request, Response } from 'express';
import AudioController from '../controllers/AudioController';

export default class RestAudioRouter {
  #router: express.Router;
  #audioController: AudioController;

  constructor () {
    this.#router = express.Router();
    this.#audioController = new AudioController();

    this.setRoutes();
  }

  get router () { return this.#router };

  setRoutes () {
    this.#router.get('/', (req: Request, res: Response, next: NextFunction) => res.send({ data: 'OK' }));

    this.#router.get('/audio/:type/:id', this.#audioController.getAudio.bind(this.#audioController));
    this.#router.post('/audio/tts', this.#audioController.setAudioTTS.bind(this.#audioController));
  }
}
