
// import { useParams } from 'react-router-dom';

// import { useEffect, useState, useCallback } from 'react';
// import { useTranslation } from 'react-i18next';

// import {
//   getUserLeaveYear,
//   getUserLeaveSummary,
//   getAllLeaves
// } from '../../components/leave/services/leave.api';

// import {
//   getMonthlyAbsence
// } from '../../services/attendance.api';

// import LeaveBalanceSummary from '../../components/leave/components/LeaveBalanceSummary';
// import LeaveStatusBadge from '../../components/leave/components/LeaveStatusBadge';
// import Toast from '../../components/ui/Toast';
// import AbsenceDetailsModal from '../../components/attendance/absence/AbsenceDetailsModal';
// /**
//  * ======================================================
//  * EmployeeLeaveProfile
//  * ======================================================
//  * - Admin analytical view ONLY
//  * - Read-only (no approve / reject here)
//  * - Year-based snapshot (UserLeaveYear)
//  * - Absence details loaded on demand (Monthly)
//  */
// function EmployeeLeaveProfile() {
//      const { userId } = useParams();
//   const isAdmin = true; 
//   const { t } = useTranslation();

//   /* ======================
//      Base State
//   ====================== */
//   const currentYear = new Date().getFullYear();
//   const currentMonth = new Date().getMonth() + 1;

//   const [year, setYear] = useState(currentYear);
//   const [month, setMonth] = useState(currentMonth);

//   const [summary, setSummary] = useState(null);
//   const [leaveYear, setLeaveYear] = useState(null);
//   const [leaves, setLeaves] = useState([]);

//   const [loading, setLoading] = useState(true);

//   /* ======================
//      Absence (on-demand)
//   ====================== */
//   const [absenceMonth, setAbsenceMonth] = useState(null);
//   const [absenceLoading, setAbsenceLoading] = useState(false);
//   const [showAbsenceDetails, setShowAbsenceDetails] = useState(false);

//   /* ======================
//      Toast
//   ====================== */
//   const [toast, setToast] = useState({
//     show: false,
//     message: '',
//     type: 'success'
//   });

//   const showToast = (message, type = 'success') =>
//     setToast({ show: true, message, type });

//   const closeToast = () =>
//     setToast(t => ({ ...t, show: false }));

//   /* ======================
//      Load Profile Snapshot
//   ====================== */
//   const loadProfile = useCallback(async () => {
//     if (!userId) return;

//     try {
//       setLoading(true);

//       const [
//         summaryRes,
//         yearRes,
//         leavesRes
//       ] = await Promise.all([
//         getUserLeaveSummary({ userId, year }),
//         getUserLeaveYear({ userId, year }),
//         getAllLeaves({ userId, page: 1, limit: 50 })
//       ]);

//       setSummary(summaryRes.data || null);
//       setLeaveYear(yearRes.data?.exists ? yearRes.data : null);
//       setLeaves(leavesRes.data?.leaves || []);

//     } catch (err) {
//       showToast(
//         err?.response?.data?.message ||
//         t('error.loadFailed'),
//         'error'
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [userId, year, t]);

//   useEffect(() => {
//     loadProfile();
//   }, [loadProfile]);

//   /* ======================
//      Load Monthly Absence
//   ====================== */
//   const loadMonthlyAbsence = async () => {
//     if (!isAdmin) return;

//     try {
//       setAbsenceLoading(true);

//       const res = await getMonthlyAbsence({
//         userId,
//         year,
//         month
//       });

//       setAbsenceMonth(res.data);
//       setShowAbsenceDetails(true);

//     } catch (err) {
//       showToast(
//         err?.response?.data?.message ||
//         t('error.loadFailed'),
//         'error'
//       );
//     } finally {
//       setAbsenceLoading(false);
//     }
//   };

//   /* ======================
//      Derived Values
//   ====================== */
//   const unpaidAbsenceDays =
//     leaveYear?.unpaid?.absentDays || 0;

//   const unpaidLeaveDays =
//     leaveYear?.unpaid?.unpaidLeaveDays || 0;

//   /* ======================
//      UI
//   ====================== */
//   if (loading) {
//     return (
//       <div className="text-center py-5">
//         {t('loading')}...
//       </div>
//     );
//   }

//   return (
//     <div className="container py-4">

//       {/* ================= Header ================= */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h4 className="fw-semibold mb-1">
//             {t('employee.leaveProfile')}
//           </h4>
//           <div className="text-muted small">
//             {t('employee.leaveProfileDesc')}
//           </div>
//         </div>

//         {/* Year Selector */}
//         <select
//           className="form-select w-auto"
//           value={year}
//           onChange={e => setYear(Number(e.target.value))}
//         >
//           {[currentYear, currentYear - 1, currentYear - 2].map(y => (
//             <option key={y} value={y}>{y}</option>
//           ))}
//         </select>
//       </div>

//       {/* ================= Leave Balance ================= */}
//       {summary && (
//         <LeaveBalanceSummary summary={summary} />
//       )}

//       {/* ================= Absence Controls (Admin) ================= */}
//       {isAdmin && (
//         <div className="d-flex gap-2 mb-3">
//           <select
//             className="form-select w-auto"
//             value={month}
//             onChange={e => setMonth(Number(e.target.value))}
//           >
//             {Array.from({ length: 12 }).map((_, i) => (
//               <option key={i + 1} value={i + 1}>
//                 {t(`months.${i + 1}`)}
//               </option>
//             ))}
//           </select>

//           <button
//             className="btn btn-outline-danger"
//             disabled={absenceLoading}
//             onClick={loadMonthlyAbsence}
//           >
//             {t('attendance.absenceDetails')}
//           </button>
//         </div>
//       )}

