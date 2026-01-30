
//0old 
// import { useTranslation } from 'react-i18next';

// /* ======================================
//    Helpers
// ====================================== */
// const getStatusBadge = (status, t) => {
//   const map = {
//     working: 'success',
//     holiday: 'info',
//     leave_paid: 'primary',
//     leave_unpaid: 'warning',
//     partial_leave: 'secondary',
//     absent: 'danger',
//     weekend: 'light',
//     invalid: 'dark'
//   };

//   return (
//     <span className={`badge bg-${map[status] || 'secondary'}`}>
//       {t(status)}
//     </span>
//   );
// };

// /* ======================================
//    Component
// ====================================== */
// function UserAttendanceSummaryTable({
//   days = [],
//   loading = false,
//   isAdmin = false,
//   onOpenDetails
// }) {
//   const { t } = useTranslation();

//   /* ---------- Loading ---------- */
//   if (loading) {
//     return (
//       <div className="text-center py-5">
//         <div className="spinner-border text-primary" />
//       </div>
//     );
//   }

//   /* ---------- Empty ---------- */
//   if (!Array.isArray(days) || days.length === 0) {
//     return (
//       <div className="text-center py-5 text-muted">
//         <i className="fas fa-calendar-times mb-2" />
//         <div>{t('noData')}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="card shadow-sm border-0">
//       <div className="card-header bg-white fw-semibold">
//         <i className="fas fa-calendar-check me-2 text-primary" />
//         {t('attendanceDetails')}
//       </div>

//       <div className="table-responsive">
//         <table className="table table-hover align-middle mb-0">
//           <thead className="table-light">
//             <tr>
//               <th>{t('date')}</th>
//               <th>{t('day')}</th>
//               <th>{t('status')}</th>
//               <th>{t('late')}</th>
//               <th>{t('earlyLeave')}</th>
//               <th>{t('transit')}</th>
//               <th className="text-center">{t('details')}</th>
//             </tr>
//           </thead>

//           <tbody>
//             {days.map(day => {
//               const dateObj = new Date(day.date);

//               return (
//                 <tr key={day.date}>
//                   {/* Date */}
//                   <td>
//                     {dateObj.toLocaleDateString()}
//                   </td>

//                   {/* Weekday */}
//                   <td className="text-muted">
//                     {t(day.weekday.toLowerCase())}
//                   </td>

//                   {/* Status */}
//                   <td>
//                     {getStatusBadge(day.dayType, t)}
//                   </td>

//                   {/* Late */}
//                   <td>
//                     {day.lateMinutes > 0 ? (
//                       <span className="text-warning fw-semibold">
//                         {day.lateMinutes} {t('minutes')}
//                       </span>
//                     ) : (
//                       '—'
//                     )}
//                   </td>

//                   {/* Early Leave */}
//                   <td>
//                     {day.earlyLeaveMinutes > 0 ? (
//                       <span className="text-danger fw-semibold">
//                         {day.earlyLeaveMinutes} {t('minutes')}
//                       </span>
//                     ) : (
//                       '—'
//                     )}
//                   </td>

//                   {/* Transit */}
//                   <td>
//                     {day.transitDeductionMinutes > 0 ? (
//                       <span className="text-danger fw-semibold">
//                         {day.transitDeductionMinutes} {t('minutes')}
//                       </span>
//                     ) : (
//                       '—'
//                     )}
//                   </td>

//                   {/* Actions */}
//                   <td className="text-center">
//                     <button
//                       className="btn btn-sm btn-outline-primary"
//                       onClick={() =>
//                         onOpenDetails &&
//                         onOpenDetails({
//                           date: day.date,
//                           dayType: day.dayType
//                         })
//                       }
//                     >
//                       <i className="fas fa-eye" />
//                     </button>

//                     {isAdmin && (
//                       <button
//                         className="btn btn-sm btn-outline-secondary ms-2"
//                         title={t('edit')}
//                         onClick={() =>
//                           onOpenDetails &&
//                           onOpenDetails({
//                             date: day.date,
//                             editMode: true
//                           })
//                         }
//                       >
//                         <i className="fas fa-edit" />
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default UserAttendanceSummaryTable;
//===============================================================
// //1
// import { useTranslation } from 'react-i18next';

