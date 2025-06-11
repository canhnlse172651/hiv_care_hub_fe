import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import StaffLayout from "./layouts/StaffLayout";
import DoctorLayout from "./layouts/DoctorLayout";
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
import { 
  AdminRoute, 
  PatientRoute 
} from "./components/RouteProtection/ProtectedRoute";
import StaffRoute from "./components/RouteProtection/StaffRoute";
import DoctorRoute from "./components/RouteProtection/DoctorRoute";
import PatientProfile from "./pages/patient/profile";
import StaffDashboard from "./pages/staff/dashboard";
import StaffPayment from "./pages/staff/payment";
import StaffPatients from "./pages/staff/patients";
import DoctorDashboard from "./pages/doctor/dashboard";
import ConsultationPage from "./pages/doctor/consultation";
import MedicalRecordsPage from "./pages/doctor/medical-records";
import DoctorSchedulePage from "./pages/doctor/schedule";  // Add this import
import TreatmentProtocolPage from "./pages/doctor/regimens";

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
        
        {/* Admin Routes */}
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
        
        {/* Staff Routes */}
        <Route path={PATHS.STAFF.INDEX} element={
          <StaffRoute>
            <StaffLayout />
          </StaffRoute>
        }>
          <Route index element={<StaffDashboard />} />
          <Route path="dashboard" element={<StaffDashboard />} />
          <Route path="payment" element={<StaffPayment />} />
          <Route path="patients" element={<StaffPatients />} />
        </Route>
        
        {/* Doctor Routes */}
        <Route path="/doctor" element={
          <DoctorRoute>
            <DoctorLayout />
          </DoctorRoute>
        }>
          <Route index element={<DoctorDashboard />} />
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="consultation/:appointmentId" element={<ConsultationPage />} />
          <Route path="medical-records/:patientId" element={<MedicalRecordsPage />} />
          <Route path="schedule" element={<DoctorSchedulePage />} />
          <Route path="regimens" element={<TreatmentProtocolPage />} />
          {/* Additional doctor routes would go here */}
        </Route>
      </Routes>
      <AuthComponent />
    </>
  );
}

export default App;
