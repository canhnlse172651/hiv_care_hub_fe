import React, { useState, useEffect } from 'react';
import { Modal, Select, Button, message, Spin, Alert } from 'antd';
import { adminService } from '@/services/adminService';

const { Option } = Select;

const UserPermissionsModal = ({ visible, onCancel, user, action }) => {
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visible && user) {
      fetchPermissions();
    } else {
      setSelectedPermissions([]);
    }
  }, [visible, user]);

  const fetchPermissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getPermissions({ limit: 1000 });
      const allPermissions = response.data?.data?.data || [];
      setPermissions(allPermissions);
    } catch (err) {
      console.error("Error fetching permissions:", err);
      setError('Failed to load permission data. Please try again.');
      message.error('Failed to load permission data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (selectedPermissions.length === 0) {
      message.warn('Please select at least one permission.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (action === 'add') {
        await adminService.addPermissionsToUser(user.id, { permissions: selectedPermissions });
        message.success("Permissions added successfully!");
      } else if (action === 'remove') {
        await adminService.removePermissionsFromUser(user.id, { permissions: selectedPermissions });
        message.success("Permissions removed successfully!");
      }
      onCancel(); 
    } catch (err) {
      console.error(`Error ${action}ing user permissions:`, err);
      setError(`Failed to ${action} permissions. Please try again.`);
      message.error(err.response?.data?.message || `Failed to ${action} permissions.`);
    } finally {
      setSaving(false);
    }
  };

  const modalTitle = action === 'add' 
    ? `Add Permissions for ${user?.fullName || 'User'}` 
    : `Remove Permissions for ${user?.fullName || 'User'}`;
  
  const buttonText = action === 'add' ? 'Add' : 'Remove';

  return (
    <Modal
      title={modalTitle}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={saving} onClick={handleSave} disabled={loading || selectedPermissions.length === 0} danger={action === 'remove'}>
          {buttonText}
        </Button>,
      ]}
      width={700}
      destroyOnClose
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert message="Error" description={error} type="error" showIcon />
      ) : (
        <>
          <p>Select permissions to {action}.</p>
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Please select permissions"
            value={selectedPermissions}
            onChange={setSelectedPermissions}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {permissions.map(permission => (
              <Option key={permission.id} value={permission.id}>
                {permission.name}
              </Option>
            ))}
          </Select>
        </>
      )}
    </Modal>
  );
};

export default UserPermissionsModal; 