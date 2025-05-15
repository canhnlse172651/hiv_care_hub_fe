import { useLocation } from "react-router-dom";
import { useEffect, useContext, createContext } from "react";
import $ from "jquery";

const MainContext = createContext({});

const MainContextProvider = ({ children }) => {
  const { pathname } = useLocation();

  // Define the scrollTop function
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    handleCloseMobileMenu();
    const myTimeout = setTimeout(() => {
      scrollTop();
    }, 100);

    return () => {
      clearTimeout(myTimeout);
    };
  }, [pathname]);

  

  const handleShowMobileMenu = (e) => {
    e?.stopPropagation();
    e?.preventDefault();
    $("body").addClass("mmenu-active");
    
  };

  const handleCloseMobileMenu = (e) => {
    e?.stopPropagation();
    e?.preventDefault();
    $("body").removeClass("mmenu-active");
   
  };

  return (
    <MainContext.Provider
      value={{ handleCloseMobileMenu, handleShowMobileMenu }}
    >
      {children}
    </MainContext.Provider>
  );
};

export default MainContextProvider;

export const useMainContext = () => useContext(MainContext);
