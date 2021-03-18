import { dayjs } from "./../utils/dayjs";
import Koa from "koa";

import IO from "koa-socket-2";
import { socketEvent } from "../constants/socketEvent";

export const socket = (koa: Koa) => {
  const io = new IO({
    ioOptions: {
      cors: {
        origin: "*",
      },
    },
  });

  io.attach(koa);

  io.on("connection", (socket) => {
    console.log(socket.id, "connected!");
  });

  setInterval(() => {
    io.broadcast(socketEvent.TIME, dayjs().toISOString());
  }, 1000);
};
