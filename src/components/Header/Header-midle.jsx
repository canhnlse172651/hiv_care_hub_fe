import { useMainContext } from "@/contexts/MainContext";
// Remove CSS import since we'll use inline styles
// import "./Header-midle.css";
import { Button, Menu, Dropdown, Badge } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCaretDown, faBagShopping, faPhone } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { getRoutePath } from "@/constant/menuRoutes";

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

// Convert all CSS to style objects
const styles = {
  headerMiddle: {
    background: '#fff',
    boxSizing: 'border-box',
    width: '100%',
    zIndex: 100,
    padding: '0 40px',
    position: 'fixed',
    top: 0,
    left: 0,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  topRow: {
    alignItems: 'center',
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '1100px',
    margin: '0 auto',
    gap: '8px',
  },
  branch: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logo: {
    flexShrink: 0,
    maxHeight: '70px',
    display: 'flex',
    alignItems: 'center',
  },
  branchName: {
    fontWeight: 600,
    fontSize: '18px',
    color: '#222',
  },
  searchbar: {
    maxWidth: '800px',
    flex: 1,
    margin: '0 24px',
  },
  searchbarWrapper: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    width: '100%',
    padding: '8px 40px 8px 16px',
    borderRadius: '999px',
    border: '1px solid #d9d9d9',
    fontSize: '16px',
    transition: 'border-color 0.2s',
    background: '#fff',
  },
  searchIcon: {
    position: 'absolute',
    right: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#bfbfbf',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    height: '32px',
    padding: '0 16px',
  },
  phoneIcon: {
    fontSize: '14px',
  },
  phoneText: {
    fontWeight: 600,
  },
  loginButton: {
    minWidth: '160px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 16px',
  },
  loginText: {
    fontWeight: 600,
    lineHeight: 1,
  },
  cartButton: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
  },
  badge: {
    display: 'flex',
  },
  cartDropdown: {
    background: 'white',
    boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08)',
    borderRadius: '8px',
    padding: '24px',
    minWidth: '300px',
  },
  cartEmpty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '24px 0',
  },
  cartEmptyIcon: {
    fontSize: '48px',
    color: '#bfbfbf',
    marginBottom: '16px',
  },
  cartEmptyText: {
    color: '#8c8c8c',
    marginBottom: '16px',
    fontSize: '16px',
  },
  cartEmptyButton: {
    minWidth: '160px',
  },
  bottomRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderTop: '1px solid #f0f0f0',
    padding: '8px 0',
    maxWidth: '1100px',
    margin: '0 auto',
    width: '100%',
    overflowX: 'auto',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
  },
  homeIcon: {
    fontSize: '22px',
    marginRight: '32px',
    cursor: 'pointer',
    transition: 'color 0.2s',
    color: 'black',
    flexShrink: 0,
  },
  tabs: {
    background: 'transparent',
    border: 'none',
    display: 'flex',
    flexWrap: 'nowrap',
    whiteSpace: 'nowrap',
    width: 'auto',
    overflowX: 'visible',
  },
  menuItem: {
    padding: '0 16px',
    margin: '0 4px',
    fontWeight: 500,
    fontSize: '16px',
    color: '#222',
    flexShrink: 0,
  },
  dropdownIcon: {
    marginLeft: '4px',
    fontSize: '14px',
  },
  // Media query styles will be handled with conditional rendering
  // or dynamic style generation based on window width
};

// Function to handle responsive styles
const getResponsiveStyles = (width) => {
  if (width <= 480) {
    return {
      headerMiddle: {
        ...styles.headerMiddle,
        padding: '0 8px',
      },
      bottomRow: {
        ...styles.bottomRow,
        padding: '8px 2px',
        flexDirection: 'row',
        justifyContent: 'flex-start',
      },
      homeIcon: {
        ...styles.homeIcon,
        marginRight: '8px',
        fontSize: '18px',
      },
      menuItem: {
        ...styles.menuItem,
        padding: '0 8px',
        margin: '0 1px',
        fontSize: '13px',
      },
    };
  } else if (width <= 768) {
    return {
      headerMiddle: {
        ...styles.headerMiddle,
        paddingLeft: '8px',
        paddingRight: '8px',
      },
      topRow: {
        ...styles.topRow,
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: '12px',
        padding: '12px 8px',
      },
      searchbar: {
        ...styles.searchbar,
        margin: '0 0 12px 0',
      },
      bottomRow: {
        ...styles.bottomRow,
        justifyContent: 'flex-start',
        padding: '8px 4px',
      },
      menuItem: {
        ...styles.menuItem,
        padding: '0 10px',
        margin: '0 2px',
        fontSize: '14px',
      },
      homeIcon: {
        ...styles.homeIcon,
        marginRight: '16px',
      },
      cartDropdown: {
        ...styles.cartDropdown,
        minWidth: '260px',
      },
      loginButton: {
        ...styles.loginButton,
        minWidth: '140px',
      },
    };
  } else if (width <= 992) {
    return {
      bottomRow: {
        ...styles.bottomRow,
        justifyContent: 'flex-start',
        padding: '8px 16px',
      },
      menuItem: {
        ...styles.menuItem,
        padding: '0 12px',
        fontSize: '15px',
      },
    };
  }
  return {};
};

