// src/services/admin.api.js
import { apiGet, apiPost, apiPut } from '../helpers/api';

/* ======================================================
   Admin - Attendance
====================================================== */

/**
 * 📋 Get all attendance records
 */
export const getAllAttendance = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/admin/attendance?${queryParams.toString()}`);
};

/**
 * 👤 Get attendance by user ID
 */
export const getAttendanceByUser = (userId, params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/admin/attendance/${userId}?${queryParams.toString()}`);
};

/**
 * ✏️ Admin update attendance (same as in attendance.api.js but via admin route)
 */
export const adminUpdateAttendance = (attendanceId, data) => {
  return apiPut(`/admin/attendance/${attendanceId}`, data);
};

/**
 * 📊 Get attendance summary (main table with pagination)
 */
export const getAttendanceSummary = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/admin/attendance-summary?${queryParams.toString()}`);
};

/**
 * 📅 Get admin weekly attendance for specific user
 */
export const getAdminWeeklyAttendance = (userId, params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/admin/users/${userId}/attendance-week?${queryParams.toString()}`);
};

/**
 * ➕ Create manual attendance
 */
export const createManualAttendance = (data) => {
  return apiPost('/admin/attendance/manual', data);
};

/* ======================================================
   Admin - Payroll
====================================================== */

/**
 * 💰 Get total salaries
 */
export const getTotalSalaries = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/admin/total-salaries?${queryParams.toString()}`);
};

/**
 * 📊 Get yearly salaries
 */
export const getYearlySalaries = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/admin/yearly-salaries?${queryParams.toString()}`);
};

/* ======================================================
   Admin - Devices
====================================================== */

/**
 * 📱 Get all devices (admin view)
 */
export const getAdminDevices = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/admin/devices?${queryParams.toString()}`);
};

/* ======================================================
   Admin - Reports
====================================================== */

/**
 * 📈 Get user monthly report
 */
export const getUserMonthlyReport = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/admin/user-monthly-report?${queryParams.toString()}`);
};

/* ======================================================
   Self - Employee Views (Non-Admin)
====================================================== */

/**
 * 📊 Get my attendance summary (employee self-view)
 */
export const getSelfAttendanceSummary = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/admin/my-attendance-summary?${queryParams.toString()}`);
};

/**
 * 📅 Get my day details (employee self-view)
 */
export const getSelfDayDetails = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/admin/my-attendance/day-details?${queryParams.toString()}`);
};