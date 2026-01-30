import { useTranslation } from 'react-i18next';
import LeaveStatusBadge from './LeaveStatusBadge';
import { useNavigate } from 'react-router-dom';
import { formatDisplayDate } from '../../../helpers/dateHelpers';

function LeaveCard({
  leave,
  isAdmin,
  onApprove,
  onReject,
  onCancel,
  onOpenDetails
}) {
  const { t } = useTranslation();
const navigate = useNavigate();
  if (!leave) return null;

  const {
    _id,
    leaveType,
    startDate,
    endDate,
    totalDays,
    status,
    reason,
    user,
    createdAt
  } = leave;

  const formatDate = (d) => formatDisplayDate(d);


  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const leaveStart = new Date(startDate);
  leaveStart.setHours(0, 0, 0, 0);

  // ✅ Admin can cancel approved leave ONLY if it has not started yet
  // const canCancelApproved =
  //   isAdmin &&
  //   status === 'approved' &&
  //   leaveStart > today;
const canCancelApproved =
  isAdmin && status === 'approved';

  return (
    <div className="card shadow-sm mb-3 border-0">
      <div className="card-body">

        {/* ================= Header ================= */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h6 className="mb-1 fw-semibold">
              <i className="fa-solid fa-calendar-days me-2 text-primary" />
              {t(`leave.types.${leaveType}`)}
            </h6>

            {isAdmin && user && (
              <div className="text-muted small">
                <i className="fa-solid fa-user me-1" />
                {user.name} – {user.email}
              </div>
            )}
          </div>

          {/* <LeaveStatusBadge status={status} /> */}

         <LeaveStatusBadge leave={leave} isAdmin={isAdmin} />


        </div>

        {/* ================= Dates ================= */}
        <div className="row small mb-2">
          <div className="col-md-6">
            <i className="fa-solid fa-play text-muted me-1" />
            {t('leave.from')}:{' '}
            <strong>{formatDate(startDate)}</strong>
          </div>

          <div className="col-md-6">
            <i className="fa-solid fa-stop text-muted me-1" />
            {t('leave.to')}:{' '}
            <strong>{formatDate(endDate)}</strong>
          </div>
        </div>

        {/* ================= Meta ================= */}
        <div className="row small mb-2">
          <div className="col-md-6">
            <i className="fa-solid fa-clock me-1 text-muted" />
            {t('leave.totalDays')}:{' '}
            <strong>{totalDays}</strong>
          </div>

          <div className="col-md-6">
            <i className="fa-solid fa-paper-plane me-1 text-muted" />
            {t('leave.submitted')}:{' '}
            {formatDate(createdAt)}
          </div>
        </div>
{leave.metadata?.paidDays !== undefined && (
  <div className="small text-muted mt-1">
    <i className="fa-solid fa-coins me-1" />
    {leave.metadata.paidDays} مدفوع /
    {leave.metadata.unpaidDays || 0} غير مدفوع
  </div>
)}
{leave.metadata?.unpaidDays > 0 && (
  <span className="text-danger ms-1">(خصم أجر)</span>
)}

        {/* ================= Reason ================= */}
        {reason && (
          <div className="alert alert-light py-2 px-3 small mb-3">
            <i className="fa-solid fa-message me-2 text-muted" />
            {reason}
          </div>
        )}

        {/* ================= Actions ================= */}
        <div className="d-flex justify-content-between align-items-center">

          {/* Details */}
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => onOpenDetails?.(_id)}
          >
            <i className="fa-solid fa-eye me-1" />
            {t('leave.details')}
          </button>

          {/* ===== Admin Actions ===== */}
          {isAdmin && status === 'pending' && (
            <div className="d-flex gap-2">
              <button
                className="btn btn-success btn-sm"
                onClick={() => onApprove?.(_id)}
              >
                <i className="fa-solid fa-check me-1" />
                {t('leave.approve')}
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => onReject?.(_id)}
              >
                <i className="fa-solid fa-xmark me-1" />
                {t('leave.reject')}
              </button>
            </div>
          )}

          {/* ===== Cancel Approved (Admin) ===== */}
          {canCancelApproved && (
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => onCancel?.(_id)}
            >
              <i className="fa-solid fa-ban me-1" />
              {t('leave.cancelApproved')}
            </button>
          )}

          {/* ===== Cancel Pending (Employee) ===== */}
          {!isAdmin && status === 'pending' && (
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => onCancel?.(_id)}
            >
              <i className="fa-solid fa-ban me-1" />
              {t('leave.cancel')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeaveCard;
