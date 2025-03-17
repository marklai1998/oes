import { Avatar, Button, Dropdown, Menu } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../hooks/useAuth";
import {
  LogoutOutlined,
  ProfileOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import randomColor from "randomcolor";
import Router from "next/router";
import { PageLoading } from "../../components/PageLoading";
import { useSocket } from "../../hooks/useSocket";
import { CreateExamButton } from "./CreateExamButton";
import { Nav } from "./Nav";
import { useLayout } from "../../hooks/useLayout";
import { layoutType } from "../../constants/layoutType";

type Props = {
  children: React.ReactNode;
};

export const Layout = ({ children }: Props) => {
  const { user, logout, isAuthing, isTeacher, isAdmin, isLoggedIn } = useAuth();
  const { socket } = useSocket();
  const layout = useLayout();
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    layout === layoutType.DESKTOP && setDrawerVisible(false);
  }, [layout]);

  return isAuthing || !socket ? (
    <PageLoading />
  ) : (
    <Wrapper>
      <Nav
        drawerVisible={drawerVisible}
        onDrawerClose={() => {
          setDrawerVisible(false);
        }}
      />
      <ColWrapper>
        <ColorBackground />
        <Header>
          {(!isLoggedIn || layout === layoutType.MOBILE) && (
            <>
              {isLoggedIn && (
                <StyledButton
                  icon={<BarsOutlined />}
                  type="text"
                  onClick={() => setDrawerVisible(true)}
                  size="large"
                />
              )}
              <Link href="/">
                <LogoWrapper>
                  <Logo src="/static/logo.svg" /> OES
                </LogoWrapper>
              </Link>
            </>
          )}
          <NavWrapper></NavWrapper>
          <UserWrapper>
            {(isAdmin || isTeacher) && <CreateExamButton />}
            {user ? (
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item icon={<LogoutOutlined />} onClick={logout}>
                      Logout
                    </Menu.Item>
                    <Menu.Item
                      icon={<ProfileOutlined />}
                      onClick={() => {
                        Router.push("/profile");
                      }}
                    >
                      Profile
                    </Menu.Item>
                  </Menu>
                }
              >
                <Avatar
                  style={{
                    backgroundColor: randomColor({ seed: user.username }),
                    verticalAlign: "middle",
                    cursor: "pointer",
                  }}
                  src={`/uploads/icons/${user._id}`}
                >
                  {user.username}
                </Avatar>
              </Dropdown>
            ) : (
              <Link href="/login">
                <StyledLink>Login</StyledLink>
              </Link>
            )}
          </UserWrapper>
        </Header>
        <ContentWrapper>{children}</ContentWrapper>
      </ColWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  height: 100%;
  max-height: 100%;
`;

const ColWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
`;

const ContentWrapper = styled.div`
  overflow: auto;
`;

const ColorBackground = styled.div`
  width: 100%;
  position: absolute;
  z-index: -100;
  height: 300px;
  background: rgb(44, 197, 189);
  background: linear-gradient(
    171deg,
    rgba(44, 197, 189, 1) 34%,
    rgba(44, 199, 149, 1) 100%
  );
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  padding: 16px 24px;
  display: flex;
  color: #fff;
  line-height: 40px;
`;

const LogoWrapper = styled.div`
  font-size: 20px;
  flex-shrink: 0;
  cursor: pointer;
`;

const Logo = styled.img`
  width: 40px;
`;

const NavWrapper = styled.div`
  width: 100%;
`;

const UserWrapper = styled.div`
  flex-shrink: 0;
`;

const StyledLink = styled.a`
  color: #fff;
`;

const StyledButton = styled(Button)`
  margin-right: 16px;
  color: #fff;
`;
