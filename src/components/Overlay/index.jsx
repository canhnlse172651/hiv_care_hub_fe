import { useContext } from "react";
import { MainContext } from "../context/MainContext";
function Overlay() {
  const { isShowNav, handleShowNav } = useContext(MainContext);
 

  const _onClick = () => {
    handleShowNav?.(!isShowNav);
  };
  return <div className="overlay" onClick={_onClick} />;
}

export default Overlay;
