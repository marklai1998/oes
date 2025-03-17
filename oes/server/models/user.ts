import mongoose, { Document, ObjectId } from "mongoose";
import { userTierType } from "../constants/userTierType";
import * as R from "ramda";

export type PureUser = {
  _id: ObjectId;
  tier: userTierType;
  createdAt?: Date;
  updatedAt?: Date;
  username: string;
  hash: string;
  salt: string;
};

export type User = Document & PureUser;

const userSchema = new mongoose.Schema(
  {
    tier: {
      type: String,
      enum: R.values(userTierType),
      require: true,
    },
    username: { type: String, require: true },
    hash: { type: String, require: true },
    salt: { type: String, require: true },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<User>("user", userSchema, "user");
