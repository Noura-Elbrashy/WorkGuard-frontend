// // src/pages/EmployeeDirectory.jsx
// import { useState, useEffect, useCallback, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { getAllUsers, deleteUser, resendActivation } from '../services/user.api';
// import { getBranches } from '../services/branch.api';
// import { isGlobalAdmin, getTokenPayload } from '../helpers/auth';

// // ─── status helpers ────────────────────────────────────────────────────────────
// const getAccountStatus = (user) => {
//   if (!user.isActive) return 'pending';
//   const last = user.employmentHistory?.at(-1);
//   if (!last) return 'active';
//   return last.status; // active | resigned | terminated | suspended
// };

// const STATUS_META = {
//   active:     { labelKey: 'status.active',      bg: 'success' },
//   pending:    { labelKey: 'status.pending',      bg: 'warning text-dark' },
//   resigned:   { labelKey: 'status.resigned',     bg: 'secondary' },
//   terminated: { labelKey: 'status.terminated',   bg: 'danger' },
//   suspended:  { labelKey: 'status.suspended',    bg: 'dark' },
// };

// const ROLE_META = {
//   staff:  { labelKey: 'role.staff',        bg: 'info text-dark' },
//   admin:  { labelKey: 'role.admin',        bg: 'primary' },
// };

// const SCOPE_META = {
//   GLOBAL: { labelKey: 'scope.global', bg: 'danger' },
//   BRANCH: { labelKey: 'scope.branch', bg: 'warning text-dark' },
// };

// // ─── component ────────────────────────────────────────────────────────────────
// export default function EmployeeDirectory() {
//   const { t, i18n }  = useTranslation();
//   const navigate      = useNavigate();
//   const isRTL         = i18n.dir() === 'rtl';
//   const isGlobal      = isGlobalAdmin();
//   const payload       = getTokenPayload();
//   const adminScope    = payload?.adminScope || null;

//   // ── filters state ──────────────────────────────────────────────────────────
//   const [filters, setFilters] = useState({
//     name:   '',
//     branch: '',
//     role:   '',
//     status: 'all',
//     page:   1,
//     limit:  10,
//   });
//   const [debouncedName, setDebouncedName] = useState('');
//   const nameTimer = useRef(null);

//   // ── data state ─────────────────────────────────────────────────────────────
//   const [users,      setUsers]      = useState([]);
//   const [total,      setTotal]      = useState(0);
//   const [totalPages, setTotalPages] = useState(1);
//   const [branches,   setBranches]   = useState([]);
//   const [loading,    setLoading]    = useState(true);
//   const [toast,      setToast]      = useState(null);

//   // ── confirm dialog ─────────────────────────────────────────────────────────
//   const [confirm, setConfirm] = useState(null); // { type, userId, userName }

//   // ── fetch branches once ────────────────────────────────────────────────────
//   useEffect(() => {
//     getBranches().then(res => {
//       const all = res.data?.branches || res.data || [];
//       if (!isGlobal && adminScope?.branches?.length) {
//         const allowed = adminScope.branches.map(String);
//         setBranches(all.filter(b => allowed.includes(String(b._id))));
//       } else {
//         setBranches(all);
//       }
//     }).catch(() => {});
//   }, []);

//   // ── debounce name ──────────────────────────────────────────────────────────
//   const handleNameChange = (val) => {
//     setFilters(p => ({ ...p, name: val, page: 1 }));
//     clearTimeout(nameTimer.current);
//     nameTimer.current = setTimeout(() => setDebouncedName(val), 400);
//   };

//   // ── fetch users ────────────────────────────────────────────────────────────
//   const fetchUsers = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params = {
//         page:   filters.page,
//         limit:  filters.limit,
//         status: filters.status,
//       };
//       if (debouncedName)   params.name   = debouncedName;
//       if (filters.branch)  params.branch = filters.branch;
//       if (filters.role)    params.role   = filters.role;

//       const res = await getAllUsers(params);
//       setUsers(res.data?.users || []);
//       setTotal(res.data?.totalUsers || 0);
//       setTotalPages(res.data?.totalPages || 1);
//     } catch {
//       showToast('error', t('error'));
//     } finally {
//       setLoading(false);
//     }
//   }, [filters.page, filters.limit, filters.branch, filters.role, filters.status, debouncedName]);

