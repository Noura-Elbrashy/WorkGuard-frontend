

// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import {
//   setAttendancePolicyActive,
//   deleteAttendancePolicy
// } from '../../services/attendancePolicy.api';
// import Toast from '../ui/Toast';

// const AttendancePolicyTable = ({
//   policies = [],
//   loading,
//   onEdit,
//   onReload
// }) => {
//   const { t } = useTranslation();

//   const [confirmToast, setConfirmToast] = useState(null);
//   const [processingId, setProcessingId] = useState(null);

//   const renderTarget = (p) => {
//     if (p.scope === 'global') {
//       return t('attendancePolicy.allCompany');
//     }

//     if (p.scope === 'branch') {
//       return p.scopeId?.name || '-';
//     }

//     if (p.scope === 'role') {
//       return t(`roles.${p.role}`);
//     }

//     return '-';
//   };

//   /* =========================
//      Toggle Active (Request)
//   ========================= */
//   const requestToggle = (policy) => {
//     setConfirmToast({
//       type: 'toggle',
//       policy
//     });
//   };

//   /* =========================
//      Delete (Request)
//   ========================= */
//   const requestDelete = (policy) => {
//     setConfirmToast({
//       type: 'delete',
//       policy
//     });
//   };

//   /* =========================
//      Confirm Action
//   ========================= */
//   const confirmAction = async () => {
//     const { type, policy } = confirmToast;

//     try {
//       setProcessingId(policy._id);

//       if (type === 'toggle') {
//         await setAttendancePolicyActive(
//           policy._id,
//           !policy.active
//         );
//       }

//       if (type === 'delete') {
//         await deleteAttendancePolicy(policy._id);
//       }

//       await onReload();
//     } finally {
//       setProcessingId(null);
//       setConfirmToast(null);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="text-center py-4 text-muted">
//         {t('common.loading')}
//       </div>
//     );
//   }

//   return (
//     <>
//       <table className="table table-bordered table-hover align-middle">
//         <thead className="table-light">
//           <tr>
//             <th>{t('attendancePolicy.scope')}</th>
//             <th>{t('attendancePolicy.target')}</th>
//             <th>{t('attendancePolicy.grace')}</th>
//             <th>{t('attendancePolicy.rates')}</th>
//             <th>{t('attendancePolicy.absence')}</th>
//             <th>{t('attendancePolicy.status')}</th>
//             <th>{t('common.actions')}</th>
//           </tr>
//         </thead>

//         <tbody>
//           {policies.length === 0 && (
//             <tr>
//               <td colSpan="7" className="text-center text-muted">
//                 {t('attendancePolicy.noPolicies')}
//               </td>
//             </tr>
//           )}

//           {policies.map((p) => (
//             <tr key={p._id}>
//               {/* Scope */}
//               <td className="fw-bold">
//                 {t(`attendancePolicy.scope_${p.scope}`)}
//               </td>

//               {/* Target */}
//               <td>{renderTarget(p)}</td>

//               {/* Grace */}
//               <td>
//                 <div>
//                   {t('attendancePolicy.lateGrace')}:
//                   <strong> {p.grace?.lateMinutes || 0}</strong>{' '}
//                   {t('common.minutes')}
//                 </div>
//                 <div>
//                   {t('attendancePolicy.earlyGrace')}:
//                   <strong> {p.grace?.earlyLeaveMinutes || 0}</strong>{' '}
//                   {t('common.minutes')}
//                 </div>
//               </td>

//               {/* Rates */}
//               <td>
//                 <div>
//                   {t('attendancePolicy.lateRate')}:
//                   <strong> {p.rates?.latePerMinute || 0}</strong>
//                 </div>
//                 <div>
//                   {t('attendancePolicy.earlyRate')}:
//                   <strong> {p.rates?.earlyLeavePerMinute || 0}</strong>
//                 </div>
//                 <div>
//                   {t('attendancePolicy.transitRate')}:
//                   <strong> {p.rates?.transitPerMinute || 0}</strong>
//                 </div>
//               </td>

//               {/* Absence */}
//               <td>
//                 {!p.absence?.markDayAbsent && (
//                   <span>{t('attendancePolicy.noDeduction')}</span>
//                 )}

