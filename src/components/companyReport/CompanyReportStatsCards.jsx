// src/components/companyReport/CompanyReportStatsCards.jsx
/* ==============================================
   بطاقات الإحصاء العلوية — قابلة للضغط لتصفية الجدول
============================================== */
const CompanyReportStatsCards = ({ totals, activeKpi, onKpiClick, t }) => {
  const cards = [
    { key: 'workingDays',    icon: 'fa-check-circle',  color: 'success',   value: totals.workingDays    ?? 0 },
    { key: 'absentDays',     icon: 'fa-times-circle',  color: 'danger',    value: totals.absentDays     ?? 0 },
    { key: 'paidLeaveDays',  icon: 'fa-umbrella-beach',color: 'info',      value: totals.paidLeaveDays  ?? 0 },
    { key: 'remoteWorkDays', icon: 'fa-laptop-house',  color: 'primary',   value: totals.remoteWorkDays ?? 0 },
  ];

  return (
    <div className="row g-3 mb-4">
      {cards.map((card) => {
        const isActive = activeKpi === card.key;
        return (
          <div key={card.key} className="col-6 col-lg-3">
            <div
              className={`stat-card stat-card-${card.color} ${isActive ? 'stat-card-active' : ''}`}
              role="button"
              onClick={() => onKpiClick(card.key)}
            >
              <div className="stat-icon">
                <i className={`fas ${card.icon}`} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{Number(card.value).toLocaleString()}</div>
                <div className="stat-label">{t(card.key)}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CompanyReportStatsCards;