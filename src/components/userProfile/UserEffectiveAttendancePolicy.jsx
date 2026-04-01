
// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import {
//   getUserEffectiveAttendancePolicy
// } from '../../services/attendancePolicy.api';

// const UserEffectiveAttendancePolicy = ({ userId, isAdmin }) => {
//   const { t } = useTranslation();

//   const [policy, setPolicy] = useState(null);
//   const [meta, setMeta] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!isAdmin || !userId) return;

//     setLoading(true);

//     getUserEffectiveAttendancePolicy(userId)
//       .then(res => {
//         setPolicy(res.policy || null);
//         setMeta(res.meta || null);
//       })
//       .catch(() => {
//         setPolicy(null);
//         setMeta(null);
//       })
//       .finally(() => setLoading(false));
//   }, [userId, isAdmin]);

//   if (!isAdmin) return null;

//   if (loading) {
//     return (
//       <div className="card mb-4 border-info">
//         <div className="card-body text-muted">
//           {t('common.loading')}
//         </div>
//       </div>
//     );
//   }

//   if (!policy) return null;

//   return (
//     <div className="card mb-4 border-info">
//       <div className="card-body">

//         {/* =========================
//            Title
//         ========================= */}
//         <h5 className="mb-3 text-info">
//           <i className="fas fa-shield-alt me-2" />
//           {t('attendancePolicy.effectiveForUser')}
//         </h5>

//         {/* =========================
//            Explanation
//         ========================= */}
//         <div className="alert alert-info small mb-3">
//           {t('attendancePolicy.effectivePolicyExplanation')}
//         </div>

//         {/* =========================
//            Meta / Source
//         ========================= */}
//         {meta && (
//           <div className="mb-3 small text-muted">
//             <div>
//               <strong>{t('attendancePolicy.policySource')}:</strong>{' '}
//               {meta.source === 'attendance:first-valid-checkin'
//                 ? t('attendancePolicy.sourceFirstValidCheckin')
//                 : t('attendancePolicy.sourceNoValidAttendance')}
//             </div>

//             {meta.appliedBranch && (
//               <div>
//                 <strong>{t('attendancePolicy.appliedBranch')}:</strong>{' '}
//                 {meta.appliedBranch.name || meta.appliedBranch}
//               </div>
//             )}
//           </div>
//         )}

//         <hr />

//         {/* =========================
//            Grace
//         ========================= */}
//         <h6 className="text-secondary mb-2">
//           {t('attendancePolicy.grace')}
//         </h6>

//         <div className="row mb-3">
//           <div className="col-md-6">
//             <strong>{t('attendancePolicy.graceLate')}</strong>
//             <div>
//               {policy.grace.lateMinutes} {t('common.minutes')}
//             </div>
//           </div>

//           <div className="col-md-6">
//             <strong>{t('attendancePolicy.graceEarly')}</strong>
//             <div>
//               {policy.grace.earlyLeaveMinutes} {t('common.minutes')}
//             </div>
//           </div>
//         </div>

//         <hr />

//         {/* =========================
//            Deduction Rates
//         ========================= */}
//         <h6 className="text-secondary mb-2">
//           {t('attendancePolicy.deductions')}
//         </h6>

//         <ul className="list-unstyled mb-3">
//           <li>
//             <strong>{t('attendancePolicy.lateRate')}:</strong>{' '}
//             {policy.rates.latePerMinute}
//             <span className="text-muted ms-1">
//               ({t('attendancePolicy.ratePerMinuteHint')})
//             </span>
//           </li>

//           <li>
//             <strong>{t('attendancePolicy.earlyRate')}:</strong>{' '}
//             {policy.rates.earlyLeavePerMinute}
//             <span className="text-muted ms-1">
//               ({t('attendancePolicy.ratePerMinuteHint')})
//             </span>
//           </li>

//           <li>
//             <strong>{t('attendancePolicy.transitRate')}:</strong>{' '}
//             {policy.rates.transitPerMinute}
//             <span className="text-muted ms-1">
//               ({t('attendancePolicy.transitRateHint')})
//             </span>
//           </li>
//         </ul>

//         <hr />

//         {/* =========================
//            Absence
//         ========================= */}
//         <h6 className="text-secondary mb-2">
//           {t('attendancePolicy.absence')}
//         </h6>

//         <div className="row">
//           <div className="col-md-6">
//             <strong>{t('attendancePolicy.absenceStatus')}</strong>
//             <div>
//               {policy.absence.paid
//                 ? t('attendancePolicy.absencePaid')
//                 : t('attendancePolicy.absenceUnpaid')}
//             </div>
//           </div>

//           <div className="col-md-6">
//             <strong>{t('attendancePolicy.absenceDayRate')}</strong>
//             <div>
//               {policy.absence.markDayAbsent
//                 ? `${policy.absence.dayRate * 100}%`
//                 : t('attendancePolicy.noDeduction')}
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default UserEffectiveAttendancePolicy;






//no need 
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getUserEffectiveAttendancePolicy
} from '../../services/attendancePolicy.api';
import Toast from '../ui/Toast';

