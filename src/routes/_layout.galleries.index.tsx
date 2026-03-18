import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleFilled,
  ContainerOutlined,
  PictureTwoTone,
} from "@ant-design/icons";
import { useReadQuery, useMutation } from "@apollo/client/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Typography,
  Button,
  Table,
  Tag,
  Tooltip,
  Modal,
  message,
  Card,
  Divider,
  Empty,
  Image,
  Space,
} from "antd";
import type { TableProps } from "antd";
import { GALLERIES_PAGE_QUERY } from "@/graphql/queries";
import { REMOVE_GALLERY_MUTATION } from "@/graphql/mutations";
import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";

const { Title } = Typography;

export const Route = createFileRoute("/_layout/galleries/")({
  component: RouteComponent,
  loader: ({ context: { preloadQuery } }) => {
    const queryRef = preloadQuery(GALLERIES_PAGE_QUERY);
    return { queryRef };
  },
});

function RouteComponent() {
  const { queryRef } = Route.useLoaderData();
  const { data: galleriesData } = useReadQuery(queryRef);
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPreviewUrl, setModalPreviewUrl] = useState("");

  const [removeGallery, { loading: removeGalleryLoading }] = useMutation(
    REMOVE_GALLERY_MUTATION,
    {
      refetchQueries: [GALLERIES_PAGE_QUERY],
      onCompleted: () => {
        messageApi.success("Gallery removed successfully");
      },
      onError: (error) => {
        messageApi.error(error.message);
      },
    },
  );

  const showConfirmRemoveGallery = (id: string) => {
    modal.confirm({
      title: "Confirm Remove Gallery",
      content: "Are you sure you want to remove this gallery?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => handleRemoveGallery(id),
    });
  };

  const handleRemoveGallery = async (id: string) => {
    await removeGallery({
      variables: {
        removeGalleryId: id,
      },
    });
  };

  const modalPreviewGalleryImage = (id: string) => {
    const member = galleriesData?.adminGalleries?.find((m) => m.id === id);
    if (!member) return;
    const url = member.media?.[0]?.url || "";
    setModalPreviewUrl(url);
    setIsModalOpen(true);
  };

  const columns: TableProps["columns"] = useMemo(
    () => [
      {
        title: "Preview",
        dataIndex: "media",
        key: "preview",
        width: 100,
        align: "center",
        render: (media: any[], record: any) => {
          const url = media?.[0]?.url;
          return url ? (
            <div className="flex justify-center gap-2">
              <Tooltip title="View Gallery Image">
                <Image
                  src={url}
                  alt="Preview"
                  width={150}
                  height={100}
                  className="object-cover rounded cursor-pointer"
                  onClick={() => modalPreviewGalleryImage(record.id)}
                  preview={{
                    mask: { blur: true },
                    cover: (
                      <Space vertical align="center">
                        {record.title}
                      </Space>
                    ),
                    open: false,
                  }}
                />
              </Tooltip>
            </div>
          ) : (
            <div className="w-[50px] h-[50px] bg-gray-100 flex items-center justify-center rounded">
              <PictureTwoTone />
            </div>
          );
        },
      },
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
        render: (text: string) => <span className="font-semibold">{text}</span>,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 150,
        align: "center",
        render: (status: string) => {
          const isPublished = status === "PUBLISHED";
          return (
            <Tag
              icon={isPublished ? <CheckCircleFilled /> : <ContainerOutlined />}
              style={{
                padding: "4px 12px",
                borderRadius: "20px",
                backgroundColor: isPublished ? "#E8F8F3" : "#F1F5F9",
                color: isPublished ? "#10B981" : "#64748B",
                border: "none",
                textTransform: "capitalize",
                fontWeight: 600,
              }}
            >
              {status.toLowerCase()}
            </Tag>
          );
        },
      },
      {
        title: "Last Updated",
        dataIndex: "updatedAt",
        key: "updatedAt",
        render: (text: string) => (
          <span>
            {formatDistanceToNow(new Date(text), { addSuffix: true })}
          </span>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        width: 120,
        align: "center",
        render: (_, record) => (
          <div className="flex gap-2 justify-center">
            <Tooltip title="Edit">
              <Link
                to="/galleries/$galleryId"
                params={{ galleryId: record.id }}
              >
                <Button type="text" icon={<EditOutlined />} />
              </Link>
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => showConfirmRemoveGallery(record.id)}
                loading={removeGalleryLoading}
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    [removeGalleryLoading],
  );

  return (
    <div className="p-1">
      {messageContextHolder}
      {modalContextHolder}
      <Modal
        title="Gallery Image Preview"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        <div className="flex items-center justify-center">
          <Image
            src={modalPreviewUrl}
            alt="Gallery Image Preview"
            className="max-w-full"
            preview={{
              mask: { blur: true },
              cover: (
                <Space vertical align="center">
                  Gallery Image Preview
                </Space>
              ),
              open: false,
            }}
          />
        </div>
      </Modal>

      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Galleries
          </Title>
          <p className="text-gray-500">
            Manage your image galleries and visual content.
          </p>
        </div>
        <Link to="/galleries/create-new-gallery">
          <Button type="primary" icon={<PlusOutlined />} size="large">
            Create New Gallery
          </Button>
        </Link>
      </div>

      <Divider />

      <Card className="shadow-sm border-gray-200">
        {(galleriesData?.adminGalleries?.length ?? 0) > 0 ? (
          <Table
            columns={columns}
            dataSource={galleriesData?.adminGalleries || []}
            rowKey="id"
            bordered
            pagination={{
              pageSize: 10,
              showTotal: (total: number) => `${total} galleries`,
            }}
          />
        ) : (
          <Empty description="No galleries found" />
        )}
      </Card>
    </div>
  );
}
