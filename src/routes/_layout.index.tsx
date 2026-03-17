import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Avatar, Button, Card, Empty, Pagination, Tag, Typography } from "antd";
import {
  FileText,
  Package,
  MessageSquare,
  Users,
  PlusCircle,
  ArrowRight,
  Clock,
  User,
} from "lucide-react";
import { HOME_PAGE_QUERY } from "@/graphql/queries";
import { formatDistanceToNow } from "date-fns";
import { CheckCircleFilled, ContainerOutlined } from "@ant-design/icons";
import { useReadQuery } from "@apollo/client/react";

const { Title } = Typography;

export const Route = createFileRoute("/_layout/")({
  component: DashboardApp,
  loader: ({ context: { preloadQuery } }) => {
    const queryRef = preloadQuery(HOME_PAGE_QUERY);
    return {
      queryRef,
    };
  },
});

function ApolloConnectionTest() {
  // const { data, loading, error } = useQuery(TEST_QUERY);
  const { queryRef } = Route.useLoaderData();
  const { data, error } = useReadQuery(queryRef);
  // console.log(data);
  // if (loading) return <div className="p-4 bg-blue-100 text-blue-800 rounded-lg m-4 animate-pulse">Testing connection to GraphQL...</div>;
  if (error)
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded-lg m-4 border-red-200 border">
        <h3 className="font-bold">❌ Connection Error</h3>
        <p className="text-sm">{error.message}</p>
        <p className="text-xs mt-2 text-red-600 font-mono">
          Endpoint: {import.meta.env.VITE_GRAPHQL_API_URL}
        </p>
      </div>
    );
  return (
    <div className="p-4 bg-green-50 text-green-800 rounded-lg m-4 border-green-200 border shadow-sm">
      <h3 className="font-bold flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
        Successfully Connected to Backend
      </h3>
      <p className="text-sm">
        Loaded {data?.__schema?.types?.length} types from the backend schema.
      </p>
    </div>
  );
}

