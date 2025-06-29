import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import BaseLayout from "./layouts/BaseLayout";
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
import { authManager } from "./utils/auth";
import { 
  AdminRoute, 
  PatientRoute,
  StaffRoute,
  DoctorRoute 
} from "./components/RouteProtection";
import PatientProfile from "./pages/patient/profile";
import StaffDashboard from "./pages/staff/dashboard";
import StaffPayment from "./pages/staff/payment";
import StaffPatients from "./pages/staff/patients";
import DoctorDashboard from "./pages/doctor/dashboard";
import DoctorSchedulePage from "./pages/doctor/schedule";
import TreatmentProtocolPage from "./pages/doctor/regimens";
import ServiceBooking from "./pages/landscape/servicebooking";
import RoleManagement from '@/pages/admin/roles';
import PermissionManagement from '@/pages/admin/permissions';
import ServiceBookingPage from "./pages/landscape/servicebooking";
import PatientProfilePage from "./pages/patient/profile";
import AppointmentListPage from "./pages/patient/appointments";
import DoctorSchedule from "./pages/doctor/schedule";
import BlogPage from "./pages/landscape/blog";
import BlogDetailPage from "./pages/landscape/blog/BlogDetail";
import DoctorScheduleAdminPage from './pages/admin/doctors/schedule';
import DoctorAppointments from "./pages/doctor/appointments";

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Check if user is already authenticated
    if (authManager.isAuthenticated()) {
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
          <Route path={PATHS.SERVICE_BOOKING} element={<ServiceBookingPage />} />
          <Route path={PATHS.BLOGS} element={<BlogPage />} />
          <Route path={PATHS.BLOG_DETAIL} element={<BlogDetailPage />} />
          
          {/* Patient Protected Routes - Using the same MainLayout */}
          <Route element={<PatientRoute />}>
            <Route path={PATHS.PATIENT.PROFILE} element={<PatientProfilePage />} />
            <Route path={PATHS.PATIENT.APPOINTMENTS} element={<AppointmentListPage />} />
          </Route>
        </Route>
        
        {/* Admin Routes */}
        <Route path={PATHS.ADMIN.INDEX} element={
          <AdminRoute>
            <BaseLayout role="admin" />
          </AdminRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="roles" element={<RoleManagement />} />
          <Route path="permissions" element={<PermissionManagement />} />
          <Route path="doctors" element={<DoctorManagement />} />
          <Route path="doctors/:userId/schedule" element={<DoctorScheduleAdminPage />} />
          <Route path="appointments" element={<AppointmentList />} />
          <Route path="treatment-tracking" element={<TreatmentTracking />} />
        </Route>
        
        {/* Staff Routes */}
        <Route path={PATHS.STAFF.INDEX} element={
          <StaffRoute>
            <BaseLayout role="staff" />
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
            <BaseLayout role="doctor" />
          </DoctorRoute>
        }>
          <Route index element={<DoctorDashboard />} />
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="schedule" element={<DoctorSchedule />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="regimens" element={<TreatmentProtocolPage />} />
          {/* Additional doctor routes would go here */}
        </Route>
      </Routes>
      <AuthComponent />
    </>
  );
}

export default App;
