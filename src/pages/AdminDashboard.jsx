
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { apiGet, apiPost, apiPut, apiDelete } from '../helpers/api';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import '../style/AdminDashboard.css';

// const AdminDashboard = () => {
//   const { t } = useTranslation();
//   const [employees, setEmployees] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [selectedSalaryBranch, setSelectedSalaryBranch] = useState(''); // New state for Total Salaries
//   const [selectedAttendanceBranch, setSelectedAttendanceBranch] = useState(''); // New state for Attendance Filters
//   const [selectedDate, setSelectedDate] = useState('');
//   const [attendance, setAttendance] = useState([]);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [attendancePage, setAttendancePage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [editUser, setEditUser] = useState(null);
//   const [totalSalaries, setTotalSalaries] = useState(null);
//   const [year, setYear] = useState(new Date().getFullYear());
//   const [month, setMonth] = useState(new Date().getMonth() + 1);
//   const [pendingDevices, setPendingDevices] = useState([]);
//   const [pendingPage, setPendingPage] = useState(1);
//   const [pendingPages, setPendingPages] = useState(1);
//   const [filterName, setFilterName] = useState('');
//   const [filterBranch, setFilterBranch] = useState('');
//   const [pendingFilterName, setPendingFilterName] = useState('');
//   const [attendanceFilterName, setAttendanceFilterName] = useState('');
//   const [deleteUserId, setDeleteUserId] = useState(null);
//   const [formErrors, setFormErrors] = useState({});
//   const navigate = useNavigate();

//   const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//   // Calculate working hours
//   const calculateWorkingHours = (startTime, endTime, isNightShift = false) => {
//     if (!startTime || !endTime) return 0;
//     const [startHour, startMin] = startTime.split(':').map(Number);
//     const [endHour, endMin] = endTime.split(':').map(Number);
//     let startMinutes = startHour * 60 + startMin;
//     let endMinutes = endHour * 60 + endMin;
//     if (isNightShift && endHour < startHour) {
//       endMinutes += 24 * 60;
//     }
//     return Math.max(0, (endMinutes - startMinutes) / 60);
//   };

//   // Calculate expected monthly working days
//   const calculateMonthlyWorkingDays = (workingDaysNames) => {
//     if (!workingDaysNames.length) return 0;
//     const weeksPerMonth = 4.33;
//     return Math.round(workingDaysNames.length * weeksPerMonth);
//   };

//   // Initialize Bootstrap Toast
//   useEffect(() => {
//     if (window.bootstrap && window.bootstrap.Toast) {
//       const toastElList = [].slice.call(document.querySelectorAll('.toast'));
//       toastElList.forEach((toastEl) => {
//         new window.bootstrap.Toast(toastEl, { autohide: true, delay: 5000 }).show();
//       });
//     }
//   }, [error, success]);

//   useEffect(() => {
//     const fetchPending = async () => {
//       try {
//         const params = new URLSearchParams();
//         params.append('page', pendingPage);
//         if (pendingFilterName) params.append('search', encodeURIComponent(pendingFilterName));
//         const res = await apiGet(`/users/pending-devices?${params.toString()}`);
//         setPendingDevices(res.data.pendingDevices || []);
//         setPendingPages(res.data.pagination?.pages || 1);
//       } catch (err) {
//         setError(t('error'));
//       }
//     };
//     fetchPending();
//   }, [pendingPage, pendingFilterName, t]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const branchRes = await apiGet('/branches');
//         setBranches(branchRes.data || []);
//         const params = new URLSearchParams();
//         params.append('page', currentPage);
//         params.append('limit', itemsPerPage);
//         if (filterName) params.append('name', encodeURIComponent(filterName));
//         if (filterBranch) params.append('branch', filterBranch);
//         const userRes = await apiGet(`/users?${params.toString()}`);
//         setEmployees(userRes.data.users || []);
//         setTotalPages(userRes.data.totalPages || 1);
//         handleAttendanceFilter();
//       } catch (err) {
//         setError(t('error'));
//       }
//     };
//     fetchData();
//   }, [currentPage, filterName, filterBranch, t]);

//   const handleAttendanceFilter = async () => {
//     try {
//       const params = new URLSearchParams();
//       if (selectedAttendanceBranch) params.append('branch', selectedAttendanceBranch);
//       if (selectedDate) params.append('date', selectedDate);
//       if (attendanceFilterName) params.append('name', encodeURIComponent(attendanceFilterName));
//       params.append('page', attendancePage);
//       params.append('limit', itemsPerPage);
//       const attendanceRes = await apiGet(`/admin/attendance?${params.toString()}`);
//       setAttendance(attendanceRes.data || []);
//     } catch (err) {
//       setError(t('error'));
//     }
//   };

//   useEffect(() => {
//     handleAttendanceFilter();
//   }, [selectedAttendanceBranch, selectedDate, attendancePage, attendanceFilterName]);

//   useEffect(() => {
//     if (editUser) {
//       const calculatedHours = calculateWorkingHours(
//         editUser.workStartTime,
//         editUser.workEndTime,
//         editUser.isNightShift
//       );
//       const expectedDays = calculateMonthlyWorkingDays(editUser.workingDaysNames);
//       setEditUser((prev) => ({
//         ...prev,
//         calculatedWorkingHours: calculatedHours,
//         expectedMonthlyWorkingDays: expectedDays,
//       }));
//     }
//   }, [editUser?.workStartTime, editUser?.workEndTime, editUser?.isNightShift, editUser?.workingDaysNames]);

//   const handleBranchFilter = (branchId) => {
//     setSelectedAttendanceBranch(branchId);
//     setAttendancePage(1);
//   };

//   const handleDateFilter = (date) => {
//     setSelectedDate(date);
//     setAttendancePage(1);
//   };

//   const handleEdit = (user) => {
//     setEditUser({
//       ...user,
//       branches: Array.isArray(user.branches) ? user.branches.map((b) => b._id) : [],
//       workingDaysNames: Array.isArray(user.workingDaysNames)
//         ? user.workingDaysNames
//         : user.workingDaysNames
//         ? user.workingDaysNames.split(',')
//         : [],
//       absenceDeductionRate: user.absenceDeductionRate * 100,
//       lateDeductionRate: user.lateDeductionRate * 100,
//       earlyLeaveDeductionRate: user.earlyLeaveDeductionRate * 100,
//       workStartTime: user.workStartTime || '09:00',
//       workEndTime: user.workEndTime || '17:00',
//       isNightShift: user.isNightShift || false,
//       allowRemoteAbsence: user.allowRemoteAbsence || false,
//       calculatedWorkingHours: user.workingHoursPerDay || 8,
//       expectedMonthlyWorkingDays: user.requiredWorkingDays || 22,
//     });
//     setFormErrors({});
//   };

//   const handleDelete = async (id) => {
//     setDeleteUserId(id);
//   };

//   const confirmDelete = async () => {
//     try {
//       await apiDelete(`/users/${deleteUserId}`);
//       const params = new URLSearchParams();
//       params.append('page', currentPage);
//       params.append('limit', itemsPerPage);
//       if (filterName) params.append('name', encodeURIComponent(filterName));
//       if (filterBranch) params.append('branch', filterBranch);
//       const userRes = await apiGet(`/users?${params.toString()}`);
//       setEmployees(userRes.data.users || []);
//       setTotalPages(userRes.data.totalPages || 1);
//       setSuccess(t('success'));
//       setDeleteUserId(null);
//     } catch (err) {
//       setError(err.response?.data?.message || t('error'));
//       setDeleteUserId(null);
//     }
//   };

//   const validateForm = () => {
//     const errors = {};
//     if (!editUser.name) errors.name = t('nameRequired');
//     if (!editUser.email) errors.email = t('emailRequired');
//     if (!editUser.workingDaysNames.length) errors.workingDaysNames = t('workingDaysRequired');
//     if (!editUser.workStartTime || !editUser.workEndTime) {
//       errors.time = t('timeRequired');
//     } else {
//       const calculatedHours = calculateWorkingHours(
//         editUser.workStartTime,
//         editUser.workEndTime,
//         editUser.isNightShift
//       );
//       if (calculatedHours <= 0) {
//         errors.time = editUser.isNightShift ? t('invalidNightShiftTime') : t('endTimeAfterStart');
//       }
//     }
//     if (!editUser.branches.length) errors.branches = t('branchesRequired');
//     if (!editUser.salary || editUser.salary <= 0) errors.salary = t('salaryRequired');
//     if (editUser.absenceDeductionRate < 0 || editUser.absenceDeductionRate > 100) {
//       errors.absenceDeductionRate = t('invalidDeductionRate');
//     }
//     if (editUser.lateDeductionRate < 0 || editUser.lateDeductionRate > 100) {
//       errors.lateDeductionRate = t('invalidDeductionRate');
//     }
//     if (editUser.earlyLeaveDeductionRate < 0 || editUser.earlyLeaveDeductionRate > 100) {
//       errors.earlyLeaveDeductionRate = t('invalidDeductionRate');
//     }
//     return errors;
//   };

//   const formatTime = (time) => {
//     if (!time) return '';
//     const [hours, minutes] = time.split(':').map(Number);
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
//   };

//   const handleSave = async () => {
//     const errors = validateForm();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }
//     try {
//       const dataToSend = {
//         ...editUser,
//         workingDaysNames: editUser.workingDaysNames.join(','),
//         branches: editUser.branches,
//         absenceDeductionRate: editUser.absenceDeductionRate / 100,
//         lateDeductionRate: editUser.lateDeductionRate / 100,
//         earlyLeaveDeductionRate: editUser.earlyLeaveDeductionRate / 100,
//         isNightShift: editUser.isNightShift,
//         allowRemoteAbsence: editUser.allowRemoteAbsence,
//         workStartTime: formatTime(editUser.workStartTime),
//         workEndTime: formatTime(editUser.workEndTime),
//         workingHoursPerDay: editUser.calculatedWorkingHours,
//         requiredWorkingDays: editUser.expectedMonthlyWorkingDays,
//       };
//       await apiPut(`/users/${editUser._id}`, dataToSend);
//       const params = new URLSearchParams();
//       params.append('page', currentPage);
//       params.append('limit', itemsPerPage);
//       if (filterName) params.append('name', encodeURIComponent(filterName));
//       if (filterBranch) params.append('branch', filterBranch);
//       const userRes = await apiGet(`/users?${params.toString()}`);
//       setEmployees(userRes.data.users || []);
//       setTotalPages(userRes.data.totalPages || 1);
//       setEditUser(null);
//       setSuccess(t('success'));
//       setFormErrors({});
//     } catch (err) {
//       console.error('Update error:', err.response?.data);
//       setError(t('error') + ': ' + (err.response?.data?.message || err.message));
//     }
//   };

//   const handleDayChange = (day) => {
//     setEditUser((prev) => {
//       const workingDaysNames = prev.workingDaysNames.includes(day)
//         ? prev.workingDaysNames.filter((d) => d !== day)
//         : [...prev.workingDaysNames, day];
//       return { ...prev, workingDaysNames };
//     });
//     setFormErrors((prev) => ({ ...prev, workingDaysNames: '' }));
//   };

//   const handleBranchChange = (branchId) => {
//     setEditUser((prev) => {
//       const branches = prev.branches.includes(branchId)
//         ? prev.branches.filter((id) => id !== branchId)
//         : [...prev.branches, branchId];
//       return { ...prev, branches };
//     });
//     setFormErrors((prev) => ({ ...prev, branches: '' }));
//   };

//   const handleAddEmployee = async () => {
//     navigate('/add-employee');
//   };

//   const handleCalculateSalaries = async () => {
//     try {
//       const res = await apiGet(`/admin/total-salaries?year=${year}&month=${month}${selectedSalaryBranch ? `&branchId=${selectedSalaryBranch}` : ''}`);
//       setTotalSalaries(res.data);
//     } catch (err) {
//       setError(err.response?.data?.message || t('error'));
//     }
//   };

//   const handleResendActivation = async (userId) => {
//     try {
//       await apiPost(`/auth/resend-activation/${userId}`, { userId });
//       setSuccess(t('resendSuccess'));
//     } catch (err) {
//       setError(err.response?.data?.message || t('error'));
//     }
//   };

//   const handleApprove = async (userId, fingerprint) => {
//     try {
//       await apiPost('/users/approve-device', { userId, deviceFingerprint: fingerprint });
//       const params = new URLSearchParams();
//       params.append('page', pendingPage);
//       if (pendingFilterName) params.append('name', encodeURIComponent(pendingFilterName));
//       const res = await apiGet(`/users/pending-devices?${params.toString()}`);
//       setPendingDevices(res.data.pendingDevices || []);
//       setPendingPages(res.data.pagination?.pages || 1);
//       setSuccess(t('success'));
//     } catch (err) {
//       setError(err.response?.data?.message || t('error'));
//     }
//   };

//   const handleReject = async (userId, fingerprint) => {
//     try {
//       await apiPost('/users/reject-device', { userId, deviceFingerprint: fingerprint });
//       const params = new URLSearchParams();
//       params.append('page', pendingPage);
//       if (pendingFilterName) params.append('name', encodeURIComponent(pendingFilterName));
//       const res = await apiGet(`/users/pending-devices?${params.toString()}`);
//       setPendingDevices(res.data.pendingDevices || []);
//       setPendingPages(res.data.pagination?.pages || 1);
//       setSuccess(t('success'));
//     } catch (err) {
//       setError(err.response?.data?.message || t('error'));
//     }
//   };

//   const paginate = (pageNumber) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   const attendancePagination = attendance[0]?.pagination || { page: 1, pages: 1 };
//   const attendancePrev = () => {
//     if (attendancePage > 1) setAttendancePage(attendancePage - 1);
//   };
//   const attendanceNext = () => {
//     if (attendancePage < attendancePagination.pages) setAttendancePage(attendancePage + 1);
//   };

//   return (
//     <div className="container-fluid dashboard-container">
//       <h2 className="dashboard-title"><i className="fas fa-tachometer-alt me-2"></i>{t('dashboard')}</h2>

//       {/* Toast Container */}
//       <div className="toast-container position-fixed top-0 end-0 p-3">
//         {success && (
//           <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
//             <div className="toast-header bg-success text-white">
//               <i className="fas fa-check-circle me-2"></i>
//               <strong className="me-auto">{t('success')}</strong>
//               <button type="button" className="btn-close btn-close-white" onClick={() => setSuccess('')}></button>
//             </div>
//             <div className="toast-body">{success}</div>
//           </div>
//         )}
//         {error && (
//           <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
//             <div className="toast-header bg-danger text-white">
//               <i className="fas fa-exclamation-triangle me-2"></i>
//               <strong className="me-auto">{t('error')}</strong>
//               <button type="button" className="btn-close btn-close-white" onClick={() => setError('')}></button>
//             </div>
//             <div className="toast-body">{error}</div>
//           </div>
//         )}
//       </div>

