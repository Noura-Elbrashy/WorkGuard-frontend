// // src/pages/Reports/components/EmployeesTable.jsx
// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';

// function fmt(v, dec = 0) {
//   if (v == null) return '—';
//   const n = Number(v);
//   if (isNaN(n)) return '—';
//   return n.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
// }
// function fmtMin(m) {
//   if (!m) return '—';
//   return `${Math.floor(m / 60)}h ${m % 60}m`;
// }

// const PAGE_SIZE = 20;

// /**
//  * جدول الموظفين في التقرير الجماعي
//  * props:
//  *   employees — report.employees[]
//  *   onSelectUser — (userId, name) → يفتح تقرير الموظف الواحد
//  */
// export default function EmployeesTable({ employees = [], onSelectUser }) {
//   const { t } = useTranslation('companyReport');
//   const [search, setSearch]   = useState('');
//   const [page,   setPage]     = useState(1);
//   const [sortKey, setSortKey] = useState('name');
//   const [sortAsc, setSortAsc] = useState(true);

//   /* filter */
//   const filtered = employees.filter(e =>
//     (e.name || '').toLowerCase().includes(search.toLowerCase())
//   );

//   /* sort */
//   const sorted = [...filtered].sort((a, b) => {
//     let av, bv;
//     if (sortKey === 'name') {
//       av = a.name || ''; bv = b.name || '';
//       return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
//     }
//     const metricKeys = ['workingDays','absentDays','paidLeaveDays','unpaidLeaveDays',
//                         'totalLateMinutes','totalEarlyLeaveMinutes'];
//     if (metricKeys.includes(sortKey)) {
//       av = a.metrics?.[sortKey] ?? 0; bv = b.metrics?.[sortKey] ?? 0;
//     } else {
//       av = a.payroll?.[sortKey] ?? a.payroll?.deductions?.total ?? 0;
//       bv = b.payroll?.[sortKey] ?? b.payroll?.deductions?.total ?? 0;
//     }
//     return sortAsc ? av - bv : bv - av;
//   });

//   /* paginate */
//   const total  = sorted.length;
//   const pages  = Math.ceil(total / PAGE_SIZE) || 1;
//   const slice  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

//   const toggleSort = key => {
//     if (sortKey === key) setSortAsc(p => !p);
//     else { setSortKey(key); setSortAsc(true); }
//     setPage(1);
//   };

//   const Th = ({ label, skey }) => (
//     <th
//       style={{ cursor: 'pointer', userSelect: 'none' }}
//       onClick={() => toggleSort(skey)}
//     >
//       {label}
//       {sortKey === skey && (
//         <i className={`fa-solid fa-sort-${sortAsc ? 'up' : 'down'} ms-1`} style={{ fontSize: '0.7rem' }} />
//       )}
//     </th>
//   );

//   if (!employees.length) {
//     return (
//       <div className="report-empty">
//         <i className="fa-solid fa-users-slash" />
//         <p>{t('empty.noEmployees')}</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Search */}
//       <div className="d-flex align-items-center gap-2 mb-3">
//         <div style={{ position: 'relative', flex: 1, maxWidth: 260 }}>
//           <i className="fa-solid fa-search"
//              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: '0.8rem' }} />
//           <input
//             style={{ paddingLeft: 30, height: 34 }}
//             className="filter-group input form-control form-control-sm"
//             placeholder={t('filters.searchEmployee')}
//             value={search}
//             onChange={e => { setSearch(e.target.value); setPage(1); }}
//           />
//         </div>
//         <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>
//           {total} {t('meta.employees')}
//         </span>
//       </div>

