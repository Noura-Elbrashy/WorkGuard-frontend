// // src/pages/CompanyReportPage.jsx
// import { useState, useCallback, useRef } from 'react';
// import { useTranslation } from 'react-i18next';
// import Toast from '../components/ui/Toast';
// import { useCompanyReport } from '../hooks/useCompanyReport';
// import { companyReportService } from '../services/companyReport.api';

// /* ─────────────────────────────────────────────────────────────
//    🗓️  CONSTANTS
// ───────────────────────────────────────────────────────────── */
// const CURRENT_YEAR  = new Date().getFullYear();
// const YEARS         = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);
// const MONTHS        = Array.from({ length: 12 }, (_, i) => i + 1);

// /* ─────────────────────────────────────────────────────────────
//    🛠️  TINY HELPERS
// ───────────────────────────────────────────────────────────── */
// const fmt = (n, dec = 2) =>
//   n == null ? '—' : Number(n).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });

// const fmtInt = (n) =>
//   n == null ? '—' : Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });

// const fmtMin = (m) => {
//   if (!m) return '0h 0m';
//   const h = Math.floor(m / 60);
//   const min = m % 60;
//   return `${h}h ${min}m`;
// };

// const monthName = (m, lang = 'en') =>
//   new Date(2000, m - 1, 1).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'long' });

// /* ─────────────────────────────────────────────────────────────
//    🃏  KPI CARD
// ───────────────────────────────────────────────────────────── */
// function KpiCard({ icon, label, value, sub, color = 'primary', small = false }) {
//   return (
//     <div className={`card border-0 shadow-sm h-100 kpi-card kpi-${color}`}>
//       <div className="card-body d-flex align-items-center gap-3 py-3">
//         <div className={`kpi-icon bg-${color} bg-opacity-10 text-${color} rounded-3 d-flex align-items-center justify-content-center`}
//              style={{ width: 48, height: 48, fontSize: 22, flexShrink: 0 }}>
//           {icon}
//         </div>
//         <div className="overflow-hidden">
//           <div className={`text-muted mb-0 ${small ? 'small' : ''}`} style={{ fontSize: 12 }}>{label}</div>
//           <div className={`fw-bold lh-1 mt-1 ${small ? 'fs-6' : 'fs-5'}`}>{value}</div>
//           {sub && <div className="text-muted mt-1" style={{ fontSize: 11 }}>{sub}</div>}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────
//    🏆  RANKING TABLE
// ───────────────────────────────────────────────────────────── */
// function RankingTable({ title, icon, rows, valueKey, valueLabel, valueFormat = fmtInt, emptyMsg }) {
//   if (!rows?.length) return (
//     <div className="card border-0 shadow-sm h-100">
//       <div className="card-body text-center text-muted py-5">
//         <div style={{ fontSize: 32 }}>{icon}</div>
//         <div className="mt-2 small">{emptyMsg}</div>
//       </div>
//     </div>
//   );

//   const medals = ['🥇', '🥈', '🥉'];

//   return (
//     <div className="card border-0 shadow-sm h-100">
//       <div className="card-header bg-white border-0 pb-0 pt-3 px-3">
//         <h6 className="mb-0 fw-semibold d-flex align-items-center gap-2">
//           <span>{icon}</span> {title}
//         </h6>
//       </div>
//       <div className="card-body p-0">
//         <div className="list-group list-group-flush">
//           {rows.map((r, i) => (
//             <div key={r.userId || i}
//                  className="list-group-item list-group-item-action d-flex align-items-center justify-content-between px-3 py-2 border-0 border-bottom">
//               <div className="d-flex align-items-center gap-2">
//                 <span style={{ width: 28, textAlign: 'center', fontSize: 16 }}>
//                   {medals[i] || <span className="text-muted small">{i + 1}</span>}
//                 </span>
//                 <div>
//                   <div className="fw-semibold small">{r.name}</div>
//                 </div>
//               </div>
//               <span className="badge bg-light text-dark border fw-semibold">
//                 {valueFormat(r[valueKey])}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────
//    👤  EMPLOYEE ROW
// ───────────────────────────────────────────────────────────── */
// function EmployeeRow({ emp, index, t, lang }) {
//   const m = emp.metrics   || {};
//   const p = emp.payroll   || {};
//   const deducts = p.deductions?.total ?? 0;
//   const ot      = p.overtime?.total   ?? p.overtimeTotal ?? 0;
//   const bonus   = p.bonus?.total      ?? p.bonusTotal    ?? 0;
//   const branches = (emp.branches || []).map(b => b.name).join(', ') || '—';

//   const absentBad = (m.absentDays ?? 0) >= 3;

