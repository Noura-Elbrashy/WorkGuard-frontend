

// /////////////////////////////////////////////////////////////////////
// // 1 good
// // export default UserProfile;
// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { apiGet } from '../helpers/api';

// import UserHeader from '../components/userProfile/ProfileHeader';
// import UserStats from '../components/userProfile/ProfileStats';
// import UserMonthSelector from '../components/userProfile/UserMonthSelector';
// import UserAttendanceSummaryTable from '../components/userProfile/UserAttendanceSummaryTable';

// import '../style/UserProfile.css';

// function UserProfile() {
//   const { t } = useTranslation();
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // =========================
//   // State
//   // =========================
//   const [user, setUser] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false);

//   const [year, setYear] = useState(new Date().getFullYear());
//   const [month, setMonth] = useState(new Date().getMonth() + 1);

//   const [monthlySummary, setMonthlySummary] = useState(null);

//   const [selectedDay, setSelectedDay] = useState(null);
//   const [showDetails, setShowDetails] = useState(false);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // =========================
//   // 1️⃣ Fetch User
//   // =========================
//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         setLoading(true);

//         const profileRes = await apiGet('/auth/profile');
//         const admin = profileRes.data.role === 'admin';
//         setIsAdmin(admin);

//         if (id === 'me') {
//           setUser(profileRes.data);
//         } else {
//           const res = await apiGet(`/users/${id}`);
//           setUser(res.data.user);
//         }
//       } catch (err) {
//         console.error(err);
//         setError(t('error'));
//         navigate('/');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadUser();
//   }, [id, navigate, t]);

//   // =========================
//   // 2️⃣ Fetch Monthly Summary
//   // =========================
//   useEffect(() => {
//     if (!user?._id) return;

//     const fetchMonthlySummary = async () => {
//       try {
//         // const endpoint = isAdmin
//         //   ? `/admin/user-monthly-report?userId=${user._id}&year=${year}&month=${month}`
//         //   : `/users/${user._id}/monthly-summary?year=${year}&month=${month}`;
//         const endpoint = `/admin/user-monthly-report?userId=${user._id}&year=${year}&month=${month}`;


//         const res = await apiGet(endpoint);
//         setMonthlySummary(res.data.report);
//       } catch (err) {
//         console.error(err);
//         setMonthlySummary(null);
//       }
//     };

//     fetchMonthlySummary();
//   }, [user, year, month, isAdmin]);

//   // =========================
//   // UI States
//   // =========================
//   if (loading) {
//     return <div className="text-center p-5">{t('loading')}...</div>;
//   }

//   if (error) {
//     return <div className="alert alert-danger">{error}</div>;
//   }

//   if (!user) return null;

//   // =========================
//   // Render
//   // =========================
//   return (
//     <>
//       {/* Header */}
//       <UserHeader user={user} isAdmin={isAdmin} />

//       {/* Month Selector */}
//       <UserMonthSelector
//         year={year}
//         month={month}
//         onChange={({ year, month }) => {
//           setYear(year);
//           setMonth(month);
//         }}
//       />

//       {/* Monthly Stats */}
//       <UserStats
//         monthlyReport={monthlySummary}
//         showPayroll={isAdmin}
//       />

//       {/* Attendance Table */}
//       <UserAttendanceSummaryTable
//         days={monthlySummary?.days}
//         loading={!monthlySummary}
//         isAdmin={isAdmin}
//         onOpenDetails={(day) => {
//           setSelectedDay(day);
//           setShowDetails(true);
//         }}
//       />

//       {/* TODO: Day Details Modal */}
//       {/* {showDetails && (
//         <UserAttendanceDayDetails
//           day={selectedDay}
//           onClose={() => setShowDetails(false)}
//         />
//       )} */}
//     </>
//   );
// }

// // export default UserProfile;
// import { useEffect, useMemo, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { apiGet } from '../helpers/api';

// import UserHeader from '../components/userProfile/ProfileHeader';
// import UserStats from '../components/userProfile/ProfileStats';
// import UserMonthSelector from '../components/userProfile/UserMonthSelector';
// import UserAttendanceSummaryTable from '../components/userProfile/UserAttendanceSummaryTable';
// import EmployeeAttendanceDetailsModal from '../components/userProfile/EmployeeAttendanceDetailsModal';
// import '../style/UserProfile.css';

