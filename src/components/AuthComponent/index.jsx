import React from 'react';
import { useAuthModal } from '@/hooks/useAuthModal';
import { AUTH_MODAL_TYPES } from '@/constant/authConfig';
import { AuthModal, AuthTabs, LoginForm, RegisterForm } from './components';

const AuthComponent = () => {
  const {
    isOpen,
    currentModal,
    authError,
    closeModal,
    switchTab,
    clearError,
    isLoginModal,
    isRegisterModal
  } = useAuthModal();

  // If modal is not shown, don't render anything
  if (!isOpen) return null;

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={closeModal}
      error={authError}
      onErrorClose={clearError}
      modalType={currentModal}
    >
      <AuthTabs
        activeTab={currentModal}
        onTabChange={switchTab}
      >
        {{
          login: <LoginForm />,
          register: <RegisterForm />
        }}
      </AuthTabs>
    </AuthModal>
  );
};

export default AuthComponent;