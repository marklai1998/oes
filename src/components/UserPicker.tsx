import { Transfer } from "antd";
import React, { useEffect, useMemo } from "react";
import { useFetch } from "../hooks/useFetch";
import { userList } from "../services/userApi/userList";
import { userTierType } from "../../server/constants/userTierType";

type Props = {
  value?: string[];
  onChange?: (value: string[]) => void;
  tier: userTierType[];
};

const UserPicker = ({ value, onChange, tier }: Props) => {
  const { fetchData, data } = useFetch(userList);

  useEffect(() => {
    fetchData({ page: 1, pageSize: -1, tier });
  }, []);

  const dataSource = useMemo(
    () =>
      (data ? data.list : []).map(({ _id, username }) => ({
        key: String(_id),
        title: username,
      })),
    [data, value]
  );

  return (
    <Transfer
      dataSource={dataSource}
      targetKeys={value}
      onChange={(key) => onChange && onChange(key)}
      render={(item) => item.title}
      oneWay
      pagination
    />
  );
};

export default UserPicker;
