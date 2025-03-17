import { LoginForm } from "../components/LoginForm";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { login } = useAuth();

  return <LoginForm isLogin onSubmit={login} />;
};

export default Login;