//                 {p.absence?.markDayAbsent && p.absence?.paid && (
//                   <span>{t('attendancePolicy.absencePaid')}</span>
//                 )}

//                 {p.absence?.markDayAbsent && !p.absence?.paid && (
//                   <span>
//                     {t('attendancePolicy.absenceDeduction')}:
//                     <strong> {p.absence.dayRate * 100}%</strong>
//                   </span>
//                 )}
//               </td>

//               {/* Status */}
//               <td>
//                 <span
//                   className={`badge ${
//                     p.active ? 'bg-success' : 'bg-secondary'
//                   }`}
//                 >
//                   {p.active
//                     ? t('common.active')
//                     : t('common.inactive')}
//                 </span>
//               </td>

//               {/* Actions */}
//               <td className="d-flex gap-1">
//                 <button
//                   className="btn btn-sm btn-outline-primary"
//                   onClick={() => onEdit(p)}
//                 >
//                   <i className="fas fa-edit" />
//                 </button>

//                 <button
//                   className="btn btn-sm btn-outline-warning"
//                   disabled={processingId === p._id}
//                   onClick={() => requestToggle(p)}
//                 >
//                   <i className="fas fa-power-off" />
//                 </button>

//                 <button
//                   className="btn btn-sm btn-outline-danger"
//                   disabled={processingId === p._id}
//                   onClick={() => requestDelete(p)}
//                 >
//                   <i className="fas fa-trash" />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* =========================
//           Confirmation Toast
//       ========================= */}
//       {confirmToast && (
//         <Toast
//           show={true}
//           type="warning"
//           message={
//             confirmToast.type === 'delete'
//               ? t('attendancePolicy.confirmDelete')
//               : confirmToast.policy.active
//               ? t('attendancePolicy.confirmDisable')
//               : t('attendancePolicy.confirmEnable')
//           }
//           confirmText={t('common.confirm')}
//           cancelText={t('common.cancel')}
//           onConfirm={confirmAction}
//           onClose={() => setConfirmToast(null)}
//         />
//       )}
//     </>
//   );
// };

// export default AttendancePolicyTable;





// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import {
//   setAttendancePolicyActive,
//   deleteAttendancePolicy
// } from '../../services/attendancePolicy.api';
// import Toast from '../ui/Toast';

// import '../../style/AttendancePoliciesPage.css';
// const AttendancePolicyTable = ({
//   policies = [],
//   loading,
//   onEdit,
//   onReload
// }) => {
//   const { t } = useTranslation();

//   const [confirmToast, setConfirmToast] = useState(null);
//   const [processingId, setProcessingId] = useState(null);

//   const renderTarget = (p) => {
//     if (p.scope === 'global') return t('attendancePolicy.allCompany');
//     if (p.scope === 'branch') return p.scopeId?.name || '-';
//     if (p.scope === 'role') return t(`roles.${p.role}`);
//     return '-';
//   };

//   /* =========================
//      Requests
//   ========================= */
//   const requestToggle = (policy) => {
//     setConfirmToast({ type: 'toggle', policy });
//   };

//   const requestDelete = (policy) => {
//     setConfirmToast({ type: 'delete', policy });
//   };

//   /* =========================
//      Confirm
//   ========================= */
//   const confirmAction = async () => {
//     const { type, policy } = confirmToast;

//     try {
//       setProcessingId(policy._id);

//       if (type === 'toggle') {
//         await setAttendancePolicyActive(
//           policy._id,
//           !policy.active
//         );
//       }

//       if (type === 'delete') {
//         await deleteAttendancePolicy(policy._id);
//       }

//       await onReload();
//     } finally {
//       setProcessingId(null);
//       setConfirmToast(null);
//     }
//   };

//   /* =========================
//      Loading / Empty
//   ========================= */
//   if (loading) {
//     return (
//       <div className="text-center py-5 text-muted">
//         {t('common.loading')}
//       </div>
//     );
//   }

//   if (!policies.length) {
//     return (
//       <div className="text-center py-5 text-muted">
//         {t('attendancePolicy.noPolicies')}
//       </div>
//     );
//   }