//   return (
//     <tr className={absentBad ? 'table-danger' : index % 2 === 0 ? '' : 'table-light'}>
//       <td className="text-muted small text-center">{index + 1}</td>
//       <td>
//         <div className="fw-semibold small">{emp.name}</div>
//         <div className="text-muted" style={{ fontSize: 11 }}>{emp.email}</div>
//       </td>
//       <td className="small">{branches}</td>
//       <td className="text-center small fw-semibold text-success">{fmtInt(m.workingDays)}</td>
//       <td className={`text-center small fw-semibold ${absentBad ? 'text-danger' : ''}`}>{fmtInt(m.absentDays)}</td>
//       <td className="text-center small">{fmtInt(m.paidLeaveDays)}</td>
//       <td className="text-center small">{fmtInt(m.unpaidLeaveDays)}</td>
//       <td className="text-center small text-info">{fmtInt(m.remoteWorkDays)}</td>
//       <td className={`text-center small ${(m.totalLateMinutes ?? 0) > 60 ? 'text-warning fw-semibold' : ''}`}>
//         {fmtMin(m.totalLateMinutes)}
//       </td>
//       <td className="text-center small">{fmtMin(m.totalEarlyLeaveMinutes)}</td>
//       <td className="text-end small fw-semibold">{fmt(p.baseSalary)}</td>
//       <td className="text-end small text-danger">{deducts > 0 ? `(${fmt(deducts)})` : '—'}</td>
//       <td className="text-end small text-success">{ot > 0 ? fmt(ot) : '—'}</td>
//       <td className="text-end small">{bonus > 0 ? fmt(bonus) : '—'}</td>
//       <td className="text-end small fw-bold">{fmt(p.netSalary)}</td>
//     </tr>
//   );
// }

// /* ─────────────────────────────────────────────────────────────
//    📅  MONTHLY BREAKDOWN TABLE (year report only)
// ───────────────────────────────────────────────────────────── */
// function MonthlyBreakdownTable({ months, totals, t, lang }) {
//   if (!months?.length) return null;

//   return (
//     <div className="card border-0 shadow-sm">
//       <div className="card-header bg-white border-0 py-3 px-4">
//         <h6 className="mb-0 fw-semibold">📆 {t('report.monthlyBreakdown')}</h6>
//       </div>
//       <div className="table-responsive">
//         <table className="table table-hover table-sm mb-0 align-middle">
//           <thead className="table-dark">
//             <tr>
//               <th>{t('report.month')}</th>
//               <th className="text-center">{t('report.workingDays')}</th>
//               <th className="text-center">{t('report.absent')}</th>
//               <th className="text-center">{t('report.paidLeave')}</th>
//               <th className="text-center">{t('report.lateMin')}</th>
//               <th className="text-end">{t('report.baseSalary')}</th>
//               <th className="text-end">{t('report.deductions')}</th>
//               <th className="text-end">{t('report.overtime')}</th>
//               <th className="text-end">{t('report.netSalary')}</th>
//             </tr>
//           </thead>
//           <tbody>
//             {months.map((mo, i) => {
//               if (mo.error) return (
//                 <tr key={i} className="table-danger">
//                   <td>{monthName(mo.month, lang)}</td>
//                   <td colSpan={8} className="text-danger small">{mo.error}</td>
//                 </tr>
//               );
//               const t2 = mo.totals || {};
//               return (
//                 <tr key={i} className={i % 2 === 0 ? '' : 'table-light'}>
//                   <td className="fw-semibold small">{monthName(mo.month, lang)}</td>
//                   <td className="text-center small text-success fw-semibold">{fmtInt(t2.workingDays)}</td>
//                   <td className={`text-center small ${(t2.absentDays ?? 0) > 5 ? 'text-danger fw-semibold' : ''}`}>{fmtInt(t2.absentDays)}</td>
//                   <td className="text-center small">{fmtInt(t2.paidLeaveDays)}</td>
//                   <td className="text-center small">{fmtMin(t2.totalLateMinutes)}</td>
//                   <td className="text-end small">{fmt(t2.baseSalary)}</td>
//                   <td className="text-end small text-danger">{t2.totalDeductions > 0 ? `(${fmt(t2.totalDeductions)})` : '—'}</td>
//                   <td className="text-end small text-success">{t2.overtimeTotal > 0 ? fmt(t2.overtimeTotal) : '—'}</td>
//                   <td className="text-end small fw-bold">{fmt(t2.netSalary)}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//           {totals && (
//             <tfoot className="table-warning fw-bold">
//               <tr>
//                 <td>{t('report.total')}</td>
//                 <td className="text-center">{fmtInt(totals.workingDays)}</td>
//                 <td className="text-center">{fmtInt(totals.absentDays)}</td>
//                 <td className="text-center">{fmtInt(totals.paidLeaveDays)}</td>
//                 <td className="text-center">{fmtMin(totals.totalLateMinutes)}</td>
//                 <td className="text-end">{fmt(totals.baseSalary)}</td>
//                 <td className="text-end text-danger">{totals.totalDeductions > 0 ? `(${fmt(totals.totalDeductions)})` : '—'}</td>
//                 <td className="text-end text-success">{totals.overtimeTotal > 0 ? fmt(totals.overtimeTotal) : '—'}</td>
//                 <td className="text-end">{fmt(totals.netSalary)}</td>
//               </tr>
//             </tfoot>
//           )}
//         </table>
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────
//    🚀  MAIN PAGE
// ───────────────────────────────────────────────────────────── */
// export default function CompanyReportPage() {
//   const { t, i18n } = useTranslation();
//   const lang = i18n.language?.startsWith('ar') ? 'ar' : 'en';
//   const isRtl = lang === 'ar';

