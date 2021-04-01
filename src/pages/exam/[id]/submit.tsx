import React, { useEffect, useState } from "react";
import { ContentWrapper } from "../../../components/ContentWrapper";
import { useRouter } from "next/router";
import { useFetch } from "../../../hooks/useFetch";
import { getPopulatedExam } from "../../../services/examApi/getPopulatedExam";
import { useAuth } from "../../../hooks/useAuth";
import { SubmitExam } from "../../../containers/submitExam";
import { PureExamSubmission } from "../../../../server/models/examSubmission";
import { getSubmission } from "../../../services/examApi/getSubmission";
import { SubmissionList } from "../../../containers/submissionList";

const JoinExam = () => {
  const {
    query: { id },
  } = useRouter();
  const { isStudent } = useAuth();
  const { fetchData: fetchExam, data: exam } = useFetch(getPopulatedExam);
  const { fetchData: fetchSubmission, data: fetchedSubmissions } = useFetch(
    getSubmission
  );

  const [submissions, setSubmissions] = useState<PureExamSubmission[]>([]);

  useEffect(() => {
    if (id) {
      fetchExam(id);
      fetchSubmission(id);
    }
  }, [id]);

  useEffect(() => {
    setSubmissions(fetchedSubmissions || []);
  }, [fetchedSubmissions]);

  return !exam ? (
    <></>
  ) : (
    <ContentWrapper>
      {isStudent ? (
        <SubmitExam
          exam={exam}
          submissions={submissions}
          setSubmissions={setSubmissions}
        />
      ) : (
        <SubmissionList exam={exam} />
      )}
    </ContentWrapper>
  );
};

export default JoinExam;
