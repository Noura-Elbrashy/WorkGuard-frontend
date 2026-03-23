// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { getPayrollRuns } from '../../services/payroll.api';

// const EmployeePayrollHistory = ({ userId }) => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const [runs, setRuns] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const loadHistory = async () => {
//     try {
//       setLoading(true);
//       const res = await getPayrollRuns({ userId });
//       setRuns(res.data || []);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadHistory();
//   }, [userId]);

//   return (
//     <div className="card mt-4">
//       <div className="card-header fw-bold">
//         <i className="fas fa-history me-2" />
//         {t('payroll.historyTitle')}
//       </div>

//       <div className="card-body p-0">
//         {loading ? (
//           <div className="text-center py-4">{t('loading')}...</div>
//         ) : (
//           <table className="table table-bordered mb-0 align-middle">
//             <thead className="table-light">
//               <tr>
//                 <th>{t('payroll.period')}</th>
//                 <th>{t('payroll.netSalary')}</th>
//                 <th>{t('common.status')}</th>
//                 <th>{t('common.actions')}</th>
//               </tr>
//             </thead>
//             <tbody>
//               {runs.length === 0 && (
//                 <tr>
//                   <td colSpan="4" className="text-center text-muted">
//                     {t('payroll.noRuns')}
//                   </td>
//                 </tr>
//               )}

//               {runs.map(run => (
//                 <tr key={run._id}>
//                   <td>{run.period.month}/{run.period.year}</td>
//                   <td className="fw-bold">{run.netSalary}</td>
//                   <td>
//                     <span
//                       className={`badge ${
//                         run.status === 'approved'
//                           ? 'bg-success'
//                           : 'bg-secondary'
//                       }`}
//                     >
//                       {t(`common.${run.status}`)}
//                     </span>
//                   </td>
//                   <td>
//                     <button
//                       className="btn btn-sm btn-outline-primary"
//                       onClick={() => navigate(`/payroll/${run._id}`)}
//                     >
//                       {t('common.view')}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmployeePayrollHistory;



// src/components/payroll/EmployeePayrollHistory.jsx
import { useEffect, useState } from 'react';
import { useNavigate }         from 'react-router-dom';
import { useTranslation }      from 'react-i18next';
import { getPayrollRuns }      from '../../services/payroll.api';

const fmt = (n) =>
  n == null ? '—' : Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const MONTH_COLORS = ['#3b82f6','#8b5cf6','#ec4899','#f59e0b','#10b981',
                      '#06b6d4','#f97316','#84cc16','#6366f1','#14b8a6','#e11d48','#0ea5e9'];

