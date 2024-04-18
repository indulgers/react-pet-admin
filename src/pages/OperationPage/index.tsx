/* eslint-disable @typescript-eslint/no-inferrable-types */
import React, { useRef, useEffect, useState } from "react";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import { Button, Dropdown, Space, Tag } from "antd";
import { getTable } from "@services/table";
import http from "@utils/request";
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
        'doctor': { text: '医生管理' },
        'user': { text: '用户管理' },
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
    title: "操作",
    valueType: "option",
    key: "option",
    render: (text, record, _, action) => [
      <a key="view">查看</a>,
    ],
  },
];

const OperationPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
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
  );
};

export default OperationPage;
