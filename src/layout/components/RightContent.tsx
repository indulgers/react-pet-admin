import React, { ChangeEvent } from "react";
import { Avatar, Dropdown, MenuProps, Button, Input, Badge, Space } from "antd";
import { SkinOutlined, BellOutlined } from "@ant-design/icons";
import { useLoginStore, useGlobalStore } from "@stores/index";
import { debounce } from "@utils/func";
import { useNavigate } from "react-router-dom";
import styles from "../index.module.less";

const RightContent: React.FC = () => {
  const { setUserInfo } = useLoginStore();
  const { setColor, primaryColor } = useGlobalStore();
  const navigate = useNavigate();
  const logoutHandle = () => {
    setUserInfo(null);
  };
  const toUserCenter = () => {  
    navigate("/account/center");
  }
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <span onClick={logoutHandle}>退出登录</span>,
    },
    {
      key: "2",
      label: <span onClick={toUserCenter}>个人中心</span>,
    },
  ];

  const changeMainColor = (e: ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  return (
    <Space size={20}>
      <span style={{ display: "flex" }}>
        <Badge count={12}>
          <BellOutlined style={{ fontSize: 24 }} />
        </Badge>
      </span>
      <div className={styles.skin}>
        <Button type="primary" shape="circle" icon={<SkinOutlined />} />
        <Input
          type="color"
          className={styles.skin_input}
          defaultValue={primaryColor}
          onChange={debounce(changeMainColor, 500)}
        ></Input>
      </div>
      <Dropdown menu={{ items }} placement="bottomRight">
        <Avatar
          src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
          style={{ cursor: "pointer" }}
        />
      </Dropdown>
    </Space>
  );
};

export default RightContent;
