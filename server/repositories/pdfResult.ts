import pdfResult from "../models/pdfResult";
import path from "path";
import fs, { readFileSync, writeFileSync } from "fs";
import { v4 as uuid } from "uuid";
import { getExamSubmission } from "./examSubmission";
import { PDFDocument } from "pdf-lib";
const appRoot = path.resolve(__dirname, "..", "..");

export const generatePDF = async (examId: string, userId: string) => {
  const item = await pdfResult.findOne({ examId, userId }).lean();

  if (item) {
    fs.unlinkSync(
      path.resolve(appRoot, "public", "uploads", "pdf", `${item.fileId}.pdf`)
    );
    await pdfResult.findOneAndDelete({ examId, userId });
  }
  const fileId = uuid();

  const submissions = await getExamSubmission(examId, userId);

  const pdfDoc = await PDFDocument.create();

  await Promise.all(
    submissions.map(async ({ path: imgPath }) => {
      const page = pdfDoc.addPage();

      const imageBuffer = readFileSync(path.resolve(appRoot, imgPath));

      const img = await pdfDoc.embedPng(imageBuffer);
      const imgDims = img.scaleToFit(page.getWidth(), page.getHeight());

      page.drawImage(img, {
        x: page.getWidth() / 2 - imgDims.width / 2,
        y: page.getHeight() / 2 - imgDims.height / 2,
        width: imgDims.width,
        height: imgDims.height,
      });
    })
  );

  const pdfBytes = await pdfDoc.save();

  writeFileSync(
    path.resolve(appRoot, "public", "uploads", "pdf", `${fileId}.pdf`),
    pdfBytes,
    { flag: "wx" }
  );

  await pdfResult.create({ examId, userId, fileId });

  return fileId;
};
