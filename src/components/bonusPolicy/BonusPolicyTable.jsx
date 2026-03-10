import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  deleteBonusPolicy,
  activateBonusPolicy,
  hardDeleteBonusPolicy
} from '../../services/Overtime & Bonus/bonusPolicy.api';

/* ==============================================
   📋 BonusPolicyTable
   Props:
   - policies:     Array
   - loading:      Boolean
   - onEdit:       (policy) => void
   - onReload:     () => void
   - onToast:      ({ type, message, onConfirm? }) => void
   - isSuperAdmin: Boolean
============================================== */

const SCOPE_COLORS = {
  global:     'primary',
  branch:     'info',
  department: 'warning',
  role:       'dark',
  user:       'bg-successbadge bg-light bg-opacity-10 text-success border border-success border-opacity-25'
};

const SCOPE_ICONS = {
  global:     'fa-globe',
  branch:     'fa-building',
  department: 'fa-sitemap',
  role:       'fa-user-tag',
  user:       'fa-user'
};

export default function BonusPolicyTable({
  policies = [],
  loading,
  onEdit,
  onReload,
  onToast,
  isSuperAdmin = false
}) {
  const { t } = useTranslation("bonusPolicy");
  const [actionLoading, setActionLoading] = useState(null);

  /* =========================
     Deactivate
  ========================= */
  const handleDeactivate = (policy) => {
    onToast({
      type:      'warning',
      message:   t('bonusPolicy.confirmDelete'),
      onConfirm: async () => {
        setActionLoading(policy._id + '_deactivate');
        try {
          await deleteBonusPolicy(policy._id);
          onToast({ type: 'success', message: t('bonusPolicy.deleted') });
          onReload();
        } catch {
          onToast({ type: 'error', message: t('bonusPolicy.deleteError') });
        } finally {
          setActionLoading(null);
        }
      }
    });
  };

  /* =========================
     Activate
  ========================= */
  const handleActivate = async (policy) => {
    setActionLoading(policy._id + '_activate');
    try {
      await activateBonusPolicy(policy._id);
      onToast({ type: 'success', message: t('bonusPolicy.activated') });
      onReload();
    } catch (err) {
      onToast({
        type:    'error',
        message: err?.response?.data?.message || t('bonusPolicy.activateError')
      });
    } finally {
      setActionLoading(null);
    }
  };

  /* =========================
     Hard Delete
  ========================= */
  const handleHardDelete = (policy) => {
    onToast({
      type:      'error',
      message:   t('bonusPolicy.confirmHardDelete'),
      onConfirm: async () => {
        setActionLoading(policy._id + '_hard');
        try {
          await hardDeleteBonusPolicy(policy._id);
          onToast({ type: 'success', message: t('bonusPolicy.hardDeleted') });
          onReload();
        } catch {
          onToast({ type: 'error', message: t('bonusPolicy.deleteError') });
        } finally {
          setActionLoading(null);
        }
      }
    });
  };

  /* =========================
     Loading Skeleton
  ========================= */
  if (loading) {
    return (
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>{[...Array(7)].map((_, i) => (
                  <th key={i}><div className="placeholder-glow"><span className="placeholder col-8" /></div></th>
                ))}</tr>
              </thead>
              <tbody>
                {[...Array(3)].map((_, i) => (
                  <tr key={i}>{[...Array(7)].map((_, j) => (
                    <td key={j}><div className="placeholder-glow"><span className="placeholder col-10" /></div></td>
                  ))}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     Empty State
  ========================= */
  if (!policies.length) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <i className="fas fa-gift fa-3x text-muted mb-3 d-block" />
          <h6 className="text-muted">{t('common.noData', { ns: "translation" })}</h6>
          <p className="text-muted small mb-0">{t('bonusPolicy.pageSubtitle')}</p>
        </div>
      </div>
    );
  }

  /* =========================
     Table
  ========================= */
  return (
    <div className="card shadow-sm">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>{t('bonusPolicy.table.name')}</th>
                <th>{t('bonusPolicy.table.scope')}</th>
                <th>{t('bonusPolicy.table.attendanceBonus')}</th>
                <th>{t('bonusPolicy.table.fixedBonus')}</th>
                <th className="text-center">{t('bonusPolicy.table.status')}</th>
                <th className="text-center">{t('bonusPolicy.table.version')}</th>
                <th className="text-center">{t('bonusPolicy.table.actions')}</th>
              </tr>
            </thead>

            <tbody>
              {policies.map(policy => {
                const ab         = policy.rules?.attendanceBonus;
                const fb         = policy.rules?.fixedBonus;
                const scopeColor = SCOPE_COLORS[policy.scope] || 'secondary';

                return (
                  <tr key={policy._id}>

                    {/* Name */}
                    <td><div className="fw-semibold">{policy.name}</div></td>

                    {/* Scope */}
                    <td>
                      <span className={`badge bg-${scopeColor} bg-opacity-10 text-${scopeColor} border border-${scopeColor} border-opacity-25`}>
                        <i className={`fas ${SCOPE_ICONS[policy.scope]} me-1`} />
                        {/* {t(`bonusPolicy.scopes.${policy.scope}`)} */}
                        <div>
  {t(`bonusPolicy.scopes.${policy.scope}`)}
  {policy.scopeName && (
    <div className="small text-muted">
      {policy.scopeName}
    </div>
  )}
</div>
                      </span>
                    </td>

                    {/* Attendance Bonus */}
                    <td>
                      {ab?.enabled ? (
                        <div>
                          <span className="badge  bg-opacity-10 text-success border border-success border-opacity-25">
                            <i className="fas fa-check me-1" />
                            {ab.reward?.type === 'fixed'
                              ? `${ab.reward.value} ${t('common.currency', { ns: "translation" })}`
                              : `${ab.reward?.value}%`
                            }
                          </span>
                          <div className="text-muted mt-1" style={{ fontSize: 11 }}>
                            {t('bonusPolicy.rules.attendanceBonus.maxAbsences')}: {ab.condition?.maxAbsences ?? 0}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </td>

                    {/* Fixed Bonus */}
                    <td>
                      {fb?.enabled ? (
                        <div>
                          <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25">
                            <i className="fas fa-coins me-1" />
                            {fb.amount} {t('common.currency', { ns: "translation" })}
                          </span>
                          <div className="text-muted mt-1" style={{ fontSize: 11 }}>
                            {t(`bonusPolicy.rules.fixedBonus.conditions.${fb.condition || 'always'}`)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="text-center">
                      {policy.isActive ? (
                        <span className="badge  bg-opacity-10 text-success border border-success border-opacity-25">
                          <i className="fas fa-check-circle me-1" />{t('common.active', { ns: "translation" })}
                        </span>
                      ) : (
                        <span className="badge warning bg-opacity-10 text-secondary border border-secondary border-opacity-25">
                          <i className="fas fa-times-circle me-1" />{t('common.inactive', { ns: "translation" })}
                        </span>
                      )}
                    </td>

                    {/* Version */}
                    <td className="text-center">
                      <span className="badge bg-light text-dark border">v{policy.version || 1}</span>
                    </td>

                    {/* Actions */}
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">

                        <button className="btn btn-sm btn-outline-primary"
                          onClick={() => onEdit(policy)}
                          disabled={!!actionLoading}
                          title={t('bonusPolicy.edit')}>
                          <i className="fas fa-edit" />
                        </button>

                        {policy.isActive ? (
                          <button className="btn btn-sm btn-outline-warning"
                            onClick={() => handleDeactivate(policy)}
                            disabled={!!actionLoading}
                            title={t('bonusPolicy.delete')}>
                            {actionLoading === policy._id + '_deactivate'
                              ? <span className="spinner-border spinner-border-sm" />
                              : <i className="fas fa-ban" />}
                          </button>
                        ) : (
                          <button className="btn btn-sm btn-outline-success"
                            onClick={() => handleActivate(policy)}
                            disabled={!!actionLoading}
                            title={t('bonusPolicy.activate')}>
                            {actionLoading === policy._id + '_activate'
                              ? <span className="spinner-border spinner-border-sm" />
                              : <i className="fas fa-check" />}
                          </button>
                        )}

                        {isSuperAdmin && (
                          <button className="btn btn-sm btn-outline-danger"
                            onClick={() => handleHardDelete(policy)}
                            disabled={!!actionLoading}
                            title={t('bonusPolicy.hardDelete')}>
                            {actionLoading === policy._id + '_hard'
                              ? <span className="spinner-border spinner-border-sm" />
                              : <i className="fas fa-trash" />}
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
      </div>
    </div>
  );
}