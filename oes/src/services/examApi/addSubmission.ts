import { PureExamSubmission } from "../../../server/models/examSubmission";
import { apiClient } from "../apiClient";

export const addSubmission = async (id: string, image: File) => {
  const formData = new FormData();
  formData.append("image", image);

  return apiClient.post<PureExamSubmission>(`/exam/${id}/submission`, formData);
};
