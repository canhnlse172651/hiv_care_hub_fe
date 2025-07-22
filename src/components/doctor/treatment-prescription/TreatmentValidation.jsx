import React, { useState, useEffect } from 'react';
import { 
  Card, Alert, Button, Space, Tag, Typography, 
  Descriptions, Timeline, Progress, Modal, Form,
  Input, Select, DatePicker, message, Spin
} from 'antd';
import {
  CheckOutlined, 
  SafetyOutlined, 
  WarningOutlined,
  InfoCircleOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  UserOutlined
} from '@ant-design/icons';
import { patientTreatmentService } from '@/services/patientTreatmentService';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const TreatmentValidation = ({ 
  patientId, 
  protocolId, 
  doctorId, 
  onValidationComplete,
  showModal = false,
  onModalClose 
}) => {
  const [loading, setLoading] = useState(false);
  const [validationResults, setValidationResults] = useState({});
  const [businessRulesCheck, setBusinessRulesCheck] = useState(null);
  const [doctorAuthorization, setDoctorAuthorization] = useState(null);
  const [organFunctionValidation, setOrganFunctionValidation] = useState(null);
  const [pregnancySafetyValidation, setPregnancySafetyValidation] = useState(null);
  const [resistancePatternValidation, setResistancePatternValidation] = useState(null);
  const [adherenceValidation, setAdherenceValidation] = useState(null);
  const [viralLoadValidation, setViralLoadValidation] = useState(null);
  const [continuityValidation, setContinuityValidation] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (patientId && protocolId && doctorId) {
      runValidations();
    }
  }, [patientId, protocolId, doctorId]);

  const runValidations = async () => {
    setLoading(true);
    try {
      const validations = {};

      // Business rules check
      if (patientId) {
        try {
          const businessRules = await patientTreatmentService.quickBusinessRulesCheck(patientId);
          setBusinessRulesCheck(businessRules);
          validations.businessRules = businessRules;
        } catch (error) {
          console.error('Business rules check failed:', error);
        }
      }

      // Doctor authorization check
      if (doctorId && protocolId) {
        try {
          const authCheck = await patientTreatmentService.validateDoctorProtocolAuthorization(doctorId, protocolId);
          setDoctorAuthorization(authCheck);
          validations.doctorAuthorization = authCheck;
        } catch (error) {
          console.error('Doctor authorization check failed:', error);
        }
      }

      // Treatment continuity check
      if (patientId) {
        try {
          const continuityCheck = await patientTreatmentService.validateTreatmentContinuity(patientId, new Date());
          setContinuityValidation(continuityCheck);
          validations.continuity = continuityCheck;
        } catch (error) {
          console.error('Treatment continuity check failed:', error);
        }
      }

      setValidationResults(validations);
      if (onValidationComplete) {
        onValidationComplete(validations);
      }
    } catch (error) {
      message.error('Không thể thực hiện kiểm tra phác đồ điều trị');
      console.error('Validation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrganFunctionValidation = async (values) => {
    try {
      const result = await patientTreatmentService.validateOrganFunction(
        {
          alt: values.alt,
          ast: values.ast,
          bilirubin: values.bilirubin
        },
        {
          creatinine: values.creatinine,
          egfr: values.egfr
        },
        protocolId
      );
      setOrganFunctionValidation(result);
      message.success('Kiểm tra chức năng cơ quan hoàn thành');
    } catch (error) {
      message.error('Không thể kiểm tra chức năng cơ quan');
    }
  };

  const handlePregnancySafetyValidation = async (values) => {
    try {
      const result = await patientTreatmentService.validatePregnancySafety(
        values.patientGender,
        values.isPregnant,
        values.isBreastfeeding,
        protocolId
      );
      setPregnancySafetyValidation(result);
      message.success('Kiểm tra an toàn thai kỳ hoàn thành');
    } catch (error) {
      message.error('Không thể kiểm tra an toàn thai kỳ');
    }
  };

  const handleResistancePatternValidation = async (values) => {
    try {
      const result = await patientTreatmentService.validateResistancePattern(
        {
          mutations: values.mutations?.split(',').map(m => m.trim()) || [],
          resistanceLevel: values.resistanceLevel,
          previousFailedRegimens: values.previousFailedRegimens?.split(',').map(r => r.trim()) || []
        },
        protocolId
      );
      setResistancePatternValidation(result);
      message.success('Kiểm tra mẫu kháng thuốc hoàn thành');
    } catch (error) {
      message.error('Không thể kiểm tra mẫu kháng thuốc');
    }
  };

  const handleAdherenceValidation = async (values) => {
    try {
      const result = await patientTreatmentService.validateTreatmentAdherence({
        pillsMissed: values.pillsMissed,
        totalPills: values.totalPills,
        recentAdherencePattern: values.recentAdherencePattern?.split(',').map(p => parseInt(p.trim())) || []
      });
      setAdherenceValidation(result);
      message.success('Kiểm tra tuân thủ điều trị hoàn thành');
    } catch (error) {
      message.error('Không thể kiểm tra tuân thủ điều trị');
    }
  };

  const getOverallValidationStatus = () => {
    const checks = [
      businessRulesCheck?.hasActiveViolations === false,
      doctorAuthorization?.isAuthorized === true,
      continuityValidation?.isContinuous !== false
    ];
    
    const passedChecks = checks.filter(Boolean).length;
    const totalChecks = checks.length;
    
    return {
      passed: passedChecks,
      total: totalChecks,
      percentage: (passedChecks / totalChecks) * 100,
      isValid: passedChecks === totalChecks
    };
  };

  const overallStatus = getOverallValidationStatus();

  const validationContent = (
    <div className="space-y-4">
      {/* Overall Status */}
      <Card title="Tổng quan kiểm tra phác đồ điều trị">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Title level={4} className="mb-2">
              {overallStatus.isValid ? 'Phác đồ hợp lệ' : 'Phác đồ cần kiểm tra'}
            </Title>
            <Text type="secondary">
              {overallStatus.passed}/{overallStatus.total} kiểm tra đã vượt qua
            </Text>
          </div>
          <Progress
            type="circle"
            percent={overallStatus.percentage}
            format={(percent) => `${Math.round(percent)}%`}
            strokeColor={overallStatus.isValid ? '#52c41a' : '#faad14'}
          />
        </div>
      </Card>

      {/* Business Rules Check */}
      {businessRulesCheck && (
        <Alert
          message="Kiểm tra quy tắc kinh doanh"
          description={
            <div>
              <p><strong>Trạng thái:</strong> {businessRulesCheck.hasActiveViolations ? 'Vi phạm' : 'Hợp lệ'}</p>
              <p><strong>Khuyến nghị:</strong> {businessRulesCheck.recommendation}</p>
            </div>
          }
          type={businessRulesCheck.hasActiveViolations ? 'warning' : 'success'}
          showIcon
        />
      )}

      {/* Doctor Authorization */}
      {doctorAuthorization && (
        <Alert
          message="Phân quyền bác sĩ"
          description={
            <div>
              <p><strong>Trạng thái:</strong> {doctorAuthorization.isAuthorized ? 'Được phép' : 'Không được phép'}</p>
              <p><strong>Cấp độ bác sĩ:</strong> {doctorAuthorization.doctorLevel}</p>
              <p><strong>Độ phức tạp phác đồ:</strong> {doctorAuthorization.protocolComplexity}</p>
              {doctorAuthorization.requirements?.length > 0 && (
                <p><strong>Yêu cầu:</strong> {doctorAuthorization.requirements.join(', ')}</p>
              )}
            </div>
          }
          type={doctorAuthorization.isAuthorized ? 'success' : 'error'}
          showIcon
        />
      )}

      {/* Treatment Continuity */}
      {continuityValidation && (
        <Alert
          message="Kiểm tra tính liên tục điều trị"
          description={
            <div>
              <p><strong>Trạng thái:</strong> {continuityValidation.isContinuous ? 'Liên tục' : 'Có khoảng trống'}</p>
              {continuityValidation.gapDays && (
                <p><strong>Số ngày trống:</strong> {continuityValidation.gapDays} ngày</p>
              )}
              <p><strong>Mức độ rủi ro:</strong> {continuityValidation.riskLevel?.toUpperCase()}</p>
              {continuityValidation.recommendations?.length > 0 && (
                <p><strong>Khuyến nghị:</strong> {continuityValidation.recommendations.join(', ')}</p>
              )}
            </div>
          }
          type={continuityValidation.isContinuous ? 'success' : 'warning'}
          showIcon
        />
      )}

      {/* Additional Validation Results */}
      {organFunctionValidation && (
        <Alert
          message="Kiểm tra chức năng cơ quan"
          description={
            <div>
              <p><strong>Trạng thái:</strong> {organFunctionValidation.isValid ? 'Hợp lệ' : 'Cần theo dõi'}</p>
              <p><strong>Khuyến nghị:</strong> {organFunctionValidation.recommendations?.join(', ')}</p>
            </div>
          }
          type={organFunctionValidation.isValid ? 'success' : 'warning'}
          showIcon
        />
      )}

      {pregnancySafetyValidation && (
        <Alert
          message="Kiểm tra an toàn thai kỳ"
          description={
            <div>
              <p><strong>Trạng thái:</strong> {pregnancySafetyValidation.isSafe ? 'An toàn' : 'Cần thận trọng'}</p>
              <p><strong>Khuyến nghị:</strong> {pregnancySafetyValidation.recommendations?.join(', ')}</p>
            </div>
          }
          type={pregnancySafetyValidation.isSafe ? 'success' : 'warning'}
          showIcon
        />
      )}

      {resistancePatternValidation && (
        <Alert
          message="Kiểm tra mẫu kháng thuốc"
          description={
            <div>
              <p><strong>Trạng thái:</strong> {resistancePatternValidation.isCompatible ? 'Tương thích' : 'Cần điều chỉnh'}</p>
              <p><strong>Khuyến nghị:</strong> {resistancePatternValidation.recommendations?.join(', ')}</p>
            </div>
          }
          type={resistancePatternValidation.isCompatible ? 'success' : 'warning'}
          showIcon
        />
      )}

      {adherenceValidation && (
        <Alert
          message="Kiểm tra tuân thủ điều trị"
          description={
            <div>
              <p><strong>Trạng thái:</strong> {adherenceValidation.isCompliant ? 'Tuân thủ tốt' : 'Cần cải thiện'}</p>
              <p><strong>Khuyến nghị:</strong> {adherenceValidation.recommendations?.join(', ')}</p>
            </div>
          }
          type={adherenceValidation.isCompliant ? 'success' : 'warning'}
          showIcon
        />
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        <Button onClick={runValidations} loading={loading}>
          Làm mới kiểm tra
        </Button>
        <Button 
          type="primary" 
          disabled={!overallStatus.isValid}
          onClick={() => {
            if (onValidationComplete) {
              onValidationComplete(validationResults);
            }
          }}
        >
          Xác nhận phác đồ
        </Button>
      </div>
    </div>
  );

  if (showModal) {
    return (
      <Modal
        title="Kiểm tra phác đồ điều trị"
        open={showModal}
        onCancel={onModalClose}
        footer={null}
        width={800}
      >
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Spin size="large" />
          </div>
        ) : (
          validationContent
        )}
      </Modal>
    );
  }

  return (
    <Card title="Kiểm tra phác đồ điều trị" className="mb-4">
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Spin size="large" />
        </div>
      ) : (
        validationContent
      )}
    </Card>
  );
};

export default TreatmentValidation;