//   /* ── Filters ──────────────────────────────────────────────── */
//   const [reportType,   setReportType]   = useState('month');   // 'month' | 'year'
//   const [year,         setYear]         = useState(CURRENT_YEAR);
//   const [month,        setMonth]        = useState(new Date().getMonth() + 1);
//   const [branchId,     setBranchId]     = useState('');
//   const [departmentId, setDepartmentId] = useState('');
//   const [topLimit,     setTopLimit]     = useState(10);

//   /* ── Submitted filters (drive the hook) ─────────────────── */
//   const [submitted, setSubmitted] = useState({
//     type: 'month', year: CURRENT_YEAR, month: new Date().getMonth() + 1,
//     branchId: '', departmentId: '', topLimit: 10
//   });

//   /* ── Toast ────────────────────────────────────────────────── */
//   const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
//   const showToast = useCallback((message, type = 'success') => {
//     setToast({ show: true, message, type });
//   }, []);
//   const closeToast = useCallback(() => setToast(p => ({ ...p, show: false })), []);

//   /* ── Download state ──────────────────────────────────────── */
//   const [dlLoading, setDlLoading] = useState(false);
//   const abortRef = useRef(null);

//   /* ── Fetch report data ───────────────────────────────────── */
//   const { data, loading, error, refetch } = useCompanyReport({
//     type:         submitted.type,
//     year:         submitted.year,
//     month:        submitted.type === 'month' ? submitted.month : undefined,
//     branchId:     submitted.branchId     || null,
//     departmentId: submitted.departmentId || null,
//     topLimit:     submitted.topLimit,
//     mode:         'readonly',
//     autoFetch:    true,
//   });

//   /* ── Submit handler ──────────────────────────────────────── */
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setSubmitted({ type: reportType, year, month, branchId, departmentId, topLimit });
//   };

//   /* ── Download handler ────────────────────────────────────── */
//   const handleDownload = async (format) => {
//     abortRef.current?.abort();
//     const ctrl = new AbortController();
//     abortRef.current = ctrl;
//     setDlLoading(true);

//     try {
//       const opts = {
//         year:         submitted.year,
//         month:        submitted.type === 'month' ? submitted.month : undefined,
//         branchId:     submitted.branchId     || undefined,
//         departmentId: submitted.departmentId || undefined,
//         topLimit:     submitted.topLimit,
//         format,
//         includeDays:  false,
//         mode:         'readonly',
//       };

//       if (submitted.type === 'year') {
//         await companyReportService.downloadYearReport(opts, ctrl.signal);
//       } else {
//         await companyReportService.downloadMonthReport(opts, ctrl.signal);
//       }

//       showToast(t('report.downloadSuccess'), 'success');
//     } catch (err) {
//       if (err.name === 'CanceledError') return;
//       showToast(t('report.downloadError') + ': ' + err.message, 'error');
//     } finally {
//       setDlLoading(false);
//     }
//   };

//   /* ── Derived ─────────────────────────────────────────────── */
//   const totals    = data?.totals    || {};
//   const rankings  = data?.rankings  || {};
//   const employees = data?.employees || [];
//   const months    = data?.months;   // year report only
//   const isYear    = submitted.type === 'year';

//   const periodLabel = isYear
//     ? String(submitted.year)
//     : `${monthName(submitted.month, lang)} ${submitted.year}`;

//   /* ── Payroll deduction breakdown for donut-style bars ────── */
//   const deductTotal = totals.totalDeductions || 1;
//   const deductParts = [
//     { key: 'absence', label: t('report.absenceDeduction'), color: 'danger',  val: totals.absenceDeduction ?? 0 },
//     { key: 'late',    label: t('report.lateDeduction'),    color: 'warning', val: totals.lateDeduction    ?? 0 },
//     { key: 'early',   label: t('report.earlyDeduction'),   color: 'info',    val: totals.earlyDeduction   ?? 0 },
//     { key: 'transit', label: t('report.transitDeduction'), color: 'secondary',val: totals.transitDeduction ?? 0 },
//   ];

//   /* ============================================================
//      🖼️  RENDER
//   ============================================================ */
//   return (
//     <div dir={isRtl ? 'rtl' : 'ltr'} className="company-report-page py-4 px-3 px-md-4">

//       {/* ── Toast ─────────────────────────────────────────────── */}
//       <Toast
//         show={toast.show}
//         message={toast.message}
//         type={toast.type}
//         onClose={closeToast}
//         delay={4000}
//       />

//       {/* ── Page header ───────────────────────────────────────── */}
//       <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
//         <div>
//           <h4 className="mb-1 fw-bold">{t('report.companyReportTitle')}</h4>
//           <p className="text-muted mb-0 small">{t('report.companyReportSub')}</p>
//         </div>
//         <div className="d-flex gap-2 flex-wrap">
//           <button
//             className="btn btn-sm btn-outline-success d-flex align-items-center gap-2"
//             onClick={() => handleDownload('excel')}
//             disabled={dlLoading || loading || !data}
//           >
//             {dlLoading
//               ? <span className="spinner-border spinner-border-sm" />
//               : <i className="bi bi-file-earmark-excel" />}
//             {t('report.exportExcel')}
//           </button>
//           <button
//             className="btn btn-sm btn-outline-danger d-flex align-items-center gap-2"
//             onClick={() => handleDownload('pdf')}
//             disabled={dlLoading || loading || !data}
//           >
//             {dlLoading
//               ? <span className="spinner-border spinner-border-sm" />
//               : <i className="bi bi-file-earmark-pdf" />}
//             {t('report.exportPdf')}
//           </button>
//         </div>
//       </div>

