/**
 * ============================================================
 * src/hooks/useCompanyReport.js
 * ============================================================
 *
 * React hook that wraps companyReportService with:
 *  • loading / error / data state
 *  • automatic request cancellation on unmount / param change
 *  • separate download loading state
 *  • zero prop-drilling
 *
 * Usage:
 *  const {
 *    data, loading, error,
 *    downloading, downloadError,
 *    refetch,
 *    downloadExcel, downloadPdf
 *  } = useCompanyReport({ type:'month', year:2025, month:3 });
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { companyReportService } from '../services/companyReport.api';

/**
 * @param {{
 *   type:          'month' | 'year',
 *   year:          number,
 *   month?:        number,          required if type='month'
 *   branchId?:     string | null,
 *   departmentId?: string | null,
 *   topLimit?:     number,
 *   mode?:         'readonly'|'smart'|'force',
 *   autoFetch?:    boolean          default true
 * }} params
 */
export function useCompanyReport({
  type,
  year,
  month,
  branchId     = null,
  departmentId = null,
  topLimit     = 10,
  mode         = 'readonly',
  autoFetch    = true,
}) {
  const [data,          setData]          = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState(null);
  const [downloading,   setDownloading]   = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  // Keep stable reference to current abort controller
  const abortRef = useRef(null);

  /* ── Shared opts object ─────────────────────────────────── */
  const opts = {
    year,
    month,
    branchId:     branchId     || undefined,
    departmentId: departmentId || undefined,
    topLimit,
    mode,
  };

  /* ── Fetch JSON ─────────────────────────────────────────── */
  const fetch = useCallback(async () => {
    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const serviceFn = type === 'year'
        ? companyReportService.getYearReport
        : companyReportService.getMonthReport;

      const result = await serviceFn(opts, controller.signal);
      setData(result.data);
    } catch (err) {
      if (err.name === 'CanceledError' || err.message === 'canceled') return;
      setError(err.message || 'Failed to load report');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, year, month, branchId, departmentId, topLimit, mode]);

  /* ── Auto-fetch on param change ─────────────────────────── */
  useEffect(() => {
    if (!autoFetch) return;
    if (!year) return;
    if (type === 'month' && !month) return;

    fetch();

    return () => { abortRef.current?.abort(); };
  }, [fetch, autoFetch, year, month, type]);

  /* ── Download helper ─────────────────────────────────────── */
  const download = useCallback(async (format, extraOpts = {}) => {
    setDownloading(true);
    setDownloadError(null);

    try {
      const serviceFn = type === 'year'
        ? companyReportService.downloadYearReport
        : companyReportService.downloadMonthReport;

      await serviceFn({ ...opts, format, ...extraOpts });
    } catch (err) {
      setDownloadError(err.message || 'Download failed');
    } finally {
      setDownloading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, year, month, branchId, departmentId, topLimit, mode]);

  return {
    data,
    loading,
    error,
    refetch: fetch,

    downloading,
    downloadError,

    /** Download Excel (.xlsx) */
    downloadExcel: (extraOpts) => download('excel', extraOpts),

    /** Download PDF (.pdf) */
    downloadPdf:   (extraOpts) => download('pdf',   extraOpts),
  };
}