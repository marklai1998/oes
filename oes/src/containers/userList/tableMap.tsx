import { Tooltip } from "antd";
import { ColumnsType } from "antd/lib/table";
import { PureUser } from "../../../server/models/user";
import { dayjs } from "../../../server/utils/dayjs";
import { EditModal } from "./EditModal";

export const getColumn = ({
  onUpdate,
}: {
  onUpdate: (_id: string, newValues: Partial<PureUser>) => void;
}): ColumnsType<PureUser> => [
  {
    title: "User ID",
    dataIndex: "_id",
    ellipsis: {
      showTitle: false,
    },
    render: (id) => (
      <Tooltip placement="topLeft" title={id}>
        {id}
      </Tooltip>
    ),
  },
  {
    title: "User name",
    dataIndex: "username",
  },
  {
    title: "Tier",
    dataIndex: "tier",
  },
  {
    title: "createdAt",
    dataIndex: "createdAt",
    render: (date: string) => dayjs(date).format("YYYY/MM/DD"),
  },
  {
    dataIndex: "_id",
    render: (_id: string, user) => (
      <EditModal
        user={user}
        onUpdate={(newValue) => {
          onUpdate(_id, newValue);
        }}
      />
    ),
  },
];
