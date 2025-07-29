import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Descriptions, Divider, Button, Spin, message, Image, Card, Tag } from 'antd';
import { DollarOutlined, QrcodeOutlined, BankOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const OrderModal = ({ 
  visible, 
  onCancel, 
  onConfirm, 
  appointment, 
  loading = false,
  orderService
}) => {
  const [form] = Form.useForm();
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);

  // Pre-fill form when appointment changes
  React.useEffect(() => {
    if (appointment && visible) {
      form.setFieldsValue({
        notes: `Đơn hàng khám và điều trị - ${appointment.patientName} - ${appointment.department}`
      });
      // Reset order state when modal opens
      setOrderCreated(false);
      setOrderData(null);
      setOrderStatus(null);
    }
  }, [appointment, visible, form]);

  // Polling for order status
  useEffect(() => {
    if (orderData?.id && orderStatus !== 'COMPLETED' && orderStatus !== 'CANCELLED') {
      const interval = setInterval(async () => {
        try {
          const response = await orderService.getOrderById(orderData.id);
          const newStatus = response.data?.orderStatus;
          setOrderStatus(newStatus);
          
          if (newStatus === 'COMPLETED' || newStatus === 'CANCELLED') {
            clearInterval(interval);
            setPollingInterval(null);
          }
        } catch (error) {
          console.error('Error polling order status:', error);
        }
      }, 5000); // Poll every 5 seconds
      
      setPollingInterval(interval);
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [orderData?.id, orderStatus, orderService]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  // Auto-close modal after payment success
  useEffect(() => {
    if ((orderStatus === 'COMPLETED' || orderStatus === 'PAID') && visible) {
      const timer = setTimeout(() => {
        handleCancel();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [orderStatus, visible]);

  const handleConfirm = async () => {
    try {
      const values = await form.validateFields();
      const result = await onConfirm(values);
      if (result) {
        setOrderData(result);
        setOrderCreated(true);
        setOrderStatus(result.orderStatus);
      }
    } catch (error) {
      message.error('Vui lòng kiểm tra lại thông tin');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setOrderCreated(false);
    setOrderData(null);
    setOrderStatus(null);
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
    onCancel();
  };

  if (!appointment) return null;

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <DollarOutlined className="text-green-500" />
          <span>Tạo mã thanh toán</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={!orderCreated ? [
        <Button key="cancel" onClick={handleCancel}>
          Hủy bỏ
        </Button>,
        <Button 
          key="confirm" 
          type="primary" 
          loading={loading}
          onClick={handleConfirm}
          className="bg-green-500 hover:bg-green-600 border-none"
        >
          Tạo mã thanh toán
        </Button>
      ] : null}
      width={700}
      destroyOnClose
      style={{ top: 60 }} // Move modal up a bit
    >
      <Spin spinning={loading}>
        {!orderCreated ? (
          <>
            {/* Order Preview */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Thông tin đơn hàng</h3>
              <Descriptions bordered column={1} size="small" className="mb-4">
                <Descriptions.Item label="Bệnh nhân">
                  <span className="font-medium">{appointment.patientName}</span>
                </Descriptions.Item>
                <Descriptions.Item label="Mã lịch hẹn">
                  {appointment.id}
                </Descriptions.Item>
                <Descriptions.Item label="Dịch vụ">
                  {appointment.department}
                </Descriptions.Item>
                <Descriptions.Item label="Chi phí">
                  <span className="font-semibold text-green-600">
                    {appointment.price ? `${appointment.price.toLocaleString()} VNĐ` : 'Chưa xác định'}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Phương thức thanh toán">
                  <span className="text-blue-600 font-medium">Chuyển khoản ngân hàng</span>
                </Descriptions.Item>
              </Descriptions>
            </div>

            <Divider />

            {/* Order Details
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Chi tiết đơn hàng</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{appointment.department}</span>
                  <span className="text-gray-600">SL: 1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Đơn giá:</span>
                  <span className="font-semibold">
                    {appointment.price ? `${appointment.price.toLocaleString()} VNĐ` : 'Chưa xác định'}
                  </span>
                </div>
                <Divider className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">Tổng cộng:</span>
                  <span className="font-bold text-lg text-green-600">
                    {appointment.price ? `${appointment.price.toLocaleString()} VNĐ` : 'Chưa xác định'}
                  </span>
                </div>
              </div>
            </div> */}

            <Divider />

            {/* Notes Form */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Ghi chú</h3>
              <Form form={form} layout="vertical">
                <Form.Item
                  name="notes"
                  label="Ghi chú đơn hàng"
                  rules={[
                    { required: true, message: 'Vui lòng nhập ghi chú cho đơn hàng' }
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Nhập ghi chú cho đơn hàng..."
                    className="rounded-lg"
                  />
                </Form.Item>
              </Form>
            </div>
          </>
        ) : (
          <>
            {/* Order Status */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Trạng thái đơn hàng</h3>
                <Tag 
                  color={orderStatus === 'COMPLETED' || orderStatus === 'PAID' ? 'green' : orderStatus === 'CANCELLED' ? 'red' : 'orange'}
                  icon={orderStatus === 'COMPLETED' || orderStatus === 'PAID' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                >
                  {orderStatus === 'COMPLETED' || orderStatus === 'PAID' ? 'Đã thanh toán' : 
                   orderStatus === 'CANCELLED' ? 'Đã hủy' : 'Chờ thanh toán'}
                </Tag>
              </div>
            </div>

            <Divider />

            {/* Order Details */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Chi tiết đơn hàng</h3>
              <Card className="bg-gray-50">
                {orderData.orderDetails?.map((item, index) => (
                  <div key={index} className="mb-3 last:mb-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-600">SL: {item.quantity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Đơn giá:</span>
                      <span className="font-semibold">{item.unitPrice?.toLocaleString()} VNĐ</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Thành tiền:</span>
                      <span className="font-semibold text-green-600">{item.totalPrice?.toLocaleString()} VNĐ</span>
                    </div>
                    {index < orderData.orderDetails.length - 1 && <Divider className="my-2" />}
                  </div>
                ))}
              </Card>
            </div>

            <Divider />

            {/* Payment QR Code or Success */}
            {orderStatus === 'COMPLETED' || orderStatus === 'PAID' ? (
              <div className="mb-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircleOutlined className="text-green-600 text-4xl" />
                </div>
                <div className="text-lg font-semibold text-green-700 mb-2">Thanh toán hoàn tất</div>
                <div className="text-gray-500">Đang trở về...</div>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                  <QrcodeOutlined className="mr-2" />
                  Mã QR thanh toán
                </h3>
                <div className="text-center">
                  <Image
                    src={orderData.paymentUrl}
                    alt="QR Code"
                    width={200}
                    height={200}
                    className="border rounded-lg shadow-md"
                  />
                  <p className="text-sm text-gray-600 mt-2">Quét mã QR để thanh toán</p>
                </div>
              </>
            )}

            <Divider />

            {/* Bank Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                <BankOutlined className="mr-2" />
                Thông tin chuyển khoản
              </h3>
              <Card className="bg-blue-50 border-blue-200">
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Ngân hàng">
                    <span className="font-semibold">{orderData.bankInfo?.bankName}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số tài khoản">
                    <span className="font-mono font-semibold">{orderData.bankInfo?.accountNumber}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tên tài khoản">
                    <span className="font-semibold">{orderData.bankInfo?.accountName}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số tiền">
                    <span className="font-semibold text-green-600">{orderData.bankInfo?.amount} VNĐ</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Nội dung chuyển khoản">
                    <span className="font-mono text-blue-600">{orderData.bankInfo?.content}</span>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </div>
          </>
        )}
      </Spin>
    </Modal>
  );
};

export default OrderModal;