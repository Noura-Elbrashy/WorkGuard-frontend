import { apiGet, apiPost, apiDelete, apiPatch } from '../../helpers/api';

/* ==============================================
   📜 OvertimeEntry API Service
============================================== */

/**
 * 📋 Get Entries
 * @param {Object} params
 * params = { userId, type, status, source, dateFrom, dateTo, page, limit }
 */
export const getOvertimeEntries = async (params = {}) => {
  const { data } = await apiGet('/overtime-entries', { params });
  return data;
};

/**
 * Get Overtime Stats (for Admin Dashboard)
 * @param {Object} params
 * @returns {Object} { totalEntries, byType: { BEFORE_SHIFT: 10, AFTER_SHIFT_DAY: 5, ... } } 
 */
export const getOvertimeStats = async () => {
  const { data } = await apiGet('/overtime-entries/stats');
  return data;
};

/**
 * 🔍 Get Entry By ID
 */
export const getOvertimeEntryById = async (id) => {
  const { data } = await apiGet(`/overtime-entries/${id}`);
  return data;
};

/**
 * 🎁 Add Exceptional Bonus (Admin Manual)
 * @param {{ userId, date, amount, notes }} payload
 */
export const addExceptionalBonus = async (payload) => {
  const { data } = await apiPost('/overtime-entries/exceptional', payload);
  return data;
};

/**
 * ✅ Approve Entry
 */
export const approveOvertimeEntry = async (id) => {
  const { data } = await apiPatch(`/overtime-entries/${id}/approve`);
  return data;
};

/**
 * ❌ Reject Entry
 * @param {string} id
 * @param {string} reason
 */
export const rejectOvertimeEntry = async (id, reason) => {
  const { data } = await apiPatch(`/overtime-entries/${id}/reject`, { reason });
  return data;
};

/**
 * 🗑️ Delete Entry (manual only)
 */
export const deleteOvertimeEntry = async (id) => {
  const { data } = await apiDelete(`/overtime-entries/${id}`);
  return data;
};