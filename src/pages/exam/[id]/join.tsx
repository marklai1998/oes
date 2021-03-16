import React, { useEffect } from "react";
import { ContentWrapper } from "../../../components/ContentWrapper";
import Router, { useRouter } from "next/router";
import { useFetch } from "../../../hooks/useFetch";
import { getPopulatedExam } from "../../../services/examApi/getPopulatedExam";
import { useAuth } from "../../../hooks/useAuth";
import { isElectron } from "../../../constants/isElectron";
import { InvigilatorView } from "../../../containers/invigilatorView";
import { StudentView } from "../../../containers/studentView";

const JoinExam = () => {
  const {
    query: { id },
  } = useRouter();
  const { isStudent, isInvigilator } = useAuth();
  const { fetchData, data } = useFetch(getPopulatedExam);

  useEffect(() => {
    isStudent && !isElectron && Router.push("/");
  }, [isStudent, isElectron]);

  useEffect(() => {
    id && fetchData(id);
  }, [id]);

  return !data ? (
    <></>
  ) : (
    <ContentWrapper>
      {isInvigilator ? (
        <InvigilatorView exam={data} />
      ) : (
        <>{isElectron && <StudentView exam={data} />}</>
      )}
    </ContentWrapper>
  );
};

export default JoinExam;
