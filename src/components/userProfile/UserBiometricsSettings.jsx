//UserBiometricsSettings.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiPut } from '../../helpers/api';
import Toast from '../ui/Toast';

const UserBiometricsSettings = ({ user, isAdmin, onUpdated }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(
    user?.securitySettings?.requireBiometrics ?? false
  );
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  if (!user) return null;

  const toggle = async () => {
    const prev = enabled;
    const next = !prev;
    setEnabled(next);
    setLoading(true);
    try {
      await apiPut(`/users/${user._id}/biometrics/require`, { requireBiometrics: next });
      setToast({ show: true, type: 'success', message: next ? t('biometrics.toastEnabled') : t('biometrics.toastDisabled') });
      onUpdated?.();
    } catch {
      setEnabled(prev);
      setToast({ show: true, type: 'error', message: t('common.error') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between py-2">
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#1e293b' }}>
            <i className="fa-solid fa-fingerprint me-2" style={{ color: '#6366f1' }} />
            {t('biometrics.requirement')}
          </div>
          {user.biometricsLastVerifiedAt && (
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 2 }}>
              {t('biometrics.lastVerified')}: {new Date(user.biometricsLastVerifiedAt).toLocaleString()}
            </div>
          )}
        </div>

        {isAdmin ? (
          /* ── Toggle switch ── */
          <button
            onClick={toggle}
            disabled={loading}
            style={{
              position: 'relative', width: 44, height: 24, borderRadius: 12,
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: enabled ? '#6366f1' : '#cbd5e1',
              transition: 'background 0.2s', flexShrink: 0,
            }}
            title={enabled ? t('common.enabled') : t('common.disabled')}
          >
            <span style={{
              position: 'absolute', top: 3, left: enabled ? 23 : 3,
              width: 18, height: 18, borderRadius: '50%', background: '#fff',
              transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </button>
        ) : (
          <span style={{
            fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: 20,
            background: enabled ? '#ede9fe' : '#f1f5f9',
            color: enabled ? '#6d28d9' : '#475569',
          }}>
            {enabled ? t('common.enabled') : t('common.disabled')}
          </span>
        )}
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(p => ({ ...p, show: false }))}
      />
    </>
  );
};

export default UserBiometricsSettings;
// export default UserBiometricsSettings;
// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { apiPut } from '../../helpers/api';

// const UserBiometricsSettings = ({ user, isAdmin, onUpdated }) => {
//   const { t } = useTranslation();

//   const [loading, setLoading] = useState(false);
//   const [toast, setToast] = useState({
//     show: false,
//     message: '',
//     variant: 'success'
//   });

//   const [localRequireBiometrics, setLocalRequireBiometrics] = useState(
//     user.securitySettings?.requireBiometrics ?? false
//     );
//   if (!user) return null;

//   const requireBiometrics = localRequireBiometrics;
//   const toggleBiometrics = async () => {
//     const previousValue = localRequireBiometrics;
//     const newValue = !previousValue;
//     setLocalRequireBiometrics(newValue);
    
//     try {
//       setLoading(true);

//       await apiPut(`/users/${user._id}/biometrics/require`, {
//         requireBiometrics: newValue
//       });

//       setToast({
//         show: true,
//         variant: 'success',
//         message: newValue
//           ? t('biometrics.toastEnabled')
//           : t('biometrics.toastDisabled')
//       });

//       onUpdated?.();
//     } catch (err) {
//       console.error(err);
//         setLocalRequireBiometrics(previousValue); 
//       setToast({
//         show: true,
//         variant: 'danger',
//         message: t('common.error')
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="card mb-3 shadow-sm">
//         <div className="card-header fw-semibold d-flex align-items-center gap-2">
//           🔐 {t('biometrics.title')}
//         </div>

//         <div className="card-body">
//           {/* Status */}
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <div>
//               <div className="fw-semibold">
//                 {t('biometrics.requirement')}
//               </div>
//               <div className="text-muted small">
//                 {t('biometrics.description')}
//               </div>
//             </div>

//             {isAdmin ? (
//               <button
//                 className={`btn btn-sm ${
//                   requireBiometrics
//                     ? 'btn-success'
//                     : 'btn-outline-secondary'
//                 }`}
//                 disabled={loading}
//                 onClick={toggleBiometrics}
//               >
//                 {requireBiometrics
//                   ? t('common.enabled')
//                   : t('common.disabled')}
//               </button>
//             ) : (
//               <span
//                 className={`badge ${
//                   requireBiometrics
//                     ? 'bg-success'
//                     : 'bg-secondary'
//                 }`}
//               >
//                 {requireBiometrics
//                   ? t('common.enabled')
//                   : t('common.disabled')}
//               </span>
//             )}
//           </div>

//           {/* Last verified */}
//           <div className="border-top pt-2 text-muted small">
//             {t('biometrics.lastVerified')}:{' '}
//             {user.biometricsLastVerifiedAt
//               ? new Date(
//                   user.biometricsLastVerifiedAt
//                 ).toLocaleString()
//               : t('biometrics.neverVerified')}
//           </div>
//         </div>
//       </div>

//       {/* Toast */}
//       {toast.show && (
//         <div
//           className={`toast show position-fixed bottom-0 end-0 m-3 text-white bg-${toast.variant}`}
//           role="alert"
//           style={{ zIndex: 9999 }}
//         >
//           <div className="d-flex">
//             <div className="toast-body">
//               {toast.message}
//             </div>
//             <button
//               type="button"
//               className="btn-close btn-close-white me-2 m-auto"
//               onClick={() =>
//                 setToast({ ...toast, show: false })
//               }
//             />
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default UserBiometricsSettings;
