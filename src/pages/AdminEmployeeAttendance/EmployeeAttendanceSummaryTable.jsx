
// import { useTranslation } from 'react-i18next';

// const EmployeeAttendanceSummaryTable = ({
//   rows = [],
//   loading = false,
//   onOpenDetails
// }) => {
//   const { t } = useTranslation();

//   const renderStatus = (row) => {
//     if (row.allInvalid) {
//       return <span className="badge bg-danger">{t('invalidated')}</span>;
//     }

//     switch (row.dayStatus) {
//       case 'working':
//         return <span className="badge bg-success">{t('working')}</span>;
//       case 'holiday':
//         return <span className="badge bg-info">{t('holiday')}</span>;
//       case 'leave_paid':
//         return <span className="badge bg-primary">{t('leave_paid')}</span>;
//       case 'leave_unpaid':
//         return <span className="badge bg-warning text-dark">{t('leave_unpaid')}</span>;
//       case 'partial_leave':
//         return <span className="badge bg-secondary">{t('partial_leave')}</span>;
//       case 'absent':
//         return <span className="badge bg-dark">{t('absent')}</span>;
//       default:
//         return <span className="badge bg-light text-dark">{row.dayStatus}</span>;
//     }
//   };

//   return (
//     <div className="card shadow-sm">
//       <div className="card-body">
//         <h5 className="mb-3">
//           <i className="fas fa-table me-2" />
//           {t('attendanceSummary')}
//         </h5>

//         <div className="table-responsive">
//           <table className="table table-hover align-middle">
//             <thead className="table-light">
//               <tr>
//                 <th>{t('employee')}</th>
//                 <th>{t('date')}</th>
//                 <th>{t('status')}</th>
//                 <th>{t('penalties')}</th>
//                 <th className="text-center">{t('details')}</th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading && (
//                 <tr>
//                   <td colSpan="5" className="text-center py-4">
//                     <div className="spinner-border text-primary" />
//                   </td>
//                 </tr>
//               )}

//               {!loading && rows.length === 0 && (
//                 <tr>
//                   <td colSpan="5" className="text-center text-muted py-4">
//                     {t('noData')}
//                   </td>
//                 </tr>
//               )}

//               {!loading &&
//                 rows.map((row) => {
//                   const date = new Date(row.date);

//                   return (
//                     <tr key={`${row.user?._id}-${row.date}`}>
//                       <td>
//                         <strong>{row.user?.name || t('deletedUser')}</strong>
//                         <br />
//                         <small className="text-muted">
//                           {row.user?.email || '—'}
//                         </small>
//                       </td>

//                       <td>
//                         {date.toLocaleDateString()}
//                         <br />
//                         <small className="text-muted">
//                           {t(
//                             date
//                               .toLocaleString('en-US', { weekday: 'long' })
//                               .toLowerCase()
//                           )}
//                         </small>
//                       </td>

//                       <td>{renderStatus(row)}</td>

//                       <td>
//                         {row.totalLateMinutes > 0 && (
//                           <div className="text-warning small">
//                             ⏰ {t('late')}: {row.totalLateMinutes} {t('minutes')}
//                           </div>
//                         )}

//                         {row.totalEarlyLeaveMinutes > 0 && (
//                           <div className="text-danger small">
//                             🚪 {t('earlyLeave')}: {row.totalEarlyLeaveMinutes} {t('minutes')}
//                           </div>
//                         )}

//                         {row.totalTransitDeductionMinutes > 0 && (
//                           <div className="text-danger small">
//                             🛣️ {t('transitDeduction')}:{' '}
//                             {row.totalTransitDeductionMinutes} {t('minutes')}
//                           </div>
//                         )}

//                         {!row.totalLateMinutes &&
//                           !row.totalEarlyLeaveMinutes &&
//                           !row.totalTransitDeductionMinutes && (
//                             <span className="text-muted small">
//                               {t('noPenalties')}
//                             </span>
//                           )}
//                       </td>

//                       <td className="text-center">
//                         <button
//                           className="btn btn-sm btn-outline-primary"
//                           onClick={() => onOpenDetails(row)}
//                         >
//                           <i className="fas fa-eye" />
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeAttendanceSummaryTable;


//row data
// import { useTranslation } from 'react-i18next';

// const EmployeeAttendanceSummaryTable = ({
//   rows = [],
//   loading = false,
//   onEdit
// }) => {
//   const { t } = useTranslation();

//   if (loading) {
//     return (
//       <div className="text-center py-5">
//         <div className="spinner-border text-primary" />
//       </div>
//     );
//   }

//   if (!rows.length) {
//     return (
//       <div className="text-center py-5 text-muted">
//         {t('noData')}
//       </div>
//     );
//   }

//   return (
//     <div className="table-responsive">
//       <table className="table table-hover align-middle">
//         <thead className="table-primary">
//           <tr>
//             <th>{t('employee')}</th>
//             <th>{t('date')}</th>
//             <th>{t('day')}</th>
//             <th>
//               {t('branch')} / {t('checkIn')} – {t('checkOut')}
//             </th>
//             <th>{t('status')}</th>
//             <th>{t('details')}</th>
//           </tr>
//         </thead>

//         <tbody>
//           {rows.map((row) => {
//             const dateObj =
//               row.date instanceof Date ? row.date : new Date(row.date);

//             const hasCheckout = row.records.some(
//               (r) => !!r.checkOutTime
//             );

//             const hasTransitDeduction =
//               (row.totalTransitDeductionMinutes || 0) > 0;

//             return (
//               <tr
//                 key={row.key}
//                 className={row.allInvalid ? 'table-danger' : ''}
//               >
//                 {/* ===== Employee ===== */}
//                 <td>
//                   <strong>
//                     {row.user?.name || t('deletedUser')}
//                   </strong>
//                   <br />
//                   <small className="text-muted">
//                     {row.user?.email || '—'}
//                   </small>
//                 </td>

