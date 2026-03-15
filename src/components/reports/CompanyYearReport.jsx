// src/pages/Reports/components/CompanyYearReport.jsx
import { useState }          from 'react';
import { useTranslation }    from 'react-i18next';
import { CompanyKpiCards }   from './ReportSummaryCards';
import EmployeesTable from './EmployeesTable';

function fmt(v, dec = 2) {
  if (v == null) return '—';
  const n = Number(v);
  if (isNaN(n)) return '—';
  return n.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function fmtMin(m) { if (!m) return '—'; return `${Math.floor(m/60)}h ${m%60}m`; }

/* Monthly breakdown table */
function MonthlyBreakdown({ months = [], yearTotals = {} }) {
  const { t } = useTranslation('companyReport');

  return (
    <div className="report-table-wrap">
      <table className="report-table">
        <thead>
          <tr>
            <th>{t('table.month')}</th>
            <th>{t('table.workDays')}</th>
            <th>{t('table.absent')}</th>
            <th>{t('table.paidLeave')}</th>
            <th>{t('table.unpaidLeave')}</th>
            <th>{t('table.late')}</th>
            <th>{t('table.baseSalary')}</th>
            <th>{t('table.deductions')}</th>
            <th>{t('table.overtime')}</th>
            <th>{t('table.netSalary')}</th>
          </tr>
        </thead>
        <tbody>
          {months.map(mo => (
            mo.error ? (
              <tr key={mo.month} style={{ background:'#fce4d6' }}>
                <td style={{ fontWeight:700 }}>{t(`months.${mo.month}`)}</td>
                <td colSpan={9} style={{ color:'#dc3545', fontSize:'0.8rem' }}>
                  Error: {mo.error}
                </td>
              </tr>
            ) : (
              <tr key={mo.month}>
                <td style={{ fontWeight:700 }}>{t(`months.${mo.month}`)}</td>
                <td>{fmt(mo.totals?.workingDays, 0)}</td>
                <td style={{ color: mo.totals?.absentDays > 0 ? '#dc3545' : 'inherit' }}>
                  {fmt(mo.totals?.absentDays, 0)}
                </td>
                <td>{fmt(mo.totals?.paidLeaveDays, 0)}</td>
                <td>{fmt(mo.totals?.unpaidLeaveDays, 0)}</td>
                <td style={{ color: mo.totals?.totalLateMinutes > 0 ? '#fd7e14' : 'inherit' }}>
                  {fmtMin(mo.totals?.totalLateMinutes)}
                </td>
                <td>{fmt(mo.totals?.baseSalary)}</td>
                <td style={{ color:'#dc3545' }}>{fmt(mo.totals?.totalDeductions)}</td>
                <td style={{ color:'#6f42c1' }}>{fmt(mo.totals?.overtimeTotal)}</td>
                <td style={{ fontWeight:700, color:'#1F3864' }}>{fmt(mo.totals?.netSalary)}</td>
              </tr>
            )
          ))}
          {/* Totals row */}
          <tr className="month-totals-row">
            <td>{t('table.total')}</td>
            <td>{fmt(yearTotals.workingDays, 0)}</td>
            <td>{fmt(yearTotals.absentDays, 0)}</td>
            <td>{fmt(yearTotals.paidLeaveDays, 0)}</td>
            <td>{fmt(yearTotals.unpaidLeaveDays, 0)}</td>
            <td>{fmtMin(yearTotals.totalLateMinutes)}</td>
            <td>{fmt(yearTotals.baseSalary)}</td>
            <td>{fmt(yearTotals.totalDeductions)}</td>
            <td>{fmt(yearTotals.overtimeTotal)}</td>
            <td>{fmt(yearTotals.netSalary)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN
═══════════════════════════════════════════ */
export default function CompanyYearReport({ report, onSelectUser }) {
  const { t } = useTranslation('companyReport');
  const [showMonths, setShowMonths] = useState(true);

  if (!report) return null;

  const { totals = {}, months = [], employees = [], meta = {} } = report;

  return (
    <div>
      {/* Title */}
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div>
          <h5 style={{ fontWeight:700, color:'#1F3864', margin:0 }}>
            {t('tabs.companyYear')} — {report.period?.year}
          </h5>
          <small style={{ color:'#aaa' }}>
            {meta.payrollApprovedOnly && t('meta.approvedOnly')}
          </small>
        </div>
      </div>

      {/* KPI */}
      <CompanyKpiCards totals={totals} empCount={employees.length} />

      {/* Monthly breakdown */}
      <div className="report-section">
        <div className="section-title">
          <i className="fa-solid fa-table" />
          {t('sections.monthlyBreakdown')}
          <button
            className="btn btn-sm btn-link ms-auto p-0"
            style={{ fontSize:'0.8rem' }}
            onClick={() => setShowMonths(p => !p)}
          >
            {showMonths ? 'Hide' : 'Show'}
          </button>
        </div>
        {showMonths && <MonthlyBreakdown months={months} yearTotals={totals} />}
      </div>

      {/* Employees */}
      <div className="report-section">
        <div className="section-title">
          <i className="fa-solid fa-users" />
          {t('sections.employeesList')}
          <span className="ms-2" style={{ color:'#aaa', fontWeight:400, fontSize:'0.8rem' }}>
            {employees.length} {t('meta.employees')}
          </span>
        </div>
        <EmployeesTable employees={employees} onSelectUser={onSelectUser} />
      </div>
    </div>
  );
}