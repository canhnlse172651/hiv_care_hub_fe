import React from 'react';
import { Menu, Dropdown } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import { MENU_ITEMS } from '@/constant/menuConfig';
import { PATHS } from '@/constant/path';

const NavigationMenu = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const renderDropdownMenu = (menuItem) => (
    <Menu>
      {menuItem.children.map(item => (
        <Menu.Item key={item.key}>
          <Link to={item.path || '#'}>{item.label}</Link>
        </Menu.Item>
      ))}
    </Menu>
  );

  const menuItemClass = "px-2 md:px-4 mx-1 font-medium text-sm md:text-base text-gray-800";

  return (
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
        {/* Services Dropdown */}
        <Dropdown
          overlay={renderDropdownMenu(MENU_ITEMS.services)}
          trigger={['hover']}
        >
          <Menu.Item key={MENU_ITEMS.services.key} className={menuItemClass}>
            {MENU_ITEMS.services.label} 
            <FontAwesomeIcon icon={faCaretDown} className="ml-1 text-xs" />
          </Menu.Item>
        </Dropdown>
        
        {/* HIV Test and Pharmacy items */}
        <Menu.Item key="hiv-test" className={menuItemClass}>
          <Link to={PATHS.ANALYSIS}>Xét nghiệm HIV</Link>
        </Menu.Item>
        <Menu.Item key="pharmacy" className={menuItemClass}>
          <Link to={PATHS.PHARMACY}>Nhà thuốc</Link>
        </Menu.Item>

        {/* News Dropdown */}
        <Dropdown
          overlay={renderDropdownMenu(MENU_ITEMS.news)}
          trigger={['hover']}
        >
          <Menu.Item key={MENU_ITEMS.news.key} className={menuItemClass}>
            {MENU_ITEMS.news.label} 
            <FontAwesomeIcon icon={faCaretDown} className="ml-1 text-xs" />
          </Menu.Item>
        </Dropdown>

        {/* Knowledge Dropdown */}
        <Dropdown
          overlay={renderDropdownMenu(MENU_ITEMS.knowledge)}
          trigger={['hover']}
        >
          <Menu.Item key={MENU_ITEMS.knowledge.key} className={menuItemClass}>
            <Link to="/blogs">
              {MENU_ITEMS.knowledge.label} 
              <FontAwesomeIcon icon={faCaretDown} className="ml-1 text-xs" />
            </Link>
          </Menu.Item>
        </Dropdown>
        
        {/* Contact and FAQ items */}
        <Menu.Item key="contact" className={menuItemClass}>
          <a href="/lien-he">Liên hệ</a>
        </Menu.Item>
        <Menu.Item key="faq" className={menuItemClass}>
          <a href="/forum">Hỏi đáp</a>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default NavigationMenu; 