//       {/* ── Filter form ───────────────────────────────────────── */}
//       <div className="card border-0 shadow-sm mb-4">
//         <div className="card-body">
//           <form onSubmit={handleSubmit} className="row g-3 align-items-end">

//             {/* Report type */}
//             <div className="col-12 col-sm-6 col-md-auto">
//               <label className="form-label small fw-semibold">{t('report.reportType')}</label>
//               <div className="btn-group w-100" role="group">
//                 <input type="radio" className="btn-check" id="type-month" checked={reportType === 'month'}
//                   onChange={() => setReportType('month')} />
//                 <label className="btn btn-outline-primary btn-sm" htmlFor="type-month">
//                   {t('report.monthly')}
//                 </label>
//                 <input type="radio" className="btn-check" id="type-year" checked={reportType === 'year'}
//                   onChange={() => setReportType('year')} />
//                 <label className="btn btn-outline-primary btn-sm" htmlFor="type-year">
//                   {t('report.annual')}
//                 </label>
//               </div>
//             </div>

//             {/* Year */}
//             <div className="col-6 col-sm-3 col-md-auto">
//               <label className="form-label small fw-semibold">{t('report.year')}</label>
//               <select className="form-select form-select-sm" value={year}
//                 onChange={e => setYear(Number(e.target.value))}>
//                 {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
//               </select>
//             </div>

//             {/* Month (hidden for year reports) */}
//             {reportType === 'month' && (
//               <div className="col-6 col-sm-3 col-md-auto">
//                 <label className="form-label small fw-semibold">{t('report.month')}</label>
//                 <select className="form-select form-select-sm" value={month}
//                   onChange={e => setMonth(Number(e.target.value))}>
//                   {MONTHS.map(m => (
//                     <option key={m} value={m}>{monthName(m, lang)}</option>
//                   ))}
//                 </select>
//               </div>
//             )}

//             {/* Branch ID */}
//             <div className="col-12 col-sm-6 col-md-auto flex-grow-1">
//               <label className="form-label small fw-semibold">{t('report.branchId')}</label>
//               <input className="form-control form-control-sm" placeholder={t('report.allBranches')}
//                 value={branchId} onChange={e => setBranchId(e.target.value)} />
//             </div>

//             {/* Department ID */}
//             <div className="col-12 col-sm-6 col-md-auto flex-grow-1">
//               <label className="form-label small fw-semibold">{t('report.departmentId')}</label>
//               <input className="form-control form-control-sm" placeholder={t('report.allDepartments')}
//                 value={departmentId} onChange={e => setDepartmentId(e.target.value)} />
//             </div>

//             {/* Top limit */}
//             <div className="col-6 col-sm-3 col-md-auto">
//               <label className="form-label small fw-semibold">{t('report.topLimit')}</label>
//               <select className="form-select form-select-sm" value={topLimit}
//                 onChange={e => setTopLimit(Number(e.target.value))}>
//                 {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
//               </select>
//             </div>

//             {/* Submit */}
//             <div className="col-auto">
//               <button type="submit" className="btn btn-primary btn-sm px-4" disabled={loading}>
//                 {loading
//                   ? <span className="spinner-border spinner-border-sm me-1" />
//                   : <i className="bi bi-search me-1" />}
//                 {t('report.generate')}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* ── Error state ───────────────────────────────────────── */}
//       {error && (
//         <div className="alert alert-danger d-flex align-items-center gap-2">
//           <i className="bi bi-exclamation-triangle-fill" />
//           <div>{error}</div>
//           <button className="btn btn-sm btn-outline-danger ms-auto" onClick={refetch}>
//             {t('common.retry')}
//           </button>
//         </div>
//       )}

//       {/* ── Loading skeleton ──────────────────────────────────── */}
//       {loading && (
//         <div className="row g-3 mb-4">
//           {Array.from({ length: 6 }).map((_, i) => (
//             <div key={i} className="col-6 col-md-4 col-xl-2">
//               <div className="card border-0 shadow-sm">
//                 <div className="card-body p-3">
//                   <div className="placeholder-glow">
//                     <span className="placeholder col-8 mb-2 d-block rounded" style={{ height: 12 }} />
//                     <span className="placeholder col-5 d-block rounded" style={{ height: 20 }} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* ── Report content ────────────────────────────────────── */}
//       {!loading && data && (
//         <>
//           {/* Period badge */}
//           <div className="d-flex align-items-center gap-2 mb-3">
//             <span className="badge bg-primary bg-opacity-10 text-primary border border-primary px-3 py-2">
//               <i className="bi bi-calendar3 me-1" />
//               {periodLabel}
//             </span>
//             {data.meta && (
//               <span className="text-muted small">
//                 {fmtInt(data.meta.totalUsersIncluded)} {t('report.employees')}
//                 {data.meta.totalUsersFailed > 0 && (
//                   <span className="text-warning ms-2">
//                     ({data.meta.totalUsersFailed} {t('report.failed')})
//                   </span>
//                 )}
//               </span>
//             )}
//           </div>

