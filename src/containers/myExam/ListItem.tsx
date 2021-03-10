import React, { useMemo } from "react";
import styled from "styled-components";
import { PureExam } from "../../../server/models/exam";
import { FieldTimeOutlined } from "@ant-design/icons";
import { dayjs } from "../../../server/utils/dayjs";
import { Tag } from "antd";
import { useTime } from "../../hooks/useTime";

type Props = {
  item: PureExam;
};

export const ListItem = ({ item }: Props) => {
  const now = useTime();

  const { isConvening, isOnGoing, isFinishing, isEnded } = useMemo(
    () => ({
      isConvening:
        dayjs(now).isSameOrAfter(dayjs(item.from).subtract(15, "minutes")) &&
        dayjs(item.from).isSameOrAfter(now),
      isOnGoing:
        dayjs(now).isSameOrAfter(item.from) &&
        dayjs(item.to).isSameOrAfter(item.to),
      isEnded: dayjs(now).isSameOrAfter(item.to),
      isFinishing:
        dayjs(item.to).add(15, "minutes").isSameOrAfter(now) &&
        dayjs(now).isSameOrAfter(dayjs(item.to)),
    }),
    [now, item]
  );

  return (
    <Wrapper>
      <Name>
        {item.name}
        <TagGroup>
          {isConvening && <Tag color="green">Convening</Tag>}
          {isOnGoing && <Tag color="blue">Ongoing</Tag>}
          {isFinishing && <Tag color="red">Finishing</Tag>}
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
