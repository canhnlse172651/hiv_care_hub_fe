import React, { useState } from 'react';
import { Badge, Dropdown } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faBagShopping, faUserCircle, faUserMd } from '@fortawesome/free-solid-svg-icons';
import { CONTACT_INFO } from '@/constant/menuConfig';
import { useAuth } from '@/hooks/useAuth';
import { useAuthModal } from '@/hooks/useAuthModal';
import UserMenu from './UserMenu';

const HeaderActions = () => {
  const { isAuthenticated, currentUser, isPatient } = useAuth();
  const { openLogin } = useAuthModal();
  const [loginBtnHovered, setLoginBtnHovered] = useState(false);

  const getUserDisplayName = () => {
    return currentUser?.name || currentUser?.firstName || "Tài khoản";
  };

  const getUserIcon = () => {
    return isPatient ? faUserCircle : faUserMd;
  };

  const cartDropdown = (
    <div className="bg-white rounded-lg shadow-lg p-6 min-w-[260px] md:min-w-[300px]">
      <div className="flex flex-col items-center text-center py-6">
        <FontAwesomeIcon 
          icon={faBagShopping} 
          className="text-4xl text-gray-400 mb-4" 
        />
        <p className="text-gray-500 mb-4">Chưa có sản phẩm trong giỏ hàng</p>
        <button className="px-4 py-2 bg-blue-500 text-white rounded min-w-[160px] hover:bg-blue-600 transition-colors">
          Quay lại cửa hàng
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex items-center gap-2 md:gap-4">
      {/* Phone Button */}
      <button className="flex items-center justify-center gap-2 h-8 px-4 border border-blue-500 rounded-full text-blue-500 hover:bg-blue-50 transition-all duration-300">
        <FontAwesomeIcon icon={faPhone} className="text-sm" />
        <span className="font-semibold">{CONTACT_INFO.phone}</span>
      </button>
      
      {/* Login/User Button */}        
      {isAuthenticated ? (
        <UserMenu currentUser={currentUser} isPatient={isPatient}>
          <button 
            className={`min-w-[140px] md:min-w-[160px] h-[38px] flex items-center justify-center px-4 rounded-full bg-blue-500 text-white font-semibold transition-all duration-300 ${
              loginBtnHovered ? "shadow-md -translate-y-0.5" : ""
            }`}
            onMouseEnter={() => setLoginBtnHovered(true)}
            onMouseLeave={() => setLoginBtnHovered(false)}
          >
            <FontAwesomeIcon icon={getUserIcon()} className="mr-2" />
            <span>{getUserDisplayName()}</span>
          </button>
        </UserMenu>
      ) : (
        <button 
          className={`min-w-[140px] md:min-w-[160px] h-[38px] flex items-center justify-center px-4 rounded-full bg-blue-500 text-white font-semibold transition-all duration-300 ${
            loginBtnHovered ? "shadow-md -translate-y-0.5" : ""
          }`}
          onClick={openLogin}
          onMouseEnter={() => setLoginBtnHovered(true)}
          onMouseLeave={() => setLoginBtnHovered(false)}
        >
          <span>ĐĂNG NHẬP/ĐĂNG KÝ</span>
        </button>
      )}

      {/* Shopping Cart Button */}
      <Dropdown
        overlay={cartDropdown}
        trigger={['hover']}
        placement="bottomRight"
      >
        <Badge count={0} size="small">
          <button className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm hover:bg-blue-600 transition-colors">
            <FontAwesomeIcon icon={faBagShopping} />
          </button>
        </Badge>
      </Dropdown>
    </div>
  );
};

export default HeaderActions;