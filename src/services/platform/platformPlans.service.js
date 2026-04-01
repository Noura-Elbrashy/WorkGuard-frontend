// src/services/platform/platformPlans.service.js
import platformApi from '../../helpers/platformApi';

export const getPlans   = (params)   => platformApi.get   ('/plans',              { params });
export const getPlan    = (id)       => platformApi.get   (`/plans/${id}`);
export const createPlan = (data)     => platformApi.post  ('/plans',               data);
export const updatePlan = (id, data) => platformApi.put   (`/plans/${id}`,         data);
export const togglePlan = (id)       => platformApi.patch (`/plans/${id}/toggle`);
export const deletePlan = (id)       => platformApi.delete(`/plans/${id}`);