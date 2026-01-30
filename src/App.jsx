
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiGet } from './helpers/api';
import Login from './pages/Login';
import Attendance from './pages/Attendance';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import AppFooter from './components/AppFooter';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import AdminBranches from './pages/AdminBranches';
import ErrorBoundary from './components/ErrorBoundary';
import ActivateAccount from './components/ActivateAccount';
import AddEmployee from './pages/AddEmployee';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';
// import LeaveManagement from './pages/LeaveManagement';
// import LeaveRequestForm from './pages/LeaveRequestForm';
import EmployeeAttendancePage from './pages/EmployeeAttendance/EmployeeAttendancePage';
import AdminDeviceControl from './pages/AdminDeviceControl';
// Leave Pages
import LeavesAdminPage from './pages/leave/LeavesAdminPage';
import MyLeavesPage from './pages/leave/MyLeavesPage';
import DetailsLeavePage from './pages/leave/DetailsLeavePage';
import SubmitLeavePage from './pages/leave/SubmitLeavePage';
import LeavePoliciesPage from "./pages/LeavePoliciesPage";
import EditLeavePolicyPage from "./components/leave/policy/EditLeavePolicyPage";
import CreateLeavePolicyPage from "./components/leave/policy/CreateLeavePolicyPage";
import AttendancePoliciesPage from './pages/AttendancePolicies/AttendancePoliciesPage';

import PayrollPreviewPage from "./pages/payroll/PayrollPreviewPage";
import PayrollRunDetailsPage from "./pages/payroll/PayrollRunDetailsPage";

import PayrollRunsListPage from "./pages/payroll/PayrollRunsListPage";
import EmployeeLeaveProfile from "./pages/leave/EmployeeLeaveProfile";
import './index.css';
import './style/table-responsive.css';

import "bootstrap/dist/js/bootstrap.bundle.min.js";

import DashboardPage from './pages/Dashboard/DashboardPage';
import HolidaysPage from './pages/Holidays/HolidaysPage';

import RemotePermission from "./pages/RemotePermission";
// ProtectedRoute for admin-only pages
function ProtectedRoute({ children }) {
  const [isAdmin, setIsAdmin] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await apiGet('/auth/profile');
        setIsAdmin(res.data.role === 'admin');
      } catch (err) {
        console.error('Auth check error:', err);
        setError(err.response?.data?.message || 'Authentication failed');
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/not-found" replace />;
  }

  return error ? <div className="alert alert-danger">{error}</div> : children;
}

// For protected pages (non-admin) - redirect to / if no token
function AuthenticatedRoute({ children }) {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  return children;
}

// For public pages like login and activation - redirect to /dashboard if token exists
function PublicRoute({ children, isActivation = false, isResetPassword = false }) {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // لا تعيد التوجيه إذا كانت صفحة إعادة تعيين كلمة المرور أو تفعيل الحساب
    if (token && !isActivation && !isResetPassword) {
      navigate('/attendance');
    }
  }, [navigate, isActivation, isResetPassword]);

  return children;
}

// مكون خاص لصفحات إعادة تعيين كلمة المرور (لا يحتاج auth)
function ResetPasswordRoute({ children }) {
  // لا نفعل أي شيء، فقط نعرض الأطفال
  return children;
}

