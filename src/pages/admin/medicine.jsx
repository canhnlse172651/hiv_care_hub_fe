import React, { useEffect, useState } from 'react';
import { medicineService } from '@/services/medicineService';

const initialForm = {
  name: '',
  description: '',
  unit: '',
  dose: '',
  price: ''
};

const MedicineManagement = () => {
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showDeleteId, setShowDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterDose, setFilterDose] = useState('');

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const res = await medicineService.getAllMedicines();
      const arr = Array.isArray(res.data?.data?.data)
        ? res.data.data.data
        : [];
      setMedicines(arr);
    } catch (e) {
      setError('Không thể tải danh sách thuốc');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingId) {
        await medicineService.updateMedicine(editingId, {
          ...form,
          price: parseFloat(form.price)
        });
        setSuccess('Cập nhật thuốc thành công!');
      } else {
        await medicineService.createMedicine({
          ...form,
          price: parseFloat(form.price)
        });
        setSuccess('Thêm thuốc thành công!');
      }
      setForm(initialForm);
      setEditingId(null);
      setShowModal(false);
      fetchMedicines();
    } catch (e) {
      setError('Không thể lưu thuốc');
    }
  };

  const handleEdit = (med) => {
    setForm({
      name: med.name,
      description: med.description,
      unit: med.unit,
      dose: med.dose,
      price: med.price
    });
    setEditingId(med.id || med._id);
    setSuccess('');
    setError('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    try {
      await medicineService.deleteMedicine(id);
      setSuccess('Xóa thuốc thành công!');
      setShowDeleteId(null);
      fetchMedicines();
    } catch (e) {
      setError('Không thể xóa thuốc');
    }
  };

  const handleCancelEdit = () => {
    setForm(initialForm);
    setEditingId(null);
    setSuccess('');
    setError('');
    setShowModal(false);
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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Quản lý thuốc</h1>
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <div className="flex flex-col gap-2 flex-1">
          <label className="font-medium">Tìm kiếm theo tên</label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Nhập tên thuốc..."
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium">Lọc theo đơn vị</label>
          <select
            value={filterUnit}
            onChange={e => setFilterUnit(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">Tất cả</option>
            {uniqueUnits.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium">Lọc theo liều lượng</label>
          <select
            value={filterDose}
            onChange={e => setFilterDose(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">Tất cả</option>
            {uniqueDoses.map(dose => (
              <option key={dose} value={dose}>{dose}</option>
            ))}
          </select>
        </div>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 h-fit mt-6 md:mt-0"
          onClick={() => { setShowModal(true); setEditingId(null); setForm(initialForm); setError(''); setSuccess(''); }}
        >
          Thêm thuốc
        </button>
      </div>
      {/* Modal for add/edit medicine */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={handleCancelEdit}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">{editingId ? 'Cập nhật thuốc' : 'Thêm thuốc mới'}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Tên thuốc</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block font-medium mb-1">Đơn vị</label>
                  <input name="unit" value={form.unit} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block font-medium mb-1">Liều lượng</label>
                  <input name="dose" value={form.dose} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block font-medium mb-1">Giá (USD)</label>
                  <input name="price" value={form.price} onChange={handleChange} required type="number" step="0.01" className="w-full border rounded px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Mô tả</label>
                <textarea name="description" value={form.description} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-fit">
                  {editingId ? 'Cập nhật thuốc' : 'Thêm thuốc'}
                </button>
                <button type="button" onClick={handleCancelEdit} className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 w-fit">Hủy</button>
              </div>
              {error && <div className="text-red-600 mt-2">{error}</div>}
              {success && <div className="text-green-600 mt-2">{success}</div>}
            </form>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Danh sách thuốc</h2>
        {loading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : (
          <table className="min-w-full border">
            <thead>
              <tr className="bg-blue-100">
                <th className="py-2 px-4 border">Tên thuốc</th>
                <th className="py-2 px-4 border">Mô tả</th>
                <th className="py-2 px-4 border">Đơn vị</th>
                <th className="py-2 px-4 border">Liều lượng</th>
                <th className="py-2 px-4 border">Giá (USD)</th>
                <th className="py-2 px-4 border">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-4">Không có thuốc nào</td></tr>
              ) : (
                filteredMedicines.map((med) => (
                  <tr key={med.id || med._id} className="hover:bg-blue-50">
                    <td className="py-2 px-4 border">{med.name}</td>
                    <td className="py-2 px-4 border">{med.description}</td>
                    <td className="py-2 px-4 border">{med.unit}</td>
                    <td className="py-2 px-4 border">{med.dose}</td>
                    <td className="py-2 px-4 border">{med.price}</td>
                    <td className="py-2 px-4 border flex gap-2 relative">
                      <button
                        className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                        onClick={() => handleEdit(med)}
                      >
                        Sửa
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => setShowDeleteId(med.id || med._id)}
                      >
                        Xóa
                      </button>
                      {showDeleteId === (med.id || med._id) && (
                        <div className="absolute bg-white border rounded shadow p-4 z-10 mt-2">
                          <div className="mb-2">Bạn có chắc muốn xóa?</div>
                          <div className="flex gap-2">
                            <button
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                              onClick={() => handleDelete(med.id || med._id)}
                            >
                              Xác nhận
                            </button>
                            <button
                              className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
                              onClick={() => setShowDeleteId(null)}
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MedicineManagement; 