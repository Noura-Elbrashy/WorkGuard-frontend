
// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { apiPut } from '../../helpers/api';

// const toInputDateTimeLocal = (value) => {
//   if (!value) return '';
//   const d = new Date(value);
//   if (isNaN(d.getTime())) return '';
//   const pad = (n) => n.toString().padStart(2, '0');
//   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
//     d.getDate()
//   )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
// };

// // const formatTime = (value, lang) => {
// //   if (!value) return '—';
// //   return new Date(value).toLocaleTimeString(
// //     lang === 'ar' ? 'ar-EG' : 'en-GB',
// //     { hour: '2-digit', minute: '2-digit' }
// //   );
// // };
// const formatTime = (value) => {
//   if (!value) return '—';

//   return new Date(value).toLocaleTimeString('en-US', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true
//   });
// };

// const EmployeeAttendanceDetailsModal = ({
//   show,
//   loading,
//   records = [],
//   user,
//   date,
//   transits = [],
//   onClose,
//   onSaved
// }) => {
//   const { t, i18n } = useTranslation();
//   const lang = i18n.language;

//   const [editingId, setEditingId] = useState(null);
//   const [form, setForm] = useState({});
//   const [saving, setSaving] = useState(false);

//   if (!show) return null;

//   const startEdit = (rec) => {
//     setEditingId(rec._id);
//     setForm({
//       checkInTime: toInputDateTimeLocal(rec.checkInTime),
//       checkOutTime: toInputDateTimeLocal(rec.checkOutTime),
//       invalidated: !!rec.invalidated,
//       notes: rec.notes || ''
//     });
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setForm({});
//   };

//   const saveEdit = async (id) => {
//     try {
//       setSaving(true);
//       await apiPut(`/admin/attendance/${id}`, {
//         checkInTime: form.checkInTime
//           ? new Date(form.checkInTime).toISOString()
//           : null,
//         checkOutTime: form.checkOutTime
//           ? new Date(form.checkOutTime).toISOString()
//           : null,
//         invalidated: form.invalidated,
//         notes: form.notes
//       });

//       setEditingId(null);
//       onSaved?.();
//     } catch (err) {
//       console.error(err);
//       alert(t('error'));
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div
//       className="modal fade show"
//       style={{ display: 'block', background: '#00000066' }}
//     >
//       <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
//         <div className="modal-content">

//           {/* ===== Header ===== */}
//           <div className="modal-header bg-dark text-white">
//             <h5 className="modal-title">
//               <i className="fas fa-user-clock me-2" />
//               {user?.name || t('deletedUser')} –{' '}
//               {date ? new Date(date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB') : ''}
//             </h5>
//             <button className="btn-close btn-close-white" onClick={onClose} />
//           </div>

//           {/* ===== Body ===== */}
//           <div className="modal-body">

//             {loading ? (
//               <div className="text-center py-5">
//                 <div className="spinner-border text-primary" />
//               </div>
//             ) : records.length === 0 ? (
//               <div className="text-center text-muted py-4">
//                 {t('noAttendanceForDay')}
//               </div>
//             ) : (
//               <>
//                 {/* ===== Attendance Table ===== */}
//                 <div className="table-responsive">
//                   <table className="table table-bordered align-middle">
//                     <thead className="table-light">
//                       <tr>
//                         <th>{t('branch')}</th>
//                         <th>{t('checkIn')}</th>
//                         <th>{t('checkOut')}</th>
//                         <th>{t('late')}</th>
//                         <th>{t('earlyLeave')}</th>
//                         <th>{t('notes')}</th>
//                         <th className="text-center">{t('actions')}</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {records.map((rec) => {
//                         const isEditing = editingId === rec._id;

//                         return (
//                           <tr
//                             key={rec._id}
//                             className={rec.invalidated ? 'table-danger' : ''}
//                           >
//                             {/* Branch */}
//                             <td>
//                               <strong>{rec.branch?.name || '—'}</strong>
//                               {rec.invalidated && (
//                                 <span className="badge bg-danger ms-2">
//                                   {t('invalidated')}
//                                 </span>
//                               )}
//                             </td>

//                             {/* Check-in */}
//                             <td>
//                               {isEditing ? (
//                                 <input
//                                   type="datetime-local"
//                                   className="form-control form-control-sm"
//                                   value={form.checkInTime}
//                                   onChange={(e) =>
//                                     setForm({ ...form, checkInTime: e.target.value })
//                                   }
//                                 />
//                               ) : (
//                                 formatTime(rec.checkInTime, lang)
//                               )}
//                             </td>

//                             {/* Check-out */}
//                             <td>
//                               {isEditing ? (
//                                 <input
//                                   type="datetime-local"
//                                   className="form-control form-control-sm"
//                                   value={form.checkOutTime}
//                                   onChange={(e) =>
//                                     setForm({ ...form, checkOutTime: e.target.value })
//                                   }
//                                 />
//                               ) : (
//                                 formatTime(rec.checkOutTime, lang)
//                               )}
//                             </td>

//                             {/* Late */}
//                             <td className="text-warning">
//                               {rec.lateMinutes
//                                 ? `${rec.lateMinutes} ${t('minutes')}`
//                                 : '—'}
//                             </td>

//                             {/* Early Leave */}
//                             <td className="text-danger">
//                               {rec.earlyLeaveMinutes
//                                 ? `${rec.earlyLeaveMinutes} ${t('minutes')}`
//                                 : '—'}
//                             </td>

//                             {/* Notes */}
//                             <td>
//                               {isEditing ? (
//                                 <>
//                                   <textarea
//                                     className="form-control form-control-sm mb-2"
//                                     rows="2"
//                                     value={form.notes}
//                                     onChange={(e) =>
//                                       setForm({ ...form, notes: e.target.value })
//                                     }
//                                   />
//                                   <div className="form-check">
//                                     <input
//                                       className="form-check-input"
//                                       type="checkbox"
//                                       checked={form.invalidated}
//                                       id={`inv-${rec._id}`}
//                                       onChange={(e) =>
//                                         setForm({
//                                           ...form,
//                                           invalidated: e.target.checked
//                                         })
//                                       }
//                                     />
//                                     <label
//                                       className="form-check-label"
//                                       htmlFor={`inv-${rec._id}`}
//                                     >
//                                       {t('invalidateRecord')}
//                                     </label>
//                                   </div>
//                                 </>
//                               ) : (
//                                 <span className="text-muted">
//                                   {rec.notes || '—'}
//                                 </span>
//                               )}
//                             </td>

