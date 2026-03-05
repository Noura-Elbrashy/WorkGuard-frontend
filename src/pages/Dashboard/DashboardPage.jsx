// // src/pages/Dashboard/DashboardPage.jsx

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import '../../style/dashboard.css';

// const DashboardPage = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const modules = [
//     {
//       id: 'holidays',
//       title: t('dashboard.holidays') || 'Holidays Management',
//       description: t('dashboard.holidaysDesc') || 'Manage company and employee holidays',
//       icon: 'fas fa-calendar-alt',
//       color: '#667eea',
//       path: '/admin/holidays',
//       stats: {
//         total: 15,
//         upcoming: 3
//       }
//     },
//     {
//       id: 'employees',
//       title: t('dashboard.employees') || 'Employees',
//       description: t('dashboard.employeesDesc') || 'Manage employee records',
//       icon: 'fas fa-users',
//       color: '#10b981',
//       path: '/admin/employees',
//       stats: {
//         total: 156,
//         active: 142
//       },
//       disabled: true
//     },
//     {
//       id: 'attendance',
//       title: t('dashboard.attendance') || 'Attendance',
//       description: t('dashboard.attendanceDesc') || 'Track employee attendance',
//       icon: 'fas fa-clock',
//       color: '#f59e0b',
//       path: '/employee-attendance',
//       stats: {
//         today: 142
//       },
//       disabled: true
//     },
//     {
//       id: 'payroll',
//       title: t('dashboard.payroll') || 'Payroll',
//       description: t('dashboard.payrollDesc') || 'Manage payroll and salaries',
//       icon: 'fas fa-money-bill-wave',
//       color: '#ef4444',
//       path: '/payroll',
//       stats: {
//         pending: 12
//       },
//       disabled: true
//     }
//   ];

//   return (
//     <div className="dashboard-page">
//       <div className="dashboard-header">
//         <div className="header-content">
//           <h1>{t('dashboard.title') || 'Admin Dashboard'}</h1>
//           <p>{t('dashboard.subtitle') || 'Manage your HR system'}</p>
//         </div>
//       </div>

//       <div className="modules-grid">
//         {modules.map(module => (
//           <div
//             key={module.id}
//             className={`module-card ${module.disabled ? 'disabled' : ''}`}
//             onClick={() => !module.disabled && navigate(module.path)}
//             style={{ '--module-color': module.color }}
//           >
//             <div className="module-icon">
//               <i className={module.icon}></i>
//             </div>
            
//             <div className="module-content">
//               <h3>{module.title}</h3>
//               <p>{module.description}</p>
              
//               {module.stats && (
//                 <div className="module-stats">
//                   {Object.entries(module.stats).map(([key, value]) => (
//                     <div key={key} className="stat-item">
//                       <span className="stat-value">{value}</span>
//                       <span className="stat-label">{key}</span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {module.disabled && (
//               <div className="module-badge">
//                 Coming Soon
//               </div>
//             )}

//             {!module.disabled && (
//               <div className="module-arrow">
//                 <i className="fas fa-arrow-right"></i>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;


