// // src/pages/Reports/components/UserMonthReport.jsx
// import { useTranslation } from 'react-i18next';
// import { UserKpiCards }   from './ReportSummaryCards';
// import DailyDetailsTable  from './DailyDetailsTable';

// function fmt(v, dec = 2) {
//   if (v == null) return '—';
//   const n = Number(v);
//   if (isNaN(n)) return '—';
//   return n.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
// }
// function fmtMin(m) { if (!m) return '—'; return `${Math.floor(m/60)}h ${m%60}m`; }
// function fmtDate(d) { if (!d) return '—'; return new Date(d).toLocaleDateString(); }

// /* Payroll status badge */
// function PayrollBadge({ status }) {
//   const { t } = useTranslation('companyReport');
//   return (
//     <span className={`payroll-badge ${status}`}>
//       {status === 'approved'      && <i className="fa-solid fa-circle-check" />}
//       {status === 'draft'         && <i className="fa-solid fa-clock" />}
//       {status === 'not_generated' && <i className="fa-solid fa-circle-xmark" />}
//       {t(`payrollStatus.${status}`, { defaultValue: status })}
//     </span>
//   );
// }

// /* Leave balance bar */
// function LeaveBalCard({ type, total, used, color }) {
//   const pct = total > 0 ? Math.min(100, (used / total) * 100) : 0;
//   const { t } = useTranslation('companyReport');
//   return (
//     <div className="leave-bal-card">
//       <div className="leave-bal-type">{t(`table.${type}`)}</div>
//       <div className="leave-bal-bar-wrap">
//         <div className={`leave-bal-bar ${color}`} style={{ width: `${pct}%` }} />
//       </div>
//       <div className="leave-bal-nums">
//         <span>{t('table.used')}: <strong>{used}</strong></span>
//         <span>{t('table.remaining')}: <strong>{Math.max(0, total - used)}</strong></span>
//       </div>
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════
//    MAIN
// ═══════════════════════════════════════════ */
// export default function UserMonthReport({ report }) {
//   const { t } = useTranslation('companyReport');
//   if (!report) return null;

//   const {
//     userBasic:  u  = {},
//     payrollStatus,
//     payrollRun: pr,
//     attendanceStats: att = {},
//     days     = [],
//     leaves   = [],
//     overtime = [],
//     leaveBalance: lb,
//   } = report;

//   return (
//     <div>
//       {/* ── Employee Info ─────────────────── */}
//       <div className="report-section">
//         <div className="section-title">
//           <i className="fa-solid fa-user-tie" />
//           {t('sections.employeeInfo')}
//           <span className="ms-auto">
//             <PayrollBadge status={payrollStatus || 'not_generated'} />
//           </span>
//         </div>
//         <div className="info-grid">
//           {[
//             ['Name',        u.name],
//             ['Email',       u.email],
//             ['Role',        u.role],
//             ['Branch',      (u.branches||[]).map(b=>b.name).join(', ')||'—'],
//             ['Department',  (u.departments||[]).map(d=>d.name).join(', ')||'—'],
//             ['Base Salary', fmt(u.salary)],
//             ['Work Hours',  u.workStartTime&&u.workEndTime ? `${u.workStartTime}→${u.workEndTime}` : '—'],
//             ['Status',      u.currentStatus||'active'],
//           ].map(([k,v]) => (
//             <div key={k} className="info-row">
//               <span className="info-label">{k}</span>
//               <span className="info-value">{v||'—'}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ── KPI Cards ────────────────────── */}
//       <UserKpiCards att={att} payroll={pr} />

//       {/* ── Payroll Details ──────────────── */}
//       {pr && (
//         <div className="report-section">
//           <div className="section-title">
//             <i className="fa-solid fa-money-bill-wave" />
//             {t('sections.payrollDetails')}
//             {pr.approvedAt && (
//               <small className="ms-2" style={{ color:'#aaa', fontWeight:400 }}>
//                 {fmtDate(pr.approvedAt)}
//               </small>
//             )}
//           </div>