//                             {/* Actions */}
//                             <td className="text-center">
//                               {isEditing ? (
//                                 <>
//                                   <button
//                                     className="btn btn-sm btn-success me-2"
//                                     disabled={saving}
//                                     onClick={() => saveEdit(rec._id)}
//                                   >
//                                     {t('save')}
//                                   </button>
//                                   <button
//                                     className="btn btn-sm btn-secondary"
//                                     onClick={cancelEdit}
//                                   >
//                                     {t('cancel')}
//                                   </button>
//                                 </>
//                               ) : (
//                                 <button
//                                   className="btn btn-sm btn-outline-primary"
//                                   onClick={() => startEdit(rec)}
//                                 >
//                                   {t('edit')}
//                                 </button>
//                               )}
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* ===== Transit Section ===== */}
//                 {transits.length > 0 && (
//                   <div className="mt-4">
//                     <h6 className="mb-2">
//                       <i className="fas fa-route me-2" />
//                       {t('transitDetails')}
//                     </h6>
//                     <ul className="list-group">
//                       {transits.map((tr, idx) => (
//                         <li key={idx} className="list-group-item">
//                           {t('from')} <strong>{tr.fromBranchName}</strong>{' '}
//                           {t('to')} <strong>{tr.toBranchName}</strong> —{' '}
//                           {t('transitTime')}: {tr.gapMinutes} {t('minutes')}{' '}
//                           {tr.deductionMinutes > 0 ? (
//                             <span className="text-danger">
//                               ({t('deduction')} {tr.deductionMinutes}{' '}
//                               {t('minutes')})
//                             </span>
//                           ) : (
//                             <span className="text-success">
//                               ({t('noDeduction')})
//                             </span>
//                           )}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>

//           {/* ===== Footer ===== */}
//           <div className="modal-footer">
//             <button className="btn btn-secondary" onClick={onClose}>
//               {t('close')}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeAttendanceDetailsModal;


// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { apiPut } from '../../helpers/api';

// const toInputDateTimeLocal = (value) => {
//   if (!value) return '';
//   const d = new Date(value);
//   if (isNaN(d.getTime())) return '';
//   const pad = (n) => n.toString().padStart(2, '0');
//   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
// };

// const formatTime = (value) => {
//   if (!value) return '—';
//   return new Date(value).toLocaleTimeString('en-US', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true
//   });
// };

// const EmployeeAttendanceDetailsModal = ({
//   show,
//   loading,
//   records = [],
//   user,
//   date,
//   transits = [],
//   onClose,
//   onSaved
// }) => {
//   const { t, i18n } = useTranslation();
//   const isRTL = i18n.language === 'ar';

//   const [editingId, setEditingId] = useState(null);
//   const [form, setForm] = useState({});
//   const [saving, setSaving] = useState(false);

//   if (!show) return null;

//   const startEdit = (rec) => {
//     setEditingId(rec._id);
//     setForm({
//       checkInTime: toInputDateTimeLocal(rec.checkInTime),
//       checkOutTime: toInputDateTimeLocal(rec.checkOutTime),
//       invalidated: !!rec.invalidated,
//       notes: rec.notes || ''
//     });
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setForm({});
//   };

//   const saveEdit = async (id) => {
//     try {
//       setSaving(true);
//       await apiPut(`/admin/attendance/${id}`, {
//         checkInTime: form.checkInTime ? new Date(form.checkInTime).toISOString() : null,
//         checkOutTime: form.checkOutTime ? new Date(form.checkOutTime).toISOString() : null,
//         invalidated: form.invalidated,
//         notes: form.notes.trim()
//       });
//       setEditingId(null);
//       onSaved?.();
//     } catch (err) {
//       console.error(err);
//       alert(t('error') || 'حدث خطأ أثناء الحفظ');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const headerDate = date
//     ? new Date(date).toLocaleDateString(isRTL ? 'ar-EG' : 'en-GB', {
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       })
//     : '';

//   return (
//     <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.75)' }} dir={isRTL ? 'rtl' : 'ltr'}>
//       <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
//         <div className="modal-content shadow-lg border-0 overflow-hidden">

//           {/* Header - Gradient Professional */}
//           <div className="modal-header bg-gradient bg-primary text-white py-4">
//             <h5 className="modal-title fw-bold fs-4 d-flex align-items-center">
//               <i className="fas fa-user-clock fa-2x me-3" />
//               <div>
//                 <div>{user?.name || t('deletedUser')}</div>
//                 <small className="opacity-90">{headerDate}</small>
//               </div>
//             </h5>
//             <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close" />
//           </div>

//           {/* Body */}
//           <div className="modal-body p-4 p-lg-5 bg-light">

//             {loading ? (
//               <div className="text-center py-5">
//                 <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }} />
//                 <p className="mt-4 fs-5 text-muted">{t('loading')}...</p>
//               </div>
//             ) : records.length === 0 ? (
//               <div className="text-center py-5">
//                 <i className="fas fa-calendar-times fa-5x text-muted opacity-50 mb-4" />
//                 <p className="fs-4 text-muted">{t('noAttendanceForDay')}</p>
//               </div>
//             ) : (
//               <>
//                 {/* Attendance Records Card */}
//                 <div className="card border-0 shadow-sm mb-5">
//                   <div className="card-header bg-primary text-white rounded-top">
//                     <h5 className="mb-0 fw-bold">
//                       <i className="fas fa-list-alt me-3" />
//                       {t('attendanceRecords')}
//                     </h5>
//                   </div>
//                   <div className="card-body p-0">
//                     <div className="table-responsive">
//                       <table className="table table-hover mb-0">
//                         <thead className="bg-light">
//                           <tr>
//                             <th className="text-nowrap">{t('branch')}</th>
//                             <th>{t('checkIn')}</th>
//                             <th>{t('checkOut')}</th>
//                             <th>{t('late')}</th>
//                             <th>{t('earlyLeave')}</th>
//                             <th>{t('notes')}</th>
//                             <th className="text-center">{t('actions')}</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {records.map((rec) => {
//                             const isEditing = editingId === rec._id;

//                             return (
//                               <tr key={rec._id} className={rec.invalidated ? 'table-danger opacity-80' : ''}>
//                                 <td>
//                                   <div className="d-flex align-items-center">
//                                     <i className="fas fa-building text-primary me-3" />
//                                     <strong>{rec.branch?.name || '—'}</strong>
//                                     {rec.invalidated && (
//                                       <span className="badge bg-danger ms-3">
//                                         <i className="fas fa-ban me-1" />
//                                         {t('invalidated')}
//                                       </span>
//                                     )}
//                                   </div>
//                                 </td>

//                                 <td className="fw-bold text-success">
//                                   {isEditing ? (
//                                     <input type="datetime-local" className="form-control form-control-sm" value={form.checkInTime} onChange={(e) => setForm({ ...form, checkInTime: e.target.value })} />
//                                   ) : formatTime(rec.checkInTime)}
//                                 </td>

