import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  getPayrollRunById,
  approvePayroll
} from '../../services/payroll.api';

import Toast from '../../components/ui/Toast';

const PayrollRunDetailsPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [run, setRun] = useState(null);
  const [toast, setToast] = useState(null);

  /* =========================
     Load Payroll Run
  ========================= */
  const loadRun = async () => {
    try {
      setLoading(true);
      const res = await getPayrollRunById(id);
      setRun(res.payrollRun);
    } catch (err) {
      setToast({
        type: 'error',
        message:
          err.response?.data?.message ||
          t('payroll.loadError')
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRun();
  }, [id]);

  /* =========================
     Approve Payroll
  ========================= */
  

//   const handleApprove = async () => {
//   if (run.policyTimeline.length > 1) {
//     const ok = window.confirm(
//       t('payroll.confirmApproveMultiplePolicies')
//     );
//     if (!ok) return;
//   } else {
//     if (!window.confirm(t('payroll.confirmApprove'))) return;
//   }

//   try {
//     setApproving(true);
//     await approvePayroll(run._id);
//     loadRun();
//     setToast({
//       type: 'success',
//       message: t('payroll.approved')
//     });
//   } catch (err) {
//     setToast({
//       type: 'error',
//       message:
//         err.response?.data?.message ||
//         t('payroll.approveError')
//     });
//   } finally {
//     setApproving(false);
//   }
// };
const handleApprove = async () => {
  const policiesCount = run?.policyTimeline?.length || 0;

  if (policiesCount > 1) {
    const ok = window.confirm(
      t('payroll.confirmApproveMultiplePolicies')
    );
    if (!ok) return;
  } else {
    if (!window.confirm(t('payroll.confirmApprove'))) return;
  }

  try {
    setApproving(true);
    await approvePayroll(run._id);
    await loadRun();
    setToast({
      type: 'success',
      message: t('payroll.approved')
    });
  } catch (err) {
    setToast({
      type: 'error',
      message:
        err.response?.data?.message ||
        t('payroll.approveError')
    });
  } finally {
    setApproving(false);
  }
};

  if (loading) {
    return (
      <div className="text-center py-5">
        {t('common.loading')}
      </div>
    );
  }

  if (!run) return null;

  const isApproved = run.status === 'approved';

  return (
    <div className="container-fluid">

      {/* =========================
         Header
      ========================= */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>
          <i className="fas fa-file-invoice-dollar me-2" />
          {t('payroll.detailsTitle')}
        </h3>

        <span
          className={`badge ${
            isApproved ? 'bg-success' : 'bg-warning'
          }`}
        >
          {isApproved
            ? t('payroll.statusApproved')
            : t('payroll.statusDraft')}
        </span>
      </div>

      {/* =========================
         Salary Summary
      ========================= */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="mb-3">{t('payroll.summary')}</h5>

          <div className="row">
            <div className="col-md-3">
              <strong>{t('payroll.baseSalary')}</strong>
              <div>{run.baseSalary}</div>
            </div>

            <div className="col-md-3">
              <strong>{t('payroll.dailySalary')}</strong>
              <div>{run.dailySalary}</div>
            </div>

            <div className="col-md-3">
              <strong>{t('payroll.hourlySalary')}</strong>
              <div>{run.hourlySalary}</div>
            </div>

            <div className="col-md-3">
              <strong>{t('payroll.netSalary')}</strong>
              <div className="fw-bold text-success">
                {run.netSalary}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
         Deductions
      ========================= */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="mb-3">{t('payroll.deductions')}</h5>

          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>{t('payroll.absence')}</td>
                <td>{run.deductions.absence}</td>
              </tr>
              <tr>
                <td>{t('payroll.late')}</td>
                <td>{run.deductions.late}</td>
              </tr>
              <tr>
                <td>{t('payroll.earlyLeave')}</td>
                {/* <td>{run.deductions.earlyLeave}</td> */}
<td>{run.deductions.earlyLeave}</td>

              </tr>
              <tr>
                <td>{t('payroll.transit')}</td>
                <td>{run.deductions.transit}</td>
              </tr>
              <tr className="table-light">
                <td>
                  <strong>{t('payroll.totalDeductions')}</strong>
                </td>
                <td>
                  <strong>{run.deductions.total}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
{/* =========================
   Attendance Policy Timeline
========================= */}
<div className="card mb-4">
  <div className="card-body">
    <h5 className="mb-3">
      {t('payroll.policyTimeline')}
      {/* {run.policyTimeline.length > 1 && ( 
      */}
      {run.policyTimeline && run.policyTimeline.length > 1 && (

        <span className="badge bg-warning ms-2">
          {t('payroll.multiplePolicies')}
        </span>
      )}
    </h5>

    <table className="table table-sm table-bordered">
      <thead className="table-light">
        <tr>
{/* <th>{t('payroll.policyVersion')}</th> */}
<th>{t('payroll.policyScope')}</th>
          <th>{t('payroll.from')}</th>
          <th>{t('payroll.to')}</th>
           <th>Late Grace (min)</th>
    <th>Early Grace (min)</th>
          <th>{t('payroll.lateRate')}</th>
          <th>{t('payroll.earlyRate')}</th>
          <th>{t('payroll.transitRate')}</th>
            <th>Absence</th>
        </tr>
      </thead>
      <tbody>
        {(run.policyTimeline || []).map((p, idx) => (
          <tr key={idx}>
           {/* <td>
  v{p.version}
  {p.scope && (
    <span className="badge bg-secondary ms-1">
      {p.scope.toUpperCase()}
    </span>
  )}
</td> */}
  {/* ✅ اسم السياسة */}
        <td>
          {p.scope === 'global' && (
            <span className="badge bg-primary">
              <i className="fas fa-globe me-1"></i>
              Global Policy
            </span>
          )}
          {p.scope === 'branch' && (
            <span className="badge bg-info">
              <i className="fas fa-building me-1"></i>
          {p.branchName || 'Branch Policy'}
            </span>
          )}
          {p.scope === 'role' && (
            <span className="badge bg-warning text-dark">
              <i className="fas fa-user-shield me-1"></i>
          {p.role === 'admin' ? 'Admin' : 'Staff'} Policy
            </span>
          )}
          {p.scope === 'user' && (
            <span className="badge bg-success">
              <i className="fas fa-user me-1"></i>
              User-Specific
            </span>
          )}
          {!p.scope && (
            <span className="badge bg-secondary">
              Unknown
            </span>
          )}
        </td>
            <td>{new Date(p.from).toLocaleDateString()}</td>
            <td>{new Date(p.to).toLocaleDateString()}</td>
                  <td>{p.grace?.lateMinutes ?? 0}</td>
      <td>{p.grace?.earlyLeaveMinutes ?? 0}</td>
            <td>{p.rates?.latePerMinute ?? 0}</td>
            <td>{p.rates?.earlyLeavePerMinute ?? 0}</td>
            <td>{p.rates?.transitPerMinute ?? 0}</td>
                  {/* <td>{p.absence?.markDayAbsent ? 'Unpaid / 100%' : 'Paid'}</td> */}
   <td>
  {p.absence?.deductSalary === false
    ? 'No Deduction'
    : p.absence?.paid
    ? 'Paid Absence'
    : `Unpaid / ${((p.absence?.dayRate ?? 1) * 100).toFixed(0)}%`}
</td>


          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

      {/* =========================
         Audit Info
      ========================= */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="mb-3">{t('payroll.audit')}</h5>

          <div className="row">
            <div className="col-md-4">
              <strong>{t('payroll.generatedAt')}</strong>
              <div>
                {new Date(run.regeneratedAt || run.generatedAt || run.createdAt
).toLocaleString()}
              </div>
            </div>

            <div className="col-md-4">
              <strong>{t('payroll.generatedBy')}</strong>
              <div>{run.generatedBy?.name || '-'}</div>
            </div>

            {isApproved && (
              <div className="col-md-4">
                <strong>{t('payroll.approvedAt')}</strong>
                <div>
                  {new Date(run.approvedAt).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================
         Actions
      ========================= */}
      {!isApproved && (
        <div className="d-flex justify-content-end gap-2">
          <button
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            {t('common.back')}
          </button>

          <button
            className="btn btn-success"
            disabled={approving}
            onClick={handleApprove}
          >
            <i className="fas fa-lock me-1" />
            {t('payroll.approve')}
          </button>
        </div>
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

export default PayrollRunDetailsPage;
