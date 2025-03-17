import {
  createExamResources,
  deleteExamResources,
  getExamResources,
  updateResources,
} from "../../repositories/examResources";
import Router from "@koa/router";
import { Context, DefaultState } from "koa";
import multer from "@koa/multer";
import { checkAuth } from "../../middlewares/checkAuth";
import { userTierType } from "../../constants/userTierType";
import { hasEditPermission } from "../../repositories/exam";

const router = new Router<DefaultState, Context>();

const upload = multer({ dest: "public/uploads/resources" });
router.post(
  "/",
  checkAuth({ tiers: [userTierType.ADMIN, userTierType.TEACHER] }),
  upload.single("image"),
  async (ctx) => {
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
    ctx.body = await createExamResources(ctx.params.id, image);
  }
);

router.get("/", checkAuth({}), async (ctx) => {
  ctx.body = await getExamResources(ctx.params.id);
});

router.delete("/:image", checkAuth({}), async (ctx) => {
  const user = ctx.state.user;

  if (!(await hasEditPermission(ctx.params.id, user))) {
    ctx.throw(401, "EXAM_NOT_FOUND");
    return;
  }

  await deleteExamResources(ctx.params.id, ctx.params.image);

  ctx.body = "SUCCESS";
});

router.patch("/", checkAuth({}), async (ctx) => {
  const user = ctx.state.user;

  const {
    request: { body },
  } = ctx;

  if (!(await hasEditPermission(ctx.params.id, user))) {
    ctx.throw(401, "EXAM_NOT_FOUND");
    return;
  }

  await updateResources(ctx.params.id, body);

  ctx.body = "SUCCESS";
});

export default router;
