// src/pages/settings/TenantEmailSettingsPage.jsx
import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from '../components/ui/Toast';
import '../style/TenantEmailSettings.css';
import {
  getEmailSettings,
  setEmailSettings,
  deleteEmailSettings,
  testEmailSettings,
} from '../services/tenantEmail.service';

const EMPTY_FORM = {
  user: '', password: '', smtpHost: 'smtp.gmail.com', smtpPort: '587', fromName: 'WorkGuard',
};

/* ── StatusBadge ─────────────────────────────────────────── */
function StatusBadge({ configured, t }) {
  return configured ? (
    <span className="badge te-badge-success">
      <i className="fa-solid fa-circle-check me-1" />
      {t('status.configured')}
    </span>
  ) : (
    <span className="badge te-badge-danger">
      <i className="fa-solid fa-circle-xmark me-1" />
      {t('status.notConfigured')}
    </span>
  );
}

/* ── DataRow ─────────────────────────────────────────────── */
function DataRow({ label, value, icon, last }) {
  return (
    <div className={`te-data-row ${last ? 'te-data-row-last' : ''}`}>
      <span className="te-data-label">
        <i className={`fa-solid ${icon} te-data-icon`} />
        {label}
      </span>
      <span className="te-data-value">{value || '—'}</span>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */
export default function TenantEmailSettingsPage() {
  const { t, i18n } = useTranslation('tenantEmail');
  const isRtl = i18n.dir() === 'rtl';

  const [settings, setSettings] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [testing, setTesting]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [toast, setToast] = useState({
    show: false, message: '', type: 'success', onConfirm: null,
  });

  const showToast = useCallback((message, type = 'success', onConfirm = null) => {
    setToast({ show: true, message, type, onConfirm });
  }, []);

  const closeToast = useCallback(() => {
    setToast(p => ({ ...p, show: false, onConfirm: null }));
  }, []);

  /* fetch */
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getEmailSettings();
      setSettings(res?.data || null);
      if (res?.data?.email) {
        setForm({
          user:     res.data.email.user     || '',
          password: '',
          smtpHost: res.data.email.smtpHost || 'smtp.gmail.com',
          smtpPort: String(res.data.email.smtpPort || 587),
          fromName: res.data.email.fromName || 'WorkGuard',
        });
      }
    } catch {
      setSettings(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  /* save */
  const handleSave = async (e) => {
  e.preventDefault();
  if (!form.user || !form.password) return;
  setSaving(true);
  try {
    // ✅ أولاً تحقق من الاتصال
    await testEmailSettings({
      user:     form.user,
      password: form.password,
      smtpHost: form.smtpHost,
      smtpPort: Number(form.smtpPort),
    });

    // ✅ لو Test نجح — احفظ
    await setEmailSettings({ ...form, smtpPort: Number(form.smtpPort) });
    showToast(t('messages.saveSuccess'), 'success');
    setEditMode(false);
    fetchSettings();

  } catch {
    // ❌ لو Test فشل — ارفض الحفظ
    showToast(t('messages.testError'), 'error');
  } finally {
    setSaving(false);
  }
};

  /* delete */
  const handleDelete = () => {
    showToast(
      t('messages.deleteConfirm'),
      'warning',
      async () => {
        setDeleting(true);
        try {
          await deleteEmailSettings();
          setSettings(null);
          setForm(EMPTY_FORM);
          setEditMode(false);
          showToast(t('messages.deleteSuccess'), 'success');
        } catch {
          showToast(t('messages.deleteError'), 'error');
        } finally {
          setDeleting(false);
        }
      }
    );
  };

  /* test */
  const handleTest = async () => {
    setTesting(true);
    try {
      await testEmailSettings({
        user:     form.user,
        password: form.password,
        smtpHost: form.smtpHost,
        smtpPort: Number(form.smtpPort),
      });
      showToast(t('messages.testSuccess'), 'success');
    } catch {
      showToast(t('messages.testError'), 'error');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="te-page">
      <div className="te-inner">

        {/* Header */}
        <div className="te-header">
          <div className="te-header-icon">
            <i className="fa-solid fa-envelope fa-lg" />
          </div>
          <div>
            <h4 className="te-header-title">{t('title')}</h4>
            <p className="te-header-subtitle">{t('subtitle')}</p>
          </div>
        </div>

        {/* Card */}
        <div className="te-card">

          {/* Loading */}
          {loading && (
            <div className="te-loading">
              <div className="spinner-border text-primary" role="status" style={{ width: 30, height: 30 }}>
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && !settings?.email?.user && !editMode && (
            <div className="te-empty">
              <div className="te-empty-icon">
                <i className="fa-regular fa-envelope fa-2x" />
              </div>
              <h6 className="te-empty-title">{t('noSettings')}</h6>
              <p className="te-empty-desc">{t('noSettingsDesc')}</p>
              <button className="btn btn-primary px-4" onClick={() => setEditMode(true)}>
                <i className="fa-solid fa-plus me-2" />
                {t('actions.edit')}
              </button>
            </div>
          )}

          {/* View mode */}
          {!loading && settings?.email?.user && !editMode && (
            <div className="te-view-body">
              <div className="te-view-header">
                <span className="te-view-title">
                  <i className="fa-solid fa-gear me-2 text-secondary" />
                  {t('currentSettings')}
                </span>
                <StatusBadge configured={!!settings.email.isConfigured} t={t} />
              </div>

              <div className="te-data-box">
                <DataRow label={t('form.emailAddress')} value={settings.email.user}     icon="fa-envelope" />
                <DataRow label="SMTP Host"              value={settings.email.smtpHost} icon="fa-server" />
                <DataRow label="SMTP Port"              value={settings.email.smtpPort} icon="fa-plug" />
                <DataRow label={t('form.fromName')}     value={settings.email.fromName} icon="fa-signature" last />
              </div>

              {settings.email.lastVerifiedAt && (
                <p className="te-last-verified">
                  <i className="fa-regular fa-clock me-1" />
                  {t('status.lastVerified')}: {new Date(settings.email.lastVerifiedAt).toLocaleString()}
                </p>
              )}

              <div className="te-action-row">
                <button className="btn btn-outline-primary btn-sm" onClick={() => setEditMode(true)}>
                  <i className="fa-solid fa-pen-to-square me-1" />
                  {t('actions.edit')}
                </button>
                <button className="btn btn-outline-danger btn-sm" onClick={handleDelete} disabled={deleting}>
                  {deleting
                    ? <><span className="spinner-border spinner-border-sm me-1" />{t('actions.deleting')}</>
                    : <><i className="fa-solid fa-trash me-1" />{t('actions.delete')}</>}
                </button>
              </div>
            </div>
          )}

          {/* Form mode */}
          {!loading && editMode && (
            <form onSubmit={handleSave} className="te-form" noValidate>
              <div className="row g-3">

                {/* Email */}
                <div className="col-12">
                  <label className="te-form-label">
                    <i className="fa-solid fa-envelope me-1" />
                    {t('form.emailAddress')}
                  </label>
                  <input
                    type="email"
                    className="form-control te-input"
                    required
                    placeholder={t('form.emailPlaceholder')}
                    value={form.user}
                    onChange={e => setForm(p => ({ ...p, user: e.target.value }))}
                  />
                </div>

                {/* Password */}
                <div className="col-12">
                  <label className="te-form-label">
                    <i className="fa-solid fa-lock me-1" />
                    {t('form.password')}
                  </label>
                  <div className="input-group">
                    <input
                      type={showPass ? 'text' : 'password'}
                      className="form-control te-input"
                      required={!settings?.email?.user}
                      placeholder={settings?.email?.user ? '••••••••' : t('form.passwordPlaceholder')}
                      value={form.password}
                      onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary te-eye-btn"
                      onClick={() => setShowPass(s => !s)}
                      tabIndex={-1}
                    >
                      <i className={`fa-solid ${showPass ? 'fa-eye-slash' : 'fa-eye'}`} />
                    </button>
                  </div>
                  <small className="te-hint">
                    <i className="fa-solid fa-circle-info me-1 text-info" />
                    {t('hints.password')}
                  </small>
                </div>

                {/* SMTP Host */}
                <div className="col-8">
                  <label className="te-form-label">
                    <i className="fa-solid fa-server me-1" />
                    {t('form.smtpHost')}
                  </label>
                  <input
                    type="text"
                    className="form-control te-input"
                    placeholder={t('form.smtpHostPlaceholder')}
                    value={form.smtpHost}
                    onChange={e => setForm(p => ({ ...p, smtpHost: e.target.value }))}
                  />
                </div>

                {/* SMTP Port */}
                <div className="col-4">
                  <label className="te-form-label">
                    <i className="fa-solid fa-plug me-1" />
                    {t('form.smtpPort')}
                  </label>
                  <input
                    type="number"
                    className="form-control te-input"
                    placeholder={t('form.smtpPortPlaceholder')}
                    value={form.smtpPort}
                    min={1} max={65535}
                    onChange={e => setForm(p => ({ ...p, smtpPort: e.target.value }))}
                  />
                </div>

                {/* From Name */}
                <div className="col-12">
                  <label className="te-form-label">
                    <i className="fa-solid fa-signature me-1" />
                    {t('form.fromName')}
                  </label>
                  <input
                    type="text"
                    className="form-control te-input"
                    placeholder={t('form.fromNamePlaceholder')}
                    value={form.fromName}
                    onChange={e => setForm(p => ({ ...p, fromName: e.target.value }))}
                  />
                  <small className="te-hint">
                    <i className="fa-solid fa-circle-info me-1 text-info" />
                    {t('hints.smtp')}
                  </small>
                </div>
              </div>

              {/* Actions */}
              <div className="te-form-actions">
                <button type="submit" className="btn btn-primary px-4" disabled={saving}>
                  {saving
                    ? <><span className="spinner-border spinner-border-sm me-2" />{t('actions.saving')}</>
                    : <><i className="fa-solid fa-floppy-disk me-2" />{t('actions.save')}</>}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-info"
                  disabled={testing || !form.user || !form.password}
                  onClick={handleTest}
                >
                  {testing
                    ? <><span className="spinner-border spinner-border-sm me-2" />{t('actions.testing')}</>
                    : <><i className="fa-solid fa-wifi me-2" />{t('actions.testConnection')}</>}
                </button>

                <button type="button" className="btn btn-outline-secondary" onClick={() => setEditMode(false)}>
                  <i className="fa-solid fa-xmark me-1" />
                  {t('actions.cancel')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
        onConfirm={toast.onConfirm}
        confirmText={t('actions.delete')}
        cancelText={t('actions.cancel')}
      />
    </div>
  );
}