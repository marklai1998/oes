import mongoose, { Document, ObjectId } from "mongoose";

export type PureExamResources = {
  _id: ObjectId | string;
  examId: ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
  order: number;
};

export type ExamResources = Document & PureExamResources;

const examResourcesSchema = new mongoose.Schema(
  {
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "exam" },
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number,
    order: Number,
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<ExamResources>(
  "examResources",
  examResourcesSchema,
  "examResources"
);
