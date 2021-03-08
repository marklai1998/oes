import { Button, Form, Input } from "antd";
import { useForm } from "antd/lib/form/Form";
import Link from "next/link";
import styled from "styled-components";
import { Box, Title, Content } from "./Box";

type Props = {
  isLogin: boolean;
  onSubmit?: (value: { username: string; password: string }) => void;
};

export const LoginForm = ({ isLogin, onSubmit }: Props) => {
  const [form] = useForm();

  return (
    <Wrapper>
      <Title>{isLogin ? "Login" : "Register"}</Title>
      <StyledContent>
        <Form
          layout="vertical"
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onSubmit}
          requiredMark={false}
          form={form}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          {!isLogin && (
            <Form.Item
              label="Repeat Password"
              name="repeatPassword"
              rules={[
                { required: true, message: "Please input your password!" },
                {
                  validator: (rule, value, callbackFn) => {
                    if (!value) {
                      callbackFn();
                      return;
                    }
                    if (value === form.getFieldValue("password")) {
                      callbackFn();
                      return;
                    }
                    callbackFn("The passwords don't match");
                  },
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item>
            {isLogin ? (
              <ButtonGroup>
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
                <Link href="/signup">
                  <a>I don't have an account</a>
                </Link>
              </ButtonGroup>
            ) : (
              <ButtonGroup>
                <Button type="primary" htmlType="submit">
                  Signup
                </Button>
                <Link href="/login">
                  <a>I already have an account</a>
                </Link>
              </ButtonGroup>
            )}
          </Form.Item>
        </Form>
      </StyledContent>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  max-width: 21rem;
  margin: 80px auto;
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  line-height: 32px;
`;

const StyledContent = styled(Content)`
  padding: 0 24px 24px 24px;
`;
