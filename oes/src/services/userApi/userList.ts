import { userTierType } from "../../../server/constants/userTierType";
import { PureUser } from "../../../server/models/user";
import { apiClient } from "../apiClient";

export const userList = async (params: {
  page: number;
  pagesize: number;
  tier?: userTierType[];
}) =>
  apiClient.get<{ list: PureUser[]; total: number }>(`/user/list`, { params });
