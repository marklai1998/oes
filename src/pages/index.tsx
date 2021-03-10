import Router from "next/router";
import { useEffect } from "react";
import { ContentWrapper } from "../components/ContentWrapper";
import { Spacer } from "../components/Spacer";
import { Clock } from "../containers/main/Clock";
import { ExamCalendar } from "../containers/main/ExamCalendar";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    !isLoggedIn && Router.push("/login");
  }, [isLoggedIn]);

  return !isLoggedIn ? (
    <></>
  ) : (
    <ContentWrapper>
      <Clock />
      <Spacer />
      <ExamCalendar />
    </ContentWrapper>
  );
};

export default Home;
