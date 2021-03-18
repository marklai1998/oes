import { dayjs } from "./../utils/dayjs";
import Koa from "koa";

import IO from "koa-socket-2";

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
    io.broadcast("time", dayjs().toISOString());
  }, 1000);
};