// /* ======================================
//    Helpers
// ====================================== */
// const getStatusBadge = (status, t) => {
//   const map = {
//     working: { color: 'success', icon: '🟢' },
//     holiday: { color: 'info', icon: '🎉' },
//     leave_paid: { color: 'primary', icon: '🏖️' },
//     leave_unpaid: { color: 'warning', icon: '⚠️' },
//     partial_leave: { color: 'secondary', icon: '🌓' },
//     absent: { color: 'danger', icon: '❌' }
//   };

//   const cfg = map[status] || { color: 'secondary', icon: '❔' };

//   return (
//     <span className={`badge bg-${cfg.color}`}>
//       {cfg.icon} {t(status)}
//     </span>
//   );
// };

// /* ======================================
//    Component
// ====================================== */
// function UserAttendanceSummaryTable({
//   days = [],
//   loading = false,
//   isAdmin = false,
//   onOpenDetails
// }) {
//   const { t } = useTranslation();

//   /* ---------- Loading ---------- */
//   if (loading) {
//     return (
//       <div className="text-center py-5">
//         <div className="spinner-border text-primary" />
//       </div>
//     );
//   }

//   /* ---------- Empty ---------- */
//   if (!Array.isArray(days) || days.length === 0) {
//     return (
//       <div className="text-center py-5 text-muted">
//         <i className="fas fa-calendar-times fs-4 mb-2" />
//         <div>{t('noData')}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="card shadow-sm border-0 mt-3">
//       <div className="card-header bg-white fw-semibold d-flex align-items-center">
//         <i className="fas fa-calendar-check me-2 text-primary" />
//         {t('attendanceDetails')}
//       </div>

//       <div className="table-responsive">
//         <table className="table table-hover align-middle mb-0">
//           <thead className="table-light">
//             <tr>
//               <th>{t('date')}</th>
//               <th>{t('day')}</th>
//               <th>{t('status')}</th>
//               <th className="text-center">⏰ {t('late')}</th>
//               <th className="text-center">🚪 {t('earlyLeave')}</th>
//               <th className="text-center">🚕 {t('transit')}</th>
//               <th className="text-center">👁️</th>
//             </tr>
//           </thead>

//           <tbody>
//             {days.map(day => {
//               const dateObj = new Date(day.date);

//               return (
//                 <tr key={day.date}>
//                   {/* Date */}
//                   <td className="fw-semibold">
//                     {dateObj.toLocaleDateString()}
//                   </td>

//                   {/* Weekday */}
//                   <td className="text-muted">
//                     {t(day.weekday)}
//                   </td>

//                   {/* Status */}
//                   <td>
//   {getStatusBadge(day.dayType, t)}
//   {day.adminNote && (
//     <div className="text-muted small mt-1">
//       <i className="fas fa-info-circle me-1" />
//       {day.adminNote}
//     </div>
//   )}
// </td>


//                   {/* Late */}
//                   <td className="text-center">
//                     {day.lateMinutes > 0 ? (
//                       <span className="text-warning fw-semibold">
//                         {day.lateMinutes} {t('minutes')}
//                       </span>
//                     ) : '—'}
//                   </td>

//                   {/* Early Leave */}
//                   <td className="text-center">
//                     {day.earlyLeaveMinutes > 0 ? (
//                       <span className="text-danger fw-semibold">
//                         {day.earlyLeaveMinutes} {t('minutes')}
//                       </span>
//                     ) : '—'}
//                   </td>

//                   {/* Transit */}
//                   <td className="text-center">
//                     {day.transitDeductionMinutes > 0 ? (
//                       <span className="text-danger fw-semibold">
//                         {day.transitDeductionMinutes} {t('minutes')}
//                       </span>
//                     ) : '—'}
//                   </td>

//                   {/* Actions */}
//                   <td className="text-center">
//                     <button
//                       className="btn btn-sm btn-outline-primary"
//                       title={t('view')}
//                       onClick={() =>
//                         onOpenDetails?.({
//                           date: day.date,
//                           editMode: false
//                         })
//                       }
//                     >
//                       <i className="fas fa-eye" />
//                     </button>

//                     {isAdmin && (
//                       <button
//                         className="btn btn-sm btn-outline-secondary ms-2"
//                         title={t('edit')}
//                         onClick={() =>
//                           onOpenDetails?.({
//                             date: day.date,
//                             editMode: true
//                           })
//                         }
//                       >
//                         <i className="fas fa-edit" />
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default UserAttendanceSummaryTable;


import { useTranslation } from 'react-i18next';

