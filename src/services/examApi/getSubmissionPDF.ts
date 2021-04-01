import { apiClient } from "../apiClient";

export const getSubmissionPDF = async (id: string, userId: string) => {
  return apiClient.get<string>(`/exam/${id}/submission/${userId}/pdf`);
};
