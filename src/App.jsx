import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/home";
import HoiDap from "./pages/hoidap";
import LienHe from "./pages/lienhe";
import XetNghiem from "./pages/xetnghiem";
import { PATHS } from "./constant/path";

function App() {
  return (
    <Routes>
      <Route path={PATHS.HOME} element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path={PATHS.HOIDAP} element={<HoiDap />} />
        <Route path={PATHS.LIENHE} element={<LienHe />} />
        <Route path={PATHS.XETNGHIEM} element={<XetNghiem />} />
      </Route>
    </Routes>
  );
}

export default App;
