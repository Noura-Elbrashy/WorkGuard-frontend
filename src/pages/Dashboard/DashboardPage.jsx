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
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../style/dashboard.css';
import RemotePermission from '../RemotePermission';

const DashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const adminMenuItems = [
    {
      id: 'holidays',
      title: 'Holidays Management',
      titleAr: 'إدارة الإجازات',
      description: 'Manage company-wide and employee-specific holidays',
      descriptionAr: 'إدارة الإجازات الرسمية للشركة والموظفين',
      icon: 'fa-calendar-alt',
      color: '#667eea',
      path: '/admin/holidays'
    },
    {
      id: 'payroll',
      title: 'Payroll Management',
      titleAr: 'إدارة الرواتب',
      description: 'View and manage employee payrolls',
      descriptionAr: 'عرض وإدارة رواتب الموظفين',
      icon: 'fa-money-bill-wave',
      color: '#48bb78',
      path: '/payroll'
    },
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
    {
      id: 'leaves',
      title: 'Leave Requests',
      titleAr: 'طلبات الإجازات',
      description: 'Review and approve leave requests',
      descriptionAr: 'مراجعة والموافقة على طلبات الإجازات',
      icon: 'fa-umbrella-beach',
      color: '#ec4899',
      path: '/leaves'
    }
    ,
     {
      id: 'LeavePolicies',
      title: 'Leave Policies',
      titleAr: 'طلبات الإجازات',
      description: 'Manage employee leave policies and entitlements',
      descriptionAr: 'إدارة سياسات واستحقاقات إجازات الموظفين',
      icon: 'fa-file-alt',
      color: '#7f48ec',
      path: '/admin/leave-policies'
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
       {
      id: 'Manage Branches',
      title: 'Manage Branches',
      titleAr: 'ادارة الفروع',
      description: 'Manage and monitor all company branches',
      descriptionAr: 'إدارة ومراقبة جميع فروع الشركة',
      icon: 'fa-building',
      color: '#ec9748',
      path: '/adminbranches'
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



  
  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage your HR system efficiently</p>
          </div>
        </div>

        <div className="dashboard-grid">
          {adminMenuItems.map((item) => (
            <div
              key={item.id}
              className="dashboard-card"
              onClick={() => navigate(item.path)}
              style={{ '--card-color': item.color }}
            >
              <div className="card-icon" style={{ background: item.color }}>
                <i className={`fas ${item.icon}`}></i>
              </div>
              <div className="card-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <div className="card-arrow">
                <i className="fas fa-arrow-right"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;