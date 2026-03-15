// // src/services/report.api.js
// import { apiGet } from '../helpers/api';
// import api from '../helpers/api';   // axios instance للـ blob download

// /* ─────────────────────────────────────────────────────────────
//    HELPERS
// ───────────────────────────────────────────────────────────── */

// /** بيحول object إلى query string وبيشيل الـ empty values */
// function toQuery(params = {}) {
//   const q = new URLSearchParams();
//   Object.entries(params).forEach(([k, v]) => {
//     if (v !== '' && v !== null && v !== undefined) q.append(k, v);
//   });
//   return q.toString();
// }

// /**
//  * يعمل download لـ PDF أو Excel من الباك
//  * (بيستخدم axios responseType: 'blob' عشان الباك بيبعت binary)
//  */
// export async function downloadReportFile(url, filename) {
//   const response = await api.get(url, { responseType: 'blob' });
//   const blob     = new Blob([response.data], { type: response.headers['content-type'] });
//   const link     = document.createElement('a');
//   link.href      = URL.createObjectURL(blob);
//   link.download  = filename;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
//   URL.revokeObjectURL(link.href);
// }

// /* ─────────────────────────────────────────────────────────────
//    COMPANY — MONTH REPORT
//    GET /api/reports/company/month
//    params: { year, month, branchId?, departmentId?, payrollApprovedOnly?, topLimit? }
// ───────────────────────────────────────────────────────────── */
// export const getCompanyMonthReport = (params = {}) => {
//   const q = toQuery({ format: 'json', ...params });
//   return apiGet(`/reports/company/month?${q}`);
// };

// export const downloadCompanyMonthPdf = (params = {}) => {
//   const q        = toQuery({ ...params, format: 'pdf' });
//   const { year, month } = params;
//   return downloadReportFile(
//     `/reports/company/month?${q}`,
//     `company_report_${year}_${String(month).padStart(2, '0')}.pdf`
//   );
// };

// export const downloadCompanyMonthExcel = (params = {}) => {
//   const q        = toQuery({ ...params, format: 'excel' });
//   const { year, month } = params;
//   return downloadReportFile(
//     `/reports/company/month?${q}`,
//     `company_report_${year}_${String(month).padStart(2, '0')}.xlsx`
//   );
// };

// /* ─────────────────────────────────────────────────────────────
//    COMPANY — YEAR REPORT
//    GET /api/reports/company/year
//    params: { year, branchId?, departmentId?, payrollApprovedOnly? }
// ───────────────────────────────────────────────────────────── */
// export const getCompanyYearReport = (params = {}) => {
//   const q = toQuery({ format: 'json', ...params });
//   return apiGet(`/reports/company/year?${q}`);
// };

// export const downloadCompanyYearPdf = (params = {}) => {
//   const q = toQuery({ ...params, format: 'pdf' });
//   return downloadReportFile(
//     `/reports/company/year?${q}`,
//     `company_report_year_${params.year}.pdf`
//   );
// };

// export const downloadCompanyYearExcel = (params = {}) => {
//   const q = toQuery({ ...params, format: 'excel' });
//   return downloadReportFile(
//     `/reports/company/year?${q}`,
//     `company_report_year_${params.year}.xlsx`
//   );
// };

// /* ─────────────────────────────────────────────────────────────
//    USER — MONTH REPORT
//    GET /api/reports/user/:userId/month
//    params: { year, month, requireApprovedPayroll?, includeLeaves?, includeOvertime? }
// ───────────────────────────────────────────────────────────── */
// export const getUserMonthReport = (userId, params = {}) => {
//   const q = toQuery({ format: 'json', ...params });
//   return apiGet(`/reports/user/${userId}/month?${q}`);
// };

// export const downloadUserMonthPdf = (userId, params = {}) => {
//   const q        = toQuery({ ...params, format: 'pdf' });
//   const { year, month } = params;
//   return downloadReportFile(
//     `/reports/user/${userId}/month?${q}`,
//     `employee_report_${year}_${String(month).padStart(2, '0')}.pdf`
//   );
// };

// export const downloadUserMonthExcel = (userId, params = {}) => {
//   const q        = toQuery({ ...params, format: 'excel' });
//   const { year, month } = params;
//   return downloadReportFile(
//     `/reports/user/${userId}/month?${q}`,
//     `employee_report_${year}_${String(month).padStart(2, '0')}.xlsx`
//   );
// };

// src/services/report.api.js
import apiInstance from '../helpers/api';  // axios instance (default export)
import { apiGet }  from '../helpers/api';  // named export for JSON calls

/* ── helpers ─────────────────────────────────────────────── */
function toQuery(params = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== '' && v !== null && v !== undefined) q.append(k, String(v));
  });
  return q.toString();
}

/** Blob download — بيستخدم axios instance مباشرة */
export async function downloadReportFile(url, filename) {
  const response = await apiInstance.get(url, { responseType: 'blob' });
  const blob     = new Blob([response.data], { type: response.headers['content-type'] });
  const link     = document.createElement('a');
  link.href      = URL.createObjectURL(blob);
  link.download  = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

/* ─────────────────────────────────────────────────────────────
   COMPANY MONTH
   params: { year, month, branchId?, departmentId?,
             payrollApprovedOnly?, page?, limit? }
───────────────────────────────────────────────────────────── */
export const getCompanyMonthReport = (params = {}) =>
  apiGet(`/reports/company/month?${toQuery({ format:'json', ...params })}`);

export const downloadCompanyMonthPdf = (params = {}) =>
  downloadReportFile(
    `/reports/company/month?${toQuery({ ...params, format:'pdf', page:1, limit:9999 })}`,
    `company_report_${params.year}_${String(params.month).padStart(2,'0')}.pdf`
  );

export const downloadCompanyMonthExcel = (params = {}) =>
  downloadReportFile(
    `/reports/company/month?${toQuery({ ...params, format:'excel', page:1, limit:9999 })}`,
    `company_report_${params.year}_${String(params.month).padStart(2,'0')}.xlsx`
  );

/* ─────────────────────────────────────────────────────────────
   COMPANY YEAR
───────────────────────────────────────────────────────────── */
export const getCompanyYearReport = (params = {}) =>
  apiGet(`/reports/company/year?${toQuery({ format:'json', ...params })}`);

export const downloadCompanyYearPdf = (params = {}) =>
  downloadReportFile(
    `/reports/company/year?${toQuery({ ...params, format:'pdf', page:1, limit:9999 })}`,
    `company_report_year_${params.year}.pdf`
  );

export const downloadCompanyYearExcel = (params = {}) =>
  downloadReportFile(
    `/reports/company/year?${toQuery({ ...params, format:'excel', page:1, limit:9999 })}`,
    `company_report_year_${params.year}.xlsx`
  );

/* ─────────────────────────────────────────────────────────────
   USER MONTH
───────────────────────────────────────────────────────────── */
export const getUserMonthReport = (userId, params = {}) =>
  apiGet(`/reports/user/${userId}/month?${toQuery({ format:'json', ...params })}`);

export const downloadUserMonthPdf = (userId, params = {}) =>
  downloadReportFile(
    `/reports/user/${userId}/month?${toQuery({ ...params, format:'pdf' })}`,
    `employee_report_${params.year}_${String(params.month).padStart(2,'0')}.pdf`
  );

export const downloadUserMonthExcel = (userId, params = {}) =>
  downloadReportFile(
    `/reports/user/${userId}/month?${toQuery({ ...params, format:'excel' })}`,
    `employee_report_${params.year}_${String(params.month).padStart(2,'0')}.xlsx`
  );