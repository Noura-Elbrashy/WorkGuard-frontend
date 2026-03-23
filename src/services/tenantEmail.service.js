// src/services/tenantEmail.service.js
import { apiGet, apiPost, apiDelete } from '../helpers/api';

/**
 * GET /tenant-email
 * جلب إعدادات الإيميل للشركة الحالية
 */
export const getEmailSettings = async () => {
  const { data } = await apiGet('/tenant-email');
  return data;
};

/**
 * POST /tenant-email
 * حفظ / تحديث إعدادات الإيميل
 * @param {Object} payload - { user, password, smtpHost, smtpPort, fromName }
 */
export const setEmailSettings = async (payload) => {
  const { data } = await apiPost('/tenant-email', payload);
  return data;
};

/**
 * DELETE /tenant-email
 * حذف إعدادات الإيميل
 */
export const deleteEmailSettings = async () => {
  const { data } = await apiDelete('/tenant-email');
  return data;
};

//test
export const testEmailSettings = async (payload) => {
  const { data } = await apiPost('/tenant-email/test', payload);
  return data;
};