//       {/* Delete Confirmation Modal */}
//       {deleteUserId && (
//         <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
//           <div className="modal-dialog modal-dialog-centered" role="document">
//             <div className="modal-content delete-modal">
//               <div className="modal-header bg-danger text-white">
//                 <h5 className="modal-title">
//                   <i className="fas fa-exclamation-triangle me-2"></i>{t('delete')} {t('user')}
//                 </h5>
//                 <button
//                   type="button"
//                   className="btn-close btn-close-white"
//                   onClick={() => setDeleteUserId(null)}
//                   aria-label="Close"
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <p>{t('confirmDelete')}</p>
//               </div>
//               <div className="modal-footer">
//                 <button type="button" className="btn btn-success" onClick={confirmDelete}>
//                   <i className="fas fa-check me-2"></i>{t('delete')}
//                 </button>
//                 <button type="button" className="btn btn-danger" onClick={() => setDeleteUserId(null)}>
//                   <i className="fas fa-times me-2"></i>{t('cancel')}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="card shadow-sm mb-4">
//         <div className="card-body">
//           <h3 className="card-title"><i className="fas fa-users me-2"></i>{t('employees')}</h3>
//           <button className="btn btn-primary mb-3" onClick={handleAddEmployee}>
//             <i className="fas fa-user-plus me-2"></i>{t('addEmployee')}
//           </button>
//           <div className="row mb-3">
//             <div className="col-md-6">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder={t('name')}
//                 value={filterName}
//                 onChange={(e) => {
//                   setFilterName(e.target.value);
//                   setCurrentPage(1);
//                 }}
//               />
//             </div>
//             <div className="col-md-6">
//               <select
//                 className="form-select"
//                 value={filterBranch}
//                 onChange={(e) => {
//                   setFilterBranch(e.target.value);
//                   setCurrentPage(1);
//                 }}
//               >
//                 <option value="">{t('allBranches')}</option>
//                 {branches.map((branch) => (
//                   <option key={branch._id} value={branch._id}>
//                     {branch.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className="table-responsive">
//             <table className="table table-hover">
//               <thead className="table-primary">
//                 <tr>
//                   <th>{t('name')}</th>
//                   <th>{t('email')}</th>
//                   <th>{t('branch')}</th>
//                   <th>{t('active')}</th>
//                   <th>{t('actions')}</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {employees.length === 0 ? (
//                   <tr>
//                     <td colSpan="5">{t('noData')}</td>
//                   </tr>
//                 ) : (
//                   employees.map((emp) => (
//                     <tr key={emp._id}>
//                       <td>{emp.name}</td>
//                       <td>{emp.email}</td>
//                       <td>{emp.branches.map((b) => b.name).join(', ')}</td>
//                       <td>
//                         {emp.isActive ? (
//                           <span className="badge bg-success">{t('active')}</span>
//                         ) : (
//                           <span className="badge bg-secondary">{t('inactive')}</span>
//                         )}
//                       </td>
//                       <td>
//                         <button
//                           className="btn btn-sm btn-info me-1"
//                           onClick={() => navigate(`/profile/${emp._id}`)}
//                         >
//                           <i className="fas fa-eye"></i> {t('viewProfile')}
//                         </button>
//                         <button
//                           className="btn btn-sm btn-warning me-1"
//                           onClick={() => handleEdit(emp)}
//                         >
//                           <i className="fas fa-edit"></i> {t('edit')}
//                         </button>
//                         <button
//                           className="btn btn-sm btn-danger me-1"
//                           onClick={() => handleDelete(emp._id)}
//                         >
//                           <i className="fas fa-trash"></i> {t('delete')}
//                         </button>
//                         {!emp.isActive && (
//                           <button
//                             className="btn btn-sm btn-secondary"
//                             onClick={() => handleResendActivation(emp._id)}
//                           >
//                             <i className="fas fa-envelope"></i> {t('resendActivation')}
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//           <nav>
//             <ul className="pagination justify-content-center">
//               <li className="page-item">
//                 <button
//                   className="page-link"
//                   onClick={() => paginate(currentPage - 1)}
//                   disabled={currentPage === 1}
//                 >
//                   <i className="fas fa-chevron-left"></i> {t('previous')}
//                 </button>
//               </li>
//               <li className="page-item disabled">
//                 <span className="page-link">
//                   {currentPage} / {totalPages}
//                 </span>
//               </li>
//               <li className="page-item">
//                 <button
//                   className="page-link"
//                   onClick={() => paginate(currentPage + 1)}
//                   disabled={currentPage >= totalPages}
//                 >
//                   {t('next')} <i className="fas fa-chevron-right"></i>
//                 </button>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </div>

//       <div className="card shadow-sm mb-4">
//         <div className="card-body">
//           <h3 className="card-title"><i className="fas fa-mobile-alt me-2"></i>{t('pendingDevices')}</h3>
//           <div className="row mb-3">
//             <div className="col-md-12">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder={`${t('name')} or ${t('email')}`}
//                 value={pendingFilterName}
//                 onChange={(e) => {
//                   setPendingFilterName(e.target.value);
//                   setPendingPage(1);
//                 }}
//               />
//             </div>
//           </div>
//           <div className="table-responsive">
//             <table className="table table-hover">
//               <thead className="table-primary">
//                 <tr>
//                   <th>{t('name')}</th>
//                   <th>{t('email')}</th>
//                   <th>{t('branch')}</th>
//                   <th>{t('device')}</th>
//                   <th>{t('actions')}</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pendingDevices.length === 0 ? (
//                   <tr>
//                     <td colSpan="5">{t('noData')}</td>
//                   </tr>
//                 ) : (
//                   pendingDevices.map((d) => (
//                     <tr key={d.deviceFingerprint}>
//                       <td>{d.userName}</td>
//                       <td>{d.userEmail}</td>
//                       <td>{d.branches?.map((b) => b.name).join(', ') || 'N/A'}</td>
//                       <td>{d.deviceFingerprint}</td>
//                       <td>
//                         <button
//                           className="btn btn-sm btn-success me-1"
//                           onClick={() => handleApprove(d.userId, d.deviceFingerprint)}
//                         >
//                           <i className="fas fa-check"></i> {t('approve')}
//                         </button>
//                         <button
//                           className="btn btn-sm btn-danger"
//                           onClick={() => handleReject(d.userId, d.deviceFingerprint)}
//                         >
//                           <i className="fas fa-times"></i> {t('reject')}
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//           <nav>
//             <ul className="pagination justify-content-center">
//               <li className="page-item">
//                 <button
//                   className="page-link"
//                   onClick={() => setPendingPage((p) => p - 1)}
//                   disabled={pendingPage === 1}
//                 >
//                   <i className="fas fa-chevron-left"></i> {t('previous')}
//                 </button>
//               </li>
//               <li className="page-item disabled">
//                 <span className="page-link">
//                   {pendingPage} / {pendingPages}
//                 </span>
//               </li>
//               <li className="page-item">
//                 <button
//                   className="page-link"
//                   onClick={() => setPendingPage((p) => p + 1)}
//                   disabled={pendingPage >= pendingPages}
//                 >
//                   {t('next')} <i className="fas fa-chevron-right"></i>
//                 </button>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </div>

