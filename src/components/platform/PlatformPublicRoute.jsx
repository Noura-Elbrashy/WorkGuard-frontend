// src/components/platform/PlatformPublicRoute.jsx

//ـ PlatformPublicRoute يمنع الرجوع للـ login لو already logged in:


import { Navigate } from 'react-router-dom';
import { isPlatformAuthenticated } from '../../helpers/platformAuth';

export default function PlatformPublicRoute({ children }) {
  if (isPlatformAuthenticated()) {
    return <Navigate to="/platform/dashboard" replace />;
  }
  return children;
}