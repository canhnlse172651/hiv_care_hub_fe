# HIV Care Hub - Patient Treatment Implementation

## Tổng quan

Đây là tài liệu mô tả việc implement logic quản lý phác đồ điều trị cho bệnh nhân HIV trong hệ thống HIV Care Hub Frontend. Implementation này tích hợp với backend API để cung cấp đầy đủ chức năng quản lý điều trị cho bác sĩ.

## Cấu trúc Implementation

### 1. Services Layer

#### `src/services/patientTreatmentService.js`
Service chính để tương tác với backend API patient treatment:

**Các chức năng chính:**
- `createPatientTreatment()` - Tạo phác đồ điều trị mới
- `getAllPatientTreatments()` - Lấy danh sách tất cả phác đồ điều trị
- `getPatientTreatmentById()` - Lấy chi tiết phác đồ điều trị theo ID
- `updatePatientTreatment()` - Cập nhật phác đồ điều trị
- `deletePatientTreatment()` - Xóa phác đồ điều trị
- `getActivePatientTreatments()` - Lấy danh sách phác đồ đang hoạt động
- `getPatientTreatmentsByPatientId()` - Lấy phác đồ theo bệnh nhân
- `getPatientTreatmentsByDoctorId()` - Lấy phác đồ theo bác sĩ
- `searchPatientTreatments()` - Tìm kiếm phác đồ điều trị
- `getTreatmentsWithCustomMedications()` - Lấy phác đồ có thuốc tùy chỉnh

**Các chức năng thống kê và phân tích:**
- `getPatientTreatmentStats()` - Thống kê theo bệnh nhân
- `getDoctorWorkloadStats()` - Thống kê khối lượng công việc bác sĩ
- `getCustomMedicationStats()` - Thống kê thuốc tùy chỉnh
- `getGeneralTreatmentStats()` - Thống kê tổng quan
- `compareProtocolVsCustomTreatments()` - So sánh phác đồ chuẩn vs tùy chỉnh
- `getTreatmentComplianceStats()` - Thống kê tuân thủ điều trị
- `getTreatmentCostAnalysis()` - Phân tích chi phí điều trị

**Các chức năng validation:**
- `validateDoctorProtocolAuthorization()` - Kiểm tra phân quyền bác sĩ
- `validateOrganFunction()` - Kiểm tra chức năng cơ quan
- `validatePregnancySafety()` - Kiểm tra an toàn thai kỳ
- `validateResistancePattern()` - Kiểm tra mẫu kháng thuốc
- `validateTreatmentAdherence()` - Kiểm tra tuân thủ điều trị
- `validateViralLoadMonitoring()` - Kiểm tra theo dõi tải lượng virus
- `validateTreatmentContinuity()` - Kiểm tra tính liên tục điều trị
- `validateEmergencyProtocol()` - Kiểm tra phác đồ khẩn cấp
- `quickBusinessRulesCheck()` - Kiểm tra nhanh quy tắc kinh doanh

**Các chức năng quản lý:**
- `detectBusinessRuleViolations()` - Phát hiện vi phạm quy tắc
- `fixBusinessRuleViolations()` - Sửa vi phạm quy tắc
- `endActivePatientTreatments()` - Kết thúc điều trị đang hoạt động
- `calculateTreatmentCost()` - Tính toán chi phí điều trị

### 2. Pages Implementation

#### `src/pages/doctor/patient-treatments.jsx`
Trang quản lý phác đồ điều trị cho bác sĩ:

**Tính năng chính:**
- Hiển thị danh sách phác đồ điều trị với phân trang
- Tìm kiếm và lọc theo trạng thái (tất cả, đang điều trị, có thuốc tùy chỉnh)
- Tạo phác đồ điều trị mới
- Xem chi tiết phác đồ điều trị
- Kết thúc điều trị đang hoạt động
- Xóa phác đồ điều trị
- Kiểm tra quy tắc kinh doanh
- Thống kê khối lượng công việc bác sĩ

**Giao diện:**
- Bảng hiển thị với các cột: Mã điều trị, Bệnh nhân, Phác đồ, Ngày bắt đầu/kết thúc, Trạng thái, Thuốc tùy chỉnh, Chi phí, Thao tác
- Modal tạo phác đồ mới với form validation
- Drawer xem chi tiết phác đồ
- Thống kê tổng quan với các card metrics