//           <div className="row g-3">
//             {/* Left: salary breakdown */}
//             <div className="col-md-6">
//               <table className="report-table" style={{ minWidth: 'unset' }}>
//                 <tbody>
//                   {[
//                     ['Base Salary',      fmt(pr.baseSalary),              '#212529'],
//                     ['Daily Rate',       fmt(pr.dailySalary),             '#212529'],
//                     ['Hourly Rate',      fmt(pr.hourlySalary),            '#212529'],
//                     ['Expected Days',    fmt(pr.expectedWorkingDays, 0),  '#212529'],
//                     ['Actual Days',      fmt(pr.actualWorkingDays,   0),  '#212529'],
//                   ].map(([k,v]) => (
//                     <tr key={k}>
//                       <td className="text-start" style={{ color:'#6c757d', fontWeight:600 }}>{k}</td>
//                       <td style={{ fontWeight:600 }}>{v}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Right: deductions */}
//             <div className="col-md-6">
//               <table className="report-table" style={{ minWidth: 'unset' }}>
//                 <tbody>
//                   {[
//                     ['Absence Deduction', fmt(pr.deductions?.absence),   '#dc3545'],
//                     ['Late Deduction',    fmt(pr.deductions?.late),      '#fd7e14'],
//                     ['Early Leave',       fmt(pr.deductions?.earlyLeave),'#fd7e14'],
//                     ['Transit',           fmt(pr.deductions?.transit),   '#fd7e14'],
//                     ['Total Deductions',  fmt(pr.deductions?.total),     '#dc3545'],
//                     ['Overtime',          fmt(pr.overtime?.total, 2),    '#198754'],
//                     ['Bonus',             fmt(pr.bonus?.total, 2),       '#6f42c1'],
//                   ].map(([k,v,c]) => (
//                     <tr key={k}>
//                       <td className="text-start" style={{ color:'#6c757d', fontWeight:600 }}>{k}</td>
//                       <td style={{ fontWeight:600, color:c }}>{v}</td>
//                     </tr>
//                   ))}
//                   <tr style={{ background:'#fff3cd' }}>
//                     <td className="text-start" style={{ fontWeight:700 }}>NET SALARY</td>
//                     <td style={{ fontWeight:800, color:'#1F3864', fontSize:'1rem' }}>
//                       {fmt(pr.netSalary)}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Leave Balance ─────────────────── */}
//       {lb && (
//         <div className="report-section">
//           <div className="section-title">
//             <i className="fa-solid fa-umbrella-beach" />
//             {t('sections.leaveBalance')} — {lb.year}
//           </div>
//           <div className="leave-balance-grid">
//             <LeaveBalCard type="annual" total={lb.annual?.total||0} used={lb.annual?.usedPaid||0} color="" />
//             <LeaveBalCard type="sick"   total={lb.sick?.total||0}   used={lb.sick?.usedPaid||0}   color="sick" />
//             <div className="leave-bal-card">
//               <div className="leave-bal-type">{t('table.unpaid')} / Absent</div>
//               <div style={{ fontSize:'1.1rem', fontWeight:700, color:'#dc3545', marginTop:4 }}>
//                 {(lb.unpaid?.unpaidLeaveDays||0) + (lb.unpaid?.absentDays||0)} days
//               </div>
//               <div style={{ fontSize:'0.75rem', color:'#aaa', marginTop:2 }}>
//                 Unpaid leaves + absences
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Leaves ───────────────────────── */}
//       {leaves.length > 0 && (
//         <div className="report-section">
//           <div className="section-title">
//             <i className="fa-solid fa-plane-departure" />
//             {t('sections.leaves')}
//             <span className="ms-2 badge bg-secondary" style={{ fontSize:'0.75rem' }}>
//               {leaves.length}
//             </span>
//           </div>
//           <div className="report-table-wrap">
//             <table className="report-table">
//               <thead>
//                 <tr>
//                   <th>{t('table.leaveType')}</th>
//                   <th>{t('table.startDate')}</th>
//                   <th>{t('table.endDate')}</th>
//                   <th>{t('table.days')}</th>
//                   <th>{t('table.paid')}</th>
//                   <th>{t('table.status')}</th>
//                   <th>{t('table.reason')}</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {leaves.map(l => (
//                   <tr key={l.id}
//                     style={{ background: l.status==='approved' ? '#e8f5e9' : l.status==='pending' ? '#fff3cd' : '#fce4d6' }}
//                   >
//                     <td style={{ fontWeight:600 }}>
//                       {t(`leaveType.${l.leaveType}`, { defaultValue: l.leaveType })}
//                     </td>
//                     <td>{fmtDate(l.startDate)}</td>
//                     <td>{fmtDate(l.endDate)}</td>
//                     <td><strong>{l.totalDays}</strong></td>
//                     <td>
//                       <span style={{ color: l.isPaid ? '#198754' : '#dc3545', fontWeight:600 }}>
//                         {l.isPaid ? '✓' : '✗'}
//                       </span>
//                     </td>
//                     <td>
//                       <span className={`badge ${
//                         l.status==='approved' ? 'bg-success'
//                         : l.status==='pending' ? 'bg-warning text-dark'
//                         : 'bg-danger'
//                       }`}>
//                         {l.status}
//                       </span>
//                     </td>
//                     <td className="text-start" style={{ color:'#6c757d', fontSize:'0.8rem' }}>
//                       {l.reason || '—'}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* ── Overtime ─────────────────────── */}
//       {overtime.length > 0 && (
//         <div className="report-section">
//           <div className="section-title">
//             <i className="fa-solid fa-bolt" />
//             {t('sections.overtime')}
//             <span className="ms-auto" style={{ fontWeight:700, color:'#198754' }}>
//               Total: {fmt(overtime.reduce((s, e) => s + (e.amount||0), 0))}
//             </span>
//           </div>
//           <div className="report-table-wrap">
//             <table className="report-table">
//               <thead>
//                 <tr>
//                   <th>{t('table.date')}</th>
//                   <th>{t('table.otType')}</th>
//                   <th>{t('table.minutes')}</th>
//                   <th>{t('table.capped')}</th>
//                   <th>{t('table.rate')}</th>
//                   <th>{t('table.amount')}</th>
//                   <th>{t('table.source')}</th>
//                   <th>{t('table.notes')}</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {overtime.map(e => (
//                   <tr key={e.id} style={{ background:'#e8f5e9' }}>
//                     <td>{fmtDate(e.date)}</td>
//                     <td style={{ fontWeight:600 }}>
//                       {t(`otType.${e.type}`, { defaultValue: e.type })}
//                     </td>
//                     <td>{e.minutes}</td>
//                     <td>{e.cappedMinutes}</td>
//                     <td>
//                       {e.rateType === 'multiplier'
//                         ? `×${e.multiplier}`
//                         : `${fmt(e.fixedRatePerHour)}/h`}
//                     </td>
//                     <td style={{ fontWeight:700, color:'#198754' }}>{fmt(e.amount)}</td>
//                     <td><span className="badge bg-secondary" style={{ fontSize:'0.7rem' }}>{e.source}</span></td>
//                     <td className="text-start" style={{ color:'#6c757d', fontSize:'0.78rem' }}>
//                       {e.notes || '—'}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* ── Daily Details ─────────────────── */}
//       <div className="report-section">
//         <div className="section-title">
//           <i className="fa-solid fa-calendar-days" />
//           {t('sections.dailyDetails')}
//           <span className="ms-2" style={{ color:'#aaa', fontWeight:400, fontSize:'0.8rem' }}>
//             {days.length} days
//           </span>
//         </div>
//         <DailyDetailsTable days={days} />
//       </div>
//     </div>
//   );
// }

