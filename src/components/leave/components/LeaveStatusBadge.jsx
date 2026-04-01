// import { useTranslation } from 'react-i18next';

// function LeaveStatusBadge({ status }) {
//   const { t } = useTranslation();

//   const STATUS_MAP = {
//     pending: {
//       label: t('leave.status.pending'),
//       className: 'bg-warning text-dark',
//       icon: 'fa-hourglass-half'
//     },
//     approved: {
//       label: t('leave.status.approved'),
//       className: 'bg-success',
//       icon: 'fa-check'
//     },
//     rejected: {
//       label: t('leave.status.rejected'),
//       className: 'bg-danger',
//       icon: 'fa-xmark'
//     },
//     cancelled: {
//       label: t('leave.status.cancelled'),
//       className: 'bg-secondary',
//       icon: 'fa-ban'
//     }
//   };

//   const cfg = STATUS_MAP[status];

//   if (!cfg) {
//     return (
//       <span className="badge bg-dark">
//         {t('leave.status.unknown')}
//       </span>
//     );
//   }

//   return (
//     <span className={`badge ${cfg.className} d-inline-flex align-items-center gap-1`}>
//       <i className={`fa-solid ${cfg.icon}`} />
//       {cfg.label}
//     </span>
//   );
// }

// export default LeaveStatusBadge;

import { useTranslation } from 'react-i18next';

function LeaveStatusBadge({ leave, isAdmin }) {
const { t } = useTranslation('leave');
const { t: tCommon } = useTranslation('translation');


  if (!leave) return null;

  const { status, metadata } = leave;
  const cancelledBy = metadata?.cancelledBy;

  let label = '';
  let className = '';
  let icon = '';

  switch (status) {
    case 'pending':
      label = t('leave.status.pending');
      className = 'bg-warning text-dark';
      icon = 'fa-hourglass-half';
      break;

    case 'approved':
      label = t('leave.status.approved');
      className = 'bg-success';
      icon = 'fa-check';
      break;

    case 'rejected':
      label = t('leave.status.rejected');
      className = 'bg-danger';
      icon = 'fa-xmark';
      break;

    case 'cancelled': {
      icon = 'fa-ban';

      // 🔴 Cancelled by ADMIN
      if (cancelledBy?.role === 'admin') {
        className = 'bg-danger';

        // 👀 Admin viewing → show admin name
        if (isAdmin && cancelledBy?.name) {
          label = `${t('leave.status.cancelledBy')} ${cancelledBy.name}`;
        }
        // 👤 Employee viewing → generic
        else {
          label = t('leave.status.cancelledByAdmin');
        }
      }

      // ⚪ Cancelled by EMPLOYEE
      else if (cancelledBy?.role === 'employee') {
        className = 'bg-secondary';

        label = cancelledBy?.name
          ? `${t('leave.status.cancelledBy')} ${cancelledBy.name}`
          : t('leave.status.cancelled');
      }

      // fallback
      else {
        className = 'bg-secondary';
        label = t('leave.status.cancelled');
      }

      break;
    }

    default:
      label = t('leave.status.unknown');
      className = 'bg-dark';
      icon = 'fa-question';
  }

  return (
    <span className={`badge ${className} d-inline-flex align-items-center gap-1`}>
      <i className={`fa-solid ${icon}`} />
      {label}
    </span>
  );
}

export default LeaveStatusBadge;
