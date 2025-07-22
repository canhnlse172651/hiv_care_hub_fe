import React from 'react';
import { Card, Row, Col } from 'antd';
import { MedicineBoxOutlined, TeamOutlined } from '@ant-design/icons';

const RegimensStats = ({ protocols }) => {
  return (
    <Row gutter={[24, 24]} className="mb-8">
      <Col xs={24} sm={8}>
        <Card className="shadow-lg border-0 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MedicineBoxOutlined className="text-blue-600 text-xl" />
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">{protocols.length}</div>
            <div className="text-gray-600 font-medium">Tổng phác đồ</div>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card className="shadow-lg border-0 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100">
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TeamOutlined className="text-green-600 text-xl" />
            </div>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {protocols.filter(p => p.targetDisease === 'HIV').length}
            </div>
            <div className="text-gray-600 font-medium">Phác đồ HIV</div>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card className="shadow-lg border-0 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MedicineBoxOutlined className="text-purple-600 text-xl" />
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {protocols.filter(p => p.targetDisease === 'AIDS').length}
            </div>
            <div className="text-gray-600 font-medium">Phác đồ AIDS</div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default RegimensStats;
