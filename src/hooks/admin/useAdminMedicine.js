import { useState, useEffect } from 'react';
import { medicineService } from '@/services/medicineService';
import { message } from 'antd';

export const useAdminMedicine = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterDose, setFilterDose] = useState('');

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const res = await medicineService.getAllMedicines();
      const arr = Array.isArray(res.data?.data)
        ? res.data.data
        : [];
      setMedicines(arr);
    } catch (e) {
      setError('Không thể tải danh sách thuốc');
      message.error('Không thể tải danh sách thuốc');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMedicine = async (formData) => {
    setError('');
    setSuccess('');
    try {
      await medicineService.createMedicine({
        ...formData,
        price: parseFloat(formData.price)
      });
      setSuccess('Thêm thuốc thành công!');
      message.success('Thêm thuốc thành công!');
      fetchMedicines();
      return true;
    } catch (e) {
      setError('Không thể lưu thuốc');
      message.error('Không thể lưu thuốc');
      return false;
    }
  };

  const handleUpdateMedicine = async (id, formData) => {
    setError('');
    setSuccess('');
    try {
      await medicineService.updateMedicine(id, {
        ...formData,
        price: parseFloat(formData.price)
      });
      setSuccess('Cập nhật thuốc thành công!');
      message.success('Cập nhật thuốc thành công!');
      fetchMedicines();
      return true;
    } catch (e) {
      setError('Không thể lưu thuốc');
      message.error('Không thể lưu thuốc');
      return false;
    }
  };

  const handleDeleteMedicine = async (id) => {
    setError('');
    setSuccess('');
    try {
      await medicineService.deleteMedicine(id);
      setSuccess('Xóa thuốc thành công!');
      message.success('Xóa thuốc thành công!');
      fetchMedicines();
      return true;
    } catch (e) {
      setError('Không thể xóa thuốc');
      message.error('Không thể xóa thuốc');
      return false;
    }
  };

  // Filter and search logic
  const filteredMedicines = (Array.isArray(medicines) ? medicines : [])
    .filter(med =>
      (!search || med.name.toLowerCase().includes(search.toLowerCase())) &&
      (!filterUnit || med.unit === filterUnit) &&
      (!filterDose || med.dose === filterDose)
    );

  // Get unique units and doses for filter dropdowns
  const uniqueUnits = Array.from(new Set((medicines || []).map(m => m.unit).filter(Boolean)));
  const uniqueDoses = Array.from(new Set((medicines || []).map(m => m.dose).filter(Boolean)));

  useEffect(() => {
    fetchMedicines();
  }, []);

  return {
    medicines,
    filteredMedicines,
    loading,
    error,
    success,
    search,
    setSearch,
    filterUnit,
    setFilterUnit,
    filterDose,
    setFilterDose,
    uniqueUnits,
    uniqueDoses,
    fetchMedicines,
    handleCreateMedicine,
    handleUpdateMedicine,
    handleDeleteMedicine
  };
};
