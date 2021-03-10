import { message } from "antd";
import Router from "next/router";
import { LoginForm } from "../components/LoginForm";
import { useFetch } from "../hooks/useFetch";
import { register } from "../services/userApi/register";

const SignUp = () => {
  const { fetchData: handleRegister } = useFetch(register);

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    const { success, error } = await handleRegister(values);

    if (success) {
      Router.push("/login");
      message.success("Register successfully");
    } else {
      error === "USER_ALREADY_EXIST" && message.error("User already exist");
    }
  };

  return <LoginForm isLogin={false} onSubmit={handleSubmit} />;
};

export default SignUp;