//           {/* ── KPI GRID ───────────────────────────────────────── */}
//           <div className="row g-3 mb-4">
//             <div className="col-6 col-md-4 col-xl-2">
//               <KpiCard icon="✅" label={t('report.workingDays')}    value={fmtInt(totals.workingDays)}    color="success" />
//             </div>
//             <div className="col-6 col-md-4 col-xl-2">
//               <KpiCard icon="❌" label={t('report.absentDays')}     value={fmtInt(totals.absentDays)}     color="danger"  />
//             </div>
//             <div className="col-6 col-md-4 col-xl-2">
//               <KpiCard icon="🏖️" label={t('report.paidLeave')}      value={fmtInt(totals.paidLeaveDays)}  color="info"    />
//             </div>
//             <div className="col-6 col-md-4 col-xl-2">
//               <KpiCard icon="💻" label={t('report.remoteDays')}     value={fmtInt(totals.remoteWorkDays)} color="primary" />
//             </div>
//             <div className="col-6 col-md-4 col-xl-2">
//               <KpiCard icon="⏰" label={t('report.totalLate')}      value={fmtMin(totals.totalLateMinutes)} color="warning" />
//             </div>
//             <div className="col-6 col-md-4 col-xl-2">
//               <KpiCard icon="⚠️" label={t('report.invalidDays')}    value={fmtInt(totals.invalidDays)}    color="secondary" />
//             </div>
//           </div>

//           {/* ── PAYROLL KPIs ────────────────────────────────────── */}
//           <div className="row g-3 mb-4">
//             <div className="col-12 col-sm-6 col-md-3">
//               <KpiCard icon="💰" label={t('report.baseSalary')}    value={fmt(totals.baseSalary)}    sub={t('report.totalAll')} color="dark" />
//             </div>
//             <div className="col-12 col-sm-6 col-md-3">
//               <KpiCard icon="📉" label={t('report.totalDeductions')} value={fmt(totals.totalDeductions)} color="danger" />
//             </div>
//             <div className="col-12 col-sm-6 col-md-3">
//               <KpiCard icon="⏱️" label={t('report.overtimeTotal')} value={fmt(totals.overtimeTotal)} color="success" />
//             </div>
//             <div className="col-12 col-sm-6 col-md-3">
//               <KpiCard icon="💵" label={t('report.netSalary')}     value={fmt(totals.netSalary)}     color="primary" />
//             </div>
//           </div>

//           {/* ── DEDUCTION BREAKDOWN ─────────────────────────────── */}
//           {totals.totalDeductions > 0 && (
//             <div className="card border-0 shadow-sm mb-4">
//               <div className="card-header bg-white border-0 py-3 px-4">
//                 <h6 className="mb-0 fw-semibold">📉 {t('report.deductionBreakdown')}</h6>
//               </div>
//               <div className="card-body">
//                 <div className="row g-3">
//                   {deductParts.map(part => (
//                     <div key={part.key} className="col-6 col-md-3">
//                       <div className="small text-muted mb-1">{part.label}</div>
//                       <div className="fw-bold mb-1">{fmt(part.val)}</div>
//                       <div className="progress" style={{ height: 6 }}>
//                         <div
//                           className={`progress-bar bg-${part.color}`}
//                           style={{ width: `${Math.min(100, (part.val / deductTotal) * 100)}%` }}
//                         />
//                       </div>
//                       <div className="text-muted mt-1" style={{ fontSize: 11 }}>
//                         {deductTotal > 0 ? ((part.val / deductTotal) * 100).toFixed(1) : 0}%
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ── RANKINGS ────────────────────────────────────────── */}
//           <div className="row g-3 mb-4">
//             <div className="col-12 col-md-6 col-xl-3">
//               <RankingTable
//                 title={t('report.topLate')}     icon="⏰"
//                 rows={rankings.topLate}          valueKey="totalLateMinutes"
//                 valueLabel={t('report.lateMin')} valueFormat={fmtMin}
//                 emptyMsg={t('report.noData')}
//               />
//             </div>
//             <div className="col-12 col-md-6 col-xl-3">
//               <RankingTable
//                 title={t('report.topAbsent')}   icon="❌"
//                 rows={rankings.topAbsent}        valueKey="absentDays"
//                 valueLabel={t('report.absent')}  valueFormat={n => `${fmtInt(n)} ${t('report.days')}`}
//                 emptyMsg={t('report.noData')}
//               />
//             </div>
//             <div className="col-12 col-md-6 col-xl-3">
//               <RankingTable
//                 title={t('report.topCommitted')} icon="⭐"
//                 rows={rankings.topCommitted}      valueKey="score"
//                 valueLabel={t('report.score')}   valueFormat={n => Number(n).toFixed(2)}
//                 emptyMsg={t('report.noData')}
//               />
//             </div>
//             <div className="col-12 col-md-6 col-xl-3">
//               <RankingTable
//                 title={t('report.topOvertime')}  icon="⏱️"
//                 rows={rankings.topOvertime}       valueKey="overtimeTotal"
//                 valueLabel={t('report.overtime')} valueFormat={fmt}
//                 emptyMsg={t('report.noData')}
//               />
//             </div>
//           </div>

