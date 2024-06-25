/* eslint-disable @typescript-eslint/no-inferrable-types */
import React, { useRef, useEffect, useState } from "react";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";

import { Button, Form, message, Row, Col, Input, Select, Upload } from "antd";
import Editor from "@components/Editor";
import opt from "./constant";
import {
  createUser,
  getUserList,
  deleteUser,
  updateUser,
} from "@services/user";
import { addPost, updatePost } from "@services/post";
import { useLoginStore } from "@stores/index";
import http from "@utils/request";
import { authLoader } from "@config/router";
import { useLocation } from "react-router-dom";
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
const PostPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [data, setData] = React.useState([]);
  const { userInfo } = useLoginStore();
  const location = useLocation();

  const record = location.state ? location.state.record : {
    title: '',
    category: 0,
    content: '',
  };
  const [form] = Form.useForm<{
    title: string;
    category: number;
    content: string;
  }>();
  const [isRenderModal, setIsRenderModal] = useState(false);
  const mapValueToLabel = (value) => {
    const option = opt.find(opt => opt.value == value);
    return option ? option.label : '';
  };
  const stripHtmlTags = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
}; 
  useEffect(() => {
    // 设置表单字段的值
    if (!record) {
      return;
    }
    console.log(record);
    form.setFieldsValue({
      title: record.title,
      category: Number(record.category),
      content: stripHtmlTags(record.content),
    });
    console.log(form.getFieldsValue())
  }, [record]);
  const uploadFunc = ({ file }) => {
    const formData = new FormData();
    formData.append("file", file);
    http
      .request({
        url: "/api/minio/uploadFile",
        method: "POST",
        data: formData,
      })
      .then((res) => {
        if (res.code === 201) {
          message.success("请勿重复上传");
          return;
        }
        if (res.code !== 200) {
          message.error("上传失败");
          return;
        }
        message.success("上传成功");
      });
  };
  return (
    <>
      {/* <ModalForm
        title="新建用户"
        open={isRenderModal}
        form={form}
        onFinish={async () => {
          createUser(form.getFieldsValue()).then((res) => {
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
      </ModalForm> */}
      <Form
        form={form}
        onFinish={(values) => {
          values.userId = userInfo?.id;
          values.cover = 'https://img1.baidu.com/it/u=1685345031,415108794&fm=253&fmt=auto&app=138&f=JPEG?w=600&h=255'
          if(location.state){
            updatePost(record.id,values).then((res) => {
              if (res.code !== 200 && res.code !== 201) {
                return;
              }
              message.success("修改成功");
              actionRef.current?.reload();
            }
            )
            return;
          }
          addPost(values).then((res) => {

            if (res.code !== 200 && res.code !== 201) {
              return;
            }
            message.success("新建成功");
            actionRef.current?.reload();
          })
        }}
      >
        <Form.Item name="title" label="标题">
          <Input />
        </Form.Item>
        <Form.Item name="cover" label="封面">
          <Upload
            action="http://localhost:3000/api/minio/uploadFile"
            listType="picture-card"
          >
            <button style={{ border: 0, background: "none" }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
        </Form.Item>
        <Form.Item name="category" label="分类">
          <Select options={opt}/>
        </Form.Item>
        <Form.Item name="content" label="内容">
              <Editor
                onChange={(content:string) => {
                  form.setFieldsValue({ content: content });
                  console.log(content);
                }}
                content={stripHtmlTags(record.content)}
              />
        </Form.Item>
        <Form.Item style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default PostPage;
