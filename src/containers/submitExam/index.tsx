import { Button } from "antd";
import Link from "next/link";
import React from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import { PopulatedExam } from "../../../server/models/exam";
import { Box, Title } from "../../components/Box";
import { Spacer } from "../../components/Spacer";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { addSubmission } from "../../services/examApi/addSubmission";
import { useFetch } from "../../hooks/useFetch";
import { PureExamSubmission } from "../../../server/models/examSubmission";
import { deleteSubmission } from "../../services/examApi/deleteSubmission";
import * as R from "ramda";
import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
import { updateSubmission } from "../../services/examApi/updateSubmission";

type Props = {
  exam: PopulatedExam;
  submissions: PureExamSubmission[];
  setSubmissions: React.Dispatch<React.SetStateAction<PureExamSubmission[]>>;
};

export const SubmitExam = ({ exam, setSubmissions, submissions }: Props) => {
  const { fetchData: handleAddSubmission } = useFetch(addSubmission);
  const { fetchData: handleDeleteSubmission } = useFetch(deleteSubmission);
  const { fetchData: handleUpdateSubmission } = useFetch(updateSubmission);

  const { open, getRootProps, getInputProps } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    multiple: false,
    accept: "image/*",
    onDropAccepted: async (file) => {
      const { success, result } = await handleAddSubmission(exam._id, file[0]);
      if (success && result) {
        setSubmissions((prev) => [...prev, result]);
      }
    },
  });

  const removeSubmission = async (itemId: string) => {
    const { success } = await handleDeleteSubmission(exam._id, itemId);
    success &&
      setSubmissions((prev) => R.reject(({ _id }) => _id === itemId, prev));
  };

  const onDragEnd = async (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const newList = R.move(
      result.source.index,
      result.destination.index,
      submissions
    ).map((item, index) => ({ ...item, order: index + 1 }));

    const { success } = await handleUpdateSubmission(exam._id, newList);

    success && setSubmissions(newList);
  };

  return (
    <>
      <Info>
        <div>Exam: {exam.name}</div>
        <Link href={`/exam/${exam._id}/join`}>
          <Button type="primary">Back to Exam</Button>
        </Link>
      </Info>
      <Spacer />
      <Box>
        <Title>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <Button icon={<UploadOutlined />} onClick={() => open()}>
              Upload File
            </Button>
          </div>
        </Title>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="submission">
            {(dropProvided, dropSnapshot) => (
              <div ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
                {submissions.map(({ originalname, _id }, index) => (
                  <Draggable
                    draggableId={String(_id)}
                    index={index}
                    key={String(_id)}
                  >
                    {(draggableProvided) => (
                      <div
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        {...draggableProvided.dragHandleProps}
                      >
                        <ListItemWrapper>
                          <div>{originalname}</div>
                          <Button
                            type="link"
                            onClick={() => {
                              removeSubmission(String(_id));
                            }}
                          >
                            <DeleteOutlined />
                          </Button>
                        </ListItemWrapper>
                      </div>
                    )}
                  </Draggable>
                ))}
                {dropProvided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
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

const ListItemWrapper = styled.div`
  border-top: 1px solid #eee;
  padding: 8px 16px;
  display: flex;
  line-height: 32px;

  & div {
    width: 100%;
  }
`;
