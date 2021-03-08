import { Middleware } from "koa";
import passport from "koa-passport";
import { userTierType } from "../constants/userTierType";
import * as R from "ramda";

export const checkAuth = ({
  tiers,
}: {
  tiers?: userTierType[];
}): Middleware => (ctx, next) => {
  const checkTier = () => {
    if (!ctx.state.user) {
      ctx.throw(401, "USER_NOT_FOUND");
    } else if (tiers && !R.includes(ctx.state.user.tier, tiers)) {
      ctx.throw(401);
    } else {
      return next();
    }
  };

  return passport.authenticate("jwt", { session: false })(ctx, checkTier);
};
