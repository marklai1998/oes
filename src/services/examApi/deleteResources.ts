import { apiClient } from "../apiClient";

export const deleteResources = async (id: string, imageId: string) =>
  apiClient.delete(`/exam/${id}/resources/${imageId}`);
