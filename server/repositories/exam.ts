import exam from "../models/exam";
import { dayjs } from "../utils/dayjs";
import mongoose from "mongoose";

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
