import { FormEventHandler } from "react";
import { useAuth } from "../hooks/useAuth";
import Layout from "../components/layout";
import Form from "../components/form";

const Login = () => {
  const { login } = useAuth();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    login({
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value,
    });
  };

  return (
    <Layout>
      <div className="login">
        <Form isLogin onSubmit={handleSubmit} />
      </div>
      <style jsx>{`
        .login {
          max-width: 21rem;
          margin: 0 auto;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      `}</style>
    </Layout>
  );
};

export default Login;
