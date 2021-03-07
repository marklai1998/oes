import { Middleware } from "koa";
import passport from "koa-passport";

export const checkAuth: Middleware = (ctx, next) =>
  passport.authenticate("jwt", { session: false })(ctx, next);
