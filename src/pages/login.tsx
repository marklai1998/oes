import { useEffect } from "react";
import { LoginForm } from "../components/LoginForm";
import { useAuth } from "../hooks/useAuth";
import Router from "next/router";

const Login = () => {
  const { login, isLoggedIn } = useAuth();

  useEffect(() => {
    isLoggedIn && Router.push("/");
  }, [isLoggedIn]);

  return (
    <>
      <div className="login">
        <LoginForm isLogin onSubmit={login} />
      </div>
    </>
  );
};

export default Login;
