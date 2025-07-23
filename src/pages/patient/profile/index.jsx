import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartPulse } from '@fortawesome/free-solid-svg-icons';
import { Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/constant/path';

// Import components and hooks
import { ProfileHeader, ProfileInfo, MedicalInfoCards } from '@/components/patient/profile';
import { usePatientProfile } from '@/hooks/patient';

const PatientProfile = () => {
  const navigate = useNavigate();
  
  const {
    patient,
    loading,
    error,
    formatDate,
    handleEditProfile
  } = usePatientProfile();

  // Handle navigation to appointments
  const handleNavigateToAppointments = () => {
    navigate(PATHS.PATIENT_APPOINTMENTS);
  };

  // Handle navigation to medical records
  const handleNavigateToMedicalRecords = () => {
    navigate(PATHS.PATIENT_MEDICAL_RECORD);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Đang tải thông tin cá nhân...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">👤</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy thông tin</h2>
          <p className="text-gray-600">Không thể tải thông tin cá nhân.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-blue-800 mb-6 text-center">
          <FontAwesomeIcon icon={faHeartPulse} className="mr-2 text-blue-600" />
          Thông Tin Cá Nhân
        </h1>
        
        <div className="bg-white shadow-md rounded-xl overflow-hidden border border-blue-100">
          {/* Profile Header */}
          <ProfileHeader 
            patient={patient}
            onEditProfile={handleEditProfile}
          />

          {/* Profile Information */}
          <ProfileInfo 
            patient={patient}
            formatDate={formatDate}
          />

          {/* Additional Medical Information Cards */}
          <MedicalInfoCards 
            onNavigateToAppointments={handleNavigateToAppointments}
            onNavigateToMedicalRecords={handleNavigateToMedicalRecords}
          />
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;