const HeaderMidle = () => {
  const { handleShowMobileMenu } = useMainContext();
  // In a real implementation, you would use React's useState and useEffect
  // to track window width and apply responsive styles
  const windowWidth = window.innerWidth;
  const responsiveStyles = getResponsiveStyles(windowWidth);
  
  // Merge base styles with responsive styles
  const mergedStyles = {
    headerMiddle: {...styles.headerMiddle, ...responsiveStyles.headerMiddle},
    topRow: {...styles.topRow, ...responsiveStyles.topRow},
    bottomRow: {...styles.bottomRow, ...responsiveStyles.bottomRow},
    homeIcon: {...styles.homeIcon, ...responsiveStyles.homeIcon},
    menuItem: {...styles.menuItem, ...responsiveStyles.menuItem},
    // Add other merged styles as needed
  };

  return (
    <div style={mergedStyles.headerMiddle} className="sticky-header">
      {/* Top Row: Branch, Searchbar, Phone, Login */}
      <div style={mergedStyles.topRow}>
        {/* Branch */}
        <div style={styles.branch}>
          <Link to="/">
            <img src="/assets/logo.png" alt="Logo" style={styles.logo} />
          </Link>
        </div>
        {/* Searchbar */}
        <div style={styles.searchbar}>
          <div style={styles.searchbarWrapper}>
            <input
              type="text"
              placeholder="Search..."
              style={styles.searchInput}
            />
            <span style={styles.searchIcon}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="11" cy="11" r="7" strokeWidth="2" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </div>
        </div>
        {/* Phone Button */}
        <Button 
          color="primary" 
          variant="outlined" 
          shape="round" 
          size={50} 
          style={styles.phoneButton}
        >
          <FontAwesomeIcon icon={faPhone} style={styles.phoneIcon} />
          <span style={styles.phoneText}>0938848615</span>
        </Button>

        {/* Login Button */}
        <Button 
          color="primary" 
          variant="solid" 
          shape="round" 
          size={50} 
          style={styles.loginButton}
        >
          <span style={styles.loginText}>ĐĂNG NHẬP/ĐĂNG KÝ</span>
        </Button>

        {/* Shopping Cart Button */}
        <Dropdown
          overlay={
            <div style={styles.cartDropdown}>
              <div style={styles.cartEmpty}>
                <FontAwesomeIcon 
                  icon={faBagShopping} 
                  style={styles.cartEmptyIcon} 
                />
                <p style={styles.cartEmptyText}>Chưa có sản phẩm trong giỏ hàng</p>
                <Button type="primary" style={styles.cartEmptyButton}>
                  Quay lại cửa hàng
                </Button>
              </div>
            </div>
          }
          trigger={['hover']}
          placement="bottomRight"
        >
          <Badge count={0} size="small" style={styles.badge}>
            <Button
              type="primary"
              shape="circle"
              icon={<FontAwesomeIcon icon={faBagShopping} />}
              style={styles.cartButton}
            />
          </Badge>
        </Dropdown>
      </div>
      <div style={mergedStyles.bottomRow}>
        <Link to="/">
          <span 
            style={mergedStyles.homeIcon} 
            role="img" 
            aria-label="home"
          >
            <FontAwesomeIcon icon={faHouse} />
          </span>
        </Link>
        <Menu mode="horizontal" style={styles.tabs}>
          <Dropdown
            overlay={
              <Menu>
                {menuItems.services.children.map(item => (
                  <Menu.Item key={item.key}>{item.label}</Menu.Item>
                ))}
              </Menu>
            }
          >
            <Menu.Item key={menuItems.services.key} style={mergedStyles.menuItem}>
              {menuItems.services.label} 
              <FontAwesomeIcon 
                icon={faCaretDown} 
                style={styles.dropdownIcon} 
              />
            </Menu.Item>
          </Dropdown>
          
          {/* HIV Test and Pharmacy items */}
          <Menu.Item key="hiv-test" style={mergedStyles.menuItem}>
            <Link to={getRoutePath('hiv-test')}>Xét nghiệm HIV</Link>
          </Menu.Item>
          <Menu.Item key="pharmacy" style={mergedStyles.menuItem}>
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
          >
            <Menu.Item key={menuItems.news.key} style={mergedStyles.menuItem}>
              {menuItems.news.label} 
              <FontAwesomeIcon 
                icon={faCaretDown} 
                style={styles.dropdownIcon} 
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
          >
            <Menu.Item key={menuItems.knowledge.key} style={mergedStyles.menuItem}>
              {menuItems.knowledge.label} 
              <FontAwesomeIcon 
                icon={faCaretDown} 
                style={styles.dropdownIcon} 
              />
            </Menu.Item>
          </Dropdown>
          
          {/* Contact and FAQ items */}
          <Menu.Item key="contact" style={mergedStyles.menuItem}>
            <a href="/lien-he">Liên hệ</a>
          </Menu.Item>
          <Menu.Item key="faq" style={mergedStyles.menuItem}>
            <a href="/forum">Hỏi đáp</a>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export default HeaderMidle;