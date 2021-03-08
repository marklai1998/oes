import mongoose, { Document } from "mongoose";
import { PureExamResources } from "./examResources";
import { PureUser } from "./user";

export type PureExam = {
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  createdBy: string;
  from: Date;
  to: Date;
  invigilator: string[];
  attendee: string[];
  resources: string[];
};

export type PopulatedExam = {
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  createdBy: PureUser;
  from: Date;
  to: Date;
  invigilator: PureUser[];
  attendee: PureUser[];
  resources: PureExamResources[];
};

export type Exam = Document & PureExam;

const examSchema = new mongoose.Schema(
  {
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
