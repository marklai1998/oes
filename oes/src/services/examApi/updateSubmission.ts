import { PureExamSubmission } from "../../../server/models/examSubmission";
import { apiClient } from "../apiClient";

export const updateSubmission = async (
  id: string,
  data: PureExamSubmission[]
) => apiClient.patch(`/exam/${id}/submission`, data);
