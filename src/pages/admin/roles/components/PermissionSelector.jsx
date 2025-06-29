import React, { useState, useMemo } from 'react';
import { getMethodColor } from '@/constant/admin';

const PermissionSelector = ({ permissions, value, onChange }) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const permissionsPerPage = 9;

  // Ensure permissions is always an array
  const permissionArray = Array.isArray(permissions) ? permissions : [];
  
  const filtered = useMemo(() => {
    if (!search) return permissionArray;
    const s = search.toLowerCase();
    return permissionArray.filter(p =>
      (p.name || '').toLowerCase().includes(s) ||
      (p.path || '').toLowerCase().includes(s) ||
      (p.description || '').toLowerCase().includes(s)
    );
  }, [permissionArray, search]);

  const paginated = useMemo(() => {
    const startIndex = (currentPage - 1) * permissionsPerPage;
    return filtered.slice(startIndex, startIndex + permissionsPerPage);
  }, [filtered, currentPage, permissionsPerPage]);

  const totalPages = Math.ceil(filtered.length / permissionsPerPage);

  const toggle = (id) => {
    if (!value) {
      onChange([id]);
      return;
    }
    
    if (value.includes(id)) {
      onChange(value.filter(v => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div>
      <input
        type="text"
        className="w-full mb-4 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        placeholder="Search permissions..."
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setCurrentPage(1); // Reset to first page on search
        }}
      />
      {filtered.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-gray-400">No permissions found</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {paginated.map(permission => (
            <div
              key={permission.id}
              className={`cursor-pointer border rounded-lg p-3 flex flex-col gap-2 transition-colors duration-150
                ${value && value.includes(permission.id)
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-blue-300'}
              `}
              onClick={() => toggle(permission.id)}
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded ${getMethodColor(permission.method)}`}>{permission.method || 'N/A'}</span>
                <span className="font-semibold text-gray-800 truncate">{permission.name || 'Unnamed'}</span>
              </div>
              <div className="text-xs text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                {permission.path || '/'}
              </div>
              {permission.description && (
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">{permission.description}</div>
              )}
            </div>
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
      <div className="mt-4 text-sm text-blue-700">
        <span className="font-medium">Selected:</span> {value?.length || 0} permission{(value?.length !== 1) ? 's' : ''}
      </div>
    </div>
  );
};

export default PermissionSelector;
