// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { apiGet } from '../../helpers/api';

// import EmployeeAttendanceFilters from './EmployeeAttendanceFilters';
// import EmployeeAttendanceSummaryTable from './EmployeeAttendanceSummaryTable';
// import EmployeeAttendanceDetailsModal from './EmployeeAttendanceDetailsModal';

// const EmployeeAttendancePage = () => {
//   const { t } = useTranslation();

//   // ===== Filters (ثابتة) =====
//   const [filters, setFilters] = useState({
//     branchId: '',
//     name: '',
//     status: '',
//     from: '',
//     to: ''
//   });

//   // ===== Data =====
//   const [rows, setRows] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(1);
//   const [total, setTotal] = useState(0);

//   // ===== UI =====
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [selectedDay, setSelectedDay] = useState(null);

//   // ===== Fetch =====
//   const fetchAttendance = async () => {
//     try {
//       setLoading(true);
//       setError('');

//       const params = new URLSearchParams();
//       params.append('page', page);
//       params.append('limit', 10);

//       if (filters.branchId) params.append('branchId', filters.branchId);
//       if (filters.name) params.append('name', filters.name);
//       if (filters.status) params.append('status', filters.status);
//       if (filters.from) params.append('from', filters.from);
//       if (filters.to) params.append('to', filters.to);

//       const res = await apiGet(`/admin/attendance?${params.toString()}`);

//       setRows(res.data.data || []);
//       setPages(res.data.pages || 1);
//       setTotal(res.data.total || 0);
//     } catch (err) {
//       console.error(err);
//       setError(t('error'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAttendance();
//     // eslint-disable-next-line
//   }, [page, filters]);

//   return (
//     <div className="container-fluid">
//       <h3 className="mb-4">
//         <i className="fas fa-clipboard-check me-2" />
//         {t('employeeAttendance')}
//       </h3>

//       <EmployeeAttendanceFilters
//         filters={filters}
//         onApply={(newFilters) => {
//           setPage(1);
//           setFilters(newFilters);
//         }}
//       />

//       <EmployeeAttendanceSummaryTable
//         rows={rows}
//         loading={loading}
//         onOpenDetails={setSelectedDay}
//       />

//       {/* Pagination (backend) */}
//       <nav className="mt-3">
//         <ul className="pagination justify-content-center">
//           <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
//             <button
//               className="page-link"
//               onClick={() => setPage(p => Math.max(1, p - 1))}
//             >
//               {t('previous')}
//             </button>
//           </li>

//           <li className="page-item disabled">
//             <span className="page-link">
//               {page} / {pages}
//             </span>
//           </li>

//           <li className={`page-item ${page >= pages ? 'disabled' : ''}`}>
//             <button
//               className="page-link"
//               onClick={() => setPage(p => Math.min(pages, p + 1))}
//             >
//               {t('next')}
//             </button>
//           </li>
//         </ul>

//         <small className="text-muted d-block text-center">
//           {t('total')}: {total}
//         </small>
//       </nav>

//       {selectedDay && (
//         <EmployeeAttendanceDetailsModal
//           dayRow={selectedDay}
//           show
//           onClose={() => setSelectedDay(null)}
//           onRefresh={fetchAttendance}
//         />
//       )}

//       {error && (
//         <div className="alert alert-danger mt-3">{error}</div>
//       )}
//     </div>
//   );
// };

// export default EmployeeAttendancePage;

// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { apiGet } from '../../helpers/api';

// // components
// import EmployeeAttendanceFilters from './EmployeeAttendanceFilters';
// import EmployeeAttendanceSummaryTable from './EmployeeAttendanceSummaryTable';
// import EmployeeAttendanceDetailsModal from './EmployeeAttendanceDetailsModal';

// // helper (نفس منطق الادمن داش)
// import { groupAttendanceByUserAndDate } from '../../helpers/attendance/groupAttendanceByUserAndDate';

// const EmployeeAttendancePage = () => {
//   const { t } = useTranslation();

//   // ===== Filters =====
//   const [filters, setFilters] = useState({});

//   // ===== Data =====
//   const [rows, setRows] = useState([]);

//   // ===== Pagination (BACKEND) =====
//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(1);
//   const [total, setTotal] = useState(0);

//   // ===== UI =====
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [selectedDay, setSelectedDay] = useState(null);

//   // ===== Fetch Attendance =====
//   // const fetchAttendance = async () => {
//   //   try {
//   //     setLoading(true);
//   //     setError('');

//   //     const params = new URLSearchParams({
//   //       page,
//   //       limit: 10,
//   //       ...filters
//   //     });

