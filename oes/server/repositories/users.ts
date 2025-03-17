import { PureUser } from "../models/user";
import user from "../models/user";
import crypto from "crypto";
import { userTierType } from "../constants/userTierType";
import * as R from "ramda";

export const createUser = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  return user.create({
    username,
    hash,
    salt,
    tier: userTierType.STUDENT,
  });
};

export const findUser = async ({ id }: { id: string }) =>
  user.findById(id).lean();

export const findUserByName = async ({ username }: { username: string }) =>
  user.findOne({ username }).lean();

export const validatePassword = ({
  user,
  inputPassword,
}: {
  user: PureUser;
  inputPassword: string;
}) => {
  const inputHash = crypto
    .pbkdf2Sync(inputPassword, user.salt, 1000, 64, "sha512")
    .toString("hex");
  const passwordsMatch = user.hash === inputHash;
  return passwordsMatch;
};

export const listUser = async ({
  tier,
  pageSize,
  page,
}: {
  tier?: userTierType[];
  page: number;
  pageSize: number;
}) => {
  const query =
    tier && !R.isEmpty(tier)
      ? {
          $or: tier.map((tier) => ({ tier })),
        }
      : {};

  const result =
    pageSize === -1
      ? await user
          .find(query)
          .sort({
            createdAt: 1,
          })
          .lean()
      : await user
          .find(query)
          .sort({
            createdAt: 1,
          })
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .lean();

  return {
    list: result,
    total: await user.countDocuments(query),
  };
};

export const updateUser = async (id: string, newValues: Partial<PureUser>) =>
  user.findByIdAndUpdate(id, newValues);

export const getUserCount = async () =>
  Promise.all(
    R.values(userTierType).map(async (tier) => ({
      tier,
      total: await user.countDocuments({ tier }),
    }))
  );
