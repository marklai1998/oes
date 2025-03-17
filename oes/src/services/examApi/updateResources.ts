import { PureExamResources } from "../../../server/models/examResources";
import { apiClient } from "../apiClient";

export const updateResources = async (id: string, data: PureExamResources[]) =>
  apiClient.patch(`/exam/${id}/resources`, data);