// const PAGE_SIZE = 7;

// function UserProfile() {
//   const { t } = useTranslation();
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false);

//   const [year, setYear] = useState(new Date().getFullYear());
//   const [month, setMonth] = useState(new Date().getMonth() + 1);

//   const [monthlySummary, setMonthlySummary] = useState(null);
//   const [page, setPage] = useState(1);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   /* =========================
//      Load User
//   ========================= */
//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         setLoading(true);

//         const profileRes = await apiGet('/auth/profile');
//         setIsAdmin(profileRes.data.role === 'admin');

//         if (id === 'me') {
//           setUser(profileRes.data);
//         } else {
//           const res = await apiGet(`/users/${id}`);
//           setUser(res.data.user);
//         }
//       } catch {
//         setError(t('error'));
//         navigate('/');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadUser();
//   }, [id, navigate, t]);

//   /* =========================
//      Load Monthly Summary
//   ========================= */
//   useEffect(() => {
//     if (!user?._id) return;

//     const loadMonth = async () => {
//       try {
//         setLoading(true);
//         setPage(1);

//         const res = await apiGet(
//           `/admin/user-monthly-report?userId=${user._id}&year=${year}&month=${month}`
//         );

//         setMonthlySummary(res.data.report);
//       } catch {
//         setMonthlySummary(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadMonth();
//   }, [user, year, month]);

//   /* =========================
//      Pagination Logic
//   ========================= */
//   const pagedDays = useMemo(() => {
//     if (!monthlySummary?.days) return [];
//     const start = (page - 1) * PAGE_SIZE;
//     return monthlySummary.days.slice(start, start + PAGE_SIZE);
//   }, [monthlySummary, page]);

//   const totalPages = useMemo(() => {
//     if (!monthlySummary?.days) return 0;
//     return Math.ceil(monthlySummary.days.length / PAGE_SIZE);
//   }, [monthlySummary]);

//   /* =========================
//      UI
//   ========================= */
//   if (loading) return <div className="text-center p-5">{t('loading')}...</div>;
//   if (error) return <div className="alert alert-danger">{error}</div>;
//   if (!user) return null;

//   return (
//     <>
//       <UserHeader user={user} isAdmin={isAdmin} />

//       <UserMonthSelector
//         year={year}
//         month={month}
//         onChange={({ year, month }) => {
//           setYear(year);
//           setMonth(month);
//         }}
//       />

//       <UserStats monthlyReport={monthlySummary} showPayroll={isAdmin} />

//       <UserAttendanceSummaryTable
//         days={pagedDays}
//         loading={loading}
//         isAdmin={isAdmin}
//       />

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="d-flex justify-content-center gap-2 my-3">
//           <button
//             className="btn btn-outline-secondary"
//             disabled={page === 1}
//             onClick={() => setPage(p => p - 1)}
//           >
//             ◀
//           </button>

//           <span className="align-self-center fw-semibold">
//             {t('page')} {page} / {totalPages}
//           </span>

//           <button
//             className="btn btn-outline-secondary"
//             disabled={page === totalPages}
//             onClick={() => setPage(p => p + 1)}
//           >
//             ▶
//           </button>
//         </div>


//       )}

//        <EmployeeAttendanceDetailsModal
//         show={!!detailsDate}
//         loading={loadingDetails}
//         records={detailsRecords}
//         user={user}
//         date={detailsDate}
//         isAdmin={isAdmin}
//         onClose={() => setDetailsDate(null)}
//         onSaved={() => openDetails({ date: detailsDate })}
//       />
//     </>
//   );
// }

// export default UserProfile;

import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiGet } from '../helpers/api';

