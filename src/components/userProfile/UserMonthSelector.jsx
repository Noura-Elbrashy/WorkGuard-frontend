
// import { useTranslation } from 'react-i18next';

// function UserMonthSelector({ year, month, onChange, onApply }) {
//   const { t } = useTranslation();

//   const months = [
//     { value: 1, label: t('january') },
//     { value: 2, label: t('february') },
//     { value: 3, label: t('march') },
//     { value: 4, label: t('april') },
//     { value: 5, label: t('may') },
//     { value: 6, label: t('june') },
//     { value: 7, label: t('july') },
//     { value: 8, label: t('august') },
//     { value: 9, label: t('september') },
//     { value: 10, label: t('october') },
//     { value: 11, label: t('november') },
//     { value: 12, label: t('december') }
//   ];

//   const years = [];
//   const currentYear = new Date().getFullYear();
//   for (let y = currentYear - 3; y <= currentYear + 1; y++) {
//     years.push(y);
//   }

//   return (
//     <div className="card border-0 shadow-sm mb-4 filter-card">
//       <div className="card-body">
//         <div className="d-flex flex-wrap align-items-end gap-3">

//           {/* Month */}
//           <div className="filter-item">
//             <label className="form-label small text-muted mb-1">
//               {t('month')}
//             </label>
//             <select
//               className="form-select form-select-sm"
//               value={month}
//               onChange={(e) =>
//                 onChange({
//                   year,
//                   month: Number(e.target.value)
//                 })
//               }
//             >
//               {months.map(m => (
//                 <option key={m.value} value={m.value}>
//                   {m.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Year */}
//           <div className="filter-item">
//             <label className="form-label small text-muted mb-1">
//               {t('year')}
//             </label>
//             <select
//               className="form-select form-select-sm"
//               value={year}
//               onChange={(e) =>
//                 onChange({
//                   year: Number(e.target.value),
//                   month
//                 })
//               }
//             >
//               {years.map(y => (
//                 <option key={y} value={y}>
//                   {y}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Apply */}
//           <div className="ms-auto">
//             <button
//               className="btn btn-sm btn-primary px-4"
//               onClick={onApply}
//             >
//               <i className="fas fa-chart-line me-2" />
//               {t('view')}
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default UserMonthSelector;



// import { useTranslation } from 'react-i18next';

// function UserMonthSelector({ year, month, onChange, onApply }) {
//   const { t } = useTranslation();

//   const months = [
//     'january','february','march','april','may','june',
//     'july','august','september','october','november','december'
//   ];

//   return (
//     <div className="card border-0 shadow-sm mb-4">
//       <div className="card-body d-flex flex-wrap align-items-center gap-3">

//         {/* Title */}
//         <div className="me-auto">
//           <h6 className="mb-0 fw-bold">
//             <i className="fas fa-calendar-alt me-2 text-primary"></i>
//             {t('monthlyOverview')}
//           </h6>
//           <small className="text-muted">
//             {t('selectMonthToViewStats')}
//           </small>
//         </div>

//         {/* Month */}
//         <select
//           className="form-select form-select-sm w-auto"
//           value={month}
//           onChange={(e) =>
//             onChange({ year, month: Number(e.target.value) })
//           }
//         >
//           {months.map((m, i) => (
//             <option key={m} value={i + 1}>
//               {t(m)}
//             </option>
//           ))}
//         </select>

//         {/* Year */}
//         <select
//           className="form-select form-select-sm w-auto"
//           value={year}
//           onChange={(e) =>
//             onChange({ year: Number(e.target.value), month })
//           }
//         >
//           {[2023, 2024, 2025, 2026].map(y => (
//             <option key={y} value={y}>{y}</option>
//           ))}
//         </select>

//         {/* Button */}
//         <button
//           className="btn btn-primary btn-sm px-4"
//           onClick={onApply}
//         >
//           <i className="fas fa-chart-line me-2"></i>
//           {t('view')}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default UserMonthSelector;








