import { message } from "antd";
import Router from "next/router";
import { useEffect } from "react";
import { LoginForm } from "../components/LoginForm";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
import { register } from "../services/userApi/register";

const SignUp = () => {
  const { isLoggedIn } = useAuth();
  const { fetchData: handleRegister } = useFetch(register);

  useEffect(() => {
    isLoggedIn && Router.push("/");
  }, [isLoggedIn]);

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    const { success, error } = await handleRegister(values);

    if (success) {
      Router.push("/login");
    } else {
      error === "USER_ALREADY_EXIST" && message.error("User already exist");
    }
  };

  return <LoginForm isLogin={false} onSubmit={handleSubmit} />;
};

export default SignUp;