//   //     const res = await apiGet(`/admin/attendance?${params.toString()}`);

//   //     /**
//   //      * 👇 أهم سطر
//   //      * نفس اللي بيحصل في Admin Dashboard
//   //      */
//   //     const grouped = groupAttendanceByUserAndDate(res.data.data || []);

//   //     setRows(grouped);
//   //     setPages(res.data.pages || 1);
//   //     setTotal(res.data.total || 0);
//   //   } catch (err) {
//   //     console.error(err);
//   //     setError(t('error'));
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
// const fetchAttendance = async () => {
//   try {
//     setLoading(true);
//     setError('');

//     const params = new URLSearchParams();
//     params.append('page', page);
//     params.append('limit', 10);

//     if (filters.branchId) params.append('branchId', filters.branchId);
//     if (filters.name) params.append('name', filters.name);
//     if (filters.status) params.append('status', filters.status);

//     // 👈 نفس منطق AdminDashboard
//     if (filters.date) {
//       params.append('from', filters.date);
//       params.append('to', filters.date);
//     }

//     if (filters.invalidated) params.append('invalidated', 'true');
//     if (filters.remoteOnly) params.append('remoteOnly', 'true');
//     if (filters.outOfLocation) params.append('outOfLocation', 'true');

//     const res = await apiGet(`/admin/attendance?${params.toString()}`);

//     const grouped = groupAttendanceByUserAndDate(res.data.data || []);

//     setRows(grouped);
//     setPages(res.data.pages || 1);
//     setTotal(res.data.total || 0);
//   } catch (err) {
//     console.error(err);
//     setError(t('error'));
//   } finally {
//     setLoading(false);
//   }
// };

//   useEffect(() => {
//     fetchAttendance();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filters, page]);

//   return (
//     <div className="container-fluid">
//       {/* ===== Header ===== */}
//       <h3 className="mb-4">
//         <i className="fas fa-clipboard-check me-2" />
//         {t('employeeAttendance')}
//       </h3>

//       {/* ===== Filters ===== */}
//       <EmployeeAttendanceFilters
//         onChange={(newFilters) => {
//           setPage(1);
//           setFilters(newFilters);
//         }}
//       />

//       {/* ===== Table ===== */}
//       <EmployeeAttendanceSummaryTable
//         rows={rows}
//         loading={loading}
//         onOpenDetails={setSelectedDay}
//       />

//       {/* ===== Pagination ===== */}
//       <nav className="mt-3">
//         <ul className="pagination justify-content-center">
//           <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
//             <button
//               className="page-link"
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//             >
//               {t('previous')}
//             </button>
//           </li>

//           <li className="page-item disabled">
//             <span className="page-link">
//               {page} / {pages}
//             </span>
//           </li>

//           <li className={`page-item ${page >= pages ? 'disabled' : ''}`}>
//             <button
//               className="page-link"
//               onClick={() => setPage((p) => Math.min(pages, p + 1))}
//             >
//               {t('next')}
//             </button>
//           </li>
//         </ul>

//         <small className="text-muted d-block text-center">
//           {t('total')}: {total}
//         </small>
//       </nav>

//       {/* ===== Details Modal ===== */}
//       {selectedDay && (
//         <EmployeeAttendanceDetailsModal
//           dayRow={selectedDay}
//           show={true}
//           onClose={() => setSelectedDay(null)}
//           onRefresh={fetchAttendance}
//         />
//       )}

//       {/* ===== Error ===== */}
//       {error && (
//         <div className="alert alert-danger mt-3">{error}</div>
//       )}
//     </div>
//   );
// };

// export default EmployeeAttendancePage;




//row data
// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { apiGet } from '../../helpers/api';

// import EmployeeAttendanceFilters from './EmployeeAttendanceFilters';
// import EmployeeAttendanceSummaryTable from './EmployeeAttendanceSummaryTable';
// import EmployeeAttendanceDetailsModal from './EmployeeAttendanceDetailsModal';

// import { groupAttendanceByUserAndDate } from '../../helpers/attendance/groupAttendanceByUserAndDate';

// const EmployeeAttendancePage = () => {
//   const { t } = useTranslation();

//   // ===== Filters =====
//   const [branches, setBranches] = useState([]);
//   const [selectedBranch, setSelectedBranch] = useState('');
//   const [selectedDate, setSelectedDate] = useState('');
//   const [filterName, setFilterName] = useState('');
//   const [status, setStatus] = useState('');

//   const [invalidOnly, setInvalidOnly] = useState(false);
//   const [remoteOnly, setRemoteOnly] = useState(false);
//   const [outOfLocationOnly, setOutOfLocationOnly] = useState(false);

