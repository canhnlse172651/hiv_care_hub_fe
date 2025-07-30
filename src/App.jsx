import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

// Styles
import "./App.css";

// Layouts
import MainLayout from "./layouts/MainLayout";
import SystemLayout from "./layouts/SystemLayout";

// Route Protection Components
import {
  AdminRoute,
  PatientRoute,
  StaffRoute,
  DoctorRoute,
} from "./components/RouteProtection";

// Constants
import { PATHS } from "./constant/path";

// Redux Actions
import { syncAuthStateFromStorage } from "./store/Reducer/authReducer";

// Public Pages (Landscape)
import HomePage from "./pages/landscape/home";
import Forum from "./pages/landscape/forum";
import Contact from "./pages/landscape/contact";
import Analysis from "./pages/landscape/analysis";
import Pharmacy from "./pages/landscape/pharmacy";
import ServiceBookingPage from "./pages/landscape/servicebooking";
import BlogPage from "./pages/landscape/blog";
import BlogDetailPage from "./pages/landscape/blog/BlogDetail";

// Patient Pages - Update imports to use folder structure
import PatientProfile from "./pages/patient/profile";
import PatientMedicalRecord from "./pages/patient/medical-record";
import AppointmentListPage from "./pages/patient/appointments";

// Admin Pages
import Dashboard from "./pages/admin/dashboard";
import UserManagement from "./pages/admin/usermanagement";
import RoleManagement from "@/pages/admin/roles";
import PermissionManagement from "@/pages/admin/permissions";
import DoctorManagement from "./pages/admin/doctors";
import AppointmentList from "./pages/admin/appointments";
import TreatmentTracking from "./pages/admin/treatment-tracking";
import MedicineManagement from './pages/admin/medicine';
import ServiceManagement from './pages/admin/service';

// Staff Pages
import StaffDashboard from "./pages/staff/dashboard";
import StaffPayment from "./pages/staff/payment";
import StaffPatients from "./pages/staff/patients";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/dashboard";
import ConsultationPage from "./pages/doctor/consultation";
import MedicalRecordsPage from "./pages/doctor/medical-records";
import DoctorSchedule from "./pages/doctor/schedule";
import TreatmentProtocolPage from "./pages/doctor/regimens";
import AppointmentDoctorPage from "./pages/doctor/appointment";
import PatientTreatmentsPage from "./pages/doctor/patient-treatments";
import TreatmentAnalyticsPage from "./pages/doctor/treatment-analytics";
import TreatmentPrescriptionPage from './pages/doctor/treatment-prescription';

// Auth Components
import AuthComponent from "./components/AuthComponent";
import GoogleCallback from "./components/GoogleCallback";

function App() {
  const dispatch = useDispatch();

  // Initialize auth state from localStorage and clear expired tokens
  useEffect(() => {
    dispatch(syncAuthStateFromStorage());
  }, [dispatch]);

  return (
    <>
      <Routes>
        {/* ========================================
           AUTHENTICATION ROUTES
        ======================================== */}
        <Route path="/auth/google/callback" element={<GoogleCallback />} />

        {/* ========================================
           PUBLIC ROUTES (Main Layout)
        ======================================== */}
        <Route path={PATHS.HOME} element={<MainLayout />}>
          {/* Home Page */}
          <Route index element={<HomePage />} />
          
          {/* Public Services */}
          <Route path={PATHS.FORUM} element={<Forum />} />
          <Route path={PATHS.CONTACT} element={<Contact />} />
          <Route path={PATHS.ANALYSIS} element={<Analysis />} />
          <Route path={PATHS.PHARMACY} element={<Pharmacy />} />
          <Route path={PATHS.SERVICE_BOOKING} element={<ServiceBookingPage />} />
          
          {/* Blog Routes */}
          <Route path={PATHS.BLOGS} element={<BlogPage />} />
          <Route path={PATHS.BLOG_DETAIL} element={<BlogDetailPage />} />

          {/* ========================================
             PATIENT PROTECTED ROUTES
          ======================================== */}
          <Route element={<PatientRoute />}>
            <Route path={PATHS.PATIENT.PROFILE} element={<PatientProfile />} />
            <Route path={PATHS.PATIENT.APPOINTMENTS} element={<AppointmentListPage />} />
            <Route path={PATHS.PATIENT.MEDICAL_RECORDS} element={<PatientMedicalRecord />} />
          </Route>
        </Route>

        {/* ========================================
           ADMIN ROUTES (System Layout)
        ======================================== */}
        <Route
          path={PATHS.ADMIN.INDEX}
          element={
            <AdminRoute>
              <SystemLayout role="admin" />
            </AdminRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* User Management */}
          <Route path="users" element={<UserManagement />} />
          <Route path="roles" element={<RoleManagement />} />
          <Route path="permissions" element={<PermissionManagement />} />
          
          {/* Doctor Management */}
          <Route path="doctors" element={<DoctorManagement />} />
          <Route path="medicine" element={<MedicineManagement />} />
          <Route path="service" element={<ServiceManagement />} />
          
          {/* Appointments & Treatments */}
          <Route path="appointments" element={<AppointmentList />} />
          <Route path="treatments" element={<TreatmentTracking />} />
        </Route>

        {/* ========================================
           STAFF ROUTES (System Layout)
        ======================================== */}
        <Route
          path={PATHS.STAFF.INDEX}
          element={
            <StaffRoute>
              <SystemLayout role="staff" />
            </StaffRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<StaffDashboard />} />
          <Route path="dashboard" element={<StaffDashboard />} />
          
          {/* Patient & Payment Management */}
          <Route path="payment" element={<StaffPayment />} />
          <Route path="patients" element={<StaffPatients />} />
        </Route>

        {/* ========================================
           DOCTOR ROUTES (System Layout)
        ======================================== */}
        <Route
          path="/doctor"
          element={
            <DoctorRoute>
              <SystemLayout role="doctor" />
            </DoctorRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<DoctorDashboard />} />
          <Route path="dashboard" element={<DoctorDashboard />} />
          
          {/* Patient Care */}
          <Route path="consultation/:appointmentId" element={<ConsultationPage />} />
          <Route path="medical-records/:patientId" element={<MedicalRecordsPage />} />
          <Route path="patient-treatments/:userId" element={<PatientTreatmentsPage />} />
          <Route path="treatment-analytics" element={<TreatmentAnalyticsPage />} />
          <Route path="treatment-prescription/:appointmentId?/:patientId?" element={<TreatmentPrescriptionPage />} />
          
          {/* Schedule & Protocols */}
          <Route path="schedule" element={<DoctorSchedule />} />
          <Route path="regimens" element={<TreatmentProtocolPage />} />
          
          {/* Appointments */}
          <Route path="appointments" element={<AppointmentDoctorPage />} />
        </Route>
      </Routes>

      {/* Global Auth Component */}
      <AuthComponent />
    </>
  );
}

export default App;