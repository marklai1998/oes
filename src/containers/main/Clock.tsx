import React, { useEffect, useState } from "react";
import { Box, Title } from "../../components/Box";
import { dayjs } from "../../../server/utils/dayjs";
import styled from "styled-components";
import { useAuth } from "../../hooks/useAuth";
import { useSocket } from "../../hooks/useSocket";

export const Clock = () => {
  const { user, isLoggedIn } = useAuth();
  const [time, setTime] = useState(dayjs().toISOString());
  const { socket } = useSocket();

  useEffect(() => {
    socket.on("time", (time: string) => {
      setTime(time);
    });
  }, []);

  const dayjsTime = dayjs(time);

  return (
    <Wrapper>
      <Title>Welcome Back {isLoggedIn ? user.username : ""}</Title>
      <TimeWrapper>
        <Time>{dayjsTime.format("hh:mm:ss")}</Time>
        {dayjsTime.format("A")}
        <Date>{dayjsTime.format("YYYY-MM-DD")}</Date>
      </TimeWrapper>
    </Wrapper>
  );
};

const Wrapper = styled(Box)``;

const TimeWrapper = styled.div`
  color: #1890ff;
  padding: 0 24px 16px 24px;
`;

const Time = styled.span`
  font-size: 32px;
  margin-right: 8px;
`;

const Date = styled.div`
  color: #575757;
`;
