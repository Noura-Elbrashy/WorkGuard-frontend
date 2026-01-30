import React from 'react';
import { useTranslation } from 'react-i18next';

// Toast Component
export const Toast = ({ show, message, type, onClose }) => {
  const { t } = useTranslation();

  if (!show) return null;

  return (
    <div className="toast-modern">
      <div className={`toast-header-modern ${type === 'success' ? 'toast-header-success' : 'toast-header-error'}`}>
        <i className={`fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
        <strong>{type === 'success' ? t('adminBranches.success') : t('adminBranches.error')}</strong>
        <button className="toast-close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="toast-body-modern">{message}</div>
    </div>
  );
};

// Modal Component
export const ConfirmModal = ({ show, title, message, onConfirm, onCancel, confirmText, cancelText }) => {
  const { t } = useTranslation();

  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop-modern" onClick={onCancel}></div>
      <div className="modal-container-modern">
        <div className="modal-content-modern">
          <div className="modal-header-modern">
            <h5 className="modal-title-modern">
              <i className="fas fa-trash-alt"></i>
              {title}
            </h5>
            <button className="modal-close-btn" onClick={onCancel}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="modal-body-modern">{message}</div>
          <div className="modal-footer-modern">
            <button className="btn-secondary-modern btn-modern" onClick={onCancel}>
              <i className="fas fa-times"></i>
              {cancelText || t('adminBranches.cancel')}
            </button>
            <button className="btn-danger-modern btn-modern" onClick={onConfirm}>
              <i className="fas fa-trash-alt"></i>
              {confirmText || t('adminBranches.delete')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Loading Component
export const Loading = ({ message }) => {
  const { t } = useTranslation();

  return (
    <div className="loading-container">
      <div className="spinner-modern"></div>
      <p className="loading-text">{message || t('adminBranches.loading')}</p>
    </div>
  );
};