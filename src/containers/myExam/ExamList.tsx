import { Tag } from "antd";
import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { dayjs } from "../../../server/utils/dayjs";
import { Box, Title } from "../../components/Box";
import { useFetch } from "../../hooks/useFetch";
import { useDate } from "../../hooks/useTime";
import { listAllExam } from "../../services/examApi/listAllExam";
import { ListItem } from "./ListItem";

const ExamList = () => {
  const date = useDate();
  const { fetchData, data } = useFetch(listAllExam, {
    fallBackValue: { count: 0, list: [] },
  });

  useEffect(() => {
    fetchData();
  }, [date]);

  const list = useMemo(() => (data ? data.list : []), [data]);

  const { upcomingCount, finishedCount } = useMemo(
    () =>
      list.reduce(
        (acc, { from, to }) => {
          const isUpcoming = dayjs().isBefore(from);
          const isFinished = dayjs().isAfter(to);
          return {
            upcomingCount: isUpcoming
              ? acc.upcomingCount + 1
              : acc.upcomingCount,
            finishedCount: isFinished
              ? acc.finishedCount + 1
              : acc.finishedCount,
          };
        },
        {
          upcomingCount: 0,
          finishedCount: 0,
        }
      ),
    [list]
  );

  return (
    <Box>
      <Title>
        My Exam
        <TagGroup>
          <Tag color="#2db7f5">Upcoming: {upcomingCount}</Tag>
          <Tag color="grey">Finished: {finishedCount}</Tag>
        </TagGroup>
      </Title>
      {list.map((item) => (
        <ListItem item={item} key={String(item._id)} />
      ))}
    </Box>
  );
};

export default ExamList;

const TagGroup = styled.div`
  float: right;

  & span {
    vertical-align: text-bottom;
  }
`;
