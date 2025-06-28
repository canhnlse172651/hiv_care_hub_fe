import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { handleCloseModal, handleShowModal } from '@/store/Reducer/authReducer';
import { AUTH_MODAL_TYPES } from '@/constant/authConfig';

export const useAuthModal = () => {
  const dispatch = useDispatch();
  const { showModal, error, loading } = useSelector((state) => state.auth);
  const [authError, setAuthError] = useState(null);

  // Monitor error changes from Redux state
  useEffect(() => {
    if (error?.login) {
      let errorMessage = error.login;
      
      // Handle structured error objects
      if (typeof error.login === 'object' && error.login?.message?.message) {
        errorMessage = error.login.message.message;
      }
      
      setAuthError(errorMessage);
    } else {
      setAuthError(null);
    }
  }, [error]);

  const openModal = useCallback((modalType) => {
    setAuthError(null); // Clear error when opening modal
    dispatch(handleShowModal(modalType));
  }, [dispatch]);

  const closeModal = useCallback(() => {
    setAuthError(null); // Clear error when closing modal
    dispatch(handleCloseModal());
  }, [dispatch]);

  const switchTab = useCallback((modalType) => {
    setAuthError(null); // Clear error on tab change
    dispatch(handleShowModal(modalType));
  }, [dispatch]);

  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  return {
    // State
    isOpen: !!showModal,
    currentModal: showModal,
    authError,
    loading,
    
    // Actions
    openLogin: () => openModal(AUTH_MODAL_TYPES.LOGIN),
    openRegister: () => openModal(AUTH_MODAL_TYPES.REGISTER),
    closeModal,
    switchTab,
    clearError,
    
    // Computed
    isLoginModal: showModal === AUTH_MODAL_TYPES.LOGIN,
    isRegisterModal: showModal === AUTH_MODAL_TYPES.REGISTER
  };
}; 