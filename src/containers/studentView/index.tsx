import React, { useState } from "react";
import styled from "styled-components";
import { PopulatedExam } from "../../../server/models/exam";
import { Box } from "../../components/Box";
import { MediaStream } from "../../components/MediaStream";
import { useExamRTC } from "../../hooks/useExamRTC";
import * as R from "ramda";
import { Spacer } from "../../components/Spacer";
import { useTime } from "../../hooks/useTime";
import { dayjs } from "../../../server/utils/dayjs";

type Props = { exam: PopulatedExam };

export const StudentView = ({ exam }: Props) => {
  const [mediaStream, setMediaStream] = useState<null | MediaStream>(null);
  const time = useTime();
  const dayjsTime = dayjs(time);

  useExamRTC({
    examId: String(exam._id),
    mediaStreams: [mediaStream],
    streamReady: !R.isNil(mediaStream),
  });

  return (
    <>
      <Info>
        <div>Joined Exam: {exam.name}</div>
        <TimeWrapper>
          <Time>{dayjsTime.format("hh:mm:ss")}</Time>
          {dayjsTime.format("A")}
          <Date>{dayjsTime.format("YYYY-MM-DD")}</Date>
        </TimeWrapper>
      </Info>
      <Spacer />
      <VideoWrapper>
        <MediaStream onMediaStream={setMediaStream} />
      </VideoWrapper>
    </>
  );
};

const Info = styled(Box)`
  color: #1890ff;
  font-size: 20px;
  padding: 8px 16px;
`;

const VideoWrapper = styled(Box)`
  position: relative;
  overflow: hidden;
  height: 80vh;
`;

const TimeWrapper = styled.div`
  color: #1890ff;
`;

const Time = styled.span`
  font-size: 24px;
`;

const Date = styled.div`
  font-size: 12px;
  color: #575757;
`;
