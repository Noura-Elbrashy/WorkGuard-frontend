import { apiGet, apiPost } from '../../helpers/api';

/* =========================
   Yearly Annual Leave Reset
========================= */

export const previewYearlyLeaveReset = (year) => {
  const params = year ? `?year=${year}` : '';
  return apiGet(`/admin/leaves/yearly-reset/preview${params}`);
};

export const runYearlyLeaveReset = (year) => {
  return apiPost(`/admin/leaves/yearly-reset/run`, { year });
};

/* =========================
   Yearly Sick Leave Reset
========================= */

export const previewYearlySickReset = (year) => {
  const params = year ? `?year=${year}` : '';
  return apiGet(`/admin/leaves/sick-reset/preview${params}`);
};

export const runYearlySickReset = (year) => {
  return apiPost(`/admin/leaves/sick-reset/run`, { year });
};

/* =========================
   Manual Adjust Leave Balance
========================= */


export const previewLeaveAdjustment = ({
  userId,
  year,
  type,
  operation,
  amount
}) => {
  return apiPost(
    `/admin/leave-adjustments/preview/${userId}`,
    {
      year,
      type,
      operation,
      amount
    }
  );
};

/* =========================
   Run Manual Adjustment
========================= */


export const adjustLeaveBalance = ({
  userId,
  year,
  type,
  operation,
  amount,
  reason
}) => {
  return apiPost(
    `/admin/leave-policies/leave-adjustments/${userId}`,
    {
      year,
      type,
      operation,
      amount,
      reason
    }
  );
};
// export const adjustLeaveBalance = ({



//   userId,
//   year,
//   type,
//   operation,
//   amount,
//   reason
// }) => {
//   return apiPost(
//     `/admin/leave-policies/leave-adjustments/${userId}`,
//     {
//       year,
//       type,
//       operation,
//       amount,
//       reason
//     }
//   );
// };