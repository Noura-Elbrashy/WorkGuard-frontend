// src/services/platform/platformAuth.service.js
import platformApi from '../../helpers/platformApi';

export const loginPlatform       = (data) => platformApi.post('/auth/login',           data);
export const logoutPlatform      = ()     => platformApi.post('/auth/logout');
export const getMePlatform       = ()     => platformApi.get ('/auth/me');
export const forgotPasswordPlat  = (data) => platformApi.post('/auth/forgot-password',  data);
export const resetPasswordPlat   = (data) => platformApi.post('/auth/reset-password',   data);

// Platform Users (owner_admin only)
export const getPlatformUsers    = ()           => platformApi.get   ('/auth/users');
export const createPlatformUser  = (data)       => platformApi.post  ('/auth/users',       data);
export const updatePlatformUser  = (id, data)   => platformApi.put   (`/auth/users/${id}`, data);
export const deletePlatformUser  = (id)         => platformApi.delete(`/auth/users/${id}`);