import { Alert } from "antd";
import React, { useMemo } from "react";
import { useDeepCompareEffect, useSetState } from "react-use";
import { examStatusType } from "../../../server/constants/examStatusType";
import { PopulatedExam } from "../../../server/models/exam";
import { getExamStatus } from "../../../server/utils/getExamStatus";
import { Spacer } from "../../components/Spacer";
import { useFetch } from "../../hooks/useFetch";
import { useTime } from "../../hooks/useTime";
import { updateExam } from "../../services/examApi/updateExam";
import { Header } from "./Header";

type Props = { initialValue: PopulatedExam };

export const ExamEditor = ({ initialValue }: Props) => {
  const [exam, setExam] = useSetState(initialValue);
  const { fetchData: handleUpdateExam } = useFetch(updateExam);
  const now = useTime();
  const status = useMemo(() => getExamStatus(now, exam), [exam, now]);
  const locked = useMemo(() => status !== examStatusType.UPCOMING, [status]);

  const handleVisibleChange = (value: boolean) => {
    setExam({ visible: value });
  };

  useDeepCompareEffect(() => {
    handleUpdateExam(initialValue._id, exam);
  }, [exam]);

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
    </>
  );
};
