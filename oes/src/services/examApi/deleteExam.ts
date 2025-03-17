import { apiClient } from "../apiClient";

export const deleteExam = async (id: string) => apiClient.delete(`/exam/${id}`);
