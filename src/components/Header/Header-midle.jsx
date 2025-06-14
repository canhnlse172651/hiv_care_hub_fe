import { useMainContext } from "@/contexts/MainContext";
import { Menu, Dropdown, Badge } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHouse, faCaretDown, faBagShopping, faPhone, 
  faUserCircle, faCalendarCheck, faFilePrescription, 
  faHeartbeat, faSignOutAlt, faUser, faUserMd
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getRoutePath } from "@/constant/menuRoutes";
import { useDispatch, useSelector } from "react-redux";
import { handleShowModal, handleLogout } from "@/store/Reducer/authReducer";
import { MODAL_TYPE } from "@/constant/general";
import { useState } from "react";
import { getUserRole } from "@/utils/jwt";
import { PATHS } from "@/constant/path";

const menuItems = {
  services: {
    key: 'services',
    label: 'Dịch vụ',
    children: [
      { key: 'service-1', label: 'Điều trị HIV', path: '/service-booking' },
      { key: 'service-2', label: 'Gói xét nghiệm các bệnh xã hội (STDs)', path: '/service-booking' },
      { key: 'service-3', label: 'Xét nghiệm HIV tại Galant', path: '/service-booking' },
      { key: 'service-4', label: 'Xét nghiệm bệnh lậu tại Galant', path: '/service-booking' },
      { key: 'service-5', label: 'Dự phòng trước phơi nhiễm HIV - PrEP', path: '/service-booking' }
    ]
  },
  news: {
    key: 'news',
    label: 'Tin tức-Sự kiện',
    children: [
      { key: 'news-1', label: 'PrEP miễn phí' },
      { key: 'news-2', label: 'Báo chí Nói về Galant' },
      { key: 'news-3', label: 'Prep thương mại' }
    ]
  },
  knowledge: {
    key: 'knowledge',
    label: 'Kiến thức',
    children: [
      { key: 'knowledge-1', label: 'Điều trị Bệnh HIV' },
      { key: 'knowledge-2', label: 'Bệnh lây qua đường tình dục' }
    ]
  }, 
  mainMenu: [
    { key: 'hiv-test', label: 'Xét nghiệm HIV' },
    { key: 'pharmacy', label: 'Nhà thuốc' },
    { key: 'contact', label: 'Liên hệ' },
    { key: 'faq', label: 'Hỏi đáp' }
  ]
};

