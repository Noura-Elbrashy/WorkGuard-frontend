// src/components/companyReport/CompanyReportTable.jsx
/* ==============================================
   جدول تفاصيل الموظفين
   - sticky header
   - totals footer
   - highlight غياب ≥ 3 أيام
   - highlight تأخير > 60 دقيقة
============================================== */

const fmt    = (n, d = 2) => n == null ? '—' : Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtInt = (n)         => n == null ? '—' : Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
const fmtMin = (m) => {
  if (!m) return '0h 0m';
  return `${Math.floor(m / 60)}h ${m % 60}m`;
};

function EmployeeRow({ emp, index, t }) {
  const m        = emp.metrics  || {};
  const p        = emp.payroll  || {};
  const deducts  = p.deductions?.total ?? 0;
  const ot       = p.overtime?.total   ?? p.overtimeTotal ?? 0;
  const bonus    = p.bonus?.total      ?? p.bonusTotal    ?? 0;
  const branches = (emp.branches || []).map(b => b.name).join(', ') || '—';

  const absentBad  = (m.absentDays       ?? 0) >= 3;
  const lateBad    = (m.totalLateMinutes ?? 0) > 60;

  return (
    <tr className={absentBad ? 'row-absent-bad' : index % 2 === 0 ? '' : 'table-light'}>
      <td className="text-muted small text-center">{index + 1}</td>
      <td>
        <div className="fw-semibold small">{emp.name}</div>
        <div className="text-muted" style={{ fontSize: 11 }}>{emp.email}</div>
      </td>
      <td className="small">{branches}</td>
      <td className="text-center small fw-semibold text-success">{fmtInt(m.workingDays)}</td>
      <td className={`text-center small fw-semibold ${absentBad ? 'text-danger' : ''}`}>
        {absentBad && <i className="fas fa-exclamation-triangle me-1 text-danger" style={{ fontSize: 10 }} />}
        {fmtInt(m.absentDays)}
      </td>
      <td className="text-center small">{fmtInt(m.paidLeaveDays)}</td>
      <td className="text-center small">{fmtInt(m.unpaidLeaveDays)}</td>
      <td className="text-center small text-info">{fmtInt(m.remoteWorkDays)}</td>
      <td className={`text-center small ${lateBad ? 'text-warning fw-semibold' : ''}`}>
        {fmtMin(m.totalLateMinutes)}
      </td>
      <td className="text-center small">{fmtMin(m.totalEarlyLeaveMinutes)}</td>
      <td className="text-end small fw-semibold">{fmt(p.baseSalary)}</td>
      <td className="text-end small text-danger">{deducts > 0 ? `(${fmt(deducts)})` : '—'}</td>
      <td className="text-end small text-success">{ot    > 0 ? fmt(ot)    : '—'}</td>
      <td className="text-end small text-success">{bonus > 0 ? fmt(bonus) : '—'}</td>
      <td className="text-end small fw-bold">{fmt(p.netSalary)}</td>
    </tr>
  );
}

const CompanyReportTable = ({ employees, totals, loading, t }) => (
  <div className="card border-0 shadow-sm mb-4">
    <div className="card-header bg-white border-0 py-3 px-4 d-flex align-items-center justify-content-between">
      <h6 className="mb-0 fw-semibold">
        <i className="fas fa-users me-2 text-primary" />
        {t('employeeDetails')}
      </h6>
      <span className="badge bg-primary">
        {employees.length} {t('employees')}
      </span>
    </div>

    {employees.length === 0 ? (
      <div className="card-body text-center text-muted py-5">
        <i className="fas fa-inbox" style={{ fontSize: 40, opacity: 0.3 }} />
        <div className="mt-2">{t('noEmployees')}</div>
      </div>
    ) : (
      <div className="table-responsive">
        <table className="table table-hover align-middle small mb-0 report-emp-table">
          <thead className="table-dark">
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th>{t('employee')}</th>
              <th>{t('branchId')}</th>
              <th className="text-center">{t('workingDays')}</th>
              <th className="text-center">{t('absentDays')}</th>
              <th className="text-center">{t('paidLeaveDays')}</th>
              <th className="text-center">{t('unpaidLeaveDays')}</th>
              <th className="text-center">{t('remoteWorkDays')}</th>
              <th className="text-center">{t('totalLateMin')}</th>
              <th className="text-center">{t('earlyLeave')}</th>
              <th className="text-end">{t('baseSalary')}</th>
              <th className="text-end">{t('totalDeductions')}</th>
              <th className="text-end">{t('overtimeTotal')}</th>
              <th className="text-end">{t('bonusTotal')}</th>
              <th className="text-end">{t('netSalary')}</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp, i) => (
              <EmployeeRow key={emp.userId || i} emp={emp} index={i} t={t} />
            ))}
          </tbody>

          <tfoot className="table-primary fw-bold border-top border-2">
            <tr>
              <td colSpan={3}>{t('total')}</td>
              <td className="text-center">{fmtInt(totals.workingDays)}</td>
              <td className="text-center">{fmtInt(totals.absentDays)}</td>
              <td className="text-center">{fmtInt(totals.paidLeaveDays)}</td>
              <td className="text-center">{fmtInt(totals.unpaidLeaveDays)}</td>
              <td className="text-center">{fmtInt(totals.remoteWorkDays)}</td>
              <td className="text-center">{fmtMin(totals.totalLateMinutes)}</td>
              <td className="text-center">{fmtMin(totals.totalEarlyLeaveMinutes)}</td>
              <td className="text-end">{fmt(totals.baseSalary)}</td>
              <td className="text-end text-danger">
                {(totals.totalDeductions ?? 0) > 0 ? `(${fmt(totals.totalDeductions)})` : '—'}
              </td>
              <td className="text-end text-success">
                {(totals.overtimeTotal ?? 0) > 0 ? fmt(totals.overtimeTotal) : '—'}
              </td>
              <td className="text-end text-success">
                {(totals.bonusTotal ?? 0) > 0 ? fmt(totals.bonusTotal) : '—'}
              </td>
              <td className="text-end">{fmt(totals.netSalary)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    )}
  </div>
);

export default CompanyReportTable;