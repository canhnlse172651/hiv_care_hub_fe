import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Input,
  Button,
  Select,
  Badge,
  Modal,
  Tabs,
  Form,
  Alert,
  Spin,
  Tooltip,
  Space,
  Typography,
  Divider,
  Row,
  Col
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  InfoCircleOutlined, 
  CheckOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  UserOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { treatmentProtocolService } from '@/services/treatmentProtocolService';
import { medicineService } from '@/services/medicineService';

const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text, Paragraph } = Typography;

const ProtocolSelector = ({ 
  patientId, 
  patientDisease, 
  onProtocolSelect, 
  onCustomProtocolCreate,
  selectedProtocol = null,
  customizations = {},
  notes = '',
  onNotesChange = () => {},
  onCustomizationsChange = () => {}
}) => {
  const [protocols, setProtocols] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('recommended');
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [customProtocol, setCustomProtocol] = useState({
    name: '',
    description: '',
    targetDisease: patientDisease || '',
    medicines: []
  });
  const [validationErrors, setValidationErrors] = useState([]);
  const [costEstimate, setCostEstimate] = useState(null);
  const [protocolDetails, setProtocolDetails] = useState(null);

  // Fetch protocols and medicines on component mount
  useEffect(() => {
    fetchProtocols();
    fetchMedicines();
  }, []);

  // Fetch recommended protocols when patient disease changes
  useEffect(() => {
    if (patientDisease) {
      fetchRecommendedProtocols();
    }
  }, [patientDisease]);

  // Calculate cost when protocol or customizations change
  useEffect(() => {
    if (selectedProtocol) {
      calculateProtocolCost();
    }
  }, [selectedProtocol, customizations]);

  const fetchProtocols = async () => {
    try {
      setLoading(true);
      const response = await treatmentProtocolService.getAllTreatmentProtocols({
        page: 1,
        limit: 50,
        targetDisease: patientDisease
      });
      setProtocols(response.data || []);
    } catch (error) {
      console.error('Error fetching protocols:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicines = async () => {
    try {
      const response = await medicineService.getAllMedicines({
        page: 1,
        limit: 100
      });
      setMedicines(response.data || []);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  const fetchRecommendedProtocols = async () => {
    try {
      setLoading(true);
      const response = await treatmentProtocolService.getRecommendedProtocolsForPatient(
        patientId, 
        patientDisease
      );
      // Update protocols with recommended ones first
      setProtocols(response.data || []);
    } catch (error) {
      console.error('Error fetching recommended protocols:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchProtocols = async (query) => {
    if (!query.trim()) {
      fetchProtocols();
      return;
    }
    
    try {
      setLoading(true);
      const response = await treatmentProtocolService.searchTreatmentProtocols(query);
      setProtocols(response.data || []);
    } catch (error) {
      console.error('Error searching protocols:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProtocolSelect = async (protocol) => {
    try {
      // Validate protocol for patient
      const validation = await treatmentProtocolService.validateProtocolForPatient(
        protocol.id, 
        patientId
      );
      
      if (validation.isValid) {
        onProtocolSelect(protocol);
        setValidationErrors([]);
      } else {
        setValidationErrors(validation.errors || []);
      }
    } catch (error) {
      console.error('Error validating protocol:', error);
      setValidationErrors(['Error validating protocol for patient']);
    }
  };

  const calculateProtocolCost = async () => {
    if (!selectedProtocol) return;
    
    try {
      const costData = await treatmentProtocolService.calculateProtocolCostForPatient(
        selectedProtocol.id,
        patientId,
        customizations
      );
      setCostEstimate(costData);
    } catch (error) {
      console.error('Error calculating cost:', error);
    }
  };

  const handleCustomProtocolCreate = async () => {
    try {
      const newProtocol = await treatmentProtocolService.createCustomProtocolFromTreatment(
        null, // treatmentId will be null for new custom protocol
        customProtocol,
        localStorage.getItem('userId')
      );
      
      onCustomProtocolCreate(newProtocol);
      setShowCustomDialog(false);
      setCustomProtocol({
        name: '',
        description: '',
        targetDisease: patientDisease || '',
        medicines: []
      });
    } catch (error) {
      console.error('Error creating custom protocol:', error);
    }
  };

  const addMedicineToCustomProtocol = () => {
    setCustomProtocol(prev => ({
      ...prev,
      medicines: [...prev.medicines, {
        medicineId: '',
        dosage: '',
        durationValue: 1,
        durationUnit: 'DAY',
        notes: ''
      }]
    }));
  };

  const updateCustomProtocolMedicine = (index, field, value) => {
    setCustomProtocol(prev => ({
      ...prev,
      medicines: prev.medicines.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const removeMedicineFromCustomProtocol = (index) => {
    setCustomProtocol(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index)
    }));
  };

  const getFilteredProtocols = () => {
    if (selectedTab === 'recommended') {
      return protocols.filter(p => p.targetDisease === patientDisease);
    } else if (selectedTab === 'all') {
      return protocols;
    } else if (selectedTab === 'popular') {
      return protocols.slice(0, 10); // Show top 10 for popular
    }
    return protocols;
  };

  const renderProtocolCard = (protocol) => {
    const isSelected = selectedProtocol?.id === protocol.id;
    const hasCustomizations = customizations[protocol.id];
    
    return (
      <Card 
        key={protocol.id} 
        className={`cursor-pointer transition-all hover:shadow-md ${
          isSelected ? 'ring-2 ring-primary' : ''
        }`}
        onClick={() => handleProtocolSelect(protocol)}
        style={{ marginBottom: 16 }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Title level={5} style={{ margin: 0 }}>
                {protocol.name}
              </Title>
              {protocol.isRecommended && (
                <Badge color="blue" text="Recommended" />
              )}
            </div>
            <Text type="secondary">
              {protocol.description}
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <Badge color="default" text={protocol.targetDisease} />
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <MedicineBoxOutlined />
              <span>{protocol.medicines?.length || 0} medicines</span>
            </div>
            {costEstimate && isSelected && (
              <div className="flex items-center gap-1 text-green-600">
                <DollarOutlined />
                <span className="font-medium">
                  ${costEstimate.totalCost?.toFixed(2)}
                </span>
              </div>
            )}
          </div>
          
          {protocol.medicines && protocol.medicines.length > 0 && (
            <div className="mt-2">
              <Text type="secondary" className="text-xs">Medicines:</Text>
              <div className="space-y-1">
                {protocol.medicines.slice(0, 3).map((med, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="truncate flex-1">
                      {med.medicine?.name || `Medicine ${med.medicineId}`}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      {med.dosage} - {med.durationValue} {med.durationUnit}
                    </span>
                  </div>
                ))}
                {protocol.medicines.length > 3 && (
                  <Text type="secondary" className="text-xs">
                    +{protocol.medicines.length - 3} more
                  </Text>
                )}
              </div>
            </div>
          )}
          
          {hasCustomizations && (
            <Alert
              message="Customized for this patient"
              type="info"
              showIcon
              className="mt-2"
            />
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Title level={4}>Select Treatment Protocol</Title>
          <Text type="secondary">
            Choose a protocol suitable for {patientDisease || 'the patient'}
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowCustomDialog(true)}
        >
          Custom Protocol
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search protocols..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            searchProtocols(e.target.value);
          }}
          prefix={<SearchOutlined />}
          style={{ flex: 1 }}
        />
        <Select
          value={selectedTab}
          onChange={setSelectedTab}
          style={{ width: 200 }}
        >
          <Option value="recommended">Recommended</Option>
          <Option value="popular">Popular</Option>
          <Option value="all">All Protocols</Option>
        </Select>
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
          className="mb-4"
        />
      )}

      {/* Protocols Grid */}
      <Row gutter={[16, 16]}>
        {loading ? (
          <Col span={24} className="text-center py-8">
            <Spin size="large" />
            <p className="text-sm text-muted-foreground mt-2">Loading protocols...</p>
          </Col>
        ) : getFilteredProtocols().length > 0 ? (
          getFilteredProtocols().map(renderProtocolCard)
        ) : (
          <Col span={24} className="text-center py-8">
            <InfoCircleOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
            <p className="text-muted-foreground">No protocols found</p>
          </Col>
        )}
      </Row>

      {/* Selected Protocol Details */}
      {selectedProtocol && (
        <Card className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckOutlined style={{ color: '#52c41a' }} />
            <Title level={5} style={{ margin: 0 }}>
              Selected Protocol: {selectedProtocol.name}
            </Title>
          </div>
          <div className="space-y-4">
            <Row gutter={16}>
              <Col span={12}>
                <Text strong>Description</Text>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedProtocol.description || 'No description available'}
                </p>
              </Col>
              <Col span={12}>
                <Text strong>Target Disease</Text>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedProtocol.targetDisease}
                </p>
              </Col>
            </Row>
            
            {costEstimate && (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarOutlined style={{ color: '#52c41a' }} />
                  <Text strong>Cost Estimate</Text>
                </div>
                <Row gutter={16}>
                  <Col span={12}>
                    <Text type="secondary">Total Cost:</Text>
                    <Text strong className="ml-2">${costEstimate.totalCost?.toFixed(2)}</Text>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">Duration:</Text>
                    <Text strong className="ml-2">
                      {costEstimate.estimatedDuration || 'N/A'}
                    </Text>
                  </Col>
                </Row>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Notes Section */}
      <div className="space-y-2">
        <Text strong>Treatment Notes</Text>
        <Input.TextArea
          placeholder="Add notes and instructions for the patient..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={4}
        />
      </div>

      {/* Custom Protocol Modal */}
      <Modal
        title="Create Custom Treatment Protocol"
        open={showCustomDialog}
        onCancel={() => setShowCustomDialog(false)}
        onOk={handleCustomProtocolCreate}
        width={800}
        okButtonProps={{
          disabled: !customProtocol.name || customProtocol.medicines.length === 0
        }}
      >
        <div className="space-y-6">
          <Row gutter={16}>
            <Col span={12}>
              <Text strong>Protocol Name</Text>
              <Input
                value={customProtocol.name}
                onChange={(e) => setCustomProtocol(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                placeholder="Enter protocol name"
                className="mt-1"
              />
            </Col>
            <Col span={12}>
              <Text strong>Target Disease</Text>
              <Input
                value={customProtocol.targetDisease}
                onChange={(e) => setCustomProtocol(prev => ({
                  ...prev,
                  targetDisease: e.target.value
                }))}
                placeholder="Enter target disease"
                className="mt-1"
              />
            </Col>
          </Row>
          
          <div>
            <Text strong>Description</Text>
            <Input.TextArea
              value={customProtocol.description}
              onChange={(e) => setCustomProtocol(prev => ({
                ...prev,
                description: e.target.value
              }))}
              placeholder="Enter protocol description"
              rows={3}
              className="mt-1"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <Text strong>Medicines</Text>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={addMedicineToCustomProtocol}
              >
                Add Medicine
              </Button>
            </div>
            
            <div className="space-y-4">
              {customProtocol.medicines.map((medicine, index) => (
                <Card key={index} size="small">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text strong>Medicine</Text>
                      <Select
                        value={medicine.medicineId.toString()}
                        onChange={(value) => updateCustomProtocolMedicine(
                          index, 'medicineId', parseInt(value)
                        )}
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
                    
                    <Col span={6}>
                      <Text strong>Dosage</Text>
                      <Input
                        value={medicine.dosage}
                        onChange={(e) => updateCustomProtocolMedicine(
                          index, 'dosage', e.target.value
                        )}
                        placeholder="e.g., 500mg"
                        className="mt-1"
                      />
                    </Col>
                    
                    <Col span={6}>
                      <Row gutter={8}>
                        <Col span={12}>
                          <Text strong>Duration</Text>
                          <Input
                            type="number"
                            value={medicine.durationValue}
                            onChange={(e) => updateCustomProtocolMedicine(
                              index, 'durationValue', parseInt(e.target.value)
                            )}
                            min="1"
                            className="mt-1"
                          />
                        </Col>
                        <Col span={12}>
                          <Text strong>Unit</Text>
                          <Select
                            value={medicine.durationUnit}
                            onChange={(value) => updateCustomProtocolMedicine(
                              index, 'durationUnit', value
                            )}
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
                    <Input
                      value={medicine.notes}
                      onChange={(e) => updateCustomProtocolMedicine(
                        index, 'notes', e.target.value
                      )}
                      placeholder="Optional notes"
                      className="mt-1"
                    />
                  </div>
                  
                  <Button
                    type="text"
                    danger
                    icon={<EditOutlined />}
                    onClick={() => removeMedicineFromCustomProtocol(index)}
                    className="mt-2"
                  >
                    Remove Medicine
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProtocolSelector; 