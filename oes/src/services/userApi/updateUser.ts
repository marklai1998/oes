import { PureUser } from "../../../server/models/user";
import { apiClient } from "../apiClient";

export const updateUser = async (_id: string, newValues: Partial<PureUser>) =>
  apiClient.patch<{ list: PureUser[]; total: number }>(`/user`, {
    _id,
    newValues,
  });