//   // ===== Data =====
//   const [rows, setRows] = useState([]);

//   // ===== Pagination =====
//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(1);
//   const [total, setTotal] = useState(0);

//   // ===== UI =====
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // ⭐ المهم
//   const [selectedAttendance, setSelectedAttendance] = useState(null);
//   // { row, record }

//   // ===== branches =====
//   useEffect(() => {
//     apiGet('/branches')
//       .then((res) => setBranches(res.data || []))
//       .catch(() => {});
//   }, []);

//   // ===== fetch attendance (نفس الأدمن) =====
//   const fetchAttendance = async () => {
//     try {
//       setLoading(true);
//       setError('');

//       const params = new URLSearchParams();
//       params.append('page', page);
//       params.append('limit', 10);

//       if (selectedBranch) params.append('branchId', selectedBranch);
//       if (filterName) params.append('name', filterName);
//       if (status) params.append('status', status);

//       if (selectedDate) {
//         params.append('from', selectedDate);
//         params.append('to', selectedDate);
//       }

//       if (invalidOnly) params.append('invalidated', 'true');
//       if (remoteOnly) params.append('remoteOnly', 'true');
//       if (outOfLocationOnly) params.append('outOfLocation', 'true');

//       const res = await apiGet(`/admin/attendance?${params.toString()}`);

//       const grouped = groupAttendanceByUserAndDate(res.data.data || []);

//       setRows(grouped);
//       setPages(res.data.pages || 1);
//       setTotal(res.data.total || 0);
//     } catch (err) {
//       console.error(err);
//       setError(t('error'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAttendance();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [
//     page,
//     selectedBranch,
//     selectedDate,
//     filterName,
//     status,
//     invalidOnly,
//     remoteOnly,
//     outOfLocationOnly
//   ]);

//   return (
//     <div className="container-fluid">
//       <h3 className="mb-4">
//         <i className="fas fa-clipboard-check me-2" />
//         {t('employeeAttendance')}
//       </h3>

//       <EmployeeAttendanceFilters
//         branches={branches}
//         selectedBranch={selectedBranch}
//         selectedDate={selectedDate}
//         name={filterName}
//         status={status}
//         invalidOnly={invalidOnly}
//         remoteOnly={remoteOnly}
//         outOfLocationOnly={outOfLocationOnly}
//         total={total}
//         onBranchChange={(v) => {
//           setPage(1);
//           setSelectedBranch(v);
//         }}
//         onDateChange={(v) => {
//           setPage(1);
//           setSelectedDate(v);
//         }}
//         onNameChange={(v) => {
//           setPage(1);
//           setFilterName(v);
//         }}
//         onStatusChange={(v) => {
//           setPage(1);
//           setStatus(v);
//         }}
//         onInvalidChange={(v) => {
//           setPage(1);
//           setInvalidOnly(v);
//         }}
//         onRemoteChange={(v) => {
//           setPage(1);
//           setRemoteOnly(v);
//         }}
//         onOutOfLocationChange={(v) => {
//           setPage(1);
//           setOutOfLocationOnly(v);
//         }}
//       />

//       <EmployeeAttendanceSummaryTable
//         rows={rows}
//         loading={loading}
//         onEdit={(row, record) =>
//           setSelectedAttendance({ row, record })
//         }
//       />

//       {/* pagination */}
//       <nav className="mt-3">
//         <ul className="pagination justify-content-center">
//           <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
//             <button
//               className="page-link"
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//             >
//               {t('previous')}
//             </button>
//           </li>

//           <li className="page-item disabled">
//             <span className="page-link">
//               {page} / {pages}
//             </span>
//           </li>

//           <li className={`page-item ${page >= pages ? 'disabled' : ''}`}>
//             <button
//               className="page-link"
//               onClick={() => setPage((p) => Math.min(pages, p + 1))}
//             >
//               {t('next')}
//             </button>
//           </li>
//         </ul>

//         <small className="text-muted d-block text-center">
//           {t('total')}: {total}
//         </small>
//       </nav>

//       {/* ✅ Details Modal */}
//       {selectedAttendance && (
//         <EmployeeAttendanceDetailsModal
//           show
//           row={selectedAttendance.row}
//           record={selectedAttendance.record}
//           onClose={() => setSelectedAttendance(null)}
//           onSaved={fetchAttendance}
//         />
//       )}

//       {error && <div className="alert alert-danger mt-3">{error}</div>}
//     </div>
//   );
// };

// export default EmployeeAttendancePage;








//1
// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { apiGet } from '../../helpers/api';

