
// import React from 'react';
// import { useTranslation } from 'react-i18next';

// const HolidayCard = ({
//   holiday,
//   onEdit,
//   onDelete,
//   onActivate,
//   onCancel
// }) => {
//   const { t } = useTranslation();

//   /* =========================
//      Helpers
//   ========================= */
//   const formatDate = (date) =>
//     new Date(date).toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });

//   const start = new Date(holiday.startDate);
//   const end = new Date(holiday.endDate);

//   /* =========================
//      Status helpers
//   ========================= */
//   const isDraft = holiday.status === 'draft';
//   const isActive = holiday.status === 'active';
//   const isCancelled = holiday.status === 'cancelled';
//   const isArchived = holiday.status === 'archived';

//   /* =========================
//      Badges
//   ========================= */
//   const renderStatusBadge = () => {
//     if (isDraft) return <span className="hm-badge hm-badge-draft">{t('holidays.draft')}</span>;
//     if (isActive) return <span className="hm-badge hm-badge-active">{t('holidays.active')}</span>;
//     if (isCancelled) return <span className="hm-badge hm-badge-cancelled">{t('holidays.cancelled')}</span>;
//     if (isArchived) return <span className="hm-badge hm-badge-archived">{t('holidays.archived')}</span>;
//     return null;
//   };

//   const renderScopeBadge = () => {
//     if (holiday.scope === 'global') {
//       return <span className="hm-badge hm-badge-global">{t('holidays.global')}</span>;
//     }

//     if (holiday.scope === 'branch') {
//       return (
//         <span className="hm-badge hm-badge-branch">
//           {holiday.branch?.name}
//         </span>
//       );
//     }

//     if (holiday.scope === 'user') {
//       return (
//         <span className="hm-badge hm-badge-user">
//           {holiday.user?.name}
//           <small>{holiday.user?.email}</small>
//         </span>
//       );
//     }

//     return null;
//   };

//   /* =========================
//      Date text
//   ========================= */
//   const renderDateText = () => {
//     if (holiday.startDate === holiday.endDate) {
//       return (
//         <>
//           {formatDate(start)}
//           <span className="hm-days-count">
//             (1 {t('holidays.day')})
//           </span>
//         </>
//       );
//     }

//     return (
//       <>
//         {t('holidays.from')} {formatDate(start)} {t('holidays.to')} {formatDate(end)}
//         <span className="hm-days-count">
//           ({holiday.totalDays} {t('holidays.days')})
//         </span>
//       </>
//     );
//   };

//   /* =========================
//      Cancel info
//   ========================= */
//   const renderCancelInfo = () => {
//     if (!isCancelled) return null;

//     return (
//       <div className="hm-cancel-info">
//         {t('holidays.cancelledFrom')} {formatDate(holiday.cancelFrom)}
//       </div>
//     );
//   };

//   /* =========================
//      Actions
//   ========================= */
//   const renderActions = () => {
//     if (isArchived || isCancelled) return null;

//     return (
//       <div className="hm-actions">
//         {isDraft && (
//           <>
//             <button
//               onClick={() => onEdit(holiday)}
//               className="hm-icon-btn hm-icon-btn-edit"
//               title={t('holidays.edit')}
//             >
//               <i className="fas fa-edit" />
//             </button>

//             <button
//               onClick={() => onDelete(holiday._id)}
//               className="hm-icon-btn hm-icon-btn-delete"
//               title={t('holidays.delete')}
//             >
//               <i className="fas fa-trash" />
//             </button>

//             <button
//               onClick={() => onActivate(holiday._id)}
//               className="hm-icon-btn hm-icon-btn-activate"
//               title={t('holidays.activate')}
//             >
//               <i className="fas fa-play" />
//             </button>
//           </>
//         )}

//         {isActive && (
//           <button
//             onClick={() => onCancel(holiday)}
//             className="hm-icon-btn hm-icon-btn-cancel"
//             title={t('holidays.cancel')}
//           >
//             <i className="fas fa-ban" />
//           </button>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className={`hm-card hm-card-${holiday.status}`}>
//       {/* Date block */}
//       <div className="hm-date">
//         <div className="hm-day">{start.getDate()}</div>
//         <div className="hm-month">
//           {start.toLocaleString('en', { month: 'short' })}
//         </div>
//         <div className="hm-year">{start.getFullYear()}</div>
//       </div>

//       {/* Info */}
//       <div className="hm-info">
//         <h3>{holiday.name}</h3>

//         <div className="hm-date-text">
//           {renderDateText()}
//         </div>

//         {renderCancelInfo()}

//         <div className="hm-meta">
//           {renderScopeBadge()}
//           {renderStatusBadge()}
//         </div>
//       </div>