//           {/* ── MONTHLY BREAKDOWN (year only) ───────────────────── */}
//           {isYear && months && (
//             <div className="mb-4">
//               <MonthlyBreakdownTable months={months} totals={totals} t={t} lang={lang} />
//             </div>
//           )}

//           {/* ── EMPLOYEES TABLE ─────────────────────────────────── */}
//           <div className="card border-0 shadow-sm mb-4">
//             <div className="card-header bg-white border-0 py-3 px-4 d-flex align-items-center justify-content-between">
//               <h6 className="mb-0 fw-semibold">👥 {t('report.employeeDetails')}</h6>
//               <span className="badge bg-primary">{employees.length} {t('report.employees')}</span>
//             </div>
//             {employees.length === 0 ? (
//               <div className="card-body text-center text-muted py-5">
//                 <div style={{ fontSize: 40 }}>📋</div>
//                 <div className="mt-2">{t('report.noEmployees')}</div>
//               </div>
//             ) : (
//               <div className="table-responsive">
//                 <table className="table table-hover align-middle small mb-0">
//                   <thead className="table-dark sticky-top">
//                     <tr>
//                       <th style={{ width: 40 }}>#</th>
//                       <th>{t('report.employee')}</th>
//                       <th>{t('report.branch')}</th>
//                       <th className="text-center">{t('report.workDays')}</th>
//                       <th className="text-center">{t('report.absent')}</th>
//                       <th className="text-center">{t('report.paidLeave')}</th>
//                       <th className="text-center">{t('report.unpaidLeave')}</th>
//                       <th className="text-center">{t('report.remote')}</th>
//                       <th className="text-center">{t('report.late')}</th>
//                       <th className="text-center">{t('report.early')}</th>
//                       <th className="text-end">{t('report.baseSalary')}</th>
//                       <th className="text-end">{t('report.deductions')}</th>
//                       <th className="text-end">{t('report.overtime')}</th>
//                       <th className="text-end">{t('report.bonus')}</th>
//                       <th className="text-end">{t('report.netSalary')}</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {employees.map((emp, i) => (
//                       <EmployeeRow key={emp.userId || i} emp={emp} index={i} t={t} lang={lang} />
//                     ))}
//                   </tbody>
//                   {/* Company totals footer */}
//                   <tfoot className="table-primary fw-bold border-top border-2">
//                     <tr>
//                       <td colSpan={3}>{t('report.total')}</td>
//                       <td className="text-center">{fmtInt(totals.workingDays)}</td>
//                       <td className="text-center">{fmtInt(totals.absentDays)}</td>
//                       <td className="text-center">{fmtInt(totals.paidLeaveDays)}</td>
//                       <td className="text-center">{fmtInt(totals.unpaidLeaveDays)}</td>
//                       <td className="text-center">{fmtInt(totals.remoteWorkDays)}</td>
//                       <td className="text-center">{fmtMin(totals.totalLateMinutes)}</td>
//                       <td className="text-center">{fmtMin(totals.totalEarlyLeaveMinutes)}</td>
//                       <td className="text-end">{fmt(totals.baseSalary)}</td>
//                       <td className="text-end text-danger">{totals.totalDeductions > 0 ? `(${fmt(totals.totalDeductions)})` : '—'}</td>
//                       <td className="text-end text-success">{totals.overtimeTotal > 0 ? fmt(totals.overtimeTotal) : '—'}</td>
//                       <td className="text-end text-success">{totals.bonusTotal > 0 ? fmt(totals.bonusTotal) : '—'}</td>
//                       <td className="text-end">{fmt(totals.netSalary)}</td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>
//             )}
//           </div>

//           {/* ── Footer meta ─────────────────────────────────────── */}
//           {data.meta?.generatedAt && (
//             <p className="text-muted text-end small">
//               {t('report.generatedAt')}: {new Date(data.meta.generatedAt).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-GB')}
//             </p>
//           )}
//         </>
//       )}

//       {/* ── Empty state ───────────────────────────────────────── */}
//       {!loading && !data && !error && (
//         <div className="text-center text-muted py-5">
//           <div style={{ fontSize: 56 }}>📊</div>
//           <h5 className="mt-3">{t('report.selectFilters')}</h5>
//           <p className="small">{t('report.selectFiltersSub')}</p>
//         </div>
//       )}

//       {/* ── Scoped styles ─────────────────────────────────────── */}
//       <style>{`
//         .company-report-page { min-height: 100vh; }

//         .kpi-card { transition: box-shadow 0.2s, transform 0.2s; border-radius: 12px !important; }
//         .kpi-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.08) !important; transform: translateY(-2px); }
//         .kpi-icon { border-radius: 10px !important; }

//         .table thead.sticky-top th { position: sticky; top: 0; z-index: 1; }

//         .list-group-item:hover { background: #f8f9ff !important; }