function UserAttendanceSummaryTable({
  days = [],
  loading = false,
  onOpenDetails
}) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!Array.isArray(days) || days.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        {t('noData')}
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-primary">
          <tr>
            <th>{t('date')}</th>
            <th>{t('branches')}</th>
            <th>{t('dayStatus')}</th>
            <th>{t('summary')}</th>
            <th className="text-center">👁️</th>
          </tr>
        </thead>

        <tbody>
          {days.map(day => {
            const dateObj = new Date(day.date);

            const hasPenalty =
              day.lateMinutes > 0 ||
              day.earlyLeaveMinutes > 0 ||
              day.transitDeductionMinutes > 0;

            const hasBonus =
              day.earlyArrivalMinutes > 0 ||
              day.lateDepartureMinutes > 0;

            return (
              <tr key={day.date}>
                {/* Date */}
                <td>
                  {dateObj.toLocaleDateString()}
                  <br />
                  <small className="text-muted">
                    {t(day.weekday)}
                  </small>
                </td>

                {/* Branches */}
                <td>
                  {day.branchesVisited?.length ? (
                    day.branchesVisited.map(b => (
                      <div key={b.branch} className="d-flex align-items-center">
                        <i className="fas fa-building text-secondary me-2" />
                        <span>{b.name}</span>
                        {b.hasInvalid && (
                          <i
                            className="fas fa-exclamation-circle text-danger ms-2"
                            title="Invalidated attendance"
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>

                {/* Day Status */}
                <td>
                  <span
                    className={`badge bg-${
                      day.dayType === 'working'
                        ? 'success'
                        : day.dayType === 'holiday'
                        ? 'info'
                        : day.dayType === 'leave_paid'
                        ? 'primary'
                        : day.dayType === 'leave_unpaid'
                        ? 'warning'
                        : day.dayType === 'partial_leave'
                        ? 'secondary'
                        : 'dark'
                    }`}
                  >
                    {day.dayType === 'working' && '🟢'}
                    {day.dayType === 'holiday' && '🎉'}
                    {day.dayType === 'leave_paid' && '🏖️'}
                    {day.dayType === 'leave_unpaid' && '⚠️'}
                    {day.dayType === 'partial_leave' && '🌓'}
                    {day.dayType === 'absent' && '❌'}{' '}
                    {t(day.dayType)}
                  </span>

                  {day.adminNote && (
                    <div className="small text-muted mt-1">
                      <i className="fas fa-info-circle me-1" />
                      {day.adminNote}
                    </div>
                  )}
                </td>

                {/* Summary */}
                <td>
                  {day.firstCheckInTime && (
                    <div className="small">
                      <strong>{t('firstIn')}:</strong>{' '}
                      {new Date(day.firstCheckInTime).toLocaleTimeString()}
                    </div>
                  )}

                  {day.lastCheckOutTime && (
                    <div className="small">
                      <strong>{t('lastOut')}:</strong>{' '}
                      {new Date(day.lastCheckOutTime).toLocaleTimeString()}
                    </div>
                  )}

                  {day.lateMinutes > 0 && (
                    <div className="small text-warning">
                      ⏰ {t('late')}: {day.lateMinutes} {t('minutes')}
                    </div>
                  )}

                  {day.earlyLeaveMinutes > 0 && (
                    <div className="small text-danger">
                      🚪 {t('earlyLeave')}: {day.earlyLeaveMinutes} {t('minutes')}
                    </div>
                  )}

                  {day.earlyArrivalMinutes > 0 && (
                    <div className="small text-success">
                      ⬅️ {t('earlyArrival')}: {day.earlyArrivalMinutes} {t('minutes')}
                    </div>
                  )}

                  {day.lateDepartureMinutes > 0 && (
                    <div className="small text-success">
                      ➡️ {t('lateDeparture')}: {day.lateDepartureMinutes} {t('minutes')}
                    </div>
                  )}

                  {day.transitDeductionMinutes > 0 && (
                    <div className="small text-danger">
                      🚕 {t('transitDeduction')}: {day.transitDeductionMinutes} {t('minutes')}
                    </div>
                  )}

                  {!hasPenalty && !hasBonus && (
                    <span className="small text-muted">
                      {t('noPenalties')}
                    </span>
                  )}
                </td>

                {/* Details */}
                <td className="text-center">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onOpenDetails?.({ date: day.date })}
                  >
                    <i className="fas fa-eye" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default UserAttendanceSummaryTable;
