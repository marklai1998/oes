import { PureExam } from "../../../server/models/exam";
import { apiClient } from "../apiClient";

export const updateExam = async (id: string, data: Partial<PureExam>) =>
  apiClient.patch<PureExam>(`/exam/${id}`, data);