//-----------------ui1
import { useTranslation } from 'react-i18next';
import "/src/style/attendanceProfile.css";

/* ══════════════════════════════════════════════════════════════
   StatCard
   ─────────────────────────────────────────────────────────────
   Props:
     icon       — FontAwesome class e.g. "fa-briefcase"
     label      — translated string
     value      — number from backend (totals.*)
     colorKey   — "blue" | "red" | "green" | "amber" | "sky"
                  | "violet" | "slate" | "ink"
     suffix     — optional e.g. "min"
══════════════════════════════════════════════════════════════ */
export function StatCard({ icon, label, value, colorKey = 'blue', suffix }) {
  return (
    <div className="att-stat-card">
      <div className={`att-stat-icon att-stat-icon--${colorKey}`}>
        <i className={`fas ${icon}`} />
      </div>
      <div>
        <div className="att-stat-value">
          {value ?? 0}
          {suffix && <small>{suffix}</small>}
        </div>
        <div className="att-stat-label">{label}</div>
      </div>
    </div>
  );
}


/* ══════════════════════════════════════════════════════════════
   UserStats
   ─────────────────────────────────────────────────────────────
   ✅ All numbers come from monthlyReport (backend):
      totals.*  — counts from recalculateMonthForUser
      salary.*  — amounts from calcPayrollForUser (admin only)
══════════════════════════════════════════════════════════════ */
export function UserStats({ monthlyReport, showPayroll = false }) {
  const { t } = useTranslation();

  if (!monthlyReport?.totals) {
    return (
      <div className="att-stats-empty">
        <i className="fas fa-calendar-alt" />
        {t('selectMonthToViewStats')}
      </div>
    );
  }

  const { totals, month, year, salary } = monthlyReport;

  return (
    <div className="att-stats-section">

      {/* Header */}
      <div className="att-stats-header">
        <h5>{t('monthlyOverview')}</h5>
        <span className="att-period-badge">
          {t('month')} {month} / {year}
        </span>
      </div>

      {/* Stats grid — values 100% from backend */}
      <div className="att-stats-grid">
        <StatCard icon="fa-briefcase"       colorKey="blue"   label={t('workingDays')}            value={totals.workingDays} />
        <StatCard icon="fa-calendar-times"  colorKey="red"    label={t('absentDays')}             value={totals.absentDays} />
        <StatCard icon="fa-plane-departure" colorKey="green"  label={t('paidLeaveDays')}          value={totals.paidLeaveDays} />
        <StatCard icon="fa-user-slash"      colorKey="amber"  label={t('unpaidLeaveDays')}        value={totals.unpaidLeaveDays} />
        <StatCard icon="fa-clock"           colorKey="amber"  label={t('totalLateMinutes')}       value={totals.totalLateMinutes}             suffix={t('min')} />
        <StatCard icon="fa-door-open"       colorKey="sky"    label={t('totalEarlyLeaveMinutes')} value={totals.totalEarlyLeaveMinutes}       suffix={t('min')} />
        <StatCard icon="fa-route"           colorKey="violet" label={t('transitDeduction')}       value={totals.totalTransitDeductionMinutes} suffix={t('min')} />
        <StatCard icon="fa-ban"             colorKey="ink"    label={t('invalidDays')}            value={totals.invalidDays} />
      </div>

      {/* Payroll — admin only — salary.* from calcPayrollForUser */}
      {showPayroll && salary && (
        <div className="att-payroll-card">
          <div className="att-payroll-card__header">
            <i className="fas fa-wallet" />
            <h6>{t('salaryDetails')}</h6>
          </div>
          <div className="att-payroll-card__body">
            <div className="att-payroll-row">
              <span className="att-payroll-row__label">{t('baseSalary')}</span>
              <span className="att-payroll-row__value">{salary.base}</span>
            </div>

            <div className="att-deductions-wrap">
              {[
                { key: 'absence', label: t('absence') },
                { key: 'late',    label: t('late') },
                { key: 'early',   label: t('earlyLeave') },
                { key: 'transit', label: t('transit') },
              ].map(({ key, label }) => (
                <div key={key} className="att-deduction-item">
                  <span>
                    <span className="att-deduction-item__dot" />
                    {label}
                  </span>
                  <span>− {salary[key]}</span>
                </div>
              ))}
            </div>

            <div className="att-payroll-net">
              <span className="att-payroll-net__label">{t('netSalary')}</span>
              <span className="att-payroll-net__value">{salary.net}</span>
            </div>
          </div>
        </div>
      )}

      <div className="att-note">
        <i className="fas fa-info-circle" />
        {t('monthlyStatsPreviewNote')}
      </div>
    </div>
  );
}