//                 {/* ===== Date ===== */}
//                 <td>
//                   {dateObj.toLocaleDateString()}
//                 </td>

//                 {/* ===== Day ===== */}
//                 <td>
//                   {t(
//                     dateObj
//                       .toLocaleString('en-US', { weekday: 'long' })
//                       .toLowerCase()
//                   )}
//                 </td>

//                 {/* ===== Branches + Times ===== */}
//                 <td>
//                   {row.records.map((rec) => (
//                     <div key={rec._id} className="mb-1">
//                       <strong>{rec.branch?.name || '—'}</strong>
//                       <br />
//                       <span className="small">
//                         {rec.checkInTime
//                           ? new Date(rec.checkInTime).toLocaleTimeString([], {
//                               hour: '2-digit',
//                               minute: '2-digit'
//                             })
//                           : '-'}{' '}
//                         –{' '}
//                         {rec.checkOutTime
//                           ? new Date(rec.checkOutTime).toLocaleTimeString([], {
//                               hour: '2-digit',
//                               minute: '2-digit'
//                             })
//                           : '-'}
//                       </span>

//                       {rec.invalidated && (
//                         <span className="badge bg-danger ms-2">
//                           {t('invalidated')}
//                         </span>
//                       )}

//                       <button
//                         className="btn btn-sm btn-outline-primary ms-2"
//                         onClick={() => onEdit(row, rec)}
//                         title={t('edit')}
//                       >
//                         <i className="fas fa-edit" />
//                       </button>
//                     </div>
//                   ))}
//                 </td>

//                 {/* ===== Status ===== */}
//                 <td>
//                   {row.allInvalid ? (
//                     <span className="badge bg-danger">
//                       {t('invalidated')}
//                     </span>
//                   ) : (
//                     <span className="badge bg-info">
//                       {t(row.status)}
//                     </span>
//                   )}
//                 </td>

//                 {/* ===== Details (الأهم) ===== */}
//                 <td>
//                   {row.allInvalid ? (
//                     <span className="small text-danger">
//                       {t('needsReview')}
//                     </span>
//                   ) : !hasCheckout ? (
//                     <span className="small text-warning">
//                       {t('noCheckoutNeedsReview')}
//                     </span>
//                   ) : (
//                     <>
                    
//                       {/* Late */}
//                       {row.totalLateMinutes > 0 && (
//                         <div className="small text-warning">
//                           <i className="fas fa-clock me-1" />
//                           {t('late')}: {row.totalLateMinutes}{' '}
//                           {t('minutes')}
//                         </div>
//                       )}

//                       {/* Early Leave */}
//                       {row.totalEarlyLeaveMinutes > 0 && (
//                         <div className="small text-danger">
//                           <i className="fas fa-sign-out-alt me-1" />
//                           {t('earlyLeave')}:{' '}
//                           {row.totalEarlyLeaveMinutes}{' '}
//                           {t('minutes')}
//                         </div>
//                       )}

//                       {/* Transit */}
//                       {row.transits?.length > 0 && (
//                         <div className="small mt-1">
//                           <strong>
//                             <i className="fas fa-route me-1" />
//                             {t('transit')}:
//                           </strong>
//                           <ul className="mb-1">
//                             {row.transits.map((tr, idx) => (
//                               <li key={idx}>
//                                 {t('from')}{' '}
//                                 <strong>{tr.fromBranchName}</strong>{' '}
//                                 {t('to')}{' '}
//                                 <strong>{tr.toBranchName}</strong>{' '}
//                                 – {tr.gapMinutes}{' '}
//                                 {t('minutes')}{' '}
//                                 {tr.deductionMinutes > 0 ? (
//                                   <span className="text-danger">
//                                     ({t('deducted')}{' '}
//                                     {tr.deductionMinutes}{' '}
//                                     {t('minutes')})
//                                   </span>
//                                 ) : (
//                                   <span className="text-success">
//                                     ({t('noDeduction')})
//                                   </span>
//                                 )}
//                               </li>
//                             ))}
//                           </ul>

//                           {hasTransitDeduction && (
//                             <div className="small text-danger">
//                               {t('totalTransitDeduction')}:{' '}
//                               {row.totalTransitDeductionMinutes}{' '}
//                               {t('minutes')}
//                             </div>
//                           )}
//                         </div>
//                       )}

//                       {/* No penalties */}
//                       {!row.totalLateMinutes &&
//                         !row.totalEarlyLeaveMinutes &&
//                         !hasTransitDeduction && (
//                           <span className="small text-muted">
//                             {t('noPenalties')}
//                           </span>
//                         )}
//                     </>
//                   )}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default EmployeeAttendanceSummaryTable;

// import { useTranslation } from 'react-i18next';

// const EmployeeAttendanceSummaryTable = ({
//   rows = [],
//   loading = false,
//   onOpenDetails
// }) => {
//   const { t } = useTranslation();

//   const renderStatusBadge = (row) => {
//     if (row.allInvalid || row.status === 'invalidated') {
//       return <span className="badge bg-danger">{t('invalidated')}</span>;
//     }

//     switch (row.status) {
//       case 'working':
//         return <span className="badge bg-success">{t('working')}</span>;
//       case 'holiday':
//         return <span className="badge bg-info">{t('holiday')}</span>;
//       case 'leave_paid':
//         return <span className="badge bg-primary">{t('leave_paid')}</span>;
//       case 'leave_unpaid':
//         return (
//           <span className="badge bg-warning text-dark">
//             {t('leave_unpaid')}
//           </span>
//         );
//       case 'partial_leave':
//         return <span className="badge bg-secondary">{t('partial_leave')}</span>;
//       case 'absent':
//         return <span className="badge bg-dark">{t('absent')}</span>;
//       default:
//         return (
//           <span className="badge bg-light text-dark">
//             {row.status}
//           </span>
//         );
//     }
//   };

