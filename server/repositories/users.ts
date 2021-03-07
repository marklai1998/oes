import { User } from "./../models/user";
import user from "../models/user";
import crypto from "crypto";
import { userTierType } from "../constants/userTierType";

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

export const findUser = async ({ id }: { id: string }) => user.findById(id);

export const findUserByName = async ({ username }: { username: string }) =>
  user.findOne({ username });

export const validatePassword = ({
  user,
  inputPassword,
}: {
  user: User;
  inputPassword: string;
}) => {
  const inputHash = crypto
    .pbkdf2Sync(inputPassword, user.salt, 1000, 64, "sha512")
    .toString("hex");
  const passwordsMatch = user.hash === inputHash;
  return passwordsMatch;
};
