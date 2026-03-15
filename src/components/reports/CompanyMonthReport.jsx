// // src/pages/Reports/components/CompanyMonthReport.jsx
// import { useTranslation }    from 'react-i18next';
// import { CompanyKpiCards }   from './ReportSummaryCards';
// import EmployeesTable from './EmployeesTable';

// function fmt(v, dec = 2) {
//   if (v == null) return '—';
//   const n = Number(v);
//   if (isNaN(n)) return '—';
//   return n.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
// }
// function fmtMin(m) { if (!m) return '—'; return `${Math.floor(m/60)}h ${m%60}m`; }

// /* Rankings section */
// function Rankings({ rankings = {} }) {
//   const { t } = useTranslation('companyReport');
//   const rankingDefs = [
//     { key: 'topLate',      valKey: 'totalLateMinutes',  fmt: v => fmtMin(v),   icon: 'fa-clock',      color: '#fd7e14' },
//     { key: 'topAbsent',    valKey: 'absentDays',        fmt: v => `${v} days`, icon: 'fa-calendar-xmark', color: '#dc3545' },
//     { key: 'topCommitted', valKey: 'workingDays',       fmt: v => `${v} days`, icon: 'fa-star',       color: '#198754' },
//     { key: 'topOvertime',  valKey: 'overtimeTotal',     fmt: v => fmt(v),      icon: 'fa-bolt',       color: '#6f42c1' },
//     { key: 'topBonus',     valKey: 'bonusTotal',        fmt: v => fmt(v),      icon: 'fa-gift',       color: '#0d6efd' },
//   ];

//   const medalCls = i => i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';

//   return (
//     <div className="report-section">
//       <div className="section-title">
//         <i className="fa-solid fa-trophy" />
//         {t('sections.rankings')}
//       </div>
//       <div className="rankings-grid">
//         {rankingDefs.map(({ key, valKey, fmt: fmtFn, icon, color }) => {
//           const items = rankings[key] || [];
//           if (!items.length) return null;
//           return (
//             <div key={key} className="ranking-card">
//               <div className="ranking-card-title">
//                 <i className={`fa-solid ${icon}`} style={{ color }} />
//                 {t(`rankings.${key}`)}
//               </div>
//               {items.slice(0, 5).map((item, i) => (
//                 <div key={item.userId} className="ranking-item">
//                   <span className={`ranking-num ${medalCls(i)}`}>{i + 1}</span>
//                   <span className="ranking-name">{item.name}</span>
//                   <span className="ranking-value" style={{ color }}>
//                     {fmtFn(item[valKey])}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// /* Skipped employees notice */
// function SkippedList({ skipped = [] }) {
//   const { t } = useTranslation('companyReport');
//   if (!skipped.length) return null;
//   return (
//     <div className="report-section">
//       <div className="section-title" style={{ color:'#856404' }}>
//         <i className="fa-solid fa-triangle-exclamation" style={{ color:'#ffc107' }} />
//         {t('sections.skipped')}
//         <span className="ms-2 badge bg-warning text-dark">{skipped.length}</span>
//       </div>
//       <div className="skipped-list">
//         {skipped.map(s => (
//           <span key={s.userId} className="skipped-chip" title={s.reason}>
//             {s.name}
//           </span>
//         ))}
//       </div>
//       <p style={{ fontSize:'0.8rem', color:'#aaa', marginTop:'0.5rem', marginBottom:0 }}>
//         These employees have no approved payroll for this period.
//       </p>
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════
//    MAIN
// ═══════════════════════════════════════════ */
// export default function CompanyMonthReport({ report, onSelectUser }) {
//   const { t } = useTranslation('companyReport');
//   if (!report) return null;

//   const { totals = {}, employees = [], rankings = {}, skipped = [], meta = {} } = report;
//   const { period, branchId, deptId } = report;

//   const periodStr = period
//     ? `${t(`months.${period.month}`)} ${period.year}`
//     : '';

//   return (
//     <div>
//       {/* Title bar */}
//       <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
//         <div>
//           <h5 style={{ fontWeight:700, color:'#1F3864', margin:0 }}>
//             {t('tabs.companyMonth')} — {periodStr}
//           </h5>
//           <small style={{ color:'#aaa' }}>
//             {branchId && branchId !== 'all' ? `Branch filtered` : 'All branches'}
//             {deptId   && deptId   !== 'all' ? ' · Dept filtered' : ''}
//             {' · '}{meta.totalUsersIncluded} {t('meta.employees')}
//             {meta.totalUsersSkipped > 0 && ` · ${meta.totalUsersSkipped} ${t('meta.skipped')}`}
//             {meta.payrollApprovedOnly && ` · ${t('meta.approvedOnly')}`}
//           </small>
//         </div>
//       </div>

//       {/* KPI Cards */}
//       <CompanyKpiCards totals={totals} empCount={meta.totalUsersIncluded} />

//       {/* Rankings */}
//       <Rankings rankings={rankings} />

//       {/* Employees table */}
//       <div className="report-section">
//         <div className="section-title">
//           <i className="fa-solid fa-users" />
//           {t('sections.employeesList')}
//           <span className="ms-2" style={{ color:'#aaa', fontWeight:400, fontSize:'0.8rem' }}>
//             {employees.length} {t('meta.employees')}
//           </span>
//         </div>
//         <EmployeesTable employees={employees} onSelectUser={onSelectUser} />
//       </div>