#### `src/pages/doctor/treatment-analytics.jsx`
Trang phân tích và thống kê điều trị:

**Tính năng chính:**
- Thống kê tổng quan: tổng điều trị, đang điều trị, bệnh nhân, chi phí
- Thống kê theo bác sĩ: khối lượng công việc, bệnh nhân duy nhất
- Phân tích thuốc tùy chỉnh: tỷ lệ sử dụng, thuốc phổ biến
- Kiểm tra tuân thủ điều trị theo bệnh nhân
- Phát hiện vi phạm quy tắc kinh doanh
- Xu hướng hàng tháng
- Phác đồ phổ biến nhất
- Phân tích thời gian điều trị

**Giao diện:**
- Tabs để chuyển đổi giữa các loại thống kê
- Cards hiển thị metrics
- Bảng vi phạm quy tắc với actions
- Timeline khuyến nghị cải thiện
- Progress bars và charts

### 3. Components

#### `src/components/TreatmentValidation.jsx`
Component tái sử dụng để kiểm tra phác đồ điều trị:

**Tính năng:**
- Kiểm tra quy tắc kinh doanh
- Kiểm tra phân quyền bác sĩ
- Kiểm tra tính liên tục điều trị
- Kiểm tra chức năng cơ quan (tùy chọn)
- Kiểm tra an toàn thai kỳ (tùy chọn)
- Kiểm tra mẫu kháng thuốc (tùy chọn)
- Kiểm tra tuân thủ điều trị (tùy chọn)

**Props:**
- `patientId` - ID bệnh nhân
- `protocolId` - ID phác đồ
- `doctorId` - ID bác sĩ
- `onValidationComplete` - Callback khi validation hoàn thành
- `showModal` - Hiển thị dưới dạng modal
- `onModalClose` - Callback đóng modal

### 4. Enhanced Consultation Page

#### `src/pages/doctor/consultation.jsx`
Trang khám bệnh được nâng cấp với tích hợp patient treatment:

**Tính năng mới:**
- Tích hợp với patient treatment service
- Kiểm tra quy tắc kinh doanh real-time
- Tính toán chi phí điều trị preview
- Validation phác đồ trước khi tạo
- Tạo phác đồ điều trị tự động sau khi hoàn thành khám
- Hiển thị phác đồ điều trị hiện tại của bệnh nhân
- Kiểm tra phân quyền bác sĩ

**Giao diện mới:**
- Alert hiển thị kết quả kiểm tra quy tắc kinh doanh
- Alert hiển thị validation phác đồ
- Alert hiển thị dự tính chi phí
- Section hiển thị phác đồ điều trị hiện tại

## Routes Configuration

### App.jsx Updates
```javascript
// Doctor Pages
import PatientTreatmentsPage from "./pages/doctor/patient-treatments";
import TreatmentAnalyticsPage from "./pages/doctor/treatment-analytics";

// Doctor Routes
<Route path="patient-treatments" element={<PatientTreatmentsPage />} />
<Route path="treatment-analytics" element={<TreatmentAnalyticsPage />} />
```

## Business Logic Implementation

### 1. Quy tắc kinh doanh (Business Rules)
- **Single Protocol Rule**: Mỗi bệnh nhân chỉ được có 1 phác đồ điều trị đang hoạt động
- **Date Validation**: Ngày bắt đầu phải trước ngày kết thúc
- **Active Treatment Check**: Kiểm tra xung đột với điều trị đang hoạt động

### 2. Validation Logic
- **Doctor Authorization**: Kiểm tra bác sĩ có quyền sử dụng phác đồ không
- **Treatment Continuity**: Kiểm tra tính liên tục giữa các phác đồ
- **Organ Function**: Kiểm tra chức năng gan, thận trước khi dùng thuốc
- **Pregnancy Safety**: Kiểm tra an toàn cho phụ nữ có thai/cho con bú
- **Resistance Pattern**: Kiểm tra mẫu kháng thuốc
- **Adherence**: Kiểm tra tuân thủ điều trị

### 3. Cost Calculation
- Tính toán chi phí dựa trên phác đồ và thuốc tùy chỉnh
- Hỗ trợ preview chi phí trước khi tạo phác đồ
- Breakdown chi phí theo protocol và custom medications

