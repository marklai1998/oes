import Router from "@koa/router";
import userRouter from "./user";

const router = new Router().use(
  "/user",
  userRouter.routes(),
  userRouter.allowedMethods()
);

export default router;
