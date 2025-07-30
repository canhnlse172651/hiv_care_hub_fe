import { useState, useEffect } from 'react';
import { servicesService } from '@/services/servicesService';
import { message } from 'antd';

export const useAdminService = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await servicesService.getAllServices();
      const arr = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data?.data?.data)
          ? res.data.data.data
          : [];
      setServices(arr);
    } catch (e) {
      setError('Không thể tải danh sách dịch vụ');
      message.error('Không thể tải danh sách dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async (formData) => {
    setError('');
    setSuccess('');
    try {
      await servicesService.createService({
        ...formData,
        price: formData.price, // send as string
        content: "Khám bệnh"
      });
      setSuccess('Thêm dịch vụ thành công!');
      message.success('Thêm dịch vụ thành công!');
      fetchServices();
      return true;
    } catch (e) {
      setError('Không thể lưu dịch vụ');
      message.error('Không thể lưu dịch vụ');
      return false;
    }
  };

  const handleUpdateService = async (id, formData) => {
    setError('');
    setSuccess('');
    try {
      await servicesService.updateService(id, {
        ...formData,
        price: formData.price // send as string
      });
      setSuccess('Cập nhật dịch vụ thành công!');
      message.success('Cập nhật dịch vụ thành công!');
      fetchServices();
      return true;
    } catch (e) {
      setError('Không thể lưu dịch vụ');
      message.error('Không thể lưu dịch vụ');
      return false;
    }
  };

  const handleDeleteService = async (id) => {
    setError('');
    setSuccess('');
    try {
      await servicesService.deleteService(id);
      setSuccess('Xóa dịch vụ thành công!');
      message.success('Xóa dịch vụ thành công!');
      fetchServices();
      return true;
    } catch (e) {
      setError('Không thể xóa dịch vụ');
      message.error('Không thể xóa dịch vụ');
      return false;
    }
  };

  // Filter and search logic
  const filteredServices = (Array.isArray(services) ? services : [])
    .filter(svc =>
      (!search || svc.name.toLowerCase().includes(search.toLowerCase())) &&
      (!filterType || svc.type === filterType)
    );

  // Get unique types for filter dropdown
  const uniqueTypes = Array.from(new Set((services || []).map(s => s.type).filter(Boolean)));

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    filteredServices,
    loading,
    error,
    success,
    search,
    setSearch,
    filterType,
    setFilterType,
    uniqueTypes,
    fetchServices,
    handleCreateService,
    handleUpdateService,
    handleDeleteService
  };
};