//                                 <td className="fw-bold text-info">
//                                   {isEditing ? (
//                                     <input type="datetime-local" className="form-control form-control-sm" value={form.checkOutTime} onChange={(e) => setForm({ ...form, checkOutTime: e.target.value })} />
//                                   ) : formatTime(rec.checkOutTime)}
//                                 </td>

//                                 <td>
//                                   {rec.lateMinutes > 0 ? (
//                                     <span className="badge bg-warning text-dark fs-6">
//                                       <i className="fas fa-clock me-1" />
//                                       {rec.lateMinutes} {t('minutes')}
//                                     </span>
//                                   ) : '—'}
//                                 </td>

//                                 <td>
//                                   {rec.earlyLeaveMinutes > 0 ? (
//                                     <span className="badge bg-danger fs-6">
//                                       <i className="fas fa-sign-out-alt me-1" />
//                                       {rec.earlyLeaveMinutes} {t('minutes')}
//                                     </span>
//                                   ) : '—'}
//                                 </td>

//                                 <td style={{ minWidth: '220px' }}>
//                                   {isEditing ? (
//                                     <>
//                                       <textarea
//                                         className="form-control mb-2"
//                                         rows="3"
//                                         value={form.notes}
//                                         onChange={(e) => setForm({ ...form, notes: e.target.value })}
//                                         placeholder={t('addNote')}
//                                       />
//                                       <div className="form-check">
//                                         <input
//                                           className="form-check-input"
//                                           type="checkbox"
//                                           id={`inv-${rec._id}`}
//                                           checked={form.invalidated}
//                                           onChange={(e) => setForm({ ...form, invalidated: e.target.checked })}
//                                         />
//                                         <label className="form-check-label text-danger" htmlFor={`inv-${rec._id}`}>
//                                           {t('invalidateRecord')}
//                                         </label>
//                                       </div>
//                                     </>
//                                   ) : (
//                                     <span className={rec.notes ? 'text-dark' : 'text-muted'}>
//                                       {rec.notes || '—'}
//                                     </span>
//                                   )}
//                                 </td>

//                                 <td className="text-center">
//                                   {isEditing ? (
//                                     <div className="d-flex flex-column gap-2">
//                                       <div className="btn-group" role="group">
//                                         <button
//                                           className="btn btn-success btn-sm"
//                                           disabled={saving}
//                                           onClick={() => saveEdit(rec._id)}
//                                         >
//                                           <i className="fas fa-save me-1" />
//                                           {saving ? t('saving') : t('save')}
//                                         </button>
//                                         <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>
//                                           <i className="fas fa-times" />
//                                         </button>
//                                       </div>
//                                     </div>
//                                   ) : (
//                                     <button className="btn btn-outline-primary btn-sm rounded-pill px-4" onClick={() => startEdit(rec)}>
//                                       <i className="fas fa-edit me-1" />
//                                       {t('edit')}
//                                     </button>
//                                   )}
//                                 </td>
//                               </tr>
//                             );
//                           })}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Transit Card */}
//                 {transits.length > 0 && (
//                   <div className="card border-0 shadow-lg">
//                     <div className="card-header bg-gradient bg-info text-white">
//                       <h5 className="mb-0 fw-bold">
//                         <i className="fas fa-route fa-lg me-3" />
//                         {t('transitDetails')}
//                       </h5>
//                     </div>
//                     <div className="card-body p-4">
//                       {transits.map((tr, idx) => (
//                         <div key={idx} className="d-flex justify-content-between align-items-center py-3 border-bottom">
//                           <div>
//                             <div className="fw-bold fs-5">
//                               {tr.fromBranchName} <i className="fas fa-arrow-right mx-2 text-primary" /> {tr.toBranchName}
//                             </div>
//                             <small className="text-muted">
//                               <i className="fas fa-clock me-1" />
//                               {t('transitTime')}: {tr.gapMinutes} {t('minutes')}
//                             </small>
//                           </div>
//                           <div>
//                             {tr.deductionMinutes > 0 ? (
//                               <span className="badge bg-danger fs-4 px-4 py-3 rounded-pill">
//                                 <i className="fas fa-minus-circle me-2" />
//                                 -{tr.deductionMinutes} {t('min')}
//                               </span>
//                             ) : (
//                               <span className="badge bg-success fs-4 px-4 py-3 rounded-pill">
//                                 <i className="fas fa-check-circle me-2" />
//                                 {t('noDeduction')}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="modal-footer bg-white border-top-0 py-4">
//             <button className="btn btn-lg btn-outline-danger px-5 rounded-pill" onClick={onClose}>
//               <i className="fas fa-times me-2" />
//               {t('close')}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeAttendanceDetailsModal;
// //1
// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { apiPut } from '../../helpers/api';
// import '../../style/EmployeeAttendanceDetailsModal.css';

// const toInputDateTimeLocal = (value) => {
//   if (!value) return '';
//   const d = new Date(value);
//   if (isNaN(d.getTime())) return '';
//   const pad = (n) => n.toString().padStart(2, '0');
//   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
// };

// const formatTime = (value) => {
//   if (!value) return '—';
//   return new Date(value).toLocaleTimeString('en-US', {
//     hour: 'numeric',
//     minute: '2-digit',
//     hour12: true
//   });
// };

// const Toast = ({ show, message, type, onClose }) => {
//   if (!show) return null;

//   const bgColors = {
//     success: 'bg-success',
//     error: 'bg-danger',
//     info: 'bg-info'
//   };

//   const icons = {
//     success: 'fa-check-circle',
//     error: 'fa-exclamation-circle',
//     info: 'fa-info-circle'
//   };

//   return (
//     <div 
//       className="position-fixed top-0 end-0 p-3" 
//       style={{ zIndex: 9999 }}
//     >
//       <div 
//         className={`toast show ${bgColors[type]} text-white shadow-lg`}
//         role="alert"
//         style={{ minWidth: '300px' }}
//       >
//         <div className="toast-header text-white border-0" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
//           <i className={`fas ${icons[type]} me-2`} />
//           <strong className="me-auto">
//             {type === 'success' && 'نجح'}
//             {type === 'error' && 'خطأ'}
//             {type === 'info' && 'معلومة'}
//           </strong>
//           <button 
//             type="button" 
//             className="btn-close btn-close-white" 
//             onClick={onClose}
//           />
//         </div>
//         <div className="toast-body fw-bold">
//           {message}
//         </div>
//       </div>
//     </div>
//   );
// };

// const EmployeeAttendanceDetailsModal = ({
//   show,
//   loading,
//   records = [],
//   user,
//   date,
//   transits = [],
//   onClose,
//   onSaved
// }) => {
//   const { t, i18n } = useTranslation();
//   const isRTL = i18n.language === 'ar';

//   const [editingId, setEditingId] = useState(null);
//   const [form, setForm] = useState({});
//   const [saving, setSaving] = useState(false);
//   const [localRecords, setLocalRecords] = useState(records);
//   const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

