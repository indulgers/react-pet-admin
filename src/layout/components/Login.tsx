import React, { useState } from "react";
import {
  AlipayOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoOutlined,
  UserOutlined,
  WeiboOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  LoginFormPage,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from "@ant-design/pro-components";
import { Button, Divider, Form, message, Space, Tabs } from "antd";
import type { CSSProperties } from "react";
import { login, getUserInfo, getVerifyCode, captchaLogin } from "@services/index";
import { useLoginStore } from "@stores/index";
import  '../index.module.less'
type LoginType = "phone" | "account";

const iconStyles: CSSProperties = {
  color: "rgba(0, 0, 0, 0.2)",
  fontSize: "18px",
  verticalAlign: "middle",
  cursor: "pointer",
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const Login = () => {
  const [loginType, setLoginType] = useState<LoginType>("account");
  const { setUserInfo,userInfo } = useLoginStore();
  const navigate = useNavigate();
  const [form] = Form.useForm();  
  const [verifyCode, setVerifyCode] = useState<string>("");
  const onFinish = async (values: any) => {
    if(verifyCode){
      const res = await captchaLogin(values);
      if (res.code !== 200 && res.code !== 201) {
        message.error(res.data.msg);
        return;
      }
      const info = (await getUserInfo(res.data.data.user_id));
      setUserInfo(info.data);
      message.success("登录成功！");
      navigate("/dashboard");
      return;
    }
    const res = (await login(values)).data;
    if (res.code === 200 || res.code === 201 || res.status === 200 || res.status === 201) {
      const info = (await getUserInfo(res.data.user_id));
      setUserInfo(info.data);
      message.success("登录成功！");
      navigate("/dashboard");
    } else {
      message.error(res.msg);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <LoginFormPage
        backgroundImageUrl="https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr"
        onFinish={onFinish as any}
        title="宠物小窝后台管理系统"
        logo="/logo.svg"
        subTitle="一个轻量级react后台管理系统"
        // activityConfig={{
        //   style: {
        //     boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)",
        //     color: "#fff",
        //     borderRadius: 8,
        //     backgroundColor: "#1677FF",
        //   },
        //   title: "活动标题，可配置图片",
        //   subTitle: "活动介绍说明文字",
        //   action: (
        //     <Button
        //       size="large"
        //       style={{
        //         borderRadius: 20,
        //         background: "#fff",
        //         color: "#1677FF",
        //         width: 120,
        //       }}
        //     >
        //       去看看
        //     </Button>
        //   ),
        // }}
        actions={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Divider plain>
              <span
                style={{ color: "#CCC", fontWeight: "normal", fontSize: 14 }}
              >
                其他登录方式
              </span>
            </Divider>
            <Space align="center" size={24}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  height: 40,
                  width: 40,
                  border: "1px solid #D4D8DD",
                  borderRadius: "50%",
                }}
              >
                <AlipayOutlined style={{ ...iconStyles, color: "#1677FF" }} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  height: 40,
                  width: 40,
                  border: "1px solid #D4D8DD",
                  borderRadius: "50%",
                }}
              >
                <TaobaoOutlined style={{ ...iconStyles, color: "#FF6A10" }} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  height: 40,
                  width: 40,
                  border: "1px solid #D4D8DD",
                  borderRadius: "50%",
                }}
              >
                <WeiboOutlined style={{ ...iconStyles, color: "#333333" }} />
              </div>
            </Space>
          </div>
        }
      >
        <Tabs
          centered
          activeKey={loginType}
          onChange={(activeKey) => setLoginType(activeKey as LoginType)}
        >
          <Tabs.TabPane key={"account"} tab={"账号密码登录"} />
          <Tabs.TabPane key={"phone"} tab={"手机号登录"} />
        </Tabs>
        {loginType === "account" && (
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: "large",
                prefix: <UserOutlined className={"prefixIcon"} />,
              }}
              placeholder={"用户名: admin or user"}
              rules={[
                {
                  required: true,
                  message: "请输入用户名!",
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className={"prefixIcon"} />,
              }}
              placeholder={"请输入密码"}
              rules={[
                {
                  required: true,
                  message: "请输入密码！",
                },
              ]}
            />
          </>
        )}
        {loginType === "phone" && (
          <>
            <ProFormText
              fieldProps={{
                size: "large",
                prefix: <MobileOutlined className={"prefixIcon"} />,
              }}
              name="mobile"
              placeholder={"手机号"}
              rules={[
                {
                  required: true,
                  message: "请输入手机号！",
                },
                {
                  pattern: /^1\d{10}$/,
                  message: "手机号格式错误！",
                },
              ]}
            />
            <ProFormCaptcha
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className={"prefixIcon"} />,
              }}
              captchaProps={{
                size: "large",
              }}
              phoneName={"mobile"}
              value={verifyCode}
              placeholder={"请输入验证码"}
              captchaTextRender={(timing, count) => {
                if (timing) {
                  return `${count} ${"获取验证码"}`;
                }
                return "获取验证码";
              }}
              name="verifyCode"
              rules={[
                {
                  required: true,
                  message: "请输入验证码！",
                },
              ]}
              onGetCaptcha={async (values) => { 
                const obj ={
                  mobile:values
                }
                const res = await getVerifyCode(obj);
                if (res.code !== 200 && res.code !== 201) {
                  return;
                }
                message.success(`获取验证码成功！验证码为：${res.data.data}`);
                setVerifyCode(res.data.data);
              }}
            />
          </>
        )}
        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox>
          <a
            style={{
              float: "right",
            }}
          >
            忘记密码
          </a>
        </div>
      </LoginFormPage>
    </div>
  );
};

export default Login;
