import { WebcastPushConnection } from 'tiktok-live-connector';
import { connectStateType, eventHandlerParamType } from './types/LiveRouterTypes';
import AudioMiddleware from '../middlewares/AudioMiddleware';

import { Server } from 'socket.io';
import { createServer } from 'http';
import express, { Express } from 'express';

// import {
//   writeFile,
// } from 'fs/promises'

export default class LiveRouter {
  init () {
    const nick = process.env.NICK || ''; // poweroficial_

    const connection = new WebcastPushConnection(nick);

    // connection.getAvailableGifts().then(async (g) => await writeFile(`${process.cwd()}/assets/json/availableGifts.json`, JSON.stringify(g)))
    const app: Express = express();

    const httpServer = createServer(app);

    const io = new Server(httpServer, {});

    io.on("connection", (socket) => {
      console.log(`${socket.id} connected!`);

      connection.connect()
        .then((e: connectStateType) => this.consumeRoutes(e, connection, socket))
        .catch(err => { console.error('Failed to connect', err) });
    });

    const port = process.env.SOCKET_PORT;

    httpServer.listen(port, () => console.log(`Listening on port ${port}!`));
  }

  async consumeRoutes (state: connectStateType, connection: any, socket: any) {
    const audioMiddleware = new AudioMiddleware();

    console.info(`Connected to roomId ${state.roomId}`);

    // connection.on('chat', (data: eventHandlerParamType) => {
    //   console.log(`${data.uniqueId} (userId:${data.userId}) writes: ${data.comment}`);
    // })

    connection.on('gift', async (data: eventHandlerParamType) => {
      console.log(`${data.nickname} | userId:${data.userId} | sends: ${data.giftId}`);

      const audios = await audioMiddleware.handleGift(data);

      console.log(data.nickname, { audios });

      socket.emit('gift', { audios });
    })
  }
}