//   // Update local records when props change
//   useState(() => {
//     setLocalRecords(records);
//   }, [records]);

//   const showToast = (message, type = 'success') => {
//     setToast({ show: true, message, type });
//     setTimeout(() => {
//       setToast({ show: false, message: '', type: 'success' });
//     }, 4000);
//   };

//   if (!show) return null;

//   const startEdit = (rec) => {
//     setEditingId(rec._id);
//     setForm({
//       checkInTime: toInputDateTimeLocal(rec.checkInTime),
//       checkOutTime: toInputDateTimeLocal(rec.checkOutTime),
//       invalidated: !!rec.invalidated,
//       notes: rec.notes || ''
//     });
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setForm({});
//   };

//   const saveEdit = async (id) => {
//     try {
//       setSaving(true);
//       const updatedData = {
//         checkInTime: form.checkInTime ? new Date(form.checkInTime).toISOString() : null,
//         checkOutTime: form.checkOutTime ? new Date(form.checkOutTime).toISOString() : null,
//         invalidated: form.invalidated,
//         notes: form.notes.trim()
//       };
      
//       await apiPut(`/admin/attendance/${id}`, updatedData);
      
//       // Update local state without reload
//       setLocalRecords(prevRecords => 
//         prevRecords.map(rec => 
//           rec._id === id 
//             ? { 
//                 ...rec, 
//                 checkInTime: updatedData.checkInTime,
//                 checkOutTime: updatedData.checkOutTime,
//                 invalidated: updatedData.invalidated,
//                 notes: updatedData.notes
//               }
//             : rec
//         )
//       );
      
//       setEditingId(null);
//       showToast(t('savedSuccessfully') || 'تم الحفظ بنجاح', 'success');
//       onSaved?.();
//     } catch (err) {
//       console.error(err);
//       showToast(t('error') || 'حدث خطأ أثناء الحفظ', 'error');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const headerDate = date
//     ? new Date(date).toLocaleDateString(isRTL ? 'ar-EG' : 'en-GB', {
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       })
//     : '';

//   return (
//     <>
//       <Toast 
//         show={toast.show}
//         message={toast.message}
//         type={toast.type}
//         onClose={() => setToast({ ...toast, show: false })}
//       />
      
//       <div 
//         className="modal fade show" 
//         style={{ 
//           display: 'block', 
//           backgroundColor: 'rgba(0,0,0,0.75)',
//           backdropFilter: 'blur(8px)'
//         }} 
//         dir={isRTL ? 'rtl' : 'ltr'}
//       >
//         <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
//           <div 
//             className="modal-content border-0 shadow-lg" 
//             style={{ 
//               borderRadius: '24px',
//               overflow: 'hidden',
//               animation: 'slideDown 0.4s ease-out'
//             }}
//           >
//             <style>{`
//               @keyframes slideDown {
//                 from {
//                   opacity: 0;
//                   transform: translateY(-30px) scale(0.95);
//                 }
//                 to {
//                   opacity: 1;
//                   transform: translateY(0) scale(1);
//                 }
//               }
              
//               @keyframes pulse {
//                 0%, 100% { opacity: 1; }
//                 50% { opacity: 0.5; }
//               }
              
//               .table-hover tbody tr:hover {
//                 background-color: rgba(13, 110, 253, 0.05);
//                 transform: scale(1.01);
//                 transition: all 0.2s ease;
//                 box-shadow: 0 2px 8px rgba(0,0,0,0.08);
//               }
              
//               .btn {
//                 transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//               }
              
//               .btn:hover {
//                 transform: translateY(-2px);
//                 box-shadow: 0 4px 12px rgba(0,0,0,0.15);
//               }
              
//               .btn:active {
//                 transform: translateY(0);
//               }
              
//               .badge {
//                 transition: all 0.3s ease;
//               }
              
//               .badge:hover {
//                 transform: scale(1.05);
//               }
              
//               .form-control:focus {
//                 border-color: #0d6efd;
//                 box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
//               }
              
//               .modal-header {
//                 background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//                 position: relative;
//                 overflow: hidden;
//               }
              
//               .modal-header::before {
//                 content: '';
//                 position: absolute;
//                 top: -50%;
//                 right: -50%;
//                 width: 200%;
//                 height: 200%;
//                 background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
//                 animation: rotate 20s linear infinite;
//               }
              
//               @keyframes rotate {
//                 from { transform: rotate(0deg); }
//                 to { transform: rotate(360deg); }
//               }
              
//               .card {
//                 transition: all 0.3s ease;
//               }
              
//               .card:hover {
//                 transform: translateY(-4px);
//                 box-shadow: 0 8px 24px rgba(0,0,0,0.12);
//               }
              
//               .spinner-border {
//                 animation: spin 0.8s linear infinite;
//               }
              
//               @keyframes spin {
//                 to { transform: rotate(360deg); }
//               }
//             `}</style>

//             {/* Premium Header */}
//             <div className="modal-header text-white py-4 px-5" style={{ position: 'relative', zIndex: 1 }}>
//               <div className="d-flex align-items-center">
//                 <div 
//                   className="bg-white rounded-circle p-3 me-4 shadow-lg"
//                   style={{
//                     background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
//                   }}
//                 >
//                   <i className="fas fa-user-clock fa-2x" style={{ 
//                     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                     WebkitBackgroundClip: 'text',
//                     WebkitTextFillColor: 'transparent'
//                   }} />
//                 </div>
//                 <div>
//                   <h4 className="mb-1 fw-bold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
//                     {user?.name || t('deletedUser')}
//                   </h4>
//                   <p className="mb-0 opacity-90">
//                     <i className="fas fa-calendar-day me-2" />
//                     {headerDate}
//                   </p>
//                 </div>
//               </div>
//               <button 
//                 type="button" 
//                 className="btn-close btn-close-white" 
//                 onClick={onClose}
//                 style={{ 
//                   opacity: 0.9,
//                   transition: 'all 0.3s ease'
//                 }}
//                 onMouseEnter={(e) => e.target.style.opacity = 1}
//                 onMouseLeave={(e) => e.target.style.opacity = 0.9}
//               />
//             </div>

