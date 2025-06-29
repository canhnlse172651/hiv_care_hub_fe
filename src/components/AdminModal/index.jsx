import React from 'react';
import { Modal, Form, Button, Space } from 'antd';
import PropTypes from 'prop-types';

const AdminModal = ({
  title,
  open,
  onCancel,
  onOk,
  children,
  loading = false,
  okText = 'Save',
  cancelText = 'Cancel',
  width = 600,
  centered = true,
  destroyOnClose = true,
  maskClosable = false,
  showFooter = true,
  customFooter,
  ...modalProps
}) => {
  const defaultFooter = showFooter ? [
    <Button key="cancel" onClick={onCancel} disabled={loading}>
      {cancelText}
    </Button>,
    <Button key="submit" type="primary" onClick={onOk} loading={loading}>
      {okText}
    </Button>,
  ] : null;

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      width={width}
      centered={centered}
      destroyOnClose={destroyOnClose}
      maskClosable={maskClosable}
      footer={customFooter || defaultFooter}
      {...modalProps}
    >
      {children}
    </Modal>
  );
};

AdminModal.propTypes = {
  title: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  loading: PropTypes.bool,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  centered: PropTypes.bool,
  destroyOnClose: PropTypes.bool,
  maskClosable: PropTypes.bool,
  showFooter: PropTypes.bool,
  customFooter: PropTypes.node,
};

export default AdminModal; 