## API Integration

### Backend Endpoints Used
```
GET    /patient-treatments                    - Lấy danh sách phác đồ
POST   /patient-treatments                    - Tạo phác đồ mới
GET    /patient-treatments/:id                - Lấy chi tiết phác đồ
PUT    /patient-treatments/:id                - Cập nhật phác đồ
DELETE /patient-treatments/:id                - Xóa phác đồ
GET    /patient-treatments/active             - Lấy phác đồ đang hoạt động
GET    /patient-treatments/patient/:patientId - Lấy theo bệnh nhân
GET    /patient-treatments/doctor/:doctorId   - Lấy theo bác sĩ
GET    /patient-treatments/search             - Tìm kiếm phác đồ
GET    /patient-treatments/custom-medications - Lấy có thuốc tùy chỉnh

GET    /patient-treatments/stats/patient/:id  - Thống kê theo bệnh nhân
GET    /patient-treatments/stats/doctor/:id   - Thống kê theo bác sĩ
GET    /patient-treatments/analytics/*        - Các endpoint phân tích

POST   /patient-treatments/validate-*         - Các endpoint validation
POST   /patient-treatments/calculate-cost     - Tính toán chi phí
POST   /patient-treatments/end-active/:id     - Kết thúc điều trị
```

## Error Handling

### 1. Service Level
- Try-catch blocks cho tất cả API calls
- Error logging với console.error
- User-friendly error messages

### 2. Component Level
- Loading states cho async operations
- Error boundaries cho critical operations
- Graceful fallbacks cho missing data

### 3. Validation Level
- Real-time validation feedback
- Form validation với Ant Design
- Business rule violation alerts

## State Management

### 1. Local State
- `useState` cho component-specific state
- `useEffect` cho side effects và API calls
- Form state management với Ant Design Form

### 2. Redux Integration
- User information từ Redux store
- Authentication state
- Role-based access control

## Security Considerations

### 1. Role-based Access
- Doctor routes protected với `DoctorRoute` component
- API calls include authentication headers
- User ID validation cho sensitive operations

### 2. Data Validation
- Input validation trên frontend
- Server-side validation confirmation
- XSS prevention với proper data sanitization

## Performance Optimizations

### 1. API Calls
- Debounced search functionality
- Pagination cho large datasets
- Caching cho frequently accessed data

### 2. UI/UX
- Loading states cho better UX
- Skeleton loading cho tables
- Optimistic updates cho better responsiveness

## Testing Considerations

### 1. Unit Tests
- Service functions testing
- Component rendering tests
- Form validation tests

### 2. Integration Tests
- API integration testing
- User flow testing
- Error handling testing

## Future Enhancements

### 1. Planned Features
- Real-time notifications cho treatment updates
- Advanced analytics với charts và graphs
- Bulk operations cho multiple treatments
- Export functionality cho reports

### 2. Technical Improvements
- WebSocket integration cho real-time updates
- Offline support với service workers
- Advanced caching strategies
- Performance monitoring và analytics

## Usage Examples

### 1. Creating a Treatment
```javascript
const treatmentData = {
  patientId: 123,
  doctorId: 456,
  protocolId: 789,
  startDate: new Date().toISOString(),
  notes: "Standard HIV treatment protocol",
  customMedications: null,
  total: 1500000
};

const result = await patientTreatmentService.createPatientTreatment(treatmentData, userId);
```

### 2. Validating a Treatment
```javascript
const validation = await patientTreatmentService.quickBusinessRulesCheck(patientId);
if (validation.hasActiveViolations) {
  message.warning(validation.recommendation);
}
```

### 3. Using TreatmentValidation Component
```javascript
<TreatmentValidation
  patientId={patient.id}
  protocolId={selectedProtocol}
  doctorId={currentUser.id}
  onValidationComplete={(results) => {
    console.log('Validation completed:', results);
  }}
/>
```

## Conclusion

Implementation này cung cấp một hệ thống quản lý phác đồ điều trị hoàn chỉnh cho bác sĩ, tích hợp chặt chẽ với backend API và tuân thủ các quy tắc kinh doanh nghiêm ngặt. Hệ thống hỗ trợ đầy đủ các chức năng CRUD, validation, analytics và reporting cần thiết cho việc quản lý điều trị HIV hiệu quả. 