//   useEffect(() => { fetchUsers(); }, [fetchUsers]);

//   // ── helpers ────────────────────────────────────────────────────────────────
//   const showToast = (type, msg) => {
//     setToast({ type, msg });
//     setTimeout(() => setToast(null), 4000);
//   };

//   const setFilter = (key, val) =>
//     setFilters(p => ({ ...p, [key]: val, page: 1 }));

//   // ── actions ────────────────────────────────────────────────────────────────
//   const handleDelete = async (userId) => {
//     try {
//       await deleteUser(userId);
//       showToast('success', t('deleteSuccess', 'تم الحذف بنجاح'));
//       fetchUsers();
//     } catch (err) {
//       showToast('error', err.response?.data?.message || t('error'));
//     } finally {
//       setConfirm(null);
//     }
//   };

//   const handleResend = async (userId) => {
//     try {
//       await resendActivation(userId);
//       showToast('success', t('activationResent', 'تم إعادة إرسال رابط التفعيل'));
//     } catch (err) {
//       showToast('error', err.response?.data?.message || t('error'));
//     } finally {
//       setConfirm(null);
//     }
//   };

//   // ── can edit/delete target user ────────────────────────────────────────────
//   const canModify = (user) => {
//     // Branch admin لا يقدر يعدل/يحذف admin
//     if (!isGlobal && user.role === 'admin') return false;
//     return true;
//   };

//   // ── pagination ─────────────────────────────────────────────────────────────
//   const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

//   // ── role filter options ────────────────────────────────────────────────────
//   // Branch admin لا يشوف filter الـ admin scope
//   const roleOptions = [
//     { value: '',      label: t('allRoles', 'كل الأدوار') },
//     { value: 'staff', label: t('role.staff', 'موظف') },
//     { value: 'admin', label: t('role.admin', 'مسؤول') },
//   ];

//   const statusOptions = [
//     { value: 'all',       label: t('allStatuses', 'كل الحالات') },
//     { value: 'active',    label: t('status.active', 'نشط') },
//     { value: 'pending',   label: t('status.pending', 'في انتظار التفعيل') },
//     { value: 'former',    label: t('status.former', 'سابق') },
//   ];

//   // ─────────────────────────────────────────────────────────────────────────
//   return (
//     <div className="container-fluid py-4" dir={isRTL ? 'rtl' : 'ltr'}>

//       {/* Toast */}
//       {toast && (
//         <div
//           className={`alert alert-${toast.type === 'success' ? 'success' : 'danger'} alert-dismissible position-fixed top-0 end-0 m-3`}
//           style={{ zIndex: 9999, minWidth: 280 }}
//         >
//           {toast.msg}
//           <button className="btn-close" onClick={() => setToast(null)} />
//         </div>
//       )}

//       {/* Confirm dialog */}
//       {confirm && (
//         <div className="modal d-block" style={{ background: 'rgba(0,0,0,.5)', zIndex: 9998 }}>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">
//                   {confirm.type === 'delete'
//                     ? t('confirmDelete', 'تأكيد الحذف')
//                     : t('confirmResend', 'إعادة إرسال رابط التفعيل')}
//                 </h5>
//                 <button className="btn-close" onClick={() => setConfirm(null)} />
//               </div>
//               <div className="modal-body">
//                 {confirm.type === 'delete'
//                   ? t('confirmDeleteMsg', `هل تريد حذف الموظف "${confirm.userName}"؟ لا يمكن التراجع عن هذا الإجراء.`)
//                   : t('confirmResendMsg', `إعادة إرسال رابط التفعيل إلى "${confirm.userName}"؟`)}
//               </div>
//               <div className="modal-footer">
//                 <button className="btn btn-secondary" onClick={() => setConfirm(null)}>
//                   {t('cancel', 'إلغاء')}
//                 </button>
//                 <button
//                   className={`btn ${confirm.type === 'delete' ? 'btn-danger' : 'btn-primary'}`}
//                   onClick={() =>
//                     confirm.type === 'delete'
//                       ? handleDelete(confirm.userId)
//                       : handleResend(confirm.userId)
//                   }
//                 >
//                   {confirm.type === 'delete'
//                     ? t('delete', 'حذف')
//                     : t('resend', 'إرسال')}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Header ─────────────────────────────────────────────────────────── */}
//       <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
//         <div>
//           <h2 className="mb-0 fw-bold">{t('employeeDirectory', 'دليل الموظفين')}</h2>
//           <p className="text-muted small mb-0">
//             {t('employeeDirectoryDesc', 'عرض وإدارة ملفات الموظفين')}
//             {!loading && (
//               <span className="ms-2 badge bg-secondary">{total} {t('employee', 'موظف')}</span>
//             )}
//           </p>
//         </div>
//         <button
//           className="btn btn-primary"
//           onClick={() => navigate('/add-employee')}
//         >
//           <i className="fas fa-user-plus me-2" />
//           {t('addEmployee', 'إضافة موظف')}
//         </button>
//       </div>

