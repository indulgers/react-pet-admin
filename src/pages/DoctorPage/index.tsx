/* eslint-disable @typescript-eslint/no-inferrable-types */
import React, { useRef, useEffect, useState } from "react";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProCard, ProTable, TableDropdown } from "@ant-design/pro-components";
import { Button, Dropdown, Space, Tag, message, Avatar, Modal, Tabs, TabsProps } from "antd";
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
import TextArea from "antd/es/input/TextArea";
export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};
const certificateImgs=[
  'https://img2.baidu.com/it/u=3344070076,1294085496&fm=253&fmt=auto&app=138&f=JPEG?w=600&h=447',
  'https://img2.baidu.com/it/u=1417477234,2272885158&fm=253&fmt=auto&app=138&f=JPEG?w=712&h=500',
  'https://img0.baidu.com/it/u=1299245836,2602309670&fm=253&fmt=auto&app=120&f=JPEG?w=688&h=500',
    'https://img0.baidu.com/it/u=2153207446,1903754355&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=730']
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



const DoctorPage: React.FC = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [ isModalVisible, setIsModalVisible ] = useState(false);
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
      title:"手机号", 
      dataIndex: "mobile",
      valueType: "text",
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
        1: { text: "正常" },
      },
    },
    {
      title: "年龄",
      dataIndex: "age",
      valueType: "digit",
    },
    {
      title: "性别",
      dataIndex:"sex",
      valueType: "select",
      valueEnum: {
        0: { text: "男" },
        1: { text: "女" },
      },
    },
    {
      title: "科室",
      dataIndex: "department",
      valueType: "text",
  
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
        <a key="view" onClick={()=>
          {setIsModalVisible(true)

        }}>查看</a>,
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
  const items: TabsProps['items'] = selectedRow ? [
    {
      key: '1',
      label: '基本信息',
      children: <>
            <ProCard colSpan={24} wrap hoverable >
          <ProCard colSpan={6}>姓名：{selectedRow.name}</ProCard>
          <ProCard colSpan={6}>手机号：{selectedRow.mobile}</ProCard>
          <ProCard colSpan={6}>照片: <Avatar src={selectedRow.avatar} width={50} height={50} /></ProCard>
          <ProCard colSpan={6}>年龄：{selectedRow.age}</ProCard>
          <ProCard colSpan={6}>性别：{selectedRow.sex ? "男" : "女"}</ProCard>
          <ProCard colSpan={6}>科室：{selectedRow.department}</ProCard>
          <ProCard colSpan={6} style={{whiteSpace:'nowrap'}}>身份证号: {selectedRow.id_card}</ProCard>
          <ProCard colSpan={24}>自我介绍：<TextArea value={selectedRow.description} disabled autoSize={{ minRows: 3, maxRows: 5 }} /></ProCard>
        </ProCard>
      </>
    },
    {
      key: '2',
      label: '相关证书',
      children: <>
        <ProCard colSpan={24} wrap hoverable >
          <ProCard colSpan={6}>医生资格证书：<img src={certificateImgs[0]} width={120} height={80} /></ProCard>
          <ProCard colSpan={6}>兽医资格证书：<img src={certificateImgs[1]} width={120} height={80} /></ProCard>
          <ProCard colSpan={6}>荣誉证书：<img src={certificateImgs[2]} width={120} height={80} /></ProCard>
          <ProCard colSpan={6}>医生成就：<img src={certificateImgs[3]} width={120} height={80} /></ProCard>
        </ProCard>
      </>
    },
    {
      key: '3',
      label: '总体评价',
      children: 'Content of Tab Pane 3',
    },
  ] : [];
  const actionRef = useRef<ActionType>();
  const [data, setData] = React.useState([]);
  const [form] = ProForm.useForm();
  const [isRenderModal, setIsRenderModal] = useState(false);
  useEffect(() => {
    getDoctorList().then((res) => {
      if (res.code !== 200) {
        return;
      }
      const list = res.data.data.filter((item) => item.status === 1);
      setData(list);
    });
  }, []);
  return (
    <>
       {
        isModalVisible && (
          <Modal
            title="信息详情"
            visible={isModalVisible}
            width={900}
            onOk={() => setIsModalVisible(false)}
            onCancel={() => setIsModalVisible(false)}
          >
            <Tabs defaultActiveKey="1" items={items}>
            </Tabs>
          </Modal>
        )
        
      }
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
        onRow={(record) => {
          return {
            onClick: () => {
              setSelectedRow(record);
            },
          };}
        }
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
