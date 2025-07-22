import React from 'react';
import { Modal, Form, DatePicker, InputNumber, Button, Table } from 'antd';
import dayjs from 'dayjs';

const GenerateScheduleModal = ({ 
  open, 
  onCancel, 
  onSubmit, 
  loading, 
  result, 
  onManualAssign 
}) => {
  const [form] = Form.useForm();

  // Only allow Mondays in DatePicker
  const disabledDate = (current) => current && current.day() !== 1;

  const handleSubmit = async (values) => {
    const success = await onSubmit(values);
    if (success) {
      // Don't close modal to show results
    }
  };

  return (
    <Modal
      title="Generate Doctor Schedule"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="startDate"
          label="Start Date (Monday only)"
          rules={[{ required: true, message: 'Please select a start date' }]}
        >
          <DatePicker disabledDate={disabledDate} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="doctorsPerShift"
          label="Doctors Per Shift"
          rules={[{ required: true, message: 'Please enter number of doctors per shift' }]}
        >
          <InputNumber min={1} max={100} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Generate
          </Button>
        </Form.Item>
      </Form>
      
      {result && (
        <div style={{ marginTop: 24 }}>
          <p><b>{result.message}</b></p>
          <p>Total Assigned Shifts: {result.totalAssignedShifts}</p>
          <p>Remaining Shifts: {result.remainingShifts}</p>
          {result.shiftsNeedingDoctors?.length > 0 && (
            <>
              <p>Shifts Needing Doctors:</p>
              <Table
                columns={[
                  { title: 'Date', dataIndex: 'date', key: 'date', render: d => d?.slice(0, 10) },
                  { title: 'Day', dataIndex: 'dayOfWeek', key: 'dayOfWeek' },
                  { title: 'Shift', dataIndex: 'shift', key: 'shift' },
                  { title: 'Action', key: 'action', render: (_, record) => (
                    <Button size="small" onClick={() => onManualAssign(record)}>
                      Manual Assign
                    </Button>
                  ) },
                ]}
                dataSource={result.shiftsNeedingDoctors}
                rowKey={(_, idx) => idx}
                pagination={false}
                size="small"
              />
            </>
          )}
        </div>
      )}
    </Modal>
  );
};

export default GenerateScheduleModal;
