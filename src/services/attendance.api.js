// src/services/attendance.api.js
import { apiGet ,apiPost, apiPatch } from '../helpers/api';



/* ======================================================
   Basic Attendance
====================================================== */

/**
 * ✅ Check-in
 */
export const checkIn = (data) => {
  return apiPost('/attendance/checkin', data);
};

/**
 * ✅ Check-out
 */
export const checkOut = (data) => {
  return apiPost('/attendance/checkout', data);
};

/**
 * 📝 Record unpaid absence
 */
export const recordAbsence = (data) => {
  return apiPost('/attendance/record-absence', data);
};

/* ======================================================
   Admin - Emergency & Remote
====================================================== */

/**
 * 🚨 Toggle emergency mode
 */
export const toggleEmergency = (data) => {
  return apiPost('/attendance/toggle-emergency', data);
};

/**
 * 🏠 Grant remote permission (single user)
 */
// export const grantRemotePermission = (data) => {
//   return apiPost('/attendance/grant-remote-permission', data);
// };

// /**
//  * 🏠 Bulk grant remote permissions
//  */
// export const bulkGrantRemotePermission = (data) => {
//   return apiPost('/attendance/remote-permissions', data);
// };

/* ======================================================
   Admin - Update Attendance
====================================================== */

/**
 * ✏️ Admin update attendance record
 *   تعديل سجل حضور خام 
 * */
  
export const adminUpdateAttendance = (attendanceId, data) => {
  return apiPatch(`/attendance/attendance/${attendanceId}`, data);
};

/* ======================================================
   Reports & Stats
====================================================== */

/**
 * 👤 Get user attendance
 */
export const getUserAttendance = (userId, params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/attendance/user/${userId}?${queryParams.toString()}`);
};


/**
 * Get current checked-in employees for a branch (today)
 */
export const getCurrentAttendanceByBranch = (branchId, params = {}) => {
  return apiGet(
    `/attendance/branches/${branchId}/current-attendance`,
    { params }
  );
};
/**
 * 📅 Get attendance day details
 */
export const getAttendanceDayDetails = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/attendance/day-details?${queryParams.toString()}`);
};

/**
 * 📊 Get attendance reports
 */
export const getAttendanceReports = (branchId, params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/attendance/reports/${branchId}?${queryParams.toString()}`);
};

/**
 * 📈 Get attendance stats
 */
export const getAttendanceStats = (branchId, params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/attendance/stats/${branchId}?${queryParams.toString()}`);
};

/* ======================================================
   Security
====================================================== */

/**
 * 🔒 Get security logs
 */
export const getSecurityLogs = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/attendance/security-logs?${queryParams.toString()}`);
};

/**
 * ⚠️ Get security alerts
 */
export const getSecurityAlerts = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/attendance/security-alerts?${queryParams.toString()}`);
};

/**
 * ✅ Update security alert
 */
export const updateSecurityAlert = (logId, data) => {
  return apiPatch(`/attendance/security-alert/${logId}`, data);
};

/* ======================================================
   Admin – Absence
====================================================== */

/**
 * 📅 Monthly absence (absent + unpaid leave)
 */

export const getMonthlyAbsence = ({ userId, year, month }) => {
  if (!userId || !year || !month) {
    throw new Error('userId, year and month are required');
  }

  const params = new URLSearchParams({
    userId,
    year,
    month
  });

  return apiGet(
    `/attendance/absence/month?${params.toString()}`
  );
};

/**
 * 📆 Yearly absence summary
 */

export const getYearlyAbsence = ({ userId, year }) => {
  if (!userId || !year) {
    throw new Error('userId and year are required');
  }

  const params = new URLSearchParams({
    userId,
    year
  });

  return apiGet(
    `/attendance/absence/year?${params.toString()}`
  );
};

export const overrideDayDecision = ({ summaryId, decision, reason }) => {
  return apiPost(
    `/attendance-summary/${summaryId}/override`,
    { decision, reason }
  );
};
