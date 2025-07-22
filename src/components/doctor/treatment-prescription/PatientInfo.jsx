import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const PatientInfo = ({ patient }) => {
  if (!patient) return null;

  return (
    <Card className="mb-6">
      <Title level={4}>
        <UserOutlined className="mr-2" />
        Patient Information
      </Title>
      <Row gutter={16}>
        <Col span={8}>
          <Text strong>Name:</Text> {patient.name}
        </Col>
        <Col span={8}>
          <Text strong>Age:</Text> {patient.age} years
        </Col>
        <Col span={8}>
          <Text strong>Gender:</Text> {patient.gender}
        </Col>
      </Row>
      <Row gutter={16} className="mt-2">
        <Col span={12}>
          <Text strong>Diagnosis:</Text> {patient.diagnosis}
        </Col>
        <Col span={12}>
          <Text strong>Last Visit:</Text> {patient.lastVisit}
        </Col>
      </Row>
    </Card>
  );
};

export default PatientInfo;
