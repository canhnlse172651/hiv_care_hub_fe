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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = MESSAGE.required;
    } else if (!REGEX.email.test(email)) {
      newErrors.email = MESSAGE.email;
    }

    // Password validation
    if (!password) {
      newErrors.password = MESSAGE.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      dispatch(handleLogin({ email, password }));
    }
  };

  return (
    <div className="relative">
      {loading?.login && (
        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80 z-10 rounded-lg">
          <Spin size="large" />
        </div>
      )}
      <Form
        name="login_form"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
        autoComplete="on"
      >
        <Form.Item
          name="email"
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email}
          className="mb-5"
        >
          <Input
            size="large"
            prefix={<UserOutlined className="text-medical-primary" />}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          name="password"
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password}
          className="mb-5"
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="text-medical-primary" />}
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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