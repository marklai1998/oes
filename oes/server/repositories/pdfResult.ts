import pdfResult from "../models/pdfResult";
import path from "path";
import fs, { writeFileSync } from "fs";
import { v4 as uuid } from "uuid";
import { getExamSubmission } from "./examSubmission";
import { PDFDocument } from "pdf-lib";
import jimp from "jimp";
import appRoot from "app-root-path";

export const generatePDF = async (examId: string, userId: string) => {
  const item = await pdfResult.findOne({ examId, userId }).lean();

  if (item) {
    fs.unlinkSync(
      path.resolve(
        appRoot.toString(),
        "public",
        "uploads",
        "pdf",
        `${item.fileId}.pdf`
      )
    );
    await pdfResult.findOneAndDelete({ examId, userId });
  }
  const fileId = uuid();

  const submissions = await getExamSubmission(examId, userId);

  const pdfDoc = await PDFDocument.create();

  const imageArray = await Promise.all(
    submissions.map(async ({ path: imgPath }) => {
      const image = await jimp.read(path.resolve(appRoot.toString(), imgPath));
      return image.contrast(0.3).getBufferAsync(jimp.MIME_PNG);
    })
  );

  await Promise.all(
    imageArray.map(async (imageBuffer) => {
      const page = pdfDoc.addPage();

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
    path.resolve(
      appRoot.toString(),
      "public",
      "uploads",
      "pdf",
      `${fileId}.pdf`
    ),
    pdfBytes,
    { flag: "wx" }
  );

  await pdfResult.create({ examId, userId, fileId });

  return fileId;
};
