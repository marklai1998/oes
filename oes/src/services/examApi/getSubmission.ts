import { PureExamSubmission } from "../../../server/models/examSubmission";
import { apiClient } from "../apiClient";

export const getSubmission = async (id: string) => {
  return apiClient.get<PureExamSubmission[]>(`/exam/${id}/submission`);
};
