import React, { useMemo } from "react";
import styled from "styled-components";
import { PureExam } from "../../../server/models/exam";
import {
  FieldTimeOutlined,
  EditOutlined,
  CameraOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { dayjs } from "../../../server/utils/dayjs";
import { Button } from "antd";
import { useTime } from "../../hooks/useTime";
import { getExamStatus } from "../../../server/utils/getExamStatus";
import { useAuth } from "../../hooks/useAuth";
import * as R from "ramda";
import Link from "next/link";
import { ExamStatusBadge } from "../../components/ExamStatusBadge";
import { useCamera } from "../../hooks/useCamera";

type Props = {
  item: PureExam;
};

export const ListItem = ({ item }: Props) => {
  const now = useTime();
  const { isAdmin, user, isStudent } = useAuth();
  const { hasCameraSupport } = useCamera();

  const status = useMemo(() => getExamStatus(now, item), [now, item]);
  const canEdit = user
    ? isAdmin ||
      item.createdBy === user._id ||
      R.any((_id) => _id === user._id, item.invigilator)
    : false;

  return (
    <Wrapper>
      <MetaWrapper>
        <NameWrapper>
          <Name>{item.name}</Name>
          <ExamStatusBadge status={status} />
        </NameWrapper>
        <Time>
          <FieldTimeOutlined />{" "}
          {`${dayjs(item.from).format("YYYY-MM-DD hh:mm")} - 
       ${dayjs(item.to).format("YYYY-MM-DD hh:mm")}`}
        </Time>
      </MetaWrapper>
      <ControlWrapper>
        {isStudent && hasCameraSupport && (
          <Link href={`/exam/${item._id}/join`}>
            <Button type="link">
              <CameraOutlined />
            </Button>
          </Link>
        )}
        {canEdit && (
          <Link href={`/exam/${item._id}/submit`}>
            <Button type="link">
              <CopyOutlined />
            </Button>
          </Link>
        )}
        {canEdit && (
          <Link href={`/exam/${item._id}/edit`}>
            <Button type="link">
              <EditOutlined />
            </Button>
          </Link>
        )}
      </ControlWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  border-top: 1px solid #eee;
  padding: 8px 16px;
  display: flex;
`;

const NameWrapper = styled.div`
  color: #1890ff;
  font-size: 16px;
`;

const Name = styled.span`
  margin-right: 8px;
`;

const Time = styled.div`
  font-size: 12px;
  color: #8a8a8a;
`;

const MetaWrapper = styled.div`
  width: 100%;
`;

const ControlWrapper = styled.div`
  flex-shrink: 0;

  & button {
    padding: 0 8px;
  }
`;
