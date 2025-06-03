import React, { useState } from 'react';
import { MODAL_TYPE } from "@/constant/general";
import LoginForm from "./loginForm";
import RegisterForm from "./registerForm";
import { useSelector, useDispatch } from "react-redux";
import { handleCloseModal, handleShowModal } from "@/store/Reducer/authReducer";
import { CloseOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartbeat, faStethoscope, faHospital, faUserMd } from '@fortawesome/free-solid-svg-icons';

const AuthComponent = () => {
  const { showModal } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isCloseHovered, setIsCloseHovered] = useState(false);

  const _onTabChange = (e, tab) => {
    e.preventDefault();
    dispatch(handleShowModal(tab));
  };
 
  const _onCloseModal = (e) => {
    e.preventDefault();
    dispatch(handleCloseModal());
  };

  // If modal is not shown, don't render anything
  if (!showModal) return null;
  // Medical-themed color scheme
  const medicalTheme = {
    primary: '#316bfd', // Calming green for medical setting
    secondary: '#316bfd', // Teal for secondary actions
    accent: '#E3657C', // Soft red/pink for branding elements (like HIV ribbon)
    light: '#F0F4F8', // Light background for accessibility
    text: '#2D4A58', // Deep blue/gray for text
    errorRed: '#FF4D4F' // Standard error red
  };

  const modalStyles = {
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    modalContent: {
      background: 'white',
      borderRadius: '12px',
      width: '90%',
      maxWidth: '500px',
      boxShadow: '0 5px 25px rgba(0, 0, 0, 0.15)',
      position: 'relative',
      overflow: 'hidden'
    },
    modalHeader: {
      display: 'flex',
      padding: '24px 24px 0 24px',
      borderBottom: '1px solid #f0f0f0',
      position: 'relative'
    },
    modalBody: {
      padding: '24px',
      backgroundColor: medicalTheme.light
    },
    logo: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      padding: '10px 0',
      color: medicalTheme.accent,
      fontSize: '24px',
      fontWeight: '600'
    },
    tabList: {
      display: 'flex',
      width: '100%',
      margin: 0,
      padding: 0,
      listStyle: 'none'
    },
    tabItem: {
      flex: 1,
      textAlign: 'center',
      padding: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      borderBottom: '2px solid transparent',
      transition: 'all 0.3s ease',
      color: medicalTheme.text
    },
    activeTabItem: {
      borderBottom: `2px solid ${medicalTheme.primary}`,
      color: medicalTheme.primary
    },    closeButton: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      background: 'none',
      border: 'none',
      fontSize: '18px',
      cursor: 'pointer',
      color: medicalTheme.text,
      padding: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      transition: 'all 0.3s ease',
      zIndex: 10,
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    closeButtonHover: {
      background: '#f0f0f0',
      color: medicalTheme.accent
    }
  };
  return (
    <div style={modalStyles.modal}>
      <div style={modalStyles.modalContent}>        <button
          style={{
            ...modalStyles.closeButton,
            ...(isCloseHovered ? modalStyles.closeButtonHover : {})
          }}
          onClick={_onCloseModal}
          onMouseEnter={() => setIsCloseHovered(true)}
          onMouseLeave={() => setIsCloseHovered(false)}
          aria-label="Close"
        >
          <CloseOutlined />
        </button>
          <div style={modalStyles.logo}>
          <FontAwesomeIcon icon={faHeartbeat} style={{ marginRight: '10px', color: medicalTheme.accent }} />
          <span style={{ fontWeight: 'bold' }}>Phòng khám GALANT</span>
          <FontAwesomeIcon icon={faStethoscope} style={{ marginLeft: '10px', color: medicalTheme.primary }} />
        </div>

        <div style={{ textAlign: 'center', padding: '0 20px 15px', color: medicalTheme.secondary, fontSize: '14px' }}>
          <FontAwesomeIcon icon={faHospital} style={{ marginRight: '5px' }} />
          Hệ thống chăm sóc và tư vấn sức khỏe
        </div>
        
        <div style={modalStyles.modalHeader}>
          <ul style={modalStyles.tabList}>            <li 
              style={{
                ...modalStyles.tabItem,
                ...(showModal === MODAL_TYPE.login ? modalStyles.activeTabItem : {})
              }}
              onClick={(e) => _onTabChange(e, MODAL_TYPE.login)}
            >
              <LoginOutlined style={{ marginRight: '8px' }} />
              ĐĂNG NHẬP
            </li>
            <li 
              style={{
                ...modalStyles.tabItem,
                ...(showModal === MODAL_TYPE.register ? modalStyles.activeTabItem : {})
              }}
              onClick={(e) => _onTabChange(e, MODAL_TYPE.register)}
            >
              <UserAddOutlined style={{ marginRight: '8px' }} />
              ĐĂNG KÝ
            </li>
          </ul>
        </div>
        <div style={modalStyles.modalBody}>
          {showModal === MODAL_TYPE.login && <LoginForm />}
          {showModal === MODAL_TYPE.register && <RegisterForm />}
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;