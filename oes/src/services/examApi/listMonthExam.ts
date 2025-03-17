import { PureExam } from "../../../server/models/exam";
import { apiClient } from "../apiClient";

export const listMonthExam = async () =>
  apiClient.get<{ count: number; list: PureExam[] }>(`/exam/list/month`);
