import {
  hasEditPermission,
  createExam,
  deleteExam,
  getDetailedExam,
  listExam,
  updateExam,
  canEditExam,
  getPopulatedExam,
} from "./../../repositories/exam";
import Router from "@koa/router";
import { Context, DefaultState } from "koa";
import { userTierType } from "../../constants/userTierType";
import { checkAuth } from "../../middlewares/checkAuth";
import { dayjs } from "../../utils/dayjs";
import multer from "@koa/multer";
import {
  createExamSubmission,
  getExamSubmission,
  hasRemovePermission,
  deleteExamSubmission,
  updateSubmission,
  listSubmission,
} from "../../repositories/examSubmission";
import * as R from "ramda";

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

router.get("/:id", checkAuth({}), async (ctx) => {
  const user = ctx.state.user;

  if (!(await hasEditPermission(ctx.params.id, user))) {
    ctx.throw(401, "EXAM_NOT_FOUND");
    return;
  }

  ctx.body = await getDetailedExam(ctx.params.id);
});

router.get("/:id/populated", checkAuth({}), async (ctx) => {
  ctx.body = await getPopulatedExam(ctx.params.id);
});

router.delete(
  "/:id",
  checkAuth({ tiers: [userTierType.ADMIN, userTierType.TEACHER] }),
  async (ctx) => {
    const user = ctx.state.user;

    if (!(await hasEditPermission(ctx.params.id, user))) {
      ctx.throw(401, "EXAM_NOT_FOUND");
      return;
    }

    if (!(await canEditExam(ctx.params.id))) {
      ctx.throw(401, "EXAM_LOCKED");
      return;
    }

    await deleteExam(ctx.params.id);

    ctx.body = "SUCCESS";
  }
);

router.patch(
  "/:id",
  checkAuth({ tiers: [userTierType.ADMIN, userTierType.TEACHER] }),
  async (ctx) => {
    const user = ctx.state.user;

    if (!(await hasEditPermission(ctx.params.id, user))) {
      ctx.throw(401, "EXAM_NOT_FOUND");
      return;
    }

    if (!(await canEditExam(ctx.params.id))) {
      ctx.throw(401, "EXAM_LOCKED");
      return;
    }

    const {
      request: { body },
    } = ctx;

    await updateExam(ctx.params.id, body);

    ctx.body = "SUCCESS";
  }
);

const upload = multer({ dest: "public/uploads/submission" });
router.post(
  "/:id/submission",
  checkAuth({}),
  upload.single("image"),
  async (ctx) => {
    const user = ctx.state.user;
    // {
    //   fieldname: 'image',
    //   originalname: '3xbhmo7wvrvih1eho9y1.png',
    //   encoding: '7bit',
    //   mimetype: 'image/png',
    //   destination: 'uploads/',
    //   filename: '9d855af15ddeb495beb2dc0b2d180ee5',
    //   path: 'uploads/9d855af15ddeb495beb2dc0b2d180ee5',
    //   size: 24934
    // }
    const image = ctx.file;
    ctx.body = await createExamSubmission(ctx.params.id, user._id, image);
  }
);

router.get("/:id/submission", checkAuth({}), async (ctx) => {
  const user = ctx.state.user;
  ctx.body = await getExamSubmission(ctx.params.id, user._id);
});

router.get(
  "/:id/submission/list",
  checkAuth({ tiers: [userTierType.ADMIN, userTierType.TEACHER] }),
  async (ctx) => {
    const user = ctx.state.user;

    if (!(await hasEditPermission(ctx.params.id, user))) {
      ctx.throw(401, "EXAM_NOT_FOUND");
      return;
    }

    ctx.body = await listSubmission(ctx.params.id);
  }
);

router.delete("/:id/submission/:image", checkAuth({}), async (ctx) => {
  const user = ctx.state.user;

  if (!(await hasRemovePermission(ctx.params.id, ctx.params.image, user))) {
    ctx.throw(401, "RESOURCES_NOT_FOUND");
    return;
  }

  await deleteExamSubmission(ctx.params.id, ctx.params.image);

  ctx.body = "SUCCESS";
});

router.patch("/:id/submission", checkAuth({}), async (ctx) => {
  const user = ctx.state.user;

  const {
    request: { body },
  } = ctx;

  const permissionList = await Promise.all(
    body.map(
      async ({ _id }) => await hasRemovePermission(ctx.params.id, _id, user)
    )
  );
  if (R.any((hasPermission) => !hasPermission, permissionList)) {
    ctx.throw(401, "RESOURCES_NOT_FOUND");
    return;
  }

  await updateSubmission(ctx.params.id, body);

  ctx.body = "SUCCESS";
});

export default router;
