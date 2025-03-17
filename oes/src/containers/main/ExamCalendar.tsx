import { Calendar } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { dayjs } from "../../../server/utils/dayjs";
import { Box, Title } from "../../components/Box";
import { useFetch } from "../../hooks/useFetch";
import { useDate } from "../../hooks/useTime";
import { listMonthExam } from "../../services/examApi/listMonthExam";
import styled from "styled-components";

export const ExamCalendar = () => {
  const date = useDate();
  const { fetchData, data } = useFetch(listMonthExam, {
    fallBackValue: { count: 0, list: [] },
  });

  useEffect(() => {
    fetchData();
  }, [date]);

  return (
    <Box>
      <Title>Your Schedule</Title>
      <Calendar
        headerRender={() => null}
        disabledDate={(date) => date.isBefore(dayjs().toISOString(), "day")}
        value={moment(date)}
        dateCellRender={(d) => {
          const items = (data ? data.list : []).filter(
            ({ from, to }) =>
              d.isSameOrAfter(dayjs(from).startOf("day").toISOString()) &&
              d.isSameOrBefore(dayjs(to).endOf("day").toISOString())
          );
          return (
            <ExamList>
              {items.map((item) => (
                <li key={String(item._id)}>{item.name}</li>
              ))}
            </ExamList>
          );
        }}
      />
    </Box>
  );
};

const ExamList = styled.ul`
  list-style: none;
  padding-left: 16px;
`;