const HeaderMidle = () => {
  const { handleShowMobileMenu } = useMainContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useSelector(state => state.auth);
  const [loginBtnHovered, setLoginBtnHovered] = useState(false);
  
  // Check for token in local storage
  const authData = localStorage.getItem('auth');
  const hasToken = authData ? JSON.parse(authData)?.accessToken : null;
  const userId = authData ? JSON.parse(authData)?.userId : null;
  const userRole = getUserRole(userId);
  const currentPath = location.pathname;
  
  // Navigation handlers for patient menu items
  const handleProfileClick = () => {
    navigate(PATHS.PATIENT.PROFILE);
  };

  const handleAppointmentsClick = () => {
    navigate(PATHS.PATIENT.APPOINTMENTS);
  };

  const handlePrescriptionsClick = () => {
    navigate(PATHS.PATIENT.PRESCRIPTIONS);
  };

  const handleMedicalRecordsClick = () => {
    navigate(PATHS.PATIENT.MEDICAL_RECORDS);
  };

  // Patient menu items for dropdown
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
      <Menu.Item 
        key="logout"
        onClick={() => dispatch(handleLogout())}
      >
        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-red-500" />
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  // Admin/Staff/Doctor menu
  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <FontAwesomeIcon icon={faUserMd} className="mr-2 text-blue-500" />
        Thông tin tài khoản
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item 
        key="logout"
        onClick={() => dispatch(handleLogout())}
      >
        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-red-500" />
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="bg-white w-full z-50 fixed top-0 left-0 shadow-md px-4 md:px-10">
      {/* Top Row: Brand, Searchbar, Phone, Login */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-[1100px] mx-auto gap-2 md:gap-8 py-3">
        {/* Brand */}
        <div className="flex items-center justify-start">
          <Link to="/">
            <img src="/assets/logo.png" alt="Logo" className="max-h-[70px] flex-shrink-0" />
          </Link>
        </div>
        
        {/* Searchbar */}
        <div className="flex-1 w-full max-w-[800px] mx-0 md:mx-6">
          <div className="relative flex items-center w-full">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 pr-10 rounded-full border border-gray-300 text-base transition-colors focus:outline-none focus:border-blue-500"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="11" cy="11" r="7" strokeWidth="2" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          {/* Phone Button */}
          <button className="flex items-center justify-center gap-2 h-8 px-4 border border-blue-500 rounded-full text-blue-500 hover:bg-blue-50">
            <FontAwesomeIcon icon={faPhone} className="text-sm" />
            <span className="font-semibold">0938848615</span>
          </button>
          
          {/* Login/User Button */}        
          {(profile || hasToken) ? (
            <Dropdown 
              overlay={userRole === 'patient' ? patientMenu : userMenu}
              placement="bottomRight"
              arrow
              trigger={['click', 'hover']}
            >
              <button 
                className={`min-w-[140px] md:min-w-[160px] h-[38px] flex items-center justify-center px-4 rounded-full bg-blue-500 text-white font-semibold transition-all duration-300 ${
                  loginBtnHovered ? "shadow-md -translate-y-0.5" : ""
                }`}
                onMouseEnter={() => setLoginBtnHovered(true)}
                onMouseLeave={() => setLoginBtnHovered(false)}
              >
                <FontAwesomeIcon 
                  icon={userRole === 'patient' ? faUser : faUserMd} 
                  className="mr-2" 
                />
                <span>
                  {profile?.firstName || "Tài khoản"}
                </span>
              </button>
            </Dropdown>
          ) : (
            <button 
              className={`min-w-[140px] md:min-w-[160px] h-[38px] flex items-center justify-center px-4 rounded-full bg-blue-500 text-white font-semibold transition-all duration-300 ${
                loginBtnHovered ? "shadow-md -translate-y-0.5" : ""
              }`}
              onClick={() => dispatch(handleShowModal(MODAL_TYPE.login))}
              onMouseEnter={() => setLoginBtnHovered(true)}
              onMouseLeave={() => setLoginBtnHovered(false)}
            >
              <span>ĐĂNG NHẬP/ĐĂNG KÝ</span>
            </button>
          )}

          {/* Shopping Cart Button */}
          <Dropdown
            overlay={
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
            }
            trigger={['hover']}
            placement="bottomRight"
          >
            <Badge count={0} size="small">
              <button className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">
                <FontAwesomeIcon icon={faBagShopping} />
              </button>
            </Badge>
          </Dropdown>
        </div>
      </div>
      
      {/* Bottom Row: Navigation Menu - Increased height and centered */}
      <div className="flex justify-center items-center border-t border-gray-100 py-4 max-w-[1100px] mx-auto w-full overflow-x-auto">
        <Link to="/" className="text-xl md:text-2xl mr-4 md:mr-8 flex-shrink-0 text-black hover:text-blue-500 transition-colors">
          <FontAwesomeIcon icon={faHouse} />
        </Link>
        
        {/* Custom styling to remove the ant-design underlines */}
        <style jsx>{`
          .ant-menu-horizontal > .ant-menu-item::after,
          .ant-menu-horizontal > .ant-menu-submenu::after {
            border-bottom: none !important;
          }
          .ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item-selected {
            border-bottom: none !important;
          }
          .ant-menu-horizontal {
            border-bottom: none !important;
            line-height: 46px !important;
          }
        `}</style>
        
        <Menu mode="horizontal" className="bg-transparent border-none flex flex-nowrap whitespace-nowrap justify-center">
          <Dropdown
            overlay={
              <Menu>
                {menuItems.services.children.map(item => (
                  <Menu.Item key={item.key}>
                    <Link to={item.path}>{item.label}</Link>
                  </Menu.Item>
                ))}
              </Menu>
            }
            trigger={[currentPath === getRoutePath('services') ? 'hover' : 'click']}
          >
            <Menu.Item key={menuItems.services.key} className="px-2 md:px-4 mx-1 font-medium text-sm md:text-base text-gray-800">
              {menuItems.services.label} 
              <FontAwesomeIcon 
                icon={faCaretDown} 
                className="ml-1 text-xs" 
              />
            </Menu.Item>
          </Dropdown>
          
          {/* HIV Test and Pharmacy items */}
          <Menu.Item key="hiv-test" className="px-2 md:px-4 mx-1 font-medium text-sm md:text-base text-gray-800">
            <Link to={getRoutePath('hiv-test')}>Xét nghiệm HIV</Link>
          </Menu.Item>
          <Menu.Item key="pharmacy" className="px-2 md:px-4 mx-1 font-medium text-sm md:text-base text-gray-800">
            <Link to={getRoutePath('pharmacy')}>Nhà thuốc</Link>
          </Menu.Item>

          {/* News Dropdown */}
          <Dropdown
            overlay={
              <Menu>
                {menuItems.news.children.map(item => (
                  <Menu.Item key={item.key}>{item.label}</Menu.Item>
                ))}
              </Menu>
            }
            trigger={[currentPath === getRoutePath('news') ? 'hover' : 'click']}
          >
            <Menu.Item key={menuItems.news.key} className="px-2 md:px-4 mx-1 font-medium text-sm md:text-base text-gray-800">
              {menuItems.news.label} 
              <FontAwesomeIcon 
                icon={faCaretDown} 
                className="ml-1 text-xs" 
              />
            </Menu.Item>
          </Dropdown>

          {/* Knowledge Dropdown */}
          <Dropdown
            overlay={
              <Menu>
                {menuItems.knowledge.children.map(item => (
                  <Menu.Item key={item.key}>{item.label}</Menu.Item>
                ))}
              </Menu>
            }
            trigger={[currentPath === getRoutePath('knowledge') ? 'hover' : 'click']}
          >
            <Menu.Item key={menuItems.knowledge.key} className="px-2 md:px-4 mx-1 font-medium text-sm md:text-base text-gray-800">
              {menuItems.knowledge.label} 
              <FontAwesomeIcon 
                icon={faCaretDown} 
                className="ml-1 text-xs" 
              />
            </Menu.Item>
          </Dropdown>
          
          {/* Contact and FAQ items */}
          <Menu.Item key="contact" className="px-2 md:px-4 mx-1 font-medium text-sm md:text-base text-gray-800">
            <a href="/lien-he">Liên hệ</a>
          </Menu.Item>
          <Menu.Item key="faq" className="px-2 md:px-4 mx-1 font-medium text-sm md:text-base text-gray-800">
            <a href="/forum">Hỏi đáp</a>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export default HeaderMidle;