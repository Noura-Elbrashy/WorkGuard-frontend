// import { useTranslation } from 'react-i18next';
// import '../../style/UserProfile.css';
// function UserHeader({ user, isAdmin }) {
//   const { t } = useTranslation();

//   if (!user) return null;

//   return (
//     <div className="card shadow-sm mb-4">
//       <div className="card-body">
//         <div className="row align-items-center">

//           {/* Left */}
//           <div className="col-md-8">
//             <h3 className="mb-1">
//               <i className="fas fa-user-circle me-2 text-primary"></i>
//               {user.name}
//             </h3>

//             <p className="mb-1 text-muted">
//               <i className="fas fa-envelope me-2"></i>
//               {user.email}
//             </p>

//             {user.phone && (
//               <p className="mb-1 text-muted">
//                 <i className="fas fa-phone me-2"></i>
//                 {user.phone}
//               </p>
//             )}

//             <p className="mb-0 text-muted">
//               <i className="fas fa-building me-2"></i>
//               {user.branches?.length
//                 ? user.branches.map(b => b.name).join(' , ')
//                 : t('noBranches')}
//             </p>
//           </div>

//           {/* Right */}
//           <div className="col-md-4 text-md-end mt-3 mt-md-0">
//             <span className="badge bg-secondary fs-6 mb-2 d-inline-block">
//               <i className="fas fa-user-tag me-2"></i>
//               {t(user.role)}
//             </span>

//             {user.salary && isAdmin && (
//               <div className="mt-2">
//                 <span className="badge bg-success fs-6">
//                   <i className="fas fa-coins me-2"></i>
//                   {user.salary} {t('currency')}
//                 </span>
//               </div>
//             )}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// // export default UserHeader;
// import { useTranslation } from 'react-i18next';
// import '../../style/UserProfile.css';
// import { employmentStatusMap } from '../../helpers/userHelpers';

// function UserHeader({ user, isAdmin }) {
//   const { t } = useTranslation();
//   if (!user) return null;

// const status =
//   employmentStatusMap[user.employmentStatus] ||
//   employmentStatusMap.active;
// let statusKey = user.employmentStatus;

// if (!user.isActive) {
//   statusKey = 'pending';
// }

//   return (
//     <div className="card shadow-sm mb-4 border-0">
//       <div className="card-body">
//         <div className="row align-items-center">

//           {/* LEFT – Identity */}
//           <div className="col-md-8">
//             <h4 className="mb-1 fw-bold">
//               <i className="fas fa-user-circle me-2 text-primary"></i>
//               {user.name}
//             </h4>

//             <div className="text-muted small mb-1">
//               <i className="fas fa-envelope me-2"></i>
//               {user.email}
//             </div>
// <span className={`badge bg-${status.color}`}>
//   {t(statusKey)}
// </span>

//             {user.branches?.length > 0 && (
//               <div className="text-muted small">
//                 <i className="fas fa-building me-2"></i>
//                 {user.branches.map(b => b.name).join(' , ')}
//               </div>
//             )}

//             {/* Employment Info */}
//             <div className="mt-2 small text-muted">
//               {user.employmentStartDate && (
//                 <div>
//                   <i className="fas fa-calendar-day me-2"></i>
//                   {t('startDate')}: {new Date(user.employmentStartDate).toLocaleDateString()}
//                 </div>
//               )}
// {user.workingDaysNames?.length > 0 && (
//   <div>
//     <i className="fas fa-calendar-week me-2"></i>
//     {t('workingDays')}: {user.workingDaysNames.join(' , ')}
//   </div>
// )}

// {user.workStartTime && user.workEndTime && (
//   <div>
//     <i className="fas fa-clock me-2"></i>
//     {t('workingHours')}: {user.workStartTime} – {user.workEndTime}
//   </div>
// )}

//             </div>
//           </div>

//           {/* RIGHT – Status & Admin Info */}
//           <div className="col-md-4 text-md-end mt-3 mt-md-0">

