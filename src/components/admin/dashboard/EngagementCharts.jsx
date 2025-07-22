import React from 'react';
import { Row, Col, Card, Progress } from 'antd';

const EngagementCharts = () => {
  return (
    <Row gutter={[16, 16]} className="mt-6">
      <Col xs={24} md={12}>
        <Card title="User Engagement">
          <div className="mb-4">
            <div className="flex justify-between">
              <span>Forum Activity</span>
              <span>78%</span>
            </div>
            <Progress percent={78} status="active" />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between">
              <span>Test Appointments</span>
              <span>45%</span>
            </div>
            <Progress percent={45} status="active" />
          </div>
          
          <div>
            <div className="flex justify-between">
              <span>Pharmacy Orders</span>
              <span>32%</span>
            </div>
            <Progress percent={32} status="active" />
          </div>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card title="User Distribution">
          <div className="mb-4">
            <div className="flex justify-between">
              <span>New Users</span>
              <span>24%</span>
            </div>
            <Progress percent={24} strokeColor="#1890ff" />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between">
              <span>Returning Users</span>
              <span>56%</span>
            </div>
            <Progress percent={56} strokeColor="#52c41a" />
          </div>
          
          <div>
            <div className="flex justify-between">
              <span>Healthcare Providers</span>
              <span>20%</span>
            </div>
            <Progress percent={20} strokeColor="#722ed1" />
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default EngagementCharts;
