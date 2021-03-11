import { Button, message, Switch } from "antd";
import React from "react";
import styled from "styled-components";
import { PureExam } from "../../../server/models/exam";
import { Box, Title } from "../../components/Box";
import { ExamStatusBadge } from "../../components/ExamStatusBadge";
import { DeleteOutlined } from "@ant-design/icons";
import { useFetch } from "../../hooks/useFetch";
import Router from "next/router";
import { deleteExam } from "../../services/examApi/deleteExam";
import { examStatusType } from "../../../server/constants/examStatusType";

type Props = {
  data: PureExam;
  onVisibleChange: (value: boolean) => void;
  status: examStatusType;
  locked: boolean;
};

export const Header = ({ status, data, onVisibleChange, locked }: Props) => {
  const { fetchData: handleDeleteExam } = useFetch(deleteExam);

  const handleDelete = async () => {
    const { success } = await handleDeleteExam(data._id);
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
        <Switch
          checkedChildren="Visible"
          unCheckedChildren="Invisible"
          checked={data.visible}
          onChange={onVisibleChange}
          disabled={locked}
        />
        <Button
          type="link"
          size="large"
          danger
          onClick={handleDelete}
          disabled={locked}
        >
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
    font-size: 24px;
    line-height: 56px;
  }
`;

const MetaWrapper = styled.div`
  width: 100%;
  display: flex;
`;

const ButtonGroup = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;
