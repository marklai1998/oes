import { createExam } from "./../../repositories/exam";
import Router from "@koa/router";
import { Context, DefaultState } from "koa";
import { userTierType } from "../../constants/userTierType";
import { checkAuth } from "../../middlewares/checkAuth";

const router = new Router<DefaultState, Context>();

router.post(
  "/",
  checkAuth({
    tiers: [userTierType.ADMIN, userTierType.TEACHER],
  }),
  async (ctx) => {
    const { body } = ctx.request;
    ctx.body = await createExam({ ...body, createdBy: ctx.state.user._id });
  }
);

export default router;
