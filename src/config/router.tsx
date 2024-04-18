import React, { lazy } from "react";
import ErrorPage from "@components/ErrorPage";
import LoginPage from "../layout/components/Login";
import Icon from "@components/IconComponent";
import App from "../App";
import { useLoginStore } from "@stores/index";
import { createBrowserRouter, Navigate } from "react-router-dom";
import {
  DashboardOutlined,
  EditOutlined,
  BarsOutlined,
  UserOutlined,
  UsergroupAddOutlined
} from "@ant-design/icons";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const FormPage = lazy(() => import("../pages/FormPage"));
const UserPage = lazy(() => import("../pages/UserPage"));
const AdminPage = lazy(() => import("../pages/AdminPage"))
const DoctorPage = lazy(() => import("../pages/DoctorPage"));
const OperationPage = lazy(() => import("../pages/OperationPage"));
const DoctorVerify = lazy(() => import("../pages/DoctorPage/Verify"));
const AccountCenter = lazy(() => import("../pages/AccountPage/AccountCenter"));
const AccountSettings = lazy(
  () => import("../pages/AccountPage/AccountSettings")
);
const DetailPage = lazy(() => import("../pages/DetailPage"));

export const updateIsSuperAdmin = () => {
  const userInfoString = localStorage.getItem("userInfo") || "[]";
  const userInfo = JSON.parse(userInfoString);
  const userRole = userInfo?.state?.userInfo?.role;
  return { userRole };
}
export function authLoader() {
  const { userRole } = updateIsSuperAdmin();
  const isAdmin = userRole === 1 || userRole === 2;
  const isSuperAdmin = userRole === 2;
  return { isAdmin, isSuperAdmin};
}

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
            title: "首页",
            icon: <DashboardOutlined />,
            element: <Dashboard />,
          },
          // {
          //   path: "form",
          //   title: "表单页",
          //   icon: <EditOutlined />,
          //   element: <FormPage />,
          // },
          {
            path: "user",
            title: "用户管理",
            icon: <UserOutlined />,
            isAdmin: false,
            children: [
              {
                path: "/user/index",
                title: "用户列表",
                element: <UserPage />,
              },
            ],
          },
          {
            path: '/admin',
            title: '管理员管理',
            icon: <UsergroupAddOutlined /> ,
            access: authLoader().isSuperAdmin,
            children:[
              // {
              //   path: '/admin',
              //   title: "跳转页",
              //   redirect: '/admin/sub-page',
              // },
              {
                path: '/admin/index',
                title: "管理员列表",
                element:<AdminPage/>,
              },
            ]
          },
          {
            path: 'doctor',
            title: "医生管理",
            icon: <Icon name="doctor" />,
            children: [
              {
                path: "/doctor/verify",
                title: "医生审核",
                element: <DoctorVerify />,
              },
              {
                path: "/doctor/index",
                title: "医生列表",
                element: <DoctorPage />,
              }
            ]
          },
          {
            path: "operation",
            title: "操作页",
            icon: <BarsOutlined />,
            children: [
              {
                path: "/operation/index",
                title: "操作列表",
                element: <OperationPage />,
              },
              {
                path: "/operation/detail/:id",
                title: "详情页",
                element: <DetailPage />,
              },
            ],
          },
          {
            path: "*",
            element: <Navigate to="/" replace={true} />,
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
