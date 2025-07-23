import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarCheck, faFileMedical, faPills, faFlask 
} from '@fortawesome/free-solid-svg-icons';

const MedicalInfoCards = ({ onNavigateToAppointments, onNavigateToMedicalRecords }) => {
  const medicalCards = [
    {
      title: 'Lịch Hẹn Sắp Tới',
      description: 'Xem và quản lý lịch hẹn của bạn',
      icon: faCalendarCheck,
      buttonText: 'Xem lịch hẹn',
      onClick: onNavigateToAppointments
    },
    {
      title: 'Hồ Sơ Y Tế',
      description: 'Truy cập lịch sử khám bệnh',
      icon: faFileMedical,
      buttonText: 'Xem hồ sơ',
      onClick: onNavigateToMedicalRecords
    },
    {
      title: 'Thuốc Hiện Tại',
      description: 'Xem danh sách thuốc đang dùng',
      icon: faPills,
      buttonText: 'Xem thuốc',
      onClick: () => {} // TODO: Implement
    },
    {
      title: 'Kết Quả Xét Nghiệm',
      description: 'Truy cập kết quả xét nghiệm của bạn',
      icon: faFlask,
      buttonText: 'Xem kết quả',
      onClick: () => {} // TODO: Implement
    }
  ];

  return (
    <div className="px-6 py-6 border-t border-blue-100 bg-gradient-to-b from-white to-blue-50">
      <h3 className="text-xl font-bold text-blue-800 mb-5 flex items-center">
        <FontAwesomeIcon icon={faFileMedical} className="mr-2" />
        Thông Tin Y Tế
      </h3>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {medicalCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-blue-100 hover:border-blue-300">
            <h4 className="text-lg font-semibold text-blue-600 flex items-center">
              <FontAwesomeIcon icon={card.icon} className="mr-2" />
              {card.title}
            </h4>
            <p className="text-gray-600 mt-2">{card.description}</p>
            <button 
              onClick={card.onClick}
              className="mt-4 text-sm text-white bg-blue-500 hover:bg-blue-600 transition-colors px-4 py-2 rounded-lg font-medium"
            >
              {card.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicalInfoCards;
