/* eslint-disable @typescript-eslint/no-inferrable-types */
import React, { useRef, useEffect, useState } from "react";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import { Button, Dropdown, Form , message} from "antd";
import { useLoginStore } from "@stores/index";
import { createUser, getUserList, deleteUser, updateUser } from "@services/user";
import { deletePost, getMyPostList } from "@services/post";
import { authLoader } from "@config/router";
import { useNavigate } from "react-router-dom";
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

const MinePostPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [data, setData] = React.useState([]);
  const { userInfo } = useLoginStore();
  const  navigation  = useNavigate();
  const [form] = Form.useForm<{ name: string; company: string }>();
  const [isRenderModal, setIsRenderModal] = useState(false);
  useEffect(() => {
    getMyPostList(userInfo?.id).then((res) => {
      if (res.code !== 200) {
        return;
      }
      setData(res.data.data);
    }
    )
  }, [])
  const columns: ProColumns<GithubIssueItem>[] = [
    { title:"id",
      dataIndex: "id",
      valueType: "indexBorder",
      width: 48,
    },
    // {
    //   title: "用户名称",
    //   dataIndex: "nickname",
    //   copyable: true,
    //   ellipsis: true,
    //   tip: "标题过长会自动收缩",
    //   editable: false,
    //   formItemProps: {
    //     rules: [
    //       {
    //         required: true,
    //         message: "此项为必填项",
    //       },
    //     ],
    //   },
    // },
    {
      title: "标题",
      dataIndex: "title",
      copyable: true,
      ellipsis: true,
      tip: "标题过长会自动收缩",
    },
    {
      title:'内容',
      dataIndex:'content',
      valueType:'textarea',
      hideInSearch:true,
      ellipsis:true,
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
      dataIndex: "create_time",
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
            navigation('/account/post', { state:{record}}); 
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
              
              deletePost(record.id).then((res) => {
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
  return (
   <>
    <ProTable<GithubIssueItem>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      dataSource={data}
      // editable={{
      //   type: "multiple",
      //   onSave: async (key, row) => {
      //     delete row.index 
      //     row = Object.assign(row,{nickname:row.nickname,role:row.role,status:row.status,createTime:row.createTime});
      //     updateUser(row.id,row).then((res) => {
      //       if (res.code !== 200) {
      //         return;
      //       }
      //       console.log(res);
      //       message.success('修改成功');
      //       actionRef.current?.reload();
      //       setTimeout(() => {
      //         window.location.reload();
      //       }, 1000);
      //     })
      //   }
      // }}
      rowKey="id"
      search={{
        labelWidth: "auto",
      }}
      headerTitle="我的文章"
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          onClick={() => {
            navigation('/account/post')
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

export default MinePostPage;
