/**
 * ============================================================
 * src/services/companyReport.api.js
 * ============================================================
 *
 * Typed API service for company reports — works with React + Vite.
 *
 * Features:
 *  • axios instance with auto auth-header injection
 *  • JSON fetch → returns structured data
 *  • Excel / PDF download → triggers browser save-as dialog
 *  • Request cancellation via AbortController
 *  • Consistent error normalisation
 *
 * Usage:
 *  import { companyReportService } from '@/services/companyReportService';
 *
 *  // JSON (dashboard)
 *  const { data } = await companyReportService.getMonthReport({ year:2025, month:3 });
 *
 *  // Download Excel
 *  await companyReportService.downloadMonthReport({ year:2025, month:3, format:'excel' });
 *
 *  // Download PDF
 *  await companyReportService.downloadYearReport({ year:2025, format:'pdf' });
 *
 *  // With filters
 *  await companyReportService.getMonthReport({
 *    year:2025, month:3,
 *    branchId:'64abc...',
 *    departmentId:'64def...',
 *    topLimit:10
 *  });
 */

import axios from 'axios';

/* ============================================================
   ⚙️  AXIOS INSTANCE
============================================================ */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 120_000,   // 2 min — year reports can be slow
});

// Inject auth token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error normalisation
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.message ||
      'An unexpected error occurred';

    return Promise.reject(new Error(message));
  }
);

/* ============================================================
   🛠️  INTERNAL HELPERS
============================================================ */

/**
 * Build clean query params — removes null / undefined / 'all' values.
 */
function buildParams(opts = {}) {
  const params = {};

  const {
    year,
    month,
    branchId,
    departmentId,
    format      = 'json',
    topLimit    = 10,
    includeDays = false,
    mode        = 'readonly',
  } = opts;

  if (year)         params.year         = year;
  if (month)        params.month        = month;
  if (branchId     && branchId     !== 'all') params.branchId     = branchId;
  if (departmentId && departmentId !== 'all') params.departmentId = departmentId;

  params.format      = format;
  params.topLimit    = Math.min(Number(topLimit) || 10, 50);
  params.includeDays = Boolean(includeDays);
  params.mode        = mode;

  return params;
}

/**
 * Trigger browser file-download from a binary Blob response.
 */
function downloadBlob(blob, filename) {
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Extract filename from Content-Disposition header.
 * Falls back to `fallback` if header is missing / unparseable.
 */
function extractFilename(headers, fallback) {
  const cd = headers['content-disposition'] || '';
  const match = cd.match(/filename[^;=\n]*=["']?([^"';\n]+)["']?/i);
  return match?.[1]?.trim() || fallback;
}

/**
 * Generate a fallback filename for downloads.
 */
function makeFilename(type, opts, ext) {
  const pad = (n) => String(n).padStart(2, '0');
  let name = `company_report_${opts.year}`;
  if (opts.month)  name += `-${pad(opts.month)}`;
  if (opts.branchId && opts.branchId !== 'all') name += `_branch`;
  if (opts.departmentId && opts.departmentId !== 'all') name += `_dept`;
  return `${name}.${ext}`;
}

/* ============================================================
   🌐  CORE REQUEST FUNCTIONS
============================================================ */

/**
 * Fetch report as JSON — used for dashboards / state management.
 *
 * @param {string}  endpoint  — '/month' | '/year'
 * @param {object}  opts      — filter params
 * @param {AbortSignal} [signal] — for request cancellation
 * @returns {Promise<{ data: object, meta: object }>}
 */
async function fetchJson(endpoint, opts, signal) {
  const params = buildParams({ ...opts, format: 'json' });

  const res = await api.get(`/api/reports/company${endpoint}`, {
    params,
    signal
  });

  return {
    data: res.data.data,
    meta: res.data.data?.meta || null,
  };
}

/**
 * Download report as file — triggers browser save-as dialog.
 *
 * @param {string}  endpoint  — '/month' | '/year'
 * @param {object}  opts      — filter params (must include format: 'excel'|'pdf')
 * @param {AbortSignal} [signal]
 * @returns {Promise<void>}
 */
async function fetchFile(endpoint, opts, signal) {
  const format = opts.format === 'pdf' ? 'pdf' : 'excel';
  const ext    = format === 'pdf' ? 'pdf' : 'xlsx';
  const params = buildParams({ ...opts, format });

  const res = await api.get(`/api/reports/company${endpoint}`, {
    params,
    responseType: 'blob',
    signal,
    // Increase timeout for large year reports
    timeout: opts.year && !opts.month ? 300_000 : 120_000,
  });

  const filename = extractFilename(
    res.headers,
    makeFilename(endpoint, opts, ext)
  );

  downloadBlob(res.data, filename);
}

/* ============================================================
   📤  PUBLIC API
============================================================ */

export const companyReportService = {

  /* ─────────────────────────────────────────────────────────
     📅  MONTHLY REPORT
  ───────────────────────────────────────────────────────── */

  /**
   * Fetch monthly report as JSON (for dashboard rendering).
   *
   * @param {{
   *   year:         number,
   *   month:        number,
   *   branchId?:    string,
   *   departmentId?:string,
   *   topLimit?:    number,
   *   mode?:        'readonly'|'smart'|'force'
   * }} opts
   * @param {AbortSignal} [signal]
   */
  getMonthReport(opts, signal) {
    if (!opts.year || !opts.month) {
      return Promise.reject(new Error('year and month are required'));
    }
    return fetchJson('/month', opts, signal);
  },

  /**
   * Download monthly report as Excel or PDF.
   *
   * @param {{
   *   year:         number,
   *   month:        number,
   *   format:       'excel'|'pdf',
   *   branchId?:    string,
   *   departmentId?:string,
   *   topLimit?:    number,
   *   includeDays?: boolean,
   *   mode?:        'readonly'|'smart'|'force'
   * }} opts
   * @param {AbortSignal} [signal]
   */
  downloadMonthReport(opts, signal) {
    if (!opts.year || !opts.month) {
      return Promise.reject(new Error('year and month are required'));
    }
    if (!['excel', 'pdf'].includes(opts.format)) {
      return Promise.reject(new Error("format must be 'excel' or 'pdf'"));
    }
    return fetchFile('/month', opts, signal);
  },

  /* ─────────────────────────────────────────────────────────
     📆  ANNUAL REPORT
  ───────────────────────────────────────────────────────── */

  /**
   * Fetch annual report as JSON.
   *
   * @param {{
   *   year:         number,
   *   branchId?:    string,
   *   departmentId?:string,
   *   topLimit?:    number,
   *   mode?:        'readonly'|'smart'|'force'
   * }} opts
   * @param {AbortSignal} [signal]
   */
  getYearReport(opts, signal) {
    if (!opts.year) {
      return Promise.reject(new Error('year is required'));
    }
    return fetchJson('/year', opts, signal);
  },

  /**
   * Download annual report as Excel or PDF.
   *
   * @param {{
   *   year:         number,
   *   format:       'excel'|'pdf',
   *   branchId?:    string,
   *   departmentId?:string,
   *   topLimit?:    number,
   *   includeDays?: boolean,
   *   mode?:        'readonly'|'smart'|'force'
   * }} opts
   * @param {AbortSignal} [signal]
   */
  downloadYearReport(opts, signal) {
    if (!opts.year) {
      return Promise.reject(new Error('year is required'));
    }
    if (!['excel', 'pdf'].includes(opts.format)) {
      return Promise.reject(new Error("format must be 'excel' or 'pdf'"));
    }
    return fetchFile('/year', opts, signal);
  },
};