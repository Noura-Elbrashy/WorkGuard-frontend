import { apiGet, apiPost , apiDelete ,apiPut } from '../../helpers/api';
/* ======================================================
   Leave Policies (CRUD)
====================================================== */

/**
 * 📋 Get leave policies (with filters + pagination)
 */
export const getLeavePolicies = (params = {}) => {
  return apiGet('/admin/leave-policies', { params });
};

/**
 * ➕ Create leave policy
 */
export const createLeavePolicy = (data) => {
  return apiPost('/admin/leave-policies', data);
};

/**
 * ✏️ Update leave policy
 */
export const updateLeavePolicy = (id, data) => {
  return apiPut(`/admin/leave-policies/${id}`, data);
};

/**
 * 🔄 Enable / Disable policy
 */
export const setLeavePolicyActive = (id, active) => {
  return apiPut(`/admin/leave-policies/${id}/active`, { active });
};

/**
 * 🗑️ Delete leave policy
 */
export const deleteLeavePolicy = (id) => {
  return apiDelete(`/admin/leave-policies/${id}`);
};

/**
 * 🔍 Get leave policy by id
 */
export const getLeavePolicyById = (id) => {
  return apiGet(`/admin/leave-policies/${id}`);
};

/* ======================================================
   Admin Leave Tools
====================================================== */

/**
 * 🔁 Rebuild leave year for user
 */
export const rebuildLeaveYearForUser = ({ userId, year }) => {
  return apiPost('/admin/leave-policies/rebuild-leave-year', {
    userId,
    year
  });
};

export const getEffectiveLeavePolicyForUser = ({ userId, date }) => {
  if (!userId) throw new Error('userId is required');

  const params = new URLSearchParams();
  if (date) params.append('date', date);

  return apiGet(
    `/leaves/users/${userId}/effective-policy?${params.toString()}`
  );
};

export const getUserLeaveYear = ({ userId, year, historyPage = 1, historyLimit = 5 }) => {
  if (!userId) throw new Error('userId is required');

  const params = new URLSearchParams();
  if (year) params.append('year', year);
  if (historyPage)  params.append('historyPage', historyPage);
  if (historyLimit) params.append('historyLimit', historyLimit);
  return apiGet(
    `/leaves/users/${userId}/leave-year?${params.toString()}`
  );
};


/**
 * 👀 Preview yearly annual leave reset
 */
// export const previewYearlyLeaveReset = () => {
//   return apiGet('/admin/leave-policies/leaves/yearly-reset/preview');
// };

// /**
//  * ▶️ Run yearly annual leave reset
//  */
// export const runYearlyLeaveReset = () => {
//   return apiPost('/admin/leave-policies/leaves/yearly-reset/run');
// };

// /**
//  * 👀 Preview yearly sick leave reset
//  */
// export const previewYearlySickReset = () => {
//   return apiGet('/admin/leave-policies/leaves/sick-reset/preview');
// };

// /**
//  * ▶️ Run yearly sick leave reset
//  */
// export const runYearlySickReset = () => {
//   return apiPost('/admin/leave-policies/leaves/sick-reset/run');
// };

// /**
//  * ⚖️ Adjust leave balance manually
//  */
// export const adjustLeaveBalance = (userId, payload) => {
//   return apiPost(
//     `/admin/leave-policies/leaves/adjust-balance/${userId}`,
//     payload
//   );
// };
