// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';

// import {
//   getPayrollRunById,
//   approvePayroll
// } from '../../services/payroll.api';

// import Toast from '../../components/ui/Toast';

// const PayrollRunDetailsPage = () => {
//   const { t } = useTranslation();
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [approving, setApproving] = useState(false);
//   const [run, setRun] = useState(null);
//   const [toast, setToast] = useState(null);

//   /* =========================
//      Load Payroll Run
//   ========================= */
//   const loadRun = async () => {
//     try {
//       setLoading(true);
//       const res = await getPayrollRunById(id);
//       setRun(res.payrollRun);
//     } catch (err) {
//       setToast({
//         type: 'error',
//         message:
//           err.response?.data?.message ||
//           t('payroll.loadError')
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadRun();
//   }, [id]);

//   /* =========================
//      Approve Payroll
//   ========================= */
  

// //   const handleApprove = async () => {
// //   if (run.policyTimeline.length > 1) {
// //     const ok = window.confirm(
// //       t('payroll.confirmApproveMultiplePolicies')
// //     );
// //     if (!ok) return;
// //   } else {
// //     if (!window.confirm(t('payroll.confirmApprove'))) return;
// //   }

// //   try {
// //     setApproving(true);
// //     await approvePayroll(run._id);
// //     loadRun();
// //     setToast({
// //       type: 'success',
// //       message: t('payroll.approved')
// //     });
// //   } catch (err) {
// //     setToast({
// //       type: 'error',
// //       message:
// //         err.response?.data?.message ||
// //         t('payroll.approveError')
// //     });
// //   } finally {
// //     setApproving(false);
// //   }
// // };
// const handleApprove = async () => {
//   const policiesCount = run?.policyTimeline?.length || 0;

//   if (policiesCount > 1) {
//     const ok = window.confirm(
//       t('payroll.confirmApproveMultiplePolicies')
//     );
//     if (!ok) return;
//   } else {
//     if (!window.confirm(t('payroll.confirmApprove'))) return;
//   }

//   try {
//     setApproving(true);
//     await approvePayroll(run._id);
//     await loadRun();
//     setToast({
//       type: 'success',
//       message: t('payroll.approved')
//     });
//   } catch (err) {
//     setToast({
//       type: 'error',
//       message:
//         err.response?.data?.message ||
//         t('payroll.approveError')
//     });
//   } finally {
//     setApproving(false);
//   }
// };

//   if (loading) {
//     return (
//       <div className="text-center py-5">
//         {t('common.loading')}
//       </div>
//     );
//   }

//   if (!run) return null;

//   const isApproved = run.status === 'approved';

//   return (
//     <div className="container-fluid">

//       {/* =========================
//          Header
//       ========================= */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h3>
//           <i className="fas fa-file-invoice-dollar me-2" />
//           {t('payroll.detailsTitle')}
//         </h3>

//         <span
//           className={`badge ${
//             isApproved ? 'bg-success' : 'bg-warning'
//           }`}
//         >
//           {isApproved
//             ? t('payroll.statusApproved')
//             : t('payroll.statusDraft')}
//         </span>
//       </div>

//       {/* =========================
//          Salary Summary
//       ========================= */}
//       <div className="card mb-4">
//         <div className="card-body">
//           <h5 className="mb-3">{t('payroll.summary')}</h5>

//           <div className="row">
//             <div className="col-md-3">
//               <strong>{t('payroll.baseSalary')}</strong>
//               <div>{run.baseSalary}</div>
//             </div>

//             <div className="col-md-3">
//               <strong>{t('payroll.dailySalary')}</strong>
//               <div>{run.dailySalary}</div>
//             </div>

//             <div className="col-md-3">
//               <strong>{t('payroll.hourlySalary')}</strong>
//               <div>{run.hourlySalary}</div>
//             </div>

//             <div className="col-md-3">
//               <strong>{t('payroll.netSalary')}</strong>
//               <div className="fw-bold text-success">
//                 {run.netSalary}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* =========================
//          Deductions
//       ========================= */}
//       <div className="card mb-4">
//         <div className="card-body">
//           <h5 className="mb-3">{t('payroll.deductions')}</h5>

//           <table className="table table-bordered">
//             <tbody>
//               <tr>
//                 <td>{t('payroll.absence')}</td>
//                 <td>{run.deductions.absence}</td>
//               </tr>
//               <tr>
//                 <td>{t('payroll.late')}</td>
//                 <td>{run.deductions.late}</td>
//               </tr>
//               <tr>
//                 <td>{t('payroll.earlyLeave')}</td>
//                 {/* <td>{run.deductions.earlyLeave}</td> */}
// <td>{run.deductions.earlyLeave}</td>

//               </tr>
//               <tr>
//                 <td>{t('payroll.transit')}</td>
//                 <td>{run.deductions.transit}</td>
//               </tr>
//               <tr className="table-light">
//                 <td>
//                   <strong>{t('payroll.totalDeductions')}</strong>
//                 </td>
//                 <td>
//                   <strong>{run.deductions.total}</strong>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
// {/* =========================
//    Attendance Policy Timeline
// ========================= */}
// <div className="card mb-4">
//   <div className="card-body">
//     <h5 className="mb-3">
//       {t('payroll.policyTimeline')}
//       {/* {run.policyTimeline.length > 1 && ( 
//       */}
//       {run.policyTimeline && run.policyTimeline.length > 1 && (

//         <span className="badge bg-warning ms-2">
//           {t('payroll.multiplePolicies')}
//         </span>
//       )}
//     </h5>

