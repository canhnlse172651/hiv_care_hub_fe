import React from 'react';
import { Table, Button, Space, Tag, Typography, Popconfirm } from 'antd';
import { 
  EyeOutlined, // changed from CheckOutlined
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const PermissionTable = ({ 
  permissions, 
  loading, 
  onView, 
  onEdit, 
  onDelete, 
  getMethodColor 
}) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <a onClick={() => onView(record)}>{text || 'N/A'}</a>,
      sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
    },
    {
      title: 'Path',
      dataIndex: 'path',
      key: 'path',
      render: (text) => <Text code>{text || 'N/A'}</Text>,
      sorter: (a, b) => (a.path || '').localeCompare(b.path || ''),
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      render: (text) => (
        text ? <Tag color={getMethodColor(text)}>{text}</Tag> : <Tag>N/A</Tag>
      ),
      sorter: (a, b) => (a.method || '').localeCompare(b.method || ''),
      filters: [
        {value: 'GET', text: 'GET'},
        {value: 'POST', text: 'POST'},
        {value: 'PUT', text: 'PUT'},
        {value: 'DELETE', text: 'DELETE'}
      ],
      onFilter: (value, record) => record.method === value,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => text || 'No description',
      sorter: (a, b) => (a.description || '').localeCompare(b.description || ''),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 220,
      render: (_, record) => (
        <Space size="small">
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => onView(record)}
            size="small"
          />
          <Button 
            icon={<EditOutlined />} 
            onClick={() => onEdit(record)} 
            size="small"
            type="primary"
          />
          <Popconfirm
            title="Delete this permission?"
            description="Are you sure you want to delete this permission? This action cannot be undone."
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              icon={<DeleteOutlined />} 
              danger
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    }
  ];

  return (
    <Table 
      dataSource={permissions} 
      columns={columns}
      rowKey="id"
      loading={loading}
      pagination={{ 
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} permissions`
      }}
      size="middle"
    />
  );
};

export default PermissionTable;
