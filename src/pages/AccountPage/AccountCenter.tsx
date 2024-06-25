import { ProCard } from "@ant-design/pro-components";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Row,
  Col,
  Card,
  Form,
  Select,
  Input,
  Upload,
  Button,
  Tag,
  Image,
  Cascader,
  message,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import type { GetProp, UploadFile, UploadProps } from "antd";
import districts from "./district";
import { updateDoctor } from "@services/doctor";
import { getVerifyCode } from "@services/user";
import "./index.module.scss";
const url =
  "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const petDoctorCategories = [
  { label: "兽医师（Veterinarian）", value: "Veterinarian" },
  { label: "兽医助理（Veterinary Assistant）", value: "Veterinary Assistant" },
  {
    label: "兽医技师（Veterinary Technician）",
    value: "Veterinary Technician",
  },
  { label: "宠物营养师（Pet Nutritionist）", value: "Pet Nutritionist" },
  { label: "行为学家（Animal Behaviorist）", value: "Animal Behaviorist" },
  { label: "宠物美容师（Pet Groomer）", value: "Pet Groomer" },
  { label: "宠物训练师（Pet Trainer）", value: "Pet Trainer" },
  {
    label: "动物康复师（Animal Rehabilitation Therapist）",
    value: "Animal Rehabilitation Therapist",
  },
  // 可以根据实际情况添加其他类别
];
const tabList = [
  {
    key: 'tab1',
    tab: 'tab1',
  },
  {
    key: 'tab2',
    tab: 'tab2',
  },
];
const AccountCenter: React.FC = () => {
  const [form] = Form.useForm();
  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [activeTabKey1, setActiveTabKey1] = useState<string>('tab1');
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
  ]);
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };
  const onTab1Change = (key: string) => {
    setActiveTabKey1(key);
  };
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  const submit = (id, values) => {
    // updateDoctor(id, values).then((res) => {
    //   if (res.code !== 200 && res.code !== 201) {
    //     return;
    //   }
    //   message.success("修改成功");
    // });
    message.success("修改成功");
  };
  const getCode = (mobile: string) => {
    getVerifyCode(mobile).then((res) => {
      message.success("您的验证码为7531");
    });
  };
  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);
  useEffect(() => {
    form.setFieldsValue({
      name: "王小芳",
      identity: "312314124141412",
      phone: "153412312321",
      region: ["广东省", "深圳市", "南山区"],
      category: "Pet Nutritionist",
      description: "默认个人简介",
      captcha: "",
    });
  }, []);
  return (
    <Form form={form} onFinish={() => submit()}>
      <Row
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        gutter={[0, 20]}
      >
        <Col span={10}>
          <Card title="Card title">
            <Form.Item
              label="照片"
              name="photo"
              rules={[{ message: "请选择照片" }]}
            >
              <Col>
                <Avatar
                  size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                  src={
                    <img
                      src={
                        "https://img0.baidu.com/it/u=4289961480,931676267&fm=253&fmt=auto&app=138&f=JPEG?w=750&h=500"
                      }
                      alt="avatar"
                    />
                  }
                />
                <Upload
                  name="logo"
                  action="http://localhost:3000/api/minio/uploadFile"
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
              </Col>
            </Form.Item>
            <Form.Item
              label="姓名"
              name="name"
              rules={[{ required: true, message: "请输入姓名" }]}
            >
              <Input placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item
              label="身份证号"
              name="identity"
              rules={[{ required: true, message: "请输入身份证号" }]}
            >
              <Input placeholder="请输入身份证号" />
            </Form.Item>
            <Form.Item
              label="手机号"
              name="phone"
              rules={[{ required: true, message: "请输入手机号" }]}
            >
              <Input placeholder="请输入手机号" />
            </Form.Item>
            <Form.Item
              label="地区"
              name="region"
              rules={[{ required: true, message: "请选择地区" }]}
            >
              <Cascader options={districts} placeholder="请选择地区" />
            </Form.Item>
            <Form.Item
              label="类别"
              name="category"
              rules={[{ required: true, message: "请选择类别" }]}
            >
              <Select options={petDoctorCategories} placeholder="请选择类别" />
            </Form.Item>
            <Form.Item
              label="个人简介"
              name="description"
              rules={[{ message: "请输入个人简介" }]}
            >
              <Input.TextArea placeholder="请输入个人简介" />
            </Form.Item>
          </Card>
        </Col>
        <Card title="Card title" style={{width:500}}>
          <Col span={10}>
            <Form.Item label="状态" name="status">
              <Tag color="success">正常</Tag>
            </Form.Item>
            <Form.Item
              label="身份证正反面"
              name="identityPhoto"
              rules={[{ message: "请选择身份证正反面" }]}
            >
              <Upload
                action="http://localhost:3000/api/minio/uploadFile"
                listType="picture-card"
                fileList={fileList}
                style={{ display: "flex" }}
                onPreview={handlePreview}
                onChange={handleChange}
              >
                {fileList.length >= 8 ? null : uploadButton}
              </Upload>
              {previewImage && (
                <Image
                  wrapperStyle={{ display: "none" }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (
                      visible: boolean | ((prevState: boolean) => boolean)
                    ) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </Form.Item>
            <Form.Item
              label="行医资格证书"
              name="certificate"
              rules={[{ message: "请选择行医资格证书" }]}
            >
              <Upload
                action="http://localhost:3000/api/minio/uploadFile"
                listType="picture-card"
              >
                {uploadButton}
              </Upload>
            </Form.Item>
            <Row gutter={8}>
              
              <Col span={12}>
                <Form.Item
                  name="captcha"
                  label="验证码"
                  rules={[
                    {
                      message: "Please input the captcha you got!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Button
                  style={{ margin: "5px 0 0 0" }}
                  onClick={() => getCode(form.getFieldValue("mobile"))}
                >
                  Get captcha
                </Button>
              </Col>
            </Row>
            <Form.Item>
              <Button htmlType="submit" type="primary">
                修改
              </Button>
            </Form.Item>
          </Col>
        </Card>
      </Row>
    </Form>
  );
};

export default AccountCenter;
