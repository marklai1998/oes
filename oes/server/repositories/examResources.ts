import examResources, { PureExamResources } from "../models/examResources";
import fs from "fs";
import path from "path";
import appRoot from "app-root-path";

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
  fs.unlinkSync(path.resolve(appRoot.toString(), file.path));
  await examResources.findByIdAndRemove(resourcesId);
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
