import { PureExam } from "../../../server/models/exam";
import { apiClient } from "../apiClient";

export const listAllExam = async () =>
  apiClient.get<{ count: number; list: PureExam[] }>(`/exam/list`);