//       {/* ── Filters ────────────────────────────────────────────────────────── */}
//       <div className="card mb-4 border-0 shadow-sm">
//         <div className="card-body">
//           <div className="row g-3">

//             {/* Search by name */}
//             <div className="col-12 col-md-4">
//               <label className="form-label small fw-semibold text-muted">
//                 <i className="fas fa-search me-1" />{t('searchByName', 'بحث بالاسم')}
//               </label>
//               <input
//                 className="form-control"
//                 placeholder={t('searchPlaceholder', 'اكتب اسم الموظف...')}
//                 value={filters.name}
//                 onChange={e => handleNameChange(e.target.value)}
//               />
//             </div>

//             {/* Branch filter */}
//             <div className="col-6 col-md-3">
//               <label className="form-label small fw-semibold text-muted">
//                 <i className="fas fa-building me-1" />{t('branch', 'الفرع')}
//               </label>
//               <select
//                 className="form-select"
//                 value={filters.branch}
//                 onChange={e => setFilter('branch', e.target.value)}
//               >
//                 <option value="">{t('allBranches', 'كل الفروع')}</option>
//                 {branches.map(b => (
//                   <option key={b._id} value={b._id}>{b.name}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Role filter */}
//             <div className="col-6 col-md-2">
//               <label className="form-label small fw-semibold text-muted">
//                 <i className="fas fa-user-tag me-1" />{t('role', 'الدور')}
//               </label>
//               <select
//                 className="form-select"
//                 value={filters.role}
//                 onChange={e => setFilter('role', e.target.value)}
//               >
//                 {roleOptions.map(o => (
//                   <option key={o.value} value={o.value}>{o.label}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Status filter */}
//             <div className="col-6 col-md-2">
//               <label className="form-label small fw-semibold text-muted">
//                 <i className="fas fa-circle me-1" />{t('status', 'الحالة')}
//               </label>
//               <select
//                 className="form-select"
//                 value={filters.status}
//                 onChange={e => setFilter('status', e.target.value)}
//               >
//                 {statusOptions.map(o => (
//                   <option key={o.value} value={o.value}>{o.label}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Limit */}
//             <div className="col-6 col-md-1">
//               <label className="form-label small fw-semibold text-muted">
//                 {t('perPage', 'لكل صفحة')}
//               </label>
//               <select
//                 className="form-select"
//                 value={filters.limit}
//                 onChange={e => setFilters(p => ({ ...p, limit: +e.target.value, page: 1 }))}
//               >
//                 {[10, 25, 50].map(n => (
//                   <option key={n} value={n}>{n}</option>
//                 ))}
//               </select>
//             </div>

//           </div>
//         </div>
//       </div>