const EmployeePayrollHistory = ({ userId }) => {
  const { t }    = useTranslation("Payroll");
  const navigate = useNavigate();

  const [runs,    setRuns]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [year,    setYear]    = useState(new Date().getFullYear());

  const years = Array.from({ length: 4 }, (_, i) => new Date().getFullYear() - i);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await getPayrollRuns({ userId, year, limit: 12 });
      setRuns(res.data || []);
    } catch {
      setRuns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (userId) loadHistory(); }, [userId, year]);

  // ── stats ──
  const approved    = runs.filter(r => r.status === 'approved');
  const totalNet    = approved.reduce((s, r) => s + (r.netSalary || 0), 0);
  const avgNet      = approved.length ? totalNet / approved.length : 0;
  const maxNet      = approved.length ? Math.max(...approved.map(r => r.netSalary || 0)) : 0;

  return (
    <div className="card border-0 shadow-sm mt-4">

      {/* ── Header ── */}
      <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <h6 className="mb-0 fw-bold">
            <i className="fas fa-history me-2 text-primary" />
            {t('payroll.historyTitle')}
          </h6>
          <select className="form-select form-select-sm w-auto"
            value={year} onChange={e => setYear(+e.target.value)}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* ── Mini stats ── */}
        {!loading && approved.length > 0 && (
          <div className="row g-2 mt-2 mb-3">
            {[
              { label: t('payroll.totalNet'),   value: fmt(totalNet), color: 'success', icon: 'fa-coins'        },
              { label: t('payroll.averageNet'),  value: fmt(avgNet),   color: 'primary', icon: 'fa-chart-bar'   },
              { label: t('payroll.highestNet'),  value: fmt(maxNet),   color: 'warning', icon: 'fa-arrow-up'    },
              { label: t('payroll.approvedCount'), value: `${approved.length} / ${runs.length}`, color: 'info', icon: 'fa-check-circle' },
            ].map(({ label, value, color, icon }) => (
              <div className="col-6 col-sm-3" key={label}>
                <div className={`rounded-3 p-2 text-center bg-${color} bg-opacity-10 border border-${color} border-opacity-25`}>
                  <i className={`fas ${icon} text-${color} mb-1`} style={{ fontSize: 14 }} />
                  <div className={`fw-bold text-${color}`} style={{ fontSize: 13 }}>{value}</div>
                  <div className="text-muted" style={{ fontSize: 10 }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="card-body px-4 pb-4 pt-2">
        {loading ? (
          <div className="text-center py-4">
            <span className="spinner-border spinner-border-sm text-primary me-2" />
            <span className="text-muted small">{t('common.loading')}</span>
          </div>
        ) : runs.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <i className="fas fa-inbox fa-2x mb-2 d-block opacity-25" />
            <div className="small">{t('payroll.noRuns')}</div>
          </div>
        ) : (
          <>
            {/* ── Month cards grid ── */}
            <div className="row g-2">
              {runs.map((run) => {
                const isApproved = run.status === 'approved';
                const monthColor = MONTH_COLORS[(run.period.month - 1) % 12];
                const monthName  = new Date(2000, run.period.month - 1).toLocaleString('en', { month: 'short' });
                const deduction  = run.deductions?.total || 0;
                const ot         = run.overtime?.total   || 0;
                const bonus      = run.bonus?.total      || 0;

                return (
                  <div className="col-6 col-md-4 col-lg-3" key={run._id}>
                    <div
                      className="rounded-3 border h-100 overflow-hidden"
                      style={{ cursor: 'pointer', transition: 'box-shadow .15s' }}
                      onClick={() => navigate(`/payroll/${run._id}`)}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.12)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>

                      {/* color band */}
                      <div style={{ background: monthColor, height: 4 }} />

                      <div className="p-3">
                        {/* Month + Status */}
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <div className="fw-bold" style={{ fontSize: 15, color: monthColor }}>{monthName}</div>
                            <div className="text-muted" style={{ fontSize: 11 }}>{run.period.year}</div>
                          </div>
                          <span className={`badge ${isApproved ? 'bg-success' : 'bg-warning text-dark'}`}
                            style={{ fontSize: 10 }}>
                            {isApproved ? '✓' : '⏳'} {t(`common.${run.status}`)}
                          </span>
                        </div>

                        {/* Net salary */}
                        <div className="fw-bold text-success mb-2" style={{ fontSize: 16 }}>
                          {fmt(run.netSalary)}
                          <span className="text-muted fw-normal ms-1" style={{ fontSize: 10 }}>{t('common.currency')}</span>
                        </div>

                        {/* Mini breakdown */}
                        <div style={{ fontSize: 11 }} className="d-flex flex-column gap-1">
                          {deduction > 0 && (
                            <div className="d-flex justify-content-between text-danger">
                              <span><i className="fas fa-minus-circle me-1" />{t('payroll.deductions')}</span>
                              <span>-{fmt(deduction)}</span>
                            </div>
                          )}
                          {ot > 0 && (
                            <div className="d-flex justify-content-between text-success">
                              <span><i className="fas fa-clock me-1" />{t('payroll.overtime')}</span>
                              <span>+{fmt(ot)}</span>
                            </div>
                          )}
                          {bonus > 0 && (
                            <div className="d-flex justify-content-between text-info">
                              <span><i className="fas fa-gift me-1" />{t('payroll.bonus')}</span>
                              <span>+{fmt(bonus)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Net salary trend bar ── */}
            {approved.length > 1 && (
              <div className="mt-3 pt-3 border-top">
                <div className="text-muted small mb-2">
                  <i className="fas fa-chart-line me-1" />{t('payroll.salaryTrend')}
                </div>
                <div className="d-flex align-items-end gap-1" style={{ height: 48 }}>
                  {runs.map((run) => {
                    const pct     = maxNet > 0 ? ((run.netSalary || 0) / maxNet) * 100 : 0;
                    const isApproved = run.status === 'approved';
                    const monthColor = MONTH_COLORS[(run.period.month - 1) % 12];
                    return (
                      <div key={run._id}
                        className="flex-grow-1 rounded-top position-relative"
                        style={{ height: `${Math.max(pct, 8)}%`, background: isApproved ? monthColor : '#e2e8f0', opacity: isApproved ? 1 : 0.5, transition: 'height .3s', cursor: 'pointer' }}
                        title={`${new Date(2000, run.period.month-1).toLocaleString('en',{month:'short'})} — ${fmt(run.netSalary)}`}
                        onClick={() => navigate(`/payroll/${run._id}`)}>
                        <div className="position-absolute w-100 text-center" style={{ bottom: '100%', fontSize: 9, color: '#64748b', whiteSpace: 'nowrap' }}>
                          {new Date(2000, run.period.month-1).toLocaleString('en',{month:'short'})}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeePayrollHistory;
