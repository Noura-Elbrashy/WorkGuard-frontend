// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';

// import {
//   getLeaveById,
//   getLeaveBreakdown,
//   approveLeave,
//   rejectLeave,
//   cancelLeave,
//   // getLeaveSummary
// } from '../../components/leave/services/leave.api';

// import LeaveStatusBadge from '../../components/leave/components/LeaveStatusBadge';
// import Toast from '../../components/ui/Toast';
// import LeaveBalanceSummary from '../../components/leave/components/LeaveBalanceSummary';
// /**
//  * ================================
//  * DetailsLeavePage
//  * ================================
//  * - Read-only view for leave details
//  * - Admin can approve / reject / cancel
//  * - Employee can view breakdown only
//  * - All rules enforced by backend
//  */
// function DetailsLeavePage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { t } = useTranslation();

//   const [leave, setLeave] = useState(null);
//   const [breakdown, setBreakdown] = useState([]);
//   const [loading, setLoading] = useState(true);
// const [summary, setSummary] = useState(null);

//   const [toast, setToast] = useState({
//     show: false,
//     message: '',
//     type: 'success',
//     onConfirm: null
//   });

//   const showToast = (message, type = 'success') =>
//     setToast({ show: true, message, type, onConfirm: null });

//   const closeToast = () =>
//     setToast(t => ({ ...t, show: false, onConfirm: null }));

//   /* ======================
//      Load leave + breakdown
//   ====================== */
//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);

//         const leaveRes = await getLeaveById(id);
//         const breakdownRes = await getLeaveBreakdown(id);
//         const summaryRes = await getLeaveSummary(id);

//         setSummary(summaryRes.data.summary);
//         setLeave(leaveRes.data.leave);
//         setBreakdown(breakdownRes.data.breakdown || []);
//       } catch {
//         showToast(t('leave.loadError'), 'error');
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [id]);

//   /* ======================
//      Admin actions
//   ====================== */
//   const handleApprove = async () => {
//     try {
//       await approveLeave(id);
//       showToast(t('leave.toastApproved'));
//       navigate(0);
//     } catch {
//       showToast(t('leave.toastError'), 'error');
//     }
//   };

//   const handleReject = async () => {
//     const reason = prompt(t('leave.rejectReason'));
//     if (!reason) return;

//     try {
//       await rejectLeave(id, reason);
//       showToast(t('leave.toastRejected'));
//       navigate(0);
//     } catch {
//       showToast(t('leave.toastError'), 'error');
//     }
//   };

//   const handleCancel = async () => {
//     setToast({
//       show: true,
//       type: 'warning',
//       message: t('leave.confirmCancel'),
//       onConfirm: async () => {
//         try {
//           await cancelLeave(id);
//           showToast(t('leave.toastCancelled'));
//           navigate('/leaves');
//         } catch {
//           showToast(t('leave.toastError'), 'error');
//         }
//       }
//     });
//   };

//   if (loading) {
//     return <div className="text-center p-5">{t('loading')}...</div>;
//   }

//   if (!leave) return null;

//   const isFutureLeave =
//     new Date(leave.startDate).getTime() > Date.now();

//   return (
//     <div className="container py-4">

//       {/* ================= Header ================= */}
//       <div className="mb-4">
//         <div className="d-flex justify-content-between align-items-start">
//           <div>
//             <h4 className="fw-semibold mb-1">
//               <i className="fa-solid fa-calendar-check me-2 text-primary" />
//               {t('leave.details.title')}
//             </h4>
//             <div className="text-muted small">
//               {t('leave.details.subtitle')}
//             </div>
//           </div>

//           <LeaveStatusBadge status={leave.status} />
//         </div>
//       </div>

//       {/* ================= Summary ================= */}
//       <div className="card mb-4 shadow-sm">
//         <div className="card-body row g-3">

//           <div className="col-md-3">
//             <strong>{t('leave.type')}</strong>
//             <div>{t(`leave.types.${leave.leaveType}`)}</div>
//           </div>

//           <div className="col-md-3">
//             <strong>{t('leave.from')}</strong>
//             <div>{new Date(leave.startDate).toLocaleDateString()}</div>
//           </div>

//           <div className="col-md-3">
//             <strong>{t('leave.to')}</strong>
//             <div>{new Date(leave.endDate).toLocaleDateString()}</div>
//           </div>

//           <div className="col-md-3">
//             <strong>{t('leave.totalDays')}</strong>
//             <div>{leave.totalDays}</div>
//           </div>

//           {leave.reason && (
//             <div className="col-12">
//               <div className="alert alert-light mb-0">
//                 <i className="fa-solid fa-message me-2" />
//                 {leave.reason}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* // ================= Leave Balance Summary ================= */ }
// <LeaveBalanceSummary summary={summary} />

