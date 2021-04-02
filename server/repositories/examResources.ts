import examResources, { PureExamResources } from "../models/examResources";
import fs from "fs";
import path from "path";
const appRoot = path.resolve(__dirname, "..", "..");

export const createExamResources = async (
  examId: string,
  data: PureExamResources
) => {
  const largestItem = await examResources
    .find({ examId })
    .sort({ price: -1 })
    .limit(1);

  return await examResources.create({
    ...data,
    examId,
    order: largestItem.length ? largestItem[0].order + 1 : 1,
  });
};

export const getExamResources = async (examId: string) =>
  examResources.find({ examId }).sort({ order: 1 }).lean();

export const deleteExamResources = async (
  examId: string,
  resourcesId: string
) => {
  const file = await examResources.findOne({ examId, _id: resourcesId }).lean();
  fs.unlinkSync(path.resolve(appRoot, file.path));
  examResources.findOneAndRemove({ examId, _id: resourcesId });
};

export const updateResources = async (
  id: string,
  newValues: PureExamResources[]
) => {
  await Promise.all(
    newValues.map(({ _id, order }) =>
      examResources.findOneAndUpdate({ examId: id, _id }, { order })
    )
  );
};
