import { getExamStatus } from "../utils/getExamStatus";
import { PopulatedExam, DetailedExam, PureExam } from "../models/exam";
import { PureUser } from "../models/user";
import exam, { Exam } from "../models/exam";
import { dayjs } from "../utils/dayjs";
import mongoose from "mongoose";
import { userTierType } from "../constants/userTierType";
import * as R from "ramda";
import { examStatusType } from "../constants/examStatusType";

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
    visible: false,
    name,
    createdBy: mongoose.Types.ObjectId(createdBy),
    from: dayjs(from).toDate(),
    to: dayjs(to).toDate(),
    invigilator: [],
    attendee: [],
    resources: [],
  });

export const hasEditPermission = async (id: string, user: PureUser) => {
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

export const getDetailedExam = async (id: string): Promise<DetailedExam> =>
  await exam
    .findById(id)
    .populate("createdBy", "name")
    .populate("resources")
    .lean();

export const getPopulatedExam = async (id: string): Promise<PopulatedExam> =>
  await exam
    .findById(id)
    .populate("createdBy attendee invigilator", "_id username")
    .populate("resources")
    .lean();

export const deleteExam = async (id: string) =>
  await exam.findByIdAndRemove(id);

export const canEditExam = async (id: string) => {
  const exam = await getDetailedExam(id);
  if (!exam) return false;

  const status = getExamStatus(dayjs().toISOString(), exam);

  return status === examStatusType.UPCOMING;
};

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
    visible: true,
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

export const updateExam = async (id: string, newValues: Partial<PureExam>) =>
  exam.findByIdAndUpdate(
    id,
    R.omit(["_id", "createdBy", "createAt", "updateAt"], newValues)
  );
