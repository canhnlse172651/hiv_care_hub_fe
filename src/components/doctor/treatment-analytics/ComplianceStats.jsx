import React from 'react';
import { Card, Statistic, Tag, Divider } from 'antd';
import { CheckCircleOutlined, WarningOutlined, InfoCircleOutlined } from '@ant-design/icons';

const ComplianceStats = ({ complianceStats }) => {
  return (
    <Card title="Tuân thủ điều trị" className="h-full">
      {complianceStats.patientId ? (
        <>
          <Statistic
            title="Tỷ lệ tuân thủ"
            value={complianceStats.adherence || 0}
            suffix="%"
            prefix={<CheckCircleOutlined />}
            valueStyle={{ 
              color: (complianceStats.adherence || 0) >= 95 ? '#3f8600' : 
                     (complianceStats.adherence || 0) >= 85 ? '#faad14' : '#cf1322'
            }}
          />
          <Divider />
          <Statistic
            title="Liều đã bỏ lỡ"
            value={complianceStats.missedDoses || 0}
            prefix={<WarningOutlined />}
          />
          <Divider />
          <Tag color={
            complianceStats.riskLevel === 'low' ? 'green' :
            complianceStats.riskLevel === 'medium' ? 'orange' : 'red'
          }>
            Mức độ rủi ro: {complianceStats.riskLevel?.toUpperCase()}
          </Tag>
        </>
      ) : (
        <div className="text-center text-gray-500">
          <InfoCircleOutlined className="text-2xl mb-2" />
          <p>Chọn bệnh nhân để xem thống kê tuân thủ</p>
        </div>
      )}
    </Card>
  );
};

export default ComplianceStats;
