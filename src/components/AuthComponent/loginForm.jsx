import React, { useState } from "react";
import { MESSAGE, REGEX } from "@/constant/validate";
import { useDispatch, useSelector } from "react-redux";
import { handleLogin } from "@/store/Reducer/authReducer";
import { Button, Spin, Form, Input, Checkbox, Divider } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd, faStethoscope } from '@fortawesome/free-solid-svg-icons';

const LoginForm = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [form] = Form.useForm();

  const onFinish = (values) => {
    dispatch(handleLogin(values, () => {
      form.resetFields();
      // Add page reload after successful login
      setTimeout(() => {
        window.location.reload();
      }, 500); // Short delay to allow token to be stored
    }));
  };

  // Form validation rules
  const validationRules = {
    email: [
      { required: true, message: MESSAGE.required },
      { pattern: REGEX.email, message: MESSAGE.email }
    ],
    password: [
      { required: true, message: MESSAGE.required }
    ]
  };

  return (
    <div style={{ position: 'relative' }}>
      {loading?.login && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.8)',
          zIndex: 10,
          borderRadius: '8px'
        }}>
          <Spin size="large" />
        </div>
      )}
      <Form
        form={form}
        name="login_form"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="on"
      >
        <Form.Item
          name="email"
          rules={validationRules.email}
          className="mb-5"
        >
          <Input
            size="large"
            prefix={<UserOutlined className="text-medical-primary" />}
            placeholder="Email"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={validationRules.password}
          className="mb-5"
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="text-medical-primary" />}
            placeholder="Mật khẩu"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item className="mb-5">
          <div className="flex justify-between items-center">
            <Checkbox className="text-medical-text">Ghi nhớ đăng nhập</Checkbox>
            <a className="text-medical-primary hover:text-medical-secondary transition-colors">
              Quên mật khẩu?
            </a>
          </div>
        </Form.Item>

        <Form.Item className="mb-5">
          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-11 text-base font-semibold rounded-lg bg-medical-primary border-medical-primary hover:bg-medical-secondary hover:border-medical-secondary"
            loading={loading?.login}
            icon={<LoginOutlined />}
          >
            ĐĂNG NHẬP
          </Button>
        </Form.Item>

        <Divider className="text-medical-text text-sm mb-4">
          <FontAwesomeIcon
            icon={faStethoscope}
            className="mr-2 text-medical-accent"
          />
          HIV Care Hub
        </Divider>
        <div className="text-center text-sm text-medical-text">
          <FontAwesomeIcon
            icon={faUserMd}
            className="mr-2 text-medical-secondary"
          />
          Chăm sóc sức khỏe trực tuyến
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;