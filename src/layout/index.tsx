import React, { useState, Suspense } from "react";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  NonIndexRouteObject,
  useLocation,
  Navigate,
} from "react-router-dom";
import { MenuProps } from "antd";
import { Layout, Menu, theme, Spin } from "antd";
import HeaderComp from "./components/Header";
import { useLoginStore } from "@stores/index";
import { routes } from "../config/router";
import NoAuthPage from "@components/NoAuthPage";
import "antd/dist/reset.css";
type RouteType = NonIndexRouteObject & {
  title: string;
  icon: React.ReactElement;
  access?: boolean;
};

const { Header, Content, Footer, Sider } = Layout;

const BasicLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { userInfo } = useLoginStore();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { isAdmin, isSuperAdmin } = useLoaderData() as any;

  const getItems: any = (children: RouteType[]) => {
    return children.map((item) => {
      return {
        key: item.index
          ? "/"
          : item.path?.startsWith("/")
          ? item.path
          : `/${item.path}`,
        icon: item.icon,
        label: item.title,
        children: item.children ? getItems(item.children) : null,
        access: item.access !== false ? "true" : "false", // Keep access as boolean
      };
    });
  };
  const menuItems: MenuProps["items"] = getItems(
    routes[0].children![0].children.filter((item) => item.path !== "*" &&  ( item.access === true || item.access === undefined) && !item.path?.includes("id")) 
    )
  

  const onMenuClick: MenuProps["onClick"] = ({ key }) => {
    navigate(key);
  };

  if (!userInfo) {
    return <Navigate to="/login" replace={true} />;
  }

  const renderOpenKeys = () => {
    const arr = pathname.split("/").slice(0, -1);
    const result = arr.map(
      (_, index) => "/" + arr.slice(1, index + 1).join("/")
    );
    return result;
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          background: "#fff",
        }}
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            height: 40,
            margin: 20,
            display: "flex",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <img alt="logo" src="/logo.svg" style={{ width: "32px", height: "32px" }} />
          <h3 style={{ margin: '0 5px' }}>宠物小屋</h3>
        </div>
        <Menu
          theme="light"
          defaultSelectedKeys={[pathname]}
          defaultOpenKeys={renderOpenKeys()}
          mode="inline"
          items={menuItems ? menuItems.filter((item: any) => item.access) : []}
          onClick={onMenuClick}
        />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: "0 10px", background: colorBgContainer }}>
          <HeaderComp />
        </Header>
        {/* height：Header和Footer的默认高度是64 */}
        <Content
          style={{
            padding: 16,
            overflow: "auto",
            height: `calc(100vh - 128px)`,
          }}
        >
          {isAdmin ? (
            <Suspense fallback={<Spin size="large" className="content_spin" />}>
              <Outlet />
            </Suspense>
          ) : (
            <NoAuthPage />
          )}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          react template admin ©2023 Created by Jade
        </Footer>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;