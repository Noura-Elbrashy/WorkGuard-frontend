// src/services/user.api.js
// src/services/user.api.js
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '../helpers/api';

/* ======================================================
   Auth / Activation
====================================================== */

/**
 * ✅ Activate account
 */
export const activateAccount = (data) => {
  return apiPost('/users/activate', data);
};

/**
 * 🔑 Validate token
 */
export const validateToken = (data) => {
  return apiPost('/users/validate-token', data);
};

/* ======================================================
   User Lookup & Search
====================================================== */

/**
 * 🔍 Search users (lightweight for selects)
 */
export const searchUsers = (query) => {
  return apiGet('/users/lookup', {
    params: { q: query }
  });
};

/* ======================================================
   Users Collection
====================================================== */

/**
 * 📋 Get all users
 */
export const getAllUsers = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/users?${queryParams.toString()}`);
};

/**
 * ➕ Add new user
 */
export const addUser = (data) => {
  return apiPost('/users', data);
};

/* ======================================================
   Current User
====================================================== */

/**
 * 👤 Get current user info
 */
export const getCurrentUser = () => {
  return apiGet('/users/me');
};

/**
 * 📊 Get my attendance summary
 */
export const getMyAttendanceSummary = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/users/attendance-summary?${queryParams.toString()}`);
};

/**
 * 📅 Get my weekly attendance
 */
export const getMyWeeklyAttendance = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/users/me/attendance-week?${queryParams.toString()}`);
};

/* ======================================================
   User Data
====================================================== */

/**
 * 👤 Get user by ID
 */
export const getUserById = (userId) => {
  return apiGet(`/users/${userId}`);
};

/**
 * ✏️ Update user
 */
export const updateUser = (userId, data) => {
  return apiPut(`/users/${userId}`, data);
};

/**
 * ❌ Delete user
 */
export const deleteUser = (userId) => {
  return apiDelete(`/users/${userId}`);
};

/* ======================================================
   User Lifecycle
====================================================== */

/**
 * 🔄 Update employment status
 */
export const updateEmploymentStatus = (userId, data) => {
  return apiPut(`/users/${userId}/employment-status`, data);
};

/* ======================================================
   Biometrics
====================================================== */

/**
 * 🔐 Toggle biometrics requirement
 */
export const toggleBiometricsRequirement = (userId, data) => {
  return apiPut(`/users/${userId}/biometrics/require`, data);
};

/* ======================================================
   Devices
====================================================== */

/**
 * 📱 Register device
 */
export const registerDevice = (data) => {
  return apiPost('/users/register-device', data);
};

/**
 * 📋 Get pending devices
 */
export const getPendingDevices = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/users/pending-devices?${queryParams.toString()}`);
};

/**
 * 📱 Get user devices
 */
export const getUserDevices = (userId) => {
  return apiGet(`/users/${userId}/devices`);
};

/**
 * ✅ Approve device
 */
export const approveUserDevice = (userId, deviceId, data) => {
  return apiPatch(`/users/${userId}/devices/${deviceId}/approve`, data);
};

/**
 * 🔄 Toggle device status (enable/disable)
 */
export const toggleDeviceStatus = (userId, deviceId, data) => {
  return apiPut(`/users/${userId}/devices/${deviceId}`, data);
};

/**
 * ❌ Remove device
 */
export const removeUserDevice = (userId, deviceId) => {
  return apiDelete(`/users/${userId}/devices/${deviceId}`);
};

/* ======================================================
   Feedback
====================================================== */

/**
 * ➕ Add feedback
 */
export const addFeedback = (userId, data) => {
  return apiPost(`/users/${userId}/feedback`, data);
};

/**
 * 📋 Get user feedbacks
 */
export const getUserFeedbacks = (userId) => {
  return apiGet(`/users/${userId}/feedback`);
};

/**
 * ✏️ Update feedback
 */
export const updateFeedback = (userId, feedbackId, data) => {
  return apiPut(`/users/${userId}/feedback/${feedbackId}`, data);
};

/**
 * ❌ Delete feedback
 */
export const deleteFeedback = (userId, feedbackId) => {
  return apiDelete(`/users/${userId}/feedback/${feedbackId}`);
};

/* ======================================================
   Reports
====================================================== */

/**
 * 📊 Get monthly report
 */
export const getMonthlyReport = (userId, params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/users/${userId}/reports/monthly?${queryParams.toString()}`);
};