//             {/* Body with gradient background */}
//             <div className="modal-body p-4" style={{ 
//               background: 'linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%)'
//             }}>
//               {loading ? (
//                 <div className="text-center py-5">
//                   <div 
//                     className="spinner-border text-primary mb-3" 
//                     style={{ width: '4rem', height: '4rem' }}
//                   />
//                   <p className="fs-5 text-muted fw-bold">{t('loading')}...</p>
//                 </div>
//               ) : localRecords.length === 0 ? (
//                 <div className="text-center py-5">
//                   <div 
//                     className="mb-4"
//                     style={{
//                       animation: 'pulse 2s ease-in-out infinite'
//                     }}
//                   >
//                     <i className="fas fa-calendar-times text-muted opacity-25" style={{ fontSize: '6rem' }} />
//                   </div>
//                   <p className="fs-4 text-muted fw-bold">{t('noAttendanceForDay')}</p>
//                 </div>
//               ) : (
//                 <>
//                   {/* Premium Table */}
//                   <div className="mb-5">
//                     <div className="table-responsive" style={{ borderRadius: '16px', overflow: 'hidden' }}>
//                       <table className="table table-hover align-middle mb-0 shadow-sm">
//                         <thead style={{ 
//                           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                           color: 'white'
//                         }}>
//                           <tr>
//                             <th className="py-3">{t('branch')}</th>
//                             <th className="py-3">{t('checkIn')}</th>
//                             <th className="py-3">{t('checkOut')}</th>
//                             <th className="py-3">{t('late')}</th>
//                             <th className="py-3">{t('earlyLeave')}</th>
//                             <th className="py-3">{t('notes')}</th>
//                             <th className="text-center py-3">{t('actions')}</th>
//                           </tr>
//                         </thead>
//                         <tbody className="bg-white">
//                           {localRecords.map((rec) => {
//                             const isEditing = editingId === rec._id;

//                             return (
//                               <tr 
//                                 key={rec._id} 
//                                 className={rec.invalidated ? 'bg-danger bg-opacity-10' : ''}
//                                 style={{ transition: 'all 0.2s ease' }}
//                               >
//                                 <td className="py-3">
//                                   <div className="d-flex align-items-center">
//                                     <div 
//                                       className="rounded-circle p-2 me-3"
//                                       style={{
//                                         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                                         width: '40px',
//                                         height: '40px',
//                                         display: 'flex',
//                                         alignItems: 'center',
//                                         justifyContent: 'center'
//                                       }}
//                                     >
//                                       <i className="fas fa-building text-white" />
//                                     </div>
//                                     <div>
//                                       <div className="fw-bold">{rec.branch?.name || '—'}</div>
//                                       {rec.invalidated && (
//                                         <span className="badge bg-danger rounded-pill mt-1">
//                                           <i className="fas fa-ban me-1" />
//                                           {t('invalidated')}
//                                         </span>
//                                       )}
//                                     </div>
//                                   </div>
//                                 </td>

//                                 <td className="py-3">
//                                   {isEditing ? (
//                                     <input
//                                       type="datetime-local"
//                                       className="form-control form-control-sm shadow-sm"
//                                       style={{ maxWidth: '180px' }}
//                                       value={form.checkInTime}
//                                       onChange={(e) => setForm({ ...form, checkInTime: e.target.value })}
//                                     />
//                                   ) : (
//                                     <span className="badge bg-success bg-opacity-75 px-3 py-2 fw-bold">
//                                       <i className="fas fa-sign-in-alt me-2" />
//                                       {formatTime(rec.checkInTime)}
//                                     </span>
//                                   )}
//                                 </td>

//                                 <td className="py-3">
//                                   {isEditing ? (
//                                     <input
//                                       type="datetime-local"
//                                       className="form-control form-control-sm shadow-sm"
//                                       style={{ maxWidth: '180px' }}
//                                       value={form.checkOutTime}
//                                       onChange={(e) => setForm({ ...form, checkOutTime: e.target.value })}
//                                     />
//                                   ) : (
//                                     <span className="badge bg-info bg-opacity-75 px-3 py-2 fw-bold">
//                                       <i className="fas fa-sign-out-alt me-2" />
//                                       {formatTime(rec.checkOutTime)}
//                                     </span>
//                                   )}
//                                 </td>

//                                 <td className="py-3">
//                                   {rec.lateMinutes > 0 ? (
//                                     <span className="badge bg-warning text-dark px-3 py-2 rounded-pill shadow-sm">
//                                       <i className="fas fa-clock me-1" />
//                                       {rec.lateMinutes} {t('minutes')}
//                                     </span>
//                                   ) : (
//                                     <span className="text-muted">—</span>
//                                   )}
//                                 </td>

//                                 <td className="py-3">
//                                   {rec.earlyLeaveMinutes > 0 ? (
//                                     <span className="badge bg-danger px-3 py-2 rounded-pill shadow-sm">
//                                       <i className="fas fa-door-open me-1" />
//                                       {rec.earlyLeaveMinutes} {t('minutes')}
//                                     </span>
//                                   ) : (
//                                     <span className="text-muted">—</span>
//                                   )}
//                                 </td>

//                                 <td className="py-3" style={{ minWidth: '200px', maxWidth: '250px' }}>
//                                   {isEditing ? (
//                                     <div className="d-flex flex-column gap-2">
//                                       <textarea
//                                         className="form-control form-control-sm shadow-sm"
//                                         rows="3"
//                                         style={{ resize: 'none' }}
//                                         value={form.notes}
//                                         onChange={(e) => setForm({ ...form, notes: e.target.value })}
//                                         placeholder={t('addNote')}
//                                       />
//                                       <div className="form-check">
//                                         <input
//                                           className="form-check-input"
//                                           type="checkbox"
//                                           id={`inv-${rec._id}`}
//                                           checked={form.invalidated}
//                                           onChange={(e) => setForm({ ...form, invalidated: e.target.checked })}
//                                         />
//                                         <label className="form-check-label text-danger small fw-bold" htmlFor={`inv-${rec._id}`}>
//                                           <i className="fas fa-ban me-1" />
//                                           {t('invalidateRecord')}
//                                         </label>
//                                       </div>
//                                     </div>
//                                   ) : (
//                                     <div className={rec.notes ? 'text-dark' : 'text-muted fst-italic'}>
//                                       {t('noNotes')}
//                                     </div>
//                                   )}
//                                 </td>

//                                 <td className="text-center py-3">
//                                   {isEditing ? (
//                                     <div className="d-flex gap-2 justify-content-center">
//                                       <button
//                                         className="btn btn-success btn-sm px-4 rounded-pill shadow-sm"
//                                         disabled={saving}
//                                         onClick={() => saveEdit(rec._id)}
//                                       >
//                                         {saving ? (
//                                           <>
//                                             <span className="spinner-border spinner-border-sm me-2" />
//                                             {t('saving')}
//                                           </>
//                                         ) : (
//                                           <>
//                                             <i className="fas fa-check me-2" />
//                                             {t('save')}
//                                           </>
//                                         )}
//                                       </button>
//                                       <button
//                                         className="btn btn-outline-secondary btn-sm px-4 rounded-pill"
//                                         onClick={cancelEdit}
//                                         disabled={saving}
//                                       >
//                                         <i className="fas fa-times me-2" />
//                                         {t('cancel')}
//                                       </button>
//                                     </div>
//                                   ) : (
//                                     <button
//                                       className="btn btn-primary btn-sm px-4 rounded-pill shadow-sm"
//                                       onClick={() => startEdit(rec)}
//                                       style={{
//                                         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                                         border: 'none'
//                                       }}
//                                     >
//                                       <i className="fas fa-edit me-2" />
//                                       {t('edit')}
//                                     </button>
//                                   )}
//                                 </td>
//                               </tr>
//                             );
//                           })}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>

