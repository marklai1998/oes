import { Button, message } from "antd";
import React, { useMemo } from "react";
import styled from "styled-components";
import { PopulatedExam } from "../../../server/models/exam";
import { getExamStatus } from "../../../server/utils/getExamStatus";
import { Box, Title } from "../../components/Box";
import { ExamStatusBadge } from "../../components/ExamStatusBadge";
import { useTime } from "../../hooks/useTime";
import { DeleteOutlined } from "@ant-design/icons";
import { useFetch } from "../../hooks/useFetch";
import Router from "next/router";
import { deleteExam } from "../../services/examApi/deleteExam";

type Props = {
  data: PopulatedExam;
};

export const Header = ({ data }: Props) => {
  const now = useTime();
  const { fetchData } = useFetch(deleteExam);

  const status = useMemo(() => getExamStatus(now, data), [data, now]);

  const handleDelete = async () => {
    const { success } = await fetchData(data._id);
    if (success) {
      message.success("Exam deleted");
      Router.push("/myExam");
    }
  };

  return (
    <Wrapper>
      <MetaWrapper>
        <Title>{data.name}</Title>
        <ExamStatusBadge status={status} />
      </MetaWrapper>
      <ButtonGroup>
        <Button type="link" size="large" danger onClick={handleDelete}>
          <DeleteOutlined />
        </Button>
      </ButtonGroup>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  display: flex;

  & ${Title} {
    color: #1890ff;
  }
`;

const MetaWrapper = styled.div`
  width: 100%;
  display: flex;
`;

const ButtonGroup = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;