//       {editUser && (
//         <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
//           <div className="modal-dialog modal-lg" role="document">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">
//                   <i className="fas fa-user-edit me-2"></i>
//                   {t('edit')} {editUser.name}
//                 </h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setEditUser(null)}
//                   aria-label="Close"
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <form>
//                   <div className="row">
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{t('name')} *</label>
//                       <input
//                         type="text"
//                         className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
//                         value={editUser.name}
//                         onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
//                       />
//                       {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{t('email')} *</label>
//                       <input
//                         type="email"
//                         className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
//                         value={editUser.email}
//                         onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
//                       />
//                       {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{t('role')}</label>
//                       <select
//                         className="form-select"
//                         value={editUser.role}
//                         onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
//                       >
//                         <option value="staff">{t('staff')}</option>
//                         <option value="admin">{t('admin')}</option>
//                       </select>
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{t('salary')} * (شهري)</label>
//                       <input
//                         type="number"
//                         className={`form-control ${formErrors.salary ? 'is-invalid' : ''}`}
//                         value={editUser.salary}
//                         onChange={(e) => setEditUser({ ...editUser, salary: e.target.value })}
//                         min="0"
//                         step="0.01"
//                       />
//                       {formErrors.salary && <div className="invalid-feedback">{formErrors.salary}</div>}
//                     </div>
//                     <div className="col-md-12 mb-3">
//                       <label className="form-label">{t('branches')} *</label>
//                       <div className="checkbox-group border p-3 rounded">
//                         {branches.map((branch) => (
//                           <div key={branch._id} className="form-check form-check-inline">
//                             <input
//                               type="checkbox"
//                               className="form-check-input"
//                               id={`edit-branch-${branch._id}`}
//                               checked={editUser.branches.includes(branch._id)}
//                               onChange={() => handleBranchChange(branch._id)}
//                             />
//                             <label
//                               className="form-check-label"
//                               htmlFor={`edit-branch-${branch._id}`}
//                             >
//                               {branch.name}
//                             </label>
//                           </div>
//                         ))}
//                       </div>
//                       {formErrors.branches && (
//                         <div className="text-danger mt-1">{formErrors.branches}</div>
//                       )}
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{t('phone')}</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         value={editUser.phone || ''}
//                         onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
//                       />
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{t('address')}</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         value={editUser.address || ''}
//                         onChange={(e) => setEditUser({ ...editUser, address: e.target.value })}
//                       />
//                     </div>
//                     <div className="col-md-12 mb-3">
//                       <label className="form-label">{t('workingDaysNames')} *</label>
//                       <div className="checkbox-group border p-3 rounded">
//                         {daysOfWeek.map((day) => (
//                           <div key={day} className="form-check form-check-inline">
//                             <input
//                               type="checkbox"
//                               className="form-check-input"
//                               id={`edit-day-${day}`}
//                               checked={editUser.workingDaysNames.includes(day)}
//                               onChange={() => handleDayChange(day)}
//                             />
//                             <label className="form-check-label" htmlFor={`edit-day-${day}`}>
//                               {t(day.toLowerCase())}
//                             </label>
//                           </div>
//                         ))}
//                       </div>
//                       {formErrors.workingDaysNames && (
//                         <div className="text-danger mt-1">{formErrors.workingDaysNames}</div>
//                       )}
//                       <small className="text-muted">
//                         الأيام المتوقعة شهرياً: {editUser.expectedMonthlyWorkingDays} يوم
//                       </small>
//                     </div>
//                     <div className="col-md-4 mb-3">
//                       <label className="form-label">{t('workStartTime')} *</label>
//                       <input
//                         type="time"
//                         className={`form-control ${formErrors.time ? 'is-invalid' : ''}`}
//                         value={editUser.workStartTime}
//                         onChange={(e) =>
//                           setEditUser({ ...editUser, workStartTime: e.target.value })
//                         }
//                       />
//                       {formErrors.time && <div className="invalid-feedback">{formErrors.time}</div>}
//                     </div>
//                     <div className="col-md-4 mb-3">
//                       <label className="form-label">{t('workEndTime')} *</label>
//                       <input
//                         type="time"
//                         className={`form-control ${formErrors.time ? 'is-invalid' : ''}`}
//                         value={editUser.workEndTime}
//                         onChange={(e) =>
//                           setEditUser({ ...editUser, workEndTime: e.target.value })
//                         }
//                       />
//                       {formErrors.time && <div className="invalid-feedback">{formErrors.time}</div>}
//                     </div>
//                     <div className="col-md-4 mb-3">
//                       <label className="form-label">ساعات العمل اليومية</label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         value={editUser.calculatedWorkingHours}
//                         disabled
//                         style={{ backgroundColor: '#f8f9fa' }}
//                       />
//                       <small className="text-muted">محسوبة تلقائياً</small>
//                     </div>
//                     <div className="mb-3 form-check">
//                       <input
//                         type="checkbox"
//                         className="form-check-input"
//                         id="isNightShift"
//                         checked={editUser.isNightShift}
//                         onChange={(e) =>
//                           setEditUser({ ...editUser, isNightShift: e.target.checked })
//                         }
//                       />
//                       <label className="form-check-label" htmlFor="isNightShift">
//                         {t('isNightShift')} (العمل عبر منتصف الليل)
//                       </label>
//                     </div>
//                     <div className="card mb-3">
//                       <div className="card-header">
//                         <h5 className="mb-0">معدلات الخصم (%)</h5>
//                       </div>
//                       <div className="card-body">
//                         <div className="row">
//                           <div className="col-md-4 mb-3">
//                             <label className="form-label">{t('absenceDeductionRate')} (%)</label>
//                             <input
//                               type="number"
//                               className={`form-control ${
//                                 formErrors.absenceDeductionRate ? 'is-invalid' : ''
//                               }`}
//                               value={editUser.absenceDeductionRate}
//                               onChange={(e) =>
//                                 setEditUser({
//                                   ...editUser,
//                                   absenceDeductionRate: e.target.value,
//                                 })
//                               }
//                               min="0"
//                               max="100"
//                               step="0.1"
//                             />
//                             {formErrors.absenceDeductionRate && (
//                               <div className="invalid-feedback">
//                                 {formErrors.absenceDeductionRate}
//                               </div>
//                             )}
//                             <small className="text-muted">
//                               نسبة الخصم من الراتب اليومي عن كل يوم غياب
//                             </small>
//                           </div>
//                           <div className="col-md-4 mb-3">
//                             <label className="form-label">{t('lateDeductionRate')} (%)</label>
//                             <input
//                               type="number"
//                               className={`form-control ${
//                                 formErrors.lateDeductionRate ? 'is-invalid' : ''
//                               }`}
//                               value={editUser.lateDeductionRate}
//                               onChange={(e) =>
//                                 setEditUser({
//                                   ...editUser,
//                                   lateDeductionRate: e.target.value,
//                                 })
//                               }
//                               min="0"
//                               max="100"
//                               step="0.1"
//                             />
//                             {formErrors.lateDeductionRate && (
//                               <div className="invalid-feedback">
//                                 {formErrors.lateDeductionRate}
//                               </div>
//                             )}
//                             <small className="text-muted">
//                               نسبة الخصم من الراتب الساعي عن كل ساعة تأخير
//                             </small>
//                           </div>
//                           <div className="col-md-4 mb-3">
//                             <label className="form-label">{t('earlyLeaveDeductionRate')} (%)</label>
//                             <input
//                               type="number"
//                               className={`form-control ${
//                                 formErrors.earlyLeaveDeductionRate ? 'is-invalid' : ''
//                               }`}
//                               value={editUser.earlyLeaveDeductionRate}
//                               onChange={(e) =>
//                                 setEditUser({
//                                   ...editUser,
//                                   earlyLeaveDeductionRate: e.target.value,
//                                 })
//                               }
//                               min="0"
//                               max="100"
//                               step="0.1"
//                             />
//                             {formErrors.earlyLeaveDeductionRate && (
//                               <div className="invalid-feedback">
//                                 {formErrors.earlyLeaveDeductionRate}
//                               </div>
//                             )}
//                             <small className="text-muted">
//                               نسبة الخصم من الراتب الساعي عن كل ساعة انصراف مبكر
//                             </small>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="mb-3 form-check">
//                       <input
//                         type="checkbox"
//                         className="form-check-input"
//                         id="allowRemoteAbsence"
//                         checked={editUser.allowRemoteAbsence}
//                         onChange={(e) =>
//                           setEditUser({ ...editUser, allowRemoteAbsence: e.target.checked })
//                         }
//                       />
//                       <label className="form-check-label" htmlFor="allowRemoteAbsence">
//                         {t('allowRemoteAbsence')}
//                       </label>
//                     </div>
//                     <div className="card mb-3">
//                       <div className="card-header">
//                         <h5 className="mb-0">ملخص الراتب</h5>
//                       </div>
//                       <div className="card-body">
//                         {editUser.salary > 0 && editUser.expectedMonthlyWorkingDays > 0 && (
//                           <div className="row">
//                             <div className="col-md-4">
//                               <strong>الراتب الشهري:</strong> {editUser.salary} جنيه
//                             </div>
//                             <div className="col-md-4">
//                               <strong>الراتب اليومي:</strong>{' '}
//                               {(editUser.salary / editUser.expectedMonthlyWorkingDays).toFixed(2)}{' '}
//                               جنيه
//                             </div>
//                             <div className="col-md-4">
//                               <strong>الراتب الساعي:</strong>{' '}
//                               {editUser.calculatedWorkingHours > 0
//                                 ? (
//                                     editUser.salary /
//                                     (editUser.expectedMonthlyWorkingDays *
//                                       editUser.calculatedWorkingHours)
//                                   ).toFixed(2)
//                                 : '0'}{' '}
//                               جنيه
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//               <div className="modal-footer">
//                 <button type="button" className="btn btn-primary" onClick={handleSave}>
//                   <i className="fas fa-save me-2"></i>{t('save')}
//                 </button>
//                 <button type="button" className="btn btn-secondary" onClick={() => setEditUser(null)}>
//                   <i className="fas fa-times me-2"></i>{t('cancel')}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="card shadow-sm mb-4">
//         <div className="card-body">
//           <h3 className="card-title"><i className="fas fa-money-bill-wave me-2"></i>{t('totalSalaries')}</h3>
//           <div className="row">
//             <div className="col-md-3 mb-3">
//               <label className="form-label">{t('year')}</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 value={year}
//                 onChange={(e) => setYear(e.target.value)}
//               />
//             </div>
//             <div className="col-md-3 mb-3">
//               <label className="form-label">{t('month')}</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 value={month}
//                 min={1}
//                 max={12}
//                 onChange={(e) => setMonth(e.target.value)}
//               />
//             </div>
//             <div className="col-md-3 mb-3">
//               <label className="form-label">{t('selectBranch')}</label>
//               <select
//                 className="form-select"
//                 value={selectedSalaryBranch}
//                 onChange={(e) => setSelectedSalaryBranch(e.target.value)}
//               >
//                 <option value="">{t('allBranches')}</option>
//                 {branches.map((branch) => (
//                   <option key={branch._id} value={branch._id}>
//                     {branch.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-3 d-flex align-items-end mb-3">
//               <button className="btn btn-primary w-100" onClick={handleCalculateSalaries}>
//                 <i className="fas fa-calculator me-2"></i>{t('calculateSalaries')}
//               </button>
//             </div>
//           </div>
//           {totalSalaries && (
//             <div className="mt-3">
//               <h4>{t('total')}: {totalSalaries.totalSalaries}</h4>
//               <table className="table table-bordered mt-2">
//                 <thead>
//                   <tr>
//                     <th>{t('branch')}</th>
//                     <th>{t('branchTotal')}</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     const branchTotals = totalSalaries.branchTotals || {};
//                     const filteredTotals = selectedSalaryBranch
//                       ? Object.entries(branchTotals).filter(([branchId]) => branchId === selectedSalaryBranch)
//                       : Object.entries(branchTotals);
//                     return filteredTotals.length === 0 ? (
//                       <tr>
//                         <td colSpan="2">{t('noData')}</td>
//                       </tr>
//                     ) : (
//                       filteredTotals.map(([branchId, total]) => (
//                         <tr key={branchId}>
//                           <td>{total.branchName || branchId}</td>
//                           <td>{total.totalSalary}</td>
//                         </tr>
//                       ))
//                     );
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="card shadow-sm mb-4">
//         <div className="card-body">
//           <h3 className="card-title"><i className="fas fa-filter me-2"></i>{t('attendanceFilters')}</h3>
//           <div className="row">
//             <div className="col-md-4 mb-3">
//               <label className="form-label">{t('selectBranch')}</label>
//               <select
//                 className="form-select"
//                 value={selectedAttendanceBranch}
//                 onChange={(e) => handleBranchFilter(e.target.value)}
//               >
//                 <option value="">{t('allBranches')}</option>
//                 {branches.map((branch) => (
//                   <option key={branch._id} value={branch._id}>
//                     {branch.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-4 mb-3">
//               <label className="form-label">{t('selectDate')}</label>
//               <input
//                 type="date"
//                 className="form-control"
//                 value={selectedDate}
//                 onChange={(e) => handleDateFilter(e.target.value)}
//               />
//             </div>
//             <div className="col-md-4 mb-3">
//               <label className="form-label">{t('name')}</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={attendanceFilterName}
//                 onChange={(e) => {
//                   setAttendanceFilterName(e.target.value);
//                   setAttendancePage(1);
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="card shadow-sm">
//         <div className="card-body">
//           <h3 className="card-title"><i className="fas fa-clipboard-check me-2"></i>{t('attendance')}</h3>
//           <div className="table-responsive">
//             <table className="table table-hover">
//               <thead className="table-primary">
//                 <tr>
//                   <th>{t('name')}</th>
//                   <th>{t('branch')}</th>
//                   <th>{t('date')}</th>
//                   <th>{t('day')}</th>
//                   <th>{t('checkIn')}</th>
//                   <th>{t('checkOut')}</th>
//                   <th>{t('status')}</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {attendance.length === 0 ? (
//                   <tr>
//                     <td colSpan="7">{t('noData')}</td>
//                   </tr>
//                 ) : (
//                   attendance.flatMap((record) =>
//                     record.attendance.length === 0 ? (
//                       <tr key={record.branch._id}>
//                         <td colSpan="7">{t('noData')}</td>
//                       </tr>
//                     ) : (
//                       record.attendance.map((att) => {
//                         const attDate = new Date(att.checkInTime);
//                         return (
//                           <tr key={att._id}>
//                             <td>{att.user?.name || 'N/A'}</td>
//                             <td>{att.branch?.name || 'N/A'}</td>
//                             <td>{attDate.toLocaleDateString()}</td>
//                             <td>{attDate.toLocaleString('en-us', { weekday: 'long' })}</td>
//                             <td>{attDate.toLocaleTimeString()}</td>
//                             <td>
//                               {att.checkOutTime
//                                 ? new Date(att.checkOutTime).toLocaleTimeString()
//                                 : '-'}
//                             </td>
//                             <td>{t(att.dayStatus) || att.dayStatus}</td>
//                           </tr>
//                         );
//                       })
//                     )
//                   )
//                 )}
//               </tbody>
//             </table>
//           </div>
//           <nav>
//             <ul className="pagination justify-content-center">
//               <li className="page-item">
//                 <button
//                   className="page-link"
//                   onClick={attendancePrev}
//                   disabled={attendancePage === 1}
//                 >
//                   <i className="fas fa-chevron-left"></i> {t('previous')}
//                 </button>
//               </li>
//               <li className="page-item disabled">
//                 <span className="page-link">
//                   {attendancePage} / {attendancePagination.pages}
//                 </span>
//               </li>
//               <li className="page-item">
//                 <button
//                   className="page-link"
//                   onClick={attendanceNext}
//                   disabled={attendancePage >= attendancePagination.pages}
//                 >
//                   {t('next')} <i className="fas fa-chevron-right"></i>
//                 </button>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


// import { useState, useEffect, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { apiGet, apiPost, apiPut, apiDelete } from '../helpers/api';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import '../style/AdminDashboard.css';

// const AdminDashboard = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [branches, setBranches] = useState([]);

//   const [selectedSalaryBranch, setSelectedSalaryBranch] = useState('');
//   const [selectedAttendanceBranch, setSelectedAttendanceBranch] = useState('');
//   const [selectedDate, setSelectedDate] = useState('');

//   const [attendanceRows, setAttendanceRows] = useState([]);
//   const [attendancePage, setAttendancePage] = useState(1);
//   const [attendanceTotalPages, setAttendanceTotalPages] = useState(1);
//   const [attendanceTotalRecords, setAttendanceTotalRecords] = useState(0);

//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [itemsPerPage] = useState(10);

//   const [editUser, setEditUser] = useState(null);
//   const [totalSalaries, setTotalSalaries] = useState(null);
//   const [year, setYear] = useState(new Date().getFullYear());
//   const [month, setMonth] = useState(new Date().getMonth() + 1);

//   const [pendingDevices, setPendingDevices] = useState([]);
//   const [pendingPage, setPendingPage] = useState(1);
//   const [pendingPages, setPendingPages] = useState(1);

//   const [filterName, setFilterName] = useState('');
//   const [filterBranch, setFilterBranch] = useState('');
//   const [pendingFilterName, setPendingFilterName] = useState('');
//   const [attendanceFilterName, setAttendanceFilterName] = useState('');

//   const [deleteUserId, setDeleteUserId] = useState(null);
//   const [formErrors, setFormErrors] = useState({});

//   const daysOfWeek = useMemo(
//     () => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
//     []
//   );

//   // === Helpers ===

//   const calculateWorkingHours = (startTime, endTime, isNightShift = false) => {
//     if (!startTime || !endTime) return 0;
//     const [startHour, startMin] = startTime.split(':').map(Number);
//     const [endHour, endMin] = endTime.split(':').map(Number);
//     let startMinutes = startHour * 60 + startMin;
//     let endMinutes = endHour * 60 + endMin;
//     if (isNightShift && endHour < startHour) {
//       endMinutes += 24 * 60;
//     }
//     return Math.max(0, (endMinutes - startMinutes) / 60);
//   };

//   const calculateMonthlyWorkingDays = (workingDaysNames) => {
//     if (!workingDaysNames || !workingDaysNames.length) return 0;
//     const weeksPerMonth = 4.33;
//     return Math.round(workingDaysNames.length * weeksPerMonth);
//   };

//   const formatTime = (time) => {
//     if (!time) return '';
//     const [hours, minutes] = time.split(':').map(Number);
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
//   };

//   // Group attendance per (user + day) so multi-branch in same day shows in one row
//   const groupAttendanceByUserAndDate = (records) => {
//     const map = new Map();

//     records.forEach((att) => {
//       const userId = att.user?._id || 'unknown';
//       const baseDate = att.checkInTime
//         ? new Date(att.checkInTime)
//         : att.createdAt
//         ? new Date(att.createdAt)
//         : new Date();

//       const dateKey = baseDate.toISOString().slice(0, 10); // yyyy-mm-dd
//       const key = `${userId}-${dateKey}`;

//       if (!map.has(key)) {
//         map.set(key, {
//           key,
//           user: att.user,
//           date: baseDate,
//           records: []
//         });
//       }
//       map.get(key).records.push(att);
//     });

//     const groups = Array.from(map.values()).map((group) => {
//       const sorted = group.records
//         .slice()
//         .sort(
//           (a, b) =>
//             new Date(a.checkInTime || a.createdAt || 0) -
//             new Date(b.checkInTime || b.createdAt || 0)
//         );

//       const first = sorted[0];
//       const last = sorted[sorted.length - 1];

//       const dayName = group.date.toLocaleString('en-US', { weekday: 'long' });
//       const allInvalid = sorted.every((r) => r.invalidated);
//       const effectiveStatus = allInvalid
//         ? 'invalidated'
//         : last.dayStatus || first.dayStatus || 'working';

//       const totalLate = sorted.reduce((sum, r) => sum + (r.lateMinutes || 0), 0);
//       const totalEarly = sorted.reduce((sum, r) => sum + (r.earlyLeaveMinutes || 0), 0);

//       return {
//         key: group.key,
//         user: group.user,
//         date: group.date,
//         dayName,
//         branches: sorted.map((r) => ({
//           branchName: r.branch?.name || 'N/A',
//           checkInTime: r.checkInTime,
//           checkOutTime: r.checkOutTime,
//           dayStatus: r.dayStatus,
//           invalidated: r.invalidated,
//           lateMinutes: r.lateMinutes,
//           earlyLeaveMinutes: r.earlyLeaveMinutes
//         })),
//         totalLateMinutes: totalLate,
//         totalEarlyLeaveMinutes: totalEarly,
//         allInvalid,
//         status: effectiveStatus
//       };
//     });

//     // sort by date desc
//     groups.sort((a, b) => b.date - a.date);
//     return groups;
//   };

//   // === Bootstrap Toast ===
//   useEffect(() => {
//     if (window.bootstrap && window.bootstrap.Toast && (error || success)) {
//       const toastElList = [].slice.call(document.querySelectorAll('.toast'));
//       toastElList.forEach((toastEl) => {
//         new window.bootstrap.Toast(toastEl, { autohide: true, delay: 5000 }).show();
//       });
//     }
//   }, [error, success]);

