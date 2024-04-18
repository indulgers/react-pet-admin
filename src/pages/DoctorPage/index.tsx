/* eslint-disable @typescript-eslint/no-inferrable-types */
import React, { useRef, useEffect, useState } from "react";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import { Button, Dropdown, Space, Tag, message } from "antd";
import { getTable } from "@services/table";
import {
  ModalForm,
  ProForm,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import {
  getDoctorList,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "@services/doctor";
import useLoginStore from "@stores/login";
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
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  created_at: string;
  updated_at: string;
};

const columns: ProColumns<GithubIssueItem>[] = [
  {
    dataIndex: "id",
    valueType: "indexBorder",
    width: 48,
  },
  {
    title: "标题",
    dataIndex: "name",
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
    title: "状态",
    dataIndex: "status",
    filters: true,
    onFilter: true,
    ellipsis: true,
    valueType: "select",
    valueEnum: {
      all: { text: "超长".repeat(50) },
      open: {
        text: "未解决",
        status: "Error",
      },
      closed: {
        text: "已解决",
        status: "Success",
        disabled: true,
      },
      processing: {
        text: "解决中",
        status: "Processing",
      },
    },
  },
  {
    title: "创建时间",
    key: "showTime",
    dataIndex: "created_at",
    valueType: "date",
    sorter: true,
    hideInSearch: true,
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    valueType: "dateRange",
    hideInTable: true,
    search: {
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1],
        };
      },
    },
  },
  {
    title: "操作",
    valueType: "option",
    key: "option",
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a key="view">查看</a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: "copy", name: "复制" },
          { key: "delete", name: "删除", onClick: () => {
            const  userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}"); 
            console.log(userInfo);
            deleteDoctor(userInfo?.id,record.id).then((res) => {
              if (res.code !== 200) {
                return;
              }
              message.success("删除成功");
              action?.reload();
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
            }
          },
        ]}
      />,
    ],
  },
];

const DoctorPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [data, setData] = React.useState([]);
  const [form] = ProForm.useForm();
  const [isRenderModal, setIsRenderModal] = useState(false);
  useEffect(() => {
    getDoctorList().then((res) => {
      if (res.code !== 200) {
        return;
      }
      setData(res.data.data);
    });
  }, []);
  return (
    <>
      <ModalForm
        title="新建医生"
        open={isRenderModal}
        form={form}
        onFinish={async () => {
          createDoctor(form.getFieldsValue()).then((res) => {
            if (res.code !== 200 && res.code !== 201) {
              return;
            }
            message.success("新建成功");
            actionRef.current?.reload();
            setIsRenderModal(false);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          });
        }}
        onOpenChange={setIsRenderModal}
      >
        <ProForm.Group>
          <ProFormText
            width="md"
            name="name"
            label="医生名称"
            placeholder="请输入用户名称"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            width="md"
            name="age"
            label="年龄"
            placeholder="请输入年龄"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            options={[
              {
                value: "0",
                label: "男",
              },
              {
                value: "1",
                label: "女",
              },
            ]}
            width="xs"
            name="sex"
            label="性别"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            width="md"
            name="department"
            label="科室"
            placeholder="请输入科室"
          />
        </ProForm.Group>
      </ModalForm>
      <ProTable<GithubIssueItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        dataSource={data}
        editable={{
          type: "multiple",
          onSave: async (key, row) => {
            updateDoctor(row.id, row).then((res) => {
              if (res.code !== 200) {
                return;
              }
              message.success("更新成功");
              actionRef.current?.reload();
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          },
        }}
        rowKey="id"
        search={{
          labelWidth: "auto",
        }}
        headerTitle="高级表格"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              actionRef.current?.reload();
              setIsRenderModal(true);
            }}
            type="primary"
          >
            新建
          </Button>,
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

export default DoctorPage;
