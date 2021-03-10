import { PureUser } from "./../models/user";
import exam, { Exam } from "../models/exam";
import { dayjs } from "../utils/dayjs";
import mongoose from "mongoose";
import { userTierType } from "../constants/userTierType";
import * as R from "ramda";

export const createExam = async ({
  name,
  createdBy,
  from,
  to,
}: {
  name: string;
  createdBy: string;
  from: string;
  to: string;
}) =>
  exam.create({
    name,
    createdBy: mongoose.Types.ObjectId(createdBy),
    from: dayjs(from).toDate(),
    to: dayjs(to).toDate(),
    invigilator: [],
    attendee: [],
    resources: [],
  });

export const canEditExam = async (id: string, user: PureUser) => {
  if (user.tier === userTierType.ADMIN) return true;

  const result = await exam
    .findOne({
      $or: [
        {
          _id: id,
          invigilator: mongoose.Types.ObjectId(String(user._id)),
        },
        {
          createdBy: user._id,
        },
      ],
    })
    .lean();

  return !R.isNil(result);
};

export const getDetailedExam = async (id: string) =>
  await exam
    .findById(id)
    .populate("createdBy invigilator attendee", "name")
    .populate("resources")
    .lean();

export const deleteExam = async (id: string) =>
  await exam.findByIdAndRemove(id);

export const listExam = async ({
  tier,
  userId,
  from,
  to,
}: {
  tier: userTierType;
  userId: string;
  from?: string;
  to?: string;
}) => {
  const timeQuery: mongoose.FilterQuery<Exam> =
    from || to
      ? {
          $or: [
            {
              from: {
                ...(from ? { $gte: dayjs(from).toDate() } : {}),
                ...(to ? { $lte: dayjs(to).toDate() } : {}),
              },
            },
            {
              ...(from ? { from: { $lte: dayjs(from).toDate() } } : {}),
              ...(to ? { to: { $gte: dayjs(to).toDate() } } : {}),
            },
          ],
        }
      : {};

  const adminQuery: mongoose.FilterQuery<Exam> = { ...timeQuery };

  const studentQuery: mongoose.FilterQuery<Exam> = {
    ...timeQuery,
    attendee: mongoose.Types.ObjectId(userId),
  };

  const teacherQuery: mongoose.FilterQuery<Exam> = {
    $or: [
      {
        ...timeQuery,
        invigilator: mongoose.Types.ObjectId(userId),
      },
      {
        ...timeQuery,
        createdBy: userId,
      },
      studentQuery,
    ],
  };

  const finalQuery =
    tier === userTierType.ADMIN
      ? adminQuery
      : tier === userTierType.TEACHER
      ? teacherQuery
      : studentQuery;

  return {
    count: await exam.countDocuments(finalQuery),
    list: await exam.find(finalQuery).sort({ from: 1 }),
  };
};
