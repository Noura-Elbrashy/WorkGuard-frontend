import LeaveStatusBadge from '../components/LeaveStatusBadge';
import { useTranslation } from 'react-i18next';

function LeaveRequestsTable({
  leaves = [],
  loading = false,
  page = 1,
  pages = 1,
  onPageChange,
  onViewDetails
}) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!leaves.length) {
    return (
      <div className="alert alert-light text-center">
        {t('leave.noRequests')}
      </div>
    );
  }

  return (
    <>
      <div className="table-responsive">
        <table className="table table-sm table-bordered align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>{t('leave.type')}</th>
              <th>{t('leave.period')}</th>
              <th className="text-center">{t('leave.days')}</th>
              <th className="text-center">{t('leave.status')}</th>
              <th className="text-center">{t('actions')}</th>
            </tr>
          </thead>

          <tbody>
            {leaves.map(leave => (
              <tr key={leave._id}>
                <td>{t(`leave.types.${leave.leaveType}`)}</td>

                <td>
                  <div className="small">
                    <div>
                      <strong>{t('from')}:</strong>{' '}
                      {new Date(leave.startDate).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>{t('to')}:</strong>{' '}
                      {new Date(leave.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </td>

                <td className="text-center fw-semibold">
                  {leave.totalDays}
                </td>

                <td className="text-center">
                  <LeaveStatusBadge status={leave.status} />
                </td>

                <td className="text-center">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onViewDetails(leave._id)}
                  >
                    {t('details')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            ◀
          </button>

          <span className="small text-muted">
            {page} / {pages}
          </span>

          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={page === pages}
            onClick={() => onPageChange(page + 1)}
          >
            ▶
          </button>
        </div>
      )}
    </>
  );
}

export default LeaveRequestsTable;