function App() {
  const changeLanguage = (lang) => {
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  };

  document.documentElement.setAttribute('dir', 'rtl');
  document.documentElement.setAttribute('lang', 'ar');

  function Layout() {
    const location = useLocation();
    const noNavbarRoutes = [
      '/', 
      '/not-found', 
      '/forgot-password', 
      '/reset-password',
      
    ];
    const noFooterRoutes = [
    '/',
    '/forgot-password',
    '/not-found',
  ];
    const isNoNavbarRoute = noNavbarRoutes.includes(location.pathname) || 
                           location.pathname.startsWith('/activate/') ||
                           location.pathname.startsWith('/reset-password/');

                             const isNoFooterRoute =
    noFooterRoutes.includes(location.pathname) ||
    location.pathname.startsWith('/activate/') ||
    location.pathname.startsWith('/reset-password/');

    return (
      <>
        {!isNoNavbarRoute && <Navbar changeLanguage={changeLanguage} />}
        <div className="container mt-4">
          <Routes>
            {/* الصفحات العامة */}
            <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            
            {/* صفحات خاصة (لا تحتاج auth ولا تعيد توجيه) */}
            <Route 
              path="/activate/:token" 
              element={
                <PublicRoute isActivation={true}>
                  <ActivateAccount />
                </PublicRoute>
              } 
            />
            
            <Route 
              path="/reset-password/:token" 
              element={
                <ResetPasswordRoute>
                  <ResetPassword />
                </ResetPasswordRoute>
              } 
            />
            
            {/* الصفحات المحمية للمستخدمين العاديين */}
            <Route path="/attendance" element={<AuthenticatedRoute><Attendance /></AuthenticatedRoute>} />
            <Route path="/profile/:id" element={<AuthenticatedRoute><UserProfile /></AuthenticatedRoute>} />
            {/* <Route path="/request-leave" element={<AuthenticatedRoute><LeaveRequestForm /></AuthenticatedRoute>} />          الصفحات المحمية للمديرين فقط */}
            <Route
              path="/adminbranches"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <AdminBranches />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route
  path="/employee-attendance"
  element={<ProtectedRoute>
  <EmployeeAttendancePage />
   </ProtectedRoute>}
/>

<Route
  path="/admin/devices"
  element={
    <ProtectedRoute>
      <AdminDeviceControl />
    </ProtectedRoute>
  }
/>

<Route
path="/admin/RemotePermission"
element={ <ProtectedRoute>
      <RemotePermission />
    </ProtectedRoute>}/>


            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <AdminDashboard />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
              {/* <Route
              path="/leave-management"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <LeaveManagement />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            /> */}
            <Route
              path="/add-employee"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <AddEmployee />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
        
      {/* ================= Employee ================= */}
      <Route path="/leaves" element={<MyLeavesPage />} />
      <Route path="/leaves/:id" element={<DetailsLeavePage />} />
<Route
  path="/admin/employees/:userId/leave-profile"
  element={
    <ProtectedRoute>
      <EmployeeLeaveProfile />
    </ProtectedRoute>
  }
/>

      {/* ================= Admin ================= */}
      
<Route
  path="/admin/dashboardx"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>

{/* Holidays - Admin Only */}
<Route
  path="/admin/holidays"
  element={
    <ProtectedRoute>
      <HolidaysPage />
    </ProtectedRoute>
  }
/>

{/* // Leave Management - Admin Only */}
     <Route
  path="/admin/leaves"
  element={
    <ProtectedRoute>
      <LeavesAdminPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/leave-policies"
  element={<LeavePoliciesPage />}
/>

<Route
  path="/admin/leave-policies/create"
  element={<CreateLeavePolicyPage />}
/>

<Route
  path="/admin/leave-policies/:id/edit"
  element={<EditLeavePolicyPage />}
/>
<Route path="/admin/attendance-policies">
  <Route index element={<AttendancePoliciesPage />} />
</Route>
<Route
  path="/employees/:userId/payroll/preview"
  element={<PayrollPreviewPage />}
/>
<Route path="/payroll/:id" element={<PayrollRunDetailsPage />} />

<Route path="/payroll" element={<PayrollRunsListPage />} />

{/* // ================= Submit Leave ================= */}
<Route
  path="/request-leave"
  element={
    <AuthenticatedRoute>
      <SubmitLeavePage />
    </AuthenticatedRoute>
  }
/>

            {/* صفحات الخطأ */}
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
         {!isNoFooterRoute && <AppFooter />}
      </>
    );
  }

  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;