//   /* =========================
//      Cards UI
//   ========================= */
//   return (
//     <>
//       <div className="policies-grid">

//         {policies.map((p) => (
//           <div key={p._id} className="policy-col">
//             <div className="policy-card h-100">

//               {/* Header */}
//              <div className="policy-header d-flex justify-content-between align-items-center">

                
// <div className="d-flex align-items-center gap-2">
//   <div className="policy-icon">
//     <i
//       className={`fas ${
//         p.scope === 'global'
//           ? 'fa-globe'
//           : p.scope === 'branch'
//           ? 'fa-building'
//           : 'fa-user-shield'
//       }`}
//     />
//   </div>

//   <div>
//     <div className="policy-scope">
//       {t(`attendancePolicy.scope_${p.scope}`)}
//     </div>
//     <small className="policy-target">
//       {renderTarget(p)}
//     </small>
//   </div>
// </div>

//                 <span
//                   className={`badge ${
//                     p.active ? 'bg-success' : 'bg-secondary'
//                   }`}
//                 >
//                   {p.active
//                     ? t('common.active')
//                     : t('common.inactive')}
//                 </span>
//               </div>

//               {/* Body */}
//               <div className="policy-body small">


//                 <div className="mb-2">
//                   <strong>{t('attendancePolicy.grace')}</strong>
//                   <div>
//                     {t('attendancePolicy.lateGrace')}: {p.grace?.lateMinutes || 0} {t('common.minutes')}
//                   </div>
//                   <div>
//                     {t('attendancePolicy.earlyGrace')}: {p.grace?.earlyLeaveMinutes || 0} {t('common.minutes')}
//                   </div>
//                 </div>

//                 <div className="mb-2">
//                   <strong>{t('attendancePolicy.rates')}</strong>
//                   <div>{t('attendancePolicy.lateRate')}: {p.rates?.latePerMinute || 0}</div>
//                   <div>{t('attendancePolicy.earlyRate')}: {p.rates?.earlyLeavePerMinute || 0}</div>
//                   <div>{t('attendancePolicy.transitRate')}: {p.rates?.transitPerMinute || 0}</div>
//                 </div>

//                 <div>
//                   <strong>{t('attendancePolicy.absence')}</strong>
//                   <div>
//                     {!p.absence?.markDayAbsent && t('attendancePolicy.noDeduction')}
//                     {p.absence?.markDayAbsent && p.absence?.paid && t('attendancePolicy.absencePaid')}
//                     {p.absence?.markDayAbsent && !p.absence?.paid && (
//                       <>
//                         {t('attendancePolicy.absenceDeduction')}:{' '}
//                         <strong>{p.absence.dayRate * 100}%</strong>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Footer */}
//             <div className="policy-footer d-flex justify-content-end gap-2">

//                 <button
//                   className="btn btn-sm btn-outline-primary"
//                   onClick={() => onEdit(p)}
//                 >
//                   <i className="fas fa-edit" />
//                 </button>

//                 <button
//                   className="btn btn-sm btn-outline-warning"
//                   disabled={processingId === p._id}
//                   onClick={() => requestToggle(p)}
//                 >
//                   <i className="fas fa-power-off" />
//                 </button>

//                 <button
//                   className="btn btn-sm btn-outline-danger"
//                   disabled={processingId === p._id}
//                   onClick={() => requestDelete(p)}
//                 >
//                   <i className="fas fa-trash" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* =========================
//           Confirmation Toast
//       ========================= */}
//       {confirmToast && (
//         <Toast
//           show
//           type="warning"
//           message={
//             confirmToast.type === 'delete'
//               ? t('attendancePolicy.confirmDelete')
//               : confirmToast.policy.active
//               ? t('attendancePolicy.confirmDisable')
//               : t('attendancePolicy.confirmEnable')
//           }
//           confirmText={t('common.confirm')}
//           cancelText={t('common.cancel')}
//           onConfirm={confirmAction}
//           onClose={() => setConfirmToast(null)}
//         />
//       )}
//     </>
//   );
// };

