import React, { useEffect } from "react";
import { ContentWrapper } from "../../../components/ContentWrapper";
import { useRouter } from "next/router";
import { useFetch } from "../../../hooks/useFetch";
import { getPopulatedExam } from "../../../services/examApi/getPopulatedExam";
import { useAuth } from "../../../hooks/useAuth";
import { InvigilatorView } from "../../../containers/invigilatorView";

const JoinExam = () => {
  const {
    query: { id },
  } = useRouter();
  const { isInvigilator } = useAuth();
  const { fetchData, data } = useFetch(getPopulatedExam);

  useEffect(() => {
    id && fetchData(id);
  }, [id]);

  return !data ? (
    <></>
  ) : (
    <ContentWrapper>
      {isInvigilator && <InvigilatorView exam={data} />}
    </ContentWrapper>
  );
};

export default JoinExam;
