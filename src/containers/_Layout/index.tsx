import { Avatar, Dropdown, Menu } from "antd";
import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { useAuth } from "../../hooks/useAuth";
import { LogoutOutlined, ProfileOutlined } from "@ant-design/icons";
import randomColor from "randomcolor";
import Router from "next/router";
import { PageLoading } from "../../components/PageLoading";

type Props = {
  children: React.ReactNode;
};

export const Layout = ({ children }: Props) => {
  const { user, logout, isAuthing } = useAuth();

  return isAuthing ? (
    <PageLoading />
  ) : (
    <>
      <ColorBackground />
      <Header>
        <Link href="/">
          <LogoWrapper>
            <Logo src="/static/logo.svg" /> OES
          </LogoWrapper>
        </Link>
        <NavWrapper></NavWrapper>
        <UserWrapper>
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
                }}
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
      {children}
    </>
  );
};

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
  padding: 8px 32px;
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
