import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

const ProfileHeader = ({ patient, onEditProfile }) => {
  return (
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
          onClick={onEditProfile}
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
  );
};

export default ProfileHeader;