//         .progress { border-radius: 999px; background: #eef0f5; }
//         .progress-bar { border-radius: 999px; transition: width 0.6s ease; }

//         [dir="rtl"] .ms-auto { margin-left: unset !important; margin-right: auto !important; }
//         [dir="rtl"] .me-1 { margin-right: unset !important; margin-left: 0.25rem !important; }
//         [dir="rtl"] .me-2 { margin-right: unset !important; margin-left: 0.5rem !important; }
//         [dir="rtl"] .text-end { text-align: left !important; }
//         [dir="rtl"] .text-start { text-align: right !important; }
//       `}</style>
//     </div>
//   );
// }

import { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { companyReportService } from '../services/companyReport.api.js';
import CompanyReportFilters     from '../components/companyReport/CompanyReportFilters';
import CompanyReportStatsCards  from '../components/companyReport/CompanyReportStatsCards';
import CompanyReportKpis        from '../components/companyReport/CompanyReportKpis';
import CompanyReportRankings    from '../components/companyReport/CompanyReportRankings';
import CompanyReportTable       from '../components/companyReport/CompanyReportTable';
import CompanyMonthlyBreakdown  from '../components/companyReport/CompanyMonthlyBreakdown';
import Toast from '../components/ui/Toast';

import '../style/CompanyReportPage.css';

/* ==============================================
   📄 CompanyReportPage

   نوعان من التقارير:
     - month  → تقرير شهري
     - year   → تقرير سنوي مع breakdown شهري

   فلاتر: سنة / شهر / فرع / قسم / topLimit
   تصدير: Excel / PDF
   الـ source of truth → DailyAttendanceSummary
============================================== */

const CURRENT_YEAR = new Date().getFullYear();
const YEARS        = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);
const MONTHS       = Array.from({ length: 12 }, (_, i) => i + 1);

const DEFAULT_FILTERS = {
  reportType:   'month',
  year:         CURRENT_YEAR,
  month:        new Date().getMonth() + 1,
  branchId:     '',
  departmentId: '',
  topLimit:     10,
};

