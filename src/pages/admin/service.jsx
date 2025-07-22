import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Space, Tag, Input, Popconfirm, message, Tooltip, Select } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { servicesService } from '@/services/servicesService';
import { ServiceType } from '@/constant/general';

const initialForm = {
  name: '',
  description: '',
  type: '',
  price: '',
  startTime: '',
  endTime: '',
  duration: '',
};

const serviceTypeOptions = [
  { value: ServiceType.TEST, label: 'Xét nghiệm' },
  { value: ServiceType.CONSULT, label: 'Tư vấn' },
  { value: ServiceType.TREATMENT, label: 'Điều trị' },
];

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showDeleteId, setShowDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
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
        await servicesService.updateService(editingId, {
          ...form,
          price: form.price // send as string
        });
        setSuccess('Cập nhật dịch vụ thành công!');
      } else {
        await servicesService.createService({
          ...form,
          price: form.price // send as string
        });
        setSuccess('Thêm dịch vụ thành công!');
      }
      setForm(initialForm);
      setEditingId(null);
      setShowModal(false);
      fetchServices();
    } catch (e) {
      setError('Không thể lưu dịch vụ');
    }
  };

  const handleEdit = (service) => {
    setForm({
      name: service.name,
      description: service.description,
      type: service.type,
      price: service.price,
      startTime: service.startTime,
      endTime: service.endTime,
      duration: service.duration,
    });
    setEditingId(service.id || service._id);
    setSuccess('');
    setError('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    try {
      await servicesService.deleteService(id);
      setSuccess('Xóa dịch vụ thành công!');
      setShowDeleteId(null);
      fetchServices();
    } catch (e) {
      setError('Không thể xóa dịch vụ');
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
  const filteredServices = (Array.isArray(services) ? services : [])
    .filter(svc =>
      (!search || svc.name.toLowerCase().includes(search.toLowerCase())) &&
      (!filterType || svc.type === filterType)
    );

  // Get unique types for filter dropdown
  const uniqueTypes = Array.from(new Set((services || []).map(s => s.type).filter(Boolean)));

  // Table columns for Ant Design Table
  const columns = [
    {
      title: 'Tên dịch vụ',
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
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      filters: serviceTypeOptions,
      onFilter: (value, record) => record.type === value,
      render: (type) => {
        const found = serviceTypeOptions.find(opt => opt.value === type);
        return found ? found.label : type;
      },
    },
    {
      title: 'Giá (USD)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <span>{price}</span>,
      sorter: (a, b) => parseFloat(a.price) - parseFloat(b.price),
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: 'Thời lượng',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Hành động',
      key: 'actions',
      fixed: 'right',
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
            title="Bạn có chắc muốn xóa dịch vụ này?"
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
          <h1 className="text-3xl font-bold text-gray-800">Quản lý dịch vụ</h1>
          <Button
            type="primary"
            onClick={() => { setShowModal(true); setEditingId(null); setForm(initialForm); setError(''); setSuccess(''); }}
          >
            Thêm dịch vụ
          </Button>
        </div>
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <Input
              placeholder="Tìm kiếm theo tên"
              value={search}
              onChange={e => setSearch(e.target.value)}
              allowClear
            />
            <Select
              placeholder="Lọc theo loại"
              value={filterType || undefined}
              onChange={value => setFilterType(value)}
              allowClear
              style={{ width: '100%' }}
              options={serviceTypeOptions}
            />
          </div>
        </Card>
        {/* Modal for add/edit service */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
                onClick={handleCancelEdit}
              >
                &times;
              </button>
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">{editingId ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ mới'}</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Tên dịch vụ</label>
                    <input name="name" value={form.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Loại</label>
                    <Select
                      name="type"
                      value={form.type || undefined}
                      onChange={value => setForm(prev => ({ ...prev, type: value }))}
                      options={serviceTypeOptions}
                      placeholder="Chọn loại dịch vụ"
                      allowClear
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Giá (USD)</label>
                    <input name="price" value={form.price} onChange={handleChange} required type="number" step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Thời gian bắt đầu</label>
                    <input name="startTime" value={form.startTime} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Thời gian kết thúc</label>
                    <input name="endTime" value={form.endTime} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Thời lượng (hh:mm)</label>
                    <input name="duration" value={form.duration} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>
                <div>
                  <label className="block font-medium mb-1 text-gray-700">Mô tả</label>
                  <textarea name="description" value={form.description} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
                <div className="flex gap-3 justify-end">
                  <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium">
                    {editingId ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ'}
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
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Danh sách dịch vụ</h2>
          <Table
            columns={columns}
            dataSource={filteredServices.map(svc => ({ ...svc, key: svc.id || svc._id }))}
            loading={loading}
            pagination={{ pageSize: 10 }}
            rowKey="key"
            scroll={{ x: 'max-content' }}
            locale={{ emptyText: 'Không có dịch vụ nào' }}
          />
        </Card>
      </div>
    </div>
  );
};

export default ServiceManagement;