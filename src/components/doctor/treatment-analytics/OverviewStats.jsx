import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { FileTextOutlined, MedicineBoxOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons';

const OverviewStats = ({ generalStats }) => {
  return (
    <Row gutter={16} className="mb-6">
      <Col span={6}>
        <Card>
          <Statistic
            title="Tổng số điều trị"
            value={generalStats.totalTreatments || 0}
            prefix={<FileTextOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Đang điều trị"
            value={generalStats.activeTreatments || 0}
            prefix={<MedicineBoxOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Tổng bệnh nhân"
            value={generalStats.totalPatients || 0}
            prefix={<UserOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Tổng chi phí"
            value={generalStats.totalCost || 0}
            prefix={<DollarOutlined />}
            formatter={(value) => `${value?.toLocaleString()} VNĐ`}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default OverviewStats;