//                   {/* Premium Transit Section */}
//                   {transits.length > 0 && (
//                     <div 
//                       className="card border-0 shadow-sm"
//                       style={{ 
//                         borderRadius: '16px',
//                         overflow: 'hidden'
//                       }}
//                     >
//                       <div 
//                         className="card-header text-white py-3"
//                         style={{
//                           background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)'
//                         }}
//                       >
//                         <h5 className="mb-0 fw-bold">
//                           <i className="fas fa-route me-2" />
//                           {t('transitDetails')}
//                         </h5>
//                       </div>
//                       <div className="card-body p-4 bg-white">
//                         {transits.map((tr, idx) => (
//                           <div 
//                             key={idx} 
//                             className="d-flex justify-content-between align-items-center py-3 px-3 mb-2 rounded-3"
//                             style={{
//                               background: 'linear-gradient(90deg, rgba(23,162,184,0.05) 0%, rgba(255,255,255,0) 100%)',
//                               transition: 'all 0.3s ease'
//                             }}
//                             onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, rgba(23,162,184,0.1) 0%, rgba(255,255,255,0) 100%)'}
//                             onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, rgba(23,162,184,0.05) 0%, rgba(255,255,255,0) 100%)'}
//                           >
//                             <div className="d-flex align-items-center">
//                               <div 
//                                 className="rounded-circle p-3 me-3 shadow-sm"
//                                 style={{
//                                   background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)'
//                                 }}
//                               >
//                                 <i className="fas fa-exchange-alt text-white fa-lg" />
//                               </div>
//                               <div>
//                                 <div className="fw-bold fs-6">
//                                   {tr.fromBranchName} 
//                                   <i className="fas fa-arrow-right mx-2 text-info" />
//                                   {tr.toBranchName}
//                                 </div>
//                                 <small className="text-muted">
//                                   <i className="fas fa-clock me-1" />
//                                   {t('transitTime')}: <span className="fw-bold">{tr.gapMinutes}</span> {t('minutes')}
//                                 </small>
//                               </div>
//                             </div>
//                             <div>
//                               {tr.deductionMinutes > 0 ? (
//                                 <span className="badge bg-danger px-4 py-2 rounded-pill shadow-sm">
//                                   <i className="fas fa-minus-circle me-1" />
//                                   خصم {tr.deductionMinutes} دقيقة
//                                 </span>
//                               ) : (
//                                 <span className="badge bg-success px-4 py-2 rounded-pill shadow-sm">
//                                   <i className="fas fa-check-circle me-1" />
//                                  {t('noDeduction')} 
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>

//             {/* Premium Footer */}
//             <div 
//               className="modal-footer border-top-0 py-4 justify-content-center"
//               style={{
//                 background: 'linear-gradient(to top, #f8f9fa 0%, #ffffff 100%)'
//               }}
//             >
//               <button 
//                 className="btn btn-lg px-5 py-3 rounded-pill shadow-sm"
//                 onClick={onClose}
//                 style={{
//                   background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
//                   border: 'none',
//                   color: 'white',
//                   fontWeight: 'bold'
//                 }}
//               >
//                 <i className="fas fa-times-circle me-2" />
//                 {t('close')}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default EmployeeAttendanceDetailsModal;

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {apiGet, apiPut ,apiPost } from '../../helpers/api';
import '../../style/EmployeeAttendanceDetailsModal.css';

const toInputDateTimeLocal = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  const pad = (n) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatTime = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

const Toast = ({ show, message, type, onClose }) => {
  const { t } = useTranslation();

  if (!show) return null;

  const typeConfig = {
    success: { bg: 'toast-success', icon: 'fa-check-circle', title: 'success' },
    error: { bg: 'toast-error', icon: 'fa-exclamation-circle', title: 'error' },
    info: { bg: 'toast-info', icon: 'fa-info-circle', title: 'info' }
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div className="toast-container-custom">
      <div className={`custom-toast ${config.bg}`} role="alert">
        <div className="toast-header-custom">
          <i className={`fas ${config.icon} me-2`} />
          <strong className="me-auto">{t(config.title)}</strong>
          <button type="button" className="toast-close-btn" onClick={onClose}>
            <i className="fas fa-times" />
          </button>
        </div>
        <div className="toast-body-custom">
          {message}
        </div>
      </div>
    </div>
  );
};

