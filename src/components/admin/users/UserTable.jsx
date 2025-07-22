import React from 'react';
import { Table, Button, Space, Tag, Popconfirm } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  LockOutlined, 
  UnlockOutlined,
  PlusOutlined,
  MinusCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const UserTable = ({
  users,
  loading,
  pagination,
  onEdit,
  onDelete,
  onToggleStatus,
  onTableChange,
  onOpenPermissions
}) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color;
        if (status === 'ACTIVE') color = 'green';
        else if (status === 'INACTIVE') color = 'volcano';
        else color = 'red';
        return <Tag color={color}>{status ? status.toUpperCase() : 'N/A'}</Tag>;
      },
    },
    {
      title: 'Role',
      dataIndex: ['role', 'name'],
      key: 'role',
      render: (roleName) => <Tag color="blue">{roleName}</Tag>,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      render: (date) => (date ? dayjs(date).format('DD/MM/YYYY HH:mm') : ''),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            type="primary" 
            ghost 
            onClick={() => onEdit(record)} 
          />
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
            placement="left"
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
          <Button
            icon={record.status === 'ACTIVE' ? <LockOutlined /> : <UnlockOutlined />}
            size="small"
            onClick={() => onToggleStatus(record)}
          />
        </Space>
      ),
    },
    {
      title: 'Edit Permission',
      key: 'edit-permission',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<PlusOutlined />}
            size="small"
            onClick={() => onOpenPermissions(record, 'add')}
          />
          <Button
            icon={<MinusCircleOutlined />}
            size="small"
            danger
            onClick={() => onOpenPermissions(record, 'remove')}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={users}
      loading={loading}
      pagination={pagination}
      onChange={onTableChange}
      rowKey="id"
      scroll={{ x: 'max-content' }}
    />
  );
};

export default UserTable;
