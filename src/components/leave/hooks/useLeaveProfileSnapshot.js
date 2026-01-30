// import { useEffect, useState } from 'react';
// import useLeaves from '../useLeaves';

// import {
//   getUserLeaveSummary,
//   getUserLeaveYear
// } from '../services/leave.api';

// export default function useLeaveProfileSnapshot({
//   userId,
//   year,
//   status,
//   isAdmin
// }) {
//   /* ======================
//      Leaves (table)
//   ====================== */
//   const leavesHook = useLeaves({
//     mode: isAdmin ? 'admin' : 'employee',
//     userId,
//     status,
//     limit: 20
//   });

//   /* ======================
//      Meta (summary / year)
//   ====================== */
//   const [summary, setSummary] = useState(null);
//   const [leaveYear, setLeaveYear] = useState(null);
//   const [metaLoading, setMetaLoading] = useState(false);
//   const [metaError, setMetaError] = useState(null);

//   /* ======================
//      Load meta
//   ====================== */
//   useEffect(() => {
//     if (!userId || !year) {
//       setSummary(null);
//       setLeaveYear(null);
//       return;
//     }

//     let isMounted = true;

//     const loadMeta = async () => {
//       setMetaLoading(true);
//       setMetaError(null);

//       try {
//         const [summaryRes, yearRes] = await Promise.all([
//           getUserLeaveSummary({ userId, year }),
//           getUserLeaveYear({ userId, year })
//         ]);

//         if (!isMounted) return;

//         setSummary(summaryRes.data || null);
//         setLeaveYear(yearRes.data?.exists ? yearRes.data : null);

//       } catch (err) {
//         if (!isMounted) return;

//         setMetaError(
//           err?.response?.data?.message ||
//           'Failed to load leave summary'
//         );

//         setSummary(null);
//         setLeaveYear(null);
//       } finally {
//         if (isMounted) {
//           setMetaLoading(false);
//         }
//       }
//     };

//     loadMeta();

//     return () => {
//       isMounted = false;
//     };
//   }, [userId, year]);

//   /* ======================
//      Public API
//   ====================== */
//   return {
//     // global loading
//     loading: metaLoading || leavesHook.loading,

//     // errors
//     error: metaError || leavesHook.error,

//     // meta
//     summary,
//     leaveYear,

//     // leaves table
//     leaves: leavesHook.leaves,
//     page: leavesHook.page,
//     pages: leavesHook.pages,
//     total: leavesHook.total,
//     setPage: leavesHook.setPage,

//     // refresh all
//     refresh: () => {
//       leavesHook.refresh();
//     }
//   };
// }


import useLeaves from './useLeaves';
import useLeaveMeta from './useLeaveMeta';
import useAbsenceSnapshot from './useAbsenceSnapshot';

export default function useLeaveProfileSnapshot({
  userId,
  year,
  month,
  status,
  isAdmin,
  activeTab
}) {
  const leaves = useLeaves({
    mode: isAdmin ? 'admin' : 'employee',
    userId,
    status
  });

  const meta = useLeaveMeta({ userId, year });

  const absence = useAbsenceSnapshot({
    userId,
    year,
    month,
    enabled: activeTab === 'absence'
  });

  return {
    loading: meta.loading || leaves.loading || absence.loading,
    error: meta.error || leaves.error || absence.error,

    // meta
    summary: meta.summary,
    leaveYear: meta.leaveYear,

    // leaves
    leaves: leaves.leaves,
    page: leaves.page,
    pages: leaves.pages,
    setPage: leaves.setPage,

    // absence
    absenceMonth: absence.monthly,
    absenceYear: absence.yearly,

    refresh: () => {
      leaves.refresh();
    }
  };
}
