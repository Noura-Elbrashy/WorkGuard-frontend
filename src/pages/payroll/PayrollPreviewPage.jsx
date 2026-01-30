import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  previewPayroll,
  generatePayroll
} from '../../services/payroll.api';

import Toast from '../../components/ui/Toast';

const PayrollPreviewPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // userId جاي من بروفايل الموظف
  const { userId } = useParams();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [payroll, setPayroll] = useState(null);
  const [toast, setToast] = useState(null);

  /* =========================
     Load Preview
  ========================= */
  const loadPreview = async () => {
    try {
      setLoading(true);

      const res = await previewPayroll({
        userId,
        year,
        month
      });

      setPayroll(res.payroll);
    } catch (err) {
      setToast({
        type: 'error',
        message:
          err.response?.data?.message ||
          t('payroll.previewError')
      });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (userId) {
      loadPreview();
    }
  }, [userId, year, month]);
useEffect(() => {
  console.log('PAYROLL PREVIEW:', payroll);
  console.log('POLICIES:', payroll?.audit?.policies);
}, [payroll]);
  /* =========================
     Generate Payroll
  ========================= */
  // const handleGenerate = async () => {
  //   if (!window.confirm(t('payroll.confirmGenerate'))) return;

  //   try {
  //     setGenerating(true);

  //     const res = await generatePayroll({
  //       userId,
  //       year,
  //       month
  //     });

  //     navigate(`/payroll/${res.payrollRun._id}`);
  //   } catch (err) {
  //     setToast({
  //       type: 'error',
  //       message:
  //         err.response?.data?.message ||
  //         t('payroll.generateError')
  //     });
  //   } finally {
  //     setGenerating(false);
  //   }
  // };
  const policies = payroll?.audit?.policies || [];

const handleGenerate = async () => {
if (policies.length > 1) {
    const ok = window.confirm(
      t('payroll.confirmGenerateMultiplePolicies')
    );
    if (!ok) return;
  } else {
    if (!window.confirm(t('payroll.confirmGenerate'))) return;
  }

  try {
    setGenerating(true);
    const res = await generatePayroll({ userId, year, month });
    navigate(`/payroll/${res.payrollRun._id}`);
  } catch (err) {
    setToast({
      type: 'error',
      message:
        err.response?.data?.message ||
        t('payroll.generateError')
    });
  } finally {
    setGenerating(false);
  }
};
// const renderDayStatus = (d) => {
//   if (d.status === 'NON_WORKING_DAY') {
//     if (d.nonWorkingReason === 'WEEKLY_OFF') return 'Weekly Off';
//     if (d.nonWorkingReason === 'HOLIDAY') return 'Holiday';
//     return 'Non Working Day';
//   }

