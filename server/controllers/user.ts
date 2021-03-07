import Router from "@koa/router";
import { Context, DefaultState } from "koa";
import { checkAuth } from "../middlewares/checkAuth";
import {
  createUser,
  findUserByName,
  validatePassword,
} from "../repositories/users";
import { issueJWT } from "../utils/jwt";

const router = new Router<DefaultState, Context>();

router.get("/", checkAuth, (ctx) => {
  try {
    ctx.body = ctx.state.user;
  } catch (e) {
    console.error(e);
    ctx.throw(500);
  }
});

router.post("/login", async (ctx) => {
  try {
    const {
      request: { body },
    } = ctx;

    const user = await findUserByName({ username: body.username });
    if (!user) {
      ctx.throw(401);
    }

    const match = validatePassword({ user, inputPassword: body.password });
    if (!match) {
      ctx.throw(401);
    }

    ctx.body = issueJWT(user);
  } catch (error) {
    console.error(error);
    ctx.throw(500);
  }
});

router.get("/refreshToken", checkAuth, async (ctx) => {
  try {
    const user = ctx.state.user;
    ctx.body = issueJWT(user);
  } catch (error) {
    console.error(error);
    ctx.throw(500);
  }
});

router.post("/register", async (ctx) => {
  if (!ctx.isAuthenticated()) {
    await createUser(ctx.request.body);
  } else {
    ctx.throw(401);
  }
});

export default router;
