
// import { useTranslation } from 'react-i18next';

// function StatCard({ icon, label, value, color, sub }) {
//   return (
//     <div className="col-xl-3 col-md-4 col-sm-6 mb-3">
//       <div className="card shadow-sm border-0 h-100 stat-card">
//         <div className="card-body text-center">
//           <i className={`fas ${icon} fs-1 mb-2 text-${color}`} />
//           <h3 className={`fw-bold text-${color} mb-0`}>
//             {value ?? 0}
//           </h3>
//           <p className="text-muted mb-0">{label}</p>
//           {sub && <small className="text-muted">{sub}</small>}
//         </div>
//       </div>
//     </div>
//   );
// }

// function UserStats({ monthlyReport }) {
//   const { t } = useTranslation();

//   if (!monthlyReport || !monthlyReport.totals) {
//     return (
//       <div className="alert alert-info">
//         {t('selectMonthToViewStats')}
//       </div>
//     );
//   }

//   const { totals, month, year } = monthlyReport;

//   return (
//     <div className="mb-4">
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h5 className="mb-0">
//           <i className="fas fa-chart-line me-2 text-primary" />
//           {t('monthlyOverview')}
//         </h5>
//         <span className="badge bg-light text-dark">
//           {t('month')} {month} / {year}
//         </span>
//       </div>

//       {/* Stats Grid */}
//       <div className="row">
//         <StatCard
//           icon="fa-briefcase"
//           label={t('workingDays')}
//           value={totals.workingDays}
//           color="primary"
//         />

//         <StatCard
//           icon="fa-calendar-times"
//           label={t('absentDays')}
//           value={totals.absentDays}
//           color="danger"
//         />

//         <StatCard
//           icon="fa-plane-departure"
//           label={t('paidLeaveDays')}
//           value={totals.paidLeaveDays}
//           color="success"
//         />

//         <StatCard
//           icon="fa-user-slash"
//           label={t('unpaidLeaveDays')}
//           value={totals.unpaidLeaveDays}
//           color="warning"
//         />

//         <StatCard
//           icon="fa-clock"
//           label={t('totalLateMinutes')}
//           value={totals.totalLateMinutes}
//           color="warning"
//           sub={t('minutes')}
//         />

//         <StatCard
//           icon="fa-door-open"
//           label={t('totalEarlyLeaveMinutes')}
//           value={totals.totalEarlyLeaveMinutes}
//           color="info"
//           sub={t('minutes')}
//         />

//         <StatCard
//           icon="fa-route"
//           label={t('transitDeduction')}
//           value={totals.totalTransitDeductionMinutes}
//           color="secondary"
//           sub={t('minutes')}
//         />

//         <StatCard
//           icon="fa-ban"
//           label={t('invalidDays')}
//           value={totals.invalidDays}
//           color="dark"
//         />
//       </div>

//       {/* Info Note */}
//       <div className="alert alert-warning mt-3 small">
//         <i className="fas fa-info-circle me-2" />
//         {t('monthlyStatsPreviewNote')}
//       </div>
//     </div>
//   );
// }

// // function UserStats({ monthlyReport }) {
// //   const { t } = useTranslation();

// //   if (!monthlyReport) {
// //     return (
// //       <div className="alert alert-info text-center">
// //         {t('selectMonthFirst')}
// //       </div>
// //     );
// //   }

// //   const { totals } = monthlyReport;

// //   return (
// //     <div className="mb-4">
// //       <h5 className="mb-3">
// //         <i className="fas fa-chart-bar me-2 text-primary"></i>
// //         {t('monthlyOverview')}
// //       </h5>

// //       <div className="row">
// //         <StatCard
// //           icon="fa-briefcase"
// //           label={t('workingDays')}
// //           value={totals.workingDays}
// //           color="primary"
// //         />

// //         <StatCard
// //           icon="fa-calendar-times"
// //           label={t('absent')}
// //           value={totals.absentDays}
// //           color="danger"
// //         />

// //         <StatCard
// //           icon="fa-clock"
// //           label={t('totalLateMinutes')}
// //           value={totals.totalLateMinutes}
// //           color="warning"
// //         />

// //         <StatCard
// //           icon="fa-route"
// //           label={t('transit')}
// //           value={totals.totalTransitDeductionMinutes}
// //           color="info"
// //         />
// //       </div>
// //     </div>
// //   );
// // }

