import { PureExamSubmission } from "../../../server/models/examSubmission";
import { apiClient } from "../apiClient";

export type SubmissionItem = {
  _id: string;
  username: string;
  images: PureExamSubmission[];
};

export const listSubmission = async (id: string) => {
  return apiClient.get<SubmissionItem[]>(`/exam/${id}/submission/list`);
};
