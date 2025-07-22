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
  Row,
  Col,
  Statistic
} from 'antd';
import { EditOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const RoleDetailsDrawer = ({ 
  isOpen, 
  onClose, 
  role, 
  onEdit,
  getMethodColor
}) => {
  if (!role) return null;

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
            <UserOutlined className="text-blue-600" />
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-800">{role.name}</div>
            <div className="text-sm text-gray-500">Role Details</div>
          </div>
        </div>
      }
      placement="right"
      width={700}
      onClose={onClose}
      open={isOpen}
      extra={
        <Button 
          type="primary" 
          icon={<EditOutlined />}
          onClick={() => onEdit(role)}
        >
          Edit Role
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <Row gutter={16}>
            <Col span={12}>
              <Statistic title="Role ID" value={role.id} />
            </Col>
            <Col span={12}>
              <Statistic 
                title="Status" 
                value={role.isActive !== false ? 'Active' : 'Inactive'}
                valueStyle={{ 
                  color: role.isActive !== false ? '#3f8600' : '#cf1322' 
                }}
              />
            </Col>
          </Row>
        </div>

        <Descriptions 
          bordered 
          column={1} 
          labelStyle={{ fontWeight: 600 }}
        >
          <Descriptions.Item label="Description">
            {role.description || "No description provided"}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {formatDate(role.createdAt)}
          </Descriptions.Item>
          {role.updatedAt && (
            <Descriptions.Item label="Last Updated">
              {formatDate(role.updatedAt)}
            </Descriptions.Item>
          )}
          {role.createdById && (
            <Descriptions.Item label="Created By">
              User ID: {role.createdById}
            </Descriptions.Item>
          )}
          {role.updatedById && (
            <Descriptions.Item label="Updated By">
              User ID: {role.updatedById}
            </Descriptions.Item>
          )}
        </Descriptions>

        {/* Permissions */}
        <div>
          <Title level={5} className="mb-4">
            Permissions ({role.permissions?.length || 0})
          </Title>
          {role.permissions && role.permissions.length > 0 ? (
            <List
              dataSource={role.permissions}
              renderItem={(permission) => (
                <List.Item className="px-0">
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <div>
                        <Text strong>{permission.name}</Text>
                        <div className="text-xs text-gray-500 mt-1">
                          {permission.description || 'No description'}
                        </div>
                      </div>
                      <Space>
                        <Tag color={getMethodColor(permission.method)}>
                          {permission.method}
                        </Tag>
                        <Text code className="text-xs">
                          {permission.path}
                        </Text>
                      </Space>
                    </div>
                  </div>
                </List.Item>
              )}
              size="small"
              className="border border-gray-200 rounded-lg"
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No permissions assigned to this role
            </div>
          )}
        </div>

        <div className="mt-auto pt-8 border-t">
          <Title level={5} className="mb-4">Quick Actions</Title>
          <Space>
            <Button type="primary" onClick={() => onEdit(role)}>
              Edit Role
            </Button>
          </Space>
        </div>
      </div>
    </Drawer>
  );
};

export default RoleDetailsDrawer;
