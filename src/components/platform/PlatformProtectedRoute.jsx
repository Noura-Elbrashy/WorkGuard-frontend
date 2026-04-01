// src/components/platform/PlatformRoutes.jsx
import { Navigate } from 'react-router-dom';
import { isPlatformAuthenticated } from '../../helpers/platformAuth';

// ✅ لو مش logged in → redirect للـ login
export function PlatformProtectedRoute({ children }) {
  if (!isPlatformAuthenticated())
    return <Navigate to="/platform/login" replace />;
  return children;
}

// ✅ لو logged in → redirect للـ dashboard (منع الرجوع للـ login)
export function PlatformPublicRoute({ children }) {
  if (isPlatformAuthenticated())
    return <Navigate to="/platform/dashboard" replace />;
  return children;
}