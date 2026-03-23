// // src/components/companyReport/CompanyReportFilters.jsx
// /* ==============================================
//    شريط الفلاتر — نوع التقرير / سنة / شهر / فرع / قسم
// ============================================== */
// const CompanyReportFilters = ({
//   filters, years, months, loading,
//   onChange, onReset, onSubmit,
//   t, isRtl, i18nLang
// }) => {
//   const monthName = (m) =>
//     new Date(2000, m - 1, 1).toLocaleString(
//       isRtl ? 'ar-EG' : 'en-US',
//       { month: 'long' }
//     );

//   return (
//     <div className="card border-0 shadow-sm mb-4">
//       <div className="card-body">
//         <form onSubmit={onSubmit} className="row g-3 align-items-end">

//           {/* Report type toggle */}
//           <div className="col-12 col-sm-6 col-md-auto">
//             <label className="form-label fw-semibold small">{t('reportType')}</label>
//             <div className="btn-group d-flex" role="group">
//               <input type="radio" className="btn-check" id="type-month"
//                 checked={filters.reportType === 'month'}
//                 onChange={() => onChange('reportType', 'month')} />
//               <label className="btn btn-outline-primary btn-sm" htmlFor="type-month">
//                 <i className="fas fa-calendar-day me-1" />
//                 {t('monthly')}
//               </label>

//               <input type="radio" className="btn-check" id="type-year"
//                 checked={filters.reportType === 'year'}
//                 onChange={() => onChange('reportType', 'year')} />
//               <label className="btn btn-outline-primary btn-sm" htmlFor="type-year">
//                 <i className="fas fa-calendar-alt me-1" />
//                 {t('annual')}
//               </label>
//             </div>
//           </div>

//           {/* Year */}
//           <div className="col-6 col-sm-3 col-md-auto">
//             <label className="form-label fw-semibold small">{t('year')}</label>
//             <select className="form-select form-select-sm"
//               value={filters.year}
//               onChange={e => onChange('year', Number(e.target.value))}>
//               {years.map(y => <option key={y} value={y}>{y}</option>)}
//             </select>
//           </div>

//           {/* Month (hidden for year report) */}
//           {filters.reportType === 'month' && (
//             <div className="col-6 col-sm-3 col-md-auto">
//               <label className="form-label fw-semibold small">{t('month')}</label>
//               <select className="form-select form-select-sm"
//                 value={filters.month}
//                 onChange={e => onChange('month', Number(e.target.value))}>
//                 {months.map(m => (
//                   <option key={m} value={m}>{monthName(m)}</option>
//                 ))}
//               </select>
//             </div>
//           )}

//           {/* Branch */}
//           <div className="col-12 col-sm-6 col-md flex-grow-1">
//             <label className="form-label fw-semibold small">{t('branchId')}</label>
//             <input
//               type="text"
//               className="form-control form-control-sm"
//               placeholder={t('allBranches')}
//               value={filters.branchId}
//               onChange={e => onChange('branchId', e.target.value)}
//             />
//           </div>

//           {/* Department */}
//           <div className="col-12 col-sm-6 col-md flex-grow-1">
//             <label className="form-label fw-semibold small">{t('departmentId')}</label>
//             <input
//               type="text"
//               className="form-control form-control-sm"
//               placeholder={t('allDepartments')}
//               value={filters.departmentId}
//               onChange={e => onChange('departmentId', e.target.value)}
//             />
//           </div>

//           {/* Top limit */}
//           <div className="col-6 col-sm-3 col-md-auto">
//             <label className="form-label fw-semibold small">{t('topLimit')}</label>
//             <select className="form-select form-select-sm"
//               value={filters.topLimit}
//               onChange={e => onChange('topLimit', Number(e.target.value))}>
//               {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
//             </select>
//           </div>

//           {/* Actions */}
//           <div className="col-auto d-flex gap-2">
//             <button type="submit" className="btn btn-primary btn-sm px-3" disabled={loading}>
//               {loading
//                 ? <span className="spinner-border spinner-border-sm me-1" />
//                 : <i className="fas fa-search me-1" />}
//               {t('generate')}
//             </button>
//             <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onReset}>
//               <i className="fas fa-undo me-1" />
//               {t('reset')}
//             </button>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// };

// export default CompanyReportFilters;





