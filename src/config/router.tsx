import React, { lazy } from "react";
import ErrorPage from "@components/ErrorPage";
import LoginPage from "../layout/components/Login";
import Icon from "@components/IconComponent";
import App, { authLoader } from "../App";
import { createBrowserRouter, Navigate } from "react-router-dom";
import {
  DashboardOutlined,
  EditOutlined,
  TableOutlined,
  BarsOutlined,
  UserOutlined,
  UsergroupAddOutlined
} from "@ant-design/icons";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const FormPage = lazy(() => import("../pages/FormPage"));
const TablePage = lazy(() => import("../pages/TablePage"));
const AdminPage = lazy(() => import("../pages/AdminPage"))
const AccountCenter = lazy(() => import("../pages/AccountPage/AccountCenter"));
const AccountSettings = lazy(
  () => import("../pages/AccountPage/AccountSettings")
);
const DetailPage = lazy(() => import("../pages/DetailPage"));

const routes = [
  {
    path: "/",
    element: <App />,
    loader: authLoader,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            title: "Dashboard",
            icon: <DashboardOutlined />,
            element: <Dashboard />,
          },
          {
            path: "form",
            title: "表单页",
            icon: <EditOutlined />,
            element: <FormPage />,
          },
          {
            path: "table",
            title: "列表页",
            icon: <TableOutlined />,
            element: <TablePage />,
          },
          {
            path: "detail",
            title: "详情页",
            icon: <BarsOutlined />,
            element: <DetailPage />,
          },
          {
            path: '/admin',
            title: '管理员管理',
            icon: <UsergroupAddOutlined /> ,
            access: 'canAdmin',
            children:[
              {
                path: '/admin',
                title: "跳转页",
                redirect: '/admin/sub-page',
              },
              {
                path: '/admin/sub-page',
                title: "管理员列表",
                element:<AdminPage/>
              },
            ]
          },
          {
            path: "account",
            title: "个人页",
            icon: <UserOutlined />,
            children: [
              {
                path: "/account/center",
                title: "个人中心",
                element: <AccountCenter />,
              },
              {
                path: "/account/settings",
                title: "个人设置",
                element: <AccountSettings />,
              },
            ],
          },
          {
            path: 'doctor',
            title: "医生管理",
            icon: <Icon name="doctor" />,
            children: [
              {
                path: "/doctor/verify",
                title: "医生审核",
              }
            ]
          },
          {
            path: "*",
            element: <Navigate to="/" replace={true} />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
];

export { routes };

export default createBrowserRouter(routes);
