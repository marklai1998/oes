import { Button, Form, Modal, Select } from "antd";
import React, { useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { PureUser } from "../../../server/models/user";
import { useForm } from "antd/lib/form/Form";
import * as R from "ramda";
import { userTierType } from "../../../server/constants/userTierType";

type Props = { user: PureUser; onUpdate: (values: Partial<PureUser>) => void };

export const EditModal = ({ user, onUpdate }: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = useForm();

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleFormSubmit = (values: Partial<PureUser>) => {
    setModalVisible(false);
    onUpdate(values);
  };

  return (
    <>
      <Button
        type="link"
        icon={<EditOutlined />}
        onClick={() => setModalVisible(true)}
      />
      <Modal
        title={user.username}
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
      >
        <Form form={form} initialValues={user} onFinish={handleFormSubmit}>
          <Form.Item
            label="Tier"
            name="tier"
            rules={[{ required: true, message: "Please input tier!" }]}
          >
            <Select>
              {R.values(userTierType).map((tier) => (
                <Select.Option value={tier} key={tier}>
                  {tier}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
