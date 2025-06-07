import Header from "@/components/Header";
import Footter from "@/components/Footer";
import MainContextProvider from "@/contexts/MainContext";
import { Outlet } from "react-router-dom";
function MainLayout() {
  return (
    <MainContextProvider>
      {/* <AuthenContextProvider> */}
        <div className="page-wrapper" style={{ paddingTop: "160px" }}>
          <Header />
          <Outlet />
          <Footter />
        </div>
       

        <button id="scroll-top" title="Back to Top">
          <i className="icon-arrow-up"></i>
        </button>
      {/* </AuthenContextProvider> */}
    </MainContextProvider>
  );
}

export default MainLayout;
