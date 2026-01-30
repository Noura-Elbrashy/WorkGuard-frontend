import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPayrollRuns } from '../../services/payroll.api';

const EmployeePayrollHistory = ({ userId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await getPayrollRuns({ userId });
      setRuns(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [userId]);

  return (
    <div className="card mt-4">
      <div className="card-header fw-bold">
        <i className="fas fa-history me-2" />
        {t('payroll.historyTitle')}
      </div>

      <div className="card-body p-0">
        {loading ? (
          <div className="text-center py-4">{t('loading')}...</div>
        ) : (
          <table className="table table-bordered mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>{t('payroll.period')}</th>
                <th>{t('payroll.netSalary')}</th>
                <th>{t('common.status')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {runs.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    {t('payroll.noRuns')}
                  </td>
                </tr>
              )}

              {runs.map(run => (
                <tr key={run._id}>
                  <td>{run.period.month}/{run.period.year}</td>
                  <td className="fw-bold">{run.netSalary}</td>
                  <td>
                    <span
                      className={`badge ${
                        run.status === 'approved'
                          ? 'bg-success'
                          : 'bg-secondary'
                      }`}
                    >
                      {t(`common.${run.status}`)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate(`/payroll/${run._id}`)}
                    >
                      {t('common.view')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EmployeePayrollHistory;
