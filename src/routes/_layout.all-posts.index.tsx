import {
  CheckCircleFilled,
  ContainerOutlined,
  InboxOutlined,
  EditOutlined,
  PlusOutlined,
  UndoOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Typography,
  Button,
  Table,
  Input,
  Tag,
  Tooltip,
  Divider,
  Select,
  Empty,
  Modal,
  message,
  Card,
} from "antd";
import type { TableProps } from "antd";
import { POSTS_PAGE_QUERY } from "@/graphql/queries";
import { formatDistanceToNow } from "date-fns";
import { useReadQuery, useMutation } from "@apollo/client/react";
import {
  UPDATE_ARTICLE_BY_ID_MUTATION,
  RESTORE_ARTICLE_BY_ID_MUTATION,
  HARD_DELETE_ARTICLE_BY_ID_MUTATION,
} from "@/graphql/mutations";
import { ArticleStatus } from "@/graphql/generated/graphql";

const { Search } = Input;
const { Title } = Typography;

export const Route = createFileRoute("/_layout/all-posts/")({
  component: RouteComponent,
  loader: ({ context: { preloadQuery } }) => {
    const queryRef = preloadQuery(POSTS_PAGE_QUERY);
    return { queryRef };
  },
});

function RouteComponent() {
  const { queryRef } = Route.useLoaderData();
  const { data: articleData, error: articleError } = useReadQuery(queryRef);
  const navigate = useNavigate();

  // 1. Logic State
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [updateArticle, { loading: updateArticleLoading }] = useMutation(
    UPDATE_ARTICLE_BY_ID_MUTATION,
  );
  const [restoreArticle, { loading: restoreArticleLoading }] = useMutation(
    RESTORE_ARTICLE_BY_ID_MUTATION,
  );
  const [hardDeleteArticle, { loading: hardDeleteArticleLoading }] =
    useMutation(HARD_DELETE_ARTICLE_BY_ID_MUTATION);
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, contextHolder] = Modal.useModal();

  const showConfirm = (
    id: string,
    type: "archive" | "unarchive" | "hard-delete",
  ) => {
    modal.confirm({
      title:
        type === "archive"
          ? "Archive?"
          : type === "unarchive"
            ? "Unarchive?"
            : "Hard Delete?",
      content:
        type === "archive"
          ? "Are you sure you want to archive this article?"
          : type === "unarchive"
            ? "Are you sure you want to unarchive this article?"
            : "Are you sure you want to hard delete this article?",
      onOk() {
        type === "archive"
          ? handleArchiveButton(id)
          : type === "unarchive"
            ? handleUnarchiveButton(id)
            : handleHardDeleteButton(id);
      },
    });
  };

  const handleArchiveButton = async (id: string) => {
    try {
      await updateArticle({
        variables: {
          updateArticleId: id,
          payload: {
            status: "ARCHIVED" as ArticleStatus,
          },
        },
        refetchQueries: [POSTS_PAGE_QUERY],
      });
      await messageApi.success("Article archived successfully");
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to archive article");
    }
  };

  const handleUnarchiveButton = async (id: string) => {
    try {
      await restoreArticle({
        variables: {
          restoreArticleId: id,
        },
        refetchQueries: [POSTS_PAGE_QUERY],
      });
      await messageApi.success("Article unarchived successfully");
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to unarchive article");
    }
  };

  const handleHardDeleteButton = async (id: string) => {
    try {
      await hardDeleteArticle({
        variables: {
          hardDeleteArticleId: id,
        },
        refetchQueries: [POSTS_PAGE_QUERY],
      });
      await messageApi.success("Article hard deleted successfully");
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to hard delete article");
    }
  };

  // 2. Memoized Columns (Keeps the table performant)
  const columns: TableProps["columns"] = useMemo(
    () => [
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
        render: (text: string) => <span className="font-semibold">{text}</span>,
      },
      {
        title: "Category",
        dataIndex: "category",
        key: "category",
        render: (category: any) => (
          <Tag color="geekblue" className="capitalize">
            {category?.name || "Uncategorized"}
          </Tag>
        ),
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
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 150,
        align: "center",
        filters: [
          { text: "Published", value: "PUBLISHED" },
          { text: "Draft", value: "DRAFT" },
          { text: "Archived", value: "ARCHIVED" },
        ],
        onFilter: (value: any, record: any) => record.status === value,
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
        title: "Actions",
        key: "actions",
        width: 120,
        align: "center",
        render: (_, record) => (
          <div className="flex gap-2 justify-center">
            {record.status !== "ARCHIVED" &&
              (record.status === "PUBLISHED" || record.status === "DRAFT") && (
                <Tooltip title="Edit">
                  {/* Option A: Use Link (Cleaner) */}
                  <Link to="/all-posts/$postId" params={{ postId: record.id }}>
                    <Button type="text" icon={<EditOutlined />} />
                  </Link>
                </Tooltip>
              )}
            {(record.status === "PUBLISHED" || record.status === "DRAFT") && (
              <Tooltip title="Archive">
                <Button
                  type="text"
                  danger
                  icon={<InboxOutlined />}
                  onClick={() => showConfirm(record.id, "archive")}
                  disabled={updateArticleLoading}
                />
              </Tooltip>
            )}
            {record.status === "ARCHIVED" && (
              <>
                <Tooltip title="Unarchive">
                  <Button
                    type="text"
                    style={{ color: "#10B981" }}
                    icon={<UndoOutlined />}
                    onClick={() => showConfirm(record.id, "unarchive")}
                    disabled={restoreArticleLoading}
                  />
                </Tooltip>
                <Tooltip title="Hard Delete">
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => showConfirm(record.id, "hard-delete")}
                    disabled={hardDeleteArticleLoading}
                  />
                </Tooltip>
              </>
            )}
          </div>
        ),
      },
    ],
    [navigate],
  );

  // 3. Computed Data (No need for extra useEffect/useState for 'data')
  const filteredData = useMemo(() => {
    const rawPosts = articleData?.adminArticles || [];
    return rawPosts.filter((item: any) => {
      const matchesSearch =
        item.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.category?.name?.toLowerCase().includes(searchText.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || item.category?.name === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [articleData, searchText, categoryFilter]);

  if (articleError)
    return (
      <div className="p-10 text-center text-red-500">
        Error: {articleError.message}
      </div>
    );

  return (
    <div className="p-1">
      {messageContextHolder}
      {contextHolder}
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Posts
          </Title>
          <p className="text-gray-500">
            Create, edit, and publish engaging content for your audience.
          </p>
        </div>
        <Link to="/all-posts/create-new-post">
          <Button type="primary" icon={<PlusOutlined />} size="large">
            Create New Post
          </Button>
        </Link>
      </div>

      <Divider />

      <Card className="shadow-sm border-gray-200">
        {/* Table */}
        {(articleData?.adminArticles?.length ?? 0) > 0 ? (
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            bordered
            locale={{ emptyText: <Empty description="No article found" /> }}
            style={{
              borderRadius: "8px",
              overflow: "hidden",
            }}
            title={() => (
              <div className="flex gap-4">
                <Search
                  id="post-search"
                  placeholder="Search titles or categories..."
                  allowClear
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 300 }}
                />
                <Select
                  id="post-category"
                  defaultValue="all"
                  style={{ width: 200 }}
                  onChange={setCategoryFilter}
                  options={[
                    { value: "all", label: "All Categories" },
                    ...(articleData?.categories?.map((c: any) => ({
                      value: c.name,
                      label: c.name,
                    })) || []),
                  ]}
                />
              </div>
            )}
            pagination={
              articleData?.adminArticles?.length > 5
                ? {
                    pageSize: 5,
                    showTotal: (total: number) => `${total} articles`,
                  }
                : false
            }
          />
        ) : (
          <Empty description="No posts found" />
        )}
      </Card>
    </div>
  );
}
