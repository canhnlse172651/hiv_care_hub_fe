import React from 'react';
import {
  Drawer,
  Button,
  Typography,
  Tag,
  Badge,
  Space
} from 'antd';
import { EditOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const RoleDetailsDrawer = ({ 
  isOpen, 
  onClose, 
  role, 
  onEdit,
  getMethodColor
}) => {
  if (!role) return null;

  return (
    <Drawer
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <UserOutlined className="text-blue-600" />
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-800">{role?.name}</div>
            <div className="text-sm text-gray-500">Role Details</div>
          </div>
        </div>
      }
      placement="right"
      width={600}
      onClose={onClose}
      open={isOpen}
      extra={
        role && (
          <Button 
            icon={<EditOutlined />} 
            onClick={() => {
              onClose();
              onEdit(role);
            }}
            className="rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            Edit Role
          </Button>
        )
      }
      className="drawer-custom"
    >
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <Title level={4} className="!mb-4 text-gray-800">Role Information</Title>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
              <Text className="font-medium text-gray-600">ID</Text>
              <Text className="text-gray-800">{role.id}</Text>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
              <Text className="font-medium text-gray-600">Name</Text>
              <Text className="text-gray-800 font-semibold">{role.name}</Text>
            </div>
            <div className="flex items-start justify-between py-2 border-b border-gray-200 last:border-b-0">
              <Text className="font-medium text-gray-600">Description</Text>
              <Text className="text-gray-800 text-right max-w-xs">{role.description}</Text>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
              <Text className="font-medium text-gray-600">Status</Text>
              <Tag color={role.isActive !== false ? 'success' : 'error'}>
                {role.isActive !== false ? 'Active' : 'Inactive'}
              </Tag>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
              <Text className="font-medium text-gray-600">Created</Text>
              <Text className="text-gray-800">{new Date(role.createdAt).toLocaleDateString()}</Text>
            </div>
            <div className="flex items-center justify-between py-2">
              <Text className="font-medium text-gray-600">Updated</Text>
              <Text className="text-gray-800">{new Date(role.updatedAt).toLocaleDateString()}</Text>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <Title level={4} className="!mb-0 text-gray-800">Permissions</Title>
            <Badge 
              count={role.permissions?.length || 0} 
              className="bg-blue-500 text-white rounded-full px-2 py-1 text-sm"
            />
          </div>
          
          {role.permissions && role.permissions.length > 0 ? (
            <div className="space-y-3">
              {role.permissions.map(permission => (
                <div key={permission.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <KeyOutlined className="text-blue-600 text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag color={getMethodColor(permission.method)} className="font-medium">
                          {permission.method || 'N/A'}
                        </Tag>
                        <Text className="font-semibold text-gray-800 truncate">{permission.name}</Text>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide">Path:</Text>
                          <Text className="text-sm text-gray-700 font-mono bg-gray-100 px-2 py-1 rounded">
                            {permission.path || 'N/A'}
                          </Text>
                        </div>
                        <div className="flex items-start gap-2">
                          <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description:</Text>
                          <Text className="text-sm text-gray-700">{permission.description || 'No description available'}</Text>
                        </div>
                        {permission.createdAt && (
                          <div className="flex items-center gap-2">
                            <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide">Created:</Text>
                            <Text className="text-sm text-gray-600">{new Date(permission.createdAt).toLocaleDateString()}</Text>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <KeyOutlined className="text-gray-400 text-xl" />
              </div>
              <Text type="secondary" className="text-gray-500">No permissions assigned to this role.</Text>
              <div className="mt-2">
                <Button 
                  type="link" 
                  onClick={() => {
                    onClose();
                    onEdit(role);
                  }}
                >
                  Add permissions to this role
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default RoleDetailsDrawer;
