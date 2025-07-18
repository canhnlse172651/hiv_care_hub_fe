import React, { useEffect } from 'react';
import { Typography, Button, Spin, Card, Avatar } from 'antd';
import { UserOutlined, PhoneOutlined, SafetyCertificateOutlined, ArrowLeftOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { doctorService } from '@/services/doctorService';

const { Title, Text } = Typography;

const DoctorSelection = ({ 
  selectedDate, 
  selectedSlot, 
  doctors, 
  setDoctors, 
  selectedDoctor, 
  setSelectedDoctor, 
  handleConfirmBooking, 
  loading, 
  setLoading,
  setCurrentStep
}) => {
  useEffect(() => {
    if (!selectedDate) return;
    setLoading(true);
    doctorService.getDoctorsByDate(selectedDate.format('YYYY-MM-DD'))
      .then(res => {
        setDoctors(res.data || []);
      })
      .finally(() => setLoading(false));
  }, [selectedDate, setDoctors, setLoading]);

  // Remove the filtering logic that's preventing doctors from showing
  // The API already returns available doctors for the selected date
  const filteredDoctors = doctors;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <Title level={2} className="text-gray-900 mb-4">
          Chọn bác sĩ
        </Title>
        <Text className="text-lg text-gray-600">
          Chọn bác sĩ phù hợp cho cuộc hẹn của bạn
        </Text>
        <div className="mt-4 text-sm text-gray-500">
          Ngày: <span className="font-semibold">{selectedDate?.format('DD/MM/YYYY')}</span> | 
          Khung giờ: <span className="font-semibold">{selectedSlot?.start} - {selectedSlot?.end}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" indicator={<LoadingOutlined className="text-4xl text-blue-500" />} />
          <Text className="ml-4 text-lg text-gray-600">Đang tải danh sách bác sĩ...</Text>
        </div>
      ) : (
        <>
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-4">
                <UserOutlined className="text-6xl text-gray-300" />
              </div>
              <Title level={4} className="text-gray-500">
                Không có bác sĩ nào khả dụng
              </Title>
              <Text className="text-gray-400">
                Vui lòng chọn ngày và khung giờ khác
              </Text>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredDoctors.map(doc => (
                <div
                  key={doc.id}
                  className={`
                    relative group cursor-pointer transition-all duration-300
                    ${selectedDoctor?.id === doc.id 
                      ? 'transform -translate-y-2' 
                      : 'hover:transform hover:-translate-y-1'
                    }
                  `}
                  onClick={() => setSelectedDoctor(doc)}
                >
                  <Card
                    className={`
                      h-full border-2 rounded-2xl shadow-lg transition-all duration-300
                      ${selectedDoctor?.id === doc.id 
                        ? 'border-blue-500 shadow-blue-100 shadow-2xl' 
                        : 'border-gray-100 hover:border-gray-200 hover:shadow-xl'
                      }
                    `}
                    bodyStyle={{ padding: '2rem' }}
                  >
                    {/* Selection indicator */}
                    {selectedDoctor?.id === doc.id && (
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircleOutlined className="text-white text-lg" />
                      </div>
                    )}

                    {/* Doctor Avatar */}
                    <div className="flex justify-center mb-6">
                      <Avatar 
                        size={80} 
                        icon={<UserOutlined />}
                        className={`
                          ${selectedDoctor?.id === doc.id 
                            ? 'bg-blue-500' 
                            : 'bg-gray-100 text-gray-500'
                          }
                        `}
                      />
                    </div>

                    {/* Doctor Info */}
                    <div className="text-center space-y-3">
                      <Title level={4} className="text-gray-900 mb-2">
                        {doc.user?.name}
                      </Title>
                      
                      <div className="flex items-center justify-center text-gray-600">
                        <PhoneOutlined className="mr-2" />
                        <Text>{doc.user?.phoneNumber}</Text>
                      </div>
                      
                      <div className="flex items-center justify-center text-gray-600">
                        <SafetyCertificateOutlined className="mr-2" />
                        <Text className="text-sm">{doc.specialization}</Text>
                      </div>
                      
                      {doc.certifications && doc.certifications.length > 0 && (
                        <div className="text-center">
                          <Text className="text-xs text-gray-500">
                            Bằng cấp: {doc.certifications.join(', ')}
                          </Text>
                        </div>
                      )}
                    </div>

                    {/* Confirm button */}
                    {selectedDoctor?.id === doc.id && (
                      <div className="mt-6">
                        <Button 
                          type="primary" 
                          size="large"
                          loading={loading}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirmBooking();
                          }}
                          className="w-full bg-blue-500 hover:bg-blue-600 border-none rounded-xl h-12 font-semibold"
                        >
                          Xác nhận đặt lịch
                        </Button>
                      </div>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Navigation */}
      <div className="flex justify-center mt-12">
        <Button 
          size="large" 
          onClick={() => setCurrentStep(1)}
          className="flex items-center px-6 py-3 h-12 rounded-xl"
        >
          <ArrowLeftOutlined className="mr-2" /> Quay lại
        </Button>
      </div>
    </div>
  );
};

export default DoctorSelection;
