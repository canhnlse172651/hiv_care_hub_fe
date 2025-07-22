import React, { useState, useEffect } from 'react';

const initialForm = {
  name: '',
  description: '',
  unit: '',
  dose: '',
  price: ''
};

const MedicineFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingMedicine, 
  error, 
  success 
}) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (editingMedicine) {
      setForm({
        name: editingMedicine.name,
        description: editingMedicine.description,
        unit: editingMedicine.unit,
        dose: editingMedicine.dose,
        price: editingMedicine.price
      });
    } else {
      setForm(initialForm);
    }
  }, [editingMedicine, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit(form);
    if (success) {
      setForm(initialForm);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          {editingMedicine ? 'Cập nhật thuốc' : 'Thêm thuốc mới'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 text-gray-700">Tên thuốc</label>
              <input 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                required 
                className="w-full border border-gray-300 rounded-lg px-3 py-2" 
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-gray-700">Đơn vị</label>
              <input 
                name="unit" 
                value={form.unit} 
                onChange={handleChange} 
                required 
                className="w-full border border-gray-300 rounded-lg px-3 py-2" 
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-gray-700">Liều lượng</label>
              <input 
                name="dose" 
                value={form.dose} 
                onChange={handleChange} 
                required 
                className="w-full border border-gray-300 rounded-lg px-3 py-2" 
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-gray-700">Giá (USD)</label>
              <input 
                name="price" 
                value={form.price} 
                onChange={handleChange} 
                required 
                type="number" 
                step="0.01" 
                className="w-full border border-gray-300 rounded-lg px-3 py-2" 
              />
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1 text-gray-700">Mô tả</label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              required 
              className="w-full border border-gray-300 rounded-lg px-3 py-2" 
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              {editingMedicine ? 'Cập nhật thuốc' : 'Thêm thuốc'}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 font-medium"
            >
              Hủy
            </button>
          </div>
          {error && <div className="text-red-600 mt-2">{error}</div>}
          {success && <div className="text-green-600 mt-2">{success}</div>}
        </form>
      </div>
    </div>
  );
};

export default MedicineFormModal;
