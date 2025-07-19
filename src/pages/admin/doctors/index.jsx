import React, { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Typography,
  Tag,
  Input,
  Modal,
  Form,
  Select,
  Popconfirm,
  message,
  Avatar,
  Upload,
  Rate,
  DatePicker,
  InputNumber,
  Tabs,
} from 'antd';
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  PlusOutlined,
  CalendarOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { adminService } from '@/services/adminService';
import { doctorService } from '@/services/doctorService';
import { DOCTOR_SHIFT_TIME } from '@/constant/general';
import { Link, Outlet } from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [generateForm] = Form.useForm();
  const [generateLoading, setGenerateLoading] = useState(false);
  const [generateResult, setGenerateResult] = useState(null);
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualShift, setManualShift] = useState(null);
  const [manualForm] = Form.useForm();
  const [manualLoading, setManualLoading] = useState(false);

  // Weekly schedule state
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [weeklySchedule, setWeeklySchedule] = useState(null);
  const [weekRange, setWeekRange] = useState({
    startDate: dayjs().day(1), // Monday
    endDate: dayjs().day(7),   // Sunday
  });

  // Fetch doctor list
  const fetchDoctors = async (params = {}) => {
    setLoading(true);
    try {
      const response = await adminService.getDoctors({
        page: meta.page,
        limit: meta.limit,
        search: searchText,
        ...params,
      });
      
      console.log('API Response:', response.status, '/doctors', response.data);
      
      // Extract data from the correct path based on your API response structure
      const doctorsData = response.data?.data?.data || [];
      const metaData = response.data?.data?.meta || { page: 1, limit: 10, total: 0 };
      
      console.log('Extracted doctors data:', doctorsData);
      console.log('Extracted meta data:', metaData);
      
      // Filter out doctors without user data
      const validDoctors = Array.isArray(doctorsData) ? doctorsData.filter(d => d.user) : [];
      
      setDoctors(validDoctors);
      setMeta(metaData);
    } catch (e) {
      console.error('Error fetching doctors:', e);
      message.error('Failed to fetch doctors');
      setDoctors([]);
      setMeta({ page: 1, limit: 10, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line
  }, [meta.page, meta.limit, searchText]);

  // Add doctor
  const handleAddDoctor = async (values) => {
    try {
      await adminService.addDoctor(values);
      message.success('Doctor added successfully');
      setIsModalOpen(false);
      form.resetFields();
      fetchDoctors();
    } catch (e) {
      message.error('Failed to add doctor');
    }
  };

  const specialties = [
    'Infectious Disease Specialist', 
    'General Practitioner', 
    'Therapist', 
    'Nutritionist', 
    'Psychiatrist',
    'Pharmacologist',
    'Dermatologist'
  ];

  const showModal = (doctor = null) => {
    if (doctor) {
      setEditingDoctor(doctor);
      form.setFieldsValue({
        name: doctor.name,
        email: doctor.email,
        specialty: doctor.specialty,
        experience: doctor.experience,
        education: doctor.education,
        status: doctor.status,
        bio: doctor.bio,
        consultationFee: doctor.consultationFee
      });
      setFileList(doctor.profileImage ? [{
        uid: '-1',
        name: 'profile-image.png',
        status: 'done',
        url: doctor.profileImage,
      }] : []);
    } else {
      setEditingDoctor(null);
      form.resetFields();
      setFileList([]);
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    const profileImage = fileList.length > 0 ? fileList[0].url || fileList[0].thumbUrl : null;
    
    if (editingDoctor) {
      // Update existing doctor
      setDoctors(prevDoctors => 
        prevDoctors.map(doctor => 
          doctor.id === editingDoctor.id ? { 
            ...doctor, 
            ...values,
            profileImage 
          } : doctor
        )
      );
      message.success('Doctor updated successfully');
    } else {
      // Add new doctor
      const newDoctor = {
        key: String(doctors.length + 1),
        id: doctors.length + 1,
        ...values,
        profileImage,
        rating: 0,
        patients: 0
      };
      setDoctors([...doctors, newDoctor]);
      message.success('Doctor added successfully');
    }
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDelete = (doctorId) => {
    setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
    message.success('Doctor deleted successfully');
  };

  const handleStatusChange = (doctorId) => {
    setDoctors(prevDoctors =>
      prevDoctors.map(doctor =>
        doctor.id === doctorId ? {
          ...doctor,
          status: doctor.status === 'active' ? 'inactive' : 'active'
        } : doctor
      )
    );
    message.success('Doctor status updated successfully');
  };

  // Doctor list columns styled like schedule table
  const columns = [
    {
      title: <span className="font-semibold">Bác sĩ</span>,
      dataIndex: 'doctor',
      key: 'doctor',
      render: (_, record) => (
        <div>
          <div className="font-semibold">{record.user?.name}</div>
          <div className="text-gray-500 text-xs">{record.specialization}</div>
        </div>
      ),
      fixed: 'left',
      width: 180,
    },
    {
      title: <span className="font-semibold">Email</span>,
      dataIndex: ['user', 'email'],
      key: 'email',
      render: (text, record) => (
        <span className="text-gray-700">{record.user?.email || 'N/A'}</span>
      ),
    },
    {
      title: <span className="font-semibold">Chuyên môn</span>,
      dataIndex: 'specialization',
      key: 'specialization',
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: <span className="font-semibold">Trạng thái</span>,
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      render: (isAvailable) => (
        <Tag color={isAvailable ? 'green' : 'volcano'}>
          {isAvailable ? 'Đang làm việc' : 'Nghỉ'}
        </Tag>
      ),
    },
    {
      title: <span className="font-semibold">Chứng chỉ</span>,
      dataIndex: 'certifications',
      key: 'certifications',
      render: (certifications) => (
        <Space wrap>
          {certifications?.map((cert, index) => (
            <Tag key={index} color="blue">{cert}</Tag>
          )) || <span className="text-gray-400">Không có</span>}
        </Space>
      ),
    },
    {
      title: <span className="font-semibold">ID người dùng</span>,
      dataIndex: 'userId',
      key: 'userId',
      width: 80,
      sorter: (a, b) => a.userId - b.userId,
      sortDirections: ['descend', 'ascend'],
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: <span className="font-semibold">ID bác sĩ</span>,
      dataIndex: 'id',
      key: 'doctorId',
      width: 80,
      sorter: (a, b) => a.id - b.id,
      sortDirections: ['descend', 'ascend'],
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    // No actions column
  ];

  const uploadProps = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
    maxCount: 1,
  };

  // Only allow Mondays in DatePicker
  const disabledDate = (current) => current && current.day() !== 1;

  const handleOpenGenerate = () => {
    setGenerateModalOpen(true);
    setGenerateResult(null);
    generateForm.resetFields();
  };

  const handleGenerateSchedule = async (values) => {
    console.log('Submitting values:', values);
    setGenerateLoading(true);
    try {
      // Ensure startDate is a dayjs object
      const startDate = dayjs(values.startDate);
      const payload = {
        startDate: startDate.utc().hour(10).minute(0).second(0).millisecond(0).toISOString(),
        doctorsPerShift: values.doctorsPerShift,
      };
      console.log('Payload:', payload);
      const res = await doctorService.generateSchedule(payload);
      setGenerateResult(res.data?.data || null);
      message.success(res.data?.data?.message || 'Schedule generated successfully');
    } catch (e) {
      console.error('Error in handleGenerateSchedule:', e);
      message.error('Failed to generate schedule');
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleOpenManual = (shift) => {
    setManualShift(shift);
    setManualModalOpen(true);
    manualForm.resetFields();
  };

  const handleManualAssign = async (values) => {
    setManualLoading(true);
    try {
      const payload = {
        date: manualShift.date,
        shift: manualShift.shift,
        doctorIds: values.doctorIds,
        doctorsPerShift: values.doctorsPerShift,
      };
      await doctorService.manualAssignSchedule(payload);
      message.success('Manual assignment successful');
      setManualModalOpen(false);
    } catch (e) {
      message.error('Manual assignment failed');
    } finally {
      setManualLoading(false);
    }
  };

  // Fetch weekly schedule
  const fetchWeeklySchedule = async (startDate, endDate) => {
    setScheduleLoading(true);
    try {
      const res = await doctorService.getWeeklySchedule({
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
      });
      setWeeklySchedule(res.data?.data || null);
    } catch (e) {
      message.error('Không thể tải lịch làm việc tuần');
      setWeeklySchedule(null);
    } finally {
      setScheduleLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklySchedule(weekRange.startDate, weekRange.endDate);
    // eslint-disable-next-line
  }, [weekRange]);

  // Week navigation
  const handlePrevWeek = () => {
    setWeekRange(prev => {
      const monday = prev.startDate.subtract(7, 'day').day(1);
      const sunday = monday.add(6, 'day');
      return {
        startDate: monday,
        endDate: sunday,
      };
    });
  };
  const handleNextWeek = () => {
    setWeekRange(prev => {
      const monday = prev.startDate.add(7, 'day').day(1);
      const sunday = monday.add(6, 'day');
      return {
        startDate: monday,
        endDate: sunday,
      };
    });
  };
  const handleCurrentWeek = () => {
    const monday = dayjs().day(1);
    const sunday = monday.add(6, 'day');
    setWeekRange({
      startDate: monday,
      endDate: sunday,
    });
  };

  // Helper for days of week
  const daysOfWeek = [
    { key: 'MONDAY', label: 'Thứ 2' },
    { key: 'TUESDAY', label: 'Thứ 3' },
    { key: 'WEDNESDAY', label: 'Thứ 4' },
    { key: 'THURSDAY', label: 'Thứ 5' },
    { key: 'FRIDAY', label: 'Thứ 6' },
    { key: 'SATURDAY', label: 'Thứ 7' },
    { key: 'SUNDAY', label: 'CN' },
  ];

  // Render cell for schedule table
  function renderScheduleCell(schedules, dayKey, date) {
    // Compare using UTC and only date part
    const dateStr = date.utc().format('YYYY-MM-DD');
    const shifts = schedules?.filter(
      s => s.dayOfWeek === dayKey && dayjs(s.date).utc().format('YYYY-MM-DD') === dateStr
    ) || [];
    if (shifts.length === 0) return <span className="text-gray-400">-</span>;
    return (
      <Space direction="vertical" size={4}>
        {shifts.map((shift, idx) => {
          if (shift.isOff) return <Tag key={idx} color="default">Nghỉ</Tag>;
          if (shift.shift === 'MORNING')
            return <Tag key={idx} color="blue" className="bg-blue-50 text-blue-700 border-0">Sáng</Tag>;
          if (shift.shift === 'AFTERNOON')
            return <Tag key={idx} color="green" className="bg-green-50 text-green-700 border-0">Chiều</Tag>;
          return null;
        })}
      </Space>
    );
  }

  // Weekly schedule table columns
  const scheduleColumns = [
    {
      title: <span className="font-semibold">Bác sĩ</span>,
      dataIndex: 'doctor',
      key: 'doctor',
      render: (_, record) => (
        <div>
          <div className="font-semibold">{record.user?.name}</div>
          <div className="text-gray-500 text-xs">{record.specialization}</div>
        </div>
      ),
      fixed: 'left',
      width: 180,
    },
    ...daysOfWeek.map((day, idx) => ({
      title: (
        <div>
          <div className="font-semibold">{day.label}</div>
          <div className="text-xs text-gray-500">{weekRange.startDate.day(1 + idx).format('DD/MM')}</div>
        </div>
      ),
      dataIndex: day.key,
      key: day.key,
      align: 'center',
      render: (_, record) =>
        renderScheduleCell(
          record.schedules,
          day.key,
          weekRange.startDate.day(1 + idx).utc()
        ),
      width: 110,
    })),
  ];

  // Weekly schedule data for table
  const scheduleData = weeklySchedule?.doctors?.map(doc => ({
    ...doc,
    key: doc.id,
  })) || [];

  return (
    <div>
      <Title level={2}>Quản lý bác sĩ</Title>
      <Tabs defaultActiveKey="list" className="mb-6">
        <TabPane
          tab={
            <span>
              <UserOutlined /> Danh sách
            </span>
          }
          key="list"
        >
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <span className="font-semibold text-lg mr-2">Danh sách bác sĩ</span>
              </div>
              <Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenGenerate}>
                  Generate Schedule
                </Button>
                <Button 
                  type="primary" 
                  icon={<UserOutlined />} 
                  onClick={() => setIsModalOpen(true)}
                >
                  Add Doctor
                </Button>
              </Space>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Input
                placeholder="Tìm kiếm theo tên hoặc email"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ width: 300 }}
                allowClear
              />
            </div>
            <Table
              columns={columns}
              dataSource={doctors}
              loading={loading}
              rowKey={record => record.id}
              pagination={{
                current: meta.page,
                pageSize: meta.limit,
                total: meta.total,
                onChange: (page, pageSize) => setMeta(m => ({ ...m, page, limit: pageSize })),
              }}
              scroll={{ x: 'max-content' }}
              bordered
              className="bg-white rounded-xl"
            />
          </Card>
          <Modal
            title="Add New Doctor"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleAddDoctor}
            >
              <Form.Item
                name="userId"
                label="User ID"
                rules={[{ required: true, message: 'Please enter user ID' }]}
              >
                <Input placeholder="Enter user ID" />
              </Form.Item>
              <Form.Item
                name="specialization"
                label="Specialization"
                rules={[{ required: true, message: 'Please enter specialization' }]}
              >
                <Input placeholder="Enter specialization" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Add Doctor
                </Button>
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title="Generate Doctor Schedule"
            open={generateModalOpen}
            onCancel={() => setGenerateModalOpen(false)}
            footer={null}
          >
            <Form form={generateForm} layout="vertical" onFinish={handleGenerateSchedule}>
              <Form.Item
                name="startDate"
                label="Start Date (Monday only)"
                rules={[{ required: true, message: 'Please select a start date' }]}
              >
                <DatePicker disabledDate={disabledDate} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="doctorsPerShift"
                label="Doctors Per Shift"
                rules={[{ required: true, message: 'Please enter number of doctors per shift' }]}
              >
                <InputNumber min={1} max={100} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={generateLoading} block>
                  Generate
                </Button>
              </Form.Item>
            </Form>
            {generateResult && (
              <div style={{ marginTop: 24 }}>
                <p><b>{generateResult.message}</b></p>
                <p>Total Assigned Shifts: {generateResult.totalAssignedShifts}</p>
                <p>Remaining Shifts: {generateResult.remainingShifts}</p>
                {generateResult.shiftsNeedingDoctors?.length > 0 && (
                  <>
                    <p>Shifts Needing Doctors:</p>
                    <Table
                      columns={[
                        { title: 'Date', dataIndex: 'date', key: 'date', render: d => d?.slice(0, 10) },
                        { title: 'Day', dataIndex: 'dayOfWeek', key: 'dayOfWeek' },
                        { title: 'Shift', dataIndex: 'shift', key: 'shift' },
                        { title: 'Action', key: 'action', render: (_, record) => (
                          <Button size="small" onClick={() => handleOpenManual(record)}>
                            Manual Assign
                          </Button>
                        ) },
                      ]}
                      dataSource={generateResult.shiftsNeedingDoctors}
                      rowKey={(_, idx) => idx}
                      pagination={false}
                      size="small"
                    />
                  </>
                )}
              </div>
            )}
          </Modal>
          <Modal
            title="Manual Assign Shift"
            open={manualModalOpen}
            onCancel={() => setManualModalOpen(false)}
            footer={null}
          >
            <Form form={manualForm} layout="vertical" onFinish={handleManualAssign}>
              <Form.Item label="Doctors" name="doctorIds" rules={[{ required: true, message: 'Select doctors' }]}> 
                <Select
                  mode="multiple"
                  placeholder="Select doctors"
                  optionFilterProp="children"
                  showSearch
                >
                  {doctors.map(doc => (
                    <Option key={doc.id} value={doc.id}>{doc.user?.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Doctors Per Shift" name="doctorsPerShift" rules={[{ required: true, message: 'Enter doctors per shift' }]}> 
                <InputNumber min={1} max={100} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={manualLoading} block>
                  Assign
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </TabPane>
        <TabPane
          tab={
            <span>
              <CalendarOutlined /> Lịch làm việc
            </span>
          }
          key="schedule"
        >
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <span className="font-semibold text-lg mr-2">Lịch làm việc tuần</span>
                <span className="text-gray-500">
                  {weekRange.startDate.format('DD/MM/YYYY')} - {weekRange.endDate.format('DD/MM/YYYY')}
                </span>
              </div>
              <Space>
                <Button icon={<SwapOutlined />} onClick={handlePrevWeek}>Tuần trước</Button>
                <Button onClick={handleCurrentWeek}>Tuần hiện tại</Button>
                <Button icon={<SwapOutlined />} onClick={handleNextWeek}>Tuần sau</Button>
                <Button type="primary" icon={<PlusOutlined />}>Thêm lịch</Button>
              </Space>
            </div>
            <Table
              columns={scheduleColumns}
              dataSource={scheduleData}
              loading={scheduleLoading}
              pagination={false}
              scroll={{ x: 'max-content' }}
              bordered
              rowKey="key"
              className="bg-white rounded-xl"
            />
          </Card>
        </TabPane>
      </Tabs>
      <Outlet />
    </div>
  );
};

export default DoctorManagement;
