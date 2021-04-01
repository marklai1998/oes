import mongoose, { Document, ObjectId } from "mongoose";

export type PurePDFResult = {
  _id: ObjectId | string;
  examId: ObjectId | string;
  userId: ObjectId | string;
  fileId: string;
};

export type PDFResult = Document & PurePDFResult;

const pdfResultSchema = new mongoose.Schema(
  {
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "exam" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    fileId: String,
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<PDFResult>(
  "pdfResult",
  pdfResultSchema,
  "pdfResult"
);
