import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/landscape/home";
import Forum from "./pages/landscape/forum";
import Contact from "./pages/landscape/contact";
import Analysis from "./pages/landscape/analysis";
import Pharmacy from "./pages/landscape/pharmacy";
import { PATHS } from "./constant/path";

function App() {
  return (
    <Routes>      <Route path={PATHS.HOME} element={<MainLayout />}>        <Route index element={<HomePage />} />
        <Route path={PATHS.FORUM} element={<Forum />} />
        <Route path={PATHS.CONTACT} element={<Contact />} />
        <Route path={PATHS.ANALYSIS} element={<Analysis />} />
        <Route path={PATHS.PHARMACY} element={<Pharmacy />} />
      </Route>
    </Routes>
  );
}

export default App;
