import React, { useState } from 'react';
import { 
  Typography, 
  Table, 
  Input, 
  Button, 
  Space, 
  Tag, 
  Card,
  Drawer,
  Divider,
  Descriptions,
  Avatar,
  Radio,
  Form,
  InputNumber,
  Steps,
  Result,
  List,
  message
} from 'antd';
import { 
  SearchOutlined, 
  UserOutlined,
  CreditCardOutlined,
  DollarOutlined,
  QrcodeOutlined,
  BankOutlined,
  PrinterOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Step } = Steps;

const StaffPayment = () => {
  const [searchText, setSearchText] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentComplete, setPaymentComplete] = useState(false);
  
  // Mock data for appointments waiting for payment
  const mockAppointments = [
    {
      id: 'AP-2024060001',
      patientId: 'PT-10001',
      patientName: 'Nguyễn Văn A',
      phone: '0912345678',
      date: '2024-06-01',
      time: '09:00 AM',
      doctor: 'Dr. Sarah Johnson',
      department: 'Khoa HIV',
      status: 'checked-in',
      items: [
        { name: 'Khám tổng quát', price: 150000 },
        { name: 'Xét nghiệm HIV', price: 200000 }
      ],
      totalAmount: 350000
    },
    {
      id: 'AP-2024060004',
      patientId: 'PT-10004',
      patientName: 'Phạm Thị D',
      phone: '0945678901',
      date: '2024-06-01',
      time: '10:30 AM',
      doctor: 'Dr. David Lee',
      department: 'Khoa Tư vấn tâm lý',
      status: 'completed',
      items: [
        { name: 'Tư vấn tâm lý', price: 300000 }
      ],
      totalAmount: 300000
    },
    {
      id: 'AP-2024060002',
      patientId: 'PT-10002',
      patientName: 'Trần Thị B',
      phone: '0923456789',
      date: '2024-06-01',
      time: '09:30 AM',
      doctor: 'Dr. Michael Brown',
      department: 'Khoa Tư vấn',
      status: 'completed',
      items: [
        { name: 'Tư vấn điều trị', price: 200000 },
        { name: 'Thuốc điều trị', price: 450000 }
      ],
      totalAmount: 650000
    }
  ];
  
  // Filter appointments based on search text
  const filteredAppointments = mockAppointments.filter(appointment => {
    return (
      appointment.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
      appointment.phone.includes(searchText) ||
      appointment.id.toLowerCase().includes(searchText.toLowerCase()) ||
      appointment.patientId.toLowerCase().includes(searchText.toLowerCase())
    );
  });
  
  const showDrawer = (appointment) => {
    setSelectedAppointment(appointment);
    setDrawerVisible(true);
    setCurrentStep(0);
    setPaymentComplete(false);
  };
  
  const closeDrawer = () => {
    setDrawerVisible(false);
    setPaymentMethod('cash');
  };
  
  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
    
    if (currentStep === 1) {
      // Simulate payment processing
      setTimeout(() => {
        setPaymentComplete(true);
        message.success('Thanh toán thành công!');
      }, 1500);
    }
  };
  
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };
  
  const handlePrintInvoice = () => {
    message.success('Đang in hóa đơn...');
    // In a real app, this would trigger the printing functionality
  };
  
  const columns = [
    {
      title: 'Mã lịch hẹn',
      dataIndex: 'id',
      key: 'id',
      width: 140,
    },
    {
      title: 'Bệnh nhân',
      dataIndex: 'patientName',
      key: 'patientName',
    },
    {
      title: 'Mã BN',
      dataIndex: 'patientId',
      key: 'patientId',
      width: 100,
    },
    {
      title: 'Khoa phòng',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Bác sĩ',
      dataIndex: 'doctor',
      key: 'doctor',
    },
    {
      title: 'Tổng tiền',
      key: 'totalAmount',
      render: (_, record) => (
        <Text strong>{record.totalAmount.toLocaleString('vi-VN')} VND</Text>
      ),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => (
        <Tag color={record.status === 'completed' ? 'green' : 'orange'}>
          {record.status === 'completed' ? 'Đã khám xong' : 'Đã check-in'}
        </Tag>
      ),
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          onClick={() => showDrawer(record)}
          icon={<DollarOutlined />}
        >
          Thanh toán
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Thanh toán</Title>
      
      <div className="mb-6">
        <Input.Search
          placeholder="Tìm kiếm bệnh nhân, SĐT, mã hẹn..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className="max-w-lg"
        />
      </div>
      
      <Card title="Danh sách chờ thanh toán" className="mb-6">
        <Table 
          columns={columns} 
          dataSource={filteredAppointments}
          rowKey="id"
          pagination={false}
        />
      </Card>
      
      {/* Payment Drawer */}
      <Drawer
        title="Thanh toán dịch vụ"
        width={700}
        placement="right"
        onClose={closeDrawer}
        open={drawerVisible}
        extra={
          <Space>
            <Text type="secondary">
              {selectedAppointment?.id} - {dayjs().format('DD/MM/YYYY')}
            </Text>
          </Space>
        }
      >
        {selectedAppointment && (
          <div>
            <Steps 
              current={currentStep} 
              className="mb-8"
              items={[
                { title: 'Xác nhận thông tin' },
                { title: 'Phương thức thanh toán' },
                { title: 'Hoàn tất' }
              ]}
            />
            
            {/* Step 1: Confirm Information */}
            {currentStep === 0 && (
              <>
                <div className="mb-6 flex items-center">
                  <Avatar size={64} icon={<UserOutlined />} className="bg-blue-500 mr-4" />
                  <div>
                    <Text className="text-xl font-medium block">{selectedAppointment.patientName}</Text>
                    <Text type="secondary">Mã bệnh nhân: {selectedAppointment.patientId}</Text>
                  </div>
                </div>
                
                <Card title="Chi tiết dịch vụ" className="mb-4">
                  <List
                    dataSource={selectedAppointment.items}
                    renderItem={(item) => (
                      <List.Item key={item.name}>
                        <div className="flex justify-between w-full">
                          <Text>{item.name}</Text>
                          <Text strong>{item.price.toLocaleString('vi-VN')} VND</Text>
                        </div>
                      </List.Item>
                    )}
                  />
                  <Divider />
                  <div className="flex justify-between">
                    <Text strong className="text-lg">Tổng cộng:</Text>
                    <Text strong className="text-lg text-blue-600">
                      {selectedAppointment.totalAmount.toLocaleString('vi-VN')} VND
                    </Text>
                  </div>
                </Card>
                
                <div className="flex justify-end mt-6">
                  <Button type="primary" size="large" onClick={handleNextStep}>
                    Tiếp tục
                  </Button>
                </div>
              </>
            )}
            
            {/* Step 2: Payment Method */}
            {currentStep === 1 && (
              <>
                <Card title="Chọn phương thức thanh toán" className="mb-4">
                  <Radio.Group onChange={handlePaymentMethodChange} value={paymentMethod} size="large">
                    <Space direction="vertical" className="w-full">
                      <Radio value="cash" className="p-4 border rounded-lg w-full flex items-center">
                        <DollarOutlined className="text-green-500 mr-2" /> Tiền mặt
                      </Radio>
                      <Radio value="card" className="p-4 border rounded-lg w-full flex items-center">
                        <CreditCardOutlined className="text-blue-500 mr-2" /> Thẻ ngân hàng (POS)
                      </Radio>
                      <Radio value="transfer" className="p-4 border rounded-lg w-full flex items-center">
                        <BankOutlined className="text-purple-500 mr-2" /> Chuyển khoản ngân hàng
                      </Radio>
                      <Radio value="qr" className="p-4 border rounded-lg w-full flex items-center">
                        <QrcodeOutlined className="text-orange-500 mr-2" /> Quét mã QR
                      </Radio>
                    </Space>
                  </Radio.Group>
                </Card>
                
                {paymentMethod === 'cash' && (
                  <Card title="Thanh toán tiền mặt" className="mb-4">
                    <Form layout="vertical">
                      <Form.Item label="Số tiền nhận" required>
                        <InputNumber
                          style={{ width: '100%' }}
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                          defaultValue={selectedAppointment.totalAmount}
                          min={selectedAppointment.totalAmount}
                          size="large"
                        />
                      </Form.Item>
                      <Form.Item label="Số tiền trả lại">
                        <InputNumber
                          style={{ width: '100%' }}
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                          value={0}
                          disabled
                          size="large"
                        />
                      </Form.Item>
                    </Form>
                  </Card>
                )}
                
                {paymentMethod === 'qr' && (
                  <Card title="Quét mã QR" className="mb-4 text-center">
                    <img 
                      src="https://placehold.co/200x200/png?text=QR+Code" 
                      alt="QR Code"
                      className="mx-auto mb-4"
                    />
                    <Text>Vui lòng quét mã QR để thanh toán số tiền:</Text>
                    <div className="text-xl font-bold my-2">
                      {selectedAppointment.totalAmount.toLocaleString('vi-VN')} VND
                    </div>
                  </Card>
                )}
                
                {paymentMethod === 'transfer' && (
                  <Card title="Thông tin chuyển khoản" className="mb-4">
                    <Descriptions column={1} bordered>
                      <Descriptions.Item label="Ngân hàng">Vietcombank</Descriptions.Item>
                      <Descriptions.Item label="Số tài khoản">1234567890</Descriptions.Item>
                      <Descriptions.Item label="Tên tài khoản">PHÒNG KHÁM GALANT</Descriptions.Item>
                      <Descriptions.Item label="Nội dung">
                        {selectedAppointment.id} {selectedAppointment.patientName}
                      </Descriptions.Item>
                      <Descriptions.Item label="Số tiền">
                        <Text strong>{selectedAppointment.totalAmount.toLocaleString('vi-VN')} VND</Text>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                )}
                
                {paymentMethod === 'card' && (
                  <Card title="Thanh toán qua POS" className="mb-4 text-center">
                    <CreditCardOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                    <p className="my-4">Vui lòng quẹt thẻ qua máy POS để tiếp tục.</p>
                    <Input.Password placeholder="Nhập 4 số cuối của thẻ để xác nhận" className="mb-4" />
                  </Card>
                )}
                
                <div className="flex justify-between mt-6">
                  <Button size="large" onClick={handlePrevStep}>
                    Quay lại
                  </Button>
                  <Button type="primary" size="large" onClick={handleNextStep}>
                    Xác nhận thanh toán
                  </Button>
                </div>
              </>
            )}
            
            {/* Step 3: Complete */}
            {currentStep === 2 && paymentComplete && (
              <Result
                status="success"
                title="Thanh toán thành công!"
                subTitle={`Mã giao dịch: PAY-${Date.now().toString().substr(-6)} | ${dayjs().format('DD/MM/YYYY HH:mm:ss')}`}
                extra={[
                  <Button 
                    type="primary" 
                    key="print" 
                    icon={<PrinterOutlined />}
                    onClick={handlePrintInvoice}
                    size="large"
                  >
                    In hóa đơn
                  </Button>,
                  <Button 
                    key="done" 
                    onClick={closeDrawer}
                    size="large"
                  >
                    Đóng
                  </Button>,
                ]}
              >
                <div className="text-center mb-6">
                  <Text strong>Đã thanh toán: </Text>
                  <Text className="text-xl text-blue-600 font-bold">
                    {selectedAppointment.totalAmount.toLocaleString('vi-VN')} VND
                  </Text>
                </div>
                
                <div className="bg-gray-50 p-4 rounded">
                  <Descriptions column={1} size="small" bordered>
                    <Descriptions.Item label="Bệnh nhân">{selectedAppointment.patientName}</Descriptions.Item>
                    <Descriptions.Item label="Mã bệnh nhân">{selectedAppointment.patientId}</Descriptions.Item>
                    <Descriptions.Item label="Phương thức thanh toán">
                      {paymentMethod === 'cash' && 'Tiền mặt'}
                      {paymentMethod === 'card' && 'Thẻ ngân hàng'}
                      {paymentMethod === 'transfer' && 'Chuyển khoản ngân hàng'}
                      {paymentMethod === 'qr' && 'Quét mã QR'}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </Result>
            )}
            
            {currentStep === 2 && !paymentComplete && (
              <div className="text-center p-10">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <Text className="text-lg">Đang xử lý thanh toán...</Text>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default StaffPayment;
