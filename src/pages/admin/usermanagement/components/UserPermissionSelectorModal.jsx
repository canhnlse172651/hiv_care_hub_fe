import React, { useState, useEffect } from 'react';
import { Modal, Button, message, Spin, Alert } from 'antd';
import { adminService } from '@/services/adminService';
import PermissionSelector from '@/pages/admin/roles/components/PermissionSelector';

const UserPermissionSelectorModal = ({ visible, onCancel, user, action }) => {
  const [allPermissions, setAllPermissions] = useState([]);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visible) {
      fetchPermissions();
    } else {
      // Reset state when modal is not visible
      setSelectedPermissionIds([]);
    }
  }, [visible]);

  const fetchPermissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getPermissions({ limit: 1000 });
      setAllPermissions(response.data?.data?.data || []);
    } catch (err) {
      console.error("Error fetching permissions:", err);
      setError('Failed to load permission data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (selectedPermissionIds.length === 0) {
      message.warn('Please select at least one permission.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (action === 'add') {
        await adminService.addPermissionsToUser(user.id, { permissions: selectedPermissionIds });
        message.success("Permissions added successfully!");
      } else if (action === 'remove') {
        await adminService.removePermissionsFromUser(user.id, { permissions: selectedPermissionIds });
        message.success("Permissions removed successfully!");
      }
      onCancel(true); // Pass true to indicate a refresh is needed
    } catch (err) {
      console.error(`Error ${action}ing permissions:`, err);
      setError(`Failed to ${action} permissions. Please try again.`);
      message.error(err.response?.data?.message || `Failed to ${action} permissions.`);
    } finally {
      setSaving(false);
    }
  };

  const modalTitle = action === 'add' 
    ? `Add Permissions for ${user?.fullName}` 
    : `Remove Permissions for ${user?.fullName}`;

  const buttonText = action === 'add' ? 'Add Permissions' : 'Remove Permissions';

  return (
    <Modal
      title={modalTitle}
      visible={visible}
      onCancel={() => onCancel(false)}
      footer={[
        <Button key="back" onClick={() => onCancel(false)}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={saving} 
          onClick={handleSave} 
          disabled={loading || selectedPermissionIds.length === 0}
          danger={action === 'remove'}
        >
          {buttonText}
        </Button>,
      ]}
      width={900}
      destroyOnClose
    >
      {loading ? (
        <div className="text-center py-20">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert message="Error" description={error} type="error" showIcon />
      ) : (
        <PermissionSelector
          permissions={allPermissions}
          value={selectedPermissionIds}
          onChange={setSelectedPermissionIds}
        />
      )}
    </Modal>
  );
};

export default UserPermissionSelectorModal; 