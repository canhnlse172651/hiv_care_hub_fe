import React from 'react';
import { Card, Progress, Row, Col, Typography } from 'antd';
import { FileTextOutlined, EditOutlined, CheckOutlined, PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { title: 'Protocol Selection', icon: <FileTextOutlined /> },
    { title: 'Customization', icon: <EditOutlined /> },
    { title: 'Validation', icon: <CheckOutlined /> },
    { title: 'Create Treatment', icon: <PlusOutlined /> }
  ];

  return (
    <Card className="mb-6">
      <Progress
        percent={(currentStep / steps.length) * 100}
        format={() => `Step ${currentStep} of ${steps.length}`}
        strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068',
        }}
      />
      <Row gutter={16} className="mt-4">
        {steps.map((step, index) => (
          <Col span={6} key={index}>
            <div className={`text-center ${index < currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className="text-xl mb-2">{step.icon}</div>
              <Text strong={index < currentStep}>{step.title}</Text>
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default StepIndicator;
