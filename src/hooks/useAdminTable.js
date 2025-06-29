import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { useDebounce } from './useDebounce';

export const useAdminTable = ({
  fetchFunction,
  searchField = 'search',
  defaultPageSize = 10,
  defaultSortField = 'createdAt',
  defaultSortOrder = 'descend',
  autoFetch = true,
  onError,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: defaultPageSize,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
  });
  const [sorter, setSorter] = useState({
    field: defaultSortField,
    order: defaultSortOrder,
  });
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({});

  const debouncedSearch = useDebounce(searchText, 500);

  const fetchData = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = {
        page: pagination.current,
        limit: pagination.pageSize,
        sortBy: sorter.field,
        sortOrder: sorter.order === 'ascend' ? 'asc' : 'desc',
        [searchField]: debouncedSearch,
        ...filters,
        ...params,
      };

      const response = await fetchFunction(queryParams);
      
      // Handle different API response structures
      let responseData = [];
      let responseMeta = { total: 0 };

      if (response?.data?.data?.data) {
        responseData = response.data.data.data;
        responseMeta = response.data.data.meta || {};
      } else if (response?.data?.data) {
        responseData = Array.isArray(response.data.data) ? response.data.data : [];
        responseMeta = response.data.meta || {};
      } else if (Array.isArray(response?.data)) {
        responseData = response.data;
        responseMeta = { total: responseData.length };
      } else {
        console.warn('Unexpected API response structure:', response);
        responseData = [];
        responseMeta = { total: 0 };
      }

      setData(responseData);
      setPagination(prev => ({
        ...prev,
        total: responseMeta.total || 0,
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch data';
      message.error(errorMessage);
      onError?.(error);
      setData([]);
      setPagination(prev => ({ ...prev, total: 0 }));
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, pagination.current, pagination.pageSize, sorter, debouncedSearch, filters, searchField, onError]);

  const handleTableChange = useCallback((newPagination, newFilters, newSorter) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
    
    setSorter({
      field: newSorter.field || defaultSortField,
      order: newSorter.order || defaultSortOrder,
    });
    
    setFilters(newFilters);
  }, [defaultSortField, defaultSortOrder]);

  const handleSearch = useCallback((value) => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  }, []);

  const handleRefresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const handleReset = useCallback(() => {
    setSearchText('');
    setFilters({});
    setSorter({
      field: defaultSortField,
      order: defaultSortOrder,
    });
    setPagination(prev => ({
      ...prev,
      current: 1,
    }));
  }, [defaultSortField, defaultSortOrder]);

  // Auto-fetch when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  return {
    data,
    loading,
    pagination,
    sorter,
    searchText,
    filters,
    handleTableChange,
    handleSearch,
    handleRefresh,
    handleReset,
    fetchData,
    setData,
    setLoading,
  };
}; 