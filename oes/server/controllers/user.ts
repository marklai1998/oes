import { getUserCount, listUser, updateUser } from "../repositories/users";
import { userTierType } from "../constants/userTierType";
import Router from "@koa/router";
import { Context, DefaultState } from "koa";
import { checkAuth } from "../middlewares/checkAuth";
import {
  createUser,
  findUserByName,
  validatePassword,
} from "../repositories/users";
import { issueJWT } from "../utils/jwt";
import multer from "@koa/multer";
import { rename } from "fs/promises";
import path from "path";
import appRoot from "app-root-path";

const router = new Router<DefaultState, Context>();

router.get("/", checkAuth({}), (ctx) => {
  ctx.body = { ...ctx.state.user };
});

router.patch("/", checkAuth({ tiers: [userTierType.ADMIN] }), async (ctx) => {
  const {
    request: { body },
  } = ctx;

  await updateUser(body._id, body.newValues);

  ctx.body = "SUCCESS";
});

router.post("/login", async (ctx) => {
  const {
    request: { body },
  } = ctx;

  const user = await findUserByName({ username: body.username });
  if (!user) {
    ctx.throw(401, "USER_NOT_FOUND");
    return;
  }

  const match = validatePassword({ user, inputPassword: body.password });
  if (!match) {
    ctx.throw(401, "USER_NOT_FOUND");
    return;
  }

  ctx.body = issueJWT(user);
});

router.get("/refreshToken", checkAuth({}), async (ctx) => {
  const user = ctx.state.user;
  ctx.body = issueJWT(user);
});

router.post("/register", async (ctx) => {
  if (!ctx.isAuthenticated()) {
    const { body } = ctx.request;

    const user = await findUserByName({ username: body.username });
    if (user) {
      ctx.throw(409, "USER_ALREADY_EXIST");
      return;
    }

    await createUser(ctx.request.body);

    ctx.body = "SUCCESS";
  } else {
    ctx.throw(401);
  }
});

router.get(
  "/list",
  checkAuth({
    tiers: [userTierType.ADMIN, userTierType.TEACHER],
  }),
  async (ctx) => {
    const { query } = ctx;
    ctx.body = await listUser({
      tier: query.tier as userTierType[],
      page: Number(query.page),
      pageSize: Number(query.pagesize),
    });
  }
);

router.get(
  "/count",
  checkAuth({
    tiers: [userTierType.ADMIN],
  }),
  async (ctx) => {
    ctx.body = await getUserCount();
  }
);

const upload = multer({ dest: "public/uploads/icons" });
router.post("/icon", checkAuth({}), upload.single("image"), async (ctx) => {
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
  await rename(
    path.resolve(appRoot.toString(), image.destination, image.filename),
    path.resolve(
      appRoot.toString(),
      image.destination,
      String(ctx.state.user._id)
    )
  );
});

export default router;
