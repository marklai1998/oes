import React from "react";
import { useDeepCompareEffect, useSetState } from "react-use";
import { PopulatedExam } from "../../../server/models/exam";
import { useFetch } from "../../hooks/useFetch";
import { updateExam } from "../../services/examApi/updateExam";
import { Header } from "./Header";

type Props = { initialValue: PopulatedExam };

export const ExamEditor = ({ initialValue }: Props) => {
  const [exam, setExam] = useSetState(initialValue);
  const { fetchData: handleUpdateExam } = useFetch(updateExam);

  const handleVisibleChange = (value: boolean) => {
    setExam({ visible: value });
  };

  useDeepCompareEffect(() => {
    handleUpdateExam(initialValue._id, exam);
  }, [exam]);

  return (
    <>
      <Header data={exam} onVisibleChange={handleVisibleChange} />
    </>
  );
};
