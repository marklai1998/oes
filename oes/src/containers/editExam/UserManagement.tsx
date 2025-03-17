import { Button, DatePicker, Form, Input, Transfer } from "antd";
import { useForm } from "antd/lib/form/Form";
import moment, { Moment } from "moment";
import React from "react";
import styled from "styled-components";
import { userTierType } from "../../../server/constants/userTierType";
import { PureExam } from "../../../server/models/exam";
import { Box, Content, Title } from "../../components/Box";
import UserPicker from "../../components/UserPicker";

type Props = {
  data: PureExam;
  onSave: (value: { attendee: string[] }) => void;
  locked: boolean;
};

export const UserManagement = ({ data, onSave, locked }: Props) => {
  const [form] = useForm();

  return (
    <Box>
      <Wrapper>
        <MetaWrapper>User Management</MetaWrapper>
        <ButtonGroup>
          <Button type="primary" onClick={form.submit}>
            Save
          </Button>
        </ButtonGroup>
      </Wrapper>
      <Content>
        <Form
          name="basic"
          initialValues={data}
          onFinish={onSave}
          requiredMark={false}
          form={form}
        >
          <Form.Item label="Invigilator" name="invigilator">
            <UserPicker tier={[userTierType.ADMIN, userTierType.TEACHER]} />
          </Form.Item>
          <Form.Item label="Attendee" name="attendee">
            <UserPicker tier={[userTierType.STUDENT]} />
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
