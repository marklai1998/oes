import { PureUser } from "../../../server/models/user";
import { apiClient } from "../apiClient";

export const getUser = async () => apiClient.get<PureUser>(`/user`);
