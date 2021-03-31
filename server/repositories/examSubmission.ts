import { userTierType } from "../constants/userTierType";
import { PureUser } from "../models/user";
import examSubmission, { PureExamSubmission } from "./../models/examSubmission";
import * as R from "ramda";

export const createExamSubmission = async (
  examId: string,
  userId: string,
  data: PureExamSubmission
) => {
  const count = await examSubmission.countDocuments({ examId, userId });
  return await examSubmission.create({
    ...data,
    examId,
    userId,
    order: count + 1,
  });
};

export const getExamSubmission = async (examId: string, userId: string) =>
  examSubmission.find({ examId, userId }).sort({ order: 1 });

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