//       {/* ================= Absence Summary ================= */}
//       <div className="row g-3 mb-4">
//         <div className="col-md-6">
//           <div className="card border-warning h-100">
//             <div className="card-body">
//               <h6 className="fw-semibold text-warning mb-2">
//                 {t('leave.unpaidLeave')}
//               </h6>
//               <div className="fs-4 fw-bold">
//                 {unpaidLeaveDays}
//               </div>
//               <div className="text-muted small">
//                 {t('leave.unpaidLeaveDesc')}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-6">
//           <div className="card border-danger h-100">
//             <div className="card-body">
//               <h6 className="fw-semibold text-danger mb-2">
//                 {t('leave.absence')}
//               </h6>
//               <div className="fs-4 fw-bold">
//                 {unpaidAbsenceDays}
//               </div>
//               <div className="text-muted small">
//                 {t('leave.absenceDesc')}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ================= Leave Requests (Read-only) ================= */}
//       <div className="card shadow-sm">
//         <div className="card-header fw-semibold">
//           {t('leave.requests')}
//         </div>

//         <div className="table-responsive">
//           <table className="table table-sm table-bordered mb-0">
//             <thead className="table-light">
//               <tr>
//                 <th>{t('leave.type')}</th>
//                 <th>{t('leave.from')}</th>
//                 <th>{t('leave.to')}</th>
//                 <th>{t('leave.days')}</th>
//                 <th>{t('leave.status')}</th>
//                 <th>{t('actions')}</th>
//               </tr>
//             </thead>
//             <tbody>
//               {leaves.map(l => (
//                 <tr key={l._id}>
//                   <td>{t(`leave.types.${l.leaveType}`)}</td>
//                   <td>{new Date(l.startDate).toLocaleDateString()}</td>
//                   <td>{new Date(l.endDate).toLocaleDateString()}</td>
//                   <td>{l.totalDays}</td>
//                   <td>
//                     <LeaveStatusBadge status={l.status} />
//                   </td>
//                   <td>
//                     <button
//                       className="btn btn-sm btn-outline-primary"
//                       onClick={() =>
//                         window.open(`/leaves/${l._id}`, '_blank')
//                       }
//                     >
//                       {t('details')}
//                     </button>
//                   </td>
//                 </tr>
//               ))}

//               {!leaves.length && (
//                 <tr>
//                   <td colSpan="6" className="text-center text-muted">
//                     {t('leave.noData')}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ================= Toast ================= */}
//       <Toast
//         {...toast}
//         onClose={closeToast}
//       />
//     </div>
//   );
// }

// export default EmployeeLeaveProfile;




import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/* ===================== Hooks ===================== */
import useLeaveProfileSnapshot from '../../components/leave/hooks/useLeaveProfileSnapshot';

/* ===================== UI ===================== */
import LeaveBalanceSummary from '../../components/leave/components/LeaveBalanceSummary';
import LeaveRequestsTable from '../../components/leave/profile/LeaveRequestsTable';
import AbsenceDetailsModal from '../../components/attendance/absence/AbsenceDetailsModal';
import Toast from '../../components/ui/Toast';
import LeaveTabs from '../../components/leave/profile/LeaveTabs';

function EmployeeLeaveProfile() {
  const { userId } = useParams();
  const { t } = useTranslation();
  const isAdmin = true;

  /* ======================
     Filters (UI state)
  ====================== */
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [activeTab, setActiveTab] = useState('summary');

  /* ======================
     Snapshot (THE SOURCE)
  ====================== */
  const {
    loading,
    error,

    summary,
    leaveYear,

    leaves,
    page,
    pages,
    setPage,

    absenceMonth,

    refresh
  } = useLeaveProfileSnapshot({
    userId,
    year,
    month,
    isAdmin,
    activeTab
  });

  /* ======================
     Toast
  ====================== */
  const [toast, setToast] = useState(null);

  if (loading) {
    return <div className="text-center py-5">{t('loading')}...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
      </div>
    );
  }

  return (
    <div className="container py-4">

      {/* ================= Header ================= */}
      <div className="d-flex justify-content-between mb-4">
        <div>
          <h4>{t('employee.leaveProfile')}</h4>
          <div className="text-muted small">
            {t('employee.leaveProfileDesc')}
          </div>
        </div>

        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={year}
            onChange={e => setYear(Number(e.target.value))}
          >
            {[0, 1, 2].map(i => {
              const y = today.getFullYear() - i;
              return <option key={y} value={y}>{y}</option>;
            })}
          </select>

          <select
            className="form-select"
            value={month}
            onChange={e => setMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {t(`months.${i + 1}`)}
              </option>
            ))}
          </select>
        </div>
      </div>
<LeaveTabs
  active={activeTab}
  onChange={setActiveTab}
/>

      {/* ================= Summary ================= */}
      {activeTab === 'summary' && summary && (
  <LeaveBalanceSummary summary={summary} />
)}


      {/* ================= Requests ================= */}
  {activeTab === 'requests' && (
  <LeaveRequestsTable
    leaves={leaves}
    loading={loading}
    page={page}
    pages={pages}
    onPageChange={setPage}
    onViewDetails={(id) =>
      window.open(`/leaves/${id}`, '_blank')
    }
  />
)}



      {/* ================= Absence ================= */}
     <AbsenceDetailsModal
  show={activeTab === 'absence'}
  data={absenceMonth}
  year={year}
  month={month}
  onClose={() => setActiveTab('summary')}
/>

      {toast && (
        <Toast {...toast} onClose={() => setToast(null)} />
      )}
    </div>
  );
}

export default EmployeeLeaveProfile;
