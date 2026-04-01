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
















// import useLeaves from './useLeaves';
// import useLeaveMeta from './useLeaveMeta';
// import useAbsenceSnapshot from './useAbsenceSnapshot';

// export default function useLeaveProfileSnapshot({
//   userId,
//   year,
//   month,
//   status,
//   isAdmin,
//   activeTab
// }) {
//   const leaves = useLeaves({
//     mode: isAdmin ? 'admin' : 'employee',
//     userId,
//     status
//   });

//   const meta = useLeaveMeta({ userId, year });

//   const absence = useAbsenceSnapshot({
//     userId,
//     year,
//     month,
//     enabled: activeTab === 'absence'
//   });

  
//   return {
//     loading: meta.loading || leaves.loading || absence.loading,
//     error: meta.error || leaves.error || absence.error,

//     // meta
//     summary: meta.summary,
//     leaveYear: meta.leaveYear,

//     // leaves
//     leaves: leaves.leaves,
//     page: leaves.page,
//     pages: leaves.pages,
//     setPage: leaves.setPage,

//     // absence
//     absenceMonth: absence.monthly,
//     absenceYear: absence.yearly,

//     refresh: () => {
//       leaves.refresh();
//     }
//   };
// }











// //بيجمع كل الداتا
// import useLeaves from './useLeaves';
//  import useLeaveMeta from './useLeaveMeta';
//  import useAbsenceSnapshot from './useAbsenceSnapshot';


// export default function useLeaveProfileSnapshot({
//   userId,
//   year,
//   month,
//   status,
//   isAdmin,
//   activeTab
// }) {

//   const isSummary = activeTab === 'summary';
//   const isRequests = activeTab === 'requests';
//   const isAbsence = activeTab === 'absence';

//   const leaves = useLeaves({
//     mode: isAdmin ? 'admin' : 'employee',
//     userId,
//     status
//   });

//   const meta = useLeaveMeta({ userId, year });

//   const absence = useAbsenceSnapshot({
//     userId,
//     year,
//     month,
//     enabled: true
//   });

//   // 👇 ده لازم يكون جوه الفنكشن
//   // const cleanAbsenceDays =
//   //   absence.monthly?.days?.filter(
//   //     d =>
//   //       d.dayStatus === 'absent' ||
//   //       d.absenceType === 'without_permission' ||
//   //       d.absenceType === 'unpaid_leave'
//   //   ) || [];

//   // 👇 وده كمان جوه الفنكشن
// return {
//   loading:
//     (isSummary && meta.loading) ||
//     (isRequests && leaves.loading) ||
//     (isAbsence && absence.loading),

//   error:
//     (isSummary && meta.error) ||
//     (isRequests && leaves.error) ||
//     (isAbsence && absence.error),

//   summary: meta.summary,
//   leaveYear: meta.leaveYear,

//   leaves: leaves.leaves,
//   page: leaves.page,
//   pages: leaves.pages,
//   setPage: leaves.setPage,

//   // 👇 بدون أي فلترة
//   absenceMonth: absence.monthly,

//   absenceYear: absence.yearly,

//   refresh: () => {
//     leaves.refresh();
//   }
// };
// }








//-------------------------------------------------------------------------------------------








/**
 * =========================================================
 * useLeaveProfileSnapshot
 * =========================================================
 *
 * 🔹 Purpose:
 * This hook acts as a central data aggregator for the
 * Employee Leave Profile page.
 *
 * It combines multiple data sources into one unified object:
 * - Leave Summary (annual / sick balances)
 * - Leave Requests (paginated)
 * - Absence Data (monthly / yearly)
 *
 * ---------------------------------------------------------
 * 🔹 Why this hook exists:
 * Instead of calling multiple hooks inside the UI component,
 * this hook centralizes all data logic in one place.
 *
 * This helps with:
 * - Cleaner components
 * - Easier maintenance
 * - Better separation of concerns
 *
 * ---------------------------------------------------------
 * 🔹 When to use:
 * Use this hook when you need ALL leave-related data together
 * (e.g., in a profile page with tabs).
 *
 * If each section is independent, you may skip this hook
 * and use individual hooks directly.
 * 
 * 
 * //used in EmployeeLeaveProfile.jsx //
 * =========================================================
 */