import UserHeader from '../components/userProfile/ProfileHeader';
import UserStats from '../components/userProfile/ProfileStats';
import UserMonthSelector from '../components/userProfile/UserMonthSelector';
import UserAttendanceSummaryTable from '../components/userProfile/UserAttendanceSummaryTable';
import EmployeeAttendanceDetailsModal from '../components/userProfile/EmployeeAttendanceDetailsModal';
import UserEmploymentStatus from '../components/userProfile/UserEmploymentStatus';
import UserBiometricsSettings from '../components/userProfile/UserBiometricsSettings';
import UserFeedbackSection from '../components/userProfile/UserFeedbackSection';
import UserEffectiveAttendancePolicy from '../components/userProfile/UserEffectiveAttendancePolicy';
import UserLeaveSummary from '../components/userProfile/UserLeaveSummary';

import UserDevices from '../components/adminDevice/UserDevices';
import '../style/UserProfile.css';
import EmployeePayrollHistory from '../components/userProfile/EmployeePayrollHistory';
import UserAssignedAttendancePolicies from '../components/userProfile/UserAssignedAttendancePolicies';
import AttendancePolicyNotes from '../components/attendancePolicy/AttendancePolicyNotes'
import EmployeeLeaveProfile from
  './leave/EmployeeLeaveProfile';
import AbsenceDetailsModal
  from '../components/attendance/absence/AbsenceDetailsModal';


const PAGE_SIZE = 7;


function UserProfile() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
const [showAbsenceDetails, setShowAbsenceDetails] = useState(false);

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const [monthlySummary, setMonthlySummary] = useState(null);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔍 Details modal state
  const [detailsDate, setDetailsDate] = useState(null);
  const [detailsRecords, setDetailsRecords] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
const [detailsTransits, setDetailsTransits] = useState([]);

const [showEffectivePolicy, setShowEffectivePolicy] = useState(false);
 
const reloadMonth = async () => {
  if (!user?._id) return;

  setLoading(true);
  try {
    const res = await apiGet(
      `/admin/user-monthly-report?userId=${user._id}&year=${year}&month=${month}`
    );
    setMonthlySummary(res.data.report);
  } finally {
    setLoading(false);
  }
};

  /* =========================
     Load User
  ========================= */
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);

        const profileRes = await apiGet('/auth/profile');
        setIsAdmin(profileRes.data.role === 'admin');

        if (id === 'me') {
          setUser(profileRes.data);
        } else {
          const res = await apiGet(`/users/${id}`);
          setUser(res.data.user);
        }
      } catch {
        setError(t('error'));
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id, navigate, t]);

  /* =========================
     Load Monthly Summary
  ========================= */
  useEffect(() => {
    if (!user?._id) return;

    const loadMonth = async () => {
      try {
        setLoading(true);
        setPage(1);

        const res = await apiGet(
          `/admin/user-monthly-report?userId=${user._id}&year=${year}&month=${month}`
        );

        setMonthlySummary(res.data.report);
      } catch {
        setMonthlySummary(null);
      } finally {
        setLoading(false);
      }
    };

    loadMonth();
  }, [user, year, month]);

  /* =========================
     Open Details
  ========================= */
  // const openDetails = async ({ date }) => {
  //   try {
  //     setDetailsDate(date);
  //     setLoadingDetails(true);

  //     const res = await apiGet(
  //       isAdmin
  //         ? `/admin/attendance?userId=${user._id}&date=${date}&mode=dayDetails`
  //         : `/attendance?date=${date}&mode=dayDetails`
  //     );

  //     setDetailsRecords(res.data.data || []);
  //   } catch {
  //     setDetailsRecords([]);
  //   } finally {
  //     setLoadingDetails(false);
  //   }
  // };
