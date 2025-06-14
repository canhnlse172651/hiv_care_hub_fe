import React, { useState } from "react";
import { MESSAGE, REGEX } from "@/constant/validate";
import { useDispatch, useSelector } from "react-redux";
import { handleLogin } from "@/store/Reducer/authReducer";
import { Button, Spin, Form, Input, Checkbox, Divider, Alert } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd, faStethoscope } from '@fortawesome/free-solid-svg-icons';

const LoginForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [loginError, setLoginError] = useState(null);

  const onFinish = (values) => {
    setLoginError(null); // Clear previous errors
    
    // We'll pass a callback for success only, not automatically reloading
    dispatch(handleLogin(values, () => {
      form.resetFields();
      // Only reload on successful login
      window.location.reload();
    })).catch((err) => {
      // Set error message from API response
      const errorMessage = err?.response?.data?.message || 
                          "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.";
      setLoginError(errorMessage);
    });
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
      
      {/* Display API error message */}
      {(loginError || error?.login) && (
        <Alert
          message="Lỗi đăng nhập"
          description={loginError || (typeof error?.login === 'string' ? error.login : "Tài khoản hoặc mật khẩu không đúng")}
          type="error"
          showIcon
          closable
          className="mb-4"
          onClose={() => setLoginError(null)}
        />
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
            prefix={<UserOutlined />}
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
            prefix={<LockOutlined />}
            placeholder="Mật khẩu"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item className="mb-5">
          <div className="flex justify-between items-center">
            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            <a href="#" className="text-blue-500 hover:underline">
              Quên mật khẩu?
            </a>
          </div>
        </Form.Item>

        <Form.Item className="mb-5">
          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-11 text-base font-semibold rounded-lg"
            loading={loading?.login}
            icon={<LoginOutlined />}
          >
            ĐĂNG NHẬP
          </Button>
        </Form.Item>

        <Divider className="text-sm mb-4">
          <FontAwesomeIcon
            icon={faStethoscope}
            className="mr-2"
          />
          HIV Care Hub
        </Divider>
        <div className="text-center text-sm">
          <FontAwesomeIcon
            icon={faUserMd}
            className="mr-2"
          />
          Chăm sóc sức khỏe trực tuyến
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;