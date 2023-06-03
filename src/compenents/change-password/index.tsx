import React, { useState, useEffect } from "react";
import { Modal, Form, Input, message } from "antd";
import styles from "./index.module.less";
import { user } from "../../api/index";

interface PropInterface {
  open: boolean;
  onCancel: () => void;
}

export const ChangePasswordModel: React.FC<PropInterface> = ({
  open,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    form.setFieldsValue({
      old_password: "",
      new_password: "",
      again_new_password: "",
    });
  }, [form, open]);

  const onFinish = (values: any) => {
    if (values.again_new_password !== values.new_password) {
      message.error("The new password entered again is wrong");
      return;
    }
    user.password(values.old_password, values.new_password).then((res: any) => {
      message.success("Save successfully!");
      onCancel();
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Modal
        title="Change password"
        centered
        forceRender
        open={open}
        width={600}
        onOk={() => form.submit()}
        onCancel={() => onCancel()}
        maskClosable={false}
      >
        <div className="float-left mt-24">
          <Form
            form={form}
            name="change-password"
            labelCol={{ span: 11 }}
            wrapperCol={{ span: 30 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Please enter the original password"
              name="old_password"
              rules={[{ required: true, message: "Please enter the original password!" }]}
            >
              <Input.Password
                style={{ width: 300 }}
                autoComplete="off"
                placeholder="Please enter the original password"
              />
            </Form.Item>
            <Form.Item
              label="Enter new password"
              name="new_password"
              rules={[{ required: true, message: "Please enter new password!" }]}
            >
              <Input.Password
                style={{ width: 300 }}
                autoComplete="off"
                placeholder="Please enter new password"
              />
            </Form.Item>
            <Form.Item
              label="Enter the new password again"
              name="again_new_password"
              rules={[{ required: true, message: "Enter the new password again!" }]}
            >
              <Input.Password
                style={{ width: 300 }}
                autoComplete="off"
                placeholder="Enter the new password again"
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};
