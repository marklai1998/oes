import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { Box } from "../../components/Box";
import { HomeOutlined, UserOutlined, ReadOutlined } from "@ant-design/icons";
import { Drawer, Tooltip } from "antd";
import { layoutType } from "../../constants/layoutType";
import { useAuth } from "../../hooks/useAuth";
import { useLayout } from "../../hooks/useLayout";

type Props = {
  drawerVisible: boolean;
  onDrawerClose: () => void;
};

export const Nav = ({ drawerVisible, onDrawerClose }: Props) => {
  const { isLoggedIn, isAdmin } = useAuth();
  const layout = useLayout();

  const Content = (
    <Wrapper>
      <Logo src="/static/logo.svg" />
      <Link href="/">
        <Tooltip placement="right" title="Home">
          <StyledLink>
            <HomeOutlined />
          </StyledLink>
        </Tooltip>
      </Link>
      <Link href="/myExam">
        <Tooltip placement="right" title="My Exam">
          <StyledLink>
            <ReadOutlined />
          </StyledLink>
        </Tooltip>
      </Link>
      {isAdmin && (
        <Link href="/userList">
          <Tooltip placement="right" title="User Management">
            <StyledLink>
              <UserOutlined />
            </StyledLink>
          </Tooltip>
        </Link>
      )}
    </Wrapper>
  );

  return (
    <>
      {!isLoggedIn ? (
        <></>
      ) : layout === layoutType.DESKTOP ? (
        Content
      ) : (
        <Drawer
          placement="left"
          closable={false}
          onClose={onDrawerClose}
          visible={drawerVisible}
          bodyStyle={{ padding: 0 }}
          width={56}
        >
          {Content}
        </Drawer>
      )}
    </>
  );
};

const Wrapper = styled(Box)`
  flex-shrink: 0;
  height: 100%;
  width: 48px;
  overflow: auto;
`;

const Logo = styled.img`
  width: 48px;
  padding: 0 5px;
  margin-top: 8px;
  margin-bottom: 32px;
`;

const StyledLink = styled.a`
  font-size: 16px;
  padding: 8px 14px;
  display: block;
`;
