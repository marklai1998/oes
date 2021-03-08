import { apiClient } from "../apiClient";

export const register = async (data: { username: string; password: string }) =>
  apiClient.post(`/user/register`, data);
