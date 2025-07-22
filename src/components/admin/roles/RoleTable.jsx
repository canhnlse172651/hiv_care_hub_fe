import React from 'react';
import { Table, Button, Space, Tag, Typography, Popconfirm, Badge } from 'antd';
import { 
  InfoCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const RoleTable = ({ 
  roles, 
  meta,
  loading, 
  onView, 
  onEdit, 
  onDelete,
  onMetaChange
}) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <Space>
          <UserOutlined />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive !== false ? 'success' : 'error'}>
          {isActive !== false ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions) => (
        <Space>
          <Badge count={permissions?.length || 0} color="blue" />
          <Text>permissions</Text>
        </Space>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<InfoCircleOutlined />}
            size="small"
            onClick={() => onView(record)}
          />
          <Button
            icon={<EditOutlined />}
            size="small"
            type="primary"
            ghost
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this role?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
            disabled={loading.delete === record.id}
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              loading={loading.delete === record.id}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <Table
        columns={columns}
        dataSource={Array.isArray(roles) ? roles : []}
        loading={loading.table}
        rowKey={record => record.id}
        pagination={{
          current: meta.page,
          pageSize: meta.limit,
          total: meta.total,
          onChange: (page, pageSize) => onMetaChange({ page, limit: pageSize }),
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} roles`,
          className: "px-4 py-3"
        }}
        className="w-full"
        rowClassName="hover:bg-gray-50 transition-colors"
      />
    </div>
  );
};

export default RoleTable;
