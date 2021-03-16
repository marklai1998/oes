import mongoose, { Document, ObjectId } from "mongoose";
import { PureExamResources } from "./examResources";
import { PureUser } from "./user";

export type PureExam = {
  _id: ObjectId | string;
  visible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  createdBy: string | ObjectId;
  from: Date | string;
  to: Date | string;
  invigilator: (ObjectId | string)[];
  attendee: (ObjectId | string)[];
  resources: string[];
};

export type DetailedExam = {
  _id: ObjectId | string;
  visible: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  name: string;
  createdBy: Pick<PureUser, "username" | "_id">;
  from: Date | string;
  to: Date | string;
  invigilator: (ObjectId | string)[];
  attendee: (ObjectId | string)[];
  resources: (ObjectId | string)[];
};

export type PopulatedExam = {
  _id: ObjectId | string;
  visible: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  name: string;
  createdBy: Pick<PureUser, "username" | "_id">;
  from: Date | string;
  to: Date | string;
  invigilator: Pick<PureUser, "username" | "_id">[];
  attendee: Pick<PureUser, "username" | "_id">[];
  resources: PureExamResources[];
};

export type Exam = Document & PureExam;

const examSchema = new mongoose.Schema(
  {
    visible: { type: Boolean, require: true },
    name: { type: String, require: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    from: { type: Date, require: true },
    to: { type: Date, require: true },
    invigilator: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    attendee: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    resources: [{ type: mongoose.Schema.Types.ObjectId, ref: "examResources" }],
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<Exam>("exam", examSchema, "exam");
