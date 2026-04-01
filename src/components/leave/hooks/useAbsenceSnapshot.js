// import { useEffect, useState } from 'react';
// import {
//   getMonthlyAbsence,
//   getYearlyAbsence
// } from '../../../services/attendance.api';

// export default function useAbsenceSnapshot({
//   userId,
//   year,
//   month,
//   enabled = true
// }) {
//   const [monthly, setMonthly] = useState(null);
//   const [yearly, setYearly] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!enabled || !userId || !year) return;

//     let mounted = true;

//     const load = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const [mRes, yRes] = await Promise.all([
//           month
//             ? getMonthlyAbsence({ userId, year, month })
//             : Promise.resolve(null),
//           getYearlyAbsence({ userId, year })
//         ]);

//         if (!mounted) return;

//         setMonthly(mRes?.data || null);
//         setYearly(yRes?.data || null);

//       } catch (err) {
//         if (!mounted) return;
//         setError(
//           err?.response?.data?.message ||
//           'Failed to load absence'
//         );
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     load();
//     return () => { mounted = false; };

//   }, [userId, year, month, enabled]);

//   return { monthly, yearly, loading, error };
// }








//---------------------------------------------------------------------




/**
 * =========================================================
 * useAbsenceSnapshot
 * =========================================================
 *
 * 🔹 Purpose:
 * This hook is responsible for fetching and managing
 * absence-related data for a user.
 *
 * It retrieves:
 * - Monthly absence data (detailed days)
 * - Yearly absence summary
 *
 * ---------------------------------------------------------
 * 🔹 Why this hook exists:
 * To isolate absence-related API calls and state management
 * in one reusable hook.
 *
 * This avoids repeating:
 * - API logic
 * - loading/error handling
 * - state updates
 *
 * ---------------------------------------------------------
 * 🔹 When to use:
 * Use this hook when you need:
 * - Absence details for a specific month
 * - Absence summary for a full year
 *
 * Example:
 * const { monthly, yearly } = useAbsenceSnapshot({
 *   userId,
 *   year,
 *   month
 * });
 *
 * =========================================================
 */

import { useEffect, useState } from 'react';
import {
  getMonthlyAbsence,
  getYearlyAbsence
} from '../../../services/attendance.api';

export default function useAbsenceSnapshot({
  userId,
  year,
  month,
  enabled = true
}) {

  /**
   * =========================================================
   * State Management
   * =========================================================
   */
  const [monthly, setMonthly] = useState(null); // Stores monthly absence details
  const [yearly, setYearly] = useState(null);   // Stores yearly absence summary
  const [loading, setLoading] = useState(false); // Indicates loading state
  const [error, setError] = useState(null);     // Stores error message


  /**
   * =========================================================
   * Data Fetching Effect
   * =========================================================
   * Triggered when:
   * - userId changes
   * - year changes
   * - month changes
   * - enabled flag changes
   */
  useEffect(() => {

    /**
     * Guard Clause:
     * Prevent execution if:
     * - disabled
     * - missing required parameters
     */
    if (!enabled || !userId || !year) return;

    /**
     * mounted flag:
     * Prevents updating state after unmount
     */
    let mounted = true;

    /**
     * Async loader function
     */
    const load = async () => {
      setLoading(true);
      setError(null);

      try {

        /**
         * Fetch data in parallel:
         * - Monthly absence (only if month is provided)
         * - Yearly absence (always fetched)
         */
        const [mRes, yRes] = await Promise.all([
          month
            ? getMonthlyAbsence({ userId, year, month })
            : Promise.resolve(null),
          getYearlyAbsence({ userId, year })
        ]);

        /**
         * Stop if component is unmounted
         */
        if (!mounted) return;

        /**
         * Update state with API results
         */
        setMonthly(mRes?.data || null);
        setYearly(yRes?.data || null);

      } catch (err) {

        /**
         * Stop if component is unmounted
         */
        if (!mounted) return;

        /**
         * Handle error safely
         */
        setError(
          err?.response?.data?.message ||
          'Failed to load absence'
        );

      } finally {

        /**
         * Ensure loading stops only if still mounted
         */
        if (mounted) setLoading(false);
      }
    };

    /**
     * Execute data loading
     */
    load();

    /**
     * Cleanup:
     * Prevent future state updates after unmount
     */
    return () => {
      mounted = false;
    };

  }, [userId, year, month, enabled]);


  /**
   * =========================================================
   * Return Contract
   * =========================================================
   */
  return {
    monthly, // Monthly absence data (days + summary)
    yearly,  // Yearly absence summary
    loading, // Loading state
    error    // Error message
  };
}