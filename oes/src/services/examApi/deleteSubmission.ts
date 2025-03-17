import { apiClient } from "../apiClient";

export const deleteSubmission = async (id: string, imageId: string) =>
  apiClient.delete(`/exam/${id}/submission/${imageId}`);
