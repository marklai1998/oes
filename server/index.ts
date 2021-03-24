import Koa from "koa";
import Router from "@koa/router";
import next from "next";
import passport from "koa-passport";
import { findUser } from "./repositories/users";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import apiRouter from "./controllers";
import bodyParser from "koa-bodyparser";
import mongoose from "mongoose";
import * as URI from "uri-js";

import "./models/examResources";
import koaQs from "koa-qs";
import { socket } from "./socket";
import cors from "@koa/cors";

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";

const App = async () => {
  try {
    const app = next({ dev });
    const handle = app.getRequestHandler();
    await app.prepare();

    await mongoose.connect(
      URI.serialize({
        scheme: "mongodb",
        host: "127.0.0.1:27017",
        userinfo: "test:test",
        path: "oes",
        query: "retryWrites=true",
      }),
      {
        useNewUrlParser: true,
        autoIndex: false,
        useFindAndModify: false,
        useUnifiedTopology: true,
      }
    );

    passport.use(
      new JwtStrategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: process.env.TOKEN_SECRET,
        },
        async (jwtPayload, done) => {
          const user = await findUser({ id: jwtPayload.sub });
          if (user) done(null, user);
          else done(new Error("CANNOT_FIND_USER"));
        }
      )
    );
    const koa = new Koa()
      .use(cors())
      .use(bodyParser({}))
      .use(passport.initialize());

    koaQs(koa);
    socket(koa);

    const router = new Router().use(
      "/api",
      apiRouter.routes(),
      apiRouter.allowedMethods()
    );

    router.all("(.*)", async (ctx) => {
      await handle(ctx.req, ctx.res);
      ctx.respond = false;
    });

    koa.use(async (ctx, next) => {
      ctx.res.statusCode = 200;
      await next();
    });

    koa.use(router.routes()).use(router.allowedMethods());

    koa.listen(port);
    console.log("App is listening on port: ", port);
  } catch (e) {
    console.log(e);
  }
};

App();