//   // === Fetch Pending Devices ===
//   useEffect(() => {
//     const fetchPending = async () => {
//       try {
//         const params = new URLSearchParams();
//         params.append('page', pendingPage);
//         if (pendingFilterName) params.append('search', pendingFilterName);
//         const res = await apiGet(`/users/pending-devices?${params.toString()}`);
//         setPendingDevices(res.data.pendingDevices || []);
//         setPendingPages(res.data.pagination?.pages || 1);
//       } catch (err) {
//         setError(t('error'));
//       }
//     };
//     fetchPending();
//   }, [pendingPage, pendingFilterName, t]);

//   // === Fetch Employees + Branches + Attendance (admin) ===
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const branchRes = await apiGet('/branches');
//         setBranches(branchRes.data || []);

//         const params = new URLSearchParams();
//         params.append('page', currentPage);
//         params.append('limit', itemsPerPage);
//         if (filterName) params.append('name', filterName);
//         if (filterBranch) params.append('branch', filterBranch);

//         const userRes = await apiGet(`/users?${params.toString()}`);
//         setEmployees(userRes.data.users || []);
//         setTotalPages(userRes.data.totalPages || 1);

//         // بعد ما نجيب الداتا، نجدد جدول الحضور
//         await handleAttendanceFilter();
//       } catch (err) {
//         console.error(err);
//         setError(t('error'));
//       }
//     };
//     fetchData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentPage, filterName, filterBranch, t]);

//   // === Attendance Filters (Admin Global Table) ===
//   const handleAttendanceFilter = async () => {
//     try {
//       const params = new URLSearchParams();
//       params.append('page', attendancePage);
//       params.append('limit', itemsPerPage);

//       if (selectedAttendanceBranch) params.append('branchId', selectedAttendanceBranch);
//       if (attendanceFilterName) params.append('name', attendanceFilterName);

//       // لو فيه تاريخ محدد، نخليه من–إلى نفس اليوم
//       if (selectedDate) {
//         params.append('from', selectedDate);
//         params.append('to', selectedDate);
//       }

//       const attendanceRes = await apiGet(`/admin/attendance?${params.toString()}`);

//       const { data = [], pages = 1, total = 0 } = attendanceRes.data || {};
//       const grouped = groupAttendanceByUserAndDate(data);

//       setAttendanceRows(grouped);
//       setAttendanceTotalPages(pages || 1);
//       setAttendanceTotalRecords(total || 0);
//     } catch (err) {
//       console.error(err);
//       setError(t('error'));
//     }
//   };

//   useEffect(() => {
//     handleAttendanceFilter();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedAttendanceBranch, selectedDate, attendancePage, attendanceFilterName]);

//   // === Edit User modal calculations ===
//   useEffect(() => {
//     if (editUser) {
//       const calculatedHours = calculateWorkingHours(
//         editUser.workStartTime,
//         editUser.workEndTime,
//         editUser.isNightShift
//       );
//       const expectedDays = calculateMonthlyWorkingDays(editUser.workingDaysNames || []);
//       setEditUser((prev) => ({
//         ...prev,
//         calculatedWorkingHours: calculatedHours,
//         expectedMonthlyWorkingDays: expectedDays
//       }));
//     }
//   }, [
//     editUser?.workStartTime,
//     editUser?.workEndTime,
//     editUser?.isNightShift,
//     editUser?.workingDaysNames
//   ]);

//   // === Handlers ===

//   const handleBranchFilter = (branchId) => {
//     setSelectedAttendanceBranch(branchId);
//     setAttendancePage(1);
//   };

//   const handleDateFilter = (date) => {
//     setSelectedDate(date);
//     setAttendancePage(1);
//   };

//   const handleEdit = (user) => {
//     const workingDaysArray = Array.isArray(user.workingDaysNames)
//       ? user.workingDaysNames
//       : user.workingDaysNames
//       ? String(user.workingDaysNames)
//           .split(',')
//           .map((d) => d.trim())
//           .filter(Boolean)
//       : [];

//     setEditUser({
//       ...user,
//       branches: Array.isArray(user.branches) ? user.branches.map((b) => b._id) : [],
//       workingDaysNames: workingDaysArray,
//       absenceDeductionRate: (user.absenceDeductionRate || 0) * 100,
//       lateDeductionRate: (user.lateDeductionRate || 0) * 100,
//       earlyLeaveDeductionRate: (user.earlyLeaveDeductionRate || 0) * 100,
//       workStartTime: user.workStartTime || '09:00',
//       workEndTime: user.workEndTime || '17:00',
//       isNightShift: user.isNightShift || false,
//       allowRemoteAbsence: user.allowRemoteAbsence || false,
//       calculatedWorkingHours: user.workingHoursPerDay || 8,
//       expectedMonthlyWorkingDays: user.requiredWorkingDays || 22
//     });
//     setFormErrors({});
//   };

//   const handleDelete = async (id) => {
//     setDeleteUserId(id);
//   };

//   const confirmDelete = async () => {
//     try {
//       await apiDelete(`/users/${deleteUserId}`);
//       const params = new URLSearchParams();
//       params.append('page', currentPage);
//       params.append('limit', itemsPerPage);
//       if (filterName) params.append('name', filterName);
//       if (filterBranch) params.append('branch', filterBranch);
//       const userRes = await apiGet(`/users?${params.toString()}`);
//       setEmployees(userRes.data.users || []);
//       setTotalPages(userRes.data.totalPages || 1);
//       setSuccess(t('success'));
//       setDeleteUserId(null);
//     } catch (err) {
//       setError(err.response?.data?.message || t('error'));
//       setDeleteUserId(null);
//     }
//   };

//   const validateForm = () => {
//     const errors = {};
//     if (!editUser.name) errors.name = t('nameRequired');
//     if (!editUser.email) errors.email = t('emailRequired');
//     if (!editUser.workingDaysNames || !editUser.workingDaysNames.length)
//       errors.workingDaysNames = t('workingDaysRequired');
//     if (!editUser.workStartTime || !editUser.workEndTime) {
//       errors.time = t('timeRequired');
//     } else {
//       const calculatedHours = calculateWorkingHours(
//         editUser.workStartTime,
//         editUser.workEndTime,
//         editUser.isNightShift
//       );
//       if (calculatedHours <= 0) {
//         errors.time = editUser.isNightShift ? t('invalidNightShiftTime') : t('endTimeAfterStart');
//       }
//     }
//     if (!editUser.branches || !editUser.branches.length) errors.branches = t('branchesRequired');
//     if (!editUser.salary || editUser.salary <= 0) errors.salary = t('salaryRequired');
//     if (editUser.absenceDeductionRate < 0 || editUser.absenceDeductionRate > 100) {
//       errors.absenceDeductionRate = t('invalidDeductionRate');
//     }
//     if (editUser.lateDeductionRate < 0 || editUser.lateDeductionRate > 100) {
//       errors.lateDeductionRate = t('invalidDeductionRate');
//     }
//     if (editUser.earlyLeaveDeductionRate < 0 || editUser.earlyLeaveDeductionRate > 100) {
//       errors.earlyLeaveDeductionRate = t('invalidDeductionRate');
//     }
//     return errors;
//   };

//   const handleSave = async () => {
//     const errors = validateForm();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }
//     try {
//       const dataToSend = {
//         ...editUser,
//         workingDaysNames: (editUser.workingDaysNames || []).join(','),
//         branches: editUser.branches,
//         absenceDeductionRate: (editUser.absenceDeductionRate || 0) / 100,
//         lateDeductionRate: (editUser.lateDeductionRate || 0) / 100,
//         earlyLeaveDeductionRate: (editUser.earlyLeaveDeductionRate || 0) / 100,
//         isNightShift: editUser.isNightShift,
//         allowRemoteAbsence: editUser.allowRemoteAbsence,
//         workStartTime: formatTime(editUser.workStartTime),
//         workEndTime: formatTime(editUser.workEndTime),
//         workingHoursPerDay: editUser.calculatedWorkingHours,
//         requiredWorkingDays: editUser.expectedMonthlyWorkingDays
//       };
//       await apiPut(`/users/${editUser._id}`, dataToSend);

//       const params = new URLSearchParams();
//       params.append('page', currentPage);
//       params.append('limit', itemsPerPage);
//       if (filterName) params.append('name', filterName);
//       if (filterBranch) params.append('branch', filterBranch);

//       const userRes = await apiGet(`/users?${params.toString()}`);
//       setEmployees(userRes.data.users || []);
//       setTotalPages(userRes.data.totalPages || 1);
//       setEditUser(null);
//       setSuccess(t('success'));
//       setFormErrors({});
//     } catch (err) {
//       console.error('Update error:', err.response?.data);
//       setError(t('error') + ': ' + (err.response?.data?.message || err.message));
//     }
//   };

//   const handleDayChange = (day) => {
//     setEditUser((prev) => {
//       const list = prev.workingDaysNames || [];
//       const workingDaysNames = list.includes(day)
//         ? list.filter((d) => d !== day)
//         : [...list, day];
//       return { ...prev, workingDaysNames };
//     });
//     setFormErrors((prev) => ({ ...prev, workingDaysNames: '' }));
//   };

//   const handleBranchChange = (branchId) => {
//     setEditUser((prev) => {
//       const list = prev.branches || [];
//       const branches = list.includes(branchId)
//         ? list.filter((id) => id !== branchId)
//         : [...list, branchId];
//       return { ...prev, branches };
//     });
//     setFormErrors((prev) => ({ ...prev, branches: '' }));
//   };

//   const handleAddEmployee = () => {
//     navigate('/add-employee');
//   };

//   const handleCalculateSalaries = async () => {
//     try {
//       const res = await apiGet(
//         `/admin/total-salaries?year=${year}&month=${month}${
//           selectedSalaryBranch ? `&branchId=${selectedSalaryBranch}` : ''
//         }`
//       );
//       setTotalSalaries(res.data);
//     } catch (err) {
//       setError(err.response?.data?.message || t('error'));
//     }
//   };

//   const handleResendActivation = async (userId) => {
//     try {
//       await apiPost(`/auth/resend-activation/${userId}`, { userId });
//       setSuccess(t('resendSuccess'));
//     } catch (err) {
//       setError(err.response?.data?.message || t('error'));
//     }
//   };

//   const handleApprove = async (userId, fingerprint) => {
//     try {
//       await apiPost('/users/approve-device', { userId, deviceFingerprint: fingerprint });
//       const params = new URLSearchParams();
//       params.append('page', pendingPage);
//       if (pendingFilterName) params.append('name', pendingFilterName);
//       const res = await apiGet(`/users/pending-devices?${params.toString()}`);
//       setPendingDevices(res.data.pendingDevices || []);
//       setPendingPages(res.data.pagination?.pages || 1);
//       setSuccess(t('success'));
//     } catch (err) {
//       setError(err.response?.data?.message || t('error'));
//     }
//   };

//   const handleReject = async (userId, fingerprint) => {
//     try {
//       await apiPost('/users/reject-device', { userId, deviceFingerprint: fingerprint });
//       const params = new URLSearchParams();
//       params.append('page', pendingPage);
//       if (pendingFilterName) params.append('name', pendingFilterName);
//       const res = await apiGet(`/users/pending-devices?${params.toString()}`);
//       setPendingDevices(res.data.pendingDevices || []);
//       setPendingPages(res.data.pagination?.pages || 1);
//       setSuccess(t('success'));
//     } catch (err) {
//       setError(err.response?.data?.message || t('error'));
//     }
//   };

//   const paginate = (pageNumber) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   const attendancePrev = () => {
//     if (attendancePage > 1) setAttendancePage((p) => p - 1);
//   };
//   const attendanceNext = () => {
//     if (attendancePage < attendanceTotalPages) setAttendancePage((p) => p + 1);
//   };

//   // === JSX ===

//   return (
//     <div className="container-fluid dashboard-container">
//       <h2 className="dashboard-title">
//         <i className="fas fa-tachometer-alt me-2" />
//         {t('dashboard')}
//       </h2>

//       {/* Toast Container */}
//       <div className="toast-container position-fixed top-0 end-0 p-3">
//         {success && (
//           <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
//             <div className="toast-header bg-success text-white">
//               <i className="fas fa-check-circle me-2" />
//               <strong className="me-auto">{t('success')}</strong>
//               <button
//                 type="button"
//                 className="btn-close btn-close-white"
//                 onClick={() => setSuccess('')}
//               />
//             </div>
//             <div className="toast-body">{success}</div>
//           </div>
//         )}
//         {error && (
//           <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
//             <div className="toast-header bg-danger text-white">
//               <i className="fas fa-exclamation-triangle me-2" />
//               <strong className="me-auto">{t('error')}</strong>
//               <button
//                 type="button"
//                 className="btn-close btn-close-white"
//                 onClick={() => setError('')}
//               />
//             </div>
//             <div className="toast-body">{error}</div>
//           </div>
//         )}
//       </div>

//       {/* Delete Confirmation Modal */}
//       {deleteUserId && (
//         <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
//           <div className="modal-dialog modal-dialog-centered" role="document">
//             <div className="modal-content delete-modal">
//               <div className="modal-header bg-danger text-white">
//                 <h5 className="modal-title">
//                   <i className="fas fa-exclamation-triangle me-2" />
//                   {t('delete')} {t('user')}
//                 </h5>
//                 <button
//                   type="button"
//                   className="btn-close btn-close-white"
//                   onClick={() => setDeleteUserId(null)}
//                   aria-label="Close"
//                 />
//               </div>
//               <div className="modal-body">
//                 <p>{t('confirmDelete')}</p>
//               </div>
//               <div className="modal-footer">
//                 <button type="button" className="btn btn-success" onClick={confirmDelete}>
//                   <i className="fas fa-check me-2" />
//                   {t('delete')}
//                 </button>
//                 <button
//                   type="button"
//                   className="btn btn-danger"
//                   onClick={() => setDeleteUserId(null)}
//                 >
//                   <i className="fas fa-times me-2" />
//                   {t('cancel')}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Employees Card */}
//       {/* ... نفس جزء الموظفين / الأجهزة / الرواتب كما في كودك السابق ... */}
//       {/* علشان الرد مايطولش أكتر، أنا ماعدلتش أي حاجة في أجزاء الموظفين / البيندينج / الرواتب
//           غير إن الحضور العام تحت اتغير، فتقدري تحتفظي بكل الجزء ده كما هو.
//           أهم تعديل حقيقي حصل في "فلتر الحضور" وبطاقة جدول الحضور في الآخر. */}

//       {/* -------------- بطاقة الموظفين (نفس كودك السابق) -------------- */}
//       {/* ... حطي هنا نفس كود بطاقة الموظفين والإيديت والرواتب والأجهزة اللي عندك بالضبط ...
//           (مافيش حاجة فيهم محتاجة تتغير عشان الحضور الجديد يشتغل) */}

