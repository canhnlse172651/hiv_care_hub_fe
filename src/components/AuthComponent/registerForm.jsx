import React, { useState } from "react";
import { MESSAGE, REGEX } from "@/constant/validate";
import { useDispatch, useSelector } from "react-redux";
import { handleRegister } from "@/store/Reducer/authReducer";
import { Button, Spin, Form, Input, Divider, Alert } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined, SafetyOutlined, PhoneOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNotesMedical, faHeartbeat, faHandHoldingMedical } from '@fortawesome/free-solid-svg-icons';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!name) {
      newErrors.name = MESSAGE.required;
    }
    
    // Email validation
    if (!email) {
      newErrors.email = MESSAGE.required;
    } else if (!REGEX.email.test(email)) {
      newErrors.email = MESSAGE.email;
    }
    
    // Phone number validation
    if (!phoneNumber) {
      newErrors.phoneNumber = MESSAGE.required;
    } else if (!REGEX.phone?.test(phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    }
    
    // Password validation
    if (!password) {
      newErrors.password = MESSAGE.required;
    }
    
    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = MESSAGE.required;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = MESSAGE.confirm;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const payload = {
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        password: password,
        confirmPassword: confirmPassword
      };
      
      dispatch(handleRegister(payload));
    }
  };

  return (
    <div className="relative">
      {loading?.register && (
        <div className="absolute inset-0 flex justify-center items-center bg-white/80 z-10 rounded-lg">
          <Spin size="large" />
        </div>
      )}

      <Form
        name="register_form"
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="name"
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name}
          className="mb-4"
        >
          <Input 
            size="large"
            prefix={<IdcardOutlined className="text-medical-primary" />}
            placeholder="Họ và tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          name="email"
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email}
          className="mb-4"
        >
          <Input 
            size="large"
            prefix={<MailOutlined className="text-medical-primary" />}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg"
          />
        </Form.Item>
        
        <Form.Item
          name="phoneNumber"
          validateStatus={errors.phoneNumber ? 'error' : ''}
          help={errors.phoneNumber}
          className="mb-4"
        >
          <Input 
            size="large"
            prefix={<PhoneOutlined className="text-medical-primary" />}
            placeholder="Số điện thoại"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          name="password"
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password}
          className="mb-4"
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

        <Form.Item
          name="confirmPassword"
          validateStatus={errors.confirmPassword ? 'error' : ''}
          help={errors.confirmPassword}
          className="mb-4"
        >
          <Input.Password
            size="large"
            prefix={<SafetyOutlined className="text-medical-primary" />}
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item className="mb-4">
          <Button 
            type="primary" 
            htmlType="submit" 
            className="w-full h-11 text-base font-semibold rounded-lg bg-medical-primary border-medical-primary hover:bg-medical-primary/90 hover:border-medical-primary/90"
            loading={loading?.register}
            icon={<FontAwesomeIcon icon={faHandHoldingMedical} className="mr-2" />}
          >
            ĐĂNG KÝ
          </Button>
        </Form.Item>

        <Divider className="text-medical-text text-sm mb-4">
          <FontAwesomeIcon icon={faHeartbeat} className="mr-2 text-medical-accent" />
          HIV Care Hub
        </Divider>

        <div className="text-xs text-center mt-2 text-medical-text">
          <FontAwesomeIcon icon={faNotesMedical} className="mr-1 text-medical-secondary" />
          Bằng cách đăng ký, bạn đồng ý với <a href="#" className="text-medical-primary hover:underline">Điều khoản sử dụng</a> và <a href="#" className="text-medical-primary hover:underline">Chính sách riêng tư</a> của chúng tôi
        </div>
      </Form>
    </div>
  );
};

export default RegisterForm;