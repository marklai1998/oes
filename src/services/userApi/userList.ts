import { PureUser } from "../../../server/models/user";
import { apiClient } from "../apiClient";

export const userList = async (params: { page: number; pagesize: number }) =>
  apiClient.get<{ list: PureUser[]; total: number }>(`/user/list`, { params });
