import React, { useEffect, useState } from "react";
import { Table, Tag, Spin, Alert, Empty } from "antd";
import { appointmentService } from "@/services/appointmentService";
import { useSelector } from "react-redux";

const AppointmentDoctorPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get doctorId from profile (assuming you store it in Redux)
  const { profile } = useSelector((state) => state.auth);
  const doctorId = profile?.id;

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!doctorId) {
        setAppointments([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await appointmentService.getAppointmentsByDoctorId(doctorId);
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        // If 404, treat as empty table, else show error
        if (err?.response?.status === 404) {
          setAppointments([]);
        } else {
          setError("Không thể tải danh sách lịch hẹn.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [doctorId]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Bệnh nhân",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Dịch vụ",
      dataIndex: "serviceId",
      key: "serviceId",
    },
    {
      title: "Thời gian",
      dataIndex: "appointmentTime",
      key: "appointmentTime",
      render: (text) => text ? new Date(text).toLocaleString() : "",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type) => type === "OFFLINE" ? "Trực tiếp" : "Trực tuyến",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        if (status === "PENDING") color = "orange";
        else if (status === "CONFIRMED") color = "green";
        else if (status === "CANCELLED") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
      render: (text) => text || "-",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => text ? new Date(text).toLocaleString() : "",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin tip="Đang tải lịch hẹn..." />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <Alert type="error" message={error} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-6">Danh sách lịch hẹn của bác sĩ</h2>
      <Table
        dataSource={appointments}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        locale={{
          emptyText: (
            <Empty
              description="Không có lịch hẹn nào"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
      />
    </div>
  );
};

export default AppointmentDoctorPage;