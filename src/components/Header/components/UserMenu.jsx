import React from 'react';
import { Menu, Dropdown } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserCircle, faCalendarCheck, faFilePrescription, 
  faHeartbeat, faSignOutAlt, faUserMd
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { handleLogout } from '@/store/Reducer/authReducer';
import { PATHS } from '@/constant/path';

const UserMenu = ({ currentUser, isPatient, children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleProfileClick = () => navigate(PATHS.PATIENT.PROFILE);
  const handleAppointmentsClick = () => navigate(PATHS.PATIENT.APPOINTMENTS);
  const handlePrescriptionsClick = () => navigate(PATHS.PATIENT.PRESCRIPTIONS);
  const handleMedicalRecordsClick = () => navigate(PATHS.PATIENT.MEDICAL_RECORDS);
  
  const handleLogoutClick = () => {
    dispatch(handleLogout());
    navigate("/");
  };

  const patientMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={handleProfileClick}>
        <FontAwesomeIcon icon={faUserCircle} className="mr-2 text-blue-500" />
        Thông tin cá nhân
      </Menu.Item>
      <Menu.Item key="appointments" onClick={handleAppointmentsClick}>
        <FontAwesomeIcon icon={faCalendarCheck} className="mr-2 text-blue-500" />
        Lịch hẹn của tôi
      </Menu.Item>
      <Menu.Item key="prescriptions" onClick={handlePrescriptionsClick}>
        <FontAwesomeIcon icon={faFilePrescription} className="mr-2 text-blue-500" />
        Đơn thuốc
      </Menu.Item>
      <Menu.Item key="medical-records" onClick={handleMedicalRecordsClick}>
        <FontAwesomeIcon icon={faHeartbeat} className="mr-2 text-blue-500" />
        Hồ sơ y tế
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogoutClick}>
        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-red-500" />
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <FontAwesomeIcon icon={faUserMd} className="mr-2 text-blue-500" />
        Thông tin tài khoản
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogoutClick}>
        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-red-500" />
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown 
      overlay={isPatient ? patientMenu : userMenu}
      placement="bottomRight"
      arrow
      trigger={['click', 'hover']}
    >
      {children}
    </Dropdown>
  );
};

export default UserMenu; 