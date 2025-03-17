import { PureExam } from "../../../server/models/exam";
import { apiClient } from "../apiClient";

export type CreateExamPayload = {
  name: string;
  from: string;
  to: string;
};

export const createExam = async (data: CreateExamPayload) =>
  apiClient.post<PureExam>(`/exam`, data);
