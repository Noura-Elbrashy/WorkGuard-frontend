// src/components/companyReport/CompanyReportKpis.jsx
/* ==============================================
   صفوف الـ KPI — حضور + راتب
============================================== */

const fmt    = (n, d = 2) => n == null ? '—' : Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtInt = (n)         => n == null ? '—' : Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
const fmtMin = (m) => {
  if (!m) return '0h 0m';
  return `${Math.floor(m / 60)}h ${m % 60}m`;
};

function KpiCard({ icon, label, value, color = 'primary', sub }) {
  return (
    <div className={`card border-0 shadow-sm h-100 kpi-card kpi-${color}`}>
      <div className="card-body d-flex align-items-center gap-3 py-3">
        <div className={`kpi-icon bg-${color} bg-opacity-10 text-${color}`}>
          <i className={`fas ${icon}`} />
        </div>
        <div className="overflow-hidden">
          <div className="kpi-label">{label}</div>
          <div className="kpi-value">{value}</div>
          {sub && <div className="kpi-sub">{sub}</div>}
        </div>
      </div>
    </div>
  );
}

export const CompanyReportKpis = ({ totals, t }) => (
  <>
    {/* Row 1 — Attendance */}
    <div className="row g-3 mb-3">
      <div className="col-6 col-md-4 col-xl-2">
        <KpiCard icon="fa-check-circle"  label={t('workingDays')}    value={fmtInt(totals.workingDays)}     color="success" />
      </div>
      <div className="col-6 col-md-4 col-xl-2">
        <KpiCard icon="fa-times-circle"  label={t('absentDays')}     value={fmtInt(totals.absentDays)}      color="danger"  />
      </div>
      <div className="col-6 col-md-4 col-xl-2">
        <KpiCard icon="fa-umbrella-beach"label={t('paidLeaveDays')}  value={fmtInt(totals.paidLeaveDays)}   color="info"    />
      </div>
      <div className="col-6 col-md-4 col-xl-2">
        <KpiCard icon="fa-laptop-house"  label={t('remoteWorkDays')} value={fmtInt(totals.remoteWorkDays)}  color="primary" />
      </div>
      <div className="col-6 col-md-4 col-xl-2">
        <KpiCard icon="fa-clock"         label={t('totalLateMin')}   value={fmtMin(totals.totalLateMinutes)} color="warning" />
      </div>
      <div className="col-6 col-md-4 col-xl-2">
        <KpiCard icon="fa-exclamation"   label={t('invalidDays')}    value={fmtInt(totals.invalidDays)}     color="secondary" />
      </div>
    </div>

    {/* Row 2 — Payroll */}
    <div className="row g-3 mb-4">
      <div className="col-12 col-sm-6 col-md-3">
        <KpiCard icon="fa-money-bill-wave" label={t('baseSalary')}      value={fmt(totals.baseSalary)}      color="dark"    sub={t('totalAll')} />
      </div>
      <div className="col-12 col-sm-6 col-md-3">
        <KpiCard icon="fa-minus-circle"    label={t('totalDeductions')} value={fmt(totals.totalDeductions)} color="danger"  />
      </div>
      <div className="col-12 col-sm-6 col-md-3">
        <KpiCard icon="fa-plus-circle"     label={t('overtimeTotal')}   value={fmt(totals.overtimeTotal)}   color="success" />
      </div>
      <div className="col-12 col-sm-6 col-md-3">
        <KpiCard icon="fa-wallet"          label={t('netSalary')}       value={fmt(totals.netSalary)}       color="primary" />
      </div>
    </div>

    {/* Deduction breakdown */}
    {(totals.totalDeductions ?? 0) > 0 && (
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 py-3 px-4">
          <h6 className="mb-0 fw-semibold">
            <i className="fas fa-chart-pie me-2 text-danger" />
            {t('deductionBreakdown')}
          </h6>
        </div>
        <div className="card-body">
          <div className="row g-3">
            {[
              { key: 'absenceDeduction', color: 'danger',    icon: 'fa-times' },
              { key: 'lateDeduction',    color: 'warning',   icon: 'fa-clock' },
              { key: 'earlyDeduction',   color: 'info',      icon: 'fa-sign-out-alt' },
              { key: 'transitDeduction', color: 'secondary', icon: 'fa-route' },
            ].map(({ key, color, icon }) => {
              const val   = totals[key] ?? 0;
              const total = totals.totalDeductions || 1;
              const pct   = ((val / total) * 100).toFixed(1);
              return (
                <div key={key} className="col-6 col-md-3">
                  <div className="deduction-item">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <i className={`fas ${icon} text-${color} small`} />
                      <span className="small text-muted">{t(key)}</span>
                    </div>
                    <div className="fw-bold mb-1">{fmt(val)}</div>
                    <div className="progress" style={{ height: 6 }}>
                      <div className={`progress-bar bg-${color}`} style={{ width: `${Math.min(100, pct)}%` }} />
                    </div>
                    <div className="text-muted mt-1" style={{ fontSize: 11 }}>{pct}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )}
  </>
);

export default CompanyReportKpis;