//       {/* Table */}
//       <div className="report-table-wrap">
//         <table className="report-table">
//           <thead>
//             <tr>
//               <th>#</th>
//               <Th label={t('table.name')}        skey="name" />
//               <th>{t('table.branch')}</th>
//               <Th label={t('table.workDays')}    skey="workingDays" />
//               <Th label={t('table.absent')}      skey="absentDays" />
//               <Th label={t('table.paidLeave')}   skey="paidLeaveDays" />
//               <Th label={t('table.late')}        skey="totalLateMinutes" />
//               <Th label={t('table.baseSalary')}  skey="baseSalary" />
//               <Th label={t('table.deductions')}  skey="deductions" />
//               <Th label={t('table.overtime')}    skey="overtimeTotal" />
//               <Th label={t('table.netSalary')}   skey="netSalary" />
//               {onSelectUser && <th></th>}
//             </tr>
//           </thead>
//           <tbody>
//             {slice.map((emp, idx) => {
//               const m = emp.metrics  || {};
//               const p = emp.payroll  || {};
//               const br = (emp.branches || []).map(b => b.name).join(', ') || '—';
//               return (
//                 <tr key={emp.userId}>
//                   <td style={{ color: '#aaa', fontSize: '0.75rem' }}>
//                     {(page - 1) * PAGE_SIZE + idx + 1}
//                   </td>
//                   <td className="text-start" style={{ fontWeight: 600 }}>{emp.name}</td>
//                   <td>{br}</td>
//                   <td>{fmt(m.workingDays)}</td>
//                   <td>
//                     <span style={{ color: m.absentDays > 0 ? '#dc3545' : 'inherit', fontWeight: m.absentDays > 0 ? 600 : 400 }}>
//                       {fmt(m.absentDays)}
//                     </span>
//                   </td>
//                   <td>{fmt(m.paidLeaveDays)}</td>
//                   <td>
//                     <span style={{ color: m.totalLateMinutes > 0 ? '#fd7e14' : 'inherit' }}>
//                       {fmtMin(m.totalLateMinutes)}
//                     </span>
//                   </td>
//                   <td>{fmt(p.baseSalary, 2)}</td>
//                   <td>
//                     <span style={{ color: (p.deductions?.total || 0) > 0 ? '#dc3545' : 'inherit' }}>
//                       {fmt(p.deductions?.total, 2)}
//                     </span>
//                   </td>
//                   <td>{fmt(p.overtime?.total, 2)}</td>
//                   <td style={{ fontWeight: 700, color: '#1F3864' }}>{fmt(p.netSalary, 2)}</td>
//                   {onSelectUser && (
//                     <td>
//                       <button
//                         className="btn btn-sm btn-outline-primary py-0 px-2"
//                         style={{ fontSize: '0.75rem' }}
//                         onClick={() => onSelectUser(emp.userId, emp.name)}
//                         title="View Employee Report"
//                       >
//                         <i className="fa-solid fa-arrow-right" />
//                       </button>
//                     </td>
//                   )}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {pages > 1 && (
//         <div className="d-flex align-items-center justify-content-center gap-2 mt-3">
//           <button
//             className="btn btn-sm btn-outline-secondary"
//             disabled={page === 1}
//             onClick={() => setPage(p => p - 1)}
//           >
//             <i className="fa-solid fa-chevron-left" />
//           </button>
//           <span style={{ fontSize: '0.85rem', color: '#495057' }}>
//             {page} / {pages}
//           </span>
//           <button
//             className="btn btn-sm btn-outline-secondary"
//             disabled={page === pages}
//             onClick={() => setPage(p => p + 1)}
//           >
//             <i className="fa-solid fa-chevron-right" />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState } from 'react';
// src/pages/Reports/components/EmployeesTable.jsx
import { useTranslation } from 'react-i18next';

