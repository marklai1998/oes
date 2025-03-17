import { Button, DatePicker, Form, Input } from "antd";
import { useForm } from "antd/lib/form/Form";
import moment, { Moment } from "moment";
import React from "react";
import styled from "styled-components";
import { PureExam } from "../../../server/models/exam";
import { dayjs } from "../../../server/utils/dayjs";
import { Box, Content, Title } from "../../components/Box";

type Props = {
  data: PureExam;
  onSave: (value: { name: string; from: string; to: string }) => void;
  locked: boolean;
};

export const BasicInfo = ({ data, onSave, locked }: Props) => {
  const [form] = useForm();

  const handleFormSubmit = async (values: {
    name: string;
    time: [Moment, Moment];
  }) => {
    onSave({
      name: values.name,
      from: values.time[0].toISOString(),
      to: values.time[1].toISOString(),
    });
  };

  return (
    <Box>
      <Wrapper>
        <MetaWrapper>Basic Info</MetaWrapper>
        <ButtonGroup>
          <Button type="primary" onClick={form.submit}>
            Save
          </Button>
        </ButtonGroup>
      </Wrapper>
      <Content>
        <Form
          name="basic"
          initialValues={{
            ...data,
            time: [moment(data.from), moment(data.to)],
          }}
          onFinish={handleFormSubmit}
          requiredMark={false}
          form={form}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input name!" }]}
          >
            <Input disabled={locked} />
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
              disabled={locked}
            />
          </Form.Item>
        </Form>
      </Content>
    </Box>
  );
};

const Wrapper = styled(Title)`
  display: flex;
`;

const MetaWrapper = styled.div`
  width: 100%;
`;

const ButtonGroup = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;
