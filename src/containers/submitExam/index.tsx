import { Button } from "antd";
import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { PopulatedExam } from "../../../server/models/exam";
import { Box } from "../../components/Box";

type Props = { exam: PopulatedExam };

export const SubmitExam = ({ exam }: Props) => {
  return (
    <>
      <Info>
        <div>Exam: {exam.name}</div>
        <Link href={`/exam/${exam._id}/join`}>
          <Button type="primary">Back to Exam</Button>
        </Link>
      </Info>
    </>
  );
};

const Info = styled(Box)`
  color: #1890ff;
  font-size: 20px;
  padding: 8px 16px;
  display: flex;

  & div {
    width: 100%;
  }
`;
