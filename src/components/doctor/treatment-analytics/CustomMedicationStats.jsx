import React from 'react';
import { Card, Statistic, Progress, Divider, Typography } from 'antd';
import { FileTextOutlined, SettingOutlined } from '@ant-design/icons';

const { Text } = Typography;

const CustomMedicationStats = ({ customMedicationStats }) => {
  return (
    <Card title="Thuốc tùy chỉnh" className="h-full">
      <Statistic
        title="Tổng điều trị"
        value={customMedicationStats.totalTreatments || 0}
        prefix={<FileTextOutlined />}
      />
      <Divider />
      <Statistic
        title="Có thuốc tùy chỉnh"
        value={customMedicationStats.treatmentsWithCustomMeds || 0}
        prefix={<SettingOutlined />}
      />
      <Divider />
      <Progress
        percent={customMedicationStats.customMedicationUsageRate || 0}
        format={(percent) => `${percent}%`}
        strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068',
        }}
      />
      <Text type="secondary">Tỷ lệ sử dụng thuốc tùy chỉnh</Text>
    </Card>
  );
};

export default CustomMedicationStats;