//             {/* Employment Status */}
//             <span className={`badge bg-${status.color} fs-6 mb-2`}>
//               <i className={`fas ${status.icon} me-2`}></i>
//               {t(user.employmentStatus)}
//             </span>

//             {/* Role */}
//             <div>
//               <span className="badge bg-light text-dark">
//                 <i className="fas fa-user-tag me-2"></i>
//                 {t(user.role)}
//               </span>
//             </div>

//             {/* Salary – Admin only */}
//             {isAdmin && user.salary && (
//               <div className="mt-2">
//                 <span className="badge bg-success">
//                   <i className="fas fa-coins me-2"></i>
//                   {user.salary} {t('currency')}
//                 </span>
//               </div>
//             )}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default UserHeader;
import { useTranslation } from 'react-i18next';
import '../../style/UserProfile.css';
import { employmentStatusMap } from '../../helpers/userHelpers';

function UserHeader({ user, isAdmin }) {
  const { t } = useTranslation();
  if (!user) return null;

  // =========================
  // Account Status (Activation)
  // =========================
  const accountStatus = user.isActive ? 'active' : 'pending';
const currentStatus = user?.employmentHistory?.at(-1)?.status;
  // =========================
  // Employment Status (HR)
  // =========================
  const employmentStatus =
    employmentStatusMap[currentStatus] ||
    employmentStatusMap.active;

  return (
    <div className="card shadow-sm mb-4 border-0">
      <div className="card-body">
        <div className="row align-items-center">

          {/* LEFT – Identity */}
          <div className="col-md-8">
            <h4 className="mb-1 fw-bold">
              <i className="fas fa-user-circle me-2 text-primary"></i>
              {user.name}
            </h4>

            <div className="text-muted small mb-1">
              <i className="fas fa-envelope me-2"></i>
              {user.email}
            </div>

            {/* Account Status */}
            <span
              className={`badge ${
                user.isActive ? 'bg-success' : 'bg-warning'
              }`}
            >
              <i
                className={`fas ${
                  user.isActive ? 'fa-check-circle' : 'fa-clock'
                } me-1`}
              ></i>
              {user.isActive
                ? t('accountActive')
                : t('pendingActivation')}
            </span>

            {user.branches?.length > 0 && (
              <div className="text-muted small mt-1">
                <i className="fas fa-building me-2"></i>
                {user.branches.map(b => b.name).join(' , ')}
              </div>
            )}

            {/* Employment Info */}
            <div className="mt-2 small text-muted">
              {user.employmentStartDate && (
                <div>
                  <i className="fas fa-calendar-day me-2"></i>
                  {t('startDate')}:{' '}
                  {new Date(user.employmentStartDate).toLocaleDateString()}
                </div>
              )}

              {user.workingDaysNames?.length > 0 && (
                <div>
                  <i className="fas fa-calendar-week me-2"></i>
                  {t('workingDays')}:{' '}
                  {user.workingDaysNames.join(' , ')}
                </div>
              )}

              {user.workStartTime && user.workEndTime && (
                <div>
                  <i className="fas fa-clock me-2"></i>
                  {t('workingHours')}:{' '}
                  {user.workStartTime} – {user.workEndTime}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT – Status & Admin Info */}
          <div className="col-md-4 text-md-end mt-3 mt-md-0">

            {/* Employment Status */}
            <span
              className={`badge bg-${employmentStatus.color} fs-6 mb-2`}
            >
              <i
                className={`fas ${employmentStatus.icon} me-2`}
              ></i>
              {t(currentStatus)}
            </span>

            {/* Role */}
            <div>
              <span className="badge bg-light text-dark">
                <i className="fas fa-user-tag me-2"></i>
                {t(user.role)}
              </span>
            </div>

            {/* Salary – Admin only */}
            {isAdmin && user.salary && (
              <div className="mt-2">
                <span className="badge bg-success">
                  <i className="fas fa-coins me-2"></i>
                  {user.salary} {t('currency')}
                </span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default UserHeader;