// // export default UserStats;


// import { useTranslation } from 'react-i18next';

// /* ===============================
//    Reusable Stat Card
// ================================ */
// function StatCard({ icon, label, value, color, sub, highlight }) {
//   return (
//     <div className="col-xl-3 col-md-4 col-sm-6 mb-3">
//       <div
//         className={`card h-100 border-0 shadow-sm stat-card ${
//           highlight ? 'stat-card-main' : ''
//         }`}
//       >
//         <div className="card-body text-center">
//           <div
//             className={`icon-wrapper mb-2 bg-${color}-subtle text-${color}`}
//           >
//             <i className={`fas ${icon}`} />
//           </div>

//           <h2 className={`fw-bold text-${color} mb-0`}>
//             {value ?? 0}
//           </h2>

//           <div className="text-muted small">{label}</div>
//           {sub && <small className="text-muted">{sub}</small>}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ===============================
//    UserStats Component
// ================================ */
// function UserStats({
//   monthlyReport,
//   showPayroll = false // admin only
// }) {
//   const { t } = useTranslation();

//   if (!monthlyReport || !monthlyReport.totals) {
//     return (
//       <div className="alert alert-info mt-3">
//         <i className="fas fa-calendar-alt me-2" />
//         {t('selectMonthToViewStats')}
//       </div>
//     );
//   }

//   const { totals, month, year, salary } = monthlyReport;

//   return (
//     <div className="mb-4">

//       {/* ================= Header ================= */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h5 className="mb-0">
//           <i className="fas fa-chart-line me-2 text-primary" />
//           {t('monthlyOverview')}
//         </h5>

//         <span className="badge bg-light text-dark">
//           {t('month')} {month} / {year}
//         </span>
//       </div>

//       {/* ================= Main KPIs ================= */}
//       <div className="row mb-3">
//         <StatCard
//           icon="fa-briefcase"
//           label={t('workingDays')}
//           value={totals.workingDays}
//           color="primary"
//           highlight
//         />

//         <StatCard
//           icon="fa-calendar-times"
//           label={t('absentDays')}
//           value={totals.absentDays}
//           color="danger"
//           highlight
//         />

//         <StatCard
//           icon="fa-route"
//           label={t('transitDeduction')}
//           value={totals.totalTransitDeductionMinutes}
//           color="secondary"
//           sub={t('minutes')}
//           highlight
//         />
//       </div>

//       {/* ================= Secondary Stats ================= */}
//       <div className="row">
//         <StatCard
//           icon="fa-plane-departure"
//           label={t('paidLeaveDays')}
//           value={totals.paidLeaveDays}
//           color="success"
//         />

//         <StatCard
//           icon="fa-user-slash"
//           label={t('unpaidLeaveDays')}
//           value={totals.unpaidLeaveDays}
//           color="warning"
//         />

//         <StatCard
//           icon="fa-clock"
//           label={t('totalLateMinutes')}
//           value={totals.totalLateMinutes}
//           color="warning"
//           sub={t('minutes')}
//         />

//         <StatCard
//           icon="fa-door-open"
//           label={t('totalEarlyLeaveMinutes')}
//           value={totals.totalEarlyLeaveMinutes}
//           color="info"
//           sub={t('minutes')}
//         />

//         <StatCard
//           icon="fa-ban"
//           label={t('invalidDays')}
//           value={totals.invalidDays}
//           color="dark"
//         />
//       </div>

//       {/* ================= Payroll Section (Admin) ================= */}
//       {showPayroll && salary && (
//         <div className="card border-success shadow-sm mt-4 payroll-card">
//           <div className="card-body">
//             <h6 className="fw-bold mb-3 text-success">
//               <i className="fas fa-wallet me-2"></i>
//               {t('salaryDetails')}
//             </h6>

//             <div className="d-flex justify-content-between mb-2">
//               <span>{t('baseSalary')}</span>
//               <strong>{salary.base}</strong>
//             </div>

//             <div className="small text-danger mb-2">
//               <div>- {t('absence')} {salary.absence}</div>
//               <div>- {t('late')} {salary.late}</div>
//               <div>- {t('early')} {salary.early}</div>
//               <div>- {t('transit')} {salary.transit}</div>
//             </div>

