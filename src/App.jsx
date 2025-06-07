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
import { AdminRoute, PatientRoute } from "./components/RouteProtection/ProtectedRoute";
import PatientProfile from "./pages/patient/profile";
// import PatientAppointments from "./pages/patient/appointments";
// import PatientPrescriptions from "./pages/patient/prescriptions";
// import PatientMedicalRecords from "./pages/patient/medical-records";

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
        {/* Main Layout Routes */}
        <Route path={PATHS.HOME} element={<MainLayout />}>
          {/* Public Routes */}
          <Route index element={<HomePage />} />
          <Route path={PATHS.FORUM} element={<Forum />} />
          <Route path={PATHS.CONTACT} element={<Contact />} />
          <Route path={PATHS.ANALYSIS} element={<Analysis />} />
          <Route path={PATHS.PHARMACY} element={<Pharmacy />} />
          
          {/* Patient Protected Routes - Using the same MainLayout */}
          <Route element={<PatientRoute />}>
            <Route path={PATHS.PATIENT.PROFILE} element={<PatientProfile />} />
            {/* <Route path={PATHS.PATIENT.APPOINTMENTS} element={<PatientAppointments />} />
            <Route path={PATHS.PATIENT.PRESCRIPTIONS} element={<PatientPrescriptions />} />
            <Route path={PATHS.PATIENT.MEDICAL_RECORDS} element={<PatientMedicalRecords />} /> */}
          </Route>
        </Route>
        
        {/* Admin Routes - Make sure we're only using one AdminRoute component */}
        <Route path={PATHS.ADMIN.INDEX} element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="appointments" element={<AppointmentList />} />
          <Route path="doctors" element={<DoctorManagement />} />
          <Route path="treatments" element={<TreatmentTracking />} />
        </Route>
        
        {/* Other routes for doctor, staff, etc. */}
      </Routes>
      <AuthComponent />
    </>
  );
}

export default App;
