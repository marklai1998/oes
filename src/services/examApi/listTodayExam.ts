import { PureExam } from "../../../server/models/exam";
import { apiClient } from "../apiClient";

export const listTodayExam = async () =>
  apiClient.get<{ count: number; list: PureExam[] }>(`/exam/list/today`);
