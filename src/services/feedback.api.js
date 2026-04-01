import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '../helpers/api';


/* ======================================================
   Feedback
====================================================== */

/**
 * ➕ Add feedback
 */
export const addFeedback = (userId, data) => {
  return apiPost(`/feedbacks/${userId}/feedback`, data);
};

/**
 * 📋 Get user feedbacks
 */
export const getUserFeedbacks = (userId) => {
  return apiGet(`/feedbacks/${userId}/feedback`);
};

/**
 * ✏️ Update feedback
 */
export const updateFeedback = (userId, feedbackId, data) => {
  return apiPut(`/feedbacks/${userId}/feedback/${feedbackId}`, data);
};

/**
 * ❌ Delete feedback
 */
export const deleteFeedback = (userId, feedbackId) => {
  return apiDelete(`/feedbacks/${userId}/feedback/${feedbackId}`);
};
