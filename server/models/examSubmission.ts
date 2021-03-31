import mongoose, { Document, ObjectId } from "mongoose";

export type PureExamSubmission = {
  _id: ObjectId | string;
  examId: ObjectId | string;
  userId: ObjectId | string;
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

export type ExamSubmission = Document & PureExamSubmission;

const examSubmissionSchema = new mongoose.Schema(
  {
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "exam" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
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

export default mongoose.model<ExamSubmission>(
  "examSubmission",
  examSubmissionSchema,
  "examSubmission"
);
