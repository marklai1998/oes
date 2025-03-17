import Router from "@koa/router";
import userRouter from "./user";
import examRouter from "./exam";

const router = new Router()
  .use("/user", userRouter.routes(), userRouter.allowedMethods())
  .use("/exam", examRouter.routes(), examRouter.allowedMethods());

export default router;
