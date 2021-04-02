import { PureExamResources } from "../../../server/models/examResources";
import { apiClient } from "../apiClient";

export const getResources = async (id: string) => {
  return apiClient.get<PureExamResources[]>(`/exam/${id}/resources`);
};
