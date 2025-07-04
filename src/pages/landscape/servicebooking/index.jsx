import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography, message, Card, Button, Modal, Divider } from 'antd'
import { MedicineBoxOutlined, CalendarOutlined, ClockCircleOutlined, UserOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { handleShowModal } from '@/store/Reducer/authReducer'
import { MODAL_TYPE } from '@/constant/general'
import { localToken } from '@/utils/token'
import { servicesService } from "@/services/servicesService"
import { ServiceType } from '@/constant/general';
import { appointmentService } from '@/services/appointmentService';
import dayjs from 'dayjs';

// Import components
import ServiceSelection from './components/ServiceSelection';
import DateSlotSelection from './components/DateSlotSelection';
import DoctorSelection from './components/DoctorSelection';
import ProgressSteps from './components/ProgressSteps';

const { Title, Paragraph, Text } = Typography

const ServiceBooking = () => {
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [services, setServices] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Check for authentication
  useEffect(() => {
    const authToken = localToken.get()?.accessToken;
    if (authToken || profile) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [profile]);

  // Fetch services
  const fetchServices = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await servicesService.getPublicServices({ page, limit: 10, search });
      if (response.data?.data) {
        setServices(response.data.data.data);
        setMeta(response.data.data.meta);
      }
    } catch (error) {
      message.error("Failed to fetch services. Please try again.");
      console.error("Service fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(1, searchTerm);
  }, [searchTerm]);

  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedDate || !selectedSlot) {
      message.error("Vui lòng chọn đầy đủ thông tin!");
      return;
    }
    
    // Validate doctor selection for non-CONSULT services
    if (selectedService.type !== ServiceType.CONSULT && !selectedDoctor) {
      message.error("Vui lòng chọn bác sĩ!");
      return;
    }
    
    setShowConfirmModal(true);
  };

  const confirmBooking = async () => {
    const user = JSON.parse(localStorage.getItem('auth'));
    const userId = user?.user?.id;
    const [hour, minute] = selectedSlot.start.split(':');
    const dateStr = dayjs.isDayjs(selectedDate) ? selectedDate.format('YYYY-MM-DD') : dayjs(selectedDate).format('YYYY-MM-DD');
    const appointmentTime = `${dateStr}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:00Z`;
    const isAnonymous = selectedService.type === ServiceType.CONSULT;
    const appointmentType = selectedService.type === ServiceType.CONSULT ? 'ONLINE' : 'OFFLINE';
    
    const payload = {
      userId,
      doctorId: selectedService.type === ServiceType.CONSULT ? null : selectedDoctor.id,
      serviceId: selectedService.id,
      appointmentTime,
      isAnonymous,
      type: appointmentType,
      notes: null,
    };
    
    setLoading(true);
    try {
      await appointmentService.createAppointment(payload);
      message.success("Đặt lịch thành công!");
      setShowConfirmModal(false);
      navigate('/patient/appointments');
    } catch (err) {
      message.error("Đặt lịch thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // If not authenticated, show minimal content
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ">
        <div className="container mx-auto p-4 md:p-8">
          <Card className="max-w-md mx-auto text-center shadow-2xl rounded-2xl border-0">
            <div className="p-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MedicineBoxOutlined className="text-3xl text-blue-500" />
              </div>
              <Title level={3} className="text-gray-900 mb-4">Đặt lịch khám</Title>
              <Paragraph className="text-gray-600 mb-6">
                Vui lòng đăng nhập để sử dụng dịch vụ đặt lịch khám
              </Paragraph>
              <Button 
                type="primary" 
                size="large"
                className="w-full h-12 bg-blue-500 hover:bg-blue-600 border-none rounded-xl font-semibold"
                onClick={() => dispatch(handleShowModal(MODAL_TYPE.login))}
              >
                Đăng nhập
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Progress Steps */}
        <ProgressSteps currentStep={currentStep} selectedService={selectedService} />
        
        {/* Step Content */}
        <div className="min-h-[600px]">
          {currentStep === 0 && (
            <ServiceSelection
              services={services}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
              setAvailableSlots={setAvailableSlots}
              setCurrentStep={setCurrentStep}
            />
          )}
          
          {currentStep === 1 && (
            <DateSlotSelection
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              availableSlots={availableSlots}
              selectedSlot={selectedSlot}
              setSelectedSlot={setSelectedSlot}
              setCurrentStep={setCurrentStep}
              selectedService={selectedService}
              handleConfirmBooking={handleConfirmBooking}
            />
          )}
          
          {currentStep === 2 && selectedService?.type !== ServiceType.CONSULT && (
            <DoctorSelection
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              doctors={doctors}
              setDoctors={setDoctors}
              selectedDoctor={selectedDoctor}
              setSelectedDoctor={setSelectedDoctor}
              handleConfirmBooking={handleConfirmBooking}
              loading={loading}
              setLoading={setLoading}
              setCurrentStep={setCurrentStep}
            />
          )}
        </div>

        {/* Confirm Modal */}
        <Modal
          title={null}
          open={showConfirmModal}
          onOk={confirmBooking}
          onCancel={() => setShowConfirmModal(false)}
          confirmLoading={loading}
          okText="Xác nhận đặt lịch"
          cancelText="Hủy bỏ"
          centered
          width={600}
          className="custom-confirm-modal"
          okButtonProps={{
            size: 'large',
            className: 'h-12 bg-blue-500 hover:bg-blue-600 border-none rounded-lg font-semibold px-8'
          }}
          cancelButtonProps={{
            size: 'large',
            className: 'h-12 border-gray-300 rounded-lg font-semibold px-8'
          }}
        >
          <div className="p-6">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleOutlined className="text-3xl text-blue-500" />
              </div>
              <Title level={3} className="text-gray-900 mb-2">
                Xác nhận đặt lịch khám
              </Title>
              <Text className="text-gray-600">
                Vui lòng kiểm tra thông tin trước khi xác nhận
              </Text>
            </div>

            {/* Appointment Details */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-6">
              {/* Service */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MedicineBoxOutlined className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <Text className="text-sm text-gray-500 block">Dịch vụ</Text>
                  <Text strong className="text-lg text-gray-900">
                    {selectedService?.name}
                  </Text>
                  {selectedService?.description && (
                    <Text className="text-sm text-gray-600 block mt-1">
                      {selectedService.description}
                    </Text>
                  )}
                </div>
              </div>

              <Divider className="my-4" />

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CalendarOutlined className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <Text className="text-sm text-gray-500 block">Ngày khám</Text>
                    <Text strong className="text-base text-gray-900">
                      {selectedDate?.format('dddd, DD/MM/YYYY')}
                    </Text>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ClockCircleOutlined className="text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <Text className="text-sm text-gray-500 block">Giờ khám</Text>
                    <Text strong className="text-base text-gray-900">
                      {selectedSlot?.start} - {selectedSlot?.end}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Doctor (if not CONSULT) */}
              {selectedService?.type !== ServiceType.CONSULT && selectedDoctor && (
                <>
                  <Divider className="my-4" />
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <UserOutlined className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <Text className="text-sm text-gray-500 block">Bác sĩ phụ trách</Text>
                      <Text strong className="text-base text-gray-900">
                        {selectedDoctor.user?.name}
                      </Text>
                      {selectedDoctor.specialization && (
                        <Text className="text-sm text-gray-600 block mt-1">
                          Chuyên khoa: {selectedDoctor.specialization}
                        </Text>
                      )}
                    </div>
                  </div>
                </>
              )}

              <Divider className="my-4" />

              {/* Appointment Type */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div>
                  <Text className="text-sm text-gray-500 block">Loại hình khám</Text>
                  <Text strong className="text-base text-gray-900">
                    {selectedService?.type === ServiceType.CONSULT ? 'Tư vấn trực tuyến' : 'Khám tại phòng khám'}
                  </Text>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedService?.type === ServiceType.CONSULT 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {selectedService?.type === ServiceType.CONSULT ? 'Online' : 'Offline'}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </main>
  )
}

export default ServiceBooking