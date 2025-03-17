import { ContentWrapper } from "../components/ContentWrapper";
import { Spacer } from "../components/Spacer";
import { Clock } from "../containers/main/Clock";
import { ExamCalendar } from "../containers/main/ExamCalendar";

const Home = () => {
  return (
    <ContentWrapper>
      <Clock />
      <Spacer />
      <ExamCalendar />
    </ContentWrapper>
  );
};

export default Home;
