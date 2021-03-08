import Router from "next/router";
import { useEffect } from "react";
import { ContentWrapper } from "../components/ContentWrapper";
import { Clock } from "../containers/main/Clock";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    !isLoggedIn && Router.push("/login");
  }, [isLoggedIn]);

  return (
    <ContentWrapper>
      <Clock />
    </ContentWrapper>
  );
};

export default Home;
