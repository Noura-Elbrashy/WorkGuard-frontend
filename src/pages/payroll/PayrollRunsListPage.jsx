import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPayrollRuns } from '../../services/payroll.api';
import Toast from '../../components/ui/Toast';

const PayrollRunsListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: '',
    status: ''
  });

  const loadRuns = async () => {
    try {
      setLoading(true);
      const res = await getPayrollRuns(filters);
      setRuns(res.data || []);
    } catch {
      setToast({ type: 'error', message: t('payroll.loadError') });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRuns();
  }, []);

  return (
    <div className="container-fluid">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>
          <i className="fas fa-file-invoice-dollar me-2" />
          {t('payroll.runsTitle')}
        </h3>
      </div>

      {/* Filters */}
      <div className="card mb-3">
        <div className="card-body row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label">{t('common.year')}</label>
            <input
              type="number"
              className="form-control"
              value={filters.year}
              onChange={(e) =>
                setFilters({ ...filters, year: e.target.value })
              }
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">{t('common.month')}</label>
            <input
              type="number"
              min="1"
              max="12"
              className="form-control"
              value={filters.month}
              onChange={(e) =>
                setFilters({ ...filters, month: e.target.value })
              }
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">{t('common.status')}</label>
            <select
              className="form-select"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">{t('common.all')}</option>
              <option value="draft">{t('common.draft')}</option>
              <option value="approved">{t('common.approved')}</option>
            </select>
          </div>

          <div className="col-md-3">
            <button
              className="btn btn-primary w-100"
              onClick={loadRuns}
            >
              {t('common.search')}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-5">{t('common.loading')}...</div>
      ) : (
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>{t('common.name')}</th>
              <th>{t('payroll.period')}</th>
              <th>{t('payroll.netSalary')}</th>
              <th>{t('common.status')}</th>
              <th>{t('common.actions')}</th>
            </tr>
          </thead>

          <tbody>
            {runs.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  {t('payroll.noRuns')}
                </td>
              </tr>
            )}

            {runs.map(run => (
              <tr key={run._id}>
                <td>{run.user?.name}</td>
                {/* <td>{run.period.month}/{run.period.year}</td> */}
                <td>
  {run.period.month}/{run.period.year}
  {run.policyTimeline?.length > 1 && (
    <span className="badge bg-warning ms-1">
      {t('payroll.multiplePolicies')}
    </span>
  )}
</td>

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

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default PayrollRunsListPage;
