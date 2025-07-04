import React from 'react';
import { Steps } from 'antd';
import { MedicineBoxOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { ServiceType } from '@/constant/general';

const ProgressSteps = ({ currentStep, selectedService }) => {
  const steps = [
    {
      title: 'Chọn dịch vụ',
      icon: <MedicineBoxOutlined />,
    },
    {
      title: 'Chọn ngày giờ',
      icon: <CalendarOutlined />,
    },
  ];

  // Only add doctor selection step for non-CONSULT services
  if (selectedService?.type !== ServiceType.CONSULT) {
    steps.push({
      title: 'Chọn bác sĩ',
      icon: <UserOutlined />,
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Steps 
        current={currentStep} 
        items={steps}
        className="mb-8"
        size="default"
      />
    </div>
  );
};

export default ProgressSteps;