//       {/* Skipped */}
//       <SkippedList skipped={skipped} />
//     </div>
//   );
// }

// src/pages/Reports/components/CompanyMonthReport.jsx
import { useTranslation }  from 'react-i18next';
import { CompanyKpiCards } from './ReportSummaryCards';
import EmployeesTable      from './EmployeesTable';

function fmt(v, dec = 2) {
  if (v == null) return '—';
  const n = Number(v);
  if (isNaN(n)) return '—';
  return n.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function fmtMin(m) { if (!m) return '—'; return `${Math.floor(m/60)}h ${m%60}m`; }

/* Rankings */
function Rankings({ rankings = {} }) {
  const { t } = useTranslation('companyReport');
  const defs = [
    { key:'topLate',      valKey:'totalLateMinutes', fmtFn: v=>fmtMin(v), icon:'fa-clock',        color:'#fd7e14' },
    { key:'topAbsent',    valKey:'absentDays',        fmtFn: v=>`${v}d`,  icon:'fa-calendar-xmark',color:'#dc3545' },
    { key:'topCommitted', valKey:'workingDays',       fmtFn: v=>`${v}d`,  icon:'fa-star',          color:'#198754' },
    { key:'topOvertime',  valKey:'overtimeTotal',     fmtFn: v=>fmt(v),   icon:'fa-bolt',          color:'#6f42c1' },
    { key:'topBonus',     valKey:'bonusTotal',        fmtFn: v=>fmt(v),   icon:'fa-gift',          color:'#0d6efd' },
  ];
  const medalCls = i => i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';

  return (
    <div className="report-section">
      <div className="section-title">
        <i className="fa-solid fa-trophy" /> {t('sections.rankings')}
      </div>
      <div className="rankings-grid">
        {defs.map(({ key, valKey, fmtFn, icon, color }) => {
          const items = rankings[key] || [];
          if (!items.length) return null;
          return (
            <div key={key} className="ranking-card">
              <div className="ranking-card-title">
                <i className={`fa-solid ${icon}`} style={{ color }} />
                {t(`rankings.${key}`)}
              </div>
              {items.slice(0, 5).map((item, i) => (
                <div key={item.userId} className="ranking-item">
                  <span className={`ranking-num ${medalCls(i)}`}>{i + 1}</span>
                  <span className="ranking-name">{item.name}</span>
                  <span className="ranking-value" style={{ color }}>
                    {fmtFn(item[valKey])}
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Skipped notice */
function SkippedList({ skipped = [] }) {
  const { t } = useTranslation('companyReport');
  if (!skipped.length) return null;
  return (
    <div className="report-section">
      <div className="section-title" style={{ color:'#856404' }}>
        <i className="fa-solid fa-triangle-exclamation" style={{ color:'#ffc107' }} />
        {t('sections.skipped')}
        <span className="ms-2 badge bg-warning text-dark">{skipped.length}</span>
      </div>
      <div className="skipped-list">
        {skipped.map(s => (
          <span key={s.userId} className="skipped-chip" title={s.reason}>{s.name}</span>
        ))}
      </div>
      <p style={{ fontSize:'0.78rem', color:'#aaa', marginTop:'0.4rem', marginBottom:0 }}>
        No approved payroll for this period.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN — receives full report + pagination handlers
═══════════════════════════════════════════════════════════ */
export default function CompanyMonthReport({
  report,
  onSelectUser,
  onPageChange,   // (page) => void — triggers new API call in parent
}) {
  const { t } = useTranslation('companyReport');
  if (!report) return null;

  const { totals={}, employees=[], rankings={}, skipped=[], meta={}, pagination } = report;
  const { period, branchId, deptId } = report;

  const periodStr = period
    ? `${t(`months.${period.month}`)} ${period.year}` : '';

  return (
    <div>
      {/* Title bar */}
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div>
          <h5 style={{ fontWeight:700, color:'#1F3864', margin:0 }}>
            {t('tabs.companyMonth')} — {periodStr}
          </h5>
          <small style={{ color:'#aaa' }}>
            {branchId && branchId !== 'all' ? 'Branch filtered' : 'All branches'}
            {deptId   && deptId   !== 'all' ? ' · Dept filtered' : ''}
            {' · '}{meta.totalUsersIncluded} {t('meta.employees')}
            {meta.totalUsersSkipped > 0 && ` · ${meta.totalUsersSkipped} ${t('meta.skipped')}`}
            {meta.payrollApprovedOnly && ` · ${t('meta.approvedOnly')}`}
          </small>
        </div>
      </div>

      {/* KPI Cards */}
      <CompanyKpiCards totals={totals} empCount={meta.totalUsersIncluded} />

      {/* Rankings */}
      <Rankings rankings={rankings} />

      {/* Employees table */}
      <div className="report-section">
        <div className="section-title">
          <i className="fa-solid fa-users" />
          {t('sections.employeesList')}
          {pagination && (
            <span className="ms-2" style={{ color:'#aaa', fontWeight:400, fontSize:'0.8rem' }}>
              {pagination.total} {t('meta.employees')}
            </span>
          )}
        </div>
        <EmployeesTable
          employees={employees}
          pagination={pagination}
          onPageChange={onPageChange}
          onSelectUser={onSelectUser}
        />
      </div>

      {/* Skipped */}
      <SkippedList skipped={skipped} />
    </div>
  );
}