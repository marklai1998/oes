import exam, { Exam } from "../models/exam";
import { dayjs } from "../utils/dayjs";
import mongoose from "mongoose";
import { userTierType } from "../constants/userTierType";

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