//===============================================
//new
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import '../../style/dashboard.css';
// import RemotePermission from '../RemotePermission';
// import logo from '../../assets/logo.png';
// const DashboardPage = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const adminMenuItems = [
//     {
//       id: 'holidays',
//       title: 'Holidays Management',
//       titleAr: 'إدارة الإجازات',
//       description: 'Manage company-wide and employee-specific holidays',
//       descriptionAr: 'إدارة الإجازات الرسمية للشركة والموظفين',
//       icon: 'fa-calendar-alt',
//       color: '#667eea',
//       path: '/admin/holidays'
//     },
//     {
//       id: 'payroll',
//       title: 'Payroll Management',
//       titleAr: 'إدارة الرواتب',
//       description: 'View and manage employee payrolls',
//       descriptionAr: 'عرض وإدارة رواتب الموظفين',
//       icon: 'fa-money-bill-wave',
//       color: '#48bb78',
//       path: '/payroll'
//     },
//     {
//       id: 'attendance',
//       title: 'Attendance Policies',
//       titleAr: 'سياسات الحضور',
//       description: 'Configure attendance and deduction policies',
//       descriptionAr: 'إعداد سياسات الحضور والخصومات',
//       icon: 'fa-user-clock',
//       color: '#f59e0b',
//       path: '/admin/attendance-policies'
//     },
//     {
//       id: 'leaves',
//       title: 'Leave Requests',
//       titleAr: 'طلبات الإجازات',
//       description: 'Review and approve leave requests',
//       descriptionAr: 'مراجعة والموافقة على طلبات الإجازات',
//       icon: 'fa-umbrella-beach',
//       color: '#ec4899',
//       path: '/leaves'
//     }
//     ,
//      {
//       id: 'LeavePolicies',
//       title: 'Leave Policies',
//       titleAr: 'طلبات الإجازات',
//       description: 'Manage employee leave policies and entitlements',
//       descriptionAr: 'إدارة سياسات واستحقاقات إجازات الموظفين',
//       icon: 'fa-file-alt',
//       color: '#7f48ec',
//       path: '/admin/leave-policies'
//     },
//     {
//       id: 'Device Control',
//       title: 'Device Control',
//       titleAr: 'طلبات الإجازات',
//       description: 'Manage and monitor all registered devices',
//       descriptionAr: 'إدارة ومراقبة جميع الأجهزة المسجلة',
//       icon: 'fa-desktop',
//       color: '#38bdf8',
//       path: '/admin/devices'
//     },
//        {
//       id: 'Manage Branches',
//       title: 'Manage Branches',
//       titleAr: 'ادارة الفروع',
//       description: 'Manage and monitor all company branches',
//       descriptionAr: 'إدارة ومراقبة جميع فروع الشركة',
//       icon: 'fa-building',
//       color: '#ec9748',
//       path: '/adminbranches'
//     },

//        {
//       id: 'RemotePermission ',
//       title:'Remote Permission Management',
//       titleAr: 'إدارة أذونات العمل عن بُعد',
//       description: 'Grant employees permission to check in/out from outside branch location',
//       descriptionAr: 'منح الموظفين إذن تسجيل الحضور والانصراف من خارج نطاق الفرع',
//       icon: ' fas fa-map-marker-alt fa-2x',
//       color: 'hsl(203, 80%, 21%)',
//       path: '/admin/RemotePermission'
//     },
//   ];



  
//   return (
//     <div className="dashboard-page">
//       <div className="container">
//         <div className="dashboard-header">
//           <div>
//                     <img
//               src={logo}
//               alt="WorkGuard"
//               className="login-logo"
//             />
//             {/* <h1>Admin Dashboard</h1>
//             <p>Manage your HR system efficiently</p> */}
//           </div>
//         </div>

//         <div className="dashboard-grid">
//           {adminMenuItems.map((item) => (
//             <div
//               key={item.id}
//               className="dashboard-card"
//               onClick={() => navigate(item.path)}
//               style={{ '--card-color': item.color }}
//             >
//               <div className="card-icon" style={{ background: item.color }}>
//                 <i className={`fas ${item.icon}`}></i>
//               </div>
//               <div className="card-content">
//                 <h3>{item.title}</h3>
//                 <p>{item.description}</p>
//               </div>
//               <div className="card-arrow">
//                 <i className="fas fa-arrow-right"></i>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../style/dashboard.css';
import logo from '../../assets/logo.png';

const DashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'add-employee',
      title: 'Add New Employee',
      titleAr: 'إضافة موظف جديد',
      description: 'Register a new employee in the system',
      descriptionAr: 'تسجيل موظف جديد في النظام',
      icon: 'fa-user-plus',
      color: '#10b981',
      path: '/add-employee'
    },
    {
      id: 'view-employees',
      title: 'Employee Directory',
      titleAr: 'دليل الموظفين',
      description: 'View and manage employee profiles',
      descriptionAr: 'عرض وإدارة ملفات الموظفين',
      icon: 'fa-users',
      color: '#3b82f6',
      path: '/admin/employees'
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      titleAr: 'التقارير والتحليلات',
      description: 'Generate comprehensive HR reports',
      descriptionAr: 'إنشاء تقارير شاملة للموارد البشرية',
      icon: 'fa-chart-line',
      color: '#8b5cf6',
      path: '/reports'
    }
  ];

  const adminModules = [
          {
      id: 'payroll',
      title: 'Payroll Management',
      titleAr: 'إدارة الرواتب',
      description: 'Process and manage employee payrolls',
      descriptionAr: 'معالجة وإدارة رواتب الموظفين',
      icon: 'fa-money-bill-wave',
      color: '#10b981',
      path: '/payroll'
    },
    {
      id: 'holidays',
      title: 'Holidays & Events Management',
      titleAr: 'إدارة الإجازات',
      description: 'Manage company-wide and employee-specific holidays',
      descriptionAr: 'إدارة الإجازات الرسمية للشركة والموظفين',
      icon: 'fa-calendar-alt',
      color: '#667eea',
      path: '/admin/holidays'
    },
    // {
    //   id: 'payroll',
    //   title: 'Payroll Management',
    //   titleAr: 'إدارة الرواتب',
    //   description: 'View and manage employee payrolls',
    //   descriptionAr: 'عرض وإدارة رواتب الموظفين',
    //   icon: 'fa-money-bill-wave',
    //   color: '#48bb78',
    //   path: '/payroll'
    // },
 
    {
      id: 'attendance',
      title: 'Attendance Policies',
      titleAr: 'سياسات الحضور',
      description: 'Configure attendance and deduction policies',
      descriptionAr: 'إعداد سياسات الحضور والخصومات',
      icon: 'fa-user-clock',
      color: '#f59e0b',
      path: '/admin/attendance-policies'
    },
    // {
    //   id: 'leaves',
    //   title: 'Leave Requests',
    //   titleAr: 'طلبات الإجازات',
    //   description: 'Review and approve leave requests',
    //   descriptionAr: 'مراجعة والموافقة على طلبات الإجازات',
    //   icon: 'fa-umbrella-beach',
    //   color: '#ec4899',
    //   path: '/leaves'
    // }
    // ,
    //  {
    //   id: 'LeavePolicies',
    //   title: 'Leave Policies',
    //   titleAr: 'طلبات الإجازات',
    //   description: 'Manage employee leave policies and entitlements',
    //   descriptionAr: 'إدارة سياسات واستحقاقات إجازات الموظفين',
    //   icon: 'fa-file-alt',
    //   color: '#7f48ec',
    //   path: '/admin/leave-policies'
    // },
        {
      id: 'leaves',
      title: 'Leave Management',
      titleAr: 'إدارة الإجازات',
      description: 'Manage leave requests and policies',
      descriptionAr: 'إدارة طلبات الإجازات والسياسات',
      icon: 'fa-umbrella-beach',
      color: '#ec4899',
      path: '/admin/leaves'
    },
    {
      id: 'Device Control',
      title: 'Device Control',
      titleAr: 'طلبات الإجازات',
      description: 'Manage and monitor all registered devices',
      descriptionAr: 'إدارة ومراقبة جميع الأجهزة المسجلة',
      icon: 'fa-desktop',
      color: '#38bdf8',
      path: '/admin/devices'
    },
    //    {
    //   id: 'Manage Branches',
    //   title: 'Manage Branches',
    //   titleAr: 'ادارة الفروع',
    //   description: 'Manage and monitor all company branches',
    //   descriptionAr: 'إدارة ومراقبة جميع فروع الشركة',
    //   icon: 'fa-building',
    //   color: '#ec9748',
    //   path: '/adminbranches'
    // },
  {
      id: 'branches',
      title: 'Branch Management',
      titleAr: 'إدارة الفروع',
      description: 'Manage company branches and locations',
      descriptionAr: 'إدارة فروع الشركة والمواقع',
      icon: 'fa-building',
      color: '#f97316',
      path: '/adminbranches'
    },
     {
      id: 'Departments ',
      title:'Departments Management',
      titleAr: 'إدارة الأقسام',
      description: 'Manage company departments and employee assignments',
      descriptionAr: 'إدارة أقسام الشركة وتعيين الموظفين',
      icon: 'fas fa-sitemap',
      color: '#8b5cf6',
      path: '/admin/departments'
    },

       {
      id: 'RemotePermission ',
      title:'Remote Permission Management',
      titleAr: 'إدارة أذونات العمل عن بُعد',
      description: 'Grant employees permission to check in/out from outside branch location',
      descriptionAr: 'منح الموظفين إذن تسجيل الحضور والانصراف من خارج نطاق الفرع',
      icon: ' fas fa-map-marker-alt fa-2x',
      color: 'hsl(203, 80%, 21%)',
      path: '/admin/RemotePermission'
    },
  ];


  //   {
  //     id: 'attendance',
  //     title: 'Attendance Management',
  //     titleAr: 'إدارة الحضور',
  //     description: 'Track employee attendance and working hours',
  //     descriptionAr: 'تتبع حضور الموظفين وساعات العمل',
  //     icon: 'fa-clock',
  //     color: '#f59e0b',
  //     path: '/admin/attendance-policies'
  //   },
  //   {
  //     id: 'leaves',
  //     title: 'Leave Management',
  //     titleAr: 'إدارة الإجازات',
  //     description: 'Manage leave requests and policies',
  //     descriptionAr: 'إدارة طلبات الإجازات والسياسات',
  //     icon: 'fa-umbrella-beach',
  //     color: '#ec4899',
  //     path: '/leaves'
  //   },
  //   {
  //     id: 'payroll',
  //     title: 'Payroll Management',
  //     titleAr: 'إدارة الرواتب',
  //     description: 'Process and manage employee payrolls',
  //     descriptionAr: 'معالجة وإدارة رواتب الموظفين',
  //     icon: 'fa-money-bill-wave',
  //     color: '#10b981',
  //     path: '/payroll'
  //   },
  //   {
  //     id: 'holidays',
  //     title: 'Holidays & Events',
  //     titleAr: 'الإجازات والمناسبات',
  //     description: 'Manage company holidays and events',
  //     descriptionAr: 'إدارة إجازات الشركة والمناسبات',
  //     icon: 'fa-calendar-alt',
  //     color: '#667eea',
  //     path: '/admin/holidays'
  //   },
    // {
    //   id: 'branches',
    //   title: 'Branch Management',
    //   titleAr: 'إدارة الفروع',
    //   description: 'Manage company branches and locations',
    //   descriptionAr: 'إدارة فروع الشركة والمواقع',
    //   icon: 'fa-building',
    //   color: '#f97316',
    //   path: '/adminbranches'
    // },
  //   {
  //     id: 'devices',
  //     title: 'Device Control',
  //     titleAr: 'التحكم في الأجهزة',
  //     description: 'Monitor and manage registered devices',
  //     descriptionAr: 'مراقبة وإدارة الأجهزة المسجلة',
  //     icon: 'fa-desktop',
  //     color: '#06b6d4',
  //     path: '/admin/devices'
  //   },
  //   {
  //     id: 'remote',
  //     title: 'Remote Permissions',
  //     titleAr: 'أذونات العمل عن بُعد',
  //     description: 'Manage remote check-in permissions',
  //     descriptionAr: 'إدارة أذونات تسجيل الحضور عن بُعد',
  //     icon: 'fa-map-marker-alt',
  //     color: '#14532d',
  //     path: '/admin/RemotePermission'
  //   },
  //   {
  //     id: 'leave-policies',
  //     title: 'Leave Policies',
  //     titleAr: 'سياسات الإجازات',
  //     description: 'Configure leave policies and entitlements',
  //     descriptionAr: 'إعداد سياسات واستحقاقات الإجازات',
  //     icon: 'fa-file-alt',
  //     color: '#7c3aed',
  //     path: '/admin/leave-policies'
  //   }
  // ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-container ">
        {/* Simple Logo Header */}
        <div className="dashboard-header-simple">
          <img src={logo} alt="WorkGuard" className="dashboard-logo-simple" />
        </div>

        {/* Quick Actions */}
        <div className="section">
          <div className="section-header">
            <h2>
              <i className="fas fa-bolt"></i>
              Quick Actions
            </h2>
          </div>
          <div className="quick-actions-grid">
            {quickActions.map((action) => (
              <div
                key={action.id}
                className="action-card-simple"
                onClick={() => navigate(action.path)}
                style={{ '--action-color': action.color }}
              >
                <div className="action-icon-simple" style={{ background: action.color }}>
                  <i className={`fas ${action.icon}`}></i>
                </div>
                <div className="action-content-simple">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
                <div className="action-arrow-simple">
                  <i className="fas fa-arrow-right"></i>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Modules */}
        <div className="section">
          <div className="section-header">
            <h2>
              <i className="fas fa-th-large"></i>
              Management Modules
            </h2>
          </div>
          <div className="modules-grid-simple">
            {adminModules.map((module) => (
              <div
                key={module.id}
                className="module-card-simple"
                onClick={() => navigate(module.path)}
                style={{ '--module-color': module.color }}
              >
                <div className="module-icon-simple" style={{ background: module.color }}>
                  <i className={`fas ${module.icon}`}></i>
                </div>
                <div className="module-content-simple">
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                </div>
                <div className="module-arrow-simple">
                  <i className="fas fa-chevron-right"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import '../../style/dashboard.css';
// import logo from '../../assets/logo.png';

// const DashboardPage = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const [stats, setStats] = useState({
//     totalEmployees: 0,
//     presentToday: 0,
//     onLeave: 0,
//     pendingRequests: 0
//   });

//   // محاكاة جلب الإحصائيات
//   useEffect(() => {
//     // هنا يمكنك جلب البيانات الحقيقية من API
//     setStats({
//       totalEmployees: 245,
//       presentToday: 198,
//       onLeave: 12,
//       pendingRequests: 8
//     });
//   }, []);

//   const quickActions = [
//     {
//       id: 'add-employee',
//       title: 'Add New Employee',
//       titleAr: 'إضافة موظف جديد',
//       description: 'Register a new employee in the system',
//       descriptionAr: 'تسجيل موظف جديد في النظام',
//       icon: 'fa-user-plus',
//       color: '#10b981',
//       path: '/employees/new',
//       badge: 'Quick'
//     },
//     {
//       id: 'view-employees',
//       title: 'Employee Directory',
//       titleAr: 'دليل الموظفين',
//       description: 'View and manage employee profiles',
//       descriptionAr: 'عرض وإدارة ملفات الموظفين',
//       icon: 'fa-users',
//       color: '#3b82f6',
//       path: '/employees',
//       stats: stats.totalEmployees
//     },
//     {
//       id: 'reports',
//       title: 'Reports & Analytics',
//       titleAr: 'التقارير والتحليلات',
//       description: 'Generate comprehensive HR reports',
//       descriptionAr: 'إنشاء تقارير شاملة للموارد البشرية',
//       icon: 'fa-chart-line',
//       color: '#8b5cf6',
//       path: '/reports',
//       badge: 'New'
//     }
//   ];

//   const adminModules = [
//     {
//       id: 'attendance',
//       title: 'Attendance Management',
//       titleAr: 'إدارة الحضور',
//       description: 'Track employee attendance and working hours',
//       descriptionAr: 'تتبع حضور الموظفين وساعات العمل',
//       icon: 'fa-clock',
//       color: '#f59e0b',
//       path: '/admin/attendance-policies',
//       stats: {
//         value: stats.presentToday,
//         label: 'Present Today',
//         labelAr: 'حاضر اليوم'
//       }
//     },
//     {
//       id: 'leaves',
//       title: 'Leave Management',
//       titleAr: 'إدارة الإجازات',
//       description: 'Manage leave requests and policies',
//       descriptionAr: 'إدارة طلبات الإجازات والسياسات',
//       icon: 'fa-umbrella-beach',
//       color: '#ec4899',
//       path: '/leaves',
//       stats: {
//         value: stats.pendingRequests,
//         label: 'Pending',
//         labelAr: 'قيد الانتظار'
//       }
//     },
//     {
//       id: 'payroll',
//       title: 'Payroll Management',
//       titleAr: 'إدارة الرواتب',
//       description: 'Process and manage employee payrolls',
//       descriptionAr: 'معالجة وإدارة رواتب الموظفين',
//       icon: 'fa-money-bill-wave',
//       color: '#10b981',
//       path: '/payroll'
//     },
//     {
//       id: 'holidays',
//       title: 'Holidays & Events',
//       titleAr: 'الإجازات والمناسبات',
//       description: 'Manage company holidays and events',
//       descriptionAr: 'إدارة إجازات الشركة والمناسبات',
//       icon: 'fa-calendar-alt',
//       color: '#667eea',
//       path: '/admin/holidays'
//     },
//     {
//       id: 'branches',
//       title: 'Branch Management',
//       titleAr: 'إدارة الفروع',
//       description: 'Manage company branches and locations',
//       descriptionAr: 'إدارة فروع الشركة والمواقع',
//       icon: 'fa-building',
//       color: '#f97316',
//       path: '/adminbranches'
//     },
//     {
//       id: 'devices',
//       title: 'Device Control',
//       titleAr: 'التحكم في الأجهزة',
//       description: 'Monitor and manage registered devices',
//       descriptionAr: 'مراقبة وإدارة الأجهزة المسجلة',
//       icon: 'fa-desktop',
//       color: '#06b6d4',
//       path: '/admin/devices'
//     },
//     {
//       id: 'remote',
//       title: 'Remote Permissions',
//       titleAr: 'أذونات العمل عن بُعد',
//       description: 'Manage remote check-in permissions',
//       descriptionAr: 'إدارة أذونات تسجيل الحضور عن بُعد',
//       icon: 'fa-map-marker-alt',
//       color: '#14532d',
//       path: '/admin/RemotePermission'
//     },
//     {
//       id: 'leave-policies',
//       title: 'Leave Policies',
//       titleAr: 'سياسات الإجازات',
//       description: 'Configure leave policies and entitlements',
//       descriptionAr: 'إعداد سياسات واستحقاقات الإجازات',
//       icon: 'fa-file-alt',
//       color: '#7c3aed',
//       path: '/admin/leave-policies'
//     }
//   ];

//   return (
//     <div className="dashboard-page">
//       <div className="dashboard-container">
//         {/* Header */}
//         <div className="dashboard-header">
//           <div className="header-content">
//             <img src={logo} alt="WorkGuard" className="dashboard-logo" />
//             <div className="header-text">
//               <h1>
//                 <i className="fas fa-tachometer-alt"></i>
//                 Admin Dashboard
//               </h1>
//               <p>Manage your HR system efficiently</p>
//             </div>
//           </div>
//           <div className="header-stats">
//             <div className="stat-card">
//               <div className="stat-icon" style={{ background: '#3b82f6' }}>
//                 <i className="fas fa-users"></i>
//               </div>
//               <div className="stat-details">
//                 <span className="stat-value">{stats.totalEmployees}</span>
//                 <span className="stat-label">Total Employees</span>
//               </div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-icon" style={{ background: '#10b981' }}>
//                 <i className="fas fa-user-check"></i>
//               </div>
//               <div className="stat-details">
//                 <span className="stat-value">{stats.presentToday}</span>
//                 <span className="stat-label">Present Today</span>
//               </div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-icon" style={{ background: '#f59e0b' }}>
//                 <i className="fas fa-user-clock"></i>
//               </div>
//               <div className="stat-details">
//                 <span className="stat-value">{stats.onLeave}</span>
//                 <span className="stat-label">On Leave</span>
//               </div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-icon" style={{ background: '#ec4899' }}>
//                 <i className="fas fa-exclamation-circle"></i>
//               </div>
//               <div className="stat-details">
//                 <span className="stat-value">{stats.pendingRequests}</span>
//                 <span className="stat-label">Pending</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="section">
//           <div className="section-header">
//             <h2>
//               <i className="fas fa-bolt"></i>
//               Quick Actions
//             </h2>
//           </div>
//           <div className="quick-actions-grid">
//             {quickActions.map((action) => (
//               <div
//                 key={action.id}
//                 className="action-card"
//                 onClick={() => navigate(action.path)}
//                 style={{ '--action-color': action.color }}
//               >
//                 {action.badge && (
//                   <span className="action-badge">{action.badge}</span>
//                 )}
//                 <div className="action-icon" style={{ background: action.color }}>
//                   <i className={`fas ${action.icon}`}></i>
//                 </div>
//                 <div className="action-content">
//                   <h3>{action.title}</h3>
//                   <p>{action.description}</p>
//                   {action.stats && (
//                     <div className="action-stat">
//                       <span className="action-stat-value">{action.stats}</span>
//                       <span className="action-stat-label">employees</span>
//                     </div>
//                   )}
//                 </div>
//                 <div className="action-arrow">
//                   <i className="fas fa-arrow-right"></i>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Admin Modules */}
//         <div className="section">
//           <div className="section-header">
//             <h2>
//               <i className="fas fa-th-large"></i>
//               Management Modules
//             </h2>
//           </div>
//           <div className="modules-grid">
//             {adminModules.map((module) => (
//               <div
//                 key={module.id}
//                 className="module-card"
//                 onClick={() => navigate(module.path)}
//                 style={{ '--module-color': module.color }}
//               >
//                 <div className="module-icon" style={{ background: module.color }}>
//                   <i className={`fas ${module.icon}`}></i>
//                 </div>
//                 <div className="module-content">
//                   <h3>{module.title}</h3>
//                   <p>{module.description}</p>
//                   {module.stats && (
//                     <div className="module-stat">
//                       <span className="module-stat-value">{module.stats.value}</span>
//                       <span className="module-stat-label">{module.stats.label}</span>
//                     </div>
//                   )}
//                 </div>
//                 <div className="module-arrow">
//                   <i className="fas fa-chevron-right"></i>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;