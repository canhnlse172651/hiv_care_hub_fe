import React from 'react';
import { Tag } from 'antd';
import PropTypes from 'prop-types';

const StatusTag = ({ status, type = 'default', showIcon = false, ...props }) => {
  const getStatusConfig = (status, type) => {
    // Handle null, undefined, string, and boolean status values
    if (status === null || status === undefined) {
      return { color: 'default', text: 'N/A' };
    }
    
    const statusLower = typeof status === 'string' ? status.toLowerCase() : status;
    
    if (type === 'user') {
      switch (statusLower) {
        case 'active':
          return { color: 'success', text: 'Active' };
        case 'inactive':
          return { color: 'error', text: 'Inactive' };
        default:
          return { color: 'default', text: status || 'N/A' };
      }
    }
    
    if (type === 'appointment') {
      switch (statusLower) {
        case 'pending':
          return { color: 'processing', text: 'Pending' };
        case 'confirmed':
          return { color: 'blue', text: 'Confirmed' };
        case 'completed':
          return { color: 'success', text: 'Completed' };
        case 'cancelled':
          return { color: 'error', text: 'Cancelled' };
        default:
          return { color: 'default', text: status || 'N/A' };
      }
    }
    
    if (type === 'role') {
      switch (statusLower) {
        case 'active':
        case true:
          return { color: 'success', text: 'Active' };
        case 'inactive':
        case false:
          return { color: 'error', text: 'Inactive' };
        default:
          return { color: 'default', text: status ? 'Active' : 'Inactive' };
      }
    }
    
    if (type === 'doctor') {
      switch (statusLower) {
        case 'available':
        case true:
          return { color: 'success', text: 'Available' };
        case 'unavailable':
        case false:
          return { color: 'error', text: 'Unavailable' };
        default:
          return { color: 'default', text: status ? 'Available' : 'Unavailable' };
      }
    }
    
    // Default status mapping
    switch (statusLower) {
      case 'active':
      case 'success':
      case 'completed':
      case true:
        return { color: 'success', text: 'Active' };
      case 'inactive':
      case 'error':
      case 'cancelled':
      case false:
        return { color: 'error', text: 'Inactive' };
      case 'pending':
      case 'processing':
        return { color: 'processing', text: 'Pending' };
      default:
        return { color: 'default', text: status || 'N/A' };
    }
  };

  const config = getStatusConfig(status, type);

  return (
    <Tag color={config.color} {...props}>
      {config.text}
    </Tag>
  );
};

StatusTag.propTypes = {
  status: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  type: PropTypes.oneOf(['default', 'user', 'appointment', 'role', 'doctor']),
  showIcon: PropTypes.bool,
};

export default StatusTag; 