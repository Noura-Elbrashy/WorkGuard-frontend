

// import React from 'react';
// import { useTranslation } from 'react-i18next';
// import HolidayCard from './HolidayCard';

// const HolidaysList = ({ 
//   holidays, 
//   loading, 
//   pagination, 
//   onEdit, 
//   onDelete, 
//   onPageChange 
// }) => {
//   const { t } = useTranslation();

//   if (loading) {
//     return (
//       <div className="hm-empty">
//         <div className="hm-spinner"></div>
//         <p>{t('holidays.loadingHolidays')}</p>
//       </div>
//     );
//   }

//   if (!holidays || holidays.length === 0) {
//     return (
//       <div className="hm-empty">
//         <div className="hm-empty-icon">
//           <i className="fas fa-calendar-times"></i>
//         </div>
//         <h3>{t('holidays.noHolidays')}</h3>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="hm-grid">
//         {holidays.map((holiday) => (
//           <HolidayCard
//             key={holiday._id}
//             holiday={holiday}
//             onEdit={onEdit}
//             onDelete={onDelete}
//           />
//         ))}
//       </div>

//       {/* Pagination - يأتي من الباك إند */}
//       {pagination && pagination.pages > 1 && (
//         <div className="hm-pagination">
//           <button
//             onClick={() => onPageChange(pagination.page - 1)}
//             disabled={pagination.page === 1}
//             className="hm-pagination-btn"
//           >
//             <i className="fas fa-chevron-left"></i>
//           </button>

//           <span className="hm-pagination-info">
//             {t('holidays.page')} {pagination.page} {t('holidays.of')} {pagination.pages}
//           </span>

//           <button
//             onClick={() => onPageChange(pagination.page + 1)}
//             disabled={pagination.page === pagination.pages}
//             className="hm-pagination-btn"
//           >
//             <i className="fas fa-chevron-right"></i>
//           </button>
//         </div>
//       )}
//     </>
//   );
// };

// export default HolidaysList;

import React from 'react';
import { useTranslation } from 'react-i18next';
import HolidayCard from './HolidayCard';

const HolidaysList = ({
  holidays = [],
  loading = false,
  pagination = null,
  onEdit,
  onDelete,
  onActivate,
  onCancel,
  onPageChange
}) => {
  const { t } = useTranslation();

  /* =========================
     Loading State
  ========================= */
  if (loading) {
    return (
      <div className="hm-empty">
        <div className="hm-spinner"></div>
        <p>{t('holidays.loadingHolidays')}</p>
      </div>
    );
  }

  /* =========================
     Empty State
  ========================= */
  if (!holidays.length) {
    return (
      <div className="hm-empty">
        <div className="hm-empty-icon">
          <i className="fas fa-calendar-times"></i>
        </div>
        <h3>{t('holidays.noHolidays')}</h3>
      </div>
    );
  }

  /* =========================
     List
  ========================= */
  return (
    <>
      <div className="hm-grid">
        {holidays.map((holiday) => (
          <HolidayCard
            key={holiday._id}
            holiday={holiday}
            onEdit={onEdit}
            onDelete={onDelete}
            onActivate={onActivate}
            onCancel={onCancel}
          />
        ))}
      </div>

      {/* =========================
          Pagination (from backend)
      ========================= */}
      {pagination?.pages > 1 && (
        <div className="hm-pagination">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="hm-pagination-btn"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <span className="hm-pagination-info">
            {t('holidays.page')} {pagination.page}{' '}
            {t('holidays.of')} {pagination.pages}
          </span>

          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="hm-pagination-btn"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </>
  );
};

export default HolidaysList;
