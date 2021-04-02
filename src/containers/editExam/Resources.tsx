import React, { useEffect, useState } from "react";
import { PureExam } from "../../../server/models/exam";
import { Box, Title } from "../../components/Box";
import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
import { useFetch } from "../../hooks/useFetch";
import { addResources } from "../../services/examApi/addResources";
import { deleteResources } from "../../services/examApi/deleteResources";
import { useDropzone } from "react-dropzone";
import * as R from "ramda";
import { PureExamResources } from "../../../server/models/examResources";
import { Button } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { updateResources } from "../../services/examApi/updateResources";
import { getResources } from "../../services/examApi/getResources";

type Props = {
  exam: PureExam;
};

export const Resources = ({ exam }: Props) => {
  const { fetchData: handleAddResources } = useFetch(addResources);
  const { fetchData: handleDeleteResources } = useFetch(deleteResources);
  const { fetchData: handleUpdateResources } = useFetch(updateResources);
  const { fetchData: handleFetchResources } = useFetch(getResources);

  const [resources, setResources] = useState<PureExamResources[]>([]);

  const fetchResources = async () => {
    const { success, result } = await handleFetchResources(exam._id);
    if (success && result) {
      setResources(result);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const { open, getRootProps, getInputProps } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    multiple: false,
    accept: "image/*",
    onDropAccepted: async (file) => {
      const { success, result } = await handleAddResources(exam._id, file[0]);
      if (success && result) {
        setResources((prev) => [...prev, result]);
      }
    },
  });

  const removeResources = async (itemId: string) => {
    const { success } = await handleDeleteResources(exam._id, itemId);
    success &&
      setResources((prev) => R.reject(({ _id }) => _id === itemId, prev));
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
      resources
    ).map((item, index) => ({ ...item, order: index + 1 }));

    const { success } = await handleUpdateResources(exam._id, newList);

    success && setResources(newList);
  };

  return (
    <Box>
      <Title>Resources</Title>
      <Title>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <Button icon={<UploadOutlined />} onClick={() => open()}>
            Upload File
          </Button>
        </div>
      </Title>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="Resources">
          {(dropProvided, dropSnapshot) => (
            <div ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
              {resources.map(({ originalname, _id }, index) => (
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
                            removeResources(String(_id));
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
  );
};

const ListItemWrapper = styled.div`
  border-top: 1px solid #eee;
  padding: 8px 16px;
  display: flex;
  line-height: 32px;

  & div {
    width: 100%;
  }
`;