// import EmployeeAttendanceFilters from './EmployeeAttendanceFilters';
// import EmployeeAttendanceSummaryTable from './EmployeeAttendanceSummaryTable';
// import EmployeeAttendanceDetailsModal from './EmployeeAttendanceDetailsModal';

// const EmployeeAttendancePage = () => {
//   const { t } = useTranslation();

//   // ===== Filters =====
//   const [branches, setBranches] = useState([]);
//   const [filters, setFilters] = useState({
//     branchId: '',
//     date: '',
//     name: '',
//     status: ''
//   });

//   // ===== Data =====
//   const [rows, setRows] = useState([]);

//   // ===== Pagination =====
//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(1);
//   const [total, setTotal] = useState(0);

//   // ===== UI =====
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // ===== Details =====
//   const [selectedDay, setSelectedDay] = useState(null);
//   const [dayDetails, setDayDetails] = useState(null);
//   const [detailsLoading, setDetailsLoading] = useState(false);

//   // ===== branches =====
//   useEffect(() => {
//     apiGet('/branches')
//       .then(res => setBranches(res.data || []))
//       .catch(() => {});
//   }, []);

//   // ===== fetch SUMMARY (DailyAttendanceSummary) =====
//   const fetchSummary = async () => {
//     try {
//       setLoading(true);
//       setError('');

//       const params = new URLSearchParams({
//         page,
//         limit: 10
//       });

//       if (filters.branchId) params.append('branchId', filters.branchId);
//       if (filters.name) params.append('name', filters.name);
//       if (filters.status) params.append('status', filters.status);
//       if (filters.date) {
//         params.append('from', filters.date);
//         params.append('to', filters.date);
//       }

//       const res = await apiGet(`/admin/attendance-summary?${params.toString()}`);

//       setRows(res.data.data || []);
//       setPages(res.data.pages || 1);
//       setTotal(res.data.total || 0);
//     } catch (err) {
//       console.error(err);
//       setError(t('error'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSummary();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [page, filters]);

//   // ===== open details (RAW Attendance) =====
//   const openDetails = async (row) => {
//     try {
//       setDetailsLoading(true);
//       setSelectedDay(row);

//       const res = await apiGet(
//         `/admin/attendance/day-details?userId=${row.user._id}&date=${row.date.slice(0,10)}`
//       );

//       setDayDetails(res.data);
//     } catch (err) {
//       console.error(err);
//       alert(t('error'));
//     } finally {
//       setDetailsLoading(false);
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <h3 className="mb-4">
//         <i className="fas fa-clipboard-check me-2" />
//         {t('employeeAttendance')}
//       </h3>

//       <EmployeeAttendanceFilters
//         branches={branches}
//         filters={filters}
//         onChange={(newFilters) => {
//           setPage(1);
//           setFilters(newFilters);
//         }}
//         total={total}
//       />

//       <EmployeeAttendanceSummaryTable
//         rows={rows}
//         loading={loading}
//         onOpenDetails={openDetails}
//       />

//       {/* Pagination */}
//       <nav className="mt-3">
//         <ul className="pagination justify-content-center">
//           <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
//             <button
//               className="page-link"
//               onClick={() => setPage(p => Math.max(1, p - 1))}
//             >
//               {t('previous')}
//             </button>
//           </li>

//           <li className="page-item disabled">
//             <span className="page-link">
//               {page} / {pages}
//             </span>
//           </li>

//           <li className={`page-item ${page >= pages ? 'disabled' : ''}`}>
//             <button
//               className="page-link"
//               onClick={() => setPage(p => Math.min(pages, p + 1))}
//             >
//               {t('next')}
//             </button>
//           </li>
//         </ul>
//       </nav>

//       {/* Details Modal */}
//       {selectedDay && (
//         <EmployeeAttendanceDetailsModal
//           show
//           loading={detailsLoading}
//           summaryRow={selectedDay}
//           data={dayDetails}
//           onClose={() => {
//             setSelectedDay(null);
//             setDayDetails(null);
//           }}
//           onSaved={fetchSummary}
//         />
//       )}

//       {error && <div className="alert alert-danger mt-3">{error}</div>}
//     </div>
//   );
// };

// export default EmployeeAttendancePage;


import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { apiGet } from '../../helpers/api';
import { useNavigate } from 'react-router-dom';

import EmployeeAttendanceFilters from './EmployeeAttendanceFilters';
import EmployeeAttendanceSummaryTable from './EmployeeAttendanceSummaryTable';
import EmployeeAttendanceDetailsModal from './EmployeeAttendanceDetailsModal';

const PAGE_LIMIT = 10;