// src/pages/Reports/components/UserMonthReport.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DailyDetailsTable from './DailyDetailsTable';

/* ── utils ──────────────────────────────────────────────── */
function fmt(v, dec = 2) {
  if (v == null || v === '') return '—';
  const n = Number(v);
  if (isNaN(n)) return '—';
  return n.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function fmtMin(m) {
  if (!m && m !== 0) return '—';
  if (m === 0) return '0m';
  const h = Math.floor(Math.abs(m) / 60);
  const min = Math.abs(m) % 60;
  return h ? `${h}h ${min}m` : `${min}m`;
}
function fmtDate(d) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
  } catch { return String(d); }
}
function fmtDateShort(d) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-GB', { day:'2-digit', month:'short' });
  } catch { return String(d); }
}

/* ── sub-components ─────────────────────────────────────── */

/** Collapsible section wrapper */
function Section({ title, icon, color = '#1F3864', badge, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="umr-section">
      <button
        className="umr-section-header"
        onClick={() => setOpen(p => !p)}
        style={{ '--accent': color }}
      >
        <span className="umr-section-icon" style={{ color }}>{icon}</span>
        <span className="umr-section-title">{title}</span>
        {badge != null && <span className="umr-badge">{badge}</span>}
        <i className={`fa-solid fa-chevron-${open ? 'up' : 'down'} umr-chevron`} />
      </button>
      {open && <div className="umr-section-body">{children}</div>}
    </div>
  );
}

/** KPI pill */
function Kpi({ label, value, sub, color, icon, danger }) {
  return (
    <div className={`umr-kpi ${danger ? 'danger' : ''}`} style={{ '--kc': color || '#1F3864' }}>
      {icon && <span className="umr-kpi-icon">{icon}</span>}
      <div className="umr-kpi-body">
        <div className="umr-kpi-value">{value}</div>
        <div className="umr-kpi-label">{label}</div>
        {sub && <div className="umr-kpi-sub">{sub}</div>}
      </div>
    </div>
  );
}

