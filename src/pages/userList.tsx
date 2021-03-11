import { Table } from "antd";
import Router from "next/router";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { PureUser } from "../../server/models/user";
import { Box, Content, Title } from "../components/Box";
import { ContentWrapper } from "../components/ContentWrapper";
import { Spacer } from "../components/Spacer";
import { getColumn } from "../containers/userList/tableMap";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
import { getUserCount } from "../services/userApi/getUserCount";
import { updateUser } from "../services/userApi/updateUser";
import { userList } from "../services/userApi/userList";

const UserList = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { fetchData, data, isFetching } = useFetch(userList, {
    fallBackValue: { list: [], total: 0 },
  });
  const { fetchData: handleUpdateUser } = useFetch(updateUser);
  const { fetchData: fetchUserCount, data: userCount } = useFetch(
    getUserCount,
    {
      fallBackValue: [],
    }
  );

  useEffect(() => {
    !isAdmin && Router.push("/");
  }, [isAdmin]);

  const refreshCurrent = () => {
    fetchData({
      page,
      pageSize,
    });
    fetchUserCount();
  };

  useEffect(() => {
    refreshCurrent();
  }, [page, pageSize]);

  const handlePageChange = (current: number, size: number) => {
    setPage(current);
    setPageSize(size);
  };

  const handelUpdate = async (_id: string, newValues: Partial<PureUser>) => {
    const { success } = await handleUpdateUser(_id, newValues);

    success && refreshCurrent();
  };

  const columns = useMemo(
    () =>
      getColumn({
        onUpdate: handelUpdate,
      }),
    [handelUpdate]
  );

  return (
    <ContentWrapper>
      <UserCountList>
        {(userCount || []).map(({ tier, total }) => (
          <CountItem key={tier}>
            <Tier>{tier}</Tier>
            <Count>{total}</Count>
          </CountItem>
        ))}
      </UserCountList>
      <Spacer />
      <Box>
        <Title>User List</Title>
        {data && (
          <Table
            size="small"
            rowKey="_id"
            columns={columns}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: data.total,
              onChange: handlePageChange,
            }}
            dataSource={data.list}
            loading={isFetching}
            scroll={{ x: true }}
          />
        )}
      </Box>
    </ContentWrapper>
  );
};

export default UserList;

const UserCountList = styled.div`
  display: flex;

  & ${Box} {
    width: 100%;
    margin: 0 16px;
  }

  & ${Box}:first-child {
    margin: 0 16px 0 0;
  }

  & ${Box}:last-child {
    margin: 0 0 0 16px;
  }
`;

const CountItem = styled(Box)`
  padding: 8px 16px;
`;

const Tier = styled.div`
  color: #1890ff;
  font-size: 20px;
`;

const Count = styled.div`
  font-size: 16px;
`;
