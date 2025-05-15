import { useMainContext } from "@/contexts/MainContext";

const HeaderMidle = () => {
  const { handleShowMobileMenu } = useMainContext();

  
  
  return (
    <div className="header-middle sticky-header">
      hello From Header
    </div>
  );
};

export default HeaderMidle;
