import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const AppointmentStats = ({ upcomingAppointments, completedAppointments }) => {
  return (
    <Row gutter={[24, 24]} className="mb-8">
      <Col xs={24} sm={12}>
        <Card 
          bordered={false} 
          className="shadow-lg rounded-xl border-0 overflow-hidden"
          bodyStyle={{ padding: '24px' }}
        >
          <Statistic
            title={<span className="text-gray-600 font-medium">Lịch hẹn sắp tới</span>}
            value={upcomingAppointments}
            prefix={<ClockCircleOutlined className="text-orange-500" />}
            valueStyle={{ color: '#f59e0b', fontSize: '32px', fontWeight: 'bold' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12}>
        <Card 
          bordered={false} 
          className="shadow-lg rounded-xl border-0 overflow-hidden"
          bodyStyle={{ padding: '24px' }}
        >
          <Statistic
            title={<span className="text-gray-600 font-medium">Đã hoàn thành</span>}
            value={completedAppointments}
            prefix={<CheckCircleOutlined className="text-green-500" />}
            valueStyle={{ color: '#10b981', fontSize: '32px', fontWeight: 'bold' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default AppointmentStats;
