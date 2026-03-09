import { Table, Avatar, Button, Tooltip } from "antd";
import type { TableProps } from "antd";
import {
  LinkedinFilled,
  GithubFilled,
  DeleteOutlined,
  EditOutlined,
  XOutlined,
  FacebookFilled,
} from "@ant-design/icons";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  image?: string;
  socials?: {
    facebook?: string;
    github?: string;
    linkedin?: string;
    x?: string;
  };
}

interface Props {
  data: TeamMember[];
}

export const TeamTable = ({ data }: Props) => {
  const columns: TableProps<TeamMember>["columns"] = [
    {
      title: "Member Name",
      dataIndex: "name",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <Avatar
            size={36}
            src={
              record.image ??
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${text}`
            }
          />
          <span className="font-semibold">{text}</span>
        </div>
      ),
    },
    {
      title: "Designation",
      dataIndex: "position",
      align: "center",
    },
    {
      title: "Social Links",
      dataIndex: "socials",
      align: "center",
      render: (socials) => (
        <div className="flex gap-2 justify-center">
          {socials?.facebook && (
            <a href={socials.facebook}>
              <FacebookFilled className="text-blue-600 text-lg" />
            </a>
          )}
          {socials?.github && <GithubFilled className="text-lg" />}
          {socials?.linkedin && (
            <LinkedinFilled className="text-blue-600 text-lg" />
          )}
          {socials?.x && <XOutlined className="text-lg" />}
        </div>
      ),
    },
    {
      title: "Actions",
      align: "center",
      render: () => (
        <div className="flex gap-2 justify-center">
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      bordered
      pagination={{
        pageSize: 5,
      }}
    />
  );
};
