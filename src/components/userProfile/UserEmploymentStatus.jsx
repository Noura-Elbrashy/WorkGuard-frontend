import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiPut } from '../../helpers/api';
const UserEmploymentStatus = ({ user, isAdmin, onUpdated }) => {
  const { t } = useTranslation();

  if (!user) return null;

//states
const [loading, setLoading] = useState(false);
const [showModal, setShowModal] = useState(false);
const [newStatus, setNewStatus] = useState('terminated');
const [reason, setReason] = useState('');



// API call to update employment status
const updateStatus = async (status, reason = '') => {
  try {
    setLoading(true);

    await apiPut(`/users/${user._id}/employment-status`, {
      status,
      reason
    });

    onUpdated?.(); // refresh profile data

  } catch (err) {
    console.error(err);
    alert(t('common.error'));
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="card mb-3">
      <div className="card-header fw-semibold">
       {t(`employment.status.${user.employmentStatus}`)}

      </div>

      <div className="card-body">
        {/* Status Display */}
        <div className="mb-3">
  <div className="d-flex align-items-center gap-3">
    <span className="fw-semibold">  {t('employment.currentStatus')}:</span>

    <span className={`badge ${
      user.employmentStatus === 'active'
        ? 'bg-success'
        : user.employmentStatus === 'terminated'
        ? 'bg-danger'
        : user.employmentStatus === 'suspended'
        ? 'bg-warning text-dark'
        : 'bg-secondary'
    }`}>
    {t(`employment.status.${user.employmentStatus}`)}

    </span>
  </div>

  {user.employmentEndReason && (
    <div className="text-muted small mt-1">
      {t('employment.reason')}: {user.employmentEndReason}
    </div>
    
  )}

</div>
{showModal && (
  <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,.5)' }}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">

        <div className="modal-header">
          <h5 className="modal-title">
            {t('employment.changeStatus')}
          </h5>
          <button className="btn-close" onClick={() => setShowModal(false)} />
        </div>

        <div className="modal-body">
          {/* Status */}
          <div className="mb-3">
            <label className="form-label">
              {t('employment.newStatus')}
            </label>
            <select
              className="form-select"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="terminated">
                {t('employment.status.terminated')}
              </option>
              <option value="resigned">
                {t('employment.status.resigned')}
              </option>
              <option value="suspended">
                {t('employment.status.suspended')}
              </option>
            </select>
          </div>

          {/* Reason */}
          <div className="mb-3">
            <label className="form-label">
              {t('employment.reason')}
            </label>
            <textarea
              className="form-control"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('employment.reasonPlaceholder')}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setShowModal(false)}
          >
            {t('common.cancel')}
          </button>

          <button
            className="btn btn-danger"
            disabled={!reason.trim() || loading}
            onClick={async () => {
              await updateStatus(newStatus, reason);
              setShowModal(false);
            }}
          >
            {t('common.confirm')}
          </button>
        </div>

      </div>
    </div>
  </div>
)}


{Array.isArray(user.employmentHistory) && user.employmentHistory.length > 0 && (
  <div className="mt-4">
    <h6 className="fw-semibold mb-3">
      {t('employment.history')}
    </h6>

    <ul className="list-group list-group-flush">
      {user.employmentHistory.map((item, index) => (
        <li key={index} className="list-group-item px-0">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span className="fw-semibold">
               {t(`employment.status.${item.status}`)}

              </span>

              <div className="text-muted small">
                {new Date(item.startDate).toLocaleDateString()}
                {' '}
                {item.endDate && (
                  <>→ {new Date(item.endDate).toLocaleDateString()}</>
                )}
              </div>

              {item.reason && (
                <div className="text-muted small">
                  {t('employment.reason')}: {item.reason}
                </div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
)}


        {/* Admin Actions */}
{isAdmin && user.employmentStatus === 'active' && (
  <button
    className="btn btn-outline-danger"
    disabled={loading}
   onClick={() => {
  setNewStatus('terminated');
  setReason('');
  setShowModal(true);
}}

  >
    {t('employment.actions.deactivate')}
  </button>
)}

{isAdmin && user.employmentStatus !== 'active' && (
  <button
    className="btn btn-outline-success"
    disabled={loading}
    onClick={() => updateStatus('active')}
  >
    {t('employment.actions.rehire')}
  </button>
)}


      </div>
    </div>
  );
};

export default UserEmploymentStatus;