const openDetails = async ({ date }) => {
  try {
    setDetailsDate(date);
    setLoadingDetails(true);

    const res = await apiGet(
      `/attendance/day-details?userId=${user._id}&date=${date}`
    );

    // الفانكشن الجديدة بترجع object مش array
    setDetailsRecords(res.data.records || []);
       setDetailsTransits(res.data.transits || []);
  } catch {
    setDetailsRecords([]);
       setDetailsTransits([]);
  } finally {
    setLoadingDetails(false);
  }
};

  /* =========================
     Pagination
  ========================= */
  const pagedDays = useMemo(() => {
    if (!monthlySummary?.days) return [];
    const start = (page - 1) * PAGE_SIZE;
    return monthlySummary.days.slice(start, start + PAGE_SIZE);
  }, [monthlySummary, page]);

  const totalPages = useMemo(() => {
    if (!monthlySummary?.days) return 0;
    return Math.ceil(monthlySummary.days.length / PAGE_SIZE);
  }, [monthlySummary]);

  /* =========================
     UI
  ========================= */
  if (loading) return <div className="text-center p-5">{t('common.loading')}...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!user) return null;



  return (
    <>
      <UserHeader user={user} isAdmin={isAdmin} />
<UserLeaveSummary userId={user._id} />
{/* <EmployeeLeaveProfile userId={user._id} isAdmin={isAdmin} /> */}
<button
  className="btn btn-outline-warning"
  onClick={() =>
    navigate(`/admin/employees/${user._id}/leave-profile`)
  }
>
  <i className="fa-solid fa-calendar-xmark me-1" />
  Leave & Absence
</button>


{isAdmin &&<UserEmploymentStatus
  user={user}
  isAdmin={isAdmin}
  onUpdated={() => {
    // reload user profile
    window.location.reload();
  }}
/>}

{isAdmin && (
  <>
  {/* <AttendancePolicyNotes t={t} /> */}


  <button
  className="btn btn-outline-info btn-sm mb-3"
  onClick={() => setShowEffectivePolicy(v => !v)}
>
  <i className="fas fa-shield-alt me-1" />
  {t('attendancePolicy.viewEffectiveToday')}
</button>
{isAdmin && (
  <>
    <UserAssignedAttendancePolicies userId={user._id} />
    {/* <UserEffectiveAttendancePolicy userId={user._id} isAdmin /> */}
  </>
)}


    {showEffectivePolicy && (
      <UserEffectiveAttendancePolicy
        userId={user._id}
        isAdmin={isAdmin}
      />
    )}
  </>
)}
{/* {isAdmin && <UserBranchPolicies userId={user._id} />} */}

<button
  className="btn btn-outline-success"
  onClick={() =>
    navigate(`/employees/${user._id}/payroll/preview?year=${year}&month=${month}`)
  }
>
  <i className="fas fa-calculator me-1" />
  Payroll Preview
</button>
{isAdmin && <EmployeePayrollHistory userId={user._id} />}

{isAdmin && (

  <UserBiometricsSettings
    user={user}
    isAdmin={isAdmin}
    onUpdated={() => {
      
    }}
  />
)}


{/* <UserBiometricsSettings
  user={user}
  isAdmin={isAdmin}
  onUpdated={() => {
    // reload user
  }}
/> */}

<UserFeedbackSection
  userId={user._id}
  isAdmin={isAdmin}
/>


<UserDevices
  user={user}
  isAdmin={isAdmin}
  onUpdated={async () => {
    const res = await apiGet(`/users/${user._id}`);
    setUser(res.data.user);
  }}
/>


      <UserMonthSelector
        year={year}
        month={month}
        onChange={({ year, month }) => {
          setYear(year);
          setMonth(month);
        }}
      />

      <UserStats monthlyReport={monthlySummary} showPayroll={isAdmin} />

      <UserAttendanceSummaryTable
        days={pagedDays}
        loading={loading}
        isAdmin={isAdmin}
        onOpenDetails={openDetails}
      />

      {totalPages > 1 && (
        <div className="d-flex justify-content-center gap-2 my-3">
          <button
            className="btn btn-outline-secondary"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            ◀
          </button>

          <span className="align-self-center fw-semibold">
            {t('common.page')} {page} / {totalPages}
          </span>

          <button
            className="btn btn-outline-secondary"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            ▶
          </button>
        </div>
      )}

      <EmployeeAttendanceDetailsModal
        show={!!detailsDate}
        loading={loadingDetails}
        records={detailsRecords}
          transits={detailsTransits}
        user={user}
        date={detailsDate}
        isAdmin={isAdmin}
        onClose={() => setDetailsDate(null)}
        onSaved={async () => {
  await openDetails({ date: detailsDate }); 
  
  // تحديث المودال
  await reloadMonth();                     // تحديث الجداول
}}

      />
    </>
  );
}

export default UserProfile;