//             <hr />

//             <div className="d-flex justify-content-between fw-bold fs-5 text-success">
//               <span>{t('netSalary')}</span>
//               <span>{salary.net}</span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ================= Preview Note ================= */}
//       <div className="alert alert-warning mt-3 small d-flex align-items-center">
//         <i className="fas fa-info-circle me-2 fs-5" />
//         <span>{t('monthlyStatsPreviewNote')}</span>
//       </div>
//     </div>
//   );
// }

// export default UserStats;



import { useTranslation } from 'react-i18next';

/* ===============================
   Simple Professional Stat Card
================================ */
function StatCard({ icon, label, value, color, suffix }) {
  return (
    <div className="col-xl-3 col-md-4 col-sm-6 mb-3">
      <div className="card h-100 border-0 shadow-sm stat-card-clean">
        <div className="card-body d-flex align-items-center">
          <div className={`stat-icon text-${color} me-3`}>
            <i className={`fas ${icon}`} />
          </div>

          <div>
            <div className={`stat-value text-${color}`}>
              {value ?? 0}
              {suffix && <small className="ms-1">{suffix}</small>}
            </div>
            <div className="stat-label">{label}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===============================
   UserStats
================================ */
function UserStats({ monthlyReport, showPayroll = false }) {
  const { t } = useTranslation();

  if (!monthlyReport || !monthlyReport.totals) {
    return (
      <div className="alert alert-info mt-3">
        <i className="fas fa-calendar-alt me-2" />
        {t('selectMonthToViewStats')}
      </div>
    );
  }

  const { totals, month, year, salary } = monthlyReport;

  return (
    <div className="mb-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0 fw-semibold">
          {t('monthlyOverview')}
        </h5>
        <span className="text-warning small">
          {t('month')} {month} / {year}
        </span>
      </div>

      {/* Main stats */}
      <div className="row">
        <StatCard
          icon="fa-briefcase"
          label={t('workingDays')}
          value={totals.workingDays}
          color="primary"
        />

        <StatCard
          icon="fa-calendar-times"
          label={t('absentDays')}
          value={totals.absentDays}
          color="danger"
        />

        <StatCard
          icon="fa-plane-departure"
          label={t('paidLeaveDays')}
          value={totals.paidLeaveDays}
          color="success"
        />

        <StatCard
          icon="fa-user-slash"
          label={t('unpaidLeaveDays')}
          value={totals.unpaidLeaveDays}
          color="warning"
        />

        <StatCard
          icon="fa-clock"
          label={t('totalLateMinutes')}
          value={totals.totalLateMinutes}
          color="warning"
          suffix={t('minutes')}
        />

        <StatCard
          icon="fa-door-open"
          label={t('totalEarlyLeaveMinutes')}
          value={totals.totalEarlyLeaveMinutes}
          color="info"
          suffix={t('minutes')}
        />

        <StatCard
          icon="fa-route"
          label={t('transitDeduction')}
          value={totals.totalTransitDeductionMinutes}
          color="secondary"
          suffix={t('minutes')}
        />

        <StatCard
          icon="fa-ban"
          label={t('invalidDays')}
          value={totals.invalidDays}
          color="dark"
        />
      </div>

      {/* Payroll (Admin only) */}
      {showPayroll && salary && (
        <div className="card border-0 shadow-sm mt-4">
          <div className="card-body">
            <h6 className="fw-semibold mb-3">
              {t('salaryDetails')}
            </h6>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">{t('baseSalary')}</span>
              <strong>{salary.base}</strong>
            </div>

            <div className="small text-muted mb-2">
              <div>- {t('absence')} : {salary.absence}</div>
              <div>- {t('late')} : {salary.late}</div>
              <div>- {t('early')} : {salary.early}</div>
              <div>- {t('transit')} : {salary.transit}</div>
            </div>

            <hr />

            <div className="d-flex justify-content-between fw-bold">
              <span>{t('netSalary')}</span>
              <span className="text-success">{salary.net}</span>
            </div>
          </div>
        </div>
      )}

      {/* Info note */}
      <div className="alert alert-light mt-3 small">
        <i className="fas fa-info-circle me-2" />
        {t('monthlyStatsPreviewNote')}
      </div>
    </div>
  );
}

export default UserStats;
