import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useEffect } from "react";
import styled from "styled-components";
import { PopulatedExam } from "../../../server/models/exam";
import { getExamStatus } from "../../../server/utils/getExamStatus";
import { Box, Title } from "../../components/Box";
import { ExamStatusBadge } from "../../components/ExamStatusBadge";
import { Spacer } from "../../components/Spacer";
import { useFetch } from "../../hooks/useFetch";
import { useTime } from "../../hooks/useTime";
import {
  listSubmission,
  SubmissionItem,
} from "../../services/examApi/listSubmission";

type Props = { exam: PopulatedExam };

const column: ColumnsType<SubmissionItem> = [
  { dataIndex: "username", title: "User" },
  { title: "File Count", render: (_, { images }) => images.length },
];

export const SubmissionList = ({ exam }: Props) => {
  const { fetchData, data } = useFetch(listSubmission);
  const now = useTime();
  const status = getExamStatus(now, exam);

  useEffect(() => {
    fetchData(exam._id);
  }, []);

  console.log(data);

  return (
    <>
      <Wrapper>
        <MetaWrapper>
          <Title>{exam.name}</Title>
          <ExamStatusBadge status={status} />
        </MetaWrapper>
      </Wrapper>
      <Spacer />
      <Table
        dataSource={data || []}
        columns={column}
        pagination={false}
        size="small"
      />
    </>
  );
};

const Wrapper = styled(Box)`
  display: flex;

  & ${Title} {
    color: #1890ff;
    font-size: 24px;
    line-height: 56px;
  }
`;

const MetaWrapper = styled.div`
  width: 100%;
  display: flex;
`;
