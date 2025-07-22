import React from 'react';
import { Card, Table, Alert, Button, Space, Tag, Badge } from 'antd';

const ViolationsTable = ({ violations, onPatientComplianceCheck }) => {
  const violationsColumns = [
    {
      title: 'Bệnh nhân ID',
      dataIndex: 'patientId',
      key: 'patientId',
      render: (id) => `PT-${id.toString().padStart(6, '0')}`
    },
    {
      title: 'Số điều trị đang hoạt động',
      dataIndex: 'activeTreatmentCount',
      key: 'activeTreatmentCount',
      render: (count) => <Badge count={count} style={{ backgroundColor: count > 1 ? '#ff4d4f' : '#52c41a' }} />
    },
    {
      title: 'Phác đồ',
      dataIndex: 'protocols',
      key: 'protocols',
      render: (protocols) => (
        <Space>
          {protocols.map((protocol, index) => (
            <Tag key={index} color="blue">{protocol}</Tag>
          ))}
        </Space>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          size="small"
          onClick={() => onPatientComplianceCheck(record.patientId)}
        >
          Kiểm tra
        </Button>
      )
    }
  ];

  if (!violations) return null;

  return (
    <Card title="Vi phạm quy tắc kinh doanh" className="mb-6">
      <Alert
        message={`Phát hiện ${violations.totalViolations || 0} vi phạm quy tắc`}
        description="Các bệnh nhân có nhiều hơn một điều trị đang hoạt động"
        type="warning"
        showIcon
        className="mb-4"
      />
      
      <Table
        columns={violationsColumns}
        dataSource={violations.violatingPatients || []}
        rowKey="patientId"
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default ViolationsTable;
