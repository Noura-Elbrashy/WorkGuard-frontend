// import { apiGet, apiPost} from '../helpers/api';

// /* =========================
//    Payroll API
// ========================= */

// /**
//  * 👀 Preview Payroll (NO SAVE)
//  * حساب المرتب بدون حفظ
//  *
//  * @param {Object} params
//  * params = { userId, year, month }
//  */
// export const previewPayroll = async (params) => {
//   const { data } = await apiGet('/payroll/preview', { params });
//   return data;
// };

// /**
//  * 🧾 Generate Payroll (SAVE SNAPSHOT)
//  * إنشاء PayrollRun وحفظ Snapshot
//  *
//  * @param {Object} payload
//  * payload = { userId, year, month }
//  */
// export const generatePayroll = async (payload) => {
//   const { data } = await apiPost('/payroll/generate', payload);
//   return data;
// };

// /**
//  * 🔒 Approve Payroll
//  * اعتماد المرتب (LOCK)
//  *
//  * @param {String} payrollRunId
//  */
// export const approvePayroll = async (payrollRunId) => {
//   const { data } = await apiPost(
//     `/payroll/${payrollRunId}/approve`
//   );
//   return data;
// };

// /**
//  * 📋 List Payroll Runs
//  * (لـ HR / Admin)
//  *
//  * @param {Object} params
//  * params = { page, limit, userId, year, month, status }
//  */
// export const getPayrollRuns = async (params = {}) => {
//   const { data } = await apiGet('/payroll', { params });
//   return data;
// };

// /**
//  * 👤 Get Single Payroll Run
//  */
// export const getPayrollRunById = async (id) => {
//   const { data } = await apiGet(`/payroll/${id}`);
//   return data;
// };


// src/services/payroll.api.js
import { apiGet, apiPost } from '../helpers/api';

/** 👀 Preview Payroll */
export const previewPayroll = async (params) => {
  const { data } = await apiGet('/payroll/preview', { params });
  return data;
};

/** 🧾 Generate Payroll (single) */
export const generatePayroll = async (payload) => {
  const { data } = await apiPost('/payroll/generate', payload);
  return data;
};

/** 🔒 Approve Payroll (single) */
export const approvePayroll = async (payrollRunId) => {
  const { data } = await apiPost(`/payroll/${payrollRunId}/approve`);
  return data;
};

/** 📋 List Payroll Runs */
export const getPayrollRuns = async (params = {}) => {
  const { data } = await apiGet('/payroll', { params });
  return data;
};

/** 👤 Get Single Payroll Run */
export const getPayrollRunById = async (id) => {
  const { data } = await apiGet(`/payroll/${id}`);
  return data;
};

/** 📊 Payroll Stats (dashboard) */
export const getPayrollStats = async (params = {}) => {
  const { data } = await apiGet('/payroll/stats', { params });
  return data;
};

/** 🚀 Bulk Generate */
export const bulkGeneratePayroll = async (payload) => {
  const { data } = await apiPost('/payroll/bulk-generate', payload);
  return data;
};

/** ✅ Bulk Approve */
export const bulkApprovePayroll = async (payload) => {
  const { data } = await apiPost('/payroll/bulk-approve', payload);
  return data;
};