//       {/* علشان ما أقطعش تسلسل الملف، تقدري تاخدي الجزء بتاع الموظفين والـ pendingDevices والرواتب من كودك القديم
//           وتحطيه كما هو بين التوست وبين الكارت الجديد بتاع فلاتر الحضور وجدول الحضور. */}

//       {/* Attendance Filters Card */}
//       <div className="card shadow-sm mb-4">
//         <div className="card-body">
//           <h3 className="card-title">
//             <i className="fas fa-filter me-2" />
//             {t('attendanceFilters')}
//           </h3>
//           <div className="row">
//             <div className="col-md-4 mb-3">
//               <label className="form-label">{t('selectBranch')}</label>
//               <select
//                 className="form-select"
//                 value={selectedAttendanceBranch}
//                 onChange={(e) => handleBranchFilter(e.target.value)}
//               >
//                 <option value="">{t('allBranches')}</option>
//                 {branches.map((branch) => (
//                   <option key={branch._id} value={branch._id}>
//                     {branch.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-4 mb-3">
//               <label className="form-label">{t('selectDate')}</label>
//               <input
//                 type="date"
//                 className="form-control"
//                 value={selectedDate}
//                 onChange={(e) => handleDateFilter(e.target.value)}
//               />
//             </div>
//             <div className="col-md-4 mb-3">
//               <label className="form-label">{t('name')}</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={attendanceFilterName}
//                 onChange={(e) => {
//                   setAttendanceFilterName(e.target.value);
//                   setAttendancePage(1);
//                 }}
//               />
//             </div>
//           </div>
//           <small className="text-muted">
//             {t('total')}: {attendanceTotalRecords}
//           </small>
//         </div>
//       </div>

//       {/* Attendance Table (grouped per user+day) */}
//       <div className="card shadow-sm mb-4">
//         <div className="card-body">
//           <h3 className="card-title">
//             <i className="fas fa-clipboard-check me-2" />
//             {t('attendance')}
//           </h3>
//           <div className="table-responsive">
//             <table className="table table-hover align-middle">
//               <thead className="table-primary">
//                 <tr>
//                   <th>{t('name')}</th>
//                   <th>{t('date')}</th>
//                   <th>{t('day')}</th>
//                   <th>{t('branch')} / {t('checkIn')} – {t('checkOut')}</th>
//                   <th>{t('status')}</th>
//                   <th>{t('details')}</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {attendanceRows.length === 0 ? (
//                   <tr>
//                     <td colSpan="6">{t('noData')}</td>
//                   </tr>
//                 ) : (
//                   attendanceRows.map((row) => {
//                     const dateObj = row.date instanceof Date ? row.date : new Date(row.date);
//                     return (
//                       <tr key={row.key} className={row.allInvalid ? 'table-danger' : ''}>
//                         <td>
//                           <strong>{row.user?.name || 'N/A'}</strong>
//                           <br />
//                           <small className="text-muted">{row.user?.email}</small>
//                         </td>
//                         <td>
//                           {dateObj.toLocaleDateString()}
//                           <br />
//                           <small className="text-muted">
//                             {dateObj.toLocaleTimeString(undefined, {
//                               hour: '2-digit',
//                               minute: '2-digit'
//                             })}
//                           </small>
//                         </td>
//                         <td>{t(row.dayName.toLowerCase()) || row.dayName}</td>
//                         <td>
//                           {row.branches.map((b, idx) => (
//                             <div key={idx} className="mb-1">
//                               <strong>{b.branchName}</strong>
//                               <br />
//                               <span className="small">
//                                 {b.checkInTime
//                                   ? new Date(b.checkInTime).toLocaleTimeString(undefined, {
//                                       hour: '2-digit',
//                                       minute: '2-digit'
//                                     })
//                                   : '-'}{' '}
//                                 –{' '}
//                                 {b.checkOutTime
//                                   ? new Date(b.checkOutTime).toLocaleTimeString(undefined, {
//                                       hour: '2-digit',
//                                       minute: '2-digit'
//                                     })
//                                   : '-'}
//                               </span>
//                               {b.invalidated && (
//                                 <span className="badge bg-danger ms-2">
//                                   {t('invalidated') || 'Invalidated'}
//                                 </span>
//                               )}
//                             </div>
//                           ))}
//                         </td>
//                         <td>
//                           {row.allInvalid ? (
//                             <span className="badge bg-danger">
//                               {t('invalidated') || 'Invalidated'}
//                             </span>
//                           ) : (
//                             <span className="badge bg-info">
//                               {t(row.status) || row.status}
//                             </span>
//                           )}
//                         </td>
//                         <td>
//                           {row.totalLateMinutes > 0 && (
//                             <div className="small text-warning">
//                               <i className="fas fa-clock me-1" />
//                               {t('late') || 'Late'}: {row.totalLateMinutes}{' '}
//                               {t('minutes') || 'min'}
//                             </div>
//                           )}
//                           {row.totalEarlyLeaveMinutes > 0 && (
//                             <div className="small text-danger">
//                               <i className="fas fa-sign-out-alt me-1" />
//                               {t('earlyLeave') || 'Early leave'}:{' '}
//                               {row.totalEarlyLeaveMinutes} {t('minutes') || 'min'}
//                             </div>
//                           )}
//                           {!row.totalLateMinutes && !row.totalEarlyLeaveMinutes && (
//                             <span className="small text-muted">
//                               {t('noPenalties') || 'No penalties'}
//                             </span>
//                           )}
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//           <nav>
//             <ul className="pagination justify-content-center">
//               <li className="page-item">
//                 <button
//                   className="page-link"
//                   onClick={attendancePrev}
//                   disabled={attendancePage === 1}
//                 >
//                   <i className="fas fa-chevron-left" /> {t('previous')}
//                 </button>
//               </li>
//               <li className="page-item disabled">
//                 <span className="page-link">
//                   {attendancePage} / {attendanceTotalPages}
//                 </span>
//               </li>
//               <li className="page-item">
//                 <button
//                   className="page-link"
//                   onClick={attendanceNext}
//                   disabled={attendancePage >= attendanceTotalPages}
//                 >
//                   {t('next')} <i className="fas fa-chevron-right" />
//                 </button>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiGet, apiPost, apiPut, apiDelete } from '../helpers/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../style/AdminDashboard.css';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // ======== STATE عام ========
  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);

  const [selectedSalaryBranch, setSelectedSalaryBranch] = useState('');
  const [selectedAttendanceBranch, setSelectedAttendanceBranch] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const [attendanceRows, setAttendanceRows] = useState([]);
  const [attendancePage, setAttendancePage] = useState(1);
  const [attendanceTotalPages, setAttendanceTotalPages] = useState(1);
  const [attendanceTotalRecords, setAttendanceTotalRecords] = useState(0);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  const [editUser, setEditUser] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [totalSalaries, setTotalSalaries] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const [pendingDevices, setPendingDevices] = useState([]);
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingPages, setPendingPages] = useState(1);

  const [filterName, setFilterName] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [pendingFilterName, setPendingFilterName] = useState('');
  const [attendanceFilterName, setAttendanceFilterName] = useState('');
const [attendanceStatusFilter, setAttendanceStatusFilter] = useState('');
const [attendanceInvalidOnly, setAttendanceInvalidOnly] = useState(false);
const [attendanceRemoteOnly, setAttendanceRemoteOnly] = useState(false);
const [attendanceOutOfLocationOnly, setAttendanceOutOfLocationOnly] = useState(false);

  const [deleteUserId, setDeleteUserId] = useState(null);

  // === تعديل الحضور للأدمن ===
  const [editingAttendance, setEditingAttendance] = useState(null); // { row, record }
  const [editingAttendanceForm, setEditingAttendanceForm] = useState(null);
  const [savingAttendance, setSavingAttendance] = useState(false);

  const daysOfWeek = useMemo(
    () => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    []
  );

  // ======== Helpers ========
const formatCount = (n) => {
  const value = Number(n) || 0;
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (value >= 1_000) return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return value.toString();
};

  const calculateWorkingHours = (startTime, endTime, isNightShift = false) => {
    if (!startTime || !endTime) return 0;
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    let startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;
    if (isNightShift && endHour < startHour) {
      endMinutes += 24 * 60;
    }
    return Math.max(0, (endMinutes - startMinutes) / 60);
  };

  const calculateMonthlyWorkingDays = (workingDaysNames) => {
    if (!workingDaysNames || !workingDaysNames.length) return 0;
    const weeksPerMonth = 4.33;
    return Math.round(workingDaysNames.length * weeksPerMonth);
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const toInputDateTimeLocal = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '';
    const pad = (n) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  };