//   return (
//     <div className="card shadow-sm">
//       <div className="card-body">
//         <h5 className="card-title mb-3">
//           <i className="fas fa-clipboard-list me-2 text-primary" />
//           {t('attendanceSummary')}
//         </h5>

//         <div className="table-responsive">
//           <table className="table table-hover align-middle">
//             <thead className="table-primary">
//               <tr>
//                 <th>{t('employee')}</th>
//                 <th>{t('date')}</th>
//                 <th>{t('branches')}</th>
//                 <th>{t('status')}</th>
//                 <th>{t('penalties')}</th>
//                 <th className="text-center">{t('details')}</th>
//               </tr>
//             </thead>

//             <tbody>
//               {/* Loading */}
//               {loading && (
//                 <tr>
//                   <td colSpan="6" className="text-center py-4">
//                     <div className="spinner-border text-primary" />
//                   </td>
//                 </tr>
//               )}

//               {/* No data */}
//               {!loading && rows.length === 0 && (
//                 <tr>
//                   <td colSpan="6" className="text-center text-muted py-4">
//                     {t('noData')}
//                   </td>
//                 </tr>
//               )}

//               {/* Rows */}
//               {!loading &&
//                 rows.map((row) => {
//                   const dateObj = new Date(row.date);

//                   return (
//                     <tr
//                       key={row.key}
//                       className={row.allInvalid ? 'table-danger' : ''}
//                     >
//                       {/* Employee */}
//                       <td>
//                         <strong>
//                           {row.user?.name ||
//                             row.metadata?.oldUserName ||
//                             t('deletedUser')}
//                         </strong>
//                         <br />
//                         <small className="text-muted">
//                           {row.user?.email || '—'}
//                         </small>
//                       </td>

//                       {/* Date */}
//                       <td>
//                         {dateObj.toLocaleDateString()}
//                         <br />
//                         <small className="text-muted">
//                           {t(
//                             dateObj
//                               .toLocaleString('en-US', { weekday: 'long' })
//                               .toLowerCase()
//                           )}
//                         </small>
//                       </td>

//                       {/* Branches */}
//                       <td>
//                         <strong>
//                           {row.branches?.[0]?.branchName || '—'}
//                         </strong>
//                         <br />
//                         <small className="text-muted">
//                           →{' '}
//                           {row.branches?.[row.branches.length - 1]?.branchName ||
//                             '—'}
//                         </small>
//                       </td>

//                       {/* Status */}
//                       <td>{renderStatusBadge(row)}</td>

//                       {/* Penalties */}
//                       <td>
//                         {/* Late */}
//                         {row.totalLateMinutes > 0 && (
//                           <div className="small text-warning">
//                             <i className="fas fa-clock me-1" />
//                             {t('late')}: {row.totalLateMinutes}{' '}
//                             {t('minutes')}
//                           </div>
//                         )}

//                         {/* Early Leave */}
//                         {row.totalEarlyLeaveMinutes > 0 && (
//                           <div className="small text-danger">
//                             <i className="fas fa-sign-out-alt me-1" />
//                             {t('earlyLeave')}:{' '}
//                             {row.totalEarlyLeaveMinutes} {t('minutes')}
//                           </div>
//                         )}

//                         {/* Early Arrival */}
//                         {row.earlyArrivalMinutes > 0 && (
//                           <div className="small text-success">
//                             <i className="fas fa-arrow-up me-1" />
//                             {t('earlyArrival')}:{' '}
//                             {row.earlyArrivalMinutes} {t('minutes')}
//                           </div>
//                         )}

//                         {/* Late Departure */}
//                         {row.lateDepartureMinutes > 0 && (
//                           <div className="small text-success">
//                             <i className="fas fa-arrow-down me-1" />
//                             {t('lateDeparture')}:{' '}
//                             {row.lateDepartureMinutes} {t('minutes')}
//                           </div>
//                         )}

//                         {/* Transit Deduction */}
//                         {row.totalTransitDeductionMinutes > 0 && (
//                           <div className="small text-danger">
//                             <i className="fas fa-route me-1" />
//                             {t('transitDeduction')}:{' '}
//                             {row.totalTransitDeductionMinutes}{' '}
//                             {t('minutes')}
//                           </div>
//                         )}

//                         {/* No penalties */}
//                         {!row.totalLateMinutes &&
//                           !row.totalEarlyLeaveMinutes &&
//                           !row.earlyArrivalMinutes &&
//                           !row.lateDepartureMinutes &&
//                           !row.totalTransitDeductionMinutes && (
//                             <span className="small text-muted">
//                               {t('noPenalties')}
//                             </span>
//                           )}
//                       </td>

//                       {/* Details */}
//                       <td className="text-center">
//                         <button
//                           className="btn btn-sm btn-outline-primary"
//                           title={t('details')}
//                           onClick={() => onOpenDetails(row)}
//                         >
//                           <i className="fas fa-eye" />
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeAttendanceSummaryTable;









//1
// import { useTranslation } from 'react-i18next';

// const EmployeeAttendanceSummaryTable = ({
//   rows = [],
//   loading = false,
//   onOpenDetails
// }) => {
//   const { t } = useTranslation();

