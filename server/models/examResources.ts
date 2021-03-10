import mongoose, { Document, ObjectId } from "mongoose";

export type PureExamResources = {
  _id: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ExamResources = Document & PureExamResources;

const examResourcesSchema = new mongoose.Schema(
  {},
  { timestamps: true, versionKey: false }
);

export default mongoose.model<ExamResources>(
  "examResources",
  examResourcesSchema,
  "examResources"
);
