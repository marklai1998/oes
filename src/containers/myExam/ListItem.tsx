import React from "react";
import styled from "styled-components";
import { PureExam } from "../../../server/models/exam";
import { FieldTimeOutlined } from "@ant-design/icons";
import { dayjs } from "../../../server/utils/dayjs";
import { Tag } from "antd";

type Props = {
  item: PureExam;
};

export const ListItem = ({ item }: Props) => {
  const isOnGoing =
    dayjs().isSameOrAfter(item.from) && dayjs(item.to).isSameOrAfter(item.to);
  const isEnded = dayjs().isSameOrAfter(item.to);

  return (
    <Wrapper>
      <Name>
        {item.name}
        <TagGroup>
          {isOnGoing && <Tag color="red">Ongoing</Tag>}
          {isEnded && <Tag color="grey">Ended</Tag>}
        </TagGroup>
      </Name>
      <Time>
        <FieldTimeOutlined />{" "}
        {`${dayjs(item.from).format("YYYY-MM-DD hh:mm")} - 
       ${dayjs(item.to).format("YYYY-MM-DD hh:mm")}`}
      </Time>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  border-top: 1px solid #eee;
  padding: 8px 16px;
`;

const Name = styled.div`
  color: #1890ff;
  font-size: 16px;
`;

const Time = styled.div`
  font-size: 12px;
  color: #8a8a8a;
`;

const TagGroup = styled.span`
  margin-left: 8px;
  line-height: 26px;

  & span {
    vertical-align: text-bottom;
  }
`;
