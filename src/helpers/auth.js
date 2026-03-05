// src/helpers/auth.js

//helper لفك الـ token:
// src/helpers/auth.js

// export const getTokenPayload = () => {
//   try {
//     const token = localStorage.getItem('token');
//     if (!token) return null;

//     const base64 = token.split('.')[1];
//     const payload = JSON.parse(atob(base64));

//     // تأكد إن الـ token مش expired
//     if (payload.exp && payload.exp * 1000 < Date.now()) {
//       localStorage.removeItem('token');
//       return null;
//     }

//     return payload;
//   } catch {
//     return null;
//   }
// };

// export const isGlobalAdmin = () => {
//   const payload = getTokenPayload();
//   if (!payload) return false;
//   if (payload.role !== 'admin') return false;
//   return !payload.adminScope || payload.adminScope.type === 'GLOBAL';
// };

// export const getAdminScope = () => {
//   const payload = getTokenPayload();
//   return payload?.adminScope || null;
// };

export const getTokenPayload = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return null;
    }
    return payload;
  } catch { return null; }
};

export const isGlobalAdmin = () => {
  const p = getTokenPayload();
  if (!p || p.role !== 'admin') return false;
  return !p.adminScope || p.adminScope.type === 'GLOBAL';
};