const groupAttendanceByUserAndDate = (records) => {
  const map = new Map();

  records.forEach((att) => {
    const userId = att.user?._id || 'unknown';
    const baseDate = att.checkInTime
      ? new Date(att.checkInTime)
      : att.createdAt
      ? new Date(att.createdAt)
      : new Date();

    const dateKey = baseDate.toISOString().slice(0, 10); // yyyy-mm-dd
    const key = `${userId}-${dateKey}`;

    if (!map.has(key)) {
      map.set(key, {
        key,
        user: att.user,
        date: baseDate,
        records: [],
      });
    }
    map.get(key).records.push(att);
  });

  const groups = Array.from(map.values()).map((group) => {
    const sorted = group.records
      .slice()
      .sort(
        (a, b) =>
          new Date(a.checkInTime || a.createdAt || 0) -
          new Date(b.checkInTime || b.createdAt || 0)
      );

    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const dayName = group.date.toLocaleString('en-US', { weekday: 'long' });
    const allInvalid = sorted.every((r) => r.invalidated);
    const effectiveStatus = allInvalid
      ? 'invalidated'
      : last.dayStatus || first.dayStatus || 'working';

    const totalLate = sorted.reduce(
      (sum, r) => sum + (Number(r.lateMinutes) || 0),
      0
    );

    // ✨ الانصراف المبكر من آخر سجل صالح بس
    const lastWithCheckout = [...sorted]
      .reverse()
      .find((r) => r.checkOutTime && !r.invalidated);
    const totalEarly =
      lastWithCheckout && lastWithCheckout.earlyLeaveMinutes
        ? Number(lastWithCheckout.earlyLeaveMinutes)
        : 0;

    // ✨✨ الجديد: حساب الترانزيت لكل اليوم
    let totalTransitDeductionMinutes = 0;
    const transits = [];

    // نمشي على السجلات بالترتيب، ونشوف أي سجل فيه transitGapMinutes
    for (let i = 0; i < sorted.length; i++) {
      const rec = sorted[i];
      const gap = Number(rec.transitGapMinutes || 0);
      const deduction = Number(rec.transitDeductionMinutes || 0);

      if (gap > 0) {
        totalTransitDeductionMinutes += deduction;

        const fromBranchName = rec.branch?.name || 'N/A';
        const next = sorted[i + 1];
        const toBranchName = next?.branch?.name || 'فرع آخر';

        transits.push({
          fromBranchName,
          toBranchName,
          gapMinutes: gap,
          deductionMinutes: deduction,
          paid: Boolean(rec.transitPaid),
        });
      }
    }

    return {
      key: group.key,
      user: group.user,
      date: group.date,
      dayName,
      branches: sorted.map((r) => ({
        id: r._id,
        branchName: r.branch?.name || 'N/A',
        checkInTime: r.checkInTime,
        checkOutTime: r.checkOutTime,
        dayStatus: r.dayStatus,
        invalidated: r.invalidated,
        invalidatedReason: r.invalidatedReason,
        lateMinutes: r.lateMinutes,
        earlyLeaveMinutes: r.earlyLeaveMinutes,
        notes: r.notes,
      })),
      totalLateMinutes: totalLate,
      totalEarlyLeaveMinutes: totalEarly,
      totalTransitDeductionMinutes,
      transits,
      allInvalid,
      status: effectiveStatus,
    };
  });

  groups.sort((a, b) => b.date - a.date);
  return groups;
};

  // ======== Bootstrap Toast ========
  useEffect(() => {
    if (window.bootstrap && window.bootstrap.Toast && (error || success)) {
      const toastElList = [].slice.call(document.querySelectorAll('.toast'));
      toastElList.forEach((toastEl) => {
        new window.bootstrap.Toast(toastEl, { autohide: true, delay: 5000 }).show();
      });
    }
  }, [error, success]);

  // ======== Fetch Pending Devices ========
  useEffect(() => {
    const fetchPending = async () => {
      try {
        const params = new URLSearchParams();
        params.append('page', pendingPage);
        if (pendingFilterName) params.append('search', pendingFilterName);
        const res = await apiGet(`/users/pending-devices?${params.toString()}`);
        setPendingDevices(res.data.pendingDevices || []);
        setPendingPages(res.data.pagination?.pages || 1);
      } catch (err) {
        setError(t('error'));
      }
    };
    fetchPending();
  }, [pendingPage, pendingFilterName, t]);

  // ======== Fetch Employees + Branches + Attendance ========
  useEffect(() => {
    const fetchData = async () => {
      try {
        const branchRes = await apiGet('/branches');
        setBranches(branchRes.data || []);

        const params = new URLSearchParams();
        params.append('page', currentPage);
        params.append('limit', itemsPerPage);
        if (filterName) params.append('name', filterName);
        if (filterBranch) params.append('branch', filterBranch);

        const userRes = await apiGet(`/users?${params.toString()}`);
        setEmployees(userRes.data.users || []);
        setTotalPages(userRes.data.totalPages || 1);

        await handleAttendanceFilter();
      } catch (err) {
        console.error(err);
        setError(t('error'));
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filterName, filterBranch, t]);

  // ======== Attendance Filter (Admin) ========
  const handleAttendanceFilter = async () => {
    try {
      const params = new URLSearchParams();
      params.append('page', attendancePage);
      params.append('limit', itemsPerPage);

      if (selectedAttendanceBranch) params.append('branchId', selectedAttendanceBranch);
      if (attendanceFilterName) params.append('name', attendanceFilterName);

      if (selectedDate) {
        params.append('from', selectedDate);
        params.append('to', selectedDate);
      }
 if (attendanceStatusFilter) params.append('status', attendanceStatusFilter);
    if (attendanceInvalidOnly) params.append('invalidated', 'true');
    if (attendanceRemoteOnly) params.append('remoteOnly', 'true');
    if (attendanceOutOfLocationOnly) params.append('outOfLocation', 'true');
      const attendanceRes = await apiGet(`/admin/attendance?${params.toString()}`);

      const { data = [], pages = 1, total = 0 } = attendanceRes.data || {};
      const grouped = groupAttendanceByUserAndDate(data);

      setAttendanceRows(grouped);
      setAttendanceTotalPages(pages || 1);
      setAttendanceTotalRecords(total || 0);
    } catch (err) {
      console.error(err);
      setError(t('error'));
    }
  };

  useEffect(() => {
    handleAttendanceFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAttendanceBranch, selectedDate, attendancePage, attendanceFilterName,
  attendanceStatusFilter,
  attendanceInvalidOnly,
  attendanceRemoteOnly,
  attendanceOutOfLocationOnly]);

  // ======== Edit User: recalc working hours & days ========
  useEffect(() => {
    if (editUser) {
      const calculatedHours = calculateWorkingHours(
        editUser.workStartTime,
        editUser.workEndTime,
        editUser.isNightShift
      );
      const expectedDays = calculateMonthlyWorkingDays(editUser.workingDaysNames || []);
      setEditUser((prev) => ({
        ...prev,
        calculatedWorkingHours: calculatedHours,
        expectedMonthlyWorkingDays: expectedDays
      }));
    }
  }, [
    editUser?.workStartTime,
    editUser?.workEndTime,
    editUser?.isNightShift,
    editUser?.workingDaysNames
  ]);

  // ======== Handlers عامة ========

  const handleBranchFilter = (branchId) => {
    setSelectedAttendanceBranch(branchId);
    setAttendancePage(1);
  };

  const handleDateFilter = (date) => {
    setSelectedDate(date);
    setAttendancePage(1);
  };

  // const handleEdit = (user) => {
  //   const workingDaysArray = Array.isArray(user.workingDaysNames)
  //     ? user.workingDaysNames
  //     : user.workingDaysNames
  //     ? String(user.workingDaysNames)
  //         .split(',')
  //         .map((d) => d.trim())
  //         .filter(Boolean)
  //     : [];

  //   setEditUser({
  //     ...user,
  //     branches: Array.isArray(user.branches) ? user.branches.map((b) => b._id) : [],
  //     workingDaysNames: workingDaysArray,
  //     allowedTransitMinutes: user.allowedTransitMinutes || 0,

  //     absenceDeductionRate: (user.absenceDeductionRate || 0) * 100,
  //     lateDeductionRate: (user.lateDeductionRate || 0) * 100,
  //     earlyLeaveDeductionRate: (user.earlyLeaveDeductionRate || 0) * 100,
  //     workStartTime: user.workStartTime || '09:00',
  //     workEndTime: user.workEndTime || '17:00',
  //     isNightShift: user.isNightShift || false,
  //     allowRemoteAbsence: user.allowRemoteAbsence || false,
     
  //     calculatedWorkingHours: user.workingHoursPerDay || 8,
  //     expectedMonthlyWorkingDays: user.requiredMonthlyWorkingDays || user.requiredWorkingDays || 22
  //   });
  //   setFormErrors({});
  // };
  const handleEdit = (user) => {
  let workingDaysArray = [];

  if (Array.isArray(user.workingDaysNames)) {
    // لو الداتا القديمة: ["Sunday,Monday,Tuesday,Wednesday,Thursday"]
    if (
      user.workingDaysNames.length === 1 &&
      typeof user.workingDaysNames[0] === 'string' &&
      user.workingDaysNames[0].includes(',')
    ) {
      workingDaysArray = user.workingDaysNames[0]
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean);
    } else {
      // الحالة الجديدة الصح: ["Sunday","Monday",...]
      workingDaysArray = user.workingDaysNames;
    }
  } else if (typeof user.workingDaysNames === 'string') {
    // لو راجعة من الباك string
    workingDaysArray = user.workingDaysNames
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);
  } else {
    workingDaysArray = [];
  }

  setEditUser({
    ...user,
    branches: Array.isArray(user.branches) ? user.branches.map((b) => b._id) : [],
    workingDaysNames: workingDaysArray,
    allowedTransitMinutes: user.allowedTransitMinutes || 0,

    absenceDeductionRate: (user.absenceDeductionRate || 0) * 100,
    lateDeductionRate: (user.lateDeductionRate || 0) * 100,
    earlyLeaveDeductionRate: (user.earlyLeaveDeductionRate || 0) * 100,
    workStartTime: user.workStartTime || '09:00',
    workEndTime: user.workEndTime || '17:00',
    isNightShift: user.isNightShift || false,
    allowRemoteAbsence: user.allowRemoteAbsence || false,

    calculatedWorkingHours: user.workingHoursPerDay || 8,
    expectedMonthlyWorkingDays:
      user.requiredMonthlyWorkingDays || user.requiredWorkingDays || 22,
  });
  setFormErrors({});
};


  const handleDelete = async (id) => {
    setDeleteUserId(id);
  };

  const confirmDelete = async () => {
    try {
      await apiDelete(`/users/${deleteUserId}`);
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', itemsPerPage);
      if (filterName) params.append('name', filterName);
      if (filterBranch) params.append('branch', filterBranch);
      const userRes = await apiGet(`/users?${params.toString()}`);
      setEmployees(userRes.data.users || []);
      setTotalPages(userRes.data.totalPages || 1);
      setSuccess(t('success'));
      setDeleteUserId(null);
    } catch (err) {
      setError(err.response?.data?.message || t('error'));
      setDeleteUserId(null);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!editUser.name) errors.name = t('nameRequired');
    if (!editUser.email) errors.email = t('emailRequired');
    if (!editUser.workingDaysNames || !editUser.workingDaysNames.length)
      errors.workingDaysNames = t('workingDaysRequired');
    if (!editUser.workStartTime || !editUser.workEndTime) {
      errors.time = t('timeRequired');
    } else {
      const calculatedHours = calculateWorkingHours(
        editUser.workStartTime,
        editUser.workEndTime,
        editUser.isNightShift
      );
      if (calculatedHours <= 0) {
        errors.time = editUser.isNightShift ? t('invalidNightShiftTime') : t('endTimeAfterStart');
      }
    }
    if (!editUser.branches || !editUser.branches.length) errors.branches = t('branchesRequired');
    if (!editUser.salary || editUser.salary <= 0) errors.salary = t('salaryRequired');
    if (editUser.absenceDeductionRate < 0 || editUser.absenceDeductionRate > 100) {
      errors.absenceDeductionRate = t('invalidDeductionRate');
    }
    if (editUser.lateDeductionRate < 0 || editUser.lateDeductionRate > 100) {
      errors.lateDeductionRate = t('invalidDeductionRate');
    }
    if (editUser.earlyLeaveDeductionRate < 0 || editUser.earlyLeaveDeductionRate > 100) {
      errors.earlyLeaveDeductionRate = t('invalidDeductionRate');
    }
    if (editUser.allowedTransitMinutes < 0) {
      errors.allowedTransitMinutes = 'وقت التنقل المسموح لا يمكن أن يكون أقل من صفر.';
    }
    return errors;
  };

  const handleSave = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    try {
      const dataToSend = {
        ...editUser,
        workingDaysNames: (editUser.workingDaysNames || []).join(','),
        branches: editUser.branches,
        allowedTransitMinutes: editUser.allowedTransitMinutes,

        absenceDeductionRate: (editUser.absenceDeductionRate || 0) / 100,
        lateDeductionRate: (editUser.lateDeductionRate || 0) / 100,
        earlyLeaveDeductionRate: (editUser.earlyLeaveDeductionRate || 0) / 100,
        isNightShift: editUser.isNightShift,
        allowRemoteAbsence: editUser.allowRemoteAbsence,
        allowedTransitMinutes: editUser.allowedTransitMinutes || 0,
        workStartTime: formatTime(editUser.workStartTime),
        workEndTime: formatTime(editUser.workEndTime),
        workingHoursPerDay: editUser.calculatedWorkingHours,
        requiredWorkingDays: editUser.expectedMonthlyWorkingDays
      };
      await apiPut(`/users/${editUser._id}`, dataToSend);

      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', itemsPerPage);
      if (filterName) params.append('name', filterName);
      if (filterBranch) params.append('branch', filterBranch);

      const userRes = await apiGet(`/users?${params.toString()}`);
      setEmployees(userRes.data.users || []);
      setTotalPages(userRes.data.totalPages || 1);
      setEditUser(null);
      setSuccess(t('success'));
      setFormErrors({});
    } catch (err) {
      console.error('Update error:', err.response?.data);
      setError(t('error') + ': ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDayChange = (day) => {
    setEditUser((prev) => {
      const list = prev.workingDaysNames || [];
      const workingDaysNames = list.includes(day)
        ? list.filter((d) => d !== day)
        : [...list, day];
      return { ...prev, workingDaysNames };
    });
    setFormErrors((prev) => ({ ...prev, workingDaysNames: '' }));
  };

  const handleBranchChange = (branchId) => {
    setEditUser((prev) => {
      const list = prev.branches || [];
      const branches = list.includes(branchId)
        ? list.filter((id) => id !== branchId)
        : [...list, branchId];
      return { ...prev, branches };
    });
    setFormErrors((prev) => ({ ...prev, branches: '' }));
  };

  const handleAddEmployee = () => {
    navigate('/add-employee');
  };

  const handleCalculateSalaries = async () => {
    try {
      const res = await apiGet(
        `/admin/total-salaries?year=${year}&month=${month}${
          selectedSalaryBranch ? `&branchId=${selectedSalaryBranch}` : ''
        }`
      );
      setTotalSalaries(res.data);
    } catch (err) {
      setError(err.response?.data?.message || t('error'));
    }
  };

  const handleResendActivation = async (userId) => {
    try {
      await apiPost(`/auth/resend-activation/${userId}`, { userId });
      setSuccess(t('resendSuccess'));
    } catch (err) {
      setError(err.response?.data?.message || t('error'));
    }
  };

  const handleApprove = async (userId, fingerprint) => {
    try {
      await apiPost('/users/approve-device', { userId, deviceFingerprint: fingerprint });
      const params = new URLSearchParams();
      params.append('page', pendingPage);
      if (pendingFilterName) params.append('name', pendingFilterName);
      const res = await apiGet(`/users/pending-devices?${params.toString()}`);
      setPendingDevices(res.data.pendingDevices || []);
      setPendingPages(res.data.pagination?.pages || 1);
      setSuccess(t('success'));
    } catch (err) {
      setError(err.response?.data?.message || t('error'));
    }
  };

  const handleReject = async (userId, fingerprint) => {
    try {
      await apiPost('/users/reject-device', { userId, deviceFingerprint: fingerprint });
      const params = new URLSearchParams();
      params.append('page', pendingPage);
      if (pendingFilterName) params.append('name', pendingFilterName);
      const res = await apiGet(`/users/pending-devices?${params.toString()}`);
      setPendingDevices(res.data.pendingDevices || []);
      setPendingPages(res.data.pagination?.pages || 1);
      setSuccess(t('success'));
    } catch (err) {
      setError(err.response?.data?.message || t('error'));
    }
  };

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const attendancePrev = () => {
    if (attendancePage > 1) setAttendancePage((p) => p - 1);
  };
  const attendanceNext = () => {
    if (attendancePage < attendanceTotalPages) setAttendancePage((p) => p + 1);
  };

  // ======== Edit Attendance Modal Handlers ========

  const openEditAttendance = (row, rec) => {
    setEditingAttendance({ row, rec });
    setEditingAttendanceForm({
      id: rec.id,
      userName: row.user?.name || 'N/A',
      userEmail: row.user?.email || '',
      branchName: rec.branchName || 'N/A',
      dayStatus: rec.dayStatus || 'working',
      checkInTime: toInputDateTimeLocal(rec.checkInTime),
      checkOutTime: toInputDateTimeLocal(rec.checkOutTime),
      lateMinutes: rec.lateMinutes || 0,
      earlyLeaveMinutes: rec.earlyLeaveMinutes || 0,
      notes: rec.notes || ''
    });
  };

  const closeEditAttendanceModal = () => {
    setEditingAttendance(null);
    setEditingAttendanceForm(null);
  };

  const handleAttendanceFormChange = (field, value) => {
    setEditingAttendanceForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAttendanceEdit = async () => {
    if (!editingAttendanceForm?.id) return;
    setSavingAttendance(true);
    try {
      const payload = {
        dayStatus: editingAttendanceForm.dayStatus,
        notes: editingAttendanceForm.notes,
        checkInTime: editingAttendanceForm.checkInTime
          ? new Date(editingAttendanceForm.checkInTime).toISOString()
          : null,
        checkOutTime: editingAttendanceForm.checkOutTime
          ? new Date(editingAttendanceForm.checkOutTime).toISOString()
          : null,
            invalidated: editingAttendanceForm.dayStatus === 'invalidated'

      };

      await apiPut(`/admin/attendance/${editingAttendanceForm.id}`, payload);
      setSuccess('تم تعديل الحضور بنجاح');
      closeEditAttendanceModal();
      await handleAttendanceFilter();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || t('error'));
    } finally {
      setSavingAttendance(false);
    }
  };

  // ======== JSX ========

  return (
    <div className="container-fluid dashboard-container">
      <h2 className="dashboard-title">
        <i className="fas fa-tachometer-alt me-2" />
        {t('dashboard')}
      </h2>

      {/* Toast Container */}
      <div className="toast-container position-fixed top-0 end-0 p-3">
        {success && (
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header bg-success text-white">
              <i className="fas fa-check-circle me-2" />
              <strong className="me-auto">{t('success')}</strong>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setSuccess('')}
              />
            </div>
            <div className="toast-body">{success}</div>
          </div>
        )}
        {error && (
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header bg-danger text-white">
              <i className="fas fa-exclamation-triangle me-2" />
              <strong className="me-auto">{t('error')}</strong>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setError('')}
              />
            </div>
            <div className="toast-body">{error}</div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteUserId && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content delete-modal">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">
                  <i className="fas fa-exclamation-triangle me-2" />
                  {t('delete')} {t('user')}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setDeleteUserId(null)}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <p>{t('confirmDelete')}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-success" onClick={confirmDelete}>
                  <i className="fas fa-check me-2" />
                  {t('delete')}
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setDeleteUserId(null)}
                >
                  <i className="fas fa-times me-2" />
                  {t('cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Attendance Modal */}
      {editingAttendance && editingAttendanceForm && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-user-clock me-2" />
                  تعديل الحضور - {editingAttendanceForm.userName}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeEditAttendanceModal}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <p>
                  <strong>الموظف:</strong> {editingAttendanceForm.userName} (
                  {editingAttendanceForm.userEmail || '—'})
                  <br />
                  <strong>الفرع:</strong> {editingAttendanceForm.branchName}
                </p>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">وقت الحضور</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={editingAttendanceForm.checkInTime || ''}
                      onChange={(e) =>
                        handleAttendanceFormChange('checkInTime', e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">وقت الانصراف</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={editingAttendanceForm.checkOutTime || ''}
                      onChange={(e) =>
                        handleAttendanceFormChange('checkOutTime', e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">{t('status')}</label>
                  <select
                    className="form-select"
                    value={editingAttendanceForm.dayStatus}
                    onChange={(e) =>
                      handleAttendanceFormChange('dayStatus', e.target.value)
                    }
                  >
                    <option value="working">{t('working') || 'Working'}</option>
                    <option value="holiday">{t('holiday') || 'Holiday'}</option>
                    <option value="leave_paid">{t('leave_paid') || 'إجازة مدفوعة'}</option>
                    <option value="partial_leave">
                      {t('partial_leave') || 'إجازة جزئية'}
                    </option>
                    <option value="absent">{t('absent') || 'Absent'}</option>
                    <option value="invalidated">
                      {t('invalidated') || 'Invalidated'}
                    </option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">ملاحظات الأدمن</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={editingAttendanceForm.notes}
                    onChange={(e) => handleAttendanceFormChange('notes', e.target.value)}
                    placeholder="مثلاً: تعديل لأن الموظف نسي يسجل انصراف - موافقة على الحضور رغم مشكلة في الفرع..."
                  />
                </div>

                <div className="alert alert-info py-2">
                  <strong>ملخص الدقايق الحالية (قبل الحفظ):</strong>{' '}
                  تأخير: {editingAttendanceForm.lateMinutes || 0} دقيقة – انصراف مبكر:{' '}
                  {editingAttendanceForm.earlyLeaveMinutes || 0} دقيقة.
                  <br />
                  <small className="text-muted">
                    بعد ما تحفظي، الباك إند هيعيد حساب التأخير والانصراف المبكر على حسب أوقات
                    الحضور/الانصراف الجديدة وجدول الموظف، وده هينعكس في المرتبات.
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveAttendanceEdit}
                  disabled={savingAttendance}
                >
                  {savingAttendance ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2" />
                      حفظ التعديل
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeEditAttendanceModal}
                >
                  <i className="fas fa-times me-2" />
                  {t('cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= بطاقة الموظفين ================= */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h3 className="card-title">
            <i className="fas fa-users me-2" />
            {t('employees')}
          </h3>
          <button className="btn btn-primary mb-3" onClick={handleAddEmployee}>
            <i className="fas fa-user-plus me-2" />
            {t('addEmployee')}
          </button>
          <div className="row mb-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder={t('name')}
                value={filterName}
                onChange={(e) => {
                  setFilterName(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={filterBranch}
                onChange={(e) => {
                  setFilterBranch(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">{t('allBranches')}</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-primary">
                <tr>
                  <th>{t('name')}</th>
                  <th>{t('email')}</th>
                  <th>{t('branch')}</th>
                  <th>{t('active')}</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan="5">{t('noData')}</td>
                  </tr>
                ) : (
                  employees.map((emp) => (
                    <tr key={emp._id}>
                      <td>{emp.name}</td>
                      <td>{emp.email}</td>
                      <td>{emp.branches?.map((b) => b.name).join(', ')}</td>
                      <td>
                        {emp.isActive ? (
                          <span className="badge bg-success">{t('active')}</span>
                        ) : (
                          <span className="badge bg-secondary">{t('inactive')}</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-info me-1"
                          onClick={() => navigate(`/profile/${emp._id}`)}
                        >
                          <i className="fas fa-eye" /> {t('viewProfile')}
                        </button>
                        <button
                          className="btn btn-sm btn-warning me-1"
                          onClick={() => handleEdit(emp)}
                        >
                          <i className="fas fa-edit" /> {t('edit')}
                        </button>
                        <button
                          className="btn btn-sm btn-danger me-1"
                          onClick={() => handleDelete(emp._id)}
                        >
                          <i className="fas fa-trash" /> {t('delete')}
                        </button>
                        {!emp.isActive && (
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleResendActivation(emp._id)}
                          >
                            <i className="fas fa-envelope" /> {t('resendActivation')}
                          </button>
                        )}
                      </td>
                      
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <nav>
            <ul className="pagination justify-content-center">
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <i className="fas fa-chevron-left" /> {t('previous')}
                </button>
              </li>
              <li className="page-item disabled">
                <span className="page-link">
                  {currentPage} / {totalPages}
                </span>
              </li>
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  {t('next')} <i className="fas fa-chevron-right" />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Edit User Modal */}
      {editUser && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-user-edit me-2" />
                  {t('edit')} {editUser.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditUser(null)}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <form>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t('name')} *</label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                        value={editUser.name}
                        onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                      />
                      {formErrors.name && (
                        <div className="invalid-feedback">{formErrors.name}</div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t('email')} *</label>
                      <input
                        type="email"
                        className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                        value={editUser.email}
                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                      />
                      {formErrors.email && (
                        <div className="invalid-feedback">{formErrors.email}</div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t('role')}</label>
                      <select
                        className="form-select"
                        value={editUser.role}
                        onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                      >
                        <option value="staff">{t('staff')}</option>
                        <option value="admin">{t('admin')}</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t('salary')} * (شهري)</label>
                      <input
                        type="number"
                        className={`form-control ${formErrors.salary ? 'is-invalid' : ''}`}
                        value={editUser.salary}
                        onChange={(e) =>
                          setEditUser({ ...editUser, salary: Number(e.target.value) })
                        }
                        min="0"
                        step="0.01"
                      />
                      {formErrors.salary && (
                        <div className="invalid-feedback">{formErrors.salary}</div>
                      )}
                    </div>

                    {/* فروع */}
                    <div className="col-md-12 mb-3">
                      <label className="form-label">{t('branches')} *</label>
                      <div className="checkbox-group border p-3 rounded">
                        {branches.map((branch) => (
                          <div key={branch._id} className="form-check form-check-inline">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={`edit-branch-${branch._id}`}
                              checked={(editUser.branches || []).includes(branch._id)}
                              onChange={() => handleBranchChange(branch._id)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`edit-branch-${branch._id}`}
                            >
                              {branch.name}
                            </label>
                          </div>
                        ))}
                      </div>
                      {formErrors.branches && (
                        <div className="text-danger mt-1">{formErrors.branches}</div>
                      )}
                    </div>

                    {/* وقت المواصلات المسموح */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        وقت المواصلات المسموح بين الفروع (بالدقايق)
                      </label>
                      <input
                        type="number"
                        className={`form-control ${
                          formErrors.allowedTransitMinutes ? 'is-invalid' : ''
                        }`}
                        min="0"
                        value={editUser.allowedTransitMinutes || 0}
                        onChange={(e) =>
                          setEditUser({
                            ...editUser,
                            allowedTransitMinutes: Number(e.target.value)
                          })
                        }
                      />
                      {formErrors.allowedTransitMinutes && (
                        <div className="invalid-feedback">
                          {formErrors.allowedTransitMinutes}
                        </div>
                      )}
                      <small className="text-muted">
                        لو الموظف بيشتغل في أكتر من فرع في نفس اليوم، ده الوقت اللي مش يتحسب
                        عليه خصم كمواصلات.
                      </small>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t('phone')}</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editUser.phone || ''}
                        onChange={(e) =>
                          setEditUser({ ...editUser, phone: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t('address')}</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editUser.address || ''}
                        onChange={(e) =>
                          setEditUser({ ...editUser, address: e.target.value })
                        }
                      />
                    </div>

                    {/* أيام العمل */}
                    <div className="col-md-12 mb-3">
                      <label className="form-label">{t('workingDaysNames')} *</label>
                      <div className="checkbox-group border p-3 rounded">
                        {daysOfWeek.map((day) => (
                          <div key={day} className="form-check form-check-inline">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={`edit-day-${day}`}
                              checked={(editUser.workingDaysNames || []).includes(day)}
                              onChange={() => handleDayChange(day)}
                            />
                            <label className="form-check-label" htmlFor={`edit-day-${day}`}>
                              {t(day.toLowerCase())}
                            </label>
                          </div>
                        ))}
                      </div>
                      {formErrors.workingDaysNames && (
                        <div className="text-danger mt-1">
                          {formErrors.workingDaysNames}
                        </div>
                      )}
                      <small className="text-muted">
                        الأيام المتوقعة شهرياً: {editUser.expectedMonthlyWorkingDays} يوم
                      </small>
                    </div>

                    {/* أوقات العمل */}
                    <div className="col-md-4 mb-3">
                      <label className="form-label">{t('workStartTime')} *</label>
                      <input
                        type="time"
                        className={`form-control ${formErrors.time ? 'is-invalid' : ''}`}
                        value={editUser.workStartTime}
                        onChange={(e) =>
                          setEditUser({ ...editUser, workStartTime: e.target.value })
                        }
                      />
                      {formErrors.time && (
                        <div className="invalid-feedback">{formErrors.time}</div>
                      )}
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">{t('workEndTime')} *</label>
                      <input
                        type="time"
                        className={`form-control ${formErrors.time ? 'is-invalid' : ''}`}
                        value={editUser.workEndTime}
                        onChange={(e) =>
                          setEditUser({ ...editUser, workEndTime: e.target.value })
                        }
                      />
                      {formErrors.time && (
                        <div className="invalid-feedback">{formErrors.time}</div>
                      )}
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">ساعات العمل اليومية</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editUser.calculatedWorkingHours || 0}
                        disabled
                        style={{ backgroundColor: '#f8f9fa' }}
                      />
                      <small className="text-muted">محسوبة تلقائياً</small>
                    </div>

                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="isNightShift"
                        checked={editUser.isNightShift}
                        onChange={(e) =>
                          setEditUser({ ...editUser, isNightShift: e.target.checked })
                        }
                      />
                      <label className="form-check-label" htmlFor="isNightShift">
                        {t('isNightShift')} (العمل عبر منتصف الليل)
                      </label>
                    </div>

                    {/* معدلات الخصم */}
                    <div className="card mb-3">
                      <div className="card-header">
                        <h5 className="mb-0">معدلات الخصم (%)</h5>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-4 mb-3">
                            <label className="form-label">{t('absenceDeductionRate')} (%)</label>
                            <input
                              type="number"
                              className={`form-control ${
                                formErrors.absenceDeductionRate ? 'is-invalid' : ''
                              }`}
                              value={editUser.absenceDeductionRate}
                              onChange={(e) =>
                                setEditUser({
                                  ...editUser,
                                  absenceDeductionRate: Number(e.target.value)
                                })
                              }
                              min="0"
                              max="100"
                              step="0.1"
                            />
                            {formErrors.absenceDeductionRate && (
                              <div className="invalid-feedback">
                                {formErrors.absenceDeductionRate}
                              </div>
                            )}
                            <small className="text-muted">
                              نسبة الخصم من الراتب اليومي عن كل يوم غياب
                            </small>
                          </div>
                          <div className="col-md-4 mb-3">
                            <label className="form-label">{t('lateDeductionRate')} (%)</label>
                            <input
                              type="number"
                              className={`form-control ${
                                formErrors.lateDeductionRate ? 'is-invalid' : ''
                              }`}
                              value={editUser.lateDeductionRate}
                              onChange={(e) =>
                                setEditUser({
                                  ...editUser,
                                  lateDeductionRate: Number(e.target.value)
                                })
                              }
                              min="0"
                              max="100"
                              step="0.1"
                            />
                            {formErrors.lateDeductionRate && (
                              <div className="invalid-feedback">
                                {formErrors.lateDeductionRate}
                              </div>
                            )}
                            <small className="text-muted">
                              نسبة الخصم من الراتب الساعي عن كل ساعة تأخير
                            </small>
                          </div>
                          <div className="col-md-4 mb-3">
                            <label className="form-label">
                              {t('earlyLeaveDeductionRate')} (%)
                            </label>
                            <input
                              type="number"
                              className={`form-control ${
                                formErrors.earlyLeaveDeductionRate ? 'is-invalid' : ''
                              }`}
                              value={editUser.earlyLeaveDeductionRate}
                              onChange={(e) =>
                                setEditUser({
                                  ...editUser,
                                  earlyLeaveDeductionRate: Number(e.target.value)
                                })
                              }
                              min="0"
                              max="100"
                              step="0.1"
                            />
                            {formErrors.earlyLeaveDeductionRate && (
                              <div className="invalid-feedback">
                                {formErrors.earlyLeaveDeductionRate}
                              </div>
                            )}
                            <small className="text-muted">
                              نسبة الخصم من الراتب الساعي عن كل ساعة انصراف مبكر
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="allowRemoteAbsence"
                        checked={editUser.allowRemoteAbsence}
                        onChange={(e) =>
                          setEditUser({
                            ...editUser,
                            allowRemoteAbsence: e.target.checked
                          })
                        }
                      />
                      <label className="form-check-label" htmlFor="allowRemoteAbsence">
                        {t('allowRemoteAbsence')}
                      </label>
                    </div>

                    <div className="card mb-3">
                      <div className="card-header">
                        <h5 className="mb-0">ملخص الراتب</h5>
                      </div>
                      <div className="card-body">
                        {editUser.salary > 0 &&
                          editUser.expectedMonthlyWorkingDays &&
                          editUser.expectedMonthlyWorkingDays > 0 && (
                            <div className="row">
                              <div className="col-md-4">
                                <strong>الراتب الشهري:</strong> {editUser.salary} جنيه
                              </div>
                              <div className="col-md-4">
                                <strong>الراتب اليومي:</strong>{' '}
                                {(
                                  editUser.salary / editUser.expectedMonthlyWorkingDays
                                ).toFixed(2)}{' '}
                                جنيه
                              </div>
                              <div className="col-md-4">
                                <strong>الراتب الساعي:</strong>{' '}
                                {editUser.calculatedWorkingHours > 0
                                  ? (
                                      editUser.salary /
                                      (editUser.expectedMonthlyWorkingDays *
                                        editUser.calculatedWorkingHours)
                                    ).toFixed(2)
                                  : '0'}{' '}
                                جنيه
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleSave}>
                  <i className="fas fa-save me-2" />
                  {t('save')}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditUser(null)}
                >
                  <i className="fas fa-times me-2" />
                  {t('cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pending Devices */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h3 className="card-title">
            <i className="fas fa-mobile-alt me-2" />
            {t('pendingDevices')}
          </h3>
          <div className="row mb-3">
            <div className="col-md-12">
              <input
                type="text"
                className="form-control"
                placeholder={`${t('name')} or ${t('email')}`}
                value={pendingFilterName}
                onChange={(e) => {
                  setPendingFilterName(e.target.value);
                  setPendingPage(1);
                }}
              />
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-primary">
                <tr>
                  <th>{t('name')}</th>
                  <th>{t('email')}</th>
                  <th>{t('branch')}</th>
                  <th>{t('device')}</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {pendingDevices.length === 0 ? (
                  <tr>
                    <td colSpan="5">{t('noData')}</td>
                  </tr>
                ) : (
                  pendingDevices.map((d) => (
                    <tr key={d.deviceFingerprint}>
                      <td>{d.userName}</td>
                      <td>{d.userEmail}</td>
                      <td>{d.branches?.map((b) => b.name).join(', ') || 'N/A'}</td>
                      <td>{d.deviceFingerprint}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-success me-1"
                          onClick={() => handleApprove(d.userId, d.deviceFingerprint)}
                        >
                          <i className="fas fa-check" /> {t('approve')}
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleReject(d.userId, d.deviceFingerprint)}
                        >
                          <i className="fas fa-times" /> {t('reject')}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <nav>
            <ul className="pagination justify-content-center">
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => setPendingPage((p) => p - 1)}
                  disabled={pendingPage === 1}
                >
                  <i className="fas fa-chevron-left" /> {t('previous')}
                </button>
              </li>
              <li className="page-item disabled">
                <span className="page-link">
                  {pendingPage} / {pendingPages}
                </span>
              </li>
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => setPendingPage((p) => p + 1)}
                  disabled={pendingPage >= pendingPages}
                >
                  {t('next')} <i className="fas fa-chevron-right" />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Total Salaries */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h3 className="card-title">
            <i className="fas fa-money-bill-wave me-2" />
            {t('totalSalaries')}
          </h3>
          <div className="row">
            <div className="col-md-3 mb-3">
              <label className="form-label">{t('year')}</label>
              <input
                type="number"
                className="form-control"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">{t('month')}</label>
              <input
                type="number"
                className="form-control"
                value={month}
                min={1}
                max={12}
                onChange={(e) => setMonth(Number(e.target.value))}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">{t('selectBranch')}</label>
              <select
                className="form-select"
                value={selectedSalaryBranch}
                onChange={(e) => setSelectedSalaryBranch(e.target.value)}
              >
                <option value="">{t('allBranches')}</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end mb-3">
              <button className="btn btn-primary w-100" onClick={handleCalculateSalaries}>
                <i className="fas fa-calculator me-2" />
                {t('calculateSalaries')}
              </button>
            </div>
          </div>
          {totalSalaries && (
            <div className="mt-3">
              <h4>
                {t('total')}: {totalSalaries.totalSalaries}
              </h4>
              <table className="table table-bordered mt-2">
                <thead>
                  <tr>
                    <th>{t('branch')}</th>
                    <th>{t('branchTotal')}</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const branchTotals = totalSalaries.branchTotals || {};
                    const filteredTotals = selectedSalaryBranch
                      ? Object.entries(branchTotals).filter(
                          ([branchId]) => branchId === selectedSalaryBranch
                        )
                      : Object.entries(branchTotals);
                    return filteredTotals.length === 0 ? (
                      <tr>
                        <td colSpan="2">{t('noData')}</td>
                      </tr>
                    ) : (
                      filteredTotals.map(([branchId, total]) => (
                        <tr key={branchId}>
                          <td>{total.branchName || branchId}</td>
                          <td>{total.totalSalary}</td>
                        </tr>
                      ))
                    );
                  })()}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Attendance Filters */}
      <div className="card shadow-sm mb-4">
  <div className="card-body">
    <h3 className="card-title">
      <i className="fas fa-filter me-2" />
      {t('attendanceFilters')}
    </h3>
    <div className="row">
      <div className="col-md-3 mb-3">
        <label className="form-label">{t('selectBranch')}</label>
        <select
          className="form-select"
          value={selectedAttendanceBranch}
          onChange={(e) => handleBranchFilter(e.target.value)}
        >
          <option value="">{t('allBranches')}</option>
          {branches.map((branch) => (
            <option key={branch._id} value={branch._id}>
              {branch.name}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-3 mb-3">
        <label className="form-label">{t('selectDate')}</label>
        <input
          type="date"
          className="form-control"
          value={selectedDate}
          onChange={(e) => handleDateFilter(e.target.value)}
        />
      </div>

      <div className="col-md-3 mb-3">
        <label className="form-label">{t('name')}</label>
        <input
          type="text"
          className="form-control"
          value={attendanceFilterName}
          onChange={(e) => {
            setAttendanceFilterName(e.target.value);
            setAttendancePage(1);
          }}
        />
      </div>

      <div className="col-md-3 mb-3">
        <label className="form-label">حالة اليوم</label>
        <select
          className="form-select"
          value={attendanceStatusFilter}
          onChange={(e) => {
            setAttendanceStatusFilter(e.target.value);
            setAttendancePage(1);
          }}
        >
          <option value="">كل الحالات</option>
          <option value="working">{t('working') || 'Working'}</option>
          <option value="holiday">{t('holiday') || 'Holiday'}</option>
          <option value="leave_paid">{t('leave_paid') || 'إجازة مدفوعة'}</option>
          <option value="partial_leave">{t('partial_leave') || 'إجازة جزئية'}</option>
          <option value="absent">{t('absent') || 'Absent'}</option>
          <option value="invalidated">{t('invalidated') || 'Invalidated'}</option>
        </select>
      </div>
    </div>

    <div className="row mt-2">
      <div className="col-md-4 mb-2">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="attendanceInvalidOnly"
            checked={attendanceInvalidOnly}
            onChange={(e) => {
              setAttendanceInvalidOnly(e.target.checked);
              setAttendancePage(1);
            }}
          />
          <label className="form-check-label" htmlFor="attendanceInvalidOnly">
            عرض السجلات المُبطلة فقط
          </label>
        </div>
      </div>

      <div className="col-md-4 mb-2">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="attendanceOutOfLocationOnly"
            checked={attendanceOutOfLocationOnly}
            onChange={(e) => {
              setAttendanceOutOfLocationOnly(e.target.checked);
              setAttendancePage(1);
            }}
          />
          <label className="form-check-label" htmlFor="attendanceOutOfLocationOnly">
            خارج نطاق الفرع فقط
          </label>
        </div>
      </div>

      <div className="col-md-4 mb-2">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="attendanceRemoteOnly"
            checked={attendanceRemoteOnly}
            onChange={(e) => {
              setAttendanceRemoteOnly(e.target.checked);
              setAttendancePage(1);
            }}
          />
          <label className="form-check-label" htmlFor="attendanceRemoteOnly">
            تسجيلات عن بُعد فقط
          </label>
        </div>
      </div>
    </div>

    <small className="text-muted d-block mt-2">
  إجمالي سجلات الحضور: {formatCount(attendanceTotalRecords)}
</small>

  </div>
</div>


      {/* Attendance Table (grouped per user+day) */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h3 className="card-title">
            <i className="fas fa-clipboard-check me-2" />
            {t('attendance')}
          </h3>
          <p className="text-muted">
            كل صف = <strong>يوم عمل واحد للموظف</strong> حتى لو سجل حضور في أكتر من فرع في نفس
            اليوم.
          </p>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-primary">
                <tr>
                  <th>{t('name')}</th>
                  <th>{t('date')}</th>
                  <th>{t('day')}</th>
                  <th>
                    {t('branch')} / {t('checkIn')} – {t('checkOut')}
                  </th>
                  <th>{t('status')}</th>
                  <th>{t('details')}</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRows.length === 0 ? (
                  <tr>
                    <td colSpan="6">{t('noData')}</td>
                  </tr>
                ) : (
                  attendanceRows.map((row) => {
                    const dateObj =
                      row.date instanceof Date ? row.date : new Date(row.date);
                    return (
                      <tr key={row.key} className={row.allInvalid ? 'table-danger' : ''}>
                        <td>
                          <strong>{row.user?.name 
  || row.metadata?.oldUserName 
  || 'موظف محذوف'}
</strong>
                          <br />
                          <small className="text-muted">{row.user?.email}</small>
                        </td>
                        <td>
                          {dateObj.toLocaleDateString()}
                          <br />
                          <small className="text-muted">
                            {dateObj.toLocaleTimeString(undefined, {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </small>
                        </td>
                        <td>{t(row.dayName.toLowerCase()) || row.dayName}</td>
                        <td>
                          {row.branches.map((b) => (
                            <div key={b.id} className="mb-1">
                              <strong>{b.branchName}</strong>
                              <br />
                              <span className="small">
                                {b.checkInTime
                                  ? new Date(b.checkInTime).toLocaleTimeString(undefined, {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })
                                  : '-'}{' '}
                                –{' '}
                                {b.checkOutTime
                                  ? new Date(b.checkOutTime).toLocaleTimeString(undefined, {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })
                                  : '-'}
                              </span>
                              {b.invalidated && (
                                <span className="badge bg-danger ms-2">
                                  {t('invalidated') || 'Invalidated'}
                                </span>
                              )}
                              <button
                                className="btn btn-sm btn-outline-primary ms-2"
                                onClick={() => openEditAttendance(row, b)}
                              >
                                <i className="fas fa-edit" />
                              </button>
                            </div>
                          ))}
                        </td>
                        <td>
                          {row.allInvalid ? (
                            <span className="badge bg-danger">
                              {t('invalidated') || 'Invalidated'}
                            </span>
                          ) : (
                            <span className="badge bg-info">
                              {t(row.status) || row.status}
                            </span>
                          )}
                        </td>
                       <td>
  {/* نحدد الأول: اليوم مبطل بالكامل ولا لأ */}
  {row.allInvalid || row.status === 'invalidated' ? (
    <span className="small text-danger">
      {t('needsReview') || 'Unpaid / Needs admin review'}
    </span>
  ) : (
    (() => {
  const hasCheckout = row.branches.some((b) => !!b.checkOutTime);
  const hasTransit = (row.transits || []).length > 0;
  const hasTransitDeduction = (row.totalTransitDeductionMinutes || 0) > 0;

  if (!hasCheckout) {
    return (
      <span className="small text-warning">
        {t('noCheckoutNeedsReview') ||
          'No checkout – will be treated as unpaid until fixed'}
      </span>
    );
  }

  return (
    <>
      {/* تأخير */}
      {row.totalLateMinutes > 0 && (
        <div className="small text-warning">
          <i className="fas fa-clock me-1" />
          {t('late') || 'Late'}: {row.totalLateMinutes}{' '}
          {t('minutes') || 'min'}
        </div>
      )}

      {/* انصراف مبكر */}
      {row.totalEarlyLeaveMinutes > 0 && (
        <div className="small text-danger">
          <i className="fas fa-sign-out-alt me-1" />
          {t('earlyLeave') || 'Early leave'}:{' '}
          {row.totalEarlyLeaveMinutes} {t('minutes') || 'min'}
        </div>
      )}

      {/* ✨ تفاصيل الترانزيت */}
      {hasTransit && (
        <div className="small mt-1">
          <strong>
            <i className="fas fa-route me-1" />
            {t('transit') || 'Transit'}:
          </strong>
          <ul className="mb-1">
            {row.transits.map((tr, idx) => (
              <li key={idx}>
                من <strong>{tr.fromBranchName}</strong> إلى{' '}
                <strong>{tr.toBranchName}</strong> – زمن التنقل:{' '}
                {tr.gapMinutes} {t('minutes') || 'min'}{' '}
                {tr.deductionMinutes > 0 ? (
                  <span className="text-danger">
                    (خصم {tr.deductionMinutes}{' '}
                    {t('minutes') || 'min'})
                  </span>
                ) : (
                  <span className="text-success">(بدون خصم)</span>
                )}
              </li>
            ))}
          </ul>
          {hasTransitDeduction && (
            <div className="small text-danger">
              إجمالي خصم المواصلات لليوم:{' '}
              {row.totalTransitDeductionMinutes}{' '}
              {t('minutes') || 'min'}
            </div>
          )}
        </div>
      )}

      {/* لو مفيش ولا تأخير ولا انصراف مبكر ولا خصم مواصلات */}
      {!row.totalLateMinutes &&
        !row.totalEarlyLeaveMinutes &&
        !hasTransitDeduction && (
          <span className="small text-muted">
            {t('noPenalties') || 'No penalties'}
          </span>
        )}
    </>
  );
      // const hasCheckout = row.branches.some(b => !!b.checkOutTime);

      // if (!hasCheckout) {
      //   // مفيش أي انصراف في أي فرع
      //   return (
      //     <span className="small text-warning">
      //       {t('noCheckoutNeedsReview') ||
      //         'No checkout – will be treated as unpaid until fixed'}
      //     </span>
      //   );
      // }

      // if (row.totalLateMinutes > 0) {
      //   // تأخير
      //   return (
      //     <>
      //       <div className="small text-warning">
      //         <i className="fas fa-clock me-1" />
      //         {t('late') || 'Late'}: {row.totalLateMinutes}{' '}
      //         {t('minutes') || 'min'}
      //       </div>
      //       {row.totalEarlyLeaveMinutes > 0 && (
      //         <div className="small text-danger">
      //           <i className="fas fa-sign-out-alt me-1" />
      //           {t('earlyLeave') || 'Early leave'}:{' '}
      //           {row.totalEarlyLeaveMinutes} {t('minutes') || 'min'}
      //         </div>
      //       )}
      //     </>
      //   );
      // }

      // if (row.totalEarlyLeaveMinutes > 0) {
      //   // انصراف مبكر فقط
      //   return (
      //     <div className="small text-danger">
      //       <i className="fas fa-sign-out-alt me-1" />
      //       {t('earlyLeave') || 'Early leave'}:{' '}
      //       {row.totalEarlyLeaveMinutes} {t('minutes') || 'min'}
      //     </div>
      //   );
      // }

      // // هنا بس اليوم سليم: حضور كامل بدون تأخير أو انصراف مبكر
      // return (
      //   <span className="small text-muted">
      //     {t('noPenalties') || 'No penalties'}
      //   </span>
      // );
    })()
  )}
</td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <nav>
            <ul className="pagination justify-content-center">
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={attendancePrev}
                  disabled={attendancePage === 1}
                >
                  <i className="fas fa-chevron-left" /> {t('previous')}
                </button>
              </li>
              <li className="page-item disabled">
                <span className="page-link">
                  {attendancePage} / {attendanceTotalPages}
                </span>
              </li>
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={attendanceNext}
                  disabled={attendancePage >= attendanceTotalPages}
                >
                  {t('next')} <i className="fas fa-chevron-right" />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
