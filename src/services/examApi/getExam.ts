import { PopulatedExam } from "./../../../server/models/exam";
import { apiClient } from "../apiClient";

export const getExamDetail = async (id: string) =>
  apiClient.get<PopulatedExam>(`/exam/${id}`);
