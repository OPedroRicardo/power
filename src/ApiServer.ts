import http from 'http';
import express, { Express } from 'express';
import morgan from 'morgan';
import RestRouter from './routers/RestAudioRouter';
import setAssets from './setAssets';

setAssets().then(() => {
  const app: Express = express();

  app.use(morgan('dev'));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  const restRouter = new RestRouter();

  app.use('/', restRouter.router);

  const server = http.createServer(app);

  const port = process.env.API_PORT;

  server.listen(port, () => console.log(`Listening on port ${port}!`));
});