//   return d.status;
// };
const renderDayStatus = (d) => {
  if (d.decisionType === 'NON_WORKING_DAY') {
    if (d.nonWorkingReason === 'WEEKLY_OFF') return 'Weekly Off';
    if (d.nonWorkingReason === 'HOLIDAY') return 'Holiday';
    return 'Non Working Day';
  }

  return d.decisionType;
};

  return (
    <div className="container-fluid">

      {/* =========================
         Header
      ========================= */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>
          <i className="fas fa-receipt me-2" />
          {t('payroll.previewTitle')}
        </h3>

        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          <input
            type="number"
            className="form-control"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          {t('common.loading')}
        </div>
      )}

      {!loading && payroll && (
        <>
          {/* =========================
             Salary Summary
          ========================= */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="mb-3">{t('payroll.summary')}</h5>

              <div className="row">
                <div className="col-md-3">
                  <strong>{t('payroll.baseSalary')}</strong>
                  <div>{payroll.baseSalary}</div>
                </div>

                <div className="col-md-3">
                  <strong>{t('payroll.dailySalary')}</strong>
                  <div>{payroll.dailySalary}</div>
                </div>

                <div className="col-md-3">
                  <strong>{t('payroll.hourlySalary')}</strong>
                  <div>{payroll.hourlySalary}</div>
                </div>

                <div className="col-md-3">
                  <strong>{t('payroll.netSalary')}</strong>
                  <div className="text-success fw-bold">
                    {payroll.netSalary}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================
             Deductions Summary
          ========================= */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="mb-3">{t('payroll.deductions')}</h5>

              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <td>{t('payroll.absence')}</td>
                    <td>{payroll.deductions.absence}</td>
                  </tr>
                  <tr>
                    <td>{t('payroll.late')}</td>
                    <td>{payroll.deductions.late}</td>
                  </tr>
                  <tr>
                    <td>{t('payroll.earlyLeave')}</td>
                    <td>{payroll.deductions.earlyLeave}</td>
                  </tr>
                  <tr>
                    <td>{t('payroll.transit')}</td>
                    <td>{payroll.deductions.transit}</td>
                  </tr>
                  <tr className="table-light">
                    <td>
                      <strong>{t('payroll.totalDeductions')}</strong>
                    </td>
                    <td>
                      <strong>{payroll.deductions.total}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
{/* =========================
   Attendance Policy Timeline
========================= */}
{policies.length > 0 && (
  <div className="card mb-4">
    <div className="card-body">
      <h5 className="mb-3">
        {t('payroll.policyTimeline')}
        {policies.length > 1 && (
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
             <th>سماحية التأخير</th>
    <th>سماحية الانصراف المبكر</th>
            <th>{t('payroll.lateRate')}</th>
            <th>{t('payroll.earlyRate')}</th>
            <th>{t('payroll.transitRate')}</th>
               <th>سياسة الغياب</th>
          </tr>
        </thead>
        <tbody>
          {policies.map((p, idx) => (
            <tr key={idx}>
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
            <span className="badge bg-warning">
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
              <td>{p.grace?.lateMinutes} min</td>
<td>{p.grace?.earlyLeaveMinutes} min</td>
              <td>{p.rates?.latePerMinute ?? 0}</td>
              <td>{p.rates?.earlyLeavePerMinute ?? 0}</td>
              {/* <td>{p.rates?.transitPerMinute ?? 0}</td> */}
              <td>{p.rates?.transitPerMinute}</td>

                  {/* <td>
  {p.absence?.deductSalary
    ? p.absence.deductionType === 'percentage'
      ? `Unpaid / ${p.absence.percentage ?? 100}%`
      : `Unpaid / ${p.absence.dayRate ?? 1} day`
    : 'Paid'}
</td> */}
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
)}


          {/* =========================
             Daily Breakdown
          ========================= */}
          <div className="card">
            <div className="card-body">
              <h5 className="mb-3">
                {t('payroll.dailyBreakdown')}
              </h5>

              <table className="table table-sm table-bordered">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Late</th>
                    <th>Early</th>
                    <th>Transit</th>
                    <th>Absence</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {payroll.audit.daily.map((d, idx) => {
                    // const total =
                    //   d.deductions.absence +
                    //   d.deductions.late +
                    //   d.deductions.early +
                    //   d.deductions.transit;

                    return (
                      <tr key={idx}>
                        <td>
                          {new Date(d.date).toLocaleDateString()}
                        </td>
{/* <td>{d.status}</td> */}
<td>{renderDayStatus(d)}</td>

                        <td>{d.deductions.late}</td>
                        <td>{d.deductions.earlyLeave}</td>

                        <td>{d.deductions.transit}</td>
                        <td>{d.deductions.absence}</td>
                        <td className="fw-bold">{d.total}</td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* =========================
             Actions
          ========================= */}
          {/* {payroll.audit.policies.length > 1 && (
  <div className="alert alert-warning">
    {t('payroll.multiplePoliciesWarning')}
  </div>
)} */}
{policies.length > 1 && (
  <div className="alert alert-warning">
    {t('payroll.multiplePoliciesWarning')}
  </div>
)}

          <div className="d-flex justify-content-end mt-4">
            <button
              className="btn btn-success"
              disabled={generating}
              onClick={handleGenerate}
            >
              <i className="fas fa-lock me-1" />
              {t('payroll.generate')}
            </button>
          </div>
        </>
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

export default PayrollPreviewPage;
