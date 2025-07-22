import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { message } from 'antd';

export const useAdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Fetch doctor list
  const fetchDoctors = async (params = {}) => {
    setLoading(true);
    try {
      const response = await adminService.getDoctors({
        page: meta.page,
        limit: meta.limit,
        search: searchText,
        ...params,
      });
      
      console.log('API Response:', response.status, '/doctors', response.data);
      
      // Extract data from the correct path based on your API response structure
      const doctorsData = response.data?.data?.data || [];
      const metaData = response.data?.data?.meta || { page: 1, limit: 10, total: 0 };
      
      console.log('Extracted doctors data:', doctorsData);
      console.log('Extracted meta data:', metaData);
      
      // Filter out doctors without user data
      const validDoctors = Array.isArray(doctorsData) ? doctorsData.filter(d => d.user) : [];
      
      setDoctors(validDoctors);
      setMeta(metaData);
    } catch (e) {
      console.error('Error fetching doctors:', e);
      message.error('Failed to fetch doctors');
      setDoctors([]);
      setMeta({ page: 1, limit: 10, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Add doctor
  const handleAddDoctor = async (values) => {
    try {
      await adminService.addDoctor(values);
      message.success('Doctor added successfully');
      fetchDoctors();
      return true;
    } catch (e) {
      message.error('Failed to add doctor');
      return false;
    }
  };

  const handleStatusChange = (doctorId) => {
    setDoctors(prevDoctors =>
      prevDoctors.map(doctor =>
        doctor.id === doctorId ? {
          ...doctor,
          status: doctor.status === 'active' ? 'inactive' : 'active'
        } : doctor
      )
    );
    message.success('Doctor status updated successfully');
  };

  const handleDelete = (doctorId) => {
    setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
    message.success('Doctor deleted successfully');
  };

  const updateMeta = (newMeta) => {
    setMeta(prev => ({ ...prev, ...newMeta }));
  };

  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line
  }, [meta.page, meta.limit, searchText]);

  return {
    doctors,
    meta,
    loading,
    searchText,
    setSearchText,
    fetchDoctors,
    handleAddDoctor,
    handleStatusChange,
    handleDelete,
    updateMeta
  };
};