const EmployeeAttendancePage = () => {
  const { t } = useTranslation();
const navigate = useNavigate();
  // =========================
  // State
  // =========================
  const [branches, setBranches] = useState([]);

  const [filters, setFilters] = useState({
    branchId: '',
    date: '',
    name: '',
    status: '',
    invalidated: ''
  });

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Details
  const [selectedDay, setSelectedDay] = useState(null);
  const [detailsData, setDetailsData] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // =========================
  // Fetch branches
  // =========================
  useEffect(() => {
    apiGet('/branches')
      .then(res => setBranches(res.data || []))
      .catch(() => {});
  }, []);

  // =========================
  // Build query params
  // =========================
  const buildParams = () => {
    const params = new URLSearchParams({
      page,
      limit: PAGE_LIMIT
    });

    if (filters.branchId) params.append('branchId', filters.branchId);
    if (filters.name) params.append('name', filters.name);
    if (filters.status) params.append('status', filters.status);
    if (filters.invalidated) params.append('invalidated', filters.invalidated);

    if (filters.date) {
      params.append('from', filters.date);
      params.append('to', filters.date);
    }

    return params.toString();
  };

  // =========================
  // Fetch summary
  // =========================
  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const res = await apiGet(
        `/admin/attendance-summary?${buildParams()}`
      );

      setRows(Array.isArray(res.data?.data) ? res.data.data : []);
      setPages(res.data?.pages || 1);
      setTotal(res.data?.total || 0);
    } catch (err) {
      console.error(err);
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  }, [page, filters, t]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // =========================
  // Open details (RAW attendance)
  // =========================
 const openDetails = async (row) => {
  if (!row?.user?._id || !row?.date) return;

  setSelectedDay(row);
  setDetailsData(null);
  setDetailsLoading(true);

  try {
    const dateStr = new Date(row.date).toISOString().slice(0, 10);

    // ✅ نفس الـ API اللي شغالة في UserProfile
    const res = await apiGet(
      `/admin/attendance/day-details?userId=${row.user._id}&date=${dateStr}`
    );

    setDetailsData(res.data?.records || []);
    // ✅ حدّثي الـ transits من الـ API
    setSelectedDay(prev => ({
      ...prev,
      transits: res.data?.transits || []
    }));

  } catch (err) {
    console.error(err);
    setDetailsData([]);
  } finally {
    setDetailsLoading(false);
  }
};
//   const openDetails = (row) => {
//   if (!row?.user?._id || !row?.date) return;

//   setSelectedDay(row);
//   setDetailsData(row.records || []);
//   setDetailsLoading(false); // لأن الداتا جاهزة من الـ summary
// };


  // =========================
  // Render
  // =========================
  return (
    <div className="container-fluid">
      {/* Header */}
     <div className="d-flex justify-content-between align-items-center mb-4">
  <h3 className="mb-0">
    <i className="fas fa-clipboard-check me-2" />
    {t('employeeAttendance')}
  </h3>

  <div className="d-flex gap-2">
   <button
  className="btn btn-outline-secondary"
  onClick={() => navigate('/admin/attendance-policies')}
>
  <i className="fas fa-sliders-h me-1" />
  {t('attendancePolicy.manage')}
</button>


    <span className="text-muted small">
      {t('total')}: {total}
    </span>
  </div>
</div>


      {/* Filters */}
      <EmployeeAttendanceFilters
        branches={branches}
        filters={filters}
        total={total}
        onChange={(newFilters) => {
          setPage(1); // reset pagination
          setFilters(newFilters);
        }}
      />

      {/* Table */}
      <EmployeeAttendanceSummaryTable
        rows={rows}
        loading={loading}
        onOpenDetails={openDetails}
        onSaved={fetchSummary}
      />

      {/* Pagination */}
      {pages > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                {t('previous')}
              </button>
            </li>

            <li className="page-item disabled">
              <span className="page-link">
                {page} / {pages}
              </span>
            </li>

            <li className={`page-item ${page >= pages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setPage(p => Math.min(pages, p + 1))}
              >
                {t('next')}
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Details Modal */}
      {selectedDay && (
  
<EmployeeAttendanceDetailsModal
  show
  // loading={false}
  loading={detailsLoading}
  records={detailsData || []}   // RAW Attendance
  user={selectedDay.user}
  date={selectedDay.date}
  // transits={selectedDay.transits}
  transits={selectedDay.transits || []}
  isAdmin={true}
  onClose={() => {
    setSelectedDay(null);
    setDetailsData(null);
  }}
  onSaved={fetchSummary}
/>


      )}

      {/* Error */}
      {error && (
        <div className="alert alert-danger mt-3">
          {error}
        </div>
      )}
    </div>
  );
};

export default EmployeeAttendancePage;
