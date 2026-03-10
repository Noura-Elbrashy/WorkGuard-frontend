import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from '../../helpers/api';

/* ==============================================
   📜 OvertimePolicy API Service
============================================== */

/**
 * 📋 Get All Policies
 * @param {Object} params - { page, limit, scope, scopeId, isActive }
 */
export const getOvertimePolicies = async (params = {}) => {
  const { data } = await apiGet('/overtime-policies', { params });
  return data;
};

/**
 * 🔍 Get Policy By ID
 */
export const getOvertimePolicyById = async (id) => {
  const { data } = await apiGet(`/overtime-policies/${id}`);
  return data;
};

/**
 * ➕ Create Policy
 */
export const createOvertimePolicy = async (payload) => {
  const { data } = await apiPost('/overtime-policies', payload);
  return data;
};

/**
 * ✏️ Update Policy
 * ⚠️ scope و scopeId لا يتغيروا
 */
export const updateOvertimePolicy = async (id, payload) => {
  const { data } = await apiPut(`/overtime-policies/${id}`, payload);
  return data;
};

/**
 * 🗑️ Deactivate Policy (Soft Delete)
 */
export const deleteOvertimePolicy = async (id) => {
  const { data } = await apiDelete(`/overtime-policies/${id}`);
  return data;
};

/**
 * ✅ Activate Policy
 */
export const activateOvertimePolicy = async (id) => {
  const { data } = await apiPatch(`/overtime-policies/${id}/activate`);
  return data;
};

/**
 * 💣 Hard Delete
 * ⚠️ SuperAdmin (GLOBAL) فقط — بيمسح من الـ DB نهائياً
 */
export const hardDeleteOvertimePolicy = async (id) => {
  const { data } = await apiDelete(`/overtime-policies/${id}/hard`);
  return data;
};