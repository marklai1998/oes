import { PureExamResources } from "../../../server/models/examResources";
import { apiClient } from "../apiClient";

export const addResources = async (id: string, image: File) => {
  const formData = new FormData();
  formData.append("image", image);

  return apiClient.post<PureExamResources>(`/exam/${id}/resources`, formData);
};
