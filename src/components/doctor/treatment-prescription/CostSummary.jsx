import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { DollarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const CostSummary = ({ costSummary }) => {
  if (!costSummary) return null;

  return (
    <Card className="mb-6">
      <Title level={4}>
        <DollarOutlined className="mr-2" />
        Cost Summary
      </Title>
      <Row gutter={16}>
        <Col span={8}>
          <Text strong>Total Cost:</Text>
          <div className="text-lg font-bold text-green-600">
            ${costSummary.totalCost?.toFixed(2)}
          </div>
        </Col>
        <Col span={8}>
          <Text strong>Duration:</Text>
          <div className="text-lg">{costSummary.duration} days</div>
        </Col>
        <Col span={8}>
          <Text strong>Medicines:</Text>
          <div className="text-lg">{costSummary.medicineCount} items</div>
        </Col>
      </Row>
    </Card>
  );
};

export default CostSummary;
