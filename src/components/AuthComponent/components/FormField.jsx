import React from 'react';
import { Form, Input } from 'antd';
import * as Icons from '@ant-design/icons';
import { MESSAGE, REGEX } from '@/constant/validate';

const FormField = ({ 
  field, 
  form, 
  className = "mb-3",
  size = "middle"
}) => {
  const { name, type, placeholder, icon, required, validation } = field;
  
  // Get icon component
  const IconComponent = Icons[icon];
  
  // Build validation rules
  const buildRules = () => {
    const rules = [];
    
    if (required) {
      rules.push({ required: true, message: MESSAGE.required });
    }
    
    // Add type-specific validation
    if (type === 'email') {
      rules.push({ pattern: REGEX.email, message: MESSAGE.email });
    }
    
    if (type === 'tel' && REGEX.phone) {
      rules.push({ pattern: REGEX.phone, message: "Số điện thoại không hợp lệ" });
    }
    
    // Add custom validation
    if (validation) {
      rules.push(...validation);
    }
    
    return rules;
  };

  const renderInput = () => {
    const inputProps = {
      size,
      prefix: IconComponent ? <IconComponent className="text-gray-400" /> : null,
      placeholder,
      className: "rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:shadow-sm"
    };

    switch (type) {
      case 'password':
        return <Input.Password {...inputProps} />;
      case 'email':
        return <Input {...inputProps} type="email" />;
      case 'tel':
        return <Input {...inputProps} type="tel" />;
      default:
        return <Input {...inputProps} />;
    }
  };

  return (
    <Form.Item
      name={name}
      rules={buildRules()}
      className={className}
    >
      {renderInput()}
    </Form.Item>
  );
};

export default FormField;