import React from 'react';
import { Modal, Alert } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartbeat, faStethoscope, faHospital } from '@fortawesome/free-solid-svg-icons';
import { AUTH_MESSAGES } from '@/constant/authConfig';

const AuthModal = ({ 
  isOpen, 
  onClose, 
  children, 
  error, 
  onErrorClose,
  modalType 
}) => {
  const getErrorMessage = () => {
    if (!error) return null;
    
    const messages = modalType === 'login' ? AUTH_MESSAGES.login : AUTH_MESSAGES.register;
    return {
      title: messages.error,
      description: error
    };
  };

  const errorInfo = getErrorMessage();

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
      className="auth-modal"
      styles={{
        body: { padding: 0 },
        content: { borderRadius: '12px' }
      }}
    >
      {/* Logo Section */}
      <div className="text-center py-6 px-6 border-b border-gray-100">
        <div className="flex items-center justify-center mb-2">
          <FontAwesomeIcon 
            icon={faHeartbeat} 
            className="mr-3 text-xl text-pink-500"
          />
          <span className="text-xl font-bold text-gray-800">
            Phòng khám GALANT
          </span>
          <FontAwesomeIcon 
            icon={faStethoscope} 
            className="ml-3 text-xl text-blue-500"
          />
        </div>
        
        <div className="text-sm text-gray-600">
          <FontAwesomeIcon icon={faHospital} className="mr-1" />
          Hệ thống chăm sóc và tư vấn sức khỏe
        </div>
      </div>

      {/* Error Alert */}
      {errorInfo && (
        <div className="px-6 py-4">
          <Alert
            message={errorInfo.title}
            description={errorInfo.description}
            type="error"
            showIcon
            icon={<WarningOutlined />}
            closable
            onClose={onErrorClose}
          />
        </div>
      )}

      {/* Content */}
      <div className="px-6 py-6 bg-slate-50">
        {children}
      </div>
    </Modal>
  );
};

export default AuthModal;