import { useEffect, useState } from 'react';
import { getBranchLookup } from '../../services/branch.api';
import { getDepartments }  from '../../services/department.api';

/* ==============================================
   شريط الفلاتر — نوع التقرير / سنة / شهر / فرع / قسم
============================================== */
const CompanyReportFilters = ({
  filters, years, months, loading,
  onChange, onReset, onSubmit,
  t, isRtl, isGlobal = true
}) => {
  const [branches,    setBranches]    = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    getBranchLookup().then(r => {
      const d = r?.data?.data ?? [];
      setBranches(Array.isArray(d) ? d : []);
    }).catch(() => {});
    getDepartments({ limit: 200 }).then(r => {
      const d = r?.data?.departments ?? [];
      setDepartments(Array.isArray(d) ? d : []);
    }).catch(() => {});
  }, []);

  const monthName = (m) =>
    new Date(2000, m - 1, 1).toLocaleString(
      isRtl ? 'ar-EG' : 'en-US',
      { month: 'long' }
    );

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <form onSubmit={onSubmit} className="row g-3 align-items-end">

          {/* Report type toggle */}
          <div className="col-12 col-sm-6 col-md-auto">
            <label className="form-label fw-semibold small">{t('reportType')}</label>
            <div className="btn-group d-flex" role="group">
              <input type="radio" className="btn-check" id="type-month"
                checked={filters.reportType === 'month'}
                onChange={() => onChange('reportType', 'month')} />
              <label className="btn btn-outline-primary btn-sm" htmlFor="type-month">
                <i className="fas fa-calendar-day me-1" />
                {t('monthly')}
              </label>
              <input type="radio" className="btn-check" id="type-year"
                checked={filters.reportType === 'year'}
                onChange={() => onChange('reportType', 'year')} />
              <label className="btn btn-outline-primary btn-sm" htmlFor="type-year">
                <i className="fas fa-calendar-alt me-1" />
                {t('annual')}
              </label>
            </div>
          </div>

          {/* Year */}
          <div className="col-6 col-sm-3 col-md-auto">
            <label className="form-label fw-semibold small">{t('year')}</label>
            <select className="form-select form-select-sm"
              value={filters.year}
              onChange={e => onChange('year', Number(e.target.value))}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* Month (hidden for year report) */}
          {filters.reportType === 'month' && (
            <div className="col-6 col-sm-3 col-md-auto">
              <label className="form-label fw-semibold small">{t('month')}</label>
              <select className="form-select form-select-sm"
                value={filters.month}
                onChange={e => onChange('month', Number(e.target.value))}>
                {months.map(m => (
                  <option key={m} value={m}>{monthName(m)}</option>
                ))}
              </select>
            </div>
          )}

          {/* Branch Dropdown — Global Admin فقط */}
          {isGlobal && (
            <div className="col-12 col-sm-6 col-md flex-grow-1">
              <label className="form-label fw-semibold small">{t('branchId')}</label>
              <select className="form-select form-select-sm"
                value={filters.branchId || ''}
                onChange={e => onChange('branchId', e.target.value)}>
                <option value="">{t('allBranches')}</option>
                {branches.map(b => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Department Dropdown */}
          <div className="col-12 col-sm-6 col-md flex-grow-1">
            <label className="form-label fw-semibold small">{t('departmentId')}</label>
            <select className="form-select form-select-sm"
              value={filters.departmentId || ''}
              onChange={e => onChange('departmentId', e.target.value)}>
              <option value="">{t('allDepartments')}</option>
              {departments.map(d => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Top limit */}
          <div className="col-6 col-sm-3 col-md-auto">
            <label className="form-label fw-semibold small">{t('topLimit')}</label>
            <select className="form-select form-select-sm"
              value={filters.topLimit}
              onChange={e => onChange('topLimit', Number(e.target.value))}>
              {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {/* Actions */}
          <div className="col-auto d-flex gap-2">
            <button type="submit" className="btn btn-primary btn-sm px-3" disabled={loading}>
              {loading
                ? <span className="spinner-border spinner-border-sm me-1" />
                : <i className="fas fa-search me-1" />}
              {t('generate')}
            </button>
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onReset}>
              <i className="fas fa-undo me-1" />
              {t('reset')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CompanyReportFilters;