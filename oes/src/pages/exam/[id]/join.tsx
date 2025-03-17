import React, { useEffect } from "react";
import { ContentWrapper } from "../../../components/ContentWrapper";
import { useRouter } from "next/router";
import { useFetch } from "../../../hooks/useFetch";
import { getPopulatedExam } from "../../../services/examApi/getPopulatedExam";
import { useAuth } from "../../../hooks/useAuth";
import { StudentView } from "../../../containers/studentView";

const JoinExam = () => {
  const {
    query: { id },
  } = useRouter();
  const { isStudent } = useAuth();
  const { fetchData, data } = useFetch(getPopulatedExam);

  useEffect(() => {
    id && fetchData(id);
  }, [id]);

  return !data ? (
    <></>
  ) : (
    <ContentWrapper>{isStudent && <StudentView exam={data} />}</ContentWrapper>
  );
};

export default JoinExam;
