// src/services/department.api.js
import { apiGet, apiPost, apiPut, apiDelete,apiPatch } from '../helpers/api';

/* ======================================================
   Department CRUD
====================================================== */

/**
 * ➕ Create department
 */
export const createDepartment = (data) => {
  return apiPost('/departments', data);
};

/**
 * 📋 Get all departments
 */
export const getDepartments = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/departments?${queryParams.toString()}`);
};

/**
 * 👁️ Get department by ID
 */
export const getDepartmentById = (departmentId) => {
  return apiGet(`/departments/${departmentId}`);
};

/**
 * ✏️ Update department
 */
export const updateDepartment = (departmentId, data) => {
  return apiPut(`/departments/${departmentId}`, data);
};

/**
 * ❌ Delete department(Hard Delete)
 */
export const deleteDepartment = (departmentId) => {
  return apiDelete(`/departments/${departmentId}`);
};

/**
 * 🔴 Deactivate department (Soft Delete)
 */
export const deactivateDepartment = (departmentId) => {
  return apiPatch(`/departments/${departmentId}/deactivate`);
};



/**
 * 🟢 Reactivate department (Soft Delete)
 */export const reactivateDepartment = (departmentId) => {
  return apiPatch(`/departments/${departmentId}/reactivate`);
};
/* ======================================================
   Employee Assignment
====================================================== */

/**
 * 👥 Assign employees to department
 */
export const assignEmployees = (departmentId, userIds) => {
  return apiPost(`/departments/${departmentId}/employees`, { userIds });
};

/**
 * ➖ Remove employee from department
 */
export const removeEmployee = (departmentId, userId) => {
  return apiDelete(`/departments/${departmentId}/employees/${userId}`);
};