import useLeaves from './useLeaves'; // Handles leave requests (list + pagination)
import useLeaveMeta from './useLeaveMeta'; // Handles leave summary & leave year
import useAbsenceSnapshot from './useAbsenceSnapshot'; // Handles absence data

export default function useLeaveProfileSnapshot({
  userId,
  year,
  month,
  status,
  isAdmin,
  activeTab
}) {

  /**
   * =========================================================
   * Tab State Helpers
   * =========================================================
   * These flags determine which tab is currently active.
   * Used to control:
   * - Loading state
   * - Error state
   */
  const isSummary = activeTab === 'summary';
  const isRequests = activeTab === 'requests';
  const isAbsence = activeTab === 'absence';


  /**
   * =========================================================
   * Leave Requests Hook
   * =========================================================
   * Fetches:
   * - Leave requests list
   * - Pagination (page, pages)
   *
   * mode:
   * - 'admin' → full access
   * - 'employee' → limited access
   */
  const leaves = useLeaves({
    mode: isAdmin ? 'admin' : 'employee',
    userId,
     year,
    status
  });


  /**
   * =========================================================
   * Leave Meta Hook
   * =========================================================
   * Fetches:
   * - Leave summary (annual / sick balances)
   * - Leave year info
   */
  const meta = useLeaveMeta({ userId, year });


  /**
   * =========================================================
   * Absence Snapshot Hook
   * =========================================================
   * Fetches:
   * - Monthly absence
   * - Yearly absence
   *
   * enabled: true → preload data immediately
   * (can be optimized later for lazy loading)
   */
  const absence = useAbsenceSnapshot({
    userId,
    year,
    month,
    enabled: true
  });


  /**
   * =========================================================
   * Returned Data Contract
   * =========================================================
   * This is the unified structure consumed by the UI.
   */
  return {

    /**
     * -------------------------------------------------------
     * Loading State (based on active tab)
     * -------------------------------------------------------
     * Only the active tab controls loading to avoid
     * unnecessary spinners from other data sources.
     */
    loading:
      (isSummary && meta.loading) ||
      (isRequests && leaves.loading) ||
      (isAbsence && absence.loading),

    /**
     * -------------------------------------------------------
     * Error State (based on active tab)
     * -------------------------------------------------------
     */
    error:
      (isSummary && meta.error) ||
      (isRequests && leaves.error) ||
      (isAbsence && absence.error),


    /**
     * -------------------------------------------------------
     * Summary Data
     * -------------------------------------------------------
     */
    summary: meta.summary,
    leaveYear: meta.leaveYear,


    /**
     * -------------------------------------------------------
     * Leave Requests Data
     * -------------------------------------------------------
     */
    leaves: leaves.leaves,
    page: leaves.page,
    pages: leaves.pages,
    setPage: leaves.setPage,


    /**
     * -------------------------------------------------------
     * Absence Data
     * -------------------------------------------------------
     * Assumes backend already returns clean absence-only data.
     */
    absenceMonth: absence.monthly,
    absenceYear: absence.yearly,

adjustmentHistory: meta.adjustmentHistory || [],
  historyPage:       meta.historyPage,   
  historyPages:      meta.historyPages,  
  historyTotal:      meta.historyTotal,  
  setHistoryPage:    meta.setHistoryPage,
    /**
     * -------------------------------------------------------
     * Refresh Function
     * -------------------------------------------------------
     * Currently refreshes only leave requests.
     * Can be extended to refresh other data sources if needed.
     */
    refresh: () => {
      leaves.refresh();
       meta.refresh();
    }
  };
}