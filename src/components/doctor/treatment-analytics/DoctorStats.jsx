import React from 'react';
import { Card, Statistic, Divider } from 'antd';
import { FileTextOutlined, MedicineBoxOutlined, UserOutlined, BarChartOutlined } from '@ant-design/icons';

const DoctorStats = ({ doctorStats }) => {
  return (
    <Card title="Thống kê bác sĩ" className="h-full">
      <Statistic
        title="Tổng điều trị của bác sĩ"
        value={doctorStats.totalTreatments || 0}
        prefix={<FileTextOutlined />}
      />
      <Divider />
      <Statistic
        title="Đang điều trị"
        value={doctorStats.activeTreatments || 0}
        prefix={<MedicineBoxOutlined />}
        valueStyle={{ color: '#3f8600' }}
      />
      <Divider />
      <Statistic
        title="Bệnh nhân duy nhất"
        value={doctorStats.uniquePatients || 0}
        prefix={<UserOutlined />}
      />
      <Divider />
      <Statistic
        title="TB điều trị/bệnh nhân"
        value={doctorStats.averageTreatmentsPerPatient || 0}
        precision={1}
        prefix={<BarChartOutlined />}
      />
    </Card>
  );
};

export default DoctorStats;
