import React, { useState } from 'react';
import { 
  Typography, 
  Button, 
  Space, 
  Tag, 
  Tabs, 
  Card,
  Form,
  message,
  Empty,
  Spin
} from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  CheckOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { appointmentService } from '@/services/appointmentService';
import { orderService } from '@/services/orderService';
import { 
  OrderModal, 
  StatisticsCards, 
  SearchPanel, 
  AppointmentTable, 
  AppointmentDrawer, 
  EditPatientModal 
} from '@/components/staff';
import { useEffect } from 'react';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const StaffDashboard = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [selectedOrderAppointment, setSelectedOrderAppointment] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [form] = Form.useForm();
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]); // Track invoices
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchAppointments();
    fetchServices();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // Try to get all appointments instead of staff-specific endpoint
      const res = await appointmentService.getStaffAppointments({ limit: 1000 });
      console.log('Fetched appointments:', res);
      
      // Handle different response structures
      const appointmentsData = res?.data?.data || res?.data || res || [];
      
      // Map API data to table format
      const data = appointmentsData.map(item => ({
        id: item.id,
        patientName: item.user?.name || 'N/A',
        phone: item.user?.phone || item.user?.phoneNumber || 'N/A',
        email: item.user?.email || 'N/A',
        date: item.appointmentTime ? dayjs(item.appointmentTime).format('YYYY-MM-DD') : '',
        time: item.appointmentTime ? dayjs(item.appointmentTime).format('HH:mm') : '',
        doctor: item.doctor?.name || item.doctor?.user?.name || 'N/A',
        department: item.service?.name || 'N/A',
        status: item.status || 'PENDING',
        reason: item.service?.description || item.notes || '',
        notes: item.notes || '',
        // Updated payment status logic
        paymentStatus: item.status === 'PAID' ? 'paid' : 
                     item.status === 'COMPLETED' ? 'pending_payment' : 'not_applicable',
        hasInvoice: item.status === 'COMPLETED' || item.status === 'PAID',
        invoiceGenerated: invoices.some(inv => inv.appointmentId === item.id),
        avatar: item.user?.avatar || '',
        appointmentTime: item.appointmentTime,
        service: item.service,
        user: item.user,
        price: item.service?.price || 0
      }));
      
      setAppointments(data);
      console.log('Processed appointments:', data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      message.error('Không thể tải danh sách lịch hẹn. Vui lòng thử lại.');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      // Extract unique services from appointments
      const res = await appointmentService.getStaffAppointments({ limit: 1000 });
      const appointmentsData = res?.data?.data || res?.data || res || [];
      
      // Extract unique services from appointments
      const uniqueServices = appointmentsData
        .filter(item => item.service)
        .map(item => ({
          id: item.service.id,
          name: item.service.name
        }))
        .filter((service, index, self) => 
          index === self.findIndex(s => s.id === service.id)
        );
      
      setServices(uniqueServices);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    }
  };

  // Filter appointments based on search text, date range, and service
  const filteredAppointments = appointments.filter(appointment => {
    // Text search filter
    const searchLower = searchText.toLowerCase();
    const textMatch = (
      appointment.patientName.toLowerCase().includes(searchLower) ||
      appointment.phone.includes(searchText) ||
      String(appointment.id).toLowerCase().includes(searchLower) ||
      appointment.email.toLowerCase().includes(searchLower)
    );

    // Date range filter
    let dateMatch = true;
    if (selectedDateRange && selectedDateRange[0] && selectedDateRange[1]) {
      const appointmentDate = dayjs.utc(appointment.appointmentTime);
      const startDate = selectedDateRange[0].startOf('day');
      const endDate = selectedDateRange[1].endOf('day');
      dateMatch = appointmentDate.isBetween(startDate, endDate, null, '[]');
    }

    // Service filter
    let serviceMatch = true;
    if (selectedService) {
      serviceMatch = appointment.service?.id === selectedService;
    }

    return textMatch && dateMatch && serviceMatch;
  });

  // Filter appointments by status
  const pendingAppointments = filteredAppointments.filter(a => a.status === 'PENDING');
  const completedAppointments = filteredAppointments.filter(a => ['COMPLETED', 'PAID'].includes(a.status));
  
  const getStatusTag = (status) => {
    const statusConfig = {
      'PENDING': { color: 'orange', text: 'Chờ khám', icon: <ClockCircleOutlined /> },
      'CONFIRMED': { color: 'blue', text: 'Đã xác nhận', icon: <CheckCircleOutlined /> },
      'COMPLETED': { color: 'green', text: 'Hoàn thành', icon: <CheckOutlined /> },
      'PAID': { color: 'cyan', text: 'Đã thanh toán', icon: <CheckOutlined /> },
      'CANCELLED': { color: 'red', text: 'Đã hủy', icon: <ExclamationCircleOutlined /> },
    };
    
    const config = statusConfig[status?.toUpperCase()] || { color: 'default', text: status, icon: null };
    
    return (
      <Tag 
        color={config.color}
        icon={config.icon}
        className="rounded-full px-3 py-1 font-medium"
      >
        {config.text}
      </Tag>
    );
  };
  
  const getPaymentTag = (paymentStatus, invoiceGenerated) => {
    switch(paymentStatus) {
      case 'paid':
        return <Tag color="green" className="rounded-full">Đã thanh toán</Tag>;
      case 'pending_payment':
        return invoiceGenerated ? 
          <Tag color="orange" className="rounded-full">Chờ thanh toán</Tag> :
          <Tag color="blue" className="rounded-full">Chưa tạo hóa đơn</Tag>;
      case 'not_applicable':
        return <Tag color="gray" className="rounded-full">Chưa áp dụng</Tag>;
      default:
        return <Tag color="default" className="rounded-full">{paymentStatus}</Tag>;
    }
  };
  
  const showDrawer = (appointment) => {
    setSelectedAppointment(appointment);
    setDrawerVisible(true);
  };
  
  const closeDrawer = () => {
    setDrawerVisible(false);
  };
  
  const showEditModal = () => {
    form.setFieldsValue({
      phone: selectedAppointment.phone,
      email: selectedAppointment.email,
      notes: selectedAppointment.notes,
    });
    setEditModalVisible(true);
  };
  
  const handleUpdatePatient = (values) => {
    // In a real app, you would update the patient info here
    console.log('Updated patient info:', values);
    message.success('Thông tin bệnh nhân đã được cập nhật');
    
    // Update selected appointment with new values
    setSelectedAppointment({
      ...selectedAppointment,
      ...values
    });
    
    setEditModalVisible(false);
  };
  
  const handleCheckIn = () => {
    // In a real app, you would update the appointment status here
    setSelectedAppointment({
      ...selectedAppointment,
      status: 'checked-in',
      checkInTime: dayjs().format('HH:mm A')
    });
    
    message.success('Bệnh nhân đã được check-in thành công');
  };
  
  const handleGenerateInvoice = (appointment) => {
    setSelectedOrderAppointment(appointment);
    setOrderModalVisible(true);
  };

  const handleCreateOrder = async (formValues) => {
    if (!selectedOrderAppointment) return;
    
    setOrderLoading(true);
    try {
      console.log('Selected appointment price:', selectedOrderAppointment.price, typeof selectedOrderAppointment.price);
      
      const unitPrice = Number(selectedOrderAppointment.price) || 0;
      console.log('Converted unitPrice:', unitPrice, typeof unitPrice);
      const orderData = {
        userId: selectedOrderAppointment.user?.id,
        appointmentId: selectedOrderAppointment.id,
        items: [
          {
            type: "APPOINTMENT_FEE",
            referenceId: selectedOrderAppointment.service?.id,
            name: selectedOrderAppointment.department,
            quantity: 1,
            unitPrice: unitPrice
          }
        ],
        method: "BANK_TRANSFER",
        notes: formValues.notes
      };

      const response = await orderService.createOrder(orderData);
      console.log('Order created:', response);
      
      // Update appointment to show invoice generated
      setAppointments(prev => prev.map(apt => 
        apt.id === selectedOrderAppointment.id 
          ? { ...apt, invoiceGenerated: true, paymentStatus: 'pending_payment' }
          : apt
      ));
      
      message.success('Đã tạo mã thanh toán thành công!');
      
      // Return the order data for the modal
      return response.data;
      
    } catch (error) {
      console.error('Error creating order:', error);
      message.error('Tạo mã thanh toán thất bại. Vui lòng thử lại.');
      throw error;
    } finally {
      setOrderLoading(false);
    }
  };

  const handleCancelOrder = () => {
    setOrderModalVisible(false);
    setSelectedOrderAppointment(null);
  };
  
  const handleMarkAsPaid = async (appointment) => {
    try {
      // In real app, call API to update payment status
      setAppointments(prev => prev.map(apt => 
        apt.id === appointment.id 
          ? { ...apt, status: 'PAID', paymentStatus: 'paid' }
          : apt
      ));
      
      // Update invoice status
      setInvoices(prev => prev.map(inv => 
        inv.appointmentId === appointment.id 
          ? { ...inv, status: 'paid', paidAt: new Date().toISOString() }
          : inv
      ));
      
      message.success('Đã cập nhật trạng thái thanh toán!');
      
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại. Vui lòng thử lại.');
    }
  };

  // Add this function to handle status update
  const handleConfirmAppointment = async (appointmentId) => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, { status: 'CONFIRMED' });
      message.success('Đã xác nhận lịch hẹn thành công!');
      fetchAppointments();
    } catch (error) {
      message.error('Không thể cập nhật trạng thái.');
    }
  };
  


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">

        {/* Statistics */}
        <StatisticsCards
          pendingAppointments={pendingAppointments}
          completedAppointments={completedAppointments}
          filteredAppointments={filteredAppointments}
        />

        {/* Search */}
        <SearchPanel
          searchText={searchText}
          onSearchChange={setSearchText}
          selectedDateRange={selectedDateRange}
          onDateRangeChange={setSelectedDateRange}
          selectedService={selectedService}
          onServiceChange={setSelectedService}
          services={services}
        />
        
        {/* Main Content */}
        <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
          <Tabs 
            defaultActiveKey="pending" 
            type="card" 
            className="custom-tabs"
            items={[
              {
                key: 'pending',
                label: (
                  <span className="flex items-center space-x-2">
                    <ClockCircleOutlined />
                    <span>Chờ khám ({pendingAppointments.length})</span>
                  </span>
                ),
                children: (
                  <div>
                    {loading ? (
                      <div className="flex justify-center items-center py-12">
                        <Spin size="large" />
                      </div>
                    ) : pendingAppointments.length === 0 ? (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                          <div className="text-center py-8">
                            <ClockCircleOutlined className="text-6xl text-gray-300 mb-4" />
                            <div className="text-gray-500 text-lg mb-2">Không có lịch hẹn chờ khám</div>
                            <div className="text-gray-400">Tất cả lịch hẹn đã được xử lý</div>
                          </div>
                        }
                        className="py-12"
                      />
                    ) : (
                      <AppointmentTable
                        appointments={pendingAppointments}
                        loading={loading}
                        onEdit={showDrawer}
                        onGenerateInvoice={handleGenerateInvoice}
                        onMarkAsPaid={handleMarkAsPaid}
                        onConfirmAppointment={handleConfirmAppointment}
                        getStatusTag={getStatusTag}
                        getPaymentTag={getPaymentTag}
                      />
                    )}
                                    </div>
                )
              },
              {
                key: 'completed',
                label: (
                  <span className="flex items-center space-x-2">
                    <CheckOutlined />
                    <span>Hoàn thành ({completedAppointments.length})</span>
                  </span>
                ),
                children: (
                  <AppointmentTable
                    appointments={completedAppointments}
                    loading={loading}
                    onEdit={showDrawer}
                    onGenerateInvoice={handleGenerateInvoice}
                    onMarkAsPaid={handleMarkAsPaid}
                    onConfirmAppointment={handleConfirmAppointment}
                    getStatusTag={getStatusTag}
                    getPaymentTag={getPaymentTag}
                  />
                )
              }
            ]}
          />
        </Card>
        
        {/* Appointment Detail Drawer */}
        <AppointmentDrawer
          visible={drawerVisible}
          onClose={closeDrawer}
          appointment={selectedAppointment}
          getStatusTag={getStatusTag}
          getPaymentTag={getPaymentTag}
          onEdit={showEditModal}
          onGenerateInvoice={handleGenerateInvoice}
          onMarkAsPaid={handleMarkAsPaid}
        />
        
        {/* Edit Patient Info Modal */}
        <EditPatientModal
          visible={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          onFinish={handleUpdatePatient}
          form={form}
        />

        {/* Order Modal */}
        <OrderModal
          visible={orderModalVisible}
          onCancel={handleCancelOrder}
          onConfirm={handleCreateOrder}
          appointment={selectedOrderAppointment}
          loading={orderLoading}
          orderService={orderService}
        />
      </div>
    </div>
  );
};

export default StaffDashboard;