const CompanyReportPage = () => {
  const { t, i18n } = useTranslation('companyReport');
  const isRtl = i18n.language?.startsWith('ar');

  /* ── State ────────────────────────────────────────────────── */
  const [reportData,  setReportData]  = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [dlLoading,   setDlLoading]   = useState(false);
  const [filters,     setFilters]     = useState(DEFAULT_FILTERS);
  const [toast,       setToast]       = useState(null);
  const [activeKpi,   setActiveKpi]   = useState(null);   // stat card click filter

  const abortRef = useRef(null);

  /* ── Load report ─────────────────────────────────────────── */
  const loadReport = useCallback(async (f = filters) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLoading(true);
    setReportData(null);

    try {
      const opts = {
        year:         f.year,
        month:        f.reportType === 'month' ? f.month : undefined,
        branchId:     f.branchId     || undefined,
        departmentId: f.departmentId || undefined,
        topLimit:     f.topLimit,
        mode:         'readonly',
      };

      const result = f.reportType === 'year'
        ? await companyReportService.getYearReport(opts,  ctrl.signal)
        : await companyReportService.getMonthReport(opts, ctrl.signal);

      setReportData(result.data);
    } catch (err) {
      if (err.name === 'CanceledError' || err.message === 'canceled') return;
      setToast({ type: 'error', message: t('loadError') });
    } finally {
      setLoading(false);
    }
  }, [filters, t]);

  /* Auto-load on mount */
  useEffect(() => {
    loadReport();
    return () => abortRef.current?.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Filter handlers ─────────────────────────────────────── */
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleFilterReset = () => {
    setFilters(DEFAULT_FILTERS);
    setActiveKpi(null);
  };

  const handleFilterSubmit = (e) => {
    e?.preventDefault();
    setActiveKpi(null);
    loadReport(filters);
  };

  /* ── Stat card click → highlight ────────────────────────── */
  const handleKpiClick = (key) => {
    setActiveKpi(prev => prev === key ? null : key);
  };

  /* ── Download ────────────────────────────────────────────── */
  const handleDownload = async (format) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setDlLoading(true);
    try {
      const opts = {
        year:         filters.year,
        month:        filters.reportType === 'month' ? filters.month : undefined,
        branchId:     filters.branchId     || undefined,
        departmentId: filters.departmentId || undefined,
        topLimit:     filters.topLimit,
        format,
        mode:         'readonly',
      };

      filters.reportType === 'year'
        ? await companyReportService.downloadYearReport(opts,  ctrl.signal)
        : await companyReportService.downloadMonthReport(opts, ctrl.signal);

      setToast({ type: 'success', message: t('downloadSuccess') });
    } catch (err) {
      if (err.name === 'CanceledError') return;
      setToast({ type: 'error', message: `${t('downloadError')}: ${err.message}` });
    } finally {
      setDlLoading(false);
    }
  };

  /* ── Derived ─────────────────────────────────────────────── */
  const totals    = reportData?.totals    || {};
  const rankings  = reportData?.rankings  || {};
  const employees = reportData?.employees || [];
  const months    = reportData?.months;
  const isYear    = filters.reportType === 'year';

  /* ── JSX ─────────────────────────────────────────────────── */
  return (
    <div className={`company-report-page ${isRtl ? 'rtl' : ''}`}>
      <div className="container-fluid">

        {/* ── Header ────────────────────────────────────────── */}
        <div className="page-header mb-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="page-title mb-1">
                <i className="fas fa-chart-bar me-2" />
                {t('pageTitle')}
              </h2>
              <p className="page-subtitle mb-0">{t('pageSubtitle')}</p>
            </div>

            <div className="d-flex gap-2 flex-wrap">
              <button
                className="btn btn-export btn-export-excel"
                onClick={() => handleDownload('excel')}
                disabled={dlLoading || loading || !reportData}
              >
                {dlLoading
                  ? <span className="spinner-border spinner-border-sm me-2" />
                  : <i className="fas fa-file-excel me-2" />}
                {t('exportExcel')}
              </button>

              <button
                className="btn btn-export btn-export-pdf"
                onClick={() => handleDownload('pdf')}
                disabled={dlLoading || loading || !reportData}
              >
                {dlLoading
                  ? <span className="spinner-border spinner-border-sm me-2" />
                  : <i className="fas fa-file-pdf me-2" />}
                {t('exportPdf')}
              </button>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ────────────────────────────────────── */}
        <CompanyReportStatsCards
          totals={totals}
          activeKpi={activeKpi}
          onKpiClick={handleKpiClick}
          t={t}
        />

        {/* ── Filters ───────────────────────────────────────── */}
        <CompanyReportFilters
          filters={filters}
          years={YEARS}
          months={MONTHS}
          loading={loading}
          onChange={handleFilterChange}
          onReset={handleFilterReset}
          onSubmit={handleFilterSubmit}
          t={t}
          isRtl={isRtl}
          i18nLang={i18n.language}
        />

        {/* ── Error ─────────────────────────────────────────── */}
        {!loading && !reportData && toast?.type === 'error' && (
          <div className="alert alert-danger d-flex align-items-center gap-2 mt-3">
            <i className="fas fa-exclamation-triangle" />
            <span>{toast.message}</span>
            <button className="btn btn-sm btn-outline-danger ms-auto" onClick={() => loadReport()}>
              {t('retry')}
            </button>
          </div>
        )}

        {/* ── Loading skeleton ──────────────────────────────── */}
        {loading && (
          <div className="row g-3 mt-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-3">
                    <div className="placeholder-glow">
                      <span className="placeholder col-7 mb-2 d-block rounded" style={{ height: 11 }} />
                      <span className="placeholder col-4 d-block rounded" style={{ height: 22 }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Report content ────────────────────────────────── */}
        {!loading && reportData && (
          <>
            {/* Period + meta badge */}
            <div className="report-meta-bar d-flex flex-wrap align-items-center gap-2 mb-4">
              <span className="badge-period">
                <i className="fas fa-calendar-alt me-1" />
                {isYear
                  ? filters.year
                  : `${new Date(filters.year, filters.month - 1, 1)
                       .toLocaleString(isRtl ? 'ar-EG' : 'en-US', { month: 'long' })} ${filters.year}`}
              </span>
              {reportData.meta && (
                <span className="badge-meta">
                  <i className="fas fa-users me-1" />
                  {reportData.meta.totalUsersIncluded} {t('employees')}
                  {reportData.meta.totalUsersFailed > 0 && (
                    <span className="text-warning ms-2">
                      ({reportData.meta.totalUsersFailed} {t('failed')})
                    </span>
                  )}
                </span>
              )}
            </div>

            {/* KPI rows */}
            <CompanyReportKpis totals={totals} t={t} />

            {/* Rankings */}
            <CompanyReportRankings rankings={rankings} t={t} />

            {/* Monthly breakdown (year only) */}
            {isYear && months && (
              <CompanyMonthlyBreakdown
                months={months}
                totals={totals}
                t={t}
                isRtl={isRtl}
                i18nLang={i18n.language}
              />
            )}

            {/* Employees table */}
            <CompanyReportTable
              employees={employees}
              totals={totals}
              loading={loading}
              activeKpi={activeKpi}
              onToast={setToast}
              t={t}
              isRtl={isRtl}
            />

            {/* Generated at */}
            {reportData.meta?.generatedAt && (
              <p className="text-muted text-end small mt-3">
                {t('generatedAt')}: {new Date(reportData.meta.generatedAt)
                  .toLocaleString(isRtl ? 'ar-EG' : 'en-GB')}
              </p>
            )}
          </>
        )}

        {/* ── Empty state ───────────────────────────────────── */}
        {!loading && !reportData && toast?.type !== 'error' && (
          <div className="empty-state text-center py-5">
            <i className="fas fa-chart-pie empty-icon" />
            <h5 className="mt-3">{t('emptyTitle')}</h5>
            <p className="text-muted small">{t('emptySub')}</p>
          </div>
        )}

      </div>

      {/* ── Toast ─────────────────────────────────────────────── */}
      {toast && (
        <Toast
          show={true}
          type={toast.type}
          message={toast.message}
          onConfirm={toast.onConfirm}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default CompanyReportPage;