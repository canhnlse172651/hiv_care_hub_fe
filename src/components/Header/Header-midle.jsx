import { useMainContext } from "@/contexts/MainContext";
import "./Header-midle.css";
import { Button, Menu, Dropdown, Badge } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCaretDown, faBagShopping, faPhone } from "@fortawesome/free-solid-svg-icons";

const menuItems = {
  services: {
    key: 'services',
    label: 'Dịch vụ',
    children: [
      { key: 'service-1', label: 'Dịch vụ tư vấn' },
      { key: 'service-2', label: 'Dịch vụ xét nghiệm' },
      { key: 'service-3', label: 'Dịch vụ điều trị' },
      { key: 'service-4', label: 'Dịch vụ hỗ trợ' },
      { key: 'service-5', label: 'Dịch vụ khác' }
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

  return (
    <div className="header-middle sticky-header">
      {/* Top Row: Branch, Searchbar, Phone, Login */}
      <div className="header-middle__top-row">
        {/* Branch */}
        <div className="header-middle__branch">
          <img src="/assets/logo.png" alt="Logo" className="header-middle__logo" />
        </div>
        {/* Searchbar */}
        <div className="header-middle__searchbar">
          <div className="header-middle__searchbar-wrapper">
            <input
              type="text"
              placeholder="Search..."
              className="ant-input header-middle__search-input"
            />
            <span className="header-middle__search-icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="11" cy="11" r="7" strokeWidth="2" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </div>
        </div>        {/* Phone Button */}
        <Button color="primary" variant="outlined" shape="round" size={50} className="header-middle__phone-button">
          <FontAwesomeIcon icon={faPhone} className="phone-icon" />
          <span>0938848615</span>
        </Button>

        {/* Login Button */}
        <Button color="primary" variant="solid" shape="round" size={50} className="header-middle__login-button">
          <span className="login-text">ĐĂNG NHẬP/ĐĂNG KÝ</span>
        </Button>

        {/* Shopping Cart Button */}
        <Dropdown
          overlay={
            <div className="header-middle__cart-dropdown">
              <div className="header-middle__cart-empty">
                <FontAwesomeIcon icon={faBagShopping} className="header-middle__cart-empty-icon" />
                <p>Chưa có sản phẩm trong giỏ hàng</p>
                <Button type="primary" className="header-middle__cart-empty-button">
                  Quay lại cửa hàng
                </Button>
              </div>
            </div>
          }
          trigger={['hover']}
          placement="bottomRight"
        >
          <Badge count={0} size="small">
            <Button
              type="primary"
              shape="circle"
              icon={<FontAwesomeIcon icon={faBagShopping} />}
              className="header-middle__cart-button"
            />
          </Badge>
        </Dropdown>
      </div>
      <div className="header-middle__bottom-row">
        <span className="header-middle__home-icon" role="img" aria-label="home">
          <FontAwesomeIcon icon={faHouse} />
        </span><Menu mode="horizontal" className="header-middle__tabs">
          <Dropdown
            overlay={
              <Menu>
                {menuItems.services.children.map(item => (
                  <Menu.Item key={item.key}>{item.label}</Menu.Item>
                ))}
              </Menu>
            }
          >
            <Menu.Item key={menuItems.services.key}>
              {menuItems.services.label} <FontAwesomeIcon icon={faCaretDown} className="dropdown-icon" />
            </Menu.Item>
          </Dropdown>

          {/* HIV Test and Pharmacy items */}
          <Menu.Item key="hiv-test">Xét nghiệm HIV</Menu.Item>
          <Menu.Item key="pharmacy">Nhà thuốc</Menu.Item>

          {/* News Dropdown */}
          <Dropdown
            overlay={
              <Menu>
                {menuItems.news.children.map(item => (
                  <Menu.Item key={item.key}>{item.label}</Menu.Item>
                ))}
              </Menu>
            }
          >
            <Menu.Item key={menuItems.news.key}>
              {menuItems.news.label} <FontAwesomeIcon icon={faCaretDown} className="dropdown-icon" />
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
          >
            <Menu.Item key={menuItems.knowledge.key}>
              {menuItems.knowledge.label} <FontAwesomeIcon icon={faCaretDown} className="dropdown-icon" />
            </Menu.Item>
          </Dropdown>

          {/* Contact and FAQ items */}
          <Menu.Item key="contact">Liên hệ</Menu.Item>
          <Menu.Item key="faq">Hỏi đáp</Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export default HeaderMidle;
