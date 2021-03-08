import { Table } from "antd";
import Router from "next/router";
import { useEffect, useMemo, useState } from "react";
import { PureUser } from "../../server/models/user";
import { Box, Content, Title } from "../components/Box";
import { ContentWrapper } from "../components/ContentWrapper";
import { getColumn } from "../containers/userList/tableMap";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
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

  useEffect(() => {
    (!isLoggedIn || !isAdmin) && Router.push("/");
  }, [isLoggedIn, isAdmin]);

  useEffect(() => {
    fetchData({
      page,
      pageSize,
    });
  }, [page, pageSize]);

  const handlePageChange = (current: number, size: number) => {
    setPage(current);
    setPageSize(size);
  };

  const handelUpdate = async (_id: string, newValues: Partial<PureUser>) => {
    const { success } = await handleUpdateUser(_id, newValues);

    success &&
      fetchData({
        page,
        pageSize,
      });
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
      <Box>
        <Title>User List</Title>
        <Content>
          {data && (
            <Table
              title={() => `${data.total} results`}
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
        </Content>
      </Box>
    </ContentWrapper>
  );
};

export default UserList;