//     <table className="table table-sm table-bordered">
//       <thead className="table-light">
//         <tr>
// {/* <th>{t('payroll.policyVersion')}</th> */}
// <th>{t('payroll.policyScope')}</th>
//           <th>{t('payroll.from')}</th>
//           <th>{t('payroll.to')}</th>
//            <th>Late Grace (min)</th>
//     <th>Early Grace (min)</th>
//           <th>{t('payroll.lateRate')}</th>
//           <th>{t('payroll.earlyRate')}</th>
//           <th>{t('payroll.transitRate')}</th>
//             <th>Absence</th>
//         </tr>
//       </thead>
//       <tbody>
//         {(run.policyTimeline || []).map((p, idx) => (
//           <tr key={idx}>
//            {/* <td>
//   v{p.version}
//   {p.scope && (
//     <span className="badge bg-secondary ms-1">
//       {p.scope.toUpperCase()}
//     </span>
//   )}
// </td> */}
//   {/* ✅ اسم السياسة */}
//         <td>
//           {p.scope === 'global' && (
//             <span className="badge bg-primary">
//               <i className="fas fa-globe me-1"></i>
//               Global Policy
//             </span>
//           )}
//           {p.scope === 'branch' && (
//             <span className="badge bg-info">
//               <i className="fas fa-building me-1"></i>
//           {p.branchName || 'Branch Policy'}
//             </span>
//           )}
//           {p.scope === 'role' && (
//             <span className="badge bg-warning text-dark">
//               <i className="fas fa-user-shield me-1"></i>
//           {p.role === 'admin' ? 'Admin' : 'Staff'} Policy
//             </span>
//           )}
//           {p.scope === 'user' && (
//             <span className="badge bg-success">
//               <i className="fas fa-user me-1"></i>
//               User-Specific
//             </span>
//           )}
//           {!p.scope && (
//             <span className="badge bg-secondary">
//               Unknown
//             </span>
//           )}
//         </td>
//             <td>{new Date(p.from).toLocaleDateString()}</td>
//             <td>{new Date(p.to).toLocaleDateString()}</td>
//                   <td>{p.grace?.lateMinutes ?? 0}</td>
//       <td>{p.grace?.earlyLeaveMinutes ?? 0}</td>
//             <td>{p.rates?.latePerMinute ?? 0}</td>
//             <td>{p.rates?.earlyLeavePerMinute ?? 0}</td>
//             <td>{p.rates?.transitPerMinute ?? 0}</td>
//                   {/* <td>{p.absence?.markDayAbsent ? 'Unpaid / 100%' : 'Paid'}</td> */}
//    <td>
//   {p.absence?.deductSalary === false
//     ? 'No Deduction'
//     : p.absence?.paid
//     ? 'Paid Absence'
//     : `Unpaid / ${((p.absence?.dayRate ?? 1) * 100).toFixed(0)}%`}
// </td>


//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// </div>

//       {/* =========================
//          Audit Info
//       ========================= */}
//       <div className="card mb-4">
//         <div className="card-body">
//           <h5 className="mb-3">{t('payroll.audit')}</h5>

//           <div className="row">
//             <div className="col-md-4">
//               <strong>{t('payroll.generatedAt')}</strong>
//               <div>
//                 {new Date(run.regeneratedAt || run.generatedAt || run.createdAt
// ).toLocaleString()}
//               </div>
//             </div>

//             <div className="col-md-4">
//               <strong>{t('payroll.generatedBy')}</strong>
//               <div>{run.generatedBy?.name || '-'}</div>
//             </div>

//             {isApproved && (
//               <div className="col-md-4">
//                 <strong>{t('payroll.approvedAt')}</strong>
//                 <div>
//                   {new Date(run.approvedAt).toLocaleString()}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* =========================
//          Actions
//       ========================= */}
//       {!isApproved && (
//         <div className="d-flex justify-content-end gap-2">
//           <button
//             className="btn btn-secondary"
//             onClick={() => navigate(-1)}
//           >
//             {t('common.back')}
//           </button>

//           <button
//             className="btn btn-success"
//             disabled={approving}
//             onClick={handleApprove}
//           >
//             <i className="fas fa-lock me-1" />
//             {t('payroll.approve')}
//           </button>
//         </div>
//       )}

//       {toast && (
//         <Toast
//           type={toast.type}
//           message={toast.message}
//           onClose={() => setToast(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default PayrollRunDetailsPage;

//============================================== ot-bonus add

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPayrollRunById, approvePayroll } from '../../services/payroll.api';
import Toast from '../../components/ui/Toast';

/* ==============================================
   Config
============================================== */
const OT_TYPE_CONFIG = {
  BEFORE_SHIFT:      { color: 'warning', icon: 'fa-sun'            },
  AFTER_SHIFT_DAY:   { color: 'primary', icon: 'fa-cloud-sun'      },
  AFTER_SHIFT_NIGHT: { color: 'info',    icon: 'fa-moon'           },
  WEEKLY_OFF:        { color: 'success', icon: 'fa-calendar-times'  },
  HOLIDAY:           { color: 'danger',  icon: 'fa-umbrella-beach'  },
  EXCEPTIONAL:       { color: 'purple',  icon: 'fa-star'            }
};

const BONUS_TYPE_CONFIG = {
  ATTENDANCE_BONUS: { color: 'success', icon: 'fa-user-check' },
  FIXED_BONUS:      { color: 'info',    icon: 'fa-coins'      },
  EXCEPTIONAL:      { color: 'warning', icon: 'fa-star'       }
};

