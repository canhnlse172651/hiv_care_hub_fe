import React, { useState } from "react";
import { MESSAGE, REGEX } from "@/constant/validate";
import { useDispatch, useSelector } from "react-redux";
import { handleLogin, handleGoogleLogin } from "@/store/Reducer/authReducer";
import { Button, Spin, Form, Input, Checkbox, Divider, Alert } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserMd, faStethoscope } from "@fortawesome/free-solid-svg-icons";

const LoginForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [loginError, setLoginError] = useState(null);

  const onFinish = (values) => {
    setLoginError(null); // Clear previous errors

    // We'll pass a callback for success only, not automatically reloading
    dispatch(
      handleLogin(values, () => {
        form.resetFields();
        // Only reload on successful login
        window.location.reload();
      })
    ).catch((err) => {
      // Set error message from API response
      const errorMessage =
        err?.response?.data?.message ||
        "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.";
      setLoginError(errorMessage);
    });
  };

  const handleGoogleLoginClick = () => {

    console.log('handleGoogleLoginClick')
    setLoginError(null); // Clear previous errors
    dispatch(handleGoogleLogin()).catch((err) => {
      const errorMessage = err?.response?.data?.message || "Không thể khởi tạo đăng nhập Google";
      setLoginError(errorMessage);
    });
  };

  // Form validation rules
  const validationRules = {
    email: [
      { required: true, message: MESSAGE.required },
      { pattern: REGEX.email, message: MESSAGE.email },
    ],
    password: [{ required: true, message: MESSAGE.required }],
  };

  return (
    <div style={{ position: "relative" }}>
      {loading?.login && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.8)",
            zIndex: 10,
            borderRadius: "8px",
          }}
        >
          <Spin size="large" />
        </div>
      )}

      {/* Display API error message */}
      {(loginError || error?.login || error?.googleAuth) && (
        <Alert
          message="Lỗi đăng nhập"
          description={
            loginError ||
            error?.login ||
            error?.googleAuth ||
            "Tài khoản hoặc mật khẩu không đúng"
          }
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
        <Form.Item name="email" rules={validationRules.email} className="mb-5">
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
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
            <a href="#" className="text-blue-500 hover:text-blue-700">
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
          <FontAwesomeIcon icon={faStethoscope} className="mr-2" />
          HIV Care Hub
        </Divider>
        <div className="text-center text-sm">
          <FontAwesomeIcon icon={faUserMd} className="mr-2" />
          Chăm sóc sức khỏe trực tuyến
        </div>

        <Divider>hoặc</Divider>

        <Form.Item className="mb-4">
          <Button
            type="default"
            size="large"
            loading={loading?.googleAuth}
            onClick={handleGoogleLoginClick}
            className="w-full h-12 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg font-semibold flex items-center justify-center transition-all duration-200"
            icon={
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            }
          >
            Đăng nhập với Google
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
