import { Button, Table } from "antd";
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
import { DownloadOutlined } from "@ant-design/icons";
import { getSubmissionPDF } from "../../services/examApi/getSubmissionPDF";

type Props = { exam: PopulatedExam };

const column = (
  onDownloadClick: (userId: string) => void
): ColumnsType<SubmissionItem> => [
  { dataIndex: "username", title: "User" },
  { title: "File Count", render: (_, { images }) => images.length },
  {
    dataIndex: "_id",
    title: "Download PDF",
    render: (userId) => (
      <Button type="link" onClick={() => onDownloadClick(userId)}>
        <DownloadOutlined />
      </Button>
    ),
  },
];

export const SubmissionList = ({ exam }: Props) => {
  const { fetchData: handleListSubmission, data } = useFetch(listSubmission);
  const { fetchData: getPDF } = useFetch(getSubmissionPDF);

  const now = useTime();
  const status = getExamStatus(now, exam);

  useEffect(() => {
    handleListSubmission(exam._id);
  }, []);

  const onDownloadClick = async (userId: string) => {
    const { success, result } = await getPDF(exam._id, userId);

    if (success && result) {
      window.open(`/uploads/pdf/${result}.pdf`, "_blank");
    }
  };

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
        columns={column(onDownloadClick)}
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
