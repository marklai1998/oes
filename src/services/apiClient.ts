import axios from "axios";
import * as R from "ramda";

export const apiClient = axios.create({
  baseURL: "/api",
});

apiClient.interceptors.request.use(async (config) => {
  try {
    const token = window.localStorage.getItem("id_token");

    return token
      ? R.assocPath(["headers", "Authorization"], `Bearer ${token}`, config)
      : config;
  } catch (e) {
    // no need error handler to prevent error on not logged in user
    return config;
  }
});