//       {renderActions()}
//     </div>
//   );
// };

// export default HolidayCard;

//==========================date helpers



import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDisplayDate } from '../../helpers/dateHelpers';

const HolidayCard = ({
  holiday,
  onEdit,
  onDelete,
  onActivate,
  onCancel
}) => {
  const { t } = useTranslation();

  const start = new Date(holiday.startDate);
  const end = new Date(holiday.endDate);

  /* =========================
     Status helpers
  ========================= */
  const isDraft = holiday.status === 'draft';
  const isActive = holiday.status === 'active';
  const isCancelled = holiday.status === 'cancelled';
  const isArchived = holiday.status === 'archived';

  /* =========================
     Badges
  ========================= */
  const renderStatusBadge = () => {
    if (isDraft) return <span className="hm-badge hm-badge-draft">{t('holidays.draft')}</span>;
    if (isActive) return <span className="hm-badge hm-badge-active">{t('holidays.active')}</span>;
    if (isCancelled) return <span className="hm-badge hm-badge-cancelled">{t('holidays.cancelled')}</span>;
    if (isArchived) return <span className="hm-badge hm-badge-archived">{t('holidays.archived')}</span>;
    return null;
  };

  const renderScopeBadge = () => {
    if (holiday.scope === 'global') {
      return <span className="hm-badge hm-badge-global">{t('holidays.global')}</span>;
    }

    if (holiday.scope === 'branch') {
      return (
        <span className="hm-badge hm-badge-branch">
          {holiday.branch?.name}
        </span>
      );
    }

    if (holiday.scope === 'user') {
      return (
        <span className="hm-badge hm-badge-user">
          {holiday.user?.name}
          <small>{holiday.user?.email}</small>
        </span>
      );
    }

    return null;
  };

  /* =========================
     Date text
  ========================= */
  const renderDateText = () => {
    if (holiday.startDate === holiday.endDate) {
      return (
        <>
          {formatDisplayDate(holiday.startDate, 'en-GB')}
          <span className="hm-days-count">
            (1 {t('holidays.day')})
          </span>
        </>
      );
    }

    return (
      <>
        {t('holidays.from')}{' '}
        {formatDisplayDate(holiday.startDate, 'en-GB')}{' '}
        {t('holidays.to')}{' '}
        {formatDisplayDate(holiday.endDate, 'en-GB')}
        <span className="hm-days-count">
          ({holiday.totalDays} {t('holidays.days')})
        </span>
      </>
    );
  };

  /* =========================
     Cancel info
  ========================= */
  const renderCancelInfo = () => {
    if (!isCancelled) return null;

    return (
      <div className="hm-cancel-info">
        {t('holidays.cancelledFrom')}{' '}
        {formatDisplayDate(holiday.cancelFrom, 'en-GB')}
      </div>
    );
  };

  /* =========================
     Actions
  ========================= */
  const renderActions = () => {
    if (isArchived || isCancelled) return null;

    return (
      <div className="hm-actions">
        {isDraft && (
          <>
            <button
              onClick={() => onEdit(holiday)}
              className="hm-icon-btn hm-icon-btn-edit"
              title={t('holidays.edit')}
            >
              <i className="fas fa-edit" />
            </button>

            <button
              onClick={() => onDelete(holiday._id)}
              className="hm-icon-btn hm-icon-btn-delete"
              title={t('holidays.delete')}
            >
              <i className="fas fa-trash" />
            </button>

            <button
              onClick={() => onActivate(holiday._id)}
              className="hm-icon-btn hm-icon-btn-activate"
              title={t('holidays.activate')}
            >
              <i className="fas fa-play" />
            </button>
          </>
        )}

        {isActive && (
          <button
            onClick={() => onCancel(holiday)}
            className="hm-icon-btn hm-icon-btn-cancel"
            title={t('holidays.cancel')}
          >
            <i className="fas fa-ban" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={`hm-card hm-card-${holiday.status}`}>
      {/* Date block (pure UI) */}
      <div className="hm-date">
        <div className="hm-day">{start.getDate()}</div>
        <div className="hm-month">
          {start.toLocaleString('en', { month: 'short' })}
        </div>
        <div className="hm-year">{start.getFullYear()}</div>
      </div>

      {/* Info */}
      <div className="hm-info">
        <h3>{holiday.name}</h3>

        <div className="hm-date-text">
          {renderDateText()}
        </div>

        {renderCancelInfo()}

        <div className="hm-meta">
          {renderScopeBadge()}
          {renderStatusBadge()}
        </div>
      </div>

      {renderActions()}
    </div>
  );
};

export default HolidayCard;
