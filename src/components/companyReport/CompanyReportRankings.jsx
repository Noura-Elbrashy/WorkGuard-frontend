// src/components/companyReport/CompanyReportRankings.jsx
/* ==============================================
   4 جداول Rankings — أكثر تأخيراً / غياباً / التزاماً / أوفرتايم
============================================== */

const fmt    = (n, d = 2) => n == null ? '—' : Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtInt = (n)         => n == null ? '—' : Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
const fmtMin = (m) => {
  if (!m) return '0h 0m';
  return `${Math.floor(m / 60)}h ${m % 60}m`;
};

const MEDALS = ['🥇', '🥈', '🥉'];

function RankingCard({ title, icon, iconColor, rows, valueKey, valueFormat, emptyMsg }) {
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-white border-0 pt-3 pb-2 px-3">
        <h6 className="mb-0 fw-semibold d-flex align-items-center gap-2">
          <i className={`fas ${icon} text-${iconColor}`} />
          {title}
        </h6>
      </div>
      <div className="card-body p-0">
        {!rows?.length ? (
          <div className="text-center text-muted py-4 small">{emptyMsg}</div>
        ) : (
          <div className="list-group list-group-flush">
            {rows.map((r, i) => (
              <div key={r.userId || i}
                   className="list-group-item d-flex align-items-center justify-content-between px-3 py-2 border-0 border-bottom ranking-row">
                <div className="d-flex align-items-center gap-2">
                  <span className="ranking-medal">
                    {i < 3 ? MEDALS[i] : <span className="text-muted small fw-semibold">{i + 1}</span>}
                  </span>
                  <div>
                    <div className="fw-semibold small">{r.name}</div>
                  </div>
                </div>
                <span className="badge bg-light text-dark border fw-semibold small">
                  {valueFormat(r[valueKey])}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const CompanyReportRankings = ({ rankings, t }) => (
  <div className="row g-3 mb-4">
    <div className="col-12 col-md-6 col-xl-3">
      <RankingCard
        title={t('topLate')}       icon="fa-clock"         iconColor="warning"
        rows={rankings.topLate}    valueKey="totalLateMinutes"
        valueFormat={fmtMin}       emptyMsg={t('noData')}
      />
    </div>
    <div className="col-12 col-md-6 col-xl-3">
      <RankingCard
        title={t('topAbsent')}     icon="fa-times-circle"  iconColor="danger"
        rows={rankings.topAbsent}  valueKey="absentDays"
        valueFormat={n => `${fmtInt(n)} ${t('days')}`}     emptyMsg={t('noData')}
      />
    </div>
    <div className="col-12 col-md-6 col-xl-3">
      <RankingCard
        title={t('topCommitted')}    icon="fa-star"          iconColor="success"
        rows={rankings.topCommitted} valueKey="score"
        valueFormat={n => Number(n).toFixed(2)}              emptyMsg={t('noData')}
      />
    </div>
    <div className="col-12 col-md-6 col-xl-3">
      <RankingCard
        title={t('topOvertime')}   icon="fa-business-time" iconColor="primary"
        rows={rankings.topOvertime} valueKey="overtimeTotal"
        valueFormat={fmt}           emptyMsg={t('noData')}
      />
    </div>
  </div>
);

export default CompanyReportRankings;