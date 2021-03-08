import { userTierType } from "../../../server/constants/userTierType";
import { apiClient } from "../apiClient";

export type UserCountItem = { tier: userTierType; total: number };

export const getUserCount = async () =>
  apiClient.get<UserCountItem[]>(`/user/count`);
