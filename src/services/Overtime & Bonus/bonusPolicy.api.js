import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from '../../helpers/api';

/* ==============================================
   📜 BonusPolicy API Service
============================================== */

/**
 * 📋 Get All Policies
 * @param {Object} params - { page, limit, scope, scopeId, isActive }
 */
export const getBonusPolicies = async (params = {}) => {
  const { data } = await apiGet('/bonus-policies', { params });
  return data;
};

/**
 * 🔍 Get Policy By ID
 */
export const getBonusPolicyById = async (id) => {
  const { data } = await apiGet(`/bonus-policies/${id}`);
  return data;
};

/**
 * ➕ Create Policy
 */
export const createBonusPolicy = async (payload) => {
  const { data } = await apiPost('/bonus-policies', payload);
  return data;
};

/**
 * ✏️ Update Policy
 * ⚠️ scope و scopeId لا يتغيروا
 */
export const updateBonusPolicy = async (id, payload) => {
  const { data } = await apiPut(`/bonus-policies/${id}`, payload);
  return data;
};

/**
 * 🗑️ Soft Delete (Deactivate)
 */
export const deleteBonusPolicy = async (id) => {
  const { data } = await apiDelete(`/bonus-policies/${id}`);
  return data;
};

/**
 * ✅ Activate Policy
 */
export const activateBonusPolicy = async (id) => {
  const { data } = await apiPatch(`/bonus-policies/${id}/activate`);
  return data;
};

/**
 * 💣 Hard Delete
 * ⚠️ SuperAdmin (GLOBAL) فقط
 */
export const hardDeleteBonusPolicy = async (id) => {
  const { data } = await apiDelete(`/bonus-policies/${id}/hard`);
  return data;
};