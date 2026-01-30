// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { apiPut } from '../../helpers/api';

// const UserBiometricsSettings = ({ user, isAdmin, onUpdated }) => {
//   const { t } = useTranslation();
//   const [loading, setLoading] = useState(false);

//   if (!user) return null;

//   const requireBiometrics = user.securitySettings?.requireBiometrics ?? false;

//   const toggleBiometrics = async () => {
//     try {
//       setLoading(true);

//       await apiPut(`/users/${user._id}/biometrics/require`, {
//         requireBiometrics: !requireBiometrics
//       });

//       onUpdated?.(); // reload user profile
//     } catch (err) {
//       console.error(err);
//       alert(t('common.error'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="card mb-3">
//       <div className="card-header fw-semibold">
//         🔐 {t('biometrics.title')}
//       </div>

//       <div className="card-body">
//         {/* Requirement */}
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <span className="fw-semibold">
//             {t('biometrics.requirement')}
//           </span>

//           {isAdmin ? (
//             <button
//               className={`btn btn-sm ${
//                 requireBiometrics ? 'btn-success' : 'btn-outline-secondary'
//               }`}
//               disabled={loading}
//               onClick={toggleBiometrics}
//             >
//               {requireBiometrics
//                 ? t('common.enabled')
//                 : t('common.disabled')}
//             </button>
//           ) : (
//             <span className="badge bg-secondary">
//               {requireBiometrics
//                 ? t('common.enabled')
//                 : t('common.disabled')}
//             </span>
//           )}
//         </div>

//         {/* Last verified */}
//         <div className="text-muted small">
//           {t('biometrics.lastVerified')}:{' '}
//           {user.biometricsLastVerifiedAt
//             ? new Date(user.biometricsLastVerifiedAt).toLocaleString()
//             : t('biometrics.neverVerified')}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserBiometricsSettings;
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiPut } from '../../helpers/api';

const UserBiometricsSettings = ({ user, isAdmin, onUpdated }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    variant: 'success'
  });

  const [localRequireBiometrics, setLocalRequireBiometrics] = useState(
    user.securitySettings?.requireBiometrics ?? false
    );
  if (!user) return null;

  const requireBiometrics = localRequireBiometrics;
  const toggleBiometrics = async () => {
    const previousValue = localRequireBiometrics;
    const newValue = !previousValue;
    setLocalRequireBiometrics(newValue);
    
    try {
      setLoading(true);

      await apiPut(`/users/${user._id}/biometrics/require`, {
        requireBiometrics: newValue
      });

      setToast({
        show: true,
        variant: 'success',
        message: newValue
          ? t('biometrics.toastEnabled')
          : t('biometrics.toastDisabled')
      });

      onUpdated?.();
    } catch (err) {
      console.error(err);
        setLocalRequireBiometrics(previousValue); 
      setToast({
        show: true,
        variant: 'danger',
        message: t('common.error')
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="card mb-3 shadow-sm">
        <div className="card-header fw-semibold d-flex align-items-center gap-2">
          🔐 {t('biometrics.title')}
        </div>

        <div className="card-body">
          {/* Status */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <div className="fw-semibold">
                {t('biometrics.requirement')}
              </div>
              <div className="text-muted small">
                {t('biometrics.description')}
              </div>
            </div>

            {isAdmin ? (
              <button
                className={`btn btn-sm ${
                  requireBiometrics
                    ? 'btn-success'
                    : 'btn-outline-secondary'
                }`}
                disabled={loading}
                onClick={toggleBiometrics}
              >
                {requireBiometrics
                  ? t('common.enabled')
                  : t('common.disabled')}
              </button>
            ) : (
              <span
                className={`badge ${
                  requireBiometrics
                    ? 'bg-success'
                    : 'bg-secondary'
                }`}
              >
                {requireBiometrics
                  ? t('common.enabled')
                  : t('common.disabled')}
              </span>
            )}
          </div>

          {/* Last verified */}
          <div className="border-top pt-2 text-muted small">
            {t('biometrics.lastVerified')}:{' '}
            {user.biometricsLastVerifiedAt
              ? new Date(
                  user.biometricsLastVerifiedAt
                ).toLocaleString()
              : t('biometrics.neverVerified')}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast.show && (
        <div
          className={`toast show position-fixed bottom-0 end-0 m-3 text-white bg-${toast.variant}`}
          role="alert"
          style={{ zIndex: 9999 }}
        >
          <div className="d-flex">
            <div className="toast-body">
              {toast.message}
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() =>
                setToast({ ...toast, show: false })
              }
            />
          </div>
        </div>
      )}
    </>
  );
};

export default UserBiometricsSettings;
