import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { PopulatedExam } from "../../../server/models/exam";
import { Box } from "../../components/Box";
import { MediaStream } from "../../components/MediaStream";
import { useExamRTC } from "../../hooks/useExamRTC";
import * as R from "ramda";
import { Spacer } from "../../components/Spacer";
import { useTime } from "../../hooks/useTime";
import { dayjs } from "../../../server/utils/dayjs";
import { useMount } from "react-use";
import DecibelMeter from "decibel-meter";
import { useSocket } from "../../hooks/useSocket";
import { socketEvent } from "../../../server/constants/socketEvent";
import { Button } from "antd";
import Link from "next/link";

type Props = { exam: PopulatedExam };

export const StudentView = ({ exam }: Props) => {
  const [mediaStream, setMediaStream] = useState<null | MediaStream>(null);
  const time = useTime();
  const dayjsTime = dayjs(time);
  const [startRecognition, setStartRecognition] = useState(false);
  const { socket } = useSocket();

  useExamRTC({
    examId: String(exam._id),
    mediaStreams: [mediaStream],
    streamReady: !R.isNil(mediaStream),
  });

  useEffect(() => {
    if (startRecognition) {
      const SpeechRecognition =
        window.SpeechRecognition ||
        ((window as any)
          .webkitSpeechRecognition as typeof window.SpeechRecognition);
      const recognition = new SpeechRecognition();

      recognition.onstart = () => {
        console.log("sterted");
      };

      recognition.onresult = (e) => {
        socket &&
          socket.emit(socketEvent.ADD_TRANSCRIPT, {
            examId: exam._id,
            peerId: socket.id,
            transcript: Array.from(e.results)
              .map((item) => item[0])
              .map((item) => ({
                transcript: item.transcript,
                confidence: item.confidence,
              })),
          });
        console.log(Array.from(e.results));
      };

      recognition.onerror = function (event) {
        console.log(event.error);
        recognition.stop();
        setStartRecognition(false);
      };

      recognition.onspeechend = function () {
        recognition.stop();
        setStartRecognition(false);
      };

      recognition.start();
    }
  }, [exam, startRecognition]);

  useMount(() => {
    new DecibelMeter().listenTo(0, (dB, percent, value) => {
      if (!startRecognition && percent >= 40) setStartRecognition(true);
    });
  });

  return (
    <>
      <Info>
        <div>
          <div>Joined Exam: {exam.name}</div>
          <TimeWrapper>
            <Time>{dayjsTime.format("hh:mm:ss")}</Time>
            {dayjsTime.format("A")}
            <Date>{dayjsTime.format("YYYY-MM-DD")}</Date>
          </TimeWrapper>
        </div>
        <Link href={`/exam/${exam._id}/submit`}>
          <Button type="primary">Submit Exam</Button>
        </Link>
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
  display: flex;

  & div {
    width: 100%;
  }
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

const SubmitButton = styled(Button)`
  float: right;
  bottom: 0;
`;
