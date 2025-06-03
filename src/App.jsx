import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import HomePage from "./pages/landscape/home";
import Forum from "./pages/landscape/forum";
import Contact from "./pages/landscape/contact";
import Analysis from "./pages/landscape/analysis";
import Pharmacy from "./pages/landscape/pharmacy";
import Dashboard from "./pages/admin/dashboard";
import UserManagement from "./pages/admin/usermanagement";
import AppointmentList from "./pages/admin/appointments";
import DoctorManagement from "./pages/admin/doctors";
import TreatmentTracking from "./pages/admin/treatment-tracking";
import AuthComponent from "./components/AuthComponent";
import { PATHS } from "./constant/path";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { handleGetProfile } from "./store/Reducer/authReducer";
import { localToken } from "./utils/token";

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Check if user is already logged in
    if (localToken.get()?.accessToken) {
      dispatch(handleGetProfile());
    }
  }, [dispatch]);
  
  return (
    <>
      <Routes>
        <Route path={PATHS.HOME} element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path={PATHS.FORUM} element={<Forum />} />
          <Route path={PATHS.CONTACT} element={<Contact />} />
          <Route path={PATHS.ANALYSIS} element={<Analysis />} />
          <Route path={PATHS.PHARMACY} element={<Pharmacy />} />
        </Route>      
        <Route path={PATHS.ADMIN.INDEX} element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path={PATHS.ADMIN.DASHBOARD.replace(PATHS.ADMIN.INDEX + "/", "")} element={<Dashboard />} />
          <Route path={PATHS.ADMIN.USER_MANAGEMENT.replace(PATHS.ADMIN.INDEX + "/", "")} element={<UserManagement />} />
          <Route path={PATHS.ADMIN.APPOINTMENT_MANAGEMENT.replace(PATHS.ADMIN.INDEX + "/", "")} element={<AppointmentList />} />
          <Route path={PATHS.ADMIN.DOCTOR_MANAGEMENT.replace(PATHS.ADMIN.INDEX + "/", "")} element={<DoctorManagement />} />
          <Route path={PATHS.ADMIN.TREATMENT_TRACKING.replace(PATHS.ADMIN.INDEX + "/", "")} element={<TreatmentTracking />} />
        </Route>
      </Routes>
      <AuthComponent />
    </>
  );
}

export default App;
