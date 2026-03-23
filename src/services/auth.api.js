// src/services/auth.api.js
import { apiGet, apiPost } from '../helpers/api';

/* ======================================================
   Authentication
====================================================== */

/**
 * 🔐 Login user
 */
export const loginUser = (credentials) => {
  return apiPost('/auth/login', credentials);
};

/**
 * 📝 Register user (Admin only)
 */
export const registerUser = (data) => {
  return apiPost('/auth/register', data);
};

// /**
//  * 👤 Get current user profile
//  */
// export const getProfile = () => {
//   return apiGet('/auth/profile');
// };

/* ======================================================
   Account Activation
====================================================== */

/**
 * 📧 Resend activation email (Admin only)
 */
export const resendActivation = (userId) => {
  return apiPost(`/auth/resend-activation/${userId}`);
};

/* ======================================================
   Password Reset
====================================================== */

/**
 * 📧 Request password reset (forgot password)
 */
export const forgotPassword = (data) => {
  return apiPost('/auth/forgot-password', data);
};

/**
 * 🔑 Reset password with token
 */
export const resetPassword = (data) => {
  return apiPost('/auth/reset-password', data);
};

/**
 * ✅ Verify reset token validity
 */
export const verifyResetToken = (token) => {
  return apiGet(`/auth/verify-reset-token/${token}`);
};