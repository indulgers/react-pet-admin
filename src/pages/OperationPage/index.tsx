/* eslint-disable @typescript-eslint/no-inferrable-types */
import React, { useRef, useEffect, useState } from "react";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable, TableDropdown, ProCard } from "@ant-design/pro-components";
import { Button, Dropdown, Space, Tag, Modal } from "antd";
import { getTable } from "@services/table";
import http from "@utils/request";
import { useNavigate } from "react-router-dom";
import { getOperationList } from "@services/operation";
export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

type GithubIssueItem = {
  id: string;
  mode: string;
  model: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  date: string;
  way: string;
};

const OperationPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<GithubIssueItem | null>(null);
  const columns: ProColumns<GithubIssueItem>[] = [
    {
      dataIndex: "id",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "操作方法",
      dataIndex: "mode",
      copyable: true,
      ellipsis: true,
      tip: "标题过长会自动收缩",
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
    },
    {
      disable: true,
      title: "操作模块",
      dataIndex: "model",
      filters: true,
      onFilter: true,
      ellipsis: true,
      valueType: "select",
      valueEnum: {
        doctor: { text: "医生管理" },
        user: { text: "用户管理" },
      },
    },
    {
      title: "操作时间",
      key: "date",
      dataIndex: "date",
      valueType: "date",
      sorter: true,
      hideInSearch: true,
    },
    {
      key: "view",
      render: (_, record) => (
        <a onClick={() => {
            setIsModalVisible(true) 
            setSelectedRecord(record)}}>查看</a>
      ),
    },
  ];
  const [data, setData] = React.useState([]);

  useEffect(() => {
    getOperationList().then((res) => {
      if (res.code !== 200) {
        return;
      }
      setData(res.data.data);
    });
  }, []);
  return (
    <>
      {isModalVisible && (
        <Modal
          width={900}
          visible={isModalVisible}
          onOk={() => setIsModalVisible(false)}
          onCancel={() => setIsModalVisible(false)}
        >
        {selectedRecord && (
    <>
      <ProCard colSpan={24} wrap hoverable title="操作详情">
        <ProCard colSpan={6}>日志ID：{selectedRecord.log_id}</ProCard>
        <ProCard colSpan={6}>模块：{selectedRecord.model}</ProCard>
        <ProCard colSpan={6}>操作方式：{selectedRecord.mode}</ProCard>
        <ProCard colSpan={6}>用户ID：{selectedRecord.user_id}</ProCard>
        <ProCard colSpan={6}>IP地址：{selectedRecord.ip}</ProCard>
        <ProCard colSpan={6}>状态：{selectedRecord.state}</ProCard>
        <ProCard colSpan={6}>操作时间：{selectedRecord.date}</ProCard>
        <ProCard colSpan={6}>请求地址：{selectedRecord.address}</ProCard>
        <ProCard colSpan={6}>请求方式：{selectedRecord.way}</ProCard>
        <ProCard colSpan={6}>请求参数：{selectedRecord.request_para}</ProCard>
        <ProCard colSpan={6}>返回参数：{selectedRecord.return_para}</ProCard>
        <ProCard colSpan={6}>错误信息：{selectedRecord.error_mes}</ProCard>
      </ProCard>
    </>
  )}
        </Modal>
      )}
      <ProTable<GithubIssueItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        dataSource={data}
        editable={{
          type: "multiple",
        }}
        search={{
          labelWidth: "auto",
        }}
        headerTitle="操作日志"
        toolBarRender={() => [
          // <Button
          //   key="button"
          //   icon={<PlusOutlined />}
          //   onClick={() => {
          //     actionRef.current?.reload();
          //   }}
          //   type="primary"
          // >
          //   新建
          // </Button>,
          <Dropdown
            key="menu"
            menu={{
              items: [
                {
                  label: "1st item",
                  key: "1",
                },
                {
                  label: "2nd item",
                  key: "2",
                },
                {
                  label: "3rd item",
                  key: "3",
                },
              ],
            }}
          >
            <Button>
              <EllipsisOutlined />
            </Button>
          </Dropdown>,
        ]}
      />
    </>
  );
};

export default OperationPage;
