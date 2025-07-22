import { useState, useEffect } from 'react';
import { regimenService } from '@/services/regimenService';
import { message } from 'antd';

export const useRegimens = () => {
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [currentProtocol, setCurrentProtocol] = useState(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} phác đồ`,
  });

  // Filter state
  const [filters, setFilters] = useState({
    targetDisease: '',
    sortBy: '',
    sortOrder: ''
  });

  // Fetch protocols from API
  const fetchProtocols = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText,
        targetDisease: filters.targetDisease,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      };

      const response = await regimenService.getAllRegimens(params);
      
      if (response.statusCode === 200) {
        setProtocols(response.data.data);
        setPagination(prev => ({
          ...prev,
          total: response.data.meta.total,
          current: response.data.meta.page,
          pageSize: response.data.meta.limit
        }));
      } else {
        message.error('Có lỗi xảy ra khi tải danh sách phác đồ');
      }
    } catch (error) {
      console.error('Error fetching protocols:', error);
      message.error('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search with debounce
  const handleSearch = (value) => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    setPagination(prev => ({ ...prev, current: page, pageSize }));
  };

  // Handle protocol submission (create/update)
  const handleSubmitProtocol = async (values) => {
    try {
      if (currentProtocol) {
        // Update existing protocol
        await regimenService.updateRegimen(currentProtocol.id, values);
        message.success(`Phác đồ "${values.name}" đã được cập nhật thành công!`);
      } else {
        // Create new protocol
        await regimenService.createRegimen(values);
        message.success(`Phác đồ "${values.name}" đã được tạo thành công!`);
      }
      fetchProtocols(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error saving protocol:', error);
      message.error('Có lỗi xảy ra khi lưu phác đồ. Vui lòng thử lại.');
      return false;
    }
  };

  // Handle delete protocol
  const handleDeleteProtocol = async (protocolId) => {
    try {
      await regimenService.deleteRegimen(protocolId);
      message.success('Phác đồ đã được xóa thành công!');
      fetchProtocols(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error deleting protocol:', error);
      message.error('Có lỗi xảy ra khi xóa phác đồ. Vui lòng thử lại.');
      return false;
    }
  };

  useEffect(() => {
    fetchProtocols();
  }, [pagination.current, pagination.pageSize, searchText, filters]);

  return {
    protocols,
    loading,
    searchText,
    currentProtocol,
    setCurrentProtocol,
    pagination,
    filters,
    fetchProtocols,
    handleSearch,
    handleFilterChange,
    handlePaginationChange,
    handleSubmitProtocol,
    handleDeleteProtocol
  };
};