//   const renderDayStatus = (row) => {
//     switch (row.dayStatus) {
//       case 'working':
//         return <span className="badge bg-success">{t('working')}</span>;
//       case 'holiday':
//         return <span className="badge bg-info">{t('holiday')}</span>;
//       case 'leave_paid':
//         return <span className="badge bg-primary">{t('leave_paid')}</span>;
//       case 'leave_unpaid':
//         return (
//           <span className="badge bg-warning text-dark">
//             {t('leave_unpaid')}
//           </span>
//         );
//       case 'partial_leave':
//         return <span className="badge bg-secondary">{t('partial_leave')}</span>;
//       case 'absent':
//         return <span className="badge bg-dark">{t('absent')}</span>;
//       default:
//         return <span className="badge bg-light text-dark">{row.dayStatus}</span>;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="text-center py-5">
//         <div className="spinner-border text-primary" />
//       </div>
//     );
//   }

//   if (!rows.length) {
//     return (
//       <div className="text-center py-5 text-muted">
//         {t('noData')}
//       </div>
//     );
//   }

//   return (
//     <div className="table-responsive">
//       <table className="table table-hover align-middle">
//         <thead className="table-primary">
//           <tr>
//             <th>{t('employee')}</th>
//             <th>{t('date')}</th>
//             <th>{t('branches')}</th>
//             <th>{t('dayStatus')}</th>
//             <th>{t('summary')}</th>
//             <th className="text-center">{t('details')}</th>
//           </tr>
//         </thead>

//         <tbody>
//           {rows.map((row) => {
//             const dateObj = new Date(row.date);

//             return (
//               <tr
//                 key={row._id}
//                 className={row.allInvalid ? 'table-danger' : ''}
//               >
//                 {/* Employee */}
//                 <td>
//                   <strong>{row.user?.name || t('deletedUser')}</strong>
//                   <br />
//                   <small className="text-muted">
//                     {row.user?.email || '—'}
//                   </small>
//                 </td>

//                 {/* Date */}
//                 <td>
//                   {dateObj.toLocaleDateString()}
//                   <br />
//                   <small className="text-muted">
//                     {t(
//                       dateObj
//                         .toLocaleString('en-US', { weekday: 'long' })
//                         .toLowerCase()
//                     )}
//                   </small>
//                 </td>

//                 {/* Branches */}
//                 <td>
//                   {row.branchesVisited?.length ? (
//                     row.branchesVisited.map((b) => (
//                       <div key={b.branch}>
//                         <i className="fas fa-building me-1" />
//                         {b.name}
//                       </div>
//                     ))
//                   ) : (
//                     <span className="text-muted">—</span>
//                   )}
//                 </td>

//                 {/* Day Status */}
//                 <td>{renderDayStatus(row)}</td>

//                 {/* Summary */}
//                 <td>
//                   {row.firstCheckInTime && (
//                     <div className="small">
//                       ⏱ {t('firstIn')}:{' '}
//                       {new Date(row.firstCheckInTime).toLocaleTimeString()}
//                     </div>
//                   )}

//                   {row.lastCheckOutTime && (
//                     <div className="small">
//                       🚪 {t('lastOut')}:{' '}
//                       {new Date(row.lastCheckOutTime).toLocaleTimeString()}
//                     </div>
//                   )}

//                   {row.totalLateMinutes > 0 && (
//                     <div className="small text-warning">
//                       ⏰ {t('late')}: {row.totalLateMinutes} {t('minutes')}
//                     </div>
//                   )}

//                   {row.totalEarlyLeaveMinutes > 0 && (
//                     <div className="small text-danger">
//                       🚪 {t('earlyLeave')}:{' '}
//                       {row.totalEarlyLeaveMinutes} {t('minutes')}
//                     </div>
//                   )}

//                   {row.totalTransitDeductionMinutes > 0 && (
//                     <div className="small text-danger">
//                       🛣 {t('transitDeduction')}:{' '}
//                       {row.totalTransitDeductionMinutes} {t('minutes')}
//                     </div>
//                   )}

//                   {!row.totalLateMinutes &&
//                     !row.totalEarlyLeaveMinutes &&
//                     !row.totalTransitDeductionMinutes && (
//                       <span className="small text-muted">
//                         {t('noPenalties')}
//                       </span>
//                     )}
//                 </td>

//                 {/* Details */}
//                 <td className="text-center">
//                   <button
//                     className="btn btn-sm btn-outline-primary"
//                     onClick={() => onOpenDetails(row)}
//                   >
//                     <i className="fas fa-eye" />
//                   </button>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default EmployeeAttendanceSummaryTable;

// src/pages/admin/EmployeeAttendanceSummaryTable.jsx
// ► عارض فقط — مفيش حسابات أو فلترة أو pagination هنا
// ► كل البيانات جاية من الباك عبر props

// src/pages/admin/EmployeeAttendanceSummaryTable.jsx
// ► عارض فقط — مفيش حسابات أو فلترة أو pagination هنا
// ► كل البيانات جاية من الباك عبر props
import { useTranslation } from 'react-i18next';

// ── Decision badge ────────────────────────────────────────────────
const DECISION_ICON = {
  WORKING_DAY:           'fa-check-circle',
  LEAVE_PAID:            'fa-umbrella-beach',
  LEAVE_UNPAID:          'fa-calendar-minus',
  ABSENT_NO_PERMISSION:  'fa-user-times',
  NON_WORKING_DAY:       'fa-moon',
  HOLIDAY:               'fa-star-and-crescent',
  WEEKLY_OFF:            'fa-moon',
  NO_DATA:               'fa-question-circle',
};

// ✅ FIX 2 — نفرق بين HOLIDAY و WEEKLY_OFF جوا NON_WORKING_DAY
// الباك بيبعت nonWorkingReason: 'HOLIDAY' | 'WEEKLY_OFF' | null
const getDisplayStatus = (row) => {
  if (row.decisionType === 'NON_WORKING_DAY') {
    return row.nonWorkingReason === 'HOLIDAY' ? 'HOLIDAY' : 'WEEKLY_OFF';
  }
  return row.decisionType;
};

