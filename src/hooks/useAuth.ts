import { refreshToken } from "./../services/userApi/refreshToken";
import { useFetch } from "./useFetch";
import { useEffect, useState } from "react";
import { getUser } from "../services/userApi/getUser";
import { PureUser } from "../../server/models/user";
import { dayjs } from "../../server/utils/dayjs";
import { login } from "../services/userApi/login";
import constate from "constate";

export const [UserAuthProvider, useAuth] = constate(() => {
  const { fetchData: fetchUser } = useFetch(getUser);
  const { fetchData: performLogin } = useFetch(login);

  const [user, setUser] = useState<null | PureUser>(null);

  const handleLogout = () => {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    setUser(null);
  };

  const updateToken = () => {
    const expireDate = localStorage.getItem("expires_at");
    if (expireDate && dayjs().isAfter(expireDate)) {
      handleLogout();
    }
  };

  const refreshUser = async () => {
    const { result, success } = await fetchUser();
    result && success && setUser(result);
  };

  useEffect(() => {
    updateToken();
    const token = localStorage.getItem("id_token");
    token && refreshUser();
  }, []);

  const handleLogin = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    const { result, success } = await performLogin({
      username,
      password,
    });

    if (success) {
      localStorage.setItem("id_token", result.token);
      localStorage.setItem("expires_at", result.expires);
      await refreshUser();
    }
  };

  return {
    user,
    logout: handleLogout,
    login: handleLogin,
  };
});
