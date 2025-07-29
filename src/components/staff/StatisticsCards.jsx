import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { 
  ClockCircleOutlined, 
  CheckOutlined, 
  CalendarOutlined 
} from '@ant-design/icons';

const StatisticsCards = ({ 
  pendingAppointments, 
  completedAppointments, 
  filteredAppointments 
}) => {
  return (
    <Row gutter={[24, 24]} className="mb-8">
      <Col xs={24} sm={12} lg={8}>
        <Card className="shadow-lg border-0 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100">
          <Statistic
            title={<span className="text-gray-600 font-medium">Chờ khám</span>}
            value={pendingAppointments.length}
            valueStyle={{ color: '#f59e0b', fontSize: '28px', fontWeight: 'bold' }}
            prefix={<div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"><ClockCircleOutlined className="text-orange-600" /></div>}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <Card className="shadow-lg border-0 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100">
          <Statistic
            title={<span className="text-gray-600 font-medium">Hoàn thành</span>}
            value={completedAppointments.length}
            valueStyle={{ color: '#10b981', fontSize: '28px', fontWeight: 'bold' }}
            prefix={<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><CheckOutlined className="text-green-600" /></div>}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <Card className="shadow-lg border-0 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100">
          <Statistic
            title={<span className="text-gray-600 font-medium">Tổng lịch hẹn</span>}
            value={filteredAppointments.length}
            valueStyle={{ color: '#8b5cf6', fontSize: '28px', fontWeight: 'bold' }}
            prefix={<div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><CalendarOutlined className="text-purple-600" /></div>}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default StatisticsCards; 