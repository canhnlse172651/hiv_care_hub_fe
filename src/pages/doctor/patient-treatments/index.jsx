import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Tag, Divider, List, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { patientTreatmentService } from '@/services/patientTreatmentService';

const { Title, Text } = Typography;

const labelStyle = { color: '#555', fontWeight: 500, marginRight: 4 };
const valueStyle = { color: '#222', fontWeight: 600 };

const PatientTreatmentsPage = () => {
  const { userId } = useParams();
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTreatments = async () => {
      setLoading(true);
      try {
        const res = await patientTreatmentService.getPatientTreatmentsByPatientId(userId);
        setTreatments(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (e) {
        setTreatments([]);
      }
      setLoading(false);
    };
    if (userId) fetchTreatments();
  }, [userId]);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <Title level={3} style={{ color: '#2563eb', marginBottom: 0 }}>
        Phác đồ điều trị của bệnh nhân
      </Title>
      <Divider style={{ margin: '16px 0 32px 0' }} />
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {(!Array.isArray(treatments) || treatments.length === 0) && (
            <Col span={24}>
              <Card className="shadow-md rounded-xl text-center">
                <Text type="secondary" style={{ fontSize: 18 }}>
                  Không có phác đồ điều trị nào cho bệnh nhân này.
                </Text>
              </Card>
            </Col>
          )}
          {Array.isArray(treatments) && treatments.map(treatment => (
            <Col span={24} key={treatment.id}>
              <Card
                title={
                  <span style={{ fontWeight: 700, color: '#0ea5e9', fontSize: 20 }}>
                    Mã điều trị: {treatment.id}
                  </span>
                }
                bordered={false}
                className="shadow-lg rounded-2xl"
                style={{ marginBottom: 24 }}
              >
                <Row gutter={32} style={{ marginBottom: 12 }}>
                  <Col xs={24} md={12} style={{ marginBottom: 8 }}>
                    <div>
                      <span style={{ color: '#555', fontWeight: 500, marginRight: 4 }}>Bệnh nhân:</span>
                      <span style={{ color: '#222', fontWeight: 600 }}>{treatment.patient?.name}</span>
                    </div>
                    <div>
                      <span style={{ color: '#555', fontWeight: 500, marginRight: 4 }}>Email:</span>
                      <span style={{ color: '#222', fontWeight: 600 }}>{treatment.patient?.email}</span>
                    </div>
                  </Col>
                  <Col xs={24} md={12} style={{ marginBottom: 8 }}>
                    <div>
                      <span style={{ color: '#555', fontWeight: 500, marginRight: 4 }}>Bác sĩ:</span>
                      <span style={{ color: '#222', fontWeight: 600 }}>{treatment.doctor?.user?.name}</span>
                    </div>
                    <div>
                      <span style={{ color: '#555', fontWeight: 500, marginRight: 4 }}>Chuyên khoa:</span>
                      <span style={{ color: '#222', fontWeight: 600 }}>{treatment.doctor?.specialization}</span>
                    </div>
                  </Col>
                  {/* Divider between doctor/specialization and protocol/disease */}
                  <Col span={24}>
                    <Divider style={{ margin: '8px 0' }} />
                  </Col>
                  <Col xs={24} md={8} style={{ marginBottom: 8 }}>
                    <div>
                      <span style={{ color: '#555', fontWeight: 500, marginRight: 4 }}>Phác đồ:</span>
                      <span style={{ color: '#222', fontWeight: 600 }}>{treatment.protocol?.name}</span>
                    </div>
                    <div>
                      <span style={{ color: '#555', fontWeight: 500, marginRight: 4 }}>Bệnh lý:</span>
                      <span style={{ color: '#222', fontWeight: 600 }}>{treatment.protocol?.targetDisease}</span>
                    </div>
                  </Col>
                </Row>
                <Divider style={{ margin: '12px 0' }} />
                <Row gutter={32} style={{ marginBottom: 12 }}>
                  <Col xs={24} md={8}>
                    <span style={labelStyle}>Ngày bắt đầu:</span>
                    <span style={valueStyle}>
                      {treatment.startDate ? new Date(treatment.startDate).toLocaleDateString() : '-'}
                    </span>
                  </Col>
                  <Col xs={24} md={8}>
                    <span style={labelStyle}>Ngày kết thúc:</span>
                    <span style={valueStyle}>
                      {treatment.endDate ? new Date(treatment.endDate).toLocaleDateString() : '-'}
                    </span>
                  </Col>
                  <Col xs={24} md={8}>
                    <span style={labelStyle}>Trạng thái:</span>
                    <Tag color={treatment.isCurrent ? 'green' : 'default'} style={{ fontWeight: 600 }}>
                      {treatment.isCurrent ? 'Đang điều trị' : 'Đã kết thúc'}
                    </Tag>
                  </Col>
                </Row>
                <Divider style={{ margin: '12px 0' }} />
                <Row gutter={32} style={{ marginBottom: 12 }}>
                  <Col xs={24} md={12}>
                    <Text strong style={{ color: '#0ea5e9' }}>Thuốc trong phác đồ:</Text>
                    <List
                      size="small"
                      dataSource={treatment.protocol?.medicines || []}
                      renderItem={item => (
                        <List.Item>
                          <Text>
                            <span style={valueStyle}>{item.medicine?.name}</span>
                            {` - ${item.dosage} - ${item.durationValue} ${item.durationUnit} - ${item.schedule}`}
                          </Text>
                        </List.Item>
                      )}
                      locale={{ emptyText: <span style={{ color: '#aaa' }}>Không có</span> }}
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <Text strong style={{ color: '#f59e42' }}>Thuốc tùy chỉnh:</Text>
                    <List
                      size="small"
                      dataSource={treatment.customMedications || []}
                      renderItem={item => (
                        <List.Item>
                          <Text>
                            <span style={valueStyle}>{item.medicineName}</span>
                            {` - ${item.dosage} - ${item.durationValue} ${item.durationUnit} - ${item.frequency}`}
                          </Text>
                        </List.Item>
                      )}
                      locale={{ emptyText: <span style={{ color: '#aaa' }}>Không có</span> }}
                    />
                  </Col>
                </Row>
                <Divider style={{ margin: '12px 0' }} />
                <Row style={{ marginBottom: 12 }}>
                  <Col span={24}>
                    <Text strong style={labelStyle}>Ghi chú:</Text>{' '}
                    <span style={valueStyle}>{treatment.notes || <span style={{ color: '#aaa' }}>Không có</span>}</span>
                  </Col>
                </Row>
                <Divider style={{ margin: '12px 0' }} />
                <Row gutter={32}>
                  <Col xs={24} md={8}>
                    <span style={labelStyle}>Tổng chi phí:</span>
                    <span style={{ ...valueStyle, color: '#16a34a' }}>
                      {treatment.total?.toLocaleString() || 0} VNĐ
                    </span>
                  </Col>
                  <Col xs={24} md={8}>
                    <span style={labelStyle}>Người tạo:</span>
                    <span style={valueStyle}>{treatment.createdBy?.name}</span>
                  </Col>
                  <Col xs={24} md={8}>
                    <span style={labelStyle}>Ngày tạo:</span>
                    <span style={valueStyle}>
                      {treatment.createdAt ? new Date(treatment.createdAt).toLocaleString() : '-'}
                    </span>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default PatientTreatmentsPage;