function fmt(v, dec = 0) {
  if (v == null) return '—';
  const n = Number(v);
  if (isNaN(n)) return '—';
  return n.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function fmtMin(m) {
  if (!m) return '—';
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

/* Payroll status mini-badge */
function PayrollStatusBadge({ status }) {
  if (!status) return null;
  const cfg = {
    approved:      { bg:'#d1f5e0', color:'#0a7a3e', label:'✓' },
    draft:         { bg:'#fff3cd', color:'#856404', label:'⏳' },
    not_generated: { bg:'#f8d7da', color:'#842029', label:'✗' },
  };
  const c = cfg[status] || cfg.not_generated;
  return (
    <span style={{
      background: c.bg, color: c.color,
      borderRadius: 10, padding: '1px 7px',
      fontSize: '0.72rem', fontWeight: 700,
    }}>
      {c.label}
    </span>
  );
}

/* Sort indicator */
function SortTh({ label, skey, sortKey, sortAsc, onSort, style }) {
  return (
    <th style={{ cursor:'pointer', userSelect:'none', ...style }} onClick={() => onSort(skey)}>
      {label}
      {sortKey === skey && (
        <i
          className={`fa-solid fa-sort-${sortAsc ? 'up' : 'down'} ms-1`}
          style={{ fontSize:'0.65rem', opacity:0.8 }}
        />
      )}
    </th>
  );
}

/* ═══════════════════════════════════════════════════════════
   EmployeesTable
   props:
     employees   — report.employees[]
     pagination  — { page, limit, total, totalPages, hasMore } from backend
     onPageChange — (page) => void
     onSelectUser — (userId) => void
═══════════════════════════════════════════════════════════ */
export default function EmployeesTable({
  employees   = [],
  pagination  = null,
  onPageChange,
  onSelectUser,
}) {
  const { t } = useTranslation('companyReport');

  // Client-side sort only (data for this page already from backend)
  const [sortKey, setSortKey] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);

  const toggleSort = key => {
    if (sortKey === key) setSortAsc(p => !p);
    else { setSortKey(key); setSortAsc(true); }
  };

  const sorted = [...employees].sort((a, b) => {
    let av, bv;
    if (sortKey === 'name') {
      av = a.name || ''; bv = b.name || '';
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    }
    const metricKeys = ['workingDays','absentDays','paidLeaveDays',
                        'unpaidLeaveDays','totalLateMinutes'];
    if (metricKeys.includes(sortKey)) {
      av = a.metrics?.[sortKey] ?? 0;
      bv = b.metrics?.[sortKey] ?? 0;
    } else {
      // payroll keys
      av = a.payroll?.[sortKey]                   // netSalary, baseSalary
        ?? a.payroll?.deductions?.total ?? 0;
      bv = b.payroll?.[sortKey]
        ?? b.payroll?.deductions?.total ?? 0;
    }
    return sortAsc ? av - bv : bv - av;
  });

  if (!employees.length) {
    return (
      <div className="report-empty">
        <i className="fa-solid fa-users-slash" />
        <p>{t('empty.noEmployees')}</p>
      </div>
    );
  }

  const thProps = { sortKey, sortAsc, onSort: toggleSort };

  return (
    <div>
      {/* Table */}
      <div className="report-table-wrap">
        <table className="report-table">
          <thead>
            <tr>
              <th style={{ width:32 }}>#</th>
              <SortTh label={t('table.name')}       skey="name"            {...thProps} style={{ textAlign:'left', minWidth:140 }} />
              <th>{t('table.branch')}</th>
              <th>{t('table.department')}</th>
              <th>
                {t('payrollStatus.approved').replace('Approved','')
                  || 'Payroll'}
              </th>
              <SortTh label={t('table.workDays')}   skey="workingDays"     {...thProps} />
              <SortTh label={t('table.absent')}     skey="absentDays"      {...thProps} />
              <SortTh label={t('table.paidLeave')}  skey="paidLeaveDays"   {...thProps} />
              <SortTh label={t('table.late')}       skey="totalLateMinutes"{...thProps} />
              <SortTh label={t('table.baseSalary')} skey="baseSalary"      {...thProps} />
              <SortTh label={t('table.deductions')} skey="deductions"      {...thProps} />
              <SortTh label={t('table.overtime')}   skey="overtimeTotal"   {...thProps} />
              <SortTh label={t('table.netSalary')}  skey="netSalary"       {...thProps} />
              {onSelectUser && <th></th>}
            </tr>
          </thead>
          <tbody>
            {sorted.map((emp, idx) => {
              const m  = emp.metrics || {};
              const p  = emp.payroll || null;
              const page = pagination?.page ?? 1;
              const limit= pagination?.limit ?? employees.length;
              const rowNum = (page - 1) * limit + idx + 1;

              const branchStr = (emp.branches    || []).map(b => b.name).join(', ') || '—';
              const deptStr   = (emp.departments || []).map(d => d.name).join(', ') || '—';

              return (
                <tr key={emp.userId}>
                  <td style={{ color:'#aaa', fontSize:'0.72rem' }}>{rowNum}</td>

                  <td className="text-start" style={{ fontWeight:600 }}>
                    {emp.name}
                  </td>

                  <td style={{ fontSize:'0.8rem', color:'#495057' }}>{branchStr}</td>

                  {/* ✅ Department column */}
                  <td style={{ fontSize:'0.8rem', color:'#495057' }}>{deptStr}</td>

                  {/* Payroll status badge */}
                  <td>
                    <PayrollStatusBadge status={emp.payrollStatus} />
                  </td>

                  <td>{fmt(m.workingDays)}</td>

                  <td>
                    <span style={{
                      color:      m.absentDays > 0 ? '#dc3545' : 'inherit',
                      fontWeight: m.absentDays > 0 ? 700 : 400,
                    }}>
                      {fmt(m.absentDays)}
                    </span>
                  </td>

                  <td>{fmt(m.paidLeaveDays)}</td>

                  <td>
                    <span style={{ color: m.totalLateMinutes > 0 ? '#fd7e14' : 'inherit' }}>
                      {fmtMin(m.totalLateMinutes)}
                    </span>
                  </td>

                  {/* Payroll figures — show '—' if no run */}
                  <td>{p ? fmt(p.baseSalary, 2) : '—'}</td>

                  <td>
                    <span style={{ color: (p?.deductions?.total ?? 0) > 0 ? '#dc3545' : 'inherit' }}>
                      {p ? fmt(p.deductions?.total, 2) : '—'}
                    </span>
                  </td>

                  <td style={{ color: (p?.overtime?.total ?? 0) > 0 ? '#6f42c1' : 'inherit' }}>
                    {p ? fmt(p.overtime?.total, 2) : '—'}
                  </td>

                  <td style={{ fontWeight:700, color:'#1F3864' }}>
                    {p ? fmt(p.netSalary, 2) : '—'}
                  </td>

                  {onSelectUser && (
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary py-0 px-2"
                        style={{ fontSize:'0.72rem' }}
                        onClick={() => onSelectUser(emp.userId, emp.name)}
                        title="View Employee Report"
                      >
                        <i className="fa-solid fa-arrow-right" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Backend Pagination ───────────────────────────── */}
      {pagination && pagination.totalPages > 1 && (
        <div className="d-flex align-items-center justify-content-between mt-3 flex-wrap gap-2">
          <span style={{ fontSize:'0.8rem', color:'#6c757d' }}>
            {t('meta.employees')}: {pagination.total} &nbsp;|&nbsp;
            Page {pagination.page} / {pagination.totalPages}
          </span>
          <div className="d-flex gap-1">
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={pagination.page === 1}
              onClick={() => onPageChange(1)}
            >
              <i className="fa-solid fa-angles-left" />
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={pagination.page === 1}
              onClick={() => onPageChange(pagination.page - 1)}
            >
              <i className="fa-solid fa-chevron-left" />
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
              const start = Math.max(1, pagination.page - 2);
              const pg    = start + i;
              if (pg > pagination.totalPages) return null;
              return (
                <button
                  key={pg}
                  className={`btn btn-sm ${pg === pagination.page ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => onPageChange(pg)}
                >
                  {pg}
                </button>
              );
            })}

            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={!pagination.hasMore}
              onClick={() => onPageChange(pagination.page + 1)}
            >
              <i className="fa-solid fa-chevron-right" />
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={!pagination.hasMore}
              onClick={() => onPageChange(pagination.totalPages)}
            >
              <i className="fa-solid fa-angles-right" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}