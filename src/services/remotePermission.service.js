// src/services/permission.api.js
import { apiGet, apiPost, apiDelete } from '../helpers/api';

/* ======================================================
   Remote Permissions – Admin
====================================================== */

/**
 * 🏠 Grant remote permission (single user)
 */
export const grantRemotePermission = (data) => {
  return apiPost(
    '/permission/permissions/grant-remote-permission',
    data
  );
};

/**
 * 🏠 Grant remote permissions (bulk)
 */
export const bulkGrantRemotePermission = (data) => {
  return apiPost(
    '/permission/permissions/remote-permissions',
    data
  );
};

/* ======================================================
   Permissions Listing & Stats
====================================================== */

/**
 * 📋 Get all remote permissions (paginated & filtered)
 * params: page, limit, branchId, userId, status, search, dateFrom, dateTo
 */
export const getRemotePermissions = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(
    `/permission/permissions?${queryParams.toString()}`
  );
};

/**
 * 📊 Get remote permissions statistics
 * params: branchId, dateFrom, dateTo
 */
export const getRemotePermissionsStats = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(
    `/permission/permissions/stats?${queryParams.toString()}`
  );
};

/* ======================================================
   Revoke Permission
====================================================== */

/**
 * ❌ Revoke remote permission
 */
export const revokeRemotePermission = ({
  userId,
  permissionId,
  reason
}) => {
  return apiDelete(
    `/permission/permissions/${userId}/${permissionId}`,
    { data: { reason } } // axios delete with body
  );
};
