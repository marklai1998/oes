import { useFetch } from "./useFetch";
import { useEffect } from "react";
import { getUser } from "../services/userApi/getUser";
import { dayjs } from "../../server/utils/dayjs";
import { login } from "../services/userApi/login";
import constate from "constate";
import { userState } from "../recoil/user";
import { useRecoilState } from "recoil";
import { useLocalStorage } from "react-use";
import * as R from "ramda";

export const [UserAuthProvider, useAuth] = constate(() => {
  const { fetchData: fetchUser } = useFetch(getUser);
  const { fetchData: performLogin } = useFetch(login);
  const [idToken, setIdToken, removeIdToken] = useLocalStorage<string>(
    "id_token",
    undefined,
    { raw: true }
  );
  const [
    tokenExpireAt,
    setTokenExpireAt,
    removeTokenExpireAt,
  ] = useLocalStorage<string>("expires_at", undefined, { raw: true });

  const [user, setUser] = useRecoilState(userState);

  const handleLogout = () => {
    removeIdToken();
    removeTokenExpireAt();
    setUser(null);
  };

  const updateToken = () => {
    if (tokenExpireAt && dayjs().isAfter(tokenExpireAt)) {
      handleLogout();
    }
  };

  const refreshUser = async () => {
    const { result, success } = await fetchUser();
    result && success && setUser(result);
  };

  useEffect(() => {
    updateToken();
    idToken && refreshUser();
  }, [idToken]);

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
      setIdToken(result.token);
      setTokenExpireAt(result.expires);
      await refreshUser();
    }
  };

  return {
    user,
    tier: user && user.tier,
    logout: handleLogout,
    login: handleLogin,
    isLoggedIn: !R.isNil(idToken),
    isAuthing: !R.isNil(idToken) && !user,
  };
});
