import { useState } from "react";
import { Link } from "react-router-dom";
import { useMainContext } from "@/contexts/MainContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
const MENU = {
  menu: "menu",
  categories: "categories",
};

const PAGE = [
  {
    path: "/",
    content: "Home",
  },
  {
    path: "/about",
    content: "About",
  },
  {
    path: "/product",
    content: "Product",
  },
  {
    path: "/blog",
    content: "Blog",
  },
  {
    path: "/contact",
    content: "Contact",
  },
];

const MobileMenuContainer = () => {
  let { showModal } = useSelector((state) => state.auth);
  const { handleCloseMobileMenu, handleShowMobileMenu } = useMainContext();

  const [selectedTab, setSelectedTab] = useState(MENU.menu);

  const navigate = useNavigate();
  const location = useLocation();

  // Lấy giá trị `selectedIndex` từ URL
  const searchParams = new URLSearchParams(location.search);

  const initialIndex = searchParams.get("index") || 0;

  const [selectedIndex, setSelectedIndex] = useState(
    parseInt(initialIndex, 10)
  );

  const _onTabChange = (e, tab) => {
    setSelectedTab(tab);
  };

  const _onIndexChange = (index) => {
    setSelectedIndex(index);
    // Cập nhật URL với chỉ số mới
    searchParams.set("index", index);
    navigate({ search: searchParams.toString() });
  };

  return (
    <>
      <div
        className="mobile-menu-overlay"
        onClick={handleCloseMobileMenu}
        style={{
          visibility: showModal ? "visible" : "hidden",
          opacity: showModal ? 1 : 0,
          transition: "visibility 0.3s, opacity 0.3s", // Optional: for smooth transition
        }}
      />

      <div className="mobile-menu-container">
        <div className="mobile-menu-wrapper">
          <span className="mobile-menu-close" onClick={handleCloseMobileMenu}>
            <i className="icon-close" />
          </span>
          <form action="#" method="get" className="mobile-search">
            <label htmlFor="mobile-search" className="sr-only">
              Search
            </label>
            <input
              type="search"
              className="form-control"
              name="mobile-search"
              id="mobile-search"
              placeholder="Search in..."
              required
            />
            <button className="btn btn-primary" type="submit">
              <i className="icon-search" />
            </button>
          </form>
          <ul className="nav nav-pills-mobile nav-border-anim" role="tablist">
            <li className="nav-item">
              <a
                className={`nav-link ${
                  selectedTab === MENU.menu ? "active" : ""
                }`}
                id="mobile-menu-link"
                data-toggle="tab"
                href="#mobile-menu-tab"
                role="tab"
                onClick={(e) => _onTabChange(e, MENU.menu)}
              >
                Menu
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${
                  selectedTab === MENU.categories ? "active" : ""
                }`}
                id="mobile-cats-link"
                data-toggle="tab"
                href="#mobile-cats-tab"
                role="tab"
                onClick={(e) => _onTabChange(e, MENU.categories)}
              >
                Categories
              </a>
            </li>
          </ul>
          <div className="tab-content">
            <div
              className={`tab-pane fade ${
                selectedTab === MENU.menu ? "show active" : ""
              }`}
              id="mobile-menu-tab"
              role="tabpanel"
              aria-labelledby="mobile-menu-link"
            >
              <nav className="mobile-nav">
                <ul className="mobile-menu">
                  {PAGE.map((page, index) => {
                    return (
                      <li
                        onClick={(e) => _onIndexChange(index)}
                        key={index}
                        className={`${selectedIndex === index ? "active" : ""}`}
                      >
                        <Link to={page.path}>{page.content}</Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              {/* End .mobile-nav */}
            </div>
            {/* .End .tab-pane */}
            <div
              className={`tab-pane fade ${
                selectedTab === MENU.categories ? "show active" : ""
              }`}
              id="mobile-cats-tab"
              role="tabpanel"
              aria-labelledby="mobile-cats-link"
            >
              <nav className="mobile-cats-nav">
                <ul className="mobile-cats-menu">
                  <li>
                    <a className="mobile-cats-lead" href="#">
                      TV
                    </a>
                  </li>
                  <li>
                    <a href="#">Computers</a>
                  </li>
                  <li>
                    <a href="#">Tablets &amp; Cell Phones</a>
                  </li>
                  <li>
                    <a href="#">Smartwatches</a>
                  </li>
                  <li>
                    <a href="#">Accessories</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          <div className="social-icons">
            <a
              href="#"
              className="social-icon"
              target="_blank"
              title="Facebook"
            >
              <i className="icon-facebook-f" />
            </a>
            <a href="#" className="social-icon" target="_blank" title="Twitter">
              <i className="icon-twitter" />
            </a>
            <a
              href="#"
              className="social-icon"
              target="_blank"
              title="Instagram"
            >
              <i className="icon-instagram" />
            </a>
            <a href="#" className="social-icon" target="_blank" title="Youtube">
              <i className="icon-youtube" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenuContainer;