// export default AttendancePolicyTable;
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  setAttendancePolicyActive,
  deleteAttendancePolicy,

} from '../../services/attendancePolicy.api';
import Toast from '../ui/Toast';
import ActivationHistoryModal from './ActivationHistoryModal';
import '../../style/AttendancePoliciesPage.css';

const AttendancePolicyTable = ({
  policies = [],
  loading,
  onEdit,
  onReload
}) => {
  const { t } = useTranslation();


  const [confirmToast, setConfirmToast] = useState(null);
  const [processingId, setProcessingId] = useState(null);
const [showHistory, setShowHistory] = useState(null);

  const renderTarget = (p) => {
    if (p.scope === 'global') return t('attendancePolicy.allCompany');
    if (p.scope === 'branch') return p.scopeId?.name || '-';
    if (p.scope === 'role') return t(`roles.${p.role}`);
    return '-';
  };

  /* =========================
     Requests
  ========================= */
  const requestToggle = (policy) => {
    setConfirmToast({ type: 'toggle', policy });
  };

  const requestDelete = (policy) => {
    setConfirmToast({ type: 'delete', policy });
  };

  /* =========================
     Confirm
  ========================= */
  const confirmAction = async () => {
    const { type, policy } = confirmToast;

    try {
      setProcessingId(policy._id);

      if (type === 'toggle') {
        await setAttendancePolicyActive(
          policy._id,
          !policy.active
        );
      }

      if (type === 'delete') {
        await deleteAttendancePolicy(policy._id);
      }

      await onReload();
    } finally {
      setProcessingId(null);
      setConfirmToast(null);
    }
  };

  /* =========================
     Loading / Empty
  ========================= */
  if (loading) {
    return (
      <div className="text-center py-5 text-muted">
        {t('common.loading')}
      </div>
    );
  }

  if (!policies.length) {
    return (
      <div className="text-center py-5 text-muted">
        {t('attendancePolicy.noPolicies')}
      </div>
    );
  }

  /* =========================
     Cards UI
  ========================= */
  return (
    <>
      <div className="policies-grid">
        {policies.map((p) => (
          <div key={p._id} className="policy-col">
            <div className="policy-card h-100">

              {/* ================= Header ================= */}
              <div className="policy-header d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <div className="policy-icon">
                    <i
                      className={`fas ${
                        p.scope === 'global'
                          ? 'fa-globe'
                          : p.scope === 'branch'
                          ? 'fa-building'
                          : 'fa-user-shield'
                      }`}
                    />
                  </div>

                  <div>
                    <div className="policy-scope">
                      {t(`attendancePolicy.scope_${p.scope}`)}
                    </div>
                    <small className="policy-target">
                      {renderTarget(p)}
                    </small>
                  </div>
                </div>

                {/* ⛔️ الألوان زي ما هي */}
                <span
                  className={`badge ${
                    p.active ? 'bg-success' : 'bg-secondary'
                  }`}
                >
                  {p.active
                    ? t('common.active')
                    : t('common.inactive')}
                </span>
              </div>

              {/* ================= Body ================= */}
              <div className="policy-body small">

                {/* Grace */}
                <div className="policy-section">
                  <div className="section-title">
                    <i className="fas fa-clock me-2"></i>
                    {t('attendancePolicy.grace')}
                  </div>

                  <div className="info-item">
                    {t('attendancePolicy.lateGrace')}:
                    <strong> {p.grace?.lateMinutes || 0}</strong>{' '}
                    {t('common.minutes')}
                  </div>

                  <div className="info-item">
                    {t('attendancePolicy.earlyGrace')}:
                    <strong> {p.grace?.earlyLeaveMinutes || 0}</strong>{' '}
                    {t('common.minutes')}
                  </div>
                </div>

                {/* Rates */}
                <div className="policy-section">
                  <div className="section-title">
                    <i className="fas fa-percentage me-2"></i>
                    {t('attendancePolicy.rates')}
                  </div>

                  <div className="rate-item rate-late">
                    {t('attendancePolicy.lateRate')}
                    <strong>{p.rates?.latePerMinute || 0}</strong>
                  </div>

                  <div className="rate-item rate-early">
                    {t('attendancePolicy.earlyRate')}
                    <strong>{p.rates?.earlyLeavePerMinute || 0}</strong>
                  </div>

                  <div className="rate-item rate-transit">
                    {t('attendancePolicy.transitRate')}
                    <strong>{p.rates?.transitPerMinute || 0}</strong>
                  </div>
                </div>

                {/* Absence */}
                {/* <div className="policy-section">
                  <div className="section-title">
                    <i className="fas fa-user-times me-2"></i>
                    {t('attendancePolicy.absence')}
                  </div>

                  <div className="absence-info">
                    {!p.absence?.markDayAbsent && (
                      <span>
                        <i className="fas fa-check-circle me-1"></i>
                        {t('attendancePolicy.noDeduction')}
                      </span>
                    )}

                    {p.absence?.markDayAbsent && p.absence?.paid && (
                      <span>
                        <i className="fas fa-dollar-sign me-1"></i>
                        {t('attendancePolicy.absencePaid')}
                      </span>
                    )}

                    {p.absence?.markDayAbsent && !p.absence?.paid && (
                      <span>
                        <i className="fas fa-exclamation-triangle me-1"></i>
                        {t('attendancePolicy.absenceDeduction')}:
                        <strong> {p.absence.dayRate * 100}%</strong>
                      </span>
                    )}
                  </div>
                </div> */}

<div className="policy-section">
  <div className="section-title">
    <i className="fas fa-user-times me-2"></i>
    {t('attendancePolicy.absence')}
  </div>

  <div className="absence-info">
    {/* حالة 1: مفيش خصم خالص */}
    {!p.absence?.deductSalary && (
      <span className="text-success">
        <i className="fas fa-check-circle me-1"></i>
        {t('attendancePolicy.noDeduction') || 'No Deduction'}
      </span>
    )}

    {/* حالة 2: فيه خصم بس مدفوع */}
    {p.absence?.deductSalary && p.absence?.paid && (
      <span className="text-info">
        <i className="fas fa-dollar-sign me-1"></i>
        {t('attendancePolicy.absencePaid') || 'Paid Absence'}
      </span>
    )}

    {/* حالة 3: فيه خصم وغير مدفوع (هنا بيظهر النسبة) */}
    {p.absence?.deductSalary && !p.absence?.paid && (
      <span className="text-danger">
        <i className="fas fa-exclamation-triangle me-1"></i>
        {t('attendancePolicy.absenceDeduction') || 'Deduction'}:
        <strong className="ms-1">
          {((p.absence.dayRate || 1) * 100).toFixed(0)}%
        </strong>
        {' ' + (t('attendancePolicy.ofDailySalary') || 'of daily salary')}
      </span>
    )}
  </div>
</div>
              </div>

              {/* ================= Footer ================= */}
              <div className="policy-footer d-flex justify-content-end gap-2">

                  <button
    className="btn btn-sm btn-outline-secondary"
    onClick={() => setShowHistory(p)}
    title={t('attendancePolicy.history')}
  >
    <i className="fas fa-history" />
  </button>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => onEdit(p)}
                >
                  <i className="fas fa-edit" />
                </button>

                <button
                  className="btn btn-sm btn-outline-warning"
                  disabled={processingId === p._id}
                  onClick={() => requestToggle(p)}
                >
                  <i className="fas fa-power-off" />
                </button>

                <button
                  className="btn btn-sm btn-outline-danger"
                  disabled={processingId === p._id}
                  onClick={() => requestDelete(p)}
                >
                  <i className="fas fa-trash" />
                </button>

        
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* ================= Confirmation Toast ================= */}
      {confirmToast && (
        <Toast
          show
          type="warning"
          message={
            confirmToast.type === 'delete'
              ? t('attendancePolicy.confirmDelete')
              : confirmToast.policy.active
              ? t('attendancePolicy.confirmDisable')
              : t('attendancePolicy.confirmEnable')
          }
          confirmText={t('common.confirm')}
          cancelText={t('common.cancel')}
          onConfirm={confirmAction}
          onClose={() => setConfirmToast(null)}
        />
      )}
{showHistory && (
  <ActivationHistoryModal
    show
    policy={showHistory}
    onClose={() => setShowHistory(null)}
  />
)}

    </>
  );
};

export default AttendancePolicyTable;
