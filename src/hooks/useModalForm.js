import { useState, useCallback } from 'react';

/**
 * useModalForm - Reusable hook for modal open/close and editing state
 * @param {object} form - Ant Design form instance (optional)
 * @returns {object} { isOpen, editingItem, openModal, closeModal, setEditingItem, resetForm }
 */
export const useModalForm = (form) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const openModal = useCallback((item = null) => {
    setEditingItem(item);
    setIsOpen(true);
    if (form) {
      if (item) {
        form.setFieldsValue(item);
      } else {
        form.resetFields();
      }
    }
  }, [form]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingItem(null);
    if (form) {
      form.resetFields();
    }
  }, [form]);

  const resetForm = useCallback(() => {
    if (form) form.resetFields();
  }, [form]);

  return {
    isOpen,
    editingItem,
    openModal,
    closeModal,
    setEditingItem,
    resetForm,
  };
}; 