// components/leave/profile/AdjustmentHistoryTable.jsx

import { useTranslation } from 'react-i18next';

function AdjustmentHistoryTable({ 
  history = [], 
  page, 
  pages, 
  total, 
  onPageChange 
}) {
const { t } = useTranslation('leave');
const { t: tCommon } = useTranslation('translation');


if (!history.length) return null;

  return (
    <div className="mt-4">
      <h6 className="mb-3">
        {t('leave.adjustmentHistory')} 
        <span className="text-muted ms-2 small">({total})</span>
      </h6>

      <div className="table-responsive">
        <table className="table table-bordered table-sm">
          <thead className="table-light">
            <tr>
              <th>{t('date')}</th>
              <th>{t('admin')}</th>
              <th>{t('leave.type')}</th>
              <th>{t('action')}</th>
              <th>{t('leave.before')}</th>
              <th>{t('leave.after')}</th>
              <th>{t('reason')}</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, i) => (
              <tr key={i}>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>{item.adminName}</td>
                <td>{item.type}</td>
                <td>
                  <span className={`badge ${item.operation === 'add' ? 'bg-success' : 'bg-danger'}`}>
                    {item.operation === 'add' ? '➕' : '➖'} {item.amount}
                  </span>
                </td>
                <td>{item.before}</td>
                <td>{item.after}</td>
                <td>{item.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination */}
      {pages > 1 && (
        <div className="d-flex justify-content-center gap-2 mt-2">
          <button 
            className="btn btn-sm btn-outline-secondary" 
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            {t('prev')}
          </button>
          <span className="align-self-center small">
            {page} / {pages}
          </span>
          <button 
            className="btn btn-sm btn-outline-secondary" 
            disabled={page >= pages}
            onClick={() => onPageChange(page + 1)}
          >
            {t('next')}
          </button>
        </div>
      )}
    </div>
  );
}

export default AdjustmentHistoryTable;