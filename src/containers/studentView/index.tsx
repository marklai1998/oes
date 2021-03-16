import React from "react";
import { PopulatedExam } from "../../../server/models/exam";

type Props = { exam: PopulatedExam };

export const StudentView = ({ exam }: Props) => {
  console.log(exam);

  return <div>test</div>;
};
