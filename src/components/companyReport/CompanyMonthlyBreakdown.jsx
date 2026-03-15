// src/components/companyReport/CompanyMonthlyBreakdown.jsx
/* ==============================================
   جدول التوزيع الشهري — يظهر في التقرير السنوي فقط
============================================== */

const fmt    = (n, d = 2) => n == null ? '—' : Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtInt = (n)         => n == null ? '—' : Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
const fmtMin = (m) => {
  if (!m) return '0h 0m';
  return `${Math.floor(m / 60)}h ${m % 60}m`;
};

const CompanyMonthlyBreakdown = ({ months, totals, t, isRtl, i18nLang }) => {
  if (!months?.length) return null;

  const monthLabel = (m) =>
    new Date(2000, m - 1, 1).toLocaleString(isRtl ? 'ar-EG' : 'en-US', { month: 'long' });

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-header bg-white border-0 py-3 px-4">
        <h6 className="mb-0 fw-semibold">
          <i className="fas fa-calendar-alt me-2 text-primary" />
          {t('monthlyBreakdown')}
        </h6>
      </div>
      <div className="table-responsive">
        <table className="table table-hover table-sm align-middle mb-0">
          <thead className="table-dark">
            <tr>
              <th>{t('month')}</th>
              <th className="text-center">{t('workingDays')}</th>
              <th className="text-center">{t('absentDays')}</th>
              <th className="text-center">{t('paidLeaveDays')}</th>
              <th className="text-center">{t('totalLateMin')}</th>
              <th className="text-end">{t('baseSalary')}</th>
              <th className="text-end">{t('totalDeductions')}</th>
              <th className="text-end">{t('overtimeTotal')}</th>
              <th className="text-end">{t('netSalary')}</th>
            </tr>
          </thead>
          <tbody>
            {months.map((mo, i) => {
              if (mo.error) return (
                <tr key={i} className="table-danger">
                  <td className="fw-semibold small">{monthLabel(mo.month)}</td>
                  <td colSpan={8} className="text-danger small">
                    <i className="fas fa-exclamation-triangle me-1" />
                    {mo.error}
                  </td>
                </tr>
              );

              const t2 = mo.totals || {};
              const highAbsent = (t2.absentDays ?? 0) > 5;

              return (
                <tr key={i} className={i % 2 === 0 ? '' : 'table-light'}>
                  <td className="fw-semibold small">{monthLabel(mo.month)}</td>
                  <td className="text-center small text-success fw-semibold">{fmtInt(t2.workingDays)}</td>
                  <td className={`text-center small ${highAbsent ? 'text-danger fw-semibold' : ''}`}>
                    {fmtInt(t2.absentDays)}
                  </td>
                  <td className="text-center small">{fmtInt(t2.paidLeaveDays)}</td>
                  <td className="text-center small">{fmtMin(t2.totalLateMinutes)}</td>
                  <td className="text-end small">{fmt(t2.baseSalary)}</td>
                  <td className="text-end small text-danger">
                    {(t2.totalDeductions ?? 0) > 0 ? `(${fmt(t2.totalDeductions)})` : '—'}
                  </td>
                  <td className="text-end small text-success">
                    {(t2.overtimeTotal ?? 0) > 0 ? fmt(t2.overtimeTotal) : '—'}
                  </td>
                  <td className="text-end small fw-bold">{fmt(t2.netSalary)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="table-warning fw-bold border-top border-2">
            <tr>
              <td>{t('total')}</td>
              <td className="text-center">{fmtInt(totals.workingDays)}</td>
              <td className="text-center">{fmtInt(totals.absentDays)}</td>
              <td className="text-center">{fmtInt(totals.paidLeaveDays)}</td>
              <td className="text-center">{fmtMin(totals.totalLateMinutes)}</td>
              <td className="text-end">{fmt(totals.baseSalary)}</td>
              <td className="text-end text-danger">
                {(totals.totalDeductions ?? 0) > 0 ? `(${fmt(totals.totalDeductions)})` : '—'}
              </td>
              <td className="text-end text-success">
                {(totals.overtimeTotal ?? 0) > 0 ? fmt(totals.overtimeTotal) : '—'}
              </td>
              <td className="text-end">{fmt(totals.netSalary)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default CompanyMonthlyBreakdown;