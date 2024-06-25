/* eslint-disable @typescript-eslint/no-inferrable-types */
import React, { useRef, useEffect, useState } from "react";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import { Button, Dropdown, Form , message} from "antd";
import { createUser, getUserList, deleteUser, updateUser } from "@services/user";
import { getAdminList } from "@services/admin";
import {
  ModalForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import http from "@utils/request";
import { authLoader } from "@config/router";
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
    title: "用户名称",
    dataIndex: "nickname",
    copyable: true,
    ellipsis: true,
    editable: false,
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
    title: "用户权限",
    dataIndex: "role",
    valueType: "select",
    valueEnum: {
      0: { text: "普通用户" },
      1: { text: "二级管理员" },
      2: { text: "一级管理员" },
    },
    renderFormItem: (text, {record, index})=>{
      return authLoader().isSuperAdmin  ? <ProFormSelect
        options={[
          {
            value: '1',
            label: '二级管理员',
          },
          {
            value: '2',
            label: '一级管理员',
          },
          {
            value: '0',
            label: '普通用户',
          }
        ]}
        width="xs"
        name="role"
        label="权限设置"
        />
        : <ProFormSelect
        options={[
          {
            value: '1',
            label: '二级管理员',
          },
          {
            value: '2',
            label: '一级管理员',
          },
          {
            value: '0',
            label: '普通用户',
          }
        ]}
        width="xs"
        name="role"
        label="权限设置"
        disabled
        />
    }
  },
  {
    title: "状态",
    dataIndex: "status",
    filters: true,
    onFilter: true,
    ellipsis: true,
    valueType: "select",
    valueEnum: {
      '-1': { text: "已删除", status: "Error" },
      0: { text: "正常", status: "Success" },
    },
  },
  {
    title: "创建时间",
    key: "createTime",
    dataIndex: "createTime",
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
        onSelect={() => {
          console.log('onSelect');
        }}
      >
        编辑
      </a>,
      <a key="view">查看</a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: "copy", name: "复制",onClick:() => {
            createUser({record}).then((res) => {
              if (res.code !== 200) {
                return;
              }
              console.log(res);
              message.success('复制成功');
              action?.reload();
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            })
          }
           },
          { key: "delete", name: "删除",onClick:() => {
            const  userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
            deleteUser(record.id,userInfo?.id).then((res) => {
              if (res.code !== 200) {
                return;
              }
              message.success('删除成功');
              action?.reload();
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            })
          }
          },
        ]}
      />,
    ],
  },
];

const AdminPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [data, setData] = React.useState([]);
  const [form] = Form.useForm<{ nickname: string; role: number }>();
  const [isRenderModal, setIsRenderModal] = useState(false);
  useEffect(() => {
    getAdminList().then((res) => {
      if (res.code !== 200) {
        return;
      }
      setData(res.data.data);
    }
    )
  }, [])
  return (
   <>
    <ModalForm
        title="新建用户"
        open={isRenderModal}
        form={form}
        onFinish={async () => {
          createUser(form.getFieldsValue()).then((res) => {
            if (res.code !== 200 && res.code !== 201) {
              return;
            }
            message.success('新建成功');
            actionRef.current?.reload();
            setIsRenderModal(false);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          })
        }}
        onOpenChange={setIsRenderModal}
      >
        <ProForm.Group>
          <ProFormText
            width="md"
            name="nickname"
            label="用户名称"
            placeholder="请输入用户名称"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            options={[
              { value: '0', label: '普通用户'},
              {
                value: '1',
                label: '二级管理员',
              },
              // {
              //   value: '2',
              //   label: '一级管理员',
              // }
            ]}
            width="xs"
            name="role"
            label="权限设置"
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
          delete row.index 
          row = Object.assign(row,{nickname:row.nickname,role:row.role,status:row.status,createTime:row.createTime});
          updateUser(row.id,row).then((res) => {
            if (res.code !== 200) {
              return;
            }
            console.log(res);
            message.success('修改成功');
            actionRef.current?.reload();
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          })
        }
      }}
      rowKey="id"
      search={{
        labelWidth: "auto",
      }}
      headerTitle="管理员管理"
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          onClick={() => {
            actionRef.current?.reload();
            setIsRenderModal(true)
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

export default AdminPage;
