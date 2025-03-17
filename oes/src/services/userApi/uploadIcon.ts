import { apiClient } from "../apiClient";

export const uploadIcon = async (image: File) => {
  const formData = new FormData();
  formData.append("image", image);

  return apiClient.post(`/user/icon`, formData);
};