//       {/* ── Table ──────────────────────────────────────────────────────────── */}
//       <div className="card border-0 shadow-sm">
//         <div className="card-body p-0">
//           {loading ? (
//             <div className="d-flex justify-content-center align-items-center py-5">
//               <div className="spinner-border text-primary me-3" />
//               <span className="text-muted">{t('loading', 'جاري التحميل...')}</span>
//             </div>
//           ) : users.length === 0 ? (
//             <div className="text-center py-5 text-muted">
//               <i className="fas fa-users fa-3x mb-3 d-block opacity-25" />
//               <p className="mb-0">{t('noEmployees', 'لا يوجد موظفون مطابقون للفلتر')}</p>
//             </div>
//           ) : (
//             <div className="table-responsive">
//               <table className="table table-hover align-middle mb-0">
//                 <thead className="table-light">
//                   <tr>
//                     <th style={{ width: 44 }}>#</th>
//                     <th>{t('name', 'الاسم')}</th>
//                     <th>{t('email', 'البريد')}</th>
//                     <th>{t('branch', 'الفرع')}</th>
//                     <th>{t('role', 'الدور')}</th>
//                     <th>{t('accountStatus', 'حالة الحساب')}</th>
//                     <th>{t('employmentStatus', 'حالة التوظيف')}</th>
//                     <th className="text-center">{t('actions', 'الإجراءات')}</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map((user, idx) => {
//                     const acctStatus   = getAccountStatus(user);
//                     const statusMeta   = STATUS_META[acctStatus]   || STATUS_META.active;
//                     const roleMeta     = ROLE_META[user.role]       || ROLE_META.staff;
//                     const scopeMeta    = user.role === 'admin' && user.adminScope?.type
//                       ? SCOPE_META[user.adminScope.type]
//                       : null;
//                     const isPending    = !user.isActive;
//                     const isFormer     = ['resigned','terminated','suspended'].includes(
//                       user.employmentHistory?.at(-1)?.status
//                     );
//                     const employStatus = user.employmentHistory?.at(-1)?.status || 'active';
//                     const canAct       = canModify(user);

//                     return (
//                       <tr key={user._id} className={isFormer ? 'table-secondary opacity-75' : ''}>

//                         {/* # */}
//                         <td className="text-muted small">
//                           {(filters.page - 1) * filters.limit + idx + 1}
//                         </td>

//                         {/* Name */}
//                         <td>
//                           <div className="d-flex align-items-center gap-2">
//                             <div
//                               className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
//                               style={{
//                                 width: 36, height: 36, fontSize: 13,
//                                 background: user.role === 'admin' ? '#0d6efd' : '#6c757d'
//                               }}
//                             >
//                               {user.name?.charAt(0)?.toUpperCase() || '?'}
//                             </div>
//                             <div>
//                               <div className="fw-semibold" style={{ fontSize: 14 }}>{user.name}</div>
//                               {scopeMeta && (
//                                 <span className={`badge bg-${scopeMeta.bg} mt-1`} style={{ fontSize: 10 }}>
//                                   {t(scopeMeta.labelKey, scopeMeta.labelKey)}
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </td>

//                         {/* Email */}
//                         <td>
//                           <span className="text-muted small">{user.email}</span>
//                         </td>

//                         {/* Branch */}
//                         <td>
//                           <div className="d-flex flex-wrap gap-1">
//                             {user.branches?.length
//                               ? user.branches.map(b => (
//                                   <span key={b._id || b} className="badge bg-light text-dark border" style={{ fontSize: 11 }}>
//                                     {b.name || b}
//                                   </span>
//                                 ))
//                               : <span className="text-muted small">—</span>
//                             }
//                           </div>
//                         </td>

//                         {/* Role */}
//                         <td>
//                           <span className={`badge bg-${roleMeta.bg}`} style={{ fontSize: 11 }}>
//                             {t(roleMeta.labelKey, user.role)}
//                           </span>
//                         </td>

//                         {/* Account Status (فعّل حسابه ولا لأ) */}
//                         <td>
//                           {isPending ? (
//                             <span className="badge bg-warning text-dark" style={{ fontSize: 11 }}>
//                               <i className="fas fa-clock me-1" />
//                               {t('status.pending', 'لم يُفعَّل')}
//                             </span>
//                           ) : (
//                             <span className="badge bg-success" style={{ fontSize: 11 }}>
//                               <i className="fas fa-check me-1" />
//                               {t('status.activated', 'مُفعَّل')}
//                             </span>
//                           )}
//                         </td>

//                         {/* Employment Status */}
//                         <td>
//                           <span className={`badge bg-${STATUS_META[employStatus]?.bg || 'secondary'}`} style={{ fontSize: 11 }}>
//                             {t(`status.${employStatus}`, employStatus)}
//                           </span>
//                         </td>

//                         {/* Actions */}
//                         <td>
//                           <div className="d-flex gap-1 justify-content-center flex-wrap">

