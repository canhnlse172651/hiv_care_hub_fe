import React, { useState } from 'react';
import { Form, Button, Divider, Spin, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNotesMedical, faHeartbeat, faHandHoldingMedical } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { handleRegister } from '@/store/Reducer/authReducer';
import { authenService } from '@/services/authenService';
import FormField from './FormField';
import { FORM_FIELDS, AUTH_MESSAGES } from '@/constant/authConfig';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom validation for password confirmation
  const confirmPasswordValidation = [
    { required: true, message: 'Vui lòng xác nhận mật khẩu' },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
      },
    }),
  ];

  const onFinish = async (values) => {
    setIsSubmitting(true);
    
    try {
      const payload = {
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password
      };
      
      const response = await authenService.register(payload);
      
      if (response?.data) {
        message.success(AUTH_MESSAGES.register.success);
        
        // Auto login after successful registration
        dispatch(handleRegister({
          email: values.email,
          password: values.password
        }));
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          AUTH_MESSAGES.register.networkError;
      
      message.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add custom validation to password confirmation field
  const registerFields = FORM_FIELDS.register.map(field => {
    if (field.name === 'confirmPassword') {
      return { ...field, validation: confirmPasswordValidation };
    }
    return field;
  });

  return (
    <div className="relative">
      {(loading?.register || isSubmitting) && (
        <div className="absolute inset-0 flex justify-center items-center bg-white/80 z-10 rounded-lg">
          <Spin size="large" />
        </div>
      )}

      <Form
        form={form}
        name="register_form"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        {/* Render form fields dynamically */}
        {registerFields.map((field) => (
          <FormField 
            key={field.name}
            field={field}
            form={form}
          />
        ))}

        <Form.Item className="mb-4">
          <Button 
            type="primary" 
            htmlType="submit" 
            className="w-full h-11 text-base font-semibold rounded-lg bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600"
            loading={loading?.register || isSubmitting}
            disabled={loading?.register || isSubmitting}
            icon={<FontAwesomeIcon icon={faHandHoldingMedical} className="mr-2" />}
          >
            ĐĂNG KÝ
          </Button>
        </Form.Item>

        <Divider className="text-sm mb-4 text-gray-500">
          <FontAwesomeIcon icon={faHeartbeat} className="mr-2 text-pink-500" />
          HIV Care Hub
        </Divider>

        <div className="text-xs text-center mt-2 text-gray-600">
          <FontAwesomeIcon icon={faNotesMedical} className="mr-1 text-blue-500" />
          Bằng cách đăng ký, bạn đồng ý với{' '}
          <a href="#" className="text-blue-500 hover:text-blue-600 hover:underline transition-colors">Điều khoản sử dụng</a> và{' '}
          <a href="#" className="text-blue-500 hover:text-blue-600 hover:underline transition-colors">Chính sách riêng tư</a> của chúng tôi
        </div>
      </Form>
    </div>
  );
};

export default RegisterForm;