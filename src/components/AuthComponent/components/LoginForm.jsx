import React from 'react';
import { Form, Button, Checkbox, Divider, Spin } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd, faStethoscope } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { handleLogin } from '@/store/Reducer/authReducer';
import FormField from './FormField';
import { FORM_FIELDS, AUTH_MESSAGES } from '@/constant/authConfig';

const LoginForm = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [form] = Form.useForm();

  const onFinish = (values) => {
    dispatch(handleLogin(values, () => {
      form.resetFields();
      window.location.reload();
    }));
  };

  return (
    <div className="relative">
      {loading?.login && (
        <div className="absolute inset-0 flex justify-center items-center bg-white/80 z-10 rounded-lg">
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
        {/* Render form fields dynamically */}
        {FORM_FIELDS.login.map((field) => (
          <FormField 
            key={field.name}
            field={field}
            form={form}
          />
        ))}

        <Form.Item className="mb-5">
          <div className="flex justify-between items-center">
            <Checkbox className="text-sm">Ghi nhớ đăng nhập</Checkbox>
            <a href="#" className="text-blue-500 hover:text-blue-600 hover:underline text-sm transition-colors">
              Quên mật khẩu?
            </a>
          </div>
        </Form.Item>

        <Form.Item className="mb-5">
          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-11 text-base font-semibold rounded-lg bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600"
            loading={loading?.login}
            icon={<LoginOutlined />}
          >
            ĐĂNG NHẬP
          </Button>
        </Form.Item>

        <Divider className="text-sm mb-4 text-gray-500">
          <FontAwesomeIcon icon={faStethoscope} className="mr-2 text-blue-500" />
          HIV Care Hub
        </Divider>
        
        <div className="text-center text-sm text-gray-600">
          <FontAwesomeIcon icon={faUserMd} className="mr-2 text-blue-500" />
          Chăm sóc sức khỏe trực tuyến
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;