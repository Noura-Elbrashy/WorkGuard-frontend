// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { getUserAssignedAttendancePolicies } from '../../services/attendancePolicy.api';

// const UserAssignedAttendancePolicies = ({ userId }) => {
//   const { t } = useTranslation();
//   const [data, setData] = useState(null);
//   const [expanded, setExpanded] = useState(false);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!userId) return;

//     setLoading(true);
//     getUserAssignedAttendancePolicies(userId)
//       .then(setData)
//       .finally(() => setLoading(false));
//   }, [userId]);

//   if (loading) {
//     return <div className="text-muted">{t('common.loading')}</div>;
//   }

//   if (!data) return null;

//   return (
//     <div className="card border-secondary mb-4">
//       <div className="card-body">

//         <h5 className="mb-3">
//           <i className="fas fa-layer-group me-2" />
//           {t('attendancePolicy.assignedPolicies')}
//         </h5>

//         {/* Global */}
//         {data.global && (
//           <div className="mb-2">
//             <strong>{t('attendancePolicy.globalPolicy')}</strong>
//           </div>
//         )}

//         {/* Role */}
//         {data.role && (
//           <div className="mb-2">
//             <strong>{t('attendancePolicy.rolePolicy')}:</strong>{' '}
//             <span className="badge bg-secondary">
//               {data.role.role}
//             </span>
//           </div>
//         )}

//         {/* Branches */}
//         {data.branches?.length > 0 && (
//           <>
//             <button
//               className="btn btn-outline-secondary btn-sm mb-2"
//               onClick={() => setExpanded(v => !v)}
//             >
//               <i className="fas fa-code-branch me-1" />
//               {t('attendancePolicy.branchPolicies')}
//             </button>

//             {expanded && (
//               <ul className="list-group list-group-flush small">
//                 {data.branches.map(b => (
//                   <li key={b.branchId} className="list-group-item">
//                     🏢 {b.branchName}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </>
//         )}

//         {!data.global && !data.role && !data.branches?.length && (
//           <div className="text-muted small">
//             {t('attendancePolicy.noAssignedPolicies')}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserAssignedAttendancePolicies;


import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getUserAssignedAttendancePolicies } from '../../services/attendancePolicy.api';


const PolicyDetails = ({ policy }) => {
  const { t } = useTranslation();
  if (!policy) return null;

  return (
    <div className="border rounded p-3 mt-2 bg-light small">
      <div className="mb-1">
        <strong>{t('attendancePolicy.policyDetails.graceLate')}:</strong>{' '}
        {policy.grace?.lateMinutes ?? 0} min
      </div>
      <div className="mb-1">
        <strong>{t('attendancePolicy.policyDetails.graceEarly')}:</strong>{' '}
        {policy.grace?.earlyLeaveMinutes ?? 0} min
      </div>
      <div className="mb-1">
        <strong>{t('attendancePolicy.policyDetails.lateRate')}:</strong>{' '}
        {policy.rates?.latePerMinute ?? 0}
      </div>
      <div className="mb-1">
        <strong>{t('attendancePolicy.policyDetails.earlyRate')}:</strong>{' '}
        {policy.rates?.earlyLeavePerMinute ?? 0}
      </div>
      <div className="mb-1">
        <strong>{t('attendancePolicy.policyDetails.transitRate')}:</strong>{' '}
        {policy.rates?.transitPerMinute ?? 0}
      </div>
      <div className="mb-1">
        <strong>{t('attendancePolicy.policyDetails.absence')}:</strong>{' '}
        {policy.absence?.paid
          ? t('attendancePolicy.policyDetails.paid')
          : t('attendancePolicy.policyDetails.unpaid')}{' '}
        /{' '}
        {policy.absence?.markDayAbsent
          ? `${policy.absence?.dayRate * 100}%`
          : t('attendancePolicy.policyDetails.noDeduction')}
      </div>
    </div>
  );
};

const UserAssignedAttendancePolicies = ({ userId }) => {
  const { t } = useTranslation();

  const [data, setData] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(false);

  const toggle = (key) => {
    setExpanded(e => ({ ...e, [key]: !e[key] }));
  };

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    getUserAssignedAttendancePolicies(userId)
      .then(setData)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return <div className="text-muted">{t('common.loading')}</div>;
  }

  if (!data) return null;

  return (
    <div className="card border-secondary mb-4">
      <div className="card-body">

        <h5 className="mb-3">
          <i className="fas fa-layer-group me-2" />
          {t('attendancePolicy.assignedPolicies')}
        </h5>

        {/* =========================
            Global Policy
        ========================= */}
        {data.global && (
          <div className="mb-3">
            <button
              className="btn btn-outline-secondary btn-sm w-100 text-start"
              onClick={() => toggle('global')}
            >
              🌍 {t('attendancePolicy.globalPolicy')}
            </button>

            {expanded.global && (
              <PolicyDetails policy={data.global.policy} />
            )}
          </div>
        )}

        {/* =========================
            Role Policy
        ========================= */}
        {data.role && (
          <div className="mb-3">
            <button
              className="btn btn-outline-secondary btn-sm w-100 text-start"
              onClick={() => toggle('role')}
            >
              👤 {t('attendancePolicy.rolePolicy')} – {data.role.role}
            </button>

            {expanded.role && (
              <PolicyDetails policy={data.role.policy} />
            )}
          </div>
        )}

        {/* =========================
            Branch Policies
        ========================= */}
        {data.branches?.length > 0 && (
          <div className="mb-2">
            <div className="text-muted small mb-2">
              {t('attendancePolicy.branchPolicies')}
            </div>

            {data.branches.map(b => (
              <div key={b.branchId} className="mb-2">
                <button
                  className="btn btn-outline-secondary btn-sm w-100 text-start"
                  onClick={() => toggle(b.branchId)}
                >
                  🏢 {b.branchName}
                </button>

                {expanded[b.branchId] && (
                  <PolicyDetails policy={b.policy} />
                )}
              </div>
            ))}
          </div>
        )}

        {!data.global && !data.role && !data.branches?.length && (
          <div className="text-muted small">
            {t('attendancePolicy.noAssignedPolicies')}
          </div>
        )}

      </div>
    </div>
  );
};

export default UserAssignedAttendancePolicies;
