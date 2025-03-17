import React, { useEffect } from "react";
import { Box, Title } from "../../components/Box";
import { dayjs } from "../../../server/utils/dayjs";
import styled from "styled-components";
import { useAuth } from "../../hooks/useAuth";
import { useDate, useTime } from "../../hooks/useTime";
import { useFetch } from "../../hooks/useFetch";
import { listTodayExam } from "../../services/examApi/listTodayExam";

export const Clock = () => {
  const { user, isLoggedIn } = useAuth();
  const time = useTime();
  const date = useDate();

  const dayjsTime = dayjs(time);

  const { fetchData, data } = useFetch(listTodayExam, {
    fallBackValue: { count: 0, list: [] },
  });

  useEffect(() => {
    fetchData();
  }, [date]);

  return (
    <Box>
      <Title>Welcome Back {isLoggedIn ? user.username : ""}</Title>
      <ContentWrapper>
        <TimeWrapper>
          <Time>{dayjsTime.format("hh:mm:ss")}</Time>
          {dayjsTime.format("A")}
          <Date>{dayjsTime.format("YYYY-MM-DD")}</Date>
        </TimeWrapper>
        <BadgeWrapper>
          <Badge>{data ? data.count : 0} Exam today</Badge>
        </BadgeWrapper>
      </ContentWrapper>
    </Box>
  );
};

const TimeWrapper = styled.div`
  color: #1890ff;
  padding: 0 16px 16px 16px;
`;

const Time = styled.span`
  font-size: 32px;
  margin-right: 8px;
`;

const Date = styled.div`
  color: #575757;
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BadgeWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 0 20px;
`;

const Badge = styled.div`
  background-color: #1890ff;
  height: 40px;
  color: #fff;
  line-height: 40px;
  text-align: center;
  border-radius: 4px;
  font-size: 16px;
  padding: 0 16px;
`;
