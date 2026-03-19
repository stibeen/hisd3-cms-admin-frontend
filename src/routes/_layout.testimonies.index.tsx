import { createFileRoute, Link } from "@tanstack/react-router";
import { TESTIMONIES_PAGE_QUERY } from "@/graphql/queries";
import { useMutation, useReadQuery } from "@apollo/client/react";
import { REMOVE_TESTIMONY_MUTATION } from "@/graphql/mutations";
import {
  message,
  Modal,
  Button,
  Typography,
  Divider,
  Empty,
  type TableProps,
  Tooltip,
  Table,
  Avatar,
  Input,
  Tag,
  Card,
} from "antd";
import { useMemo, useState } from "react";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeFilled,
  EyeInvisibleFilled,
} from "@ant-design/icons";
import ImagePreviewModal from "@/components/ImagePreviewModal";

const { Title } = Typography;
const { Search } = Input;

export const Route = createFileRoute("/_layout/testimonies/")({
  component: RouteComponent,
  loader: ({ context: { preloadQuery } }) => {
    const queryRef = preloadQuery(TESTIMONIES_PAGE_QUERY);
    return { queryRef };
  },
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { queryRef } = Route.useLoaderData();
  const { data: testimoniesData } = useReadQuery(queryRef);
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPreviewUrl, setModalPreviewUrl] = useState("");

  const [removeTestimony, { loading: loadingRemoveTestimony }] = useMutation(
    REMOVE_TESTIMONY_MUTATION,
    {
      refetchQueries: [TESTIMONIES_PAGE_QUERY],
      onCompleted: () => {
        messageApi.success("Testimony deleted successfully");
      },
      onError: () => {
        messageApi.error("Failed to delete testimony");
      },
    },
  );

  const filteredData = useMemo(() => {
    return (
      testimoniesData?.adminTestimonies.filter((item) => {
        const matchesSearch = item.name
          .toLowerCase()
          .includes(searchText.toLowerCase());
        return matchesSearch;
      }) || []
    );
  }, [testimoniesData, searchText]);

  const handleSearch = (value: string) => setSearchText(value);

  const handleDeleteTestimony = async (id: string) => {
    await removeTestimony({
      variables: {
        removeTestimonyId: id,
      },
    });
  };

  const showConfirmDelete = (id: string) => {
    modal.confirm({
      title: "Confirm Changes",
      content:
        "Are you sure you want to delete this testimony? This action can't be undone",
      okText: "Delete",
      cancelText: "Cancel",
      onOk: async () => {
        await handleDeleteTestimony(id);
      },
    });
  };

  const modalPreviewAvatar = (id: string) => {
    const member = testimoniesData?.adminTestimonies?.find((m) => m.id === id);
    if (!member) return;
    const url = member.avatarUrl || "";
    setModalPreviewUrl(url);
    setIsModalOpen(true);
  };

  const columns: TableProps["columns"] = useMemo(
    () => [
      {
        title: "Profile",
        dataIndex: "avatarUrl",
        key: "avatarUrl",
        width: 100,
        align: "center",
        render: (_, record: any) => {
          return (
            <div className="flex justify-center gap-2">
              {record.avatarUrl ? (
                <Tooltip title={`View Profile Image of ${record.name}`}>
                  <Avatar
                    src={record.avatarUrl}
                    onClick={() => modalPreviewAvatar(record.id)}
                    className="cursor-pointer"
                  />
                </Tooltip>
              ) : (
                <Avatar
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${record.name}`}
                />
              )}
            </div>
          );
        },
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (text: string) => {
          return <span className="text-m font-semibold">{text}</span>;
        },
      },
      {
        title: "Company",
        dataIndex: "company",
        key: "company",
        render: (text: string) => (
          <span className="text-m font-semibold">{text}</span>
        ),
      },
      {
        title: "Position",
        dataIndex: "position",
        key: "position",
        render: (text: string) => (
          <span className="text-m font-semibold">{text}</span>
        ),
      },
      {
        title: "Status",
        dataIndex: "isActive",
        key: "isActive",
        width: 150,
        align: "center",
        filters: [
          {
            text: "Active",
            value: "true",
          },
          {
            text: "Inactive",
            value: "false",
          },
        ],
        onFilter: (value, record) => record.isActive.toString() === value,
        filterSearch: true,
        render: (text: boolean) => {
          const isActive = text === true;
          return (
            <Tag
              color={isActive ? "success" : "default"}
              variant="solid"
              icon={isActive ? <EyeFilled /> : <EyeInvisibleFilled />}
              style={{
                padding: "4px 16px",
                borderRadius: "20px",
                backgroundColor: isActive ? "#E8F8F3" : "#F1F5F9", // Subtle background
                color: isActive ? "#10B981" : "#64748B", // Tailwind emerald-500 or slate-500
                border: "none",
                textTransform: "capitalize",
                fontWeight: 600,
                fontSize: "12px",
              }}
            >
              {isActive ? "Active" : "Inactive"}
            </Tag>
          );
        },
      },
      {
        title: "Actions",
        dataIndex: "actions",
        key: "actions",
        width: 120,
        align: "center",
        render: (_, record) => (
          <div className="flex gap-2 justify-center">
            <Tooltip title="Edit">
              <Link
                to="/testimonies/$testimonyId"
                params={{ testimonyId: record.id }}
              >
                <Button type="text" icon={<EditOutlined />} />
              </Link>
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                aria-label="Delete Testimony"
                onClick={() => showConfirmDelete(record.id)}
                disabled={loadingRemoveTestimony}
                loading={loadingRemoveTestimony}
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    [navigate],
  );
  return (
    <>
      {contextHolder}
      {modalContextHolder}
      <ImagePreviewModal
        title="Profile Image Preview"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        previewUrl={modalPreviewUrl}
      />
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div className="flex flex-col gap-1">
          <Title level={2} className="m-0!">
            Testimonies
          </Title>
          <span className="text-gray-500 m-0">
            Highlight success stories and build trust with client endorsements.
          </span>
        </div>
        <div className="flex items-center">
          <Link to="/testimonies/create-new-testimony">
            <Button type="primary" icon={<PlusOutlined />}>
              Add New Testimony
            </Button>
          </Link>
        </div>
      </div>

      <Divider />

      <Card className="shadow-sm border-gray-200">
        {/* Table */}
        {(testimoniesData.adminTestimonies?.length ?? 0) > 0 ? (
          <Table
            pagination={
              testimoniesData?.adminTestimonies?.length > 5
                ? {
                    pageSize: 5,
                    showTotal: (total) => `${total} testimonies`,
                  }
                : false
            }
            columns={columns}
            dataSource={filteredData}
            bordered
            style={{ borderRadius: "12px", overflow: "hidden" }}
            rowKey="id"
            title={() => (
              <div className="flex gap-2 items-center">
                <Search
                  id="search"
                  placeholder="Search testimonies..."
                  allowClear
                  onSearch={handleSearch}
                  // Also filter on change if you want "live" search
                  onChange={(e) => handleSearch(e.target.value)}
                  enterButton
                  style={{ width: 300 }}
                />
              </div>
            )}
          />
        ) : (
          <Empty description="No testimonies found" />
        )}
      </Card>
    </>
  );
}
