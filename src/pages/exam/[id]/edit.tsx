import React, { useEffect } from "react";
import { ContentWrapper } from "../../../components/ContentWrapper";
import { useRouter } from "next/router";
import { useFetch } from "../../../hooks/useFetch";
import { getExamDetail } from "../../../services/examApi/getExam";
import { ExamEditor } from "../../../containers/editExam";

const EditExam = () => {
  const {
    query: { id },
  } = useRouter();
  const { fetchData, data } = useFetch(getExamDetail);

  useEffect(() => {
    id && fetchData(id);
  }, [id]);

  return !data ? (
    <></>
  ) : (
    <ContentWrapper>
      <ExamEditor initialValue={data} />
    </ContentWrapper>
  );
};

export default EditExam;