//                             {/* View Profile */}
//                             <button
//                               className="btn btn-sm btn-outline-secondary"
//                               title={t('viewProfile', 'عرض الملف')}
//                               onClick={() => navigate(`/profile/${user._id}`)}
//                             >
//                               <i className="fas fa-eye" />
//                             </button>

//                             {/* Edit — فقط لو canAct */}
//                             {canAct && (
//                               <button
//                                 className="btn btn-sm btn-outline-primary"
//                                 title={t('edit', 'تعديل')}
//                                 onClick={() => navigate(`/admin/employees/${user._id}/edit`)}
//                               >
//                                 <i className="fas fa-edit" />
//                               </button>
//                             )}

//                             {/* Resend Activation — فقط لو pending */}
//                             {isPending && canAct && (
//                               <button
//                                 className="btn btn-sm btn-outline-warning"
//                                 title={t('resendActivation', 'إعادة إرسال التفعيل')}
//                                 onClick={() => setConfirm({
//                                   type: 'resend',
//                                   userId: user._id,
//                                   userName: user.name
//                                 })}
//                               >
//                                 <i className="fas fa-paper-plane" />
//                               </button>
//                             )}

//                             {/* Delete — فقط لو canAct */}
//                             {canAct && (
//                               <button
//                                 className="btn btn-sm btn-outline-danger"
//                                 title={t('delete', 'حذف')}
//                                 onClick={() => setConfirm({
//                                   type: 'delete',
//                                   userId: user._id,
//                                   userName: user.name
//                                 })}
//                               >
//                                 <i className="fas fa-trash" />
//                               </button>
//                             )}

//                           </div>
//                         </td>

//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* ── Pagination ───────────────────────────────────────────────────── */}
//         {!loading && totalPages > 1 && (
//           <div className="card-footer d-flex align-items-center justify-content-between flex-wrap gap-2">
//             <span className="text-muted small">
//               {t('showingPage', 'الصفحة')} {filters.page} {t('of', 'من')} {totalPages}
//               {' · '}{total} {t('total', 'إجمالي')}
//             </span>
//             <nav>
//               <ul className="pagination pagination-sm mb-0">
//                 <li className={`page-item ${filters.page === 1 ? 'disabled' : ''}`}>
//                   <button className="page-link"
//                     onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}>
//                     {isRTL ? '›' : '‹'}
//                   </button>
//                 </li>

//                 {pages.map(p => (
//                   <li key={p} className={`page-item ${p === filters.page ? 'active' : ''}`}>
//                     <button className="page-link"
//                       onClick={() => setFilters(prev => ({ ...prev, page: p }))}>
//                       {p}
//                     </button>
//                   </li>
//                 ))}

//                 <li className={`page-item ${filters.page === totalPages ? 'disabled' : ''}`}>
//                   <button className="page-link"
//                     onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}>
//                     {isRTL ? '‹' : '›'}
//                   </button>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//         )}
//       </div>

//     </div>
//   );
// }


// src/pages/EmployeeDirectory.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAllUsers, deleteUser } from '../services/user.api';
import { resendActivation } from '../services/auth.api';

import { getBranches } from '../services/branch.api';
import { isGlobalAdmin, getTokenPayload } from '../helpers/auth';
import '../style/Employeedirectory.css';

// ─── الفرونت عرض فقط — كل الفلترة والـ pagination من الباك ───────────────────

const ROLE_META = {
  staff: { labelKey: 'EmployeeDirectory.roleStaff', bg: 'info text-dark' },
  admin: { labelKey: 'EmployeeDirectory.roleAdmin', bg: 'primary' },
};

const SCOPE_META = {
  GLOBAL: { labelKey: 'EmployeeDirectory.scopeGlobal', bg: 'danger' },
  BRANCH: { labelKey: 'EmployeeDirectory.scopeBranch', bg: 'warning text-dark' },
};

const EMP_STATUS_META = {
  active:     { labelKey: 'EmployeeDirectory.statusActive',     bg: 'success' },
  resigned:   { labelKey: 'EmployeeDirectory.statusResigned',   bg: 'secondary' },
  terminated: { labelKey: 'EmployeeDirectory.statusTerminated', bg: 'danger' },
  suspended:  { labelKey: 'EmployeeDirectory.statusSuspended',  bg: 'dark' },
};

