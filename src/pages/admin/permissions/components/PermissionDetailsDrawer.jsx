import React from 'react';
import { 
  Drawer, 
  Descriptions, 
  Button, 
  Space, 
  Tag, 
  Typography, 
  Divider,
  List,
  Avatar
} from 'antd';
import { EditOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const PermissionDetailsDrawer = ({ 
  isOpen, 
  onClose, 
  permission, 
  onEdit,
  getMethodColor
}) => {
  if (!permission) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Drawer
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <FileTextOutlined className="text-blue-600" />
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-800">{permission.name}</div>
            <div className="text-sm text-gray-500">Permission Details</div>
          </div>
        </div>
      }
      placement="right"
      width={600}
      onClose={onClose}
      open={isOpen}
      extra={
        <Button 
          type="primary" 
          icon={<EditOutlined />}
          onClick={onEdit}
        >
          Edit
        </Button>
      }
    >
      <div className="p-4 bg-gray-50 rounded-lg mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Text strong>API Path:</Text>
          <Text code className="text-base">{permission.path}</Text>
        </div>
        <div className="flex items-center gap-2">
          <Text strong>HTTP Method:</Text>
          <Tag color={getMethodColor(permission.method)}>{permission.method}</Tag>
        </div>
      </div>

      <Descriptions 
        bordered 
        column={1} 
        labelStyle={{ fontWeight: 600 }}
        className="mb-8"
      >
        <Descriptions.Item label="Permission ID">{permission.id}</Descriptions.Item>
        <Descriptions.Item label="Description">
          {permission.description || "No description provided"}
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {formatDate(permission.createdAt)}
        </Descriptions.Item>
        {permission.updatedAt && (
          <Descriptions.Item label="Last Updated">
            {formatDate(permission.updatedAt)}
          </Descriptions.Item>
        )}
        {permission.createdById && (
          <Descriptions.Item label="Created By">
            ID: {permission.createdById}
          </Descriptions.Item>
        )}
        {permission.updatedById && (
          <Descriptions.Item label="Updated By">
            ID: {permission.updatedById}
          </Descriptions.Item>
        )}
      </Descriptions>

      <div className="mt-auto pt-8 border-t">
        <Title level={5} className="mb-4">Quick Actions</Title>
        <Space>
          <Button type="primary" onClick={onEdit}>
            Edit Permission
          </Button>
        </Space>
      </div>
    </Drawer>
  );
};

export default PermissionDetailsDrawer;