//       {/* ================= Breakdown ================= */}
//       <div className="card shadow-sm mb-4">
//         <div className="card-header fw-semibold">
//           {t('leave.breakdown')}
//         </div>

//         <div className="table-responsive">
//           <table className="table table-sm table-bordered mb-0">
//             <thead className="table-light">
//               <tr>
//                 <th>{t('date')}</th>
//                 <th>{t('leave.status')}</th>
//                 <th>{t('leave.attendance')}</th>
//                 <th>{t('leave.holiday')}</th>
//               </tr>
//             </thead>

//             <tbody>
//               {breakdown.map(day => (
//                 <tr key={day.iso}>
//                   <td>{day.iso}</td>
//                   <td>
//                     <LeaveStatusBadge status={day.appliedStatus} />
//                   </td>
//                   <td>
//                     {day.attendanceCount > 0
//                       ? t('yes')
//                       : t('no')}
//                   </td>
//                   <td>
//                     {day.holiday
//                       ? day.holiday.name
//                       : '—'}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ================= Admin Actions ================= */}
//       {leave.status === 'pending' && (
//         <div className="d-flex gap-2">
//           <button
//             className="btn btn-success"
//             onClick={handleApprove}
//           >
//             {t('leave.approve')}
//           </button>

//           <button
//             className="btn btn-danger"
//             onClick={handleReject}
//           >
//             {t('leave.reject')}
//           </button>
//         </div>
//       )}

//       {leave.status === 'approved' && isFutureLeave && (
//         <div className="mt-3">
//           <button
//             className="btn btn-outline-danger"
//             onClick={handleCancel}
//           >
//             {t('leave.cancel')}
//           </button>
//         </div>
//       )}

//       {/* ================= Toast ================= */}
//       <Toast
//         show={toast.show}
//         message={toast.message}
//         type={toast.type}
//         onConfirm={toast.onConfirm}
//         onClose={closeToast}
//       />
//     </div>
//   );
// }

// export default DetailsLeavePage;

// src/pages/leave/DetailsLeavePage.jsx


import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  getLeaveById,
  getLeaveBreakdown,
  approveLeave,
  rejectLeave,
  cancelLeave,
  getUserLeaveSummary
} from '../../services/Leave-services/leave.api';

import LeaveStatusBadge from '../../components/leave/components/LeaveStatusBadge';
import LeaveBalanceSummary from '../../components/leave/components/LeaveBalanceSummary';
import Toast from '../../components/ui/Toast';
// import { useAuth } from '../../context/AuthContext';

function DetailsLeavePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // const { user } = useAuth();
  // const isAdmin = user?.role === 'admin';

  const isAdmin = true; // مؤقتًا

  const [leave, setLeave] = useState(null);
  const [breakdown, setBreakdown] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success',
    onConfirm: null
  });

  const showToast = (message, type = 'success') =>
    setToast({ show: true, message, type, onConfirm: null });

  const closeToast = () =>
    setToast(t => ({ ...t, show: false, onConfirm: null }));

  /* ======================
     Load Data
  ====================== */
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const leaveRes = await getLeaveById(id);
      const leaveData = leaveRes.data.leave;
      setLeave(leaveData);

      const breakdownRes = await getLeaveBreakdown(id);
      setBreakdown(breakdownRes.data.breakdown || []);

      if (isAdmin && leaveData?.user?._id) {
        const summaryRes = await getUserLeaveSummary({
          userId: leaveData.user._id,
          year: leaveData.leaveYear
        });
        setSummary(summaryRes.data.summary);
      }
    } catch (err) {
      showToast(
        err?.response?.data?.message || t('leave.loadError'),
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [id, isAdmin, t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ======================
     Actions
  ====================== */
  const handleApprove = async () => {
    try {
      await approveLeave(id);
      showToast(t('leave.toastApproved'));
      navigate('/leaves');
    } catch (err) {
      showToast(err?.response?.data?.message, 'error');
    }
  };

  const handleReject = async () => {
    const reason = prompt(t('leave.rejectReason'));
    if (!reason) return;

    try {
      await rejectLeave(id, reason);
      showToast(t('leave.toastRejected'));
      navigate('/leaves');
    } catch (err) {
      showToast(err?.response?.data?.message, 'error');
    }
  };

  const handleCancel = async () => {
    setToast({
      show: true,
      type: 'warning',
      message: t('leave.confirmCancel'),
      onConfirm: async () => {
        try {
          await cancelLeave(id);
          showToast(t('leave.toastCancelled'));
          navigate('/leaves');
        } catch (err) {
          showToast(err?.response?.data?.message, 'error');
        }
      }
    });
  };

  if (loading) {
    return <div className="text-center py-5">{t('loading')}...</div>;
  }

  if (!leave) return null;

  const canEmployeeCancel =
    !isAdmin &&
    leave.status === 'pending' &&
    new Date(leave.startDate).getTime() > Date.now();

  const canAdminCancel =
    isAdmin &&
    leave.status === 'approved' &&
    new Date(leave.startDate).getTime() > Date.now();

  return (
    <div className="container py-4">

      {/* Header */}
      <div className="mb-4 d-flex justify-content-between align-items-start">
        <div>
          <h4 className="fw-semibold mb-1">
            {t('leave.details.title')}
          </h4>
          <div className="text-muted small">
            {t('leave.details.subtitle')}
          </div>
        </div>
        <LeaveStatusBadge status={leave.status} />
      </div>

      {/* Employee Info */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <strong>{t('leave.employee')}:</strong> {leave.user?.name}<br />
          <strong>{t('leave.email')}:</strong> {leave.user?.email}<br />
          <strong>{t('leave.year')}:</strong> {leave.leaveYear}
        </div>
      </div>

      {/* Leave Details */}
      <div className="card shadow-sm mb-4">
        <div className="card-body row g-3">
          <div className="col-md-3">
            <strong>{t('leave.type')}</strong>
            <div>{t(`leave.types.${leave.leaveType}`)}</div>
          </div>
          <div className="col-md-3">
            <strong>{t('leave.from')}</strong>
            <div>{new Date(leave.startDate).toLocaleDateString()}</div>
          </div>
          <div className="col-md-3">
            <strong>{t('leave.to')}</strong>
            <div>{new Date(leave.endDate).toLocaleDateString()}</div>
          </div>
          <div className="col-md-3">
            <strong>{t('leave.totalDays')}</strong>
            <div>{leave.totalDays}</div>
          </div>
        </div>
      </div>

      {/* Leave Balance (Admin only) */}
      {isAdmin && summary && (
        <LeaveBalanceSummary summary={summary} />
      )}

      {/* Breakdown */}
      <div className="card shadow-sm mb-4">
        <div className="card-header fw-semibold">
          {t('leave.breakdown')}
        </div>
        <div className="table-responsive">
          <table className="table table-sm table-bordered mb-0">
            <thead className="table-light">
              <tr>
                <th>{t('date')}</th>
                <th>{t('leave.status')}</th>
                <th>{t('leave.attendance')}</th>
                <th>{t('leave.holiday')}</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map(day => (
                <tr key={day.iso}>
                  <td>{day.iso}</td>
                  <td><LeaveStatusBadge status={day.appliedStatus} /></td>
                  <td>{day.attendanceCount > 0 ? t('yes') : t('no')}</td>
                  <td>{day.holiday?.name || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      {isAdmin && leave.status === 'pending' && (
        <div className="d-flex gap-2">
          <button className="btn btn-success" onClick={handleApprove}>
            {t('leave.approve')}
          </button>
          <button className="btn btn-danger" onClick={handleReject}>
            {t('leave.reject')}
          </button>
        </div>
      )}

      {(canAdminCancel || canEmployeeCancel) && (
        <button className="btn btn-outline-danger" onClick={handleCancel}>
          {t('leave.cancel')}
        </button>
      )}

      <Toast {...toast} onClose={closeToast} />
    </div>
  );
}

export default DetailsLeavePage;

// import { useEffect, useState, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';

// import {
//   getLeaveById,
//   getLeaveBreakdown,
//   approveLeave,
//   rejectLeave,
//   cancelLeave,
//   getUserLeaveSummary
// } from '../../components/leave/services/leave.api';

// import LeaveStatusBadge from '../../components/leave/components/LeaveStatusBadge';
// import LeaveBalanceSummary from '../../components/leave/components/LeaveBalanceSummary';
// import Toast from '../../components/ui/Toast';
// // import { useAuth } from '../../context/AuthContext';

// function DetailsLeavePage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { t } = useTranslation();

//   // 🔐 بعد ما ترجعي AuthContext
//   // const { user } = useAuth();
//   // const isAdmin = user?.role === 'admin';

//   const isAdmin = true; // مؤقتًا

//   const [leave, setLeave] = useState(null);
//   const [breakdown, setBreakdown] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [toast, setToast] = useState({
//     show: false,
//     message: '',
//     type: 'success',
//     onConfirm: null
//   });

//   const showToast = (message, type = 'success') =>
//     setToast({ show: true, message, type, onConfirm: null });

//   const closeToast = () =>
//     setToast(t => ({ ...t, show: false, onConfirm: null }));

//   /* ======================
//      Load Data
//   ====================== */
//   const loadData = useCallback(async () => {
//     try {
//       setLoading(true);

//       const leaveRes = await getLeaveById(id);
//       const leaveData = leaveRes.data.leave;
//       setLeave(leaveData);

//       const breakdownRes = await getLeaveBreakdown(id);
//       setBreakdown(breakdownRes.data.breakdown || []);

//       if (isAdmin && leaveData?.user?._id) {
//         const summaryRes = await getUserLeaveSummary({
//           userId: leaveData.user._id,
//           year: leaveData.leaveYear
//         });
//         setSummary(summaryRes.data.summary);
//       }

//     } catch (err) {
//       showToast(
//         err?.response?.data?.message || t('leave.loadError'),
//         'error'
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [id, isAdmin, t]);

//   useEffect(() => {
//     loadData();
//   }, [loadData]);

//   /* ======================
//      Admin Actions
//   ====================== */
//   const handleApprove = async () => {
//     try {
//       await approveLeave(id);
//       showToast(t('leave.toastApproved'));
//       navigate('/leaves');
//     } catch (err) {
//       showToast(err?.response?.data?.message, 'error');
//     }
//   };

//   const handleReject = async () => {
//     const reason = prompt(t('leave.rejectReason'));
//     if (!reason) return;

//     try {
//       await rejectLeave(id, reason);
//       showToast(t('leave.toastRejected'));
//       navigate('/leaves');
//     } catch (err) {
//       showToast(err?.response?.data?.message, 'error');
//     }
//   };

//   const handleCancel = async () => {
//     setToast({
//       show: true,
//       type: 'warning',
//       message: t('leave.confirmCancel'),
//       onConfirm: async () => {
//         try {
//           await cancelLeave(id);
//           showToast(t('leave.toastCancelled'));
//           navigate('/leaves');
//         } catch (err) {
//           showToast(err?.response?.data?.message, 'error');
//         }
//       }
//     });
//   };

//   if (loading) {
//     return <div className="text-center py-5">{t('loading')}...</div>;
//   }

//   if (!leave) return null;

//   const isFutureLeave =
//     new Date(leave.startDate).getTime() > Date.now();

//   /* ======================
//      UI
//   ====================== */
//   return (
//     <div className="container py-4">

//       {/* Header */}
//       <div className="mb-4 d-flex justify-content-between align-items-start">
//         <div>
//           <h4 className="fw-semibold mb-1">
//             <i className="fa-solid fa-calendar-check me-2 text-primary" />
//             تفاصيل الإجازة
//           </h4>
//           <div className="text-muted small">
//             بيانات الإجازة وحالتها
//           </div>
//         </div>

//         <LeaveStatusBadge status={leave.status} />
//       </div>

//       {/* Employee Info */}
//       <div className="card shadow-sm mb-4">
//         <div className="card-body">
//           <strong>الموظف:</strong> {leave.user?.name}<br />
//           <strong>الإيميل:</strong> {leave.user?.email}<br />
//           <strong>سنة الإجازة:</strong> {leave.leaveYear}
//         </div>
//       </div>

//       {/* Leave Summary */}
//       {isAdmin && summary && (
//         <LeaveBalanceSummary summary={summary} />
//       )}

//       {/* Breakdown */}
//       <div className="card shadow-sm mb-4">
//         <div className="card-header fw-semibold">
//           {t('leave.breakdown')}
//         </div>

//         <div className="table-responsive">
//           <table className="table table-sm table-bordered mb-0">
//             <thead className="table-light">
//               <tr>
//                 <th>{t('date')}</th>
//                 <th>{t('leave.status')}</th>
//                 <th>{t('leave.attendance')}</th>
//                 <th>{t('leave.holiday')}</th>
//               </tr>
//             </thead>
//             <tbody>
//               {breakdown.map(day => (
//                 <tr key={day.iso}>
//                   <td>{day.iso}</td>
//                   <td>
//                     <LeaveStatusBadge status={day.appliedStatus} />
//                   </td>
//                   <td>{day.attendanceCount > 0 ? t('yes') : t('no')}</td>
//                   <td>{day.holiday?.name || '—'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Admin Actions */}
//       {isAdmin && leave.status === 'pending' && (
//         <div className="d-flex gap-2">
//           <button className="btn btn-success" onClick={handleApprove}>
//             {t('leave.approve')}
//           </button>
//           <button className="btn btn-danger" onClick={handleReject}>
//             {t('leave.reject')}
//           </button>
//         </div>
//       )}

//       {isAdmin && leave.status === 'approved' && isFutureLeave && (
//         <div className="mt-3">
//           <button className="btn btn-outline-danger" onClick={handleCancel}>
//             {t('leave.cancel')}
//           </button>
//         </div>
//       )}

//       <Toast
//         show={toast.show}
//         message={toast.message}
//         type={toast.type}
//         onConfirm={toast.onConfirm}
//         onClose={closeToast}
//       />
//     </div>
//   );
// }

// export default DetailsLeavePage;