const getAccountBadge = (user, t) =>
  !user.isActive ? (
    <span className="badge bg-warning text-dark" style={{ fontSize: 11 }}>
      <i className="fas fa-clock me-1" />
      {t('EmployeeDirectory.accountPending')}
    </span>
  ) : (
    <span className="badge bg-success" style={{ fontSize: 11 }}>
      <i className="fas fa-check me-1" />
      {t('EmployeeDirectory.accountActivated')}
    </span>
  );

// ─── component ────────────────────────────────────────────────────────────────
export default function EmployeeDirectory() {
  const { t, i18n } = useTranslation();
  const navigate     = useNavigate();
  const isRTL        = i18n.dir() === 'rtl';
  const isGlobal     = isGlobalAdmin();
  const payload      = getTokenPayload();
  const adminScope   = payload?.adminScope || null;

  const [filters, setFilters] = useState({
    name: '', branch: '', role: '', status: '', page: 1, limit: 10,
  });
  const [debouncedName, setDebouncedName] = useState('');
  const nameTimer = useRef(null);

  const [users,      setUsers]      = useState([]);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [branches,   setBranches]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [toast,      setToast]      = useState(null);
  const [confirm,    setConfirm]    = useState(null);

  // ── branches (scoped) ──────────────────────────────────────────────────────
  useEffect(() => {
    getBranches()
      .then(res => {
        const all = res.data?.branches || res.data || [];
        if (!isGlobal && adminScope?.branches?.length) {
          const allowed = adminScope.branches.map(String);
          setBranches(all.filter(b => allowed.includes(String(b._id))));
        } else {
          setBranches(all);
        }
      })
      .catch(() => {});
  }, []);

  // ── debounce name ──────────────────────────────────────────────────────────
  const handleNameChange = (val) => {
    setFilters(p => ({ ...p, name: val, page: 1 }));
    clearTimeout(nameTimer.current);
    nameTimer.current = setTimeout(() => setDebouncedName(val), 400);
  };

  // ── fetch — الباك يفلتر ويـ paginate ──────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: filters.page, limit: filters.limit };
      if (debouncedName)  params.name   = debouncedName;
      if (filters.branch) params.branch = filters.branch;
      if (filters.role)   params.role   = filters.role;
      if (filters.status) params.status = filters.status;

      const res = await getAllUsers(params);
      setUsers(res.data?.users      || []);
      setTotal(res.data?.totalUsers || 0);
      setTotalPages(res.data?.totalPages || 1);
    } catch {
      showToast('error', t('error'));
    } finally {
      setLoading(false);
    }
  }, [filters.page, filters.limit, filters.branch, filters.role, filters.status, debouncedName]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // ── helpers ────────────────────────────────────────────────────────────────
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };
  const setFilter = (key, val) => setFilters(p => ({ ...p, [key]: val, page: 1 }));
  const canModify = (user) => isGlobal || user.role !== 'admin';

  // ── actions ────────────────────────────────────────────────────────────────
  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      showToast('success', t('EmployeeDirectory.deleteSuccess'));
      fetchUsers();
    } catch (err) {
      showToast('error', err.response?.data?.message || t('error'));
    } finally { setConfirm(null); }
  };

  const handleResend = async (userId) => {
    try {
      await resendActivation(userId);
      showToast('success', t('EmployeeDirectory.activationResent'));
    } catch (err) {
      showToast('error', err.response?.data?.message || t('error'));
    } finally { setConfirm(null); }
  };

  // ── pagination ─────────────────────────────────────────────────────────────
  const getPageNums = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const cur = filters.page;
    const nums = new Set([1, totalPages, cur, cur-1, cur+1, cur-2, cur+2]);
    return [...nums].filter(n => n >= 1 && n <= totalPages).sort((a, b) => a - b);
  };

  const statusOptions = [
    { value: '',           label: t('EmployeeDirectory.allStatuses') },
    { value: 'active',     label: t('EmployeeDirectory.statusActive') },
    { value: 'resigned',   label: t('EmployeeDirectory.statusResigned') },
    { value: 'terminated', label: t('EmployeeDirectory.statusTerminated') },
    { value: 'suspended',  label: t('EmployeeDirectory.statusSuspended') },
  ];

  const roleOptions = [
    { value: '',      label: t('EmployeeDirectory.allRoles') },
    { value: 'staff', label: t('EmployeeDirectory.roleStaff') },
    { value: 'admin', label: t('EmployeeDirectory.roleAdmin') },
  ];

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="employee-directory" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* Toast */}
      {toast && (
        <div className={`dir-toast alert alert-${toast.type === 'success' ? 'success' : 'danger'} alert-dismissible mb-0`}>
          {toast.msg}
          <button className="btn-close" onClick={() => setToast(null)} />
        </div>
      )}

      {/* Confirm */}
      {confirm && (
        <div className="confirm-overlay" onClick={() => setConfirm(null)}>
          <div className="confirm-box" onClick={e => e.stopPropagation()}>
            <h5>
              {confirm.type === 'delete'
                ? t('EmployeeDirectory.confirmDelete')
                : t('EmployeeDirectory.confirmResend')}
            </h5>
            <p className="text-muted mb-0">
              {confirm.type === 'delete'
                ? t('EmployeeDirectory.confirmDeleteMsg', { name: confirm.userName })
                : t('EmployeeDirectory.confirmResendMsg', { name: confirm.userName })}
            </p>
            <div className="confirm-actions">
              <button className="btn btn-secondary" onClick={() => setConfirm(null)}>
                {t('cancel')}
              </button>
              <button
                className={`btn ${confirm.type === 'delete' ? 'btn-danger' : 'btn-primary'}`}
                onClick={() => confirm.type === 'delete'
                  ? handleDelete(confirm.userId)
                  : handleResend(confirm.userId)}
              >
                {confirm.type === 'delete' ? t('delete') : t('resend')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="directory-header">
        <div>
          <h2 className="directory-title">{t('EmployeeDirectory.title')}</h2>
          <p className="directory-subtitle">
            {t('EmployeeDirectory.subtitle')}
            {!loading && (
              <span className="badge bg-secondary ms-2">
                {total} {t('EmployeeDirectory.employee')}
              </span>
            )}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/admin/employees/add')}>
          <i className="fas fa-user-plus me-2" />{t('addEmployee')}
        </button>
      </div>

      {/* Filters */}
      <div className="filters-card">
        <div className="row g-3">

          <div className="col-12 col-md-4">
            <div className="filter-label"><i className="fas fa-search me-1" />{t('EmployeeDirectory.searchByName')}</div>
            <input className="form-control"
              placeholder={t('EmployeeDirectory.searchPlaceholder')}
              value={filters.name}
              onChange={e => handleNameChange(e.target.value)} />
          </div>

          <div className="col-6 col-md-3">
            <div className="filter-label"><i className="fas fa-building me-1" />{t('branch')}</div>
            <select className="form-select" value={filters.branch}
              onChange={e => setFilter('branch', e.target.value)}>
              <option value="">{t('EmployeeDirectory.allBranches')}</option>
              {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>

          <div className="col-6 col-md-2">
            <div className="filter-label"><i className="fas fa-user-tag me-1" />{t('role')}</div>
            <select className="form-select" value={filters.role}
              onChange={e => setFilter('role', e.target.value)}>
              {roleOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="col-6 col-md-2">
            <div className="filter-label"><i className="fas fa-briefcase me-1" />{t('EmployeeDirectory.employmentStatus')}</div>
            <select className="form-select" value={filters.status}
              onChange={e => setFilter('status', e.target.value)}>
              {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="col-6 col-md-1">
            <div className="filter-label">{t('EmployeeDirectory.perPage')}</div>
            <select className="form-select" value={filters.limit}
              onChange={e => setFilters(p => ({ ...p, limit: +e.target.value, page: 1 }))}>
              {[10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        {loading ? (
          <div className="directory-loading">
            <div className="spinner-border text-primary mb-3" />
            <span>{t('loading')}</span>
          </div>
        ) : users.length === 0 ? (
          <div className="directory-empty">
            <i className="fas fa-users" />
            <p>{t('EmployeeDirectory.noEmployees')}</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table directory-table">
              <thead>
                <tr>
                  <th style={{ width: 44 }}>#</th>
                  <th>{t('name')}</th>
                  <th>{t('email')}</th>
                  <th>{t('branch')}</th>
                  <th>{t('role')}</th>
                  <th>{t('EmployeeDirectory.accountStatus')}</th>
                  <th>{t('EmployeeDirectory.employmentStatus')}</th>
                  <th className="text-center">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => {
                  const empStatus = user.employmentHistory?.at(-1)?.status || 'active';
                  const empMeta   = EMP_STATUS_META[empStatus] || EMP_STATUS_META.active;
                  const roleMeta  = ROLE_META[user.role] || ROLE_META.staff;
                  const scopeMeta = user.role === 'admin' && user.adminScope?.type
                    ? SCOPE_META[user.adminScope.type] : null;
                  const isFormer  = ['resigned','terminated','suspended'].includes(empStatus);
                  const canAct    = canModify(user);

                  return (
                    <tr key={user._id} className={isFormer ? 'row-former' : ''}>

                      <td className="text-muted small">
                        {(filters.page - 1) * filters.limit + idx + 1}
                      </td>

                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className={`user-avatar ${user.role}`}>
                            {user.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <div className="user-name">{user.name}</div>
                            {scopeMeta && (
                              <span className={`badge bg-${scopeMeta.bg}`} style={{ fontSize: 10 }}>
                                {t(scopeMeta.labelKey)}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="text-muted small">{user.email}</td>

                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {user.branches?.length
                            ? user.branches.map(b => (
                                <span key={b._id || b} className="branch-badge">{b.name || b}</span>
                              ))
                            : <span className="text-muted">—</span>}
                        </div>
                      </td>

                      <td>
                        <span className={`badge bg-${roleMeta.bg}`} style={{ fontSize: 11 }}>
                          {t(roleMeta.labelKey)}
                        </span>
                      </td>

                      <td>{getAccountBadge(user, t)}</td>

                      <td>
                        <span className={`badge bg-${empMeta.bg}`} style={{ fontSize: 11 }}>
                          {t(empMeta.labelKey)}
                        </span>
                      </td>

                      <td>
                        <div className="d-flex gap-1 justify-content-center">

                          <button className="action-btn btn btn-sm btn-outline-secondary"
                            title={t('EmployeeDirectory.viewProfile')}
                            onClick={() => navigate(`/profile/${user._id}`)}>
                            <i className="fas fa-eye" />
                          </button>

                          {canAct && (
                            <button className="action-btn btn btn-sm btn-outline-primary"
                              title={t('EmployeeDirectory.edit')}
                              onClick={() => navigate(`/admin/employees/${user._id}/edit`)}>
                              <i className="fas fa-edit" />
                            </button>
                          )}

                          {!user.isActive && canAct && (
                            <button className="action-btn btn btn-sm btn-outline-warning"
                              title={t('EmployeeDirectory.resendActivation')}
                              onClick={() => setConfirm({ type: 'resend', userId: user._id, userName: user.name })}>
                              <i className="fas fa-paper-plane" />
                            </button>
                          )}

                          {canAct && (
                            <button className="action-btn btn btn-sm btn-outline-danger"
                              title={t('EmployeeDirectory.delete')}
                              onClick={() => setConfirm({ type: 'delete', userId: user._id, userName: user.name })}>
                              <i className="fas fa-trash" />
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="directory-footer">
            <span>
              {t('EmployeeDirectory.showingPage')} {filters.page} {t('of')} {totalPages}
              {' · '}{total} {t('EmployeeDirectory.total')}
            </span>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${filters.page === 1 ? 'disabled' : ''}`}>
                  <button className="page-link"
                    onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}>
                    {isRTL ? '›' : '‹'}
                  </button>
                </li>
                {getPageNums().map((p, i, arr) => (
                  <span key={p}>
                    {i > 0 && arr[i] - arr[i-1] > 1 && (
                      <li className="page-item disabled"><span className="page-link">…</span></li>
                    )}
                    <li className={`page-item ${p === filters.page ? 'active' : ''}`}>
                      <button className="page-link"
                        onClick={() => setFilters(prev => ({ ...prev, page: p }))}>
                        {p}
                      </button>
                    </li>
                  </span>
                ))}
                <li className={`page-item ${filters.page === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link"
                    onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}>
                    {isRTL ? '‹' : '›'}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

    </div>
  );
}