/* ── Payroll status badge ────────────────────────────────── */
function PayrollBadge({ status }) {
  const map = {
    approved:      { bg:'#d1fae5', color:'#065f46', label:'Approved', icon:'✓' },
    draft:         { bg:'#fef9c3', color:'#854d0e', label:'Draft',    icon:'⏳' },
    not_generated: { bg:'#fee2e2', color:'#991b1b', label:'Not Generated', icon:'✗' },
  };
  const c = map[status] || map.not_generated;
  return (
    <span style={{
      background:c.bg, color:c.color,
      borderRadius:20, padding:'3px 12px',
      fontWeight:700, fontSize:'0.78rem',
      display:'inline-flex', alignItems:'center', gap:5,
    }}>
      {c.icon} {c.label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   EMPLOYEE INFO CARD
═══════════════════════════════════════════════════════════ */
function EmployeeInfoCard({ user, period, payrollStatus, payrollRun }) {
  if (!user) return null;
  const monthName = new Date(period.year, period.month - 1, 1)
    .toLocaleString('en-US', { month: 'long' });

  return (
    <div className="umr-info-card">
      <div className="umr-info-avatar">
        {(user.name || '?').charAt(0).toUpperCase()}
      </div>
      <div className="umr-info-main">
        <div className="umr-info-name">{user.name}</div>
        <div className="umr-info-meta">
          <span><i className="fa-solid fa-envelope" /> {user.email || '—'}</span>
          {(user.branches||[]).map(b => (
            <span key={b.id}><i className="fa-solid fa-building" /> {b.name}</span>
          ))}
          {(user.departments||[]).map(d => (
            <span key={d.id}><i className="fa-solid fa-sitemap" /> {d.name}</span>
          ))}
          <span><i className="fa-solid fa-briefcase" /> {user.role || '—'}</span>
        </div>
        <div className="umr-info-period">
          <i className="fa-solid fa-calendar-days" />
          {monthName} {period.year}
          <PayrollBadge status={payrollStatus} />
          {payrollRun?.approvedAt && (
            <span style={{ fontSize:'0.72rem', color:'#6c757d' }}>
              Approved: {fmtDate(payrollRun.approvedAt)}
            </span>
          )}
        </div>
      </div>
      <div className="umr-info-salary">
        <div className="umr-salary-label">Base Salary</div>
        <div className="umr-salary-value">{fmt(user.salary)}</div>
        <div className="umr-salary-sub">
          {user.workStartTime && user.workEndTime
            ? `${user.workStartTime} – ${user.workEndTime}`
            : `${user.workingHoursPerDay || 8}h / day`}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SALARY SUMMARY — net salary breakdown
═══════════════════════════════════════════════════════════ */
function SalarySummary({ payrollRun }) {
  if (!payrollRun) return (
    <div className="umr-no-payroll">
      <i className="fa-solid fa-triangle-exclamation" style={{ color:'#f59e0b' }} />
      No payroll run found for this period.
    </div>
  );

  const p = payrollRun;
  const rows = [
    { label:'Base Salary',        value: p.baseSalary,             sign:'+', color:'#1e40af' },
    { label:'Overtime',           value: p.overtime?.total,         sign:'+', color:'#7c3aed', hide: !p.overtime?.total },
    { label:'Bonus',              value: p.bonus?.total,            sign:'+', color:'#059669', hide: !p.bonus?.total },
    { label:'Deductions',         value: p.deductions?.total,       sign:'−', color:'#dc2626' },
  ];

  return (
    <div className="umr-salary-summary">
      {/* Top figures */}
      <div className="umr-salary-grid">
        <Kpi label="Daily Rate"   value={fmt(p.dailySalary)}   icon={<i className="fa-solid fa-coins" />}   color="#1e40af" />
        <Kpi label="Hourly Rate"  value={fmt(p.hourlySalary)}  icon={<i className="fa-solid fa-clock" />}   color="#1e40af" />
        <Kpi label="Expected Days" value={p.expectedWorkingDays} icon={<i className="fa-solid fa-calendar-check" />} color="#0369a1" />
        <Kpi label="Actual Days"  value={p.actualWorkingDays}  icon={<i className="fa-solid fa-calendar-day" />} color="#0369a1" />
      </div>

      {/* Waterfall */}
      <div className="umr-waterfall">
        {rows.filter(r => !r.hide).map((r, i) => (
          <div key={i} className="umr-wf-row">
            <span className="umr-wf-sign" style={{ color: r.sign === '+' ? '#059669' : '#dc2626' }}>{r.sign}</span>
            <span className="umr-wf-label">{r.label}</span>
            <span className="umr-wf-value" style={{ color: r.color }}>{fmt(r.value)}</span>
          </div>
        ))}
        <div className="umr-wf-divider" />
        <div className="umr-wf-net">
          <span>Net Salary</span>
          <span className="umr-wf-net-value">{fmt(p.netSalary)}</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DEDUCTIONS DETAIL
═══════════════════════════════════════════════════════════ */
function DeductionsDetail({ deductions, details, days = [] }) {
  if (!deductions) return null;
  const d = deductions;

  // Aggregate late/early minutes from days
  const totalLateMin  = (days || []).reduce((s, day) => s + (day.totalLateMinutes || 0), 0);
  const totalEarlyMin = (days || []).reduce((s, day) => s + (day.totalEarlyLeaveMinutes || 0), 0);
  const totalEarlyArr = (days || []).reduce((s, day) => s + (day.earlyArrivalMinutes || 0), 0);
  const totalLateDep  = (days || []).reduce((s, day) => s + (day.lateDepartureMinutes || 0), 0);
  const totalTransMin = (days || []).reduce((s, day) => s + (day.totalTransitDeductionMinutes || 0), 0);

  const items = [
    {
      label: 'Absence',
      amount: d.absence,
      icon: '🚫',
      color: '#dc2626',
      detail: `${details?.absences || 0} absent day(s)`,
    },
    {
      label: 'Late Arrivals',
      amount: d.late,
      icon: '⏰',
      color: '#f59e0b',
      detail: `${fmtMin(totalLateMin)} total · ${details?.lateDeductionDays || 0} day(s)`,
    },
    {
      label: 'Early Leave',
      amount: d.earlyLeave,
      icon: '🏃',
      color: '#f97316',
      detail: `${fmtMin(totalEarlyMin)} total`,
    },
    {
      label: 'Transit',
      amount: d.transit,
      icon: '🔄',
      color: '#8b5cf6',
      detail: `${fmtMin(totalTransMin)} total`,
    },
  ];

  return (
    <div>
      <div className="umr-deduct-grid">
        {items.map(item => (
          <div key={item.label} className="umr-deduct-card" style={{ '--dc': item.color }}>
            <div className="umr-deduct-icon">{item.icon}</div>
            <div className="umr-deduct-body">
              <div className="umr-deduct-amount" style={{ color: item.color }}>
                − {fmt(item.amount)}
              </div>
              <div className="umr-deduct-label">{item.label}</div>
              <div className="umr-deduct-detail">{item.detail}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="umr-deduct-total">
        <span>Total Deductions</span>
        <span style={{ color:'#dc2626', fontWeight:700 }}>− {fmt(d.total)}</span>
      </div>

      {/* Attendance summary row */}
      <div className="umr-att-summary">
        {totalEarlyArr > 0 && (
          <span className="umr-att-pill green">
            <i className="fa-solid fa-arrow-left" /> Early Arrival: {fmtMin(totalEarlyArr)}
          </span>
        )}
        {totalLateDep > 0 && (
          <span className="umr-att-pill purple">
            <i className="fa-solid fa-arrow-right" /> Late Departure: {fmtMin(totalLateDep)}
          </span>
        )}
        {details?.paidLeaveDays > 0 && (
          <span className="umr-att-pill blue">
            <i className="fa-solid fa-umbrella-beach" /> Paid Leave: {details.paidLeaveDays}d
          </span>
        )}
        {details?.approvedUnpaidDays > 0 && (
          <span className="umr-att-pill red">
            <i className="fa-solid fa-ban" /> Unpaid: {details.approvedUnpaidDays}d
          </span>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   OVERTIME DETAIL
═══════════════════════════════════════════════════════════ */
function OvertimeDetail({ overtime }) {
  if (!overtime) return null;

  const regular     = (overtime.breakdown || []).filter(e => e.type !== 'EXCEPTIONAL');
  const exceptional = (overtime.breakdown || []).filter(e => e.type === 'EXCEPTIONAL');

  const capApplied = overtime.actualMinutes > 0 &&
    overtime.paidMinutes < overtime.actualMinutes;

  return (
    <div>
      {/* Summary pills */}
      <div className="umr-ot-summary">
        <div className="umr-ot-pill">
          <span className="umr-ot-pill-label">Total Earned</span>
          <span className="umr-ot-pill-value green">{fmt(overtime.total)}</span>
        </div>
        <div className="umr-ot-pill">
          <span className="umr-ot-pill-label">Actual OT Minutes</span>
          <span className="umr-ot-pill-value">{fmtMin(overtime.actualMinutes)}</span>
        </div>
        <div className="umr-ot-pill">
          <span className="umr-ot-pill-label">Paid Minutes</span>
          <span className={`umr-ot-pill-value ${capApplied ? 'orange' : ''}`}>
            {fmtMin(overtime.paidMinutes)}
            {capApplied && <span className="umr-cap-badge">CAP APPLIED</span>}
          </span>
        </div>
      </div>

      {/* Regular overtime */}
      {regular.length > 0 && (
        <div className="umr-ot-block">
          <div className="umr-ot-block-title">
            <i className="fa-solid fa-bolt" style={{ color:'#7c3aed' }} /> Regular Overtime
            <span className="umr-ot-count">{regular.length} entries</span>
          </div>
          <table className="umr-mini-table">
            <thead>
              <tr>
                <th>Date</th><th>Source</th><th>Rate Type</th><th>Multiplier</th>
                <th>Minutes</th><th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {regular.map((e, i) => (
                <tr key={i}>
                  <td>{fmtDateShort(e.date)}</td>
                  <td><span className="umr-source-badge">{e.source || '—'}</span></td>
                  <td>{e.rateType || '—'}</td>
                  <td>{e.multiplier ? `×${e.multiplier}` : '—'}</td>
                  <td>{fmtMin(e.minutes)}</td>
                  <td style={{ fontWeight:600, color:'#7c3aed' }}>{fmt(e.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} style={{ textAlign:'right', fontWeight:700 }}>Subtotal</td>
                <td style={{ fontWeight:700, color:'#7c3aed' }}>
                  {fmt(regular.reduce((s, e) => s + (e.amount || 0), 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Exceptional bonus via overtime */}
      {exceptional.length > 0 && (
        <div className="umr-ot-block exceptional">
          <div className="umr-ot-block-title">
            <i className="fa-solid fa-star" style={{ color:'#d97706' }} /> Exceptional Bonus
            <span className="umr-ot-count orange">{exceptional.length} entries</span>
          </div>
          <table className="umr-mini-table">
            <thead>
              <tr><th>Date</th><th>Notes</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {exceptional.map((e, i) => (
                <tr key={i}>
                  <td>{fmtDateShort(e.date)}</td>
                  <td style={{ color:'#6b7280', fontSize:'0.82rem' }}>{e.notes || '—'}</td>
                  <td style={{ fontWeight:600, color:'#d97706' }}>{fmt(e.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} style={{ textAlign:'right', fontWeight:700 }}>Subtotal</td>
                <td style={{ fontWeight:700, color:'#d97706' }}>
                  {fmt(exceptional.reduce((s, e) => s + (e.amount || 0), 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {!regular.length && !exceptional.length && (
        <p className="umr-empty-note">No overtime entries this period.</p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BONUS DETAIL
═══════════════════════════════════════════════════════════ */
function BonusDetail({ bonus }) {
  if (!bonus) return null;

  // Separate exceptional from the bonus breakdown (they come from OT entries)
  const regularBonus    = (bonus.breakdown || []).filter(b => b.type !== 'EXCEPTIONAL');
  const exceptionalBonus= (bonus.breakdown || []).filter(b => b.type === 'EXCEPTIONAL');

  const typeConfig = {
    ATTENDANCE_BONUS: { icon:'🏆', label:'Attendance Bonus',  color:'#059669' },
    FIXED_BONUS:      { icon:'💰', label:'Fixed Bonus',        color:'#0369a1' },
    EXCEPTIONAL:      { icon:'⭐', label:'Exceptional Bonus',  color:'#d97706' },
  };

  return (
    <div>
      <div className="umr-bonus-total">
        Total Bonus <span style={{ color:'#059669', fontWeight:700 }}>{fmt(bonus.total)}</span>
      </div>

      {/* Regular bonus entries */}
      {regularBonus.length > 0 && (
        <div className="umr-bonus-list">
          {regularBonus.map((b, i) => {
            const cfg = typeConfig[b.type] || { icon:'🎁', label:b.type, color:'#6b7280' };
            return (
              <div key={i} className="umr-bonus-row">
                <span className="umr-bonus-icon">{cfg.icon}</span>
                <span className="umr-bonus-label">{cfg.label}</span>
                <span className="umr-bonus-amount" style={{ color: cfg.color }}>
                  + {fmt(b.amount)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Exceptional bonus rows (listed again here for clarity) */}
      {exceptionalBonus.length > 0 && (
        <div className="umr-ot-block exceptional" style={{ marginTop:'1rem' }}>
          <div className="umr-ot-block-title">
            <i className="fa-solid fa-star" style={{ color:'#d97706' }} /> Exceptional Bonuses
          </div>
          <table className="umr-mini-table">
            <thead><tr><th>Date</th><th>Notes</th><th>Amount</th></tr></thead>
            <tbody>
              {exceptionalBonus.map((b, i) => (
                <tr key={i}>
                  <td>{b.date ? fmtDateShort(b.date) : '—'}</td>
                  <td style={{ color:'#6b7280', fontSize:'0.82rem' }}>{b.notes || '—'}</td>
                  <td style={{ fontWeight:600, color:'#d97706' }}>{fmt(b.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!bonus.breakdown?.length && (
        <p className="umr-empty-note">No bonus this period.</p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   POLICY TIMELINE
   Shows: attendance policy (grace/rates/absence)
         overtime policy (monthlyCap)
         bonus policy (conditions)
═══════════════════════════════════════════════════════════ */
function PolicyTimeline({ policyTimeline = [] }) {
  if (!policyTimeline.length) return (
    <p className="umr-empty-note">No policy data recorded for this period.</p>
  );

  const scopeLabel = s => {
    if (!s) return '—';
    if (s === 'global') return '🌐 Global';
    if (s === 'branch') return '🏢 Branch';
    if (s === 'department') return '📂 Department';
    if (s === 'role') return '👤 Role';
    return s;
  };

  return (
    <div className="umr-policy-timeline">
      {policyTimeline.map((p, i) => (
        <div key={i} className="umr-policy-card">
          <div className="umr-policy-header">
            <div className="umr-policy-scope">
              {scopeLabel(p.scope)}
              {p.role && <span className="umr-policy-role">{p.role}</span>}
            </div>
            <div className="umr-policy-period">
              <i className="fa-regular fa-calendar" />
              {fmtDateShort(p.from)} → {fmtDateShort(p.to)}
            </div>
            <div className="umr-policy-version">v{p.version}</div>
          </div>

          <div className="umr-policy-body">
            {/* Grace */}
            {p.grace && (
              <div className="umr-policy-rule">
                <span className="umr-policy-rule-label">
                  <i className="fa-solid fa-clock" style={{ color:'#f59e0b' }} /> Grace Period
                </span>
                <span className="umr-policy-rule-value">
                  {p.grace.minutes ?? 0} min
                  {p.grace.policy && (
                    <span className="umr-policy-pill">{p.grace.policy}</span>
                  )}
                </span>
              </div>
            )}

            {/* Rates */}
            {p.rates && (
              <div className="umr-policy-rule">
                <span className="umr-policy-rule-label">
                  <i className="fa-solid fa-percent" style={{ color:'#6366f1' }} /> Deduction Rates
                </span>
                <span className="umr-policy-rule-value rates-row">
                  {p.rates.latePerMinute != null && (
                    <span className="umr-rate-chip orange">
                      Late ×{p.rates.latePerMinute}
                    </span>
                  )}
                  {p.rates.earlyLeavePerMinute != null && (
                    <span className="umr-rate-chip red">
                      Early Leave ×{p.rates.earlyLeavePerMinute}
                    </span>
                  )}
                  {p.rates.transitPerMinute != null && (
                    <span className="umr-rate-chip purple">
                      Transit ×{p.rates.transitPerMinute}
                    </span>
                  )}
                </span>
              </div>
            )}

            {/* Absence policy */}
            {p.absence && (
              <div className="umr-policy-rule">
                <span className="umr-policy-rule-label">
                  <i className="fa-solid fa-ban" style={{ color:'#dc2626' }} /> Absence Rule
                </span>
                <span className="umr-policy-rule-value">
                  {p.absence.deductSalary
                    ? <span className="umr-rate-chip red">Deduct {p.absence.dayRate ?? 1}× daily</span>
                    : <span className="umr-rate-chip green">No deduction</span>
                  }
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LEAVES SECTION
═══════════════════════════════════════════════════════════ */
function LeavesSection({ leaves = [], leaveBalance }) {
  const statusColor = s => ({
    approved:'#059669', pending:'#d97706', rejected:'#dc2626'
  }[s] || '#6b7280');

  return (
    <div>
      {/* Balance */}
      {leaveBalance && (
        <div className="umr-leave-balance">
          <div className="umr-lb-card">
            <div className="umr-lb-label">Annual Leave</div>
            <div className="umr-lb-bar">
              <div
                className="umr-lb-fill"
                style={{
                  width: `${leaveBalance.annual.total
                    ? Math.min(100, (leaveBalance.annual.usedPaid / leaveBalance.annual.total) * 100)
                    : 0}%`,
                  background: '#3b82f6',
                }}
              />
            </div>
            <div className="umr-lb-nums">
              <span>{leaveBalance.annual.usedPaid} used</span>
              <span style={{ color:'#059669', fontWeight:600 }}>
                {leaveBalance.annual.remaining} remaining
              </span>
              <span style={{ color:'#6b7280' }}>of {leaveBalance.annual.total}</span>
            </div>
          </div>
          <div className="umr-lb-card">
            <div className="umr-lb-label">Sick Leave</div>
            <div className="umr-lb-bar">
              <div
                className="umr-lb-fill"
                style={{
                  width: `${leaveBalance.sick.total
                    ? Math.min(100, (leaveBalance.sick.usedPaid / leaveBalance.sick.total) * 100)
                    : 0}%`,
                  background: '#f59e0b',
                }}
              />
            </div>
            <div className="umr-lb-nums">
              <span>{leaveBalance.sick.usedPaid} used</span>
              <span style={{ color:'#059669', fontWeight:600 }}>
                {leaveBalance.sick.remaining} remaining
              </span>
              <span style={{ color:'#6b7280' }}>of {leaveBalance.sick.total}</span>
            </div>
          </div>
        </div>
      )}

      {/* Leave list */}
      {leaves.length > 0 ? (
        <table className="umr-mini-table" style={{ marginTop:'1rem' }}>
          <thead>
            <tr><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Paid</th><th>Status</th></tr>
          </thead>
          <tbody>
            {leaves.map(l => (
              <tr key={l.id}>
                <td>{l.leaveType}</td>
                <td>{fmtDateShort(l.startDate)}</td>
                <td>{fmtDateShort(l.endDate)}</td>
                <td>{l.totalDays}</td>
                <td>{l.isPaid ? '✓' : '✗'}</td>
                <td>
                  <span style={{
                    color: statusColor(l.status),
                    fontWeight:600, fontSize:'0.78rem',
                    textTransform:'capitalize',
                  }}>
                    {l.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="umr-empty-note">No leave requests this period.</p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN — UserMonthReport
   report = buildUserReportData() output
═══════════════════════════════════════════════════════════ */
export default function UserMonthReport({ report }) {
  if (!report) return null;

  const {
    userBasic, period, payrollStatus, payrollRun,
    attendanceStats, days = [],
    leaves = [], overtime: _ot, leaveBalance,
  } = report;

  // ✅ Overtime/Bonus come from payrollRun (stored) when available,
  //    fallback to any recalculated data
  const overtime = payrollRun?.overtime || null;
  const bonus    = payrollRun?.bonus    || null;
  const deductions = payrollRun?.deductions || null;
  const details    = payrollRun?.details    || null;
  const policyTimeline = payrollRun?.policyTimeline || [];

  const hasOT    = (overtime?.total || 0) > 0 || (overtime?.breakdown?.length || 0) > 0;
  const hasBonus = (bonus?.total    || 0) > 0 || (bonus?.breakdown?.length    || 0) > 0;

  return (
    <div className="user-month-report">

      {/* ── Employee header ── */}
      <EmployeeInfoCard
        user={userBasic}
        period={period}
        payrollStatus={payrollStatus}
        payrollRun={payrollRun}
      />

      {/* ── Salary summary ── */}
      <Section title="Salary Summary" icon={<i className="fa-solid fa-coins" />} color="#1e40af">
        <SalarySummary payrollRun={payrollRun} />
      </Section>

      {/* ── Attendance KPIs ── */}
      <Section title="Attendance Overview" icon={<i className="fa-solid fa-calendar-check" />} color="#0369a1">
        <div className="umr-att-kpi-grid">
          <Kpi icon={<i className="fa-solid fa-check-circle" />}  label="Working Days"  value={attendanceStats?.workingDays ?? '—'}    color="#059669" />
          <Kpi icon={<i className="fa-solid fa-calendar-xmark" />} label="Absent"        value={attendanceStats?.absentDays ?? '—'}     color="#dc2626" danger={attendanceStats?.absentDays > 0} />
          <Kpi icon={<i className="fa-solid fa-umbrella-beach" />} label="Paid Leave"    value={attendanceStats?.paidLeaveDays ?? '—'}  color="#3b82f6" />
          <Kpi icon={<i className="fa-solid fa-ban" />}           label="Unpaid Leave"  value={attendanceStats?.unpaidLeaveDays ?? '—'} color="#6b7280" />
          <Kpi icon={<i className="fa-solid fa-sun" />}           label="Holidays"      value={attendanceStats?.holidayDays ?? '—'}    color="#f59e0b" />
          <Kpi icon={<i className="fa-solid fa-laptop-house" />}  label="Remote Days"   value={attendanceStats?.remoteWorkDays ?? '—'} color="#8b5cf6" />
          <Kpi icon={<i className="fa-solid fa-building" />}      label="On-site"       value={attendanceStats?.onsiteWorkDays ?? '—'} color="#0369a1" />
          <Kpi
            icon={<i className="fa-solid fa-clock" />}
            label="Total Late"
            value={fmtMin(attendanceStats?.totalLateMinutes)}
            color="#f59e0b"
            danger={attendanceStats?.totalLateMinutes > 0}
          />
        </div>
      </Section>

      {/* ── Deductions ── */}
      {deductions && (
        <Section
          title="Deductions"
          icon={<i className="fa-solid fa-circle-minus" />}
          color="#dc2626"
          badge={deductions.total > 0 ? `− ${fmt(deductions.total)}` : '0'}
        >
          <DeductionsDetail deductions={deductions} details={details} days={days} />
        </Section>
      )}

      {/* ── Overtime ── */}
      <Section
        title="Overtime"
        icon={<i className="fa-solid fa-bolt" />}
        color="#7c3aed"
        badge={hasOT ? `+ ${fmt(overtime?.total)}` : '0'}
        defaultOpen={hasOT}
      >
        <OvertimeDetail overtime={overtime} />
      </Section>

      {/* ── Bonus ── */}
      <Section
        title="Bonus"
        icon={<i className="fa-solid fa-gift" />}
        color="#059669"
        badge={hasBonus ? `+ ${fmt(bonus?.total)}` : '0'}
        defaultOpen={hasBonus}
      >
        <BonusDetail bonus={bonus} />
      </Section>

      {/* ── Leaves ── */}
      <Section
        title="Leaves"
        icon={<i className="fa-solid fa-umbrella-beach" />}
        color="#0369a1"
        badge={leaves.length || 0}
        defaultOpen={false}
      >
        <LeavesSection leaves={leaves} leaveBalance={leaveBalance} />
      </Section>

      {/* ── Policy Timeline ── */}
      <Section
        title="Applied Policies"
        icon={<i className="fa-solid fa-shield-halved" />}
        color="#6366f1"
        badge={policyTimeline.length}
        defaultOpen={false}
      >
        <PolicyTimeline policyTimeline={policyTimeline} />
      </Section>

      {/* ── Daily Details ── */}
      <Section
        title="Daily Details"
        icon={<i className="fa-solid fa-table-list" />}
        color="#374151"
        badge={days.length}
        defaultOpen={false}
      >
        <DailyDetailsTable days={days} />
      </Section>

    </div>
  );
}