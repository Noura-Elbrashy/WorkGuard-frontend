// src/services/systemAdmin.api.js
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '../../helpers/api';

export const getSysAdminStats          = ()         => apiGet('/system-admin/stats');
export const listTenants               = (p = {})   => apiGet('/system-admin/tenants', { params: p });
export const getTenantById             = (id)       => apiGet(`/system-admin/tenants/${id}`);
export const createTenant              = (data)     => apiPost('/system-admin/tenants', data);
export const updateTenantStatus        = (id, status)=> apiPatch(`/system-admin/tenants/${id}/status`, { status });
export const updateTenantNotes         = (id, notes) => apiPatch(`/system-admin/tenants/${id}/notes`, { internalNotes: notes });
export const deleteTenant              = (id, hard)  => apiDelete(`/system-admin/tenants/${id}${hard ? '?hard=true' : ''}`);
export const createSubscription        = (data)     => apiPost('/system-admin/subscriptions', data);
export const cancelSubscription        = (id)       => apiPatch(`/system-admin/subscriptions/${id}/cancel`);
export const markSubscriptionPaid      = (id, ref)  => apiPatch(`/system-admin/subscriptions/${id}/paid`, { paymentRef: ref });
export const getExpiringSubscriptions  = (days = 7) => apiGet('/system-admin/subscriptions/expiring', { params: { days } });