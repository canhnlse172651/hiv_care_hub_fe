import React from 'react';
import { Button, Space, Popconfirm, Tooltip } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  LockOutlined, 
  UnlockOutlined,
  PlusOutlined,
  MinusOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import PropTypes from 'prop-types';

const ActionButtons = ({
  record,
  actions = [],
  size = 'small',
  showTooltips = true,
  ...props
}) => {
  const renderAction = (action) => {
    const {
      type,
      icon,
      onClick,
      confirm,
      confirmTitle,
      confirmText,
      tooltip,
      disabled,
      loading,
      danger = false,
      ...buttonProps
    } = action;

    const button = (
      <Button
        icon={icon}
        size={size}
        onClick={confirm ? undefined : () => onClick?.(record)}
        disabled={disabled}
        loading={loading}
        danger={danger}
        {...buttonProps}
      />
    );

    const wrappedButton = showTooltips && tooltip ? (
      <Tooltip title={tooltip} key={type}>
        {button}
      </Tooltip>
    ) : button;

    if (confirm) {
      return (
        <Popconfirm
          key={type}
          title={confirmTitle || 'Are you sure?'}
          onConfirm={() => onClick?.(record)}
          okText={confirmText?.ok || 'Yes'}
          cancelText={confirmText?.cancel || 'No'}
          placement="left"
        >
          {wrappedButton}
        </Popconfirm>
      );
    }

    return React.cloneElement(wrappedButton, { key: type });
  };

  return (
    <Space size="small" {...props}>
      {actions.map(renderAction)}
    </Space>
  );
};

ActionButtons.propTypes = {
  record: PropTypes.object.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      icon: PropTypes.node,
      onClick: PropTypes.func,
      confirm: PropTypes.bool,
      confirmTitle: PropTypes.string,
      confirmText: PropTypes.shape({
        ok: PropTypes.string,
        cancel: PropTypes.string,
      }),
      tooltip: PropTypes.string,
      disabled: PropTypes.bool,
      loading: PropTypes.bool,
      danger: PropTypes.bool,
    })
  ),
  size: PropTypes.oneOf(['small', 'middle', 'large']),
  showTooltips: PropTypes.bool,
};

// Predefined action types for common operations
export const ActionTypes = {
  VIEW: {
    type: 'view',
    icon: <EyeOutlined />,
    tooltip: 'View Details',
  },
  EDIT: {
    type: 'edit',
    icon: <EditOutlined />,
    tooltip: 'Edit',
  },
  DELETE: {
    type: 'delete',
    icon: <DeleteOutlined />,
    tooltip: 'Delete',
    danger: true,
    confirm: true,
    confirmTitle: 'Are you sure you want to delete this item?',
  },
  TOGGLE_STATUS: {
    type: 'toggle_status',
    icon: <LockOutlined />,
    tooltip: 'Toggle Status',
  },
  UNLOCK: {
    type: 'unlock',
    icon: <UnlockOutlined />,
    tooltip: 'Unlock',
  },
  ADD_PERMISSION: {
    type: 'add_permission',
    icon: <PlusOutlined />,
    tooltip: 'Add Permission',
  },
  REMOVE_PERMISSION: {
    type: 'remove_permission',
    icon: <MinusOutlined />,
    tooltip: 'Remove Permission',
    danger: true,
  },
  CONFIRM: {
    type: 'confirm',
    icon: <CheckOutlined />,
    tooltip: 'Confirm',
    confirm: true,
    confirmTitle: 'Are you sure you want to confirm this?',
  },
  CANCEL: {
    type: 'cancel',
    icon: <CloseOutlined />,
    tooltip: 'Cancel',
    danger: true,
    confirm: true,
    confirmTitle: 'Are you sure you want to cancel this?',
  },
};

export default ActionButtons; 