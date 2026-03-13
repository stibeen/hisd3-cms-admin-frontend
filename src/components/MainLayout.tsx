import React, { useState, useMemo } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileTextOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  ShoppingOutlined,
  TeamOutlined,
  LogoutOutlined,
  HomeOutlined,
  ExclamationCircleFilled,
  CommentOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  theme,
  ConfigProvider,
  Breadcrumb,
  Modal,
  message,
} from "antd";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@apollo/client/react";
import { LOG_OUT_MUTATION } from "../graphql/mutations";

const { Header, Sider, Content, Footer } = Layout;

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const location = useLocation();
  const navigate = useNavigate();
  const [logout] = useMutation(LOG_OUT_MUTATION);
  const [messageApi, messageContextHolder] = message.useMessage();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const showLogoutConfirm = () => {
    modal.confirm({
      title: "Confirm Logout",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to logout?",
      okText: "Logout",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const { data } = await logout();
          if (data?.logOut?.message) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            console.log(data);
            messageApi.success(data.logOut.message);
            navigate({ to: "/login" });
          }
        } catch (error) {
          console.error("Logout error:", error);
          messageApi.error("An error occurred during logout.");
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // 1. Sync Active Menu Item with TanStack Route
  // We use useMemo so this doesn't recalculate unless the path changes
  const selectedKey = useMemo(() => {
    const path = location.pathname;
    if (path === "/") return "1";
    if (path.startsWith("/all-posts")) return "2";
    if (path.startsWith("/inquiries")) return "3";
    if (path.startsWith("/products")) return "4";
    if (path.startsWith("/team")) return "5";
    if (path.startsWith("/testimonies")) return "6";
    if (path.startsWith("/galleries")) return "7";
    if (path.startsWith("/settings")) return "8";
    return "1";
  }, [location.pathname]);

  // 2. Breadcrumb Logic (Keep your existing logic)
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const breadcrumbItems = [
    { title: <Link to="/">Home</Link> },
    ...pathSnippets.map((snippet, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      const displayName = snippet
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      return { title: <Link to={url as any}>{displayName}</Link> };
    }),
  ];

  if (location.pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            // CUSTOM HIGHLIGHT COLORS HERE
            itemSelectedBg: "rgba(255, 255, 255, 0.2)", // Light white tint for active bg
            itemSelectedColor: "#ffffff", // Active text color
            itemColor: "rgba(255, 255, 255, 0.85)", // Default text color
            itemHoverColor: "#ffffff",
            itemHoverBg: "rgba(255, 255, 255, 0.1)",
            itemActiveBg: "rgba(255, 255, 255, 0.3)",
          },
        },
      }}
    >
      {contextHolder}
      {messageContextHolder}
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            backgroundColor: "#1280ED",
          }}
        >
          <div className="p-2 flex bg-white m-1.5 rounded-lg items-center justify-center transition-all duration-300">
            <img
              src="/hisd3-logo.svg"
              alt="HISD3 Logo"
              className="h-8 w-auto"
            />
            {!collapsed && (
              <div className="ml-2 flex items-center overflow-hidden whitespace-nowrap">
                <span className="text-black font-bold text-2xl">HIS</span>
                <span className="text-[#F54936] font-bold text-2xl">D3</span>
              </div>
            )}
          </div>
          <Menu
            mode="inline"
            style={{ backgroundColor: "transparent", borderRight: 0 }}
            selectedKeys={[selectedKey]} // Now controlled by TanStack Router
            items={[
              {
                key: "1",
                icon: <HomeOutlined />,
                label: <Link to="/">Home</Link>,
              },
              {
                key: "2",
                icon: <FileTextOutlined />,
                label: <Link to="/all-posts">Posts</Link>,
              },
              {
                key: "3",
                icon: <QuestionCircleOutlined />,
                label: <Link to="/inquiries">Inquiries</Link>,
              },
              {
                key: "4",
                icon: <ShoppingOutlined />,
                label: <Link to="/products">Products</Link>,
              },
              {
                key: "5",
                icon: <TeamOutlined />,
                label: <Link to="/team">Team</Link>,
              },
              {
                key: "6",
                icon: <CommentOutlined />,
                label: <Link to="/testimonies">Testimonies</Link>,
              },
              {
                key: "7",
                icon: <PictureOutlined />,
                label: <Link to="/galleries">Galleries</Link>,
              },
              {
                key: "8",
                icon: <SettingOutlined />,
                label: <Link to="/settings">Settings</Link>,
              },
              {
                key: "9",
                icon: <LogoutOutlined />,
                label: "Logout",
                onClick: showLogoutConfirm,
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header
            className="flex items-center"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1000,
              padding: 0,
              background: colorBgContainer,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: "16px", width: 64, height: 64 }}
            />
            <Breadcrumb items={breadcrumbItems} />
          </Header>
          <Content
            style={{
              margin: "16px",
              padding: 16,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              border: "1px solid #1280ED",
            }}
          >
            {children}
          </Content>
          <Footer
            className="text-center"
            style={{ padding: 20, background: colorBgContainer }}
          >
            HISD3 CMS ©{new Date().getFullYear()} Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default MainLayout;