/* ══════════════════════════════════════════════════════════════
   UserMonthSelector
   ─────────────────────────────────────────────────────────────
   Props:
     year          — number
     month         — number (1–12)
     onChange      — ({ year, month }) => void
     onApply       — () => void  →  triggers getUserMonthlyReport
     monthlyReport — response from backend GET /admin/user-monthly-report
     loading       — bool
     error         — string | null
     showPayroll   — bool  (admin only)
══════════════════════════════════════════════════════════════ */
function UserMonthSelector({
  year,
  month,
  onChange,
  onApply,
  monthlyReport = null,
  loading       = false,
  error         = null,
  showPayroll   = false,
}) {
  const { t } = useTranslation();

  const MONTH_KEYS = [
    'january','february','march','april','may','june',
    'july','august','september','october','november','december',
  ];

  const currentYear = new Date().getFullYear();
  const YEARS = [];
  for (let y = currentYear - 2; y <= currentYear + 1; y++) YEARS.push(y);

  return (
    <div>

      {/* Selector card */}
      <div className="att-month-selector">
        <div className="att-month-selector__inner">

          <div className="att-month-selector__title">
            <h6>
              <span className="icon-wrap">
                <i className="fas fa-calendar-alt" />
              </span>
              {t('monthlyOverview')}
            </h6>
            <small>{t('selectMonthToViewStats')}</small>
          </div>

          <select
            className="att-select"
            value={month}
            disabled={loading}
            onChange={(e) => onChange({ year, month: Number(e.target.value) })}
          >
            {MONTH_KEYS.map((key, i) => (
              <option key={key} value={i + 1}>{t(key)}</option>
            ))}
          </select>

          <select
            className="att-select"
            value={year}
            disabled={loading}
            onChange={(e) => onChange({ year: Number(e.target.value), month })}
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          {/* <button
            className="att-btn-primary"
            onClick={onApply}
            disabled={loading}
          >
            {loading
              ? <><span className="btn-spinner" />{t('loading')}</>
              : <><i className="fas fa-chart-line" />{t('view')}</>
            }
          </button> */}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="att-form-error" style={{ marginBottom: '1rem' }}>
          <i className="fas fa-exclamation-triangle" />
          {error}
        </div>
      )}

      {/* Skeleton while loading (before first data) */}
      {loading && !monthlyReport && (
        <div className="att-stats-grid" style={{ marginBottom: '1.5rem' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="att-stat-card">
              <div className="att-skeleton" style={{ width: 42, height: 42, borderRadius: 11, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="att-skeleton" style={{ height: 22, width: '60%', marginBottom: 6 }} />
                <div className="att-skeleton" style={{ height: 12, width: '80%' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats — fully from backend */}
      {!loading && monthlyReport && (
        <UserStats monthlyReport={monthlyReport} showPayroll={showPayroll} />
      )}

      {/* Idle placeholder */}
      {/* {!loading && !monthlyReport && !error && (
        <div className="att-state" style={{ padding: '36px 0' }}>
          <div className="att-state__icon">📅</div>
          <div className="att-state__text">{t('selectMonthToViewStats')}</div>
        </div>
      )} */}
    </div>
  );
}

export default UserMonthSelector;