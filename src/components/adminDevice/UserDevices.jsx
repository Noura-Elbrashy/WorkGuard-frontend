/*for user profile*/

import { useTranslation } from 'react-i18next';
// import { apiPut, apiDelete, apiPatch } from '../../helpers/api';
import {
  approveUserDevice,
  removeUserDevice,
  toggleDeviceStatus
} from '../../services/device.api';

import { useState } from 'react';
import '../../style/UserDevices.css';

const UserDevices = ({ user, isAdmin, onUpdated }) => {
  const { t } = useTranslation();
  const [loadingId, setLoadingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  if (!user?.registeredDevices) return null;

  // const devices = isAdmin
  //   ? user.registeredDevices
  //   : user.registeredDevices.filter(d => d.approved && d.isActive);
  
const devices = (user.registeredDevices || []).filter(d =>
  isAdmin ? true : d.approved && d.isActive
);
  if (!devices.length) {
    return (
      <div className="card device-card">
        <div className="card-body text-center text-muted">
          <i className="fas fa-laptop mb-2 empty-icon"></i>
          <p className="mb-0">{t('devices.noDevices')}</p>
        </div>
      </div>
    );
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const approveDevice = async (deviceId) => {
    try {
      setLoadingId(deviceId);
      await approveUserDevice(user._id, deviceId);
      showToast(t('devices.toastApproved'));
      onUpdated?.();
    } catch (err) {
      showToast(err?.response?.data?.message || t('common.error'), 'danger');
    } finally {
      setLoadingId(null);
    }
  };

  const deleteDevice = async () => {
    try {
      setLoadingId(confirmDeleteId);
      await removeUserDevice(user._id, confirmDeleteId);
      showToast(t('devices.toastDeleted'), 'danger');
      onUpdated?.();
    } catch (err) {
      showToast(err?.response?.data?.message || t('common.error'), 'danger');
    } finally {
      setLoadingId(null);
      setConfirmDeleteId(null);
    }
  };

  const toggleDevice = async (deviceId, isActive) => {
    try {
      setLoadingId(deviceId);
      await toggleDeviceStatus(user._id, deviceId, { isActive });
      showToast(
        isActive ? t('devices.toastEnabled') : t('devices.toastDisabled'),
        isActive ? 'success' : 'warning'
      );
      onUpdated?.();
    } catch (err) {
      showToast(err?.response?.data?.message || t('common.error'), 'danger');
    } finally {
      setLoadingId(null);
    }
  };

  const formatDeviceName = (userAgent) => {
    if (!userAgent) return t('devices.unknown');
    return userAgent.split(')')[0] + ')';
  };

  const getDeviceIcon = (userAgent) => {
    if (!userAgent) return 'fa-laptop';
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return 'fa-mobile-alt';
    }
    if (ua.includes('tablet') || ua.includes('ipad')) {
      return 'fa-tablet-alt';
    }
    return 'fa-laptop';
  };

  return (
    <>
      {toast && (
        <div className={`toast show toast-notification alert-${toast.type}`}>
          <div className="toast-body">
            <i className={`fas fa-${toast.type === 'success' ? 'check-circle' : toast.type === 'danger' ? 'exclamation-circle' : 'exclamation-triangle'} me-2`}></i>
            {toast.message}
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="toast show toast-notification alert-warning">
          <div className="toast-body">
            <div className="fw-semibold mb-2">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {t('devices.confirmDelete')}
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-danger" onClick={deleteDevice}>
                <i className="fas fa-trash me-1"></i>
                {t('devices.actions.delete')}
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setConfirmDeleteId(null)}
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card device-card">
        <div className="card-header">
          <i className="fas fa-laptop me-2"></i>
          {t('devices.title')}
        </div>

        <ul className="list-group list-group-flush">
          {devices.map(device => (
            <li key={device.deviceId} className="list-group-item device-item">
              <div className="d-flex justify-content-between align-items-start">
                <div className="device-info">
                  <div className="device-name">
                    <i className={`fas ${getDeviceIcon(device.userAgent)} me-2`}></i>
                    {formatDeviceName(device.userAgent)}
                  </div>

                  <div className="device-meta">
                    <i className="far fa-calendar-plus me-1"></i>
                    {t('devices.registeredAt')}: {new Date(device.registeredAt).toLocaleString()}
                  </div>

                  <div className="device-meta">
                    <i className="far fa-clock me-1"></i>
                    {t('devices.lastUsed')}: {new Date(device.lastUsed).toLocaleString()}
                  </div>
                </div>

                <span className={`badge device-badge ${
                  !device.isActive ? 'bg-secondary' : device.approved ? 'bg-success' : 'bg-warning text-dark'
                }`}>
                  {!device.isActive ? t('devices.disabled') : device.approved ? t('devices.approved') : t('devices.pending')}
                </span>
              </div>

              {isAdmin && (
                <div className="admin-actions">
                  {!device.approved && (
                    <button
                      className="btn btn-sm btn-success"
                      disabled={loadingId === device.deviceId}
                      onClick={() => approveDevice(device.deviceId)}
                    >
                      <i className="fas fa-check me-1"></i>
                      {t('devices.actions.approve')}
                    </button>
                  )}

                  {device.approved && device.isActive && (
                    <button
                      className="btn btn-sm btn-outline-warning"
                      disabled={loadingId === device.deviceId}
                      onClick={() => toggleDevice(device.deviceId, false)}
                    >
                      <i className="fas fa-pause me-1"></i>
                      {t('devices.actions.disable')}
                    </button>
                  )}

                  {device.approved && !device.isActive && (
                    <button
                      className="btn btn-sm btn-outline-success"
                      disabled={loadingId === device.deviceId}
                      onClick={() => toggleDevice(device.deviceId, true)}
                    >
                      <i className="fas fa-play me-1"></i>
                      {t('devices.actions.reEnable')}
                    </button>
                  )}

                  <button
                    className="btn btn-sm btn-outline-danger"
                    disabled={loadingId === device.deviceId}
                    onClick={() => setConfirmDeleteId(device.deviceId)}
                  >
                    <i className="fas fa-trash me-1"></i>
                    {t('devices.actions.delete')}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default UserDevices;