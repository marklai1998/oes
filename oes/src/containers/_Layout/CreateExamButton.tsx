import { PlusOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input } from "antd";
import { useForm } from "antd/lib/form/Form";
import Modal from "antd/lib/modal/Modal";
import React, { useState } from "react";
import styled from "styled-components";
import { Moment } from "moment";
import { useFetch } from "../../hooks/useFetch";
import { createExam } from "../../services/examApi/createExam";
import { dayjs } from "../../../server/utils/dayjs";
import Router from "next/router";

export const CreateExamButton = () => {
  const [modelVisible, setModalVisible] = useState(false);
  const { fetchData, isFetching } = useFetch(createExam);
  const [form] = useForm();

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleFormSubmit = async (values: {
    name: string;
    time: [Moment, Moment];
  }) => {
    const { result, success } = await fetchData({
      name: values.name,
      from: values.time[0].toDate(),
      to: values.time[1].toDate(),
    });

    if (success) {
      Router.push(`/exam/${result._id}/edit`);
      setModalVisible(false);
    }
  };

  return (
    <>
      <StyledButton
        icon={<PlusOutlined />}
        type="text"
        onClick={() => setModalVisible(true)}
      >
        Create Exam
      </StyledButton>
      <Modal
        title="Create Exam"
        visible={modelVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
        okButtonProps={{ loading: isFetching }}
      >
        <Form form={form} onFinish={handleFormSubmit}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Time"
            name="time"
            rules={[{ required: true, message: "Please input time!" }]}
            help="Exam will be available to join 15min in advance and will end 15min later"
          >
            <DatePicker.RangePicker
              showTime
              disabledDate={(date) =>
                date.isBefore(dayjs().toISOString(), "day")
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

const StyledButton = styled(Button)`
  color: #fff;
`;
