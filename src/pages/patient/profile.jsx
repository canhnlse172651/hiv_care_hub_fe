import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarCheck, faFileMedical, faPills, 
  faFlask, faPenToSquare, faHeartPulse 
} from '@fortawesome/free-solid-svg-icons';
import { profileService } from '@/services/profileService';
import { message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/constant/path';

const PatientProfile = () => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await profileService.getProfile();
        console.log('Profile response:', response);
        setPatient(response.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Không thể tải thông tin cá nhân. Vui lòng thử lại sau.');
        message.error('Tải thông tin cá nhân thất bại.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Format date for better display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Handle edit profile
  const handleEditProfile = () => {
    // TODO: Implement edit profile functionality
    message.info('Tính năng chỉnh sửa hồ sơ sẽ được phát triển sau.');
  };

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
          <div className="px-6 py-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="h-24 w-24 rounded-full overflow-hidden bg-white border-4 border-white flex items-center justify-center mx-auto md:mx-0">
                  {patient.avatar ? (
                    <img 
                      src={patient.avatar} 
                      alt={patient.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-blue-500">
                      {patient.name ? patient.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  )}
                </div>
                <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                  <h2 className="text-2xl font-bold">{patient.name || 'Chưa có tên'}</h2>
                  <div className="flex items-center justify-center md:justify-start mt-2 space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      patient.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {patient.status === 'ACTIVE' ? 'Đang Hoạt Động' : 'Không Hoạt Động'}
                    </span>
                    <span className="text-sm text-blue-100">Mã BN: {patient.id}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleEditProfile}
                className="mt-4 md:mt-0 px-5 py-2.5 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center font-medium shadow-sm mx-auto md:mx-0"
              >
                <FontAwesomeIcon icon={faPenToSquare} className="mr-2" />
                Chỉnh Sửa
              </button>
            </div>
            
            {/* Decorative wave pattern */}
            <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden">
              <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-16 text-white">
                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="currentColor"></path>
              </svg>
            </div>
          </div>

          {/* Profile Information */}
          <div className="border-t border-blue-100">
            <dl>
              <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-blue-50 transition-colors">
                <dt className="text-sm font-medium text-gray-600">Họ và tên</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium sm:mt-0 sm:col-span-2">{patient.name || 'Chưa có tên'}</dd>
              </div>
              <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                <dt className="text-sm font-medium text-gray-600">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium sm:mt-0 sm:col-span-2">{patient.email}</dd>
              </div>
              <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-blue-50 transition-colors">
                <dt className="text-sm font-medium text-gray-600">Số điện thoại</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium sm:mt-0 sm:col-span-2">{patient.phoneNumber || 'Chưa có số điện thoại'}</dd>
              </div>
              <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                <dt className="text-sm font-medium text-gray-600">Ngày tham gia</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium sm:mt-0 sm:col-span-2">{formatDate(patient.createdAt)}</dd>
              </div>
            </dl>
          </div>

          {/* Additional Medical Information Cards */}
          <div className="px-6 py-6 border-t border-blue-100 bg-gradient-to-b from-white to-blue-50">
            <h3 className="text-xl font-bold text-blue-800 mb-5 flex items-center">
              <FontAwesomeIcon icon={faFileMedical} className="mr-2" />
              Thông Tin Y Tế
            </h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-blue-100 hover:border-blue-300">
                <h4 className="text-lg font-semibold text-blue-600 flex items-center">
                  <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
                  Lịch Hẹn Sắp Tới
                </h4>
                <p className="text-gray-600 mt-2">Xem và quản lý lịch hẹn của bạn</p>
                <button 
                  onClick={handleNavigateToAppointments}
                  className="mt-4 text-sm text-white bg-blue-500 hover:bg-blue-600 transition-colors px-4 py-2 rounded-lg font-medium"
                >
                  Xem lịch hẹn
                </button>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-blue-100 hover:border-blue-300">
                <h4 className="text-lg font-semibold text-blue-600 flex items-center">
                  <FontAwesomeIcon icon={faFileMedical} className="mr-2" />
                  Hồ Sơ Y Tế
                </h4>
                <p className="text-gray-600 mt-2">Truy cập lịch sử khám bệnh</p>
                <button 
                  onClick={handleNavigateToMedicalRecords}
                  className="mt-4 text-sm text-white bg-blue-500 hover:bg-blue-600 transition-colors px-4 py-2 rounded-lg font-medium"
                >
                  Xem hồ sơ
                </button>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-blue-100 hover:border-blue-300">
                <h4 className="text-lg font-semibold text-blue-600 flex items-center">
                  <FontAwesomeIcon icon={faPills} className="mr-2" />
                  Thuốc Hiện Tại
                </h4>
                <p className="text-gray-600 mt-2">Xem danh sách thuốc đang dùng</p>
                <button className="mt-4 text-sm text-white bg-blue-500 hover:bg-blue-600 transition-colors px-4 py-2 rounded-lg font-medium">
                  Xem thuốc
                </button>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-blue-100 hover:border-blue-300">
                <h4 className="text-lg font-semibold text-blue-600 flex items-center">
                  <FontAwesomeIcon icon={faFlask} className="mr-2" />
                  Kết Quả Xét Nghiệm
                </h4>
                <p className="text-gray-600 mt-2">Truy cập kết quả xét nghiệm của bạn</p>
                <button className="mt-4 text-sm text-white bg-blue-500 hover:bg-blue-600 transition-colors px-4 py-2 rounded-lg font-medium">
                  Xem kết quả
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;