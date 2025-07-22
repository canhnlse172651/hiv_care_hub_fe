import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Button, message } from 'antd';
import { adminService } from '@/services/adminService';
import useQuery from '@/hooks/useQuery';

const { Option } = Select;

const UserPermissionSelectorModal = ({ visible, onCancel, user, action }) => {
  const [form] = Form.useForm();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    data: permissionsData,
    refetch: refetchPermissions,
  } = useQuery(() => adminService.getPermissions(), {
    enabled: visible,
  });

  useEffect(() => {
    if (permissionsData) {
      setPermissions(permissionsData.data || []);
    }
  }, [permissionsData]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (action === 'add') {
        await adminService.addUserPermissions(user.id, values.permissions);
        message.success('Permissions added successfully');
      } else if (action === 'remove') {
        await adminService.removeUserPermissions(user.id, values.permissions);
        message.success('Permissions removed successfully');
      }
      onCancel(true);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update permissions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={action === 'add' ? 'Add Permissions' : 'Remove Permissions'}
      visible={visible}
      onCancel={() => onCancel(false)}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="permissions"
          label="Permissions"
          rules={[{ required: true, message: 'Please select permissions' }]}
        >
          <Select
            mode="multiple"
            placeholder="Select permissions"
            options={permissions.map(permission => ({
              label: permission.name,
              value: permission.id,
            }))}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleOk} loading={loading}>
            {action === 'add' ? 'Add Permissions' : 'Remove Permissions'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserPermissionSelectorModal;