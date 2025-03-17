import { Alert, message } from "antd";
import React, { useMemo } from "react";
import { useDeepCompareEffect, useSetState, useUpdateEffect } from "react-use";
import { examStatusType } from "../../../server/constants/examStatusType";
import { PureExam } from "../../../server/models/exam";
import { getExamStatus } from "../../../server/utils/getExamStatus";
import { Spacer } from "../../components/Spacer";
import { useFetch } from "../../hooks/useFetch";
import { useTime } from "../../hooks/useTime";
import { updateExam } from "../../services/examApi/updateExam";
import { BasicInfo } from "./BasicInfo";
import { Header } from "./Header";
import { Resources } from "./Resources";
import { UserManagement } from "./UserManagement";

type Props = { initialValue: PureExam };

export const ExamEditor = ({ initialValue }: Props) => {
  const [exam, setExam] = useSetState(initialValue);
  const { fetchData: handleUpdateExam } = useFetch(updateExam);
  const now = useTime();
  const status = useMemo(() => getExamStatus(now, exam), [exam, now]);
  const locked = useMemo(() => status !== examStatusType.UPCOMING, [status]);

  const handleVisibleChange = (value: boolean) => {
    setExam({ visible: value });
  };

  const handleFormChange = (value: Partial<PureExam>) => {
    setExam(value);
  };

  useDeepCompareEffect(() => {
    handleUpdateExam(initialValue._id, exam);
  }, [exam]);

  useUpdateEffect(() => {
    message.success(
      exam.visible
        ? "Exam is now visible to student"
        : "Exam is now invisible to student"
    );
  }, [exam.visible]);

  return (
    <>
      <Header
        data={exam}
        status={status}
        onVisibleChange={handleVisibleChange}
        locked={locked}
      />
      {locked && (
        <>
          <Spacer />
          <Alert
            message="Setting will be locked on exam start"
            type="warning"
          />
        </>
      )}
      <Spacer />
      <BasicInfo data={exam} onSave={handleFormChange} locked={locked} />
      <Spacer />
      <UserManagement data={exam} onSave={handleFormChange} locked={locked} />
      <Spacer />
      <Resources exam={exam} />
    </>
  );
};
