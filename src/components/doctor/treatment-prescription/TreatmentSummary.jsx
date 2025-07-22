import React from 'react';
import { Card, Typography, Alert, Input } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import CostSummary from './CostSummary';

const { Title, Text } = Typography;

const TreatmentSummary = ({ 
  selectedProtocol,
  costSummary,
  validationResult,
  treatmentNotes,
  setTreatmentNotes,
  currentStep
}) => {
  return (
    <Card>
      <Title level={4}>
        <InfoCircleOutlined className="mr-2" />
        Summary
      </Title>

      {/* Selected Protocol */}
      {selectedProtocol && (
        <div className="mb-4">
          <Text strong>Selected Protocol:</Text>
          <div className="mt-2 p-3 bg-blue-50 rounded">
            <Text strong>{selectedProtocol.name}</Text>
            <div className="text-sm text-gray-600 mt-1">
              {selectedProtocol.description}
            </div>
          </div>
        </div>
      )}

      {/* Cost Summary */}
      <CostSummary costSummary={costSummary} />

      {/* Validation Status */}
      {validationResult && (
        <div className="mb-4">
          <Text strong>Validation Status:</Text>
          <div className="mt-2">
            {validationResult.isValid ? (
              <Alert
                message="Valid"
                description="Treatment protocol is valid for this patient"
                type="success"
                showIcon
              />
            ) : (
              <Alert
                message="Issues Found"
                description={validationResult.issues?.join(', ')}
                type="warning"
                showIcon
              />
            )}
          </div>
        </div>
      )}

      {/* Treatment Notes */}
      {currentStep === 4 && (
        <div className="mb-4">
          <Text strong>Treatment Notes:</Text>
          <div className="mt-2">
            <Input.TextArea
              rows={3}
              placeholder="Add notes..."
              value={treatmentNotes}
              onChange={(e) => setTreatmentNotes(e.target.value)}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default TreatmentSummary;