const EmployeeAttendanceDetailsModal = ({
  show,
  loading,
  records = [],
  user,
  date,
  transits = [],
  onClose,
  onSaved,
  isAdmin,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [localRecords, setLocalRecords] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
const [showCreate, setShowCreate] = useState(false);
const [createForm, setCreateForm] = useState({
  checkInTime: '',
  checkOutTime: '',
  branchId: '',
  invalidated: false,
  notes: ''
});
const [availableBranches, setAvailableBranches] = useState([]);
const [loadingBranches, setLoadingBranches] = useState(false);




  useEffect(() => {
    if (records && records.length > 0) {
      setLocalRecords([...records]);
    } else {
      setLocalRecords([]);
    }
  }, [records]);

  useEffect(() => {
  if (!show || !user?._id) return;

  const loadBranches = async () => {
    try {
      setLoadingBranches(true);
      const res = await apiGet(`/branches/user/${user._id}`)
;
      setAvailableBranches(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load branches', err);
      setAvailableBranches([]);
    } finally {
      setLoadingBranches(false);
    }
  };

  loadBranches();
}, [show, user?._id]);


useEffect(() => {
  if (availableBranches.length === 1) {
    setCreateForm(f => ({
      ...f,
      branchId: availableBranches[0]._id
    }));
  }
}, [availableBranches]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const startEdit = (rec) => {
    setEditingId(rec._id);
    setForm({
      checkInTime: toInputDateTimeLocal(rec.checkInTime),
      checkOutTime: toInputDateTimeLocal(rec.checkOutTime),
      invalidated: !!rec.invalidated,
      notes: rec.notes || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({});
  };

  const saveEdit = async (id) => {
    try {
      setSaving(true);
      const updatedData = {
        checkInTime: form.checkInTime ? new Date(form.checkInTime).toISOString() : null,
        checkOutTime: form.checkOutTime ? new Date(form.checkOutTime).toISOString() : null,
        invalidated: form.invalidated,
        notes: String(form.notes ?? '').trim()

      };
      
      await apiPut(`/admin/attendance/${id}`, updatedData);
      
      setLocalRecords(prevRecords => 
        prevRecords.map(rec => 
          rec._id === id 
            ? { 
                ...rec, 
                checkInTime: updatedData.checkInTime,
                checkOutTime: updatedData.checkOutTime,
                invalidated: updatedData.invalidated,
                notes: updatedData.notes
              }
            : rec
        )
      );
      
      setEditingId(null);
      showToast(t('savedSuccessfully'), 'success');
      if (onSaved) {
        onSaved();
      }
    } catch (err) {
      console.error(err);
      showToast(t('errorSaving'), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!show) return null;


// const handleCreateAttendance = async () => {
//   if (!createForm.branchId) {
//     showToast(t('selectBranchFirst'), 'error');
//     return;
//   }
//   try {
//     await apiPost('/admin/attendance/manual', {
//     userId: user._id,
//   branchId: createForm.branchId,
//   date: new Date(date).toISOString().slice(0, 10), // 👈 يوم السامري
//   checkInTime: createForm.checkInTime
//     ? new Date(createForm.checkInTime).toISOString()
//     : null,
//   checkOutTime: createForm.checkOutTime
//     ? new Date(createForm.checkOutTime).toISOString()
//     : null,
//   invalidated: createForm.invalidated,
//   notes: createForm.notes
// });

//     setShowCreate(false);
//     setCreateForm({
//       branchId: '',
//       checkInTime: '',
//       checkOutTime: '',
//       invalidated: false,
//       notes: ''
//     });

//     onSaved?.();

//   } catch (err) {
//     console.error(err);
//     alert(t('errorSaving'));
//   }
// };

const handleCreateAttendance = async () => {
  if (!createForm.branchId) {
    showToast(t('selectBranchFirst'), 'error');
    return;
  }

  try {
    await apiPost('/admin/attendance/manual', {
      userId: user._id,
      branchId: createForm.branchId,
      date: new Date(date).toISOString().slice(0, 10),
      checkInTime: createForm.checkInTime
        ? new Date(createForm.checkInTime).toISOString()
        : null,
      checkOutTime: createForm.checkOutTime
        ? new Date(createForm.checkOutTime).toISOString()
        : null,
      invalidated: createForm.invalidated,
      notes: createForm.notes
    });

    // ✅ Toast نجاح
    showToast(t('attendanceCreatedSuccessfully'), 'success');

    // ✅ إغلاق فورم الإنشاء
    setShowCreate(false);

    // ✅ تفريغ الفورم
    setCreateForm({
      branchId: '',
      checkInTime: '',
      checkOutTime: '',
      invalidated: false,
      notes: ''
    });

    // ✅ إعادة تحميل الداتا (من غير refresh)
    onSaved?.();

  } catch (err) {
    console.error(err);
    showToast(t('errorSaving'), 'error');
  }
};

  const headerDate = date
    ? new Date(date).toLocaleDateString(isRTL ? 'ar-EG' : 'en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';





  return (
    <>
      {toast.show && (
        <Toast 
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'success' })}
        />
      )}
      
      <div className="attendance-modal-overlay modal fade show d-block" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content attendance-modal-content">

            {/* Premium Header */}
            <div className="modal-header attendance-modal-header">
              <div className="d-flex align-items-center w-100">
                <div className="header-icon-wrapper">
                  <i className="fas fa-user-clock fa-2x header-icon" />
                </div>
                <div className="flex-grow-1">
                  <h4 className="header-title mb-1">
                    {user?.name || t('deletedUser')}
                  </h4>
                  <p className="header-subtitle mb-0">
                    <i className="fas fa-calendar-day me-2" />
                    {headerDate}
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn-close btn-close-white modal-close-btn" 
                  onClick={onClose}
                  aria-label="Close"
                />
              </div>
            </div>

            {/* Body */}
            <div className="modal-body attendance-modal-body">
               {isAdmin && showCreate && (
  <div className="card border-0 shadow-sm mb-4">
    <div className="card-header fw-bold">
      {t('addManualAttendance')}
    </div>

    <div className="card-body row g-3">
      
      {/* Branch */}
      <div className="col-md-4">
        <label className="form-label">{t('branch')}</label>
        <select
  className="form-select"
  value={createForm.branchId || ''}
  onChange={(e) =>
    setCreateForm({ ...createForm, branchId: e.target.value })
  }
  disabled={loadingBranches}
>
  <option value="">
    {loadingBranches ? t('loading') : t('selectBranch')}
  </option>

  {availableBranches.map(b => (
    <option key={b._id} value={b._id}>
      {b.name}
    </option>
  ))}
</select>

      </div>

      {/* Check-in */}
      <div className="col-md-4">
        <label className="form-label">{t('checkIn')}</label>
        <input
          type="datetime-local"
          className="form-control"
          value={createForm.checkInTime}
          onChange={(e) =>
            setCreateForm({ ...createForm, checkInTime: e.target.value })
          }
        />
      </div>

      {/* Check-out */}
      <div className="col-md-4">
        <label className="form-label">{t('checkOut')}</label>
        <input
          type="datetime-local"
          className="form-control"
          value={createForm.checkOutTime}
          onChange={(e) =>
            setCreateForm({ ...createForm, checkOutTime: e.target.value })
          }
        />
      </div>

      {/* Invalidated */}
      <div className="col-md-12">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={createForm.invalidated}
            onChange={(e) =>
              setCreateForm({
                ...createForm,
                invalidated: e.target.checked
              })
            }
          />
          <label className="form-check-label">
            {t('invalidateRecord')}
          </label>
        </div>
      </div>

      {/* Notes */}
      <div className="col-md-12">
        <textarea
          className="form-control"
          rows="2"
          placeholder={t('notes')}
          value={createForm.notes}
          onChange={(e) =>
            setCreateForm({ ...createForm, notes: e.target.value })
          }
        />
      </div>

      {/* Actions */}
      <div className="col-md-12 text-end">
        <button
          className="btn btn-success"
          onClick={handleCreateAttendance}
        >
          {t('save')}
        </button>
      </div>
    </div>
  </div>
)}

              {loading ? (
                <div className="loading-container text-center py-5">
                  <div className="spinner-border text-primary loading-spinner" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="loading-text mt-3">{t('loading')}...</p>
                </div>
              ) : localRecords.length === 0 ? (
                <div className="empty-state text-center py-5">
                  <div className="empty-icon-wrapper mb-4">
                    <i className="fas fa-calendar-times empty-icon" />
                  </div>
                  <p className="empty-text">{t('noAttendanceForDay')}</p>
                </div>
              ) : (
                <>
               

                  {/* Premium Table */}
                  <div className="mb-5">
                    <div className="table-responsive attendance-table-wrapper">
                      <table className="table table-hover align-middle mb-0 attendance-table">
                        <thead className="attendance-table-header">
                          <tr>
                            <th className="py-3">{t('branch')}</th>
                            <th className="py-3">{t('checkIn')}</th>
                            <th className="py-3">{t('checkOut')}</th>
                            <th className="py-3">{t('late')}</th>
                            <th className="py-3">{t('earlyLeave')}</th>
                            <th className="py-3">{t('notes')}</th>
                            <th className="text-center py-3">{t('actions')}</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {localRecords.map((rec) => {
                            const isEditing = editingId === rec._id;

                            return (
                              <tr 
                                key={rec._id} 
                                className={`attendance-row ${rec.invalidated ? 'invalidated-row' : ''}`}
                              >
                                <td className="py-3">
                                  <div className="d-flex align-items-center">
                                    <div className="branch-icon-wrapper me-3">
                                      <i className="fas fa-building text-white" />
                                    </div>
                                    <div>
                                      <div className="fw-bold">{rec.branch?.name || '—'}</div>
                                      {rec.invalidated && (
                                        <span className="badge bg-danger rounded-pill mt-1">
                                          <i className="fas fa-ban me-1" />
                                          {t('invalidated')}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                <td className="py-3">
                                  {isEditing ? (
                                    <input
                                      type="datetime-local"
                                      className="form-control form-control-sm datetime-input shadow-sm"
                                      value={form.checkInTime}
                                      onChange={(e) => setForm({ ...form, checkInTime: e.target.value })}
                                    />
                                  ) : (
                                    <span className="badge time-badge time-badge-in">
                                      <i className="fas fa-sign-in-alt me-2" />
                                      {formatTime(rec.checkInTime)}
                                    </span>
                                  )}
                                </td>

                                <td className="py-3">
                                  {isEditing ? (
                                    <input
                                      type="datetime-local"
                                      className="form-control form-control-sm datetime-input shadow-sm"
                                      value={form.checkOutTime}
                                      onChange={(e) => setForm({ ...form, checkOutTime: e.target.value })}
                                    />
                                  ) : (
                                    <span className="badge time-badge time-badge-out">
                                      <i className="fas fa-sign-out-alt me-2" />
                                      {formatTime(rec.checkOutTime)}
                                    </span>
                                  )}
                                </td>

                                <td className="py-3">
                                  {rec.lateMinutes > 0 ? (
                                    <span className="badge status-badge status-badge-warning">
                                      <i className="fas fa-clock me-1" />
                                      {rec.lateMinutes} {t('minutes')}
                                    </span>
                                  ) : (
                                    <span className="text-muted">—</span>
                                  )}
                                </td>

                                <td className="py-3">
                                  {rec.earlyLeaveMinutes > 0 ? (
                                    <span className="badge status-badge status-badge-danger">
                                      <i className="fas fa-door-open me-1" />
                                      {rec.earlyLeaveMinutes} {t('minutes')}
                                    </span>
                                  ) : (
                                    <span className="text-muted">—</span>
                                  )}
                                </td>

                                <td className="py-3 notes-cell">
                                  {isEditing ? (
                                    <div className="d-flex flex-column gap-2">
                                      <textarea
                                        className="form-control form-control-sm notes-textarea shadow-sm"
                                        rows="3"
                                        value={form.notes}
                                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                        placeholder={t('addNote')}
                                      />
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id={`inv-${rec._id}`}
                                          checked={form.invalidated}
                                          onChange={(e) => setForm({ ...form, invalidated: e.target.checked })}
                                        />
                                        <label className="form-check-label invalidate-label" htmlFor={`inv-${rec._id}`}>
                                          <i className="fas fa-ban me-1" />
                                          {t('invalidateRecord')}
                                        </label>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className={rec.notes ? 'text-dark' : 'notes-empty'}>
                                      {rec.notes || t('noNotes')}
                                    </div>
                                  )}
                                </td>

                                <td className="text-center py-3">
                                  {isEditing ? (
                                    <div className="d-flex gap-2 justify-content-center flex-wrap">
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-success rounded-pill px-3 btn-save shadow-sm"
                                        disabled={saving}
                                        onClick={() => saveEdit(rec._id)}
                                      >
                                        {saving ? (
                                          <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                                            {t('saving')}
                                          </>
                                        ) : (
                                          <>
                                            <i className="fas fa-check me-2" />
                                            {t('save')}
                                          </>
                                        )}
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary rounded-pill px-3 btn-cancel"
                                        onClick={cancelEdit}
                                        disabled={saving}
                                      >
                                        <i className="fas fa-times me-2" />
                                        {t('cancel')}
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-primary rounded-pill px-3 btn-edit shadow-sm"
                                      onClick={() => startEdit(rec)}
                                    >
                                      <i className="fas fa-edit me-2" />
                                      {t('edit')}
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Premium Transit Section */}
                  {transits && transits.length > 0 && (
                    <div className="card border-0 shadow-sm transit-card">
                      <div className="card-header transit-header">
                        <h5 className="mb-0 fw-bold">
                          <i className="fas fa-route me-2" />
                          {t('transitDetails')}
                        </h5>
                      </div>
                      <div className="card-body transit-body">
                        {transits.map((tr, idx) => (
                          <div key={`transit-${idx}`} className="transit-item">
                            <div className="d-flex align-items-center">
                              <div className="transit-icon-wrapper me-3">
                                <i className="fas fa-exchange-alt text-white fa-lg" />
                              </div>
                              <div>
                                <div className="transit-route fw-bold">
                                  {tr.fromBranchName} 
                                  <i className="fas fa-arrow-right mx-2 text-info" />
                                  {tr.toBranchName}
                                </div>
                                <small className="transit-time text-muted">
                                  <i className="fas fa-clock me-1" />
                                  {t('transitTime')}: <span className="fw-bold">{tr.gapMinutes}</span> {t('minutes')}
                                </small>
                              </div>
                            </div>
                            <div>
                              {tr.deductionMinutes > 0 ? (
                                <span className="badge transit-badge transit-badge-deduction shadow-sm">
                                  <i className="fas fa-minus-circle me-1" />
                                  {t('deduction')} {tr.deductionMinutes} {t('minutes')}
                                </span>
                              ) : (
                                <span className="badge transit-badge transit-badge-no-deduction shadow-sm">
                                  <i className="fas fa-check-circle me-1" />
                                  {t('noDeduction')}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Premium Footer */}
            <div className="modal-footer attendance-modal-footer d-flex justify-content-between">
  
  {isAdmin && (
    <button
      type="button"
      className="btn btn-lg btn-success rounded-pill px-4 shadow-sm"
      onClick={() => setShowCreate(true)}
    >
      <i className="fas fa-plus-circle me-2" />
      {t('addAttendance')}
    </button>
  )}

  <button
    type="button"
    className="btn btn-lg btn-danger rounded-pill px-5 shadow-sm"
    onClick={onClose}
  >
    <i className="fas fa-times-circle me-2" />
    {t('close')}
  </button>

</div>

          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeAttendanceDetailsModal;