const DecisionBadge = ({ row }) => {
  const { t }      = useTranslation();
  const status     = getDisplayStatus(row);
  const icon       = DECISION_ICON[status] || 'fa-circle';
  // الـ CSS class يبقى NON_WORKING_DAY دايماً للاتنين عشان نفس اللون
  const badgeClass = row.decisionType === 'NON_WORKING_DAY'
    ? 'att-badge-NON_WORKING_DAY'
    : `att-badge-${status || 'NO_DATA'}`;
  return (
    <span className={`att-badge ${badgeClass}`}>
      <i className={`fas ${icon}`} />
      {t(status || 'NO_DATA')}
    </span>
  );
};

// ── Summary mini-rows ─────────────────────────────────────────────
const SummaryCell = ({ row, t }) => {
  const hasPenalty = row.totalLateMinutes > 0
    || row.totalEarlyLeaveMinutes > 0
    || row.totalTransitDeductionMinutes > 0;

  return (
    <>
      {/* timing */}
      {row.firstCheckInTime && (
        <div className="att-sumrow timing">
          <i className="fas fa-sign-in-alt" />
          {t('firstIn')}: {new Date(row.firstCheckInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
      {row.lastCheckOutTime && (
        <div className="att-sumrow timing">
          <i className="fas fa-sign-out-alt" />
          {t('lastOut')}: {new Date(row.lastCheckOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}

      {/* bonuses */}
      {row.earlyArrivalMinutes > 0 && (
        <div className="att-sumrow bonus">
          <i className="fas fa-star" />
          {t('earlyArrival')}: {row.earlyArrivalMinutes} {t('min')}
        </div>
      )}
      {row.lateDepartureMinutes > 0 && (
        <div className="att-sumrow bonus">
          <i className="fas fa-star-half-alt" />
          {t('lateDeparture')}: {row.lateDepartureMinutes} {t('min')}
        </div>
      )}

      {/* penalties */}
      {row.totalLateMinutes > 0 && (
        <div className="att-sumrow penalty">
          <i className="fas fa-clock" />
          {t('late')}: {row.totalLateMinutes} {t('min')}
        </div>
      )}
      {row.totalEarlyLeaveMinutes > 0 && (
        <div className="att-sumrow penalty">
          <i className="fas fa-sign-out-alt" />
          {t('earlyLeave')}: {row.totalEarlyLeaveMinutes} {t('min')}
        </div>
      )}
      {row.totalTransitDeductionMinutes > 0 && (
        <div className="att-sumrow penalty">
          <i className="fas fa-route" />
          {t('transitDeduction')}: {row.totalTransitDeductionMinutes} {t('min')}
        </div>
      )}

      {/* admin notes */}
      {row.adminNotes?.length > 0 && (
        <div className="att-sumrow note">
          <i className="fas fa-sticky-note" />
          {row.adminNotes.join(', ')}
        </div>
      )}

      {/* no penalty */}
      {!hasPenalty && !row.firstCheckInTime && (
        <span className="att-no-penalty">
          <i className="fas fa-check" /> {t('noPenalties')}
        </span>
      )}
    </>
  );
};

// ── Main component ────────────────────────────────────────────────
const EmployeeAttendanceSummaryTable = ({ rows = [], loading, onOpenDetails }) => {
  const { t, i18n } = useTranslation();
  const locale       = i18n.language === 'ar' ? 'ar-EG' : 'en-GB';

  if (loading) {
    return (
      <div className="att-table-card">
        <div className="att-loading">
          <div className="att-spinner" />
          <div className="att-empty-text">{t('loading')}…</div>
        </div>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="att-table-card">
        <div className="att-empty">
          <div className="att-empty-icon"><i className="fas fa-calendar-times" /></div>
          <div className="att-empty-text">{t('noData')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="att-table-card">
      <div style={{ overflowX: 'auto' }}>
        <table className="att-table">
          <thead>
            <tr>
              <th>{t('employee')}</th>
              <th>{t('date')}</th>
              <th>{t('branches')}</th>
              <th>{t('dayStatus')}</th>
              <th>{t('summary')}</th>
              <th style={{ textAlign: 'center' }}>{t('details')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => {
              const dateObj = new Date(row.date);
              return (
                <tr
                  key={row._id}
                  className={row.allInvalid ? 'att-row-invalid' : ''}
                >
                  {/* Employee */}
                  <td>
                    <div className="att-emp-name">{row.user?.name || t('deletedUser')}</div>
                    <div className="att-emp-email">{row.user?.email}</div>
                  </td>

                  {/* Date */}
                  <td>
                    <div className="att-date-main">
                      {dateObj.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="att-date-day">
                      {dateObj.toLocaleDateString(locale, { weekday: 'long' })}
                    </div>
                  </td>

                  {/* Branches visited */}
                  <td>
                    {row.branchesVisited?.length ? (
                      row.branchesVisited.map((b, idx) => (
                        <div key={idx} className="att-branch-item">
                          <i className="fas fa-building" />
                          <span>{b.name || b.branch}</span>
                          {b.invalidated && (
                            <i
                              className="fas fa-exclamation-circle"
                              style={{ color: 'var(--att-danger)', fontSize: '.7rem' }}
                              title={t('invalidated')}
                            />
                          )}
                        </div>
                      ))
                    ) : (
                      <span style={{ color: 'var(--att-muted)', fontSize: '.78rem' }}>—</span>
                    )}
                  </td>

                  {/* Decision type */}
                  <td><DecisionBadge row={row} /></td>

                  {/* Summary */}
                  <td><SummaryCell row={row} t={t} /></td>

                  {/* Details button */}
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="att-btn-details"
                      onClick={() => {
                        if (!row.user?._id || !row.date) return;
                        onOpenDetails(row);
                      }}
                    >
                      <i className="fas fa-eye" />
                      {t('details')}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeAttendanceSummaryTable;

// import { useTranslation } from 'react-i18next';

// // ── Decision badge ────────────────────────────────────────────────
// const DECISION_ICON = {
//   WORKING_DAY:           'fa-check-circle',
//   LEAVE_PAID:            'fa-umbrella-beach',
//   LEAVE_UNPAID:          'fa-calendar-minus',
//   ABSENT_NO_PERMISSION:  'fa-user-times',
//   NON_WORKING_DAY:       'fa-moon',
//   NO_DATA:               'fa-question-circle',
// };

// const DecisionBadge = ({ status }) => {
//   const { t } = useTranslation();
//   const icon  = DECISION_ICON[status] || 'fa-circle';
//   return (
//     <span className={`att-badge att-badge-${status || 'NO_DATA'}`}>
//       <i className={`fas ${icon}`} />
//       {t(status || 'NO_DATA')}
//     </span>
//   );
// };

// // ── Summary mini-rows ─────────────────────────────────────────────
// const SummaryCell = ({ row, t }) => {
//   const hasPenalty = row.totalLateMinutes > 0
//     || row.totalEarlyLeaveMinutes > 0
//     || row.totalTransitDeductionMinutes > 0;

//   return (
//     <>
//       {/* timing */}
//       {row.firstCheckInTime && (
//         <div className="att-sumrow timing">
//           <i className="fas fa-sign-in-alt" />
//           {t('firstIn')}: {new Date(row.firstCheckInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//         </div>
//       )}
//       {row.lastCheckOutTime && (
//         <div className="att-sumrow timing">
//           <i className="fas fa-sign-out-alt" />
//           {t('lastOut')}: {new Date(row.lastCheckOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//         </div>
//       )}

//       {/* bonuses */}
//       {row.earlyArrivalMinutes > 0 && (
//         <div className="att-sumrow bonus">
//           <i className="fas fa-star" />
//           {t('earlyArrival')}: {row.earlyArrivalMinutes} {t('min')}
//         </div>
//       )}
//       {row.lateDepartureMinutes > 0 && (
//         <div className="att-sumrow bonus">
//           <i className="fas fa-star-half-alt" />
//           {t('lateDeparture')}: {row.lateDepartureMinutes} {t('min')}
//         </div>
//       )}

//       {/* penalties */}
//       {row.totalLateMinutes > 0 && (
//         <div className="att-sumrow penalty">
//           <i className="fas fa-clock" />
//           {t('late')}: {row.totalLateMinutes} {t('min')}
//         </div>
//       )}
//       {row.totalEarlyLeaveMinutes > 0 && (
//         <div className="att-sumrow penalty">
//           <i className="fas fa-sign-out-alt" />
//           {t('earlyLeave')}: {row.totalEarlyLeaveMinutes} {t('min')}
//         </div>
//       )}
//       {row.totalTransitDeductionMinutes > 0 && (
//         <div className="att-sumrow penalty">
//           <i className="fas fa-route" />
//           {t('transitDeduction')}: {row.totalTransitDeductionMinutes} {t('min')}
//         </div>
//       )}

//       {/* admin notes */}
//       {row.adminNotes?.length > 0 && (
//         <div className="att-sumrow note">
//           <i className="fas fa-sticky-note" />
//           {row.adminNotes.join(', ')}
//         </div>
//       )}

//       {/* no penalty */}
//       {!hasPenalty && !row.firstCheckInTime && (
//         <span className="att-no-penalty">
//           <i className="fas fa-check" /> {t('noPenalties')}
//         </span>
//       )}
//     </>
//   );
// };

// // ── Main component ────────────────────────────────────────────────
// const EmployeeAttendanceSummaryTable = ({ rows = [], loading, onOpenDetails }) => {
//   const { t, i18n } = useTranslation();
//   const locale       = i18n.language === 'ar' ? 'ar-EG' : 'en-GB';

//   if (loading) {
//     return (
//       <div className="att-table-card">
//         <div className="att-loading">
//           <div className="att-spinner" />
//           <div className="att-empty-text">{t('loading')}…</div>
//         </div>
//       </div>
//     );
//   }

//   if (!rows.length) {
//     return (
//       <div className="att-table-card">
//         <div className="att-empty">
//           <div className="att-empty-icon"><i className="fas fa-calendar-times" /></div>
//           <div className="att-empty-text">{t('noData')}</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="att-table-card">
//       <div style={{ overflowX: 'auto' }}>
//         <table className="att-table">
//           <thead>
//             <tr>
//               <th>{t('employee')}</th>
//               <th>{t('date')}</th>
//               <th>{t('branches')}</th>
//               <th>{t('dayStatus')}</th>
//               <th>{t('summary')}</th>
//               <th style={{ textAlign: 'center' }}>{t('details')}</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map(row => {
//               const dateObj = new Date(row.date);
//               return (
//                 <tr
//                   key={row._id}
//                   className={row.allInvalid ? 'att-row-invalid' : ''}
//                 >
//                   {/* Employee */}
//                   <td>
//                     <div className="att-emp-name">{row.user?.name || t('deletedUser')}</div>
//                     <div className="att-emp-email">{row.user?.email}</div>
//                   </td>

//                   {/* Date */}
//                   <td>
//                     <div className="att-date-main">
//                       {dateObj.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })}
//                     </div>
//                     <div className="att-date-day">
//                       {dateObj.toLocaleDateString(locale, { weekday: 'long' })}
//                     </div>
//                   </td>

//                   {/* Branches visited */}
//                   <td>
//                     {row.branchesVisited?.length ? (
//                       row.branchesVisited.map((b, idx) => (
//                         <div key={idx} className="att-branch-item">
//                           <i className="fas fa-building" />
//                           <span>{b.name || b.branch}</span>
//                           {b.invalidated && (
//                             <i
//                               className="fas fa-exclamation-circle"
//                               style={{ color: 'var(--att-danger)', fontSize: '.7rem' }}
//                               title={t('invalidated')}
//                             />
//                           )}
//                         </div>
//                       ))
//                     ) : (
//                       <span style={{ color: 'var(--att-muted)', fontSize: '.78rem' }}>—</span>
//                     )}
//                   </td>

//                   {/* Decision type */}
//                   <td><DecisionBadge status={row.decisionType} /></td>

//                   {/* Summary */}
//                   <td><SummaryCell row={row} t={t} /></td>

//                   {/* Details button */}
//                   <td style={{ textAlign: 'center' }}>
//                     <button
//                       className="att-btn-details"
//                       onClick={() => {
//                         if (!row.user?._id || !row.date) return;
//                         onOpenDetails(row);
//                       }}
//                     >
//                       <i className="fas fa-eye" />
//                       {t('details')}
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default EmployeeAttendanceSummaryTable;
// //notbad1
// import { useTranslation } from 'react-i18next';

// const EmployeeAttendanceSummaryTable = ({ rows = [], loading, onOpenDetails }) => {
//   const { t } = useTranslation();

//   if (loading) {
//     return (
//       <div className="text-center py-5">
//         <div className="spinner-border text-primary" />
//       </div>
//     );
//   }

//   if (!Array.isArray(rows) || rows.length === 0) {
//     return (
//       <div className="text-center py-5 text-muted">
//         {t('noData')}
//       </div>
//     );
//   }

//   const renderDayStatus = (status) => {
  
// const map = {
//   WORKING_DAY: 'success',
//   LEAVE_PAID: 'primary',
//   LEAVE_UNPAID: 'warning',
//   ABSENT_NO_PERMISSION: 'danger',
//   NON_WORKING_DAY: 'info',
//   NO_DATA: 'secondary'
// };

//     return (
//       <span className={`badge bg-${map[status] || 'light'} text-light`}>
//         {t(status)}
//       </span>
//     );
//   };

//   return (
//     <div className="table-responsive">
//       <table className="table table-hover align-middle">
//         <thead className="table-primary">
//           <tr>
//             <th>{t('employee')}</th>
//             <th>{t('date')}</th>
//             <th>{t('branches')}</th>
//             <th>{t('dayStatus')}</th>
//             <th>{t('summary')}</th>
//             <th className="text-center">{t('details')}</th>
//           </tr>
//         </thead>

//         <tbody>
//           {rows.map(row => {
//             const dateObj = new Date(row.date);

//             return (
//               <tr
//                 key={row._id}
//                 className={row.allInvalid ? 'table-danger' : ''}
//               >
//                 {/* Employee */}
//                 <td>
//                   <strong>{row.user?.name}</strong>
//                   <br />
//                   <small className="text-muted">
//                     {row.user?.email}
//                   </small>
//                 </td>

//                 {/* Date */}
//                 <td>
//                   {dateObj.toLocaleDateString()}
//                   <br />
//                   <small className="text-muted">
//                     {dateObj.toLocaleString('en-US', { weekday: 'long' })}
//                   </small>
//                 </td>

//                 {/* Branches */}
//                 <td>
//                   {row.branchesVisited?.length ? (
//                     row.branchesVisited.map(b => (
//                       <div key={b.branch} className="d-flex align-items-center">
//                         <i className="fas fa-building text-secondary me-2" />
//                         <span>{b.name}</span>
//                         {b.invalidated && (
//                           <span
//                             className="ms-2 text-danger"
//                             title="Invalidated attendance"
//                           >
//                             <i className="fas fa-exclamation-circle" />
//                           </span>
//                         )}
//                       </div>
//                     ))
//                   ) : (
//                     <span className="text-muted">
//                       — No attendance —
//                     </span>
//                   )}
//                 </td>

//                 {/* Day Status */}
//                 <td>
//                   {renderDayStatus(row.decisionType)
//                   // (row.dayStatus)
                  
//                   }
//                 </td>

//                 {/* Summary */}
//                 <td>
//                   {row.firstCheckInTime && (
//                     <div className="small">
//                       <strong>{t('firstIn')}:</strong>{' '}
//                       {new Date(row.firstCheckInTime).toLocaleTimeString()}
//                     </div>
//                   )}

//                   {row.lastCheckOutTime && (
//                     <div className="small">
//                       <strong>{t('lastOut')}:</strong>{' '}
//                       {new Date(row.lastCheckOutTime).toLocaleTimeString()}
//                     </div>
//                   )}

//                   {row.totalLateMinutes > 0 && (
//                     <div className="small text-warning">
//                       <i className="fas fa-clock me-1" />
//                       {t('late')}: {row.totalLateMinutes} {t('minutes')}
//                     </div>
//                   )}

//                   {row.earlyArrivalMinutes > 0 && (
//                     <div className="small text-success">
//                       <i className="fas fa-arrow-circle-left me-1" />
//                       {t('earlyArrival')}: {row.earlyArrivalMinutes} {t('minutes')}
//                     </div>
//                   )}

//                   {row.lateDepartureMinutes > 0 && (
//                     <div className="small text-success">
//                       <i className="fas fa-arrow-circle-right me-1" />
//                       {t('lateDeparture')}: {row.lateDepartureMinutes} {t('minutes')}
//                     </div>
//                   )}
// {row.totalEarlyLeaveMinutes > 0 && (
//   <div className="small text-danger">
//     {/* <i className="fas fa-door-open me-1" /> */}
//      <i className="fas fa-sign-out-alt me-1" />
//     {t('earlyLeave')}: {row.totalEarlyLeaveMinutes} {t('minutes')}
//   </div>
// )}

//                   {row.totalTransitDeductionMinutes > 0 && (
//                     <div className="small text-danger">
//                       <i className="fas fa-route me-1" />
//                       {t('transitDeduction')}:{' '}
//                       {row.totalTransitDeductionMinutes} {t('minutes')}
//                     </div>
//                   )}
// {/* {row.notes && (
//   <div className="small text-muted mt-1">
//     <i className="fas fa-sticky-note me-1" />
//     {row.notes}
//   </div>
// )} */}
// {row.adminNotes?.length > 0 && (
//   <div className="small text-muted mt-1">
//     <i className="fas fa-sticky-note me-1" />
//     {row.adminNotes.join(', ')}
//   </div>
// )}

//                   {!row.totalLateMinutes &&
//                    !row.totalEarlyLeaveMinutes &&
//                     !row.earlyArrivalMinutes &&
//                     !row.lateDepartureMinutes &&
//                     !row.totalTransitDeductionMinutes && (
//                       <span className="small text-muted">
//                         {t('noPenalties')}
//                       </span>
//                     )}
//                 </td>

//                 {/* Details */}
//                 <td className="text-center">
//                   <button
//                     className="btn btn-sm btn-outline-primary"
//                     // onClick={() => onOpenDetails(row)}
//                     onClick={() => {
//   if (!row.user?._id || !row.date) return;
//   onOpenDetails(row);
// }}

//                   >
//                     <i className="fas fa-eye" />
//                   </button>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default EmployeeAttendanceSummaryTable;

//2
// import { useTranslation } from 'react-i18next';

// const EmployeeAttendanceSummaryTable = ({ rows = [], loading, onOpenDetails }) => {
//   const { t } = useTranslation();

//   if (loading) {
//     return (
//       <div className="text-center py-5">
//         <div className="spinner-border text-primary" />
//       </div>
//     );
//   }

//   if (!Array.isArray(rows) || !rows.length) {
//     return (
//       <div className="text-center py-5 text-muted">
//         {t('noData')}
//       </div>
//     );
//   }

//   const renderDayStatus = (s) => {
//     const map = {
//       working: 'success',
//       holiday: 'info',
//       leave_paid: 'primary',
//       leave_unpaid: 'warning',
//       partial_leave: 'secondary',
//       absent: 'dark'
//     };
//     return (
//       <span className={`badge bg-${map[s] || 'light'} text-dark`}>
//         {t(s)}
//       </span>
//     );
//   };

//   return (
//     <div className="table-responsive">
//       <table className="table table-hover align-middle">
//         <thead className="table-primary">
//           <tr>
//             <th>{t('employee')}</th>
//             <th>{t('date')}</th>
//             <th>{t('branches')}</th>
//             <th>{t('dayStatus')}</th>
//             <th>{t('summary')}</th>
//             <th className="text-center">{t('details')}</th>
//           </tr>
//         </thead>

//         <tbody>
//           {rows.map(row => {
//             const dateObj = new Date(row.date);

//             return (
//               <tr key={row._id} className={row.allInvalid ? 'table-danger' : ''}>
//                 <td>
//                   <strong>{row.user?.name}</strong>
//                   <br />
//                   <small className="text-muted">{row.user?.email}</small>
//                 </td>

//                 <td>
//                   {dateObj.toLocaleDateString()}
//                   <br />
//                   <small className="text-muted">
//                     {dateObj.toLocaleString('en-US', { weekday: 'long' })}
//                   </small>
//                 </td>

//                 <td>
//                   {row.branchesVisited?.length ? (
//                     row.branchesVisited.map(b => (
//                       <div key={b.branch}>
//                         <i className="fas fa-building me-1" />
//                         {b.name}
//                         {b.invalidated && (
//                           <span className="badge bg-danger ms-2">!</span>
//                         )}
//                       </div>
//                     ))
//                   ) : (
//                     <span className="text-muted">— No attendance —</span>
//                   )}
//                 </td>

//                 <td>{renderDayStatus(row.dayStatus)}</td>

//                 <td>
//                   {row.firstCheckInTime && (
//                     <div>⏱ {t('firstIn')}: {new Date(row.firstCheckInTime).toLocaleTimeString()}</div>
//                   )}
//                   {row.lastCheckOutTime && (
//                     <div>🚪 {t('lastOut')}: {new Date(row.lastCheckOutTime).toLocaleTimeString()}</div>
//                   )}
//                   {row.totalLateMinutes > 0 && (
//                     <div className="text-warning">⏰ {row.totalLateMinutes} {t('minutes')}</div>
//                   )}
//                   {row.earlyArrivalMinutes > 0 && (
//                     <div className="text-success">⬆ {row.earlyArrivalMinutes} {t('minutes')}</div>
//                   )}
//                   {row.lateDepartureMinutes > 0 && (
//                     <div className="text-success">⬇ {row.lateDepartureMinutes} {t('minutes')}</div>
//                   )}
//                   {row.totalTransitDeductionMinutes > 0 && (
//                     <div className="text-danger">🛣 {row.totalTransitDeductionMinutes} {t('minutes')}</div>
//                   )}
//                 </td>

//                 <td className="text-center">
//                   <button
//                     className="btn btn-sm btn-outline-primary"
//                     onClick={() => onOpenDetails(row)}
//                   >
//                     <i className="fas fa-eye" />
//                   </button>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default EmployeeAttendanceSummaryTable;
