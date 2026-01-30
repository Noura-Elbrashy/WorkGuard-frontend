
// import { useTranslation } from 'react-i18next';

// function UserMonthSelector({ year, month, onChange, onApply }) {
//   const { t } = useTranslation();

//   const months = [
//     { value: 1, label: t('january') },
//     { value: 2, label: t('february') },
//     { value: 3, label: t('march') },
//     { value: 4, label: t('april') },
//     { value: 5, label: t('may') },
//     { value: 6, label: t('june') },
//     { value: 7, label: t('july') },
//     { value: 8, label: t('august') },
//     { value: 9, label: t('september') },
//     { value: 10, label: t('october') },
//     { value: 11, label: t('november') },
//     { value: 12, label: t('december') }
//   ];

//   const years = [];
//   const currentYear = new Date().getFullYear();
//   for (let y = currentYear - 3; y <= currentYear + 1; y++) {
//     years.push(y);
//   }

//   return (
//     <div className="card border-0 shadow-sm mb-4 filter-card">
//       <div className="card-body">
//         <div className="d-flex flex-wrap align-items-end gap-3">

//           {/* Month */}
//           <div className="filter-item">
//             <label className="form-label small text-muted mb-1">
//               {t('month')}
//             </label>
//             <select
//               className="form-select form-select-sm"
//               value={month}
//               onChange={(e) =>
//                 onChange({
//                   year,
//                   month: Number(e.target.value)
//                 })
//               }
//             >
//               {months.map(m => (
//                 <option key={m.value} value={m.value}>
//                   {m.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Year */}
//           <div className="filter-item">
//             <label className="form-label small text-muted mb-1">
//               {t('year')}
//             </label>
//             <select
//               className="form-select form-select-sm"
//               value={year}
//               onChange={(e) =>
//                 onChange({
//                   year: Number(e.target.value),
//                   month
//                 })
//               }
//             >
//               {years.map(y => (
//                 <option key={y} value={y}>
//                   {y}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Apply */}
//           <div className="ms-auto">
//             <button
//               className="btn btn-sm btn-primary px-4"
//               onClick={onApply}
//             >
//               <i className="fas fa-chart-line me-2" />
//               {t('view')}
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default UserMonthSelector;
import { useTranslation } from 'react-i18next';

function UserMonthSelector({ year, month, onChange, onApply }) {
  const { t } = useTranslation();

  const months = [
    'january','february','march','april','may','june',
    'july','august','september','october','november','december'
  ];

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body d-flex flex-wrap align-items-center gap-3">

        {/* Title */}
        <div className="me-auto">
          <h6 className="mb-0 fw-bold">
            <i className="fas fa-calendar-alt me-2 text-primary"></i>
            {t('monthlyOverview')}
          </h6>
          <small className="text-muted">
            {t('selectMonthToViewStats')}
          </small>
        </div>

        {/* Month */}
        <select
          className="form-select form-select-sm w-auto"
          value={month}
          onChange={(e) =>
            onChange({ year, month: Number(e.target.value) })
          }
        >
          {months.map((m, i) => (
            <option key={m} value={i + 1}>
              {t(m)}
            </option>
          ))}
        </select>

        {/* Year */}
        <select
          className="form-select form-select-sm w-auto"
          value={year}
          onChange={(e) =>
            onChange({ year: Number(e.target.value), month })
          }
        >
          {[2023, 2024, 2025, 2026].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        {/* Button */}
        <button
          className="btn btn-primary btn-sm px-4"
          onClick={onApply}
        >
          <i className="fas fa-chart-line me-2"></i>
          {t('view')}
        </button>
      </div>
    </div>
  );
}

export default UserMonthSelector;
