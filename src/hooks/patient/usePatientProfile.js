import { useState, useEffect } from 'react';
import { profileService } from '@/services/profileService';
import { message } from 'antd';

export const usePatientProfile = () => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile data
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

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    patient,
    loading,
    error,
    formatDate,
    handleEditProfile,
    refetchProfile: fetchProfile
  };
};
