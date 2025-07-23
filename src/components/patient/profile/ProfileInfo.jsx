import React from 'react';

const ProfileInfo = ({ patient, formatDate }) => {
  return (
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
  );
};

export default ProfileInfo;
