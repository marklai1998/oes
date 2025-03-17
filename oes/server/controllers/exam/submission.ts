import Router from "@koa/router";
import { Context, DefaultState } from "koa";
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
import { generatePDF } from "../../repositories/pdfResult";
import { checkAuth } from "../../middlewares/checkAuth";
import { userTierType } from "../../constants/userTierType";
import { hasEditPermission } from "../../repositories/exam";

const router = new Router<DefaultState, Context>();

const upload = multer({ dest: "public/uploads/submission" });
router.post("/", checkAuth({}), upload.single("image"), async (ctx) => {
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
});

router.get("/", checkAuth({}), async (ctx) => {
  const user = ctx.state.user;
  ctx.body = await getExamSubmission(ctx.params.id, user._id);
});

router.get(
  "/list",
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

router.delete("/:image", checkAuth({}), async (ctx) => {
  const user = ctx.state.user;

  if (!(await hasRemovePermission(ctx.params.id, ctx.params.image, user))) {
    ctx.throw(401, "RESOURCES_NOT_FOUND");
    return;
  }

  await deleteExamSubmission(ctx.params.id, ctx.params.image);

  ctx.body = "SUCCESS";
});

router.patch("/", checkAuth({}), async (ctx) => {
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

router.get(
  "/:userId/pdf",
  checkAuth({ tiers: [userTierType.ADMIN, userTierType.TEACHER] }),
  async (ctx) => {
    const user = ctx.state.user;

    if (!(await hasEditPermission(ctx.params.id, user))) {
      ctx.throw(401, "EXAM_NOT_FOUND");
      return;
    }

    ctx.body = await generatePDF(ctx.params.id, ctx.params.userId);
  }
);

export default router;
