import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from './useDebounce';

export const useSearch = (initialValue = '', delay = 300) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  const isSearching = useMemo(() => {
    return searchTerm !== debouncedSearchTerm;
  }, [searchTerm, debouncedSearchTerm]);

  return {
    searchTerm,
    debouncedSearchTerm,
    handleSearch,
    clearSearch,
    isSearching
  };
}; 