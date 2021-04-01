import { userTierType } from "../constants/userTierType";
import { PureUser } from "../models/user";
import examSubmission, { PureExamSubmission } from "./../models/examSubmission";
import * as R from "ramda";
import mongoose from "mongoose";

export const createExamSubmission = async (
  examId: string,
  userId: string,
  data: PureExamSubmission
) => {
  const largestItem = await examSubmission
    .find({ examId, userId })
    .sort({ price: -1 })
    .limit(1);

  return await examSubmission.create({
    ...data,
    examId,
    userId,
    order: largestItem.length ? largestItem[0].order + 1 : 1,
  });
};

export const getExamSubmission = async (examId: string, userId: string) =>
  examSubmission.find({ examId, userId }).sort({ order: 1 }).lean();

export const hasRemovePermission = async (
  examId: string,
  imageId: string,
  user: PureUser
) => {
  if (user.tier === userTierType.ADMIN) return true;

  const result = await examSubmission
    .findOne({ _id: imageId, examId, userId: user._id })
    .lean();

  return !R.isNil(result);
};

export const deleteExamSubmission = async (examId: string, imageId: string) =>
  examSubmission.findOneAndRemove({ examId, _id: imageId });

export const updateSubmission = async (
  id: string,
  newValues: PureExamSubmission[]
) => {
  await Promise.all(
    newValues.map(({ _id, order }) =>
      examSubmission.findOneAndUpdate({ examId: id, _id }, { order })
    )
  );
};

export const listSubmission = async (examId: string) => {
  return examSubmission
    .aggregate([
      { $match: { examId: mongoose.Types.ObjectId(examId) } },
      {
        $group: {
          _id: "$userId",
          images: { $push: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "user",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          _id: 1,
          images: 1,
          user: { $arrayElemAt: ["$user", 0] },
        },
      },
      {
        $project: {
          _id: 1,
          images: 1,
          username: "$user.username",
        },
      },
    ])
    .exec();
};
