import { userTierType } from "./../constants/userTierType";
import { dayjs } from "./../utils/dayjs";
import Koa from "koa";

import IO from "koa-socket-2";
import { socketEvent } from "../constants/socketEvent";
import * as R from "ramda";
import jwt_decode from "jwt-decode";
import { findUser } from "../repositories/users";

export type User = {
  username: string;
  tier: userTierType;
  _id: string;
};

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
    console.log(`[${socket.id}] connected`);

    socket.on("disconnect", () => {
      io.broadcast(socketEvent.REMOVE_PEER, {
        peerId: socket.id,
      });
    });
  });

  setInterval(() => {
    io.broadcast(socketEvent.TIME, dayjs().toISOString());
  }, 1000);

  io.use(async (ctx, next) => {
    const token = R.pathOr(
      null,
      ["socket", "handshake", "headers", "authorization"],
      ctx
    );
    const tokenArray = token.split(" ");

    const decodedToke = jwt_decode<{ sub: string }>(tokenArray[1]);

    const user = await findUser({ id: decodedToke.sub });

    ctx.socket.user = R.pick(["username", "tier", "_id"], user);

    await next();
  });

  io.on(socketEvent.JOIN_EXAM, ({ socket }, { examId }: { examId: string }) => {
    console.log(`[${socket.id}] join room ${examId}`);

    // notify existing user to add peer
    socket.to(examId).emit(socketEvent.ADD_PEER, {
      peerId: socket.id,
      user: socket.user,
      shouldCreateOffer: false,
    });

    // notify the new comer to create offer to all existing user
    const joinedUserList = io.socket.sockets.adapter.rooms.get(examId);
    const joinedUsers = joinedUserList ? Array.from(joinedUserList) : [];
    console.log("list", joinedUsers);
    joinedUsers.forEach((socketId) => {
      const socketObject = io.socket.sockets.sockets.get(socketId);
      socket.emit(socketEvent.ADD_PEER, {
        peerId: socketId,
        user: socketObject.user,
        shouldCreateOffer: true,
      });
    });

    socket.join(examId);
  });

  io.on(
    socketEvent.RELAY_ICE_CANDIDATE,
    (
      { socket },
      {
        peerId,
        iceCandidate,
      }: {
        peerId: string;
        iceCandidate: RTCIceCandidateInit;
      }
    ) => {
      console.log(
        "[" + socket.id + "] relaying ICE candidate to [" + peerId + "] "
      );

      const targetSocketObject = io.socket.sockets.sockets.get(peerId);
      if (targetSocketObject) {
        targetSocketObject.emit(socketEvent.ICE_CANDIDATE, {
          peerId: socket.id,
          iceCandidate,
        });
      }
    }
  );

  io.on(
    socketEvent.RELAY_SESSION_DESCRIPTION,
    (
      { socket },
      {
        peerId,
        sessionDescription,
      }: {
        peerId: string;
        sessionDescription: RTCSessionDescriptionInit;
      }
    ) => {
      console.log(
        "[" + socket.id + "] relaying session description to [" + peerId + "]"
      );

      const targetSocketObject = io.socket.sockets.sockets.get(peerId);
      if (targetSocketObject) {
        targetSocketObject.emit(socketEvent.SESSION_DESCRIPTION, {
          peerId: socket.id,
          sessionDescription,
        });
      }
    }
  );
};
