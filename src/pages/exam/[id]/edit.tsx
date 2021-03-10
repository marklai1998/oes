import React, { useEffect } from "react";
import { ContentWrapper } from "../../../components/ContentWrapper";
import { useRouter } from "next/router";
import { useFetch } from "../../../hooks/useFetch";
import { getExamDetail } from "../../../services/examApi/getExam";
import { Header } from "../../../containers/editExam/Header";

const EditExam = () => {
  const {
    query: { id },
  } = useRouter();
  const { fetchData, data } = useFetch(getExamDetail);

  console.log(id, data);

  useEffect(() => {
    id && fetchData(id);
  }, [id]);

  return !data ? (
    <></>
  ) : (
    <ContentWrapper>
      <Header data={data} />
    </ContentWrapper>
  );
};

export default EditExam;