function DashboardApp() {
  const { queryRef } = Route.useLoaderData();
  const { data, error } = useReadQuery(queryRef);
  const [articleCurrentPage, setArticleCurrentPage] = useState(1);
  const [articlePageSize, setArticlePageSize] = useState(5);
  const [inquiriesCurrentPage, setInquiriesCurrentPage] = useState(1);
  const [inquiriesPageSize, setInquiriesPageSize] = useState(6);

  const displayedArticles = data?.adminArticles.slice(
    (articleCurrentPage - 1) * articlePageSize,
    articleCurrentPage * articlePageSize,
  );
  const filteredInquiries = data?.inquiries.filter(
    (item) => item.status === "UNREAD",
  );
  const displayedInquiries = filteredInquiries.slice(
    (inquiriesCurrentPage - 1) * inquiriesPageSize,
    inquiriesPageSize,
  );
  const postStat = [
    {
      title: "Total Post",
      length: data?.adminArticles?.length ?? 0,
      icon: <FileText className="w-6 h-6 text-[#f54936]" />,
      bgClass: "bg-blue-50",
    },
    {
      title: "Active Products",
      length:
        data?.adminProducts?.filter((item) => item.isActive === true).length ??
        0,
      icon: <Package className="w-6 h-6 text-emerald-600" />,
      bgClass: "bg-emerald-50",
    },
    {
      title: "New Inquiries",
      length:
        data?.inquiries.filter((item) => item.status === "UNREAD").length ?? 0,
      icon: <MessageSquare className="w-6 h-6 text-amber-600" />,
      bgClass: "bg-amber-50",
    },
    {
      title: "Team Members",
      length: data?.teamMembers?.length ?? 0,
      icon: <Users className="w-6 h-6 text-purple-600" />,
      bgClass: "bg-purple-50",
    },
  ];

  return (
    <div className="p-1 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        {/* Welcome Back, Admin! */}
        <div>
          <Title level={2} className="m-0!">
            Welcome back, {data?.meQuery?.user?.profile?.firstName || "Admin"}!
            👋
          </Title>
          <Title level={5} className="m-0! text-gray-500! font-normal!">
            Here's what's happening with your content today.
          </Title>
        </div>

        {/* New Post and New Product Buttons */}
        <div className="flex items-center gap-3">
          <Link to="/all-posts/create-new-post">
            <Button type="primary" icon={<PlusCircle />} className="p-5!">
              New Post
            </Button>
          </Link>
          <Link to="/products/create-new-product">
            <Button type="primary" icon={<Package />} className="p-5!">
              New Product
            </Button>
          </Link>
        </div>
      </div>

      <ApolloConnectionTest />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {postStat.map((item) => {
          return (
            <StatCard
              key={item.title}
              icon={item.icon}
              label={item.title}
              value={item.length}
              bgClass={item.bgClass}
            />
          );
        })}
      </div>

      {/* Activity and Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest Articles */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-500" />
              Recent Articles
            </h2>
            <Link
              to="/all-posts"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {/* List */}
          <div className="p-0 flex-1">
            {/* {data && <div className="p-4 text-center text-gray-500">Loading articles...</div>} */}
            {error && (
              <div className="p-4 text-center text-red-500">
                Error loading articles: {error.message}
              </div>
            )}
            <ul className="divide-y divide-gray-100">
              {(data?.adminArticles?.length ?? 0) > 0 ? (
                displayedArticles?.map((article) => (
                  <Link
                    key={article.id}
                    to="/all-posts/$postId"
                    params={{
                      postId: article.id,
                    }}
                  >
                    <li
                      key={article.id}
                      className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex gap-4">
                        <div>
                          <Avatar
                            size={40}
                            src={article?.author?.profile?.avatar}
                            icon={<User className="w-5 h-5" />}
                          />
                        </div>
                        <div>
                          <h3 className="text-md font-medium text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer capitalize">
                            {article.title}
                          </h3>
                          <div className="text-sm text-gray-500 flex items-center gap-2 font-semibold">
                            <span className="capitalize">
                              {article?.author?.role}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />{" "}
                              {formatDistanceToNow(
                                new Date(article.updatedAt),
                                {
                                  addSuffix: true,
                                },
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Tag
                        color={
                          article.status === `PUBLISHED` ? "success" : "default"
                        }
                        variant="solid"
                        icon={
                          article.status === `PUBLISHED` ? (
                            <CheckCircleFilled />
                          ) : (
                            <ContainerOutlined />
                          )
                        }
                        style={{
                          padding: "4px 16px",
                          borderRadius: "20px",
                          backgroundColor:
                            article.status === `PUBLISHED`
                              ? "#E8F8F3"
                              : "#F1F5F9", // Subtle background
                          color:
                            article.status === `PUBLISHED`
                              ? "#10B981"
                              : "#64748B", // Tailwind emerald-500 or slate-500
                          border: "none",
                          textTransform: "capitalize",
                          fontWeight: 600,
                          fontSize: "12px",
                        }}
                      >
                        {article.status === `PUBLISHED` ? `Published` : `Draft`}
                      </Tag>
                    </li>
                  </Link>
                ))
              ) : (
                <Empty className="py-10" />
              )}
            </ul>
          </div>
          {/* Pagination */}
          <div className="p-4 flex justify-end border-t border-gray-100">
            {data.adminArticles.length > 5 && (
              <Pagination
                total={data?.adminArticles?.length ?? 0}
                showTotal={(total) => `${total} items`}
                pageSize={articlePageSize}
                current={articleCurrentPage}
                onChange={(page, size) => {
                  setArticleCurrentPage(page);
                  setArticlePageSize(size);
                }}
              />
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          {/* Inquiries Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gray-500" />
              New Inquiries
            </h2>
            <Link
              to="/inquiries"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {/* Inquiries List */}
          <div className="p-0 flex-1">
            {/* {data && <div className="p-4 text-center text-gray-500">Loading inquiries...</div>} */}
            {error && (
              <div className="p-4 text-center text-red-500">
                Error loading inquiries: {error.message}
              </div>
            )}
            <ul className="divide-y divide-gray-100">
              {(filteredInquiries.length ?? 0) > 0 ? (
                displayedInquiries?.map((inquiry) => (
                  <Link
                    key={inquiry.id}
                    to="/inquiries/$inquiryId"
                    params={{
                      inquiryId: inquiry.id,
                    }}
                  >
                    <li
                      key={inquiry.id}
                      className="p-5 flex items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-linear-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shrink-0">
                        {inquiry.name?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">
                          {inquiry.name}
                        </h4>
                        <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">
                          {formatDistanceToNow(new Date(inquiry.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </li>
                  </Link>
                ))
              ) : (
                <Empty className="py-10" />
              )}
            </ul>
          </div>
          {/* Pagination */}
          <div className="p-4 flex justify-end border-t border-gray-100">
            {(filteredInquiries.length ?? 0) > 6 && (
              <Pagination
                size="small"
                total={filteredInquiries.length ?? 0}
                showTotal={(total) => `${total} items`}
                pageSize={inquiriesPageSize}
                current={inquiriesCurrentPage}
                onChange={(page, size) => {
                  setInquiriesCurrentPage(page);
                  setInquiriesPageSize(size);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  bgClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  bgClass: string;
}) {
  return (
    <Card className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start">
        <div>
          <Title level={5} className="text-sm! font-medium! text-gray-500!">
            {label}
          </Title>
          <Title
            level={3}
            className="text-3xl! font-bold! text-[#1280ED]! mt-2!"
          >
            {value}
          </Title>
        </div>
        <div
          className={`p-3 rounded-xl ${bgClass} group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