const UserEffectiveAttendancePolicy = ({ userId, isAdmin }) => {
  const { t } = useTranslation();

  const [policy, setPolicy] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!isAdmin || !userId) return;

    setLoading(true);

    getUserEffectiveAttendancePolicy(userId)
      .then(res => {
        setPolicy(res.policy || null);
        setMeta(res.meta || null);
      })
      .catch(() => {
        setPolicy(null);
        setMeta(null);
        setToast({
          type: 'error',
          message: t('attendancePolicy.loadError')
        });
      })
      .finally(() => setLoading(false));
  }, [userId, isAdmin, t]);

  if (!isAdmin) return null;

  if (loading) {
    return (
      <div className="card mb-4 border-info">
        <div className="card-body text-muted">
          {t('common.loading')}
        </div>
      </div>
    );
  }

  // ✅ لا توجد سياسة مطبقة اليوم
  if (
    !policy ||
    meta?.source === 'no-valid-attendance'
  ) {
    return (
      <>
        <div className="card mb-4 border-secondary">
          <div className="card-body">
            <h5 className="mb-2 text-secondary">
              <i className="fas fa-shield-alt me-2" />
              {t('attendancePolicy.effectiveForUser')}
            </h5>

            <div className="text-muted small">
              {t('attendancePolicy.noEffectivePolicyToday')}
            </div>
          </div>
        </div>

        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="card mb-4 border-info">
        <div className="card-body">

          {/* =========================
             Title
          ========================= */}
          <h5 className="mb-3 text-info">
            <i className="fas fa-shield-alt me-2" />
            {t('attendancePolicy.effectiveForUser')}
          </h5>

          {/* =========================
             Explanation
          ========================= */}
          <p className="text-muted small mb-3">
            {t('attendancePolicy.effectivePolicyExplanation')}
          </p>

          {/* =========================
             Meta / Source (واضح ومركزي)
          ========================= */}
          {meta && (
            <div className="card mb-3">
              <div className="card-body small">
                <div className="mb-1">
                  <strong>{t('attendancePolicy.policySource')}:</strong>{' '}
                  {meta.source === 'attendance:first-valid-checkin'
                    ? t('attendancePolicy.sourceFirstValidCheckin')
                    : t('attendancePolicy.sourceNoValidAttendance')}
                </div>

                {meta.appliedBranch && (
                  <div>
                    <strong>{t('attendancePolicy.appliedBranch')}:</strong>{' '}
                    <span className="badge bg-info text-dark">
                      {meta.appliedBranch.name || meta.appliedBranch}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================
             Grace
          ========================= */}
          <div className="card mb-3">
            <div className="card-body">
              <h6 className="text-secondary mb-3">
                <i className="fas fa-clock me-1" />
                {t('attendancePolicy.grace')}
              </h6>

              <div className="row">
                <div className="col-md-6">
                  <strong>{t('attendancePolicy.graceLate')}</strong>
                  <div>
                    {policy.grace.lateMinutes} {t('common.minutes')}
                  </div>
                </div>

                <div className="col-md-6">
                  <strong>{t('attendancePolicy.graceEarly')}</strong>
                  <div>
                    {policy.grace.earlyLeaveMinutes} {t('common.minutes')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================
             Deductions
          ========================= */}
          <div className="card mb-3">
            <div className="card-body">
              <h6 className="text-secondary mb-3">
                <i className="fas fa-coins me-1" />
                {t('attendancePolicy.deductions')}
              </h6>

              <ul className="list-unstyled mb-0">
                <li>
                  <strong>{t('attendancePolicy.lateRate')}:</strong>{' '}
                  {policy.rates.latePerMinute}{' '}
                  <span className="text-muted">
                    ({t('attendancePolicy.ratePerMinuteHint')})
                  </span>
                </li>

                <li>
                  <strong>{t('attendancePolicy.earlyRate')}:</strong>{' '}
                  {policy.rates.earlyLeavePerMinute}{' '}
                  <span className="text-muted">
                    ({t('attendancePolicy.ratePerMinuteHint')})
                  </span>
                </li>

                <li>
                  <strong>{t('attendancePolicy.transitRate')}:</strong>{' '}
                  {policy.rates.transitPerMinute}{' '}
                  <span className="text-muted">
                    ({t('attendancePolicy.ratePerMinuteHint')})
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* =========================
             Absence
          ========================= */}
          <div className="card">
            <div className="card-body">
              <h6 className="text-secondary mb-3">
                <i className="fas fa-user-times me-1" />
                {t('attendancePolicy.absence')}
              </h6>

              <div className="row">
                <div className="col-md-6">
                  <strong>{t('attendancePolicy.absenceStatus')}</strong>
                  <div>
                    {policy.absence.paid
                      ? t('attendancePolicy.absencePaid')
                      : t('attendancePolicy.absenceUnpaid')}
                  </div>
                </div>

                <div className="col-md-6">
                  <strong>{t('attendancePolicy.absenceDayRate')}</strong>
                  <div>
                    {policy.absence.markDayAbsent
                      ? `${policy.absence.dayRate * 100}%`
                      : t('attendancePolicy.noDeduction')}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default UserEffectiveAttendancePolicy;
