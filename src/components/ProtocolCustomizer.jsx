import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Input,
  Button,
  Select,
  Badge,
  Alert,
  Spin,
  Tooltip,
  Space,
  Typography,
  Divider,
  Row,
  Col,
  Switch,
  Modal
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  InfoCircleOutlined, 
  CheckOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';
import { medicineService } from '@/services/medicineService';

const { Option } = Select;
const { Text, Title } = Typography;

const ProtocolCustomizer = ({ 
  selectedProtocol, 
  onCustomizationChange,
  customizations = {},
  patientId,
  onSaveCustomization,
  onResetCustomization
}) => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showOriginal, setShowOriginal] = useState(true);
  const [customizationNotes, setCustomizationNotes] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [costComparison, setCostComparison] = useState(null);

  useEffect(() => {
    if (selectedProtocol) {
      fetchMedicines();
      calculateCostComparison();
    }
  }, [selectedProtocol, customizations]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await medicineService.getAllMedicines({
        page: 1,
        limit: 200
      });
      setMedicines(response.data || []);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCostComparison = async () => {
    if (!selectedProtocol) return;
    
    try {
      // Calculate original cost
      const originalCost = selectedProtocol.medicines?.reduce((total, med) => {
        const medicine = medicines.find(m => m.id === med.medicineId);
        return total + (medicine?.price || 0);
      }, 0) || 0;

      // Calculate customized cost
      const customizedCost = Object.values(customizations).reduce((total, customization) => {
        return total + (customization.cost || 0);
      }, 0);

      setCostComparison({
        original: originalCost,
        customized: customizedCost,
        difference: customizedCost - originalCost
      });
    } catch (error) {
      console.error('Error calculating cost comparison:', error);
    }
  };

  const addCustomMedicine = () => {
    const newCustomization = {
      medicineId: '',
      dosage: '',
      durationValue: 1,
      durationUnit: 'DAY',
      notes: '',
      isCustom: true,
      cost: 0
    };
    
    onCustomizationChange({
      ...customizations,
      [`custom_${Date.now()}`]: newCustomization
    });
  };

  const updateCustomization = (key, field, value) => {
    const updatedCustomizations = {
      ...customizations,
      [key]: {
        ...customizations[key],
        [field]: value
      }
    };
    
    // Recalculate cost if medicine or dosage changed
    if (field === 'medicineId' || field === 'dosage') {
      const medicine = medicines.find(m => m.id === value);
      if (medicine) {
        updatedCustomizations[key].cost = medicine.price;
      }
    }
    
    onCustomizationChange(updatedCustomizations);
  };

  const removeCustomization = (key) => {
    const updatedCustomizations = { ...customizations };
    delete updatedCustomizations[key];
    onCustomizationChange(updatedCustomizations);
  };

  const replaceMedicine = (originalMedicine, newMedicineId) => {
    const medicine = medicines.find(m => m.id === newMedicineId);
    if (medicine) {
      updateCustomization(originalMedicine.id, 'medicineId', newMedicineId);
      updateCustomization(originalMedicine.id, 'dosage', originalMedicine.dosage);
      updateCustomization(originalMedicine.id, 'cost', medicine.price);
    }
  };

  const modifyDosage = (medicineId, newDosage) => {
    updateCustomization(medicineId, 'dosage', newDosage);
  };

  const addNote = (medicineId, note) => {
    updateCustomization(medicineId, 'notes', note);
  };

  const renderOriginalMedicine = (medicine, index) => {
    const customization = customizations[medicine.id];
    const isCustomized = !!customization;
    
    return (
      <Card key={index} style={{ marginBottom: 16, border: isCustomized ? '2px solid #1890ff' : '1px solid #d9d9d9' }}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Title level={5} style={{ margin: 0 }}>
                {medicine.medicine?.name || `Medicine ${medicine.medicineId}`}
              </Title>
              {isCustomized && (
                <Badge color="blue" text="Modified" />
              )}
            </div>
            <Text type="secondary">
              Original: {medicine.dosage} - {medicine.durationValue} {medicine.durationUnit}
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip title={isCustomized ? 'Reset to original' : 'Customize this medicine'}>
              <Button
                type="text"
                icon={isCustomized ? <EditOutlined /> : <EditOutlined />}
                onClick={() => {
                  if (isCustomized) {
                    removeCustomization(medicine.id);
                  } else {
                    updateCustomization(medicine.id, 'medicineId', medicine.medicineId);
                    updateCustomization(medicine.id, 'dosage', medicine.dosage);
                    updateCustomization(medicine.id, 'durationValue', medicine.durationValue);
                    updateCustomization(medicine.id, 'durationUnit', medicine.durationUnit);
                  }
                }}
              />
            </Tooltip>
          </div>
        </div>
        
        {isCustomized ? (
          <div className="mt-4">
            <Row gutter={16}>
              <Col span={8}>
                <Text strong>Medicine</Text>
                <Select
                  value={customization.medicineId?.toString() || ''}
                  onChange={(value) => replaceMedicine(medicine, parseInt(value))}
                  placeholder="Select medicine"
                  className="w-full mt-1"
                >
                  {medicines.map((med) => (
                    <Option key={med.id} value={med.id.toString()}>
                      {med.name} - {med.dose}
                    </Option>
                  ))}
                </Select>
              </Col>
              
              <Col span={8}>
                <Text strong>Dosage</Text>
                <Input
                  value={customization.dosage || ''}
                  onChange={(e) => modifyDosage(medicine.id, e.target.value)}
                  placeholder="e.g., 500mg"
                  className="mt-1"
                />
              </Col>
              
              <Col span={8}>
                <Row gutter={8}>
                  <Col span={12}>
                    <Text strong>Duration</Text>
                    <Input
                      type="number"
                      value={customization.durationValue || 1}
                      onChange={(e) => updateCustomization(medicine.id, 'durationValue', parseInt(e.target.value))}
                      min="1"
                      className="mt-1"
                    />
                  </Col>
                  <Col span={12}>
                    <Text strong>Unit</Text>
                    <Select
                      value={customization.durationUnit || 'DAY'}
                      onChange={(value) => updateCustomization(medicine.id, 'durationUnit', value)}
                      className="mt-1"
                    >
                      <Option value="DAY">Days</Option>
                      <Option value="WEEK">Weeks</Option>
                      <Option value="MONTH">Months</Option>
                      <Option value="YEAR">Years</Option>
                    </Select>
                  </Col>
                </Row>
              </Col>
            </Row>
            
            <div className="mt-4">
              <Text strong>Notes</Text>
              <Input.TextArea
                value={customization.notes || ''}
                onChange={(e) => addNote(medicine.id, e.target.value)}
                placeholder="Add notes for this medicine..."
                rows={2}
                className="mt-1"
              />
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground mt-2">
            Click edit to customize this medicine
          </div>
        )}
      </Card>
    );
  };

  const renderCustomMedicine = (key, customization) => {
    return (
      <Card key={key} style={{ marginBottom: 16, border: '2px solid #52c41a' }}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Title level={5} style={{ margin: 0 }}>Custom Medicine</Title>
              <Badge color="green" text="Added" />
            </div>
          </div>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => removeCustomization(key)}
          />
        </div>
        
        <div className="mt-4">
          <Row gutter={16}>
            <Col span={8}>
              <Text strong>Medicine</Text>
              <Select
                value={customization.medicineId?.toString() || ''}
                onChange={(value) => updateCustomization(key, 'medicineId', parseInt(value))}
                placeholder="Select medicine"
                className="w-full mt-1"
              >
                {medicines.map((med) => (
                  <Option key={med.id} value={med.id.toString()}>
                    {med.name} - {med.dose}
                  </Option>
                ))}
              </Select>
            </Col>
            
            <Col span={8}>
              <Text strong>Dosage</Text>
              <Input
                value={customization.dosage || ''}
                onChange={(e) => updateCustomization(key, 'dosage', e.target.value)}
                placeholder="e.g., 500mg"
                className="mt-1"
              />
            </Col>
            
            <Col span={8}>
              <Row gutter={8}>
                <Col span={12}>
                  <Text strong>Duration</Text>
                  <Input
                    type="number"
                    value={customization.durationValue || 1}
                    onChange={(e) => updateCustomization(key, 'durationValue', parseInt(e.target.value))}
                    min="1"
                    className="mt-1"
                  />
                </Col>
                <Col span={12}>
                  <Text strong>Unit</Text>
                  <Select
                    value={customization.durationUnit || 'DAY'}
                    onChange={(value) => updateCustomization(key, 'durationUnit', value)}
                    className="mt-1"
                  >
                    <Option value="DAY">Days</Option>
                    <Option value="WEEK">Weeks</Option>
                    <Option value="MONTH">Months</Option>
                    <Option value="YEAR">Years</Option>
                  </Select>
                </Col>
              </Row>
            </Col>
          </Row>
          
          <div className="mt-4">
            <Text strong>Notes</Text>
            <Input.TextArea
              value={customization.notes || ''}
              onChange={(e) => updateCustomization(key, 'notes', e.target.value)}
              placeholder="Add notes for this medicine..."
              rows={2}
              className="mt-1"
            />
          </div>
        </div>
      </Card>
    );
  };

  if (!selectedProtocol) {
    return (
      <Card>
        <div className="text-center py-8">
          <InfoCircleOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
          <p className="text-muted-foreground">Please select a protocol to customize</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Title level={4}>Customize Protocol</Title>
          <Text type="secondary">
            Modify {selectedProtocol.name} for this patient
          </Text>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={showOriginal}
              onChange={setShowOriginal}
            />
            <Text>Show Original</Text>
          </div>
          <Button
            icon={<EditOutlined />}
            onClick={onResetCustomization}
          >
            Reset All
          </Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={onSaveCustomization}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Cost Comparison */}
      {costComparison && (
        <Alert
          message="Cost Comparison"
          description={
            <div className="flex items-center justify-between">
              <span>Cost Comparison:</span>
              <div className="flex items-center gap-4 text-sm">
                <span>Original: ${costComparison.original.toFixed(2)}</span>
                <span>Customized: ${costComparison.customized.toFixed(2)}</span>
                <span className={`font-medium ${
                  costComparison.difference > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {costComparison.difference > 0 ? '+' : ''}${costComparison.difference.toFixed(2)}
                </span>
              </div>
            </div>
          }
          type="info"
          showIcon
          icon={<DollarOutlined />}
        />
      )}

      {/* Original Protocol Medicines */}
      {showOriginal && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Title level={5}>Original Protocol Medicines</Title>
            <Badge count={selectedProtocol.medicines?.length || 0} />
          </div>
          
          <div className="space-y-4">
            {selectedProtocol.medicines?.map((medicine, index) => 
              renderOriginalMedicine(medicine, index)
            )}
          </div>
        </div>
      )}

      {/* Custom Medicines */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Title level={5}>Custom Medicines</Title>
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addCustomMedicine}
          >
            Add Medicine
          </Button>
        </div>
        
        <div className="space-y-4">
          {Object.entries(customizations)
            .filter(([key, customization]) => customization.isCustom)
            .map(([key, customization]) => 
              renderCustomMedicine(key, customization)
            )}
        </div>
      </div>

      {/* Customization Notes */}
      <div className="space-y-2">
        <Text strong>Customization Notes</Text>
        <Input.TextArea
          placeholder="Add notes about why this protocol was customized..."
          value={customizationNotes}
          onChange={(e) => setCustomizationNotes(e.target.value)}
          rows={4}
        />
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert
          message="Validation Errors"
          description={
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          }
          type="error"
          showIcon
        />
      )}
    </div>
  );
};

export default ProtocolCustomizer; 