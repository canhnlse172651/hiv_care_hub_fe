import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Space, Tag, Input, Popconfirm, message, Tooltip } from 'antd';
import { medicineService } from '@/services/medicineService';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

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

  // Table columns for Ant Design Table
  const columns = [
    {
      title: 'Tên thuốc',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      key: 'unit',
      filters: uniqueUnits.map(unit => ({ text: unit, value: unit })),
      onFilter: (value, record) => record.unit === value,
    },
    {
      title: 'Liều lượng',
      dataIndex: 'dose',
      key: 'dose',
      filters: uniqueDoses.map(dose => ({ text: dose, value: dose })),
      onFilter: (value, record) => record.dose === value,
    },
    {
      title: 'Giá (USD)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <span>{price}</span>,
      sorter: (a, b) => parseFloat(a.price) - parseFloat(b.price),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          
          <Tooltip title="Sửa">
            <Button
              icon={<EditOutlined />}
              shape="circle"
              size="middle"
              style={{ border: '1px solid #1890ff', color: '#1890ff', background: '#fff' }}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc muốn xóa thuốc này?"
            onConfirm={() => handleDelete(record.id || record._id)}
            okText="Xác nhận"
            cancelText="Hủy"
            placement="left"
          >
            <Tooltip title="Xóa">
              <Button
                icon={<DeleteOutlined />}
                shape="circle"
                size="middle"
                style={{ border: '1px solid #ff4d4f', color: '#ff4d4f', background: '#fff' }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý thuốc</h1>
          <Button
            type="primary"
            onClick={() => { setShowModal(true); setEditingId(null); setForm(initialForm); setError(''); setSuccess(''); }}
          >
            Thêm thuốc
          </Button>
        </div>
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <Input
              placeholder="Tìm kiếm theo tên"
              value={search}
              onChange={e => setSearch(e.target.value)}
              allowClear
            />
            <select
              value={filterUnit}
              onChange={e => setFilterUnit(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="">Tất cả đơn vị</option>
              {uniqueUnits.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
            <select
              value={filterDose}
              onChange={e => setFilterDose(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="">Tất cả liều lượng</option>
              {uniqueDoses.map(dose => (
                <option key={dose} value={dose}>{dose}</option>
              ))}
            </select>
          </div>
        </Card>
        {/* Modal for add/edit medicine */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
                onClick={handleCancelEdit}
              >
                &times;
              </button>
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">{editingId ? 'Cập nhật thuốc' : 'Thêm thuốc mới'}</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Tên thuốc</label>
                    <input name="name" value={form.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Đơn vị</label>
                    <input name="unit" value={form.unit} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Liều lượng</label>
                    <input name="dose" value={form.dose} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Giá (USD)</label>
                    <input name="price" value={form.price} onChange={handleChange} required type="number" step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>
                <div>
                  <label className="block font-medium mb-1 text-gray-700">Mô tả</label>
                  <textarea name="description" value={form.description} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
                <div className="flex gap-3 justify-end">
                  <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium">
                    {editingId ? 'Cập nhật thuốc' : 'Thêm thuốc'}
                  </button>
                  <button type="button" onClick={handleCancelEdit} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 font-medium">Hủy</button>
                </div>
                {error && <div className="text-red-600 mt-2">{error}</div>}
                {success && <div className="text-green-600 mt-2">{success}</div>}
              </form>
            </div>
          </div>
        )}
        <Card>
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Danh sách thuốc</h2>
          <Table
            columns={columns}
            dataSource={filteredMedicines.map(med => ({ ...med, key: med.id || med._id }))}
            loading={loading}
            pagination={{ pageSize: 10 }}
            rowKey="key"
            scroll={{ x: 'max-content' }}
            locale={{ emptyText: 'Không có thuốc nào' }}
          />
        </Card>
      </div>
    </div>
  );
};

export default MedicineManagement;