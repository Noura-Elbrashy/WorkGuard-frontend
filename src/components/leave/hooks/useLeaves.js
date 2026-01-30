// الهـوك مسؤول عن:
// fetch leaves
// loading / error
// pagination (page / pages / total)
// filters (status / userId)
// refresh بعد أي action
// ❌ مش مسؤول عن:
// approve / reject UI
// forms
// cards

import { useCallback, useEffect, useState } from 'react';
import {
  getMyLeaves,
  getAllLeaves
} from '../../../services/Leave-services/leave.api';

/**
 * ================================
 * useLeaves Hook
 * ================================
 * @param {Object} options
 * @param {'employee'|'admin'} options.mode
 * @param {number} options.initialPage
 * @param {number} options.limit
 * @param {string} options.status
 * @param {string} options.userId (admin only)
 */
export default function useLeaves({
  mode = 'employee',
  initialPage = 1,
  limit = 10,
  status,
  userId
} = {}) {
  /* ======================
     State
  ====================== */
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(initialPage);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  /* ======================
     Fetch function
  ====================== */
  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const apiCall =
        mode === 'admin'
          ? getAllLeaves
          : getMyLeaves;

      const res = await apiCall({
        page,
        limit,
        status,
        userId
      });

      setLeaves(res.data.leaves || []);
      setPages(res.data.pagination?.pages || 1);
      setTotal(res.data.pagination?.total || 0);
    } catch (err) {
      console.error('useLeaves error:', err);
      setError(
        err?.response?.data?.message ||
        'Failed to load leaves'
      );
      setLeaves([]);
      setPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [mode, page, limit, status, userId]);

  /* ======================
     Effects
  ====================== */
  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  // reset page on filters change
 useEffect(() => {
  setLeaves([]);
  setTotal(0);
  setPages(1);
  setPage(1);
}, [status, userId, mode]);


  /* ======================
     Public API
  ====================== */
  return {
    // data
    leaves,

    // states
    loading,
    error,

    // pagination
    page,
    pages,
    total,

    // actions
    setPage,
    refresh: fetchLeaves
  };
}