const STATUS_COLORS = {
  active:     { color: 'success',   label: 'Active'     },
  resigned:   { color: 'warning',   label: 'Resigned'   },
  terminated: { color: 'danger',    label: 'Terminated' },
  suspended:  { color: 'secondary', label: 'Suspended'  }
};

/* ==============================================
   🧑 EmployeeCard
   بيعرض تفاصيل الموظف في أعلى الصفحة
============================================== */
function EmployeeCard({ user, period }) {
  const { t } = useTranslation();
  if (!user) return null;

  // ── آخر employment status ──
  const latestStatus = user.employmentHistory?.length
    ? [...user.employmentHistory].sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate)
      )[0]
    : null;

  const statusCfg = STATUS_COLORS[latestStatus?.status] || { color: 'secondary', label: '—' };
  const startDate = latestStatus?.startDate || user.employmentStartDate;
  const initials  = (user.name || '?')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // ── Shift ──
  const shiftTime = user.workStartTime && user.workEndTime
    ? `${user.workStartTime} → ${user.workEndTime}${user.isNightShift ? ' 🌙' : ''}`
    : '—';

  const workingDaysCount = Array.isArray(user.workingDaysNames)
    ? user.workingDaysNames.length
    : (user.requiredWorkingDays || '—');

  // ── Branches ──
  const branches = Array.isArray(user.branches)
    ? user.branches.filter(Boolean)
    : [];

  // ── Departments ──
  const departments = Array.isArray(user.departments)
    ? user.departments.filter(Boolean)
    : [];

  // ── Admin scope ──
  const isAdmin       = user.role === 'admin';
  const isGlobal      = user.adminScope?.type === 'GLOBAL';
  const adminBranches = user.adminScope?.branches || [];

  return (
    <div className="card mb-4 border-0 shadow-sm">
      <div className="card-body">
        <div className="row g-3 align-items-start">

          {/* ── Avatar + Name + Status ── */}
          <div className="col-12 col-md-auto d-flex align-items-center gap-3">
            <div
              className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
              style={{ width: 60, height: 60, fontSize: 20 }}>
              {initials}
            </div>
            <div>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <h5 className="mb-0 fw-bold">{user.name}</h5>

                {/* Employment Status */}
                <span className={`badge bg-${statusCfg.color} bg-opacity-10 text-${statusCfg.color} border border-${statusCfg.color} border-opacity-25`}>
                  {statusCfg.label}
                </span>

                {/* Role */}
                <span className={`badge ${isAdmin ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                  <i className={`fas ${isAdmin ? 'fa-user-shield' : 'fa-user'} me-1`} />
                  {isAdmin
                    ? isGlobal ? 'Super Admin' : 'Branch Admin'
                    : 'Staff'}
                </span>
              </div>

              {/* Email */}
              <div className="text-muted small mt-1">
                <i className="fas fa-envelope me-1" />
                {user.email}
              </div>

              {/* Phone */}
              {user.phone && (
                <div className="text-muted small">
                  <i className="fas fa-phone me-1" />
                  {user.phone}
                </div>
              )}

              {/* Start Date */}
              {startDate && (
                <div className="text-muted small">
                  <i className="fas fa-calendar-alt me-1" />
                  {t('payroll.employedSince')}: {new Date(startDate).toLocaleDateString('en-GB')}
                </div>
              )}
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="col-auto d-none d-md-flex align-items-center">
            <div className="vr" style={{ height: 80 }} />
          </div>

          {/* ── Work Info ── */}
          <div className="col-12 col-md">
            <div className="row g-2">

              {/* Salary */}
              <div className="col-6 col-sm-3">
                <div className="text-muted small">{t('payroll.baseSalary')}</div>
                <div className="fw-bold text-success">
                  {user.salary?.toLocaleString() || '—'}
                  <span className="text-muted small ms-1">{t('common.currency')}</span>
                </div>
              </div>

              {/* Shift */}
              <div className="col-6 col-sm-3">
                <div className="text-muted small">{t('payroll.shift')}</div>
                <div className="fw-semibold small">{shiftTime}</div>
              </div>

              {/* Working Days */}
              <div className="col-6 col-sm-3">
                <div className="text-muted small">{t('payroll.workingDays')}</div>
                <div className="fw-semibold small">
                  {workingDaysCount} {t('payroll.daysPerWeek')}
                </div>
              </div>

              {/* Period */}
              <div className="col-6 col-sm-3">
                <div className="text-muted small">{t('payroll.period')}</div>
                <div className="fw-semibold small">
                  {period?.month}/{period?.year}
                </div>
              </div>

              {/* Branches (اللي الموظف شغال فيها) */}
              {branches.length > 0 && (
                <div className="col-12">
                  <div className="text-muted small mb-1">
                    <i className="fas fa-building me-1" />
                    {t('payroll.branches')}:
                  </div>
                  <div className="d-flex flex-wrap gap-1">
                    {branches.map((b, i) => (
                      <span key={i} className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 small">
                        {b.name || b}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Departments */}
              {departments.length > 0 && (
                <div className="col-12">
                  <div className="text-muted small mb-1">
                    <i className="fas fa-sitemap me-1" />
                    {t('payroll.departments')}:
                  </div>
                  <div className="d-flex flex-wrap gap-1">
                    {departments.map((d, i) => (
                      <span key={i} className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 small">
                        {d.name || d}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Scope (لو admin) */}
              {isAdmin && (
                <div className="col-12">
                  <div className="text-muted small mb-1">
                    <i className="fas fa-shield-alt me-1" />
                    {t('payroll.adminScope')}:
                  </div>
                  {isGlobal ? (
                    <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25">
                      <i className="fas fa-globe me-1" />
                      Global Admin
                    </span>
                  ) : (
                    <div className="d-flex flex-wrap gap-1">
                      {adminBranches.map((b, i) => (
                        <span key={i} className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 small">
                          <i className="fas fa-building me-1" />
                          {b.name || b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ==============================================
   PayrollRunDetailsPage
============================================== */
const PayrollRunDetailsPage = () => {
  const { t }    = useTranslation();
  const { id }   = useParams();
  const navigate = useNavigate();

  const [loading,   setLoading]   = useState(true);
  const [approving, setApproving] = useState(false);
  const [run,       setRun]       = useState(null);
  const [toast,     setToast]     = useState(null);

  const loadRun = async () => {
    try {
      setLoading(true);
      const res = await getPayrollRunById(id);
      setRun(res.payrollRun);
    } catch (err) {
      setToast({
        type:    'error',
        message: err.response?.data?.message || t('payroll.loadError')
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRun(); }, [id]);

  const handleApprove = async () => {
    const msg = (run?.policyTimeline?.length || 0) > 1
      ? t('payroll.confirmApproveMultiplePolicies')
      : t('payroll.confirmApprove');
    if (!window.confirm(msg)) return;

    try {
      setApproving(true);
      await approvePayroll(run._id);
      await loadRun();
      setToast({ type: 'success', message: t('payroll.approved') });
    } catch (err) {
      setToast({
        type:    'error',
        message: err.response?.data?.message || t('payroll.approveError')
      });
    } finally {
      setApproving(false);
    }
  };

  if (loading) return <div className="text-center py-5">{t('common.loading')}</div>;
  if (!run)    return null;

  const isApproved = run.status === 'approved';
  const overtime   = run.overtime || { total: 0, breakdown: [] };
  const bonus      = run.bonus    || { total: 0, breakdown: [] };

  return (
    <div className="container-fluid">

      {/* ── Header ── */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>
          <i className="fas fa-file-invoice-dollar me-2" />
          {t('payroll.detailsTitle')}
        </h3>
        <span className={`badge ${isApproved ? 'bg-success' : 'bg-warning text-dark'} fs-6`}>
          {isApproved ? t('payroll.statusApproved') : t('payroll.statusDraft')}
        </span>
      </div>

      {/* ── Employee Card ── */}
      <EmployeeCard user={run.user} period={run.period} />

      {/* ── Salary Summary ── */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="mb-3">{t('payroll.summary')}</h5>
          <div className="row g-3">
            <div className="col-6 col-md-3">
              <div className="text-muted small">{t('payroll.baseSalary')}</div>
              <div className="fw-semibold">{run.baseSalary}</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-muted small">{t('payroll.dailySalary')}</div>
              <div className="fw-semibold">{run.dailySalary}</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-muted small">{t('payroll.hourlySalary')}</div>
              <div className="fw-semibold">{run.hourlySalary}</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-muted small">{t('payroll.netSalary')}</div>
              <div className="fw-bold text-success fs-5">{run.netSalary}</div>
            </div>
          </div>

          {/* Formula */}
          <div className="alert alert-light border mt-3 mb-0 small">
            <i className="fas fa-calculator me-2 text-primary" />
            <strong>{t('payroll.netSalary')}:</strong>{' '}
            {run.baseSalary}
            {' − '}<span className="text-danger">{run.deductions?.total ?? 0}</span>
            {overtime.total > 0 && <> + <span className="text-success">{overtime.total} OT</span></>}
            {bonus.total > 0    && <> + <span className="text-info">{bonus.total} Bonus</span></>}
            {' = '}<strong className="text-success">{run.netSalary}</strong>
          </div>
        </div>
      </div>

      {/* ── Deductions ── */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="mb-3">{t('payroll.deductions')}</h5>
          <table className="table table-bordered">
            <tbody>
              <tr><td>{t('payroll.absence')}</td><td className="text-danger">{run.deductions.absence}</td></tr>
              <tr><td>{t('payroll.late')}</td><td className="text-danger">{run.deductions.late}</td></tr>
              <tr><td>{t('payroll.earlyLeave')}</td><td className="text-danger">{run.deductions.earlyLeave}</td></tr>
              <tr><td>{t('payroll.transit')}</td><td className="text-danger">{run.deductions.transit}</td></tr>
              <tr className="table-light">
                <td><strong>{t('payroll.totalDeductions')}</strong></td>
                <td><strong className="text-danger">{run.deductions.total}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Overtime ── */}
      {overtime.total > 0 && (
        <div className="card mb-4 border-success border-opacity-50">
          <div className="card-header bg-success bg-opacity-10">
            <h5 className="mb-0 text-success">
              <i className="fas fa-clock me-2" />
              {t('payroll.overtime')}
              <span className="badge bg-success ms-2 fs-6">+ {overtime.total}</span>
            </h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>{t('payroll.otDate')}</th>
                    <th>{t('payroll.otType')}</th>
                    <th>{t('payroll.otSource')}</th>
                    <th className="text-center">{t('payroll.otMinutes')}</th>
                    <th className="text-center">{t('payroll.otRate')}</th>
                    <th className="text-end">{t('payroll.otAmount')}</th>
                  </tr>
                </thead>
                <tbody>
                  {overtime.breakdown.map((entry, i) => {
                    const cfg      = OT_TYPE_CONFIG[entry.type] || { color: 'secondary', icon: 'fa-circle' };
                    const isCustom = cfg.color === 'purple';
                    return (
                      <tr key={i}>
                        <td className="small">{new Date(entry.date).toLocaleDateString('en-GB')}</td>
                        <td>
                          {isCustom ? (
                            <span className="badge border"
                              style={{ background: '#f3e8ff', color: '#7c3aed', borderColor: '#c4b5fd' }}>
                              <i className={`fas ${cfg.icon} me-1`} />{t(`overtimeEntry.types.${entry.type}`)}
                            </span>
                          ) : (
                            <span className={`badge bg-${cfg.color} bg-opacity-10 text-${cfg.color} border border-${cfg.color} border-opacity-25`}>
                              <i className={`fas ${cfg.icon} me-1`} />{t(`overtimeEntry.types.${entry.type}`)}
                            </span>
                          )}
                        </td>
                        <td>
                          <span className="badge bg-light text-secondary border small">
                            {t(`overtimeEntry.sources.${entry.source || 'auto'}`)}
                          </span>
                        </td>
                        <td className="text-center small">
                          {entry.type === 'EXCEPTIONAL' ? '—' : `${entry.minutes}m`}
                        </td>
                        <td className="text-center small">
                          {entry.type === 'EXCEPTIONAL' ? '—'
                            : entry.rateType === 'fixed'
                              ? <span className="badge bg-light text-dark border">fixed</span>
                              : `${entry.multiplier}x`}
                        </td>
                        <td className="text-end fw-semibold text-success">
                          + {Number(entry.amount).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="table-light">
                  <tr>
                    <td colSpan="5" className="text-end fw-bold">{t('payroll.totalOT')}</td>
                    <td className="text-end fw-bold text-success">+ {overtime.total}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Bonus ── */}
      {bonus.total > 0 && (
        <div className="card mb-4 border-info border-opacity-50">
          <div className="card-header bg-info bg-opacity-10">
            <h5 className="mb-0 text-info">
              <i className="fas fa-gift me-2" />
              {t('payroll.bonus')}
              <span className="badge bg-info ms-2 fs-6">+ {bonus.total}</span>
            </h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>{t('payroll.bonusType')}</th>
                    <th>{t('payroll.bonusNotes')}</th>
                    <th className="text-end">{t('payroll.bonusAmount')}</th>
                  </tr>
                </thead>
                <tbody>
                  {bonus.breakdown.map((entry, i) => {
                    const cfg = BONUS_TYPE_CONFIG[entry.type] || { color: 'secondary', icon: 'fa-circle' };
                    return (
                      <tr key={i}>
                        <td>
                          <span className={`badge bg-${cfg.color} bg-opacity-10 text-${cfg.color} border border-${cfg.color} border-opacity-25`}>
                            <i className={`fas ${cfg.icon} me-1`} />{t(`payroll.bonusTypes.${entry.type}`)}
                          </span>
                        </td>
                        <td className="small text-muted">
                          {entry.notes || (entry.date ? new Date(entry.date).toLocaleDateString('en-GB') : '—')}
                        </td>
                        <td className="text-end fw-semibold text-info">
                          + {Number(entry.amount).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="table-light">
                  <tr>
                    <td colSpan="2" className="text-end fw-bold">{t('payroll.totalBonus')}</td>
                    <td className="text-end fw-bold text-info">+ {bonus.total}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Policy Timeline ── */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="mb-3">
            {t('payroll.policyTimeline')}
            {run.policyTimeline?.length > 1 && (
              <span className="badge bg-warning ms-2">{t('payroll.multiplePolicies')}</span>
            )}
          </h5>
          <div className="table-responsive">
            <table className="table table-sm table-bordered">
              <thead className="table-light">
                <tr>
                  <th>{t('payroll.policyScope')}</th>
                  <th>{t('payroll.from')}</th>
                  <th>{t('payroll.to')}</th>
                  <th>Late Grace</th>
                  <th>Early Grace</th>
                  <th>{t('payroll.lateRate')}</th>
                  <th>{t('payroll.earlyRate')}</th>
                  <th>{t('payroll.transitRate')}</th>
                  <th>Absence</th>
                </tr>
              </thead>
              <tbody>
                {(run.policyTimeline || []).map((p, idx) => (
                  <tr key={idx}>
                    <td>
                      {p.scope === 'global'     && <span className="badge bg-primary"><i className="fas fa-globe me-1" />Global</span>}
                      {p.scope === 'branch'     && <span className="badge bg-info"><i className="fas fa-building me-1" />{p.branchName || 'Branch'}</span>}
                      {p.scope === 'role'       && <span className="badge bg-warning text-dark"><i className="fas fa-user-shield me-1" />{p.role === 'admin' ? 'Admin' : 'Staff'}</span>}
                      {p.scope === 'user'       && <span className="badge bg-success"><i className="fas fa-user me-1" />User-Specific</span>}
                      {p.scope === 'department' && <span className="badge bg-secondary"><i className="fas fa-sitemap me-1" />Department</span>}
                      {!p.scope                 && <span className="badge bg-secondary">Unknown</span>}
                    </td>
                    <td>{new Date(p.from).toLocaleDateString()}</td>
                    <td>{new Date(p.to).toLocaleDateString()}</td>
                    <td>{p.grace?.lateMinutes ?? 0} min</td>
                    <td>{p.grace?.earlyLeaveMinutes ?? 0} min</td>
                    <td>{p.rates?.latePerMinute ?? 0}</td>
                    <td>{p.rates?.earlyLeavePerMinute ?? 0}</td>
                    <td>{p.rates?.transitPerMinute ?? 0}</td>
                    <td>
                      {p.absence?.deductSalary === false ? 'No Deduction'
                        : p.absence?.paid ? 'Paid Absence'
                        : `Unpaid / ${((p.absence?.dayRate ?? 1) * 100).toFixed(0)}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Audit ── */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="mb-3">{t('payroll.audit')}</h5>
          <div className="row">
            <div className="col-md-4">
              <div className="text-muted small">{t('payroll.generatedAt')}</div>
              <div>{new Date(run.regeneratedAt || run.generatedAt || run.createdAt).toLocaleString()}</div>
            </div>
            <div className="col-md-4">
              <div className="text-muted small">{t('payroll.generatedBy')}</div>
              <div>{run.generatedBy?.name || '—'}</div>
            </div>
            {isApproved && (
              <div className="col-md-4">
                <div className="text-muted small">{t('payroll.approvedAt')}</div>
                <div>{new Date(run.approvedAt).toLocaleString()}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Actions ── */}
      {!isApproved && (
        <div className="d-flex justify-content-end gap-2 mb-4">
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            {t('common.back')}
          </button>
          <button className="btn btn-success" disabled={approving} onClick={handleApprove}>
            <i className="fas fa-lock me-1" />
            {t('payroll.approve')}
          </button>
        </div>
      )}

      {toast && (
        <Toast show={true} type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default PayrollRunDetailsPage;
// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';

// import {
//   getPayrollRunById,
//   approvePayroll
// } from '../../services/payroll.api';

// import Toast from '../../components/ui/Toast';

// /* ==============================================
//    Config
// ============================================== */
// const OT_TYPE_CONFIG = {
//   BEFORE_SHIFT:      { color: 'warning', icon: 'fa-sun'            },
//   AFTER_SHIFT_DAY:   { color: 'primary', icon: 'fa-cloud-sun'      },
//   AFTER_SHIFT_NIGHT: { color: 'info',    icon: 'fa-moon'           },
//   WEEKLY_OFF:        { color: 'success', icon: 'fa-calendar-times'  },
//   HOLIDAY:           { color: 'danger',  icon: 'fa-umbrella-beach'  },
//   EXCEPTIONAL:       { color: 'purple',  icon: 'fa-star'            }
// };

// const BONUS_TYPE_CONFIG = {
//   ATTENDANCE_BONUS: { color: 'success', icon: 'fa-user-check' },
//   FIXED_BONUS:      { color: 'info',    icon: 'fa-coins'      },
//   EXCEPTIONAL:      { color: 'warning', icon: 'fa-star'       }
// };

// /* ==============================================
//    PayrollRunDetailsPage
// ============================================== */
// const PayrollRunDetailsPage = () => {
//   const { t }      = useTranslation();
//   const { id }     = useParams();
//   const navigate   = useNavigate();

//   const [loading,   setLoading]   = useState(true);
//   const [approving, setApproving] = useState(false);
//   const [run,       setRun]       = useState(null);
//   const [toast,     setToast]     = useState(null);

//   /* =========================
//      Load
//   ========================= */
//   const loadRun = async () => {
//     try {
//       setLoading(true);
//       const res = await getPayrollRunById(id);
//       setRun(res.payrollRun);
//     } catch (err) {
//       setToast({
//         type:    'error',
//         message: err.response?.data?.message || t('payroll.loadError')
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { loadRun(); }, [id]);

//   /* =========================
//      Approve
//   ========================= */
//   const handleApprove = async () => {
//     const policiesCount = run?.policyTimeline?.length || 0;
//     const msg = policiesCount > 1
//       ? t('payroll.confirmApproveMultiplePolicies')
//       : t('payroll.confirmApprove');

//     if (!window.confirm(msg)) return;

//     try {
//       setApproving(true);
//       await approvePayroll(run._id);
//       await loadRun();
//       setToast({ type: 'success', message: t('payroll.approved') });
//     } catch (err) {
//       setToast({
//         type:    'error',
//         message: err.response?.data?.message || t('payroll.approveError')
//       });
//     } finally {
//       setApproving(false);
//     }
//   };

//   if (loading) return <div className="text-center py-5">{t('common.loading')}</div>;
//   if (!run)    return null;

//   const isApproved = run.status === 'approved';
//   const overtime   = run.overtime  || { total: 0, breakdown: [] };
//   const bonus      = run.bonus     || { total: 0, breakdown: [] };

//   return (
//     <div className="container-fluid">

//       {/* ── Header ── */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h3>
//           <i className="fas fa-file-invoice-dollar me-2" />
//           {t('payroll.detailsTitle')}
//         </h3>
//         <span className={`badge ${isApproved ? 'bg-success' : 'bg-warning'} fs-6`}>
//           {isApproved ? t('payroll.statusApproved') : t('payroll.statusDraft')}
//         </span>
//       </div>

//       {/* ── Salary Summary ── */}
//       <div className="card mb-4">
//         <div className="card-body">
//           <h5 className="mb-3">{t('payroll.summary')}</h5>
//           <div className="row g-3">
//             <div className="col-6 col-md-3">
//               <div className="text-muted small">{t('payroll.baseSalary')}</div>
//               <div className="fw-semibold">{run.baseSalary}</div>
//             </div>
//             <div className="col-6 col-md-3">
//               <div className="text-muted small">{t('payroll.dailySalary')}</div>
//               <div className="fw-semibold">{run.dailySalary}</div>
//             </div>
//             <div className="col-6 col-md-3">
//               <div className="text-muted small">{t('payroll.hourlySalary')}</div>
//               <div className="fw-semibold">{run.hourlySalary}</div>
//             </div>
//             <div className="col-6 col-md-3">
//               <div className="text-muted small">{t('payroll.netSalary')}</div>
//               <div className="fw-bold text-success fs-5">{run.netSalary}</div>
//             </div>
//           </div>

//           {/* Formula */}
//           <div className="alert alert-light border mt-3 mb-0 small">
//             <i className="fas fa-calculator me-2 text-primary" />
//             <strong>{t('payroll.netSalary')}:</strong>{' '}
//             {run.baseSalary}
//             {' − '}<span className="text-danger">{run.deductions?.total ?? 0}</span>
//             {overtime.total > 0 && (
//               <> + <span className="text-success">{overtime.total} OT</span></>
//             )}
//             {bonus.total > 0 && (
//               <> + <span className="text-info">{bonus.total} Bonus</span></>
//             )}
//             {' = '}<strong className="text-success">{run.netSalary}</strong>
//           </div>
//         </div>
//       </div>

//       {/* ── Deductions ── */}
//       <div className="card mb-4">
//         <div className="card-body">
//           <h5 className="mb-3">{t('payroll.deductions')}</h5>
//           <table className="table table-bordered">
//             <tbody>
//               <tr><td>{t('payroll.absence')}</td><td className="text-danger">{run.deductions.absence}</td></tr>
//               <tr><td>{t('payroll.late')}</td><td className="text-danger">{run.deductions.late}</td></tr>
//               <tr><td>{t('payroll.earlyLeave')}</td><td className="text-danger">{run.deductions.earlyLeave}</td></tr>
//               <tr><td>{t('payroll.transit')}</td><td className="text-danger">{run.deductions.transit}</td></tr>
//               <tr className="table-light">
//                 <td><strong>{t('payroll.totalDeductions')}</strong></td>
//                 <td><strong className="text-danger">{run.deductions.total}</strong></td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ── Overtime ── */}
//       {overtime.total > 0 && (
//         <div className="card mb-4 border-success border-opacity-50">
//           <div className="card-header bg-success bg-opacity-10">
//             <h5 className="mb-0 text-success">
//               <i className="fas fa-clock me-2" />
//               {t('payroll.overtime')}
//               <span className="badge bg-success ms-2 fs-6">+ {overtime.total}</span>
//             </h5>
//           </div>
//           <div className="card-body p-0">
//             <div className="table-responsive">
//               <table className="table table-hover align-middle mb-0">
//                 <thead className="table-light">
//                   <tr>
//                     <th>{t('payroll.otDate')}</th>
//                     <th>{t('payroll.otType')}</th>
//                     <th>{t('payroll.otSource')}</th>
//                     <th className="text-center">{t('payroll.otMinutes')}</th>
//                     <th className="text-center">{t('payroll.otRate')}</th>
//                     <th className="text-end">{t('payroll.otAmount')}</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {overtime.breakdown.map((entry, i) => {
//                     const cfg      = OT_TYPE_CONFIG[entry.type] || { color: 'secondary', icon: 'fa-circle' };
//                     const isCustom = cfg.color === 'purple';
//                     return (
//                       <tr key={i}>
//                         <td className="small">{new Date(entry.date).toLocaleDateString('en-GB')}</td>
//                         <td>
//                           {isCustom ? (
//                             <span className="badge border"
//                               style={{ background: '#f3e8ff', color: '#7c3aed', borderColor: '#c4b5fd' }}>
//                               <i className={`fas ${cfg.icon} me-1`} />
//                               {t(`overtimeEntry.types.${entry.type}`)}
//                             </span>
//                           ) : (
//                             <span className={`badge bg-${cfg.color} bg-opacity-10 text-${cfg.color} border border-${cfg.color} border-opacity-25`}>
//                               <i className={`fas ${cfg.icon} me-1`} />
//                               {t(`overtimeEntry.types.${entry.type}`)}
//                             </span>
//                           )}
//                         </td>
//                         <td>
//                           <span className="badge bg-light text-secondary border small">
//                             {t(`overtimeEntry.sources.${entry.source || 'auto'}`)}
//                           </span>
//                         </td>
//                         <td className="text-center small">
//                           {entry.type === 'EXCEPTIONAL' ? '—' : `${entry.minutes}m`}
//                         </td>
//                         <td className="text-center small">
//                           {entry.type === 'EXCEPTIONAL' ? '—'
//                             : entry.rateType === 'fixed'
//                               ? <span className="badge bg-light text-dark border">fixed</span>
//                               : `${entry.multiplier}x`}
//                         </td>
//                         <td className="text-end fw-semibold text-success">
//                           + {Number(entry.amount).toFixed(2)}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//                 <tfoot className="table-light">
//                   <tr>
//                     <td colSpan="5" className="text-end fw-bold">{t('payroll.totalOT')}</td>
//                     <td className="text-end fw-bold text-success">+ {overtime.total}</td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Bonus ── */}
//       {bonus.total > 0 && (
//         <div className="card mb-4 border-info border-opacity-50">
//           <div className="card-header bg-info bg-opacity-10">
//             <h5 className="mb-0 text-info">
//               <i className="fas fa-gift me-2" />
//               {t('payroll.bonus')}
//               <span className="badge bg-info ms-2 fs-6">+ {bonus.total}</span>
//             </h5>
//           </div>
//           <div className="card-body p-0">
//             <div className="table-responsive">
//               <table className="table table-hover align-middle mb-0">
//                 <thead className="table-light">
//                   <tr>
//                     <th>{t('payroll.bonusType')}</th>
//                     <th>{t('payroll.bonusNotes')}</th>
//                     <th className="text-end">{t('payroll.bonusAmount')}</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bonus.breakdown.map((entry, i) => {
//                     const cfg = BONUS_TYPE_CONFIG[entry.type] || { color: 'secondary', icon: 'fa-circle' };
//                     return (
//                       <tr key={i}>
//                         <td>
//                           <span className={`badge bg-${cfg.color} bg-opacity-10 text-${cfg.color} border border-${cfg.color} border-opacity-25`}>
//                             <i className={`fas ${cfg.icon} me-1`} />
//                             {t(`payroll.bonusTypes.${entry.type}`)}
//                           </span>
//                         </td>
//                         <td className="small text-muted">
//                           {entry.notes || (entry.date ? new Date(entry.date).toLocaleDateString('en-GB') : '—')}
//                         </td>
//                         <td className="text-end fw-semibold text-info">
//                           + {Number(entry.amount).toFixed(2)}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//                 <tfoot className="table-light">
//                   <tr>
//                     <td colSpan="2" className="text-end fw-bold">{t('payroll.totalBonus')}</td>
//                     <td className="text-end fw-bold text-info">+ {bonus.total}</td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Policy Timeline ── */}
//       <div className="card mb-4">
//         <div className="card-body">
//           <h5 className="mb-3">
//             {t('payroll.policyTimeline')}
//             {run.policyTimeline?.length > 1 && (
//               <span className="badge bg-warning ms-2">{t('payroll.multiplePolicies')}</span>
//             )}
//           </h5>
//           <div className="table-responsive">
//             <table className="table table-sm table-bordered">
//               <thead className="table-light">
//                 <tr>
//                   <th>{t('payroll.policyScope')}</th>
//                   <th>{t('payroll.from')}</th>
//                   <th>{t('payroll.to')}</th>
//                   <th>Late Grace</th>
//                   <th>Early Grace</th>
//                   <th>{t('payroll.lateRate')}</th>
//                   <th>{t('payroll.earlyRate')}</th>
//                   <th>{t('payroll.transitRate')}</th>
//                   <th>Absence</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {(run.policyTimeline || []).map((p, idx) => (
//                   <tr key={idx}>
//                     <td>
//                       {p.scope === 'global'     && <span className="badge bg-primary"><i className="fas fa-globe me-1" />Global</span>}
//                       {p.scope === 'branch'     && <span className="badge bg-info"><i className="fas fa-building me-1" />{p.branchName || 'Branch'}</span>}
//                       {p.scope === 'role'       && <span className="badge bg-warning text-dark"><i className="fas fa-user-shield me-1" />{p.role === 'admin' ? 'Admin' : 'Staff'}</span>}
//                       {p.scope === 'user'       && <span className="badge bg-success"><i className="fas fa-user me-1" />User-Specific</span>}
//                       {p.scope === 'department' && <span className="badge bg-secondary"><i className="fas fa-sitemap me-1" />Department</span>}
//                       {!p.scope                 && <span className="badge bg-secondary">Unknown</span>}
//                     </td>
//                     <td>{new Date(p.from).toLocaleDateString()}</td>
//                     <td>{new Date(p.to).toLocaleDateString()}</td>
//                     <td>{p.grace?.lateMinutes ?? 0} min</td>
//                     <td>{p.grace?.earlyLeaveMinutes ?? 0} min</td>
//                     <td>{p.rates?.latePerMinute ?? 0}</td>
//                     <td>{p.rates?.earlyLeavePerMinute ?? 0}</td>
//                     <td>{p.rates?.transitPerMinute ?? 0}</td>
//                     <td>
//                       {p.absence?.deductSalary === false
//                         ? 'No Deduction'
//                         : p.absence?.paid
//                           ? 'Paid Absence'
//                           : `Unpaid / ${((p.absence?.dayRate ?? 1) * 100).toFixed(0)}%`}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* ── Audit ── */}
//       <div className="card mb-4">
//         <div className="card-body">
//           <h5 className="mb-3">{t('payroll.audit')}</h5>
//           <div className="row">
//             <div className="col-md-4">
//               <div className="text-muted small">{t('payroll.generatedAt')}</div>
//               <div>{new Date(run.regeneratedAt || run.generatedAt || run.createdAt).toLocaleString()}</div>
//             </div>
//             <div className="col-md-4">
//               <div className="text-muted small">{t('payroll.generatedBy')}</div>
//               <div>{run.generatedBy?.name || '—'}</div>
//             </div>
//             {isApproved && (
//               <div className="col-md-4">
//                 <div className="text-muted small">{t('payroll.approvedAt')}</div>
//                 <div>{new Date(run.approvedAt).toLocaleString()}</div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ── Actions ── */}
//       {!isApproved && (
//         <div className="d-flex justify-content-end gap-2">
//           <button className="btn btn-secondary" onClick={() => navigate(-1)}>
//             {t('common.back')}
//           </button>
//           <button className="btn btn-success" disabled={approving} onClick={handleApprove}>
//             <i className="fas fa-lock me-1" />
//             {t('payroll.approve')}
//           </button>
//         </div>
//       )}

//       {toast && (
//         <Toast show={true} type={toast.type} message={toast.message} onClose={() => setToast(null)} />
//       )}
//     </div>
//   );
// };

// export default PayrollRunDetailsPage;