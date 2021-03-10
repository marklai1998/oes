import { createExam, listExam } from "./../../repositories/exam";
import Router from "@koa/router";
import { Context, DefaultState } from "koa";
import { userTierType } from "../../constants/userTierType";
import { checkAuth } from "../../middlewares/checkAuth";
import { dayjs } from "../../utils/dayjs";

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

router.get("/list/month", checkAuth({}), async (ctx) => {
  const user = ctx.state.user;

  ctx.body = await listExam({
    tier: user.tier,
    userId: user._id,
    from: dayjs().startOf("month").toISOString(),
    to: dayjs().endOf("month").toISOString(),
  });
});

router.get("/list/today", checkAuth({}), async (ctx) => {
  const user = ctx.state.user;

  ctx.body = await listExam({
    tier: user.tier,
    userId: user._id,
    from: dayjs().startOf("day").toISOString(),
    to: dayjs().endOf("day").toISOString(),
  });
});

router.get("/list", checkAuth({}), async (ctx) => {
  const user = ctx.state.user;

  ctx.body = await listExam({
    tier: user.tier,
    userId: user._id,
  });
});

export default router;
