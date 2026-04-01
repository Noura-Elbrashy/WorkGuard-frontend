// src/pages/systemAdmin/SystemAdminDashboard.jsx
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../../components/ui/Toast';
import {
  getSysAdminStats, listTenants, createTenant,
  updateTenantStatus, deleteTenant, createSubscription,
  cancelSubscription, markSubscriptionPaid, getExpiringSubscriptions,
} from '../../services/systemAdmin/systemAdmin.api';

/* ── helpers ── */
const fmt       = (n) => n == null ? '—' : Number(n).toLocaleString();
const fmtDate   = (d) => d ? new Date(d).toLocaleDateString('en-GB') : '—';
const daysLeft  = (d) => {
  if (!d) return null;
  const diff = Math.ceil((new Date(d) - Date.now()) / 86400000);
  return diff;
};

const PLAN_COLORS = { trial: 'secondary', basic: 'info', pro: 'primary', enterprise: 'warning' };
const PLAN_ICONS  = { trial: 'fa-hourglass-half', basic: 'fa-layer-group', pro: 'fa-rocket', enterprise: 'fa-crown' };
const STATUS_COLORS = { active: 'success', inactive: 'secondary', suspended: 'danger' };

/* ════════════════════════════════════════════════
   Stats Bar
════════════════════════════════════════════════ */
function StatsBar({ stats }) {
  if (!stats) return null;
  const tiles = [
    { label: 'Total Companies',    value: stats.totalTenants,        color: 'primary',   icon: 'fa-building'      },
    { label: 'Active',             value: stats.activeTenants,       color: 'success',   icon: 'fa-check-circle'  },
    { label: 'Suspended',          value: stats.suspendedTenants,    color: 'danger',    icon: 'fa-ban'           },
    { label: 'Total Employees',    value: fmt(stats.totalUsers),     color: 'info',      icon: 'fa-users'         },
    { label: 'Expiring (7 days)',  value: stats.expiringSoon,        color: 'warning',   icon: 'fa-exclamation-triangle' },
    { label: 'Monthly Revenue',    value: `${fmt(stats.revenue)} EGP`, color: 'success', icon: 'fa-coins'         },
  ];
  return (
    <div className="row g-3 mb-4">
      {tiles.map(({ label, value, color, icon }) => (
        <div className="col-6 col-md-4 col-lg-2" key={label}>
          <div className={`card border-${color} border-opacity-50 h-100`}>
            <div className="card-body py-3 text-center">
              <i className={`fas ${icon} text-${color} mb-1`} style={{ fontSize: 20 }} />
              <div className={`fw-bold fs-5 text-${color}`}>{value ?? '—'}</div>
              <div className="text-muted" style={{ fontSize: 11 }}>{label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════
   Create Tenant Modal
════════════════════════════════════════════════ */
function CreateTenantModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    companyName: '', adminName: '', adminEmail: '', adminPassword: '',
    plan: 'trial', trialDays: 14, price: '', notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const PLAN_PRICES = { trial: 0, basic: 299, pro: 799, enterprise: 1999 };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); setError('');
      await createTenant({ ...form, price: form.price || PLAN_PRICES[form.plan] });
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create company');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="fas fa-plus-circle me-2" />New Company
            </h5>
            <button className="btn-close btn-close-white" onClick={onClose} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger py-2">{error}</div>}
              <div className="row g-3">
                {/* Company */}
                <div className="col-12">
                  <label className="form-label fw-semibold">Company Name *</label>
                  <input className="form-control" required value={form.companyName}
                    onChange={e => setF('companyName', e.target.value)} placeholder="Nour Clinic" />
                </div>
                {/* Admin */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Admin Name *</label>
                  <input className="form-control" required value={form.adminName}
                    onChange={e => setF('adminName', e.target.value)} placeholder="Admin Name" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Admin Email *</label>
                  <input className="form-control" type="email" required value={form.adminEmail}
                    onChange={e => setF('adminEmail', e.target.value)} placeholder="admin@company.com" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Admin Password *</label>
                  <input className="form-control" type="password" required value={form.adminPassword}
                    onChange={e => setF('adminPassword', e.target.value)} placeholder="Min 8 chars" />
                </div>
                {/* Plan */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Plan</label>
                  <select className="form-select" value={form.plan} onChange={e => setF('plan', e.target.value)}>
                    <option value="trial">Trial (Free)</option>
                    <option value="basic">Basic — 299 EGP/mo</option>
                    <option value="pro">Pro — 799 EGP/mo</option>
                    <option value="enterprise">Enterprise — 1999 EGP/mo</option>
                  </select>
                </div>
                {form.plan === 'trial' && (
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Trial Days</label>
                    <input className="form-control" type="number" min={1} max={90} value={form.trialDays}
                      onChange={e => setF('trialDays', +e.target.value)} />
                  </div>
                )}
                {form.plan !== 'trial' && (
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Price (EGP)</label>
                    <input className="form-control" type="number" value={form.price}
                      placeholder={PLAN_PRICES[form.plan]}
                      onChange={e => setF('price', e.target.value)} />
                  </div>
                )}
                <div className="col-12">
                  <label className="form-label fw-semibold">Internal Notes</label>
                  <textarea className="form-control" rows={2} value={form.notes}
                    onChange={e => setF('notes', e.target.value)} placeholder="Optional notes..." />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm me-1" /> : <i className="fas fa-plus me-1" />}
                Create Company
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   Renew Subscription Modal
════════════════════════════════════════════════ */
function RenewSubModal({ tenant, onClose, onRenewed }) {
  const [form, setForm] = useState({
    plan: tenant?.subscriptionPlan || 'basic',
    price: '', paymentMethod: 'manual', paymentStatus: 'unpaid',
    paymentRef: '', durationMonths: 12, notes: '',
  });
  const [loading, setLoading] = useState(false);
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const startDate = new Date();
    const endDate   = new Date();
    endDate.setMonth(endDate.getMonth() + Number(form.durationMonths));

    try {
      setLoading(true);
      await createSubscription({
        tenantId: tenant._id, plan: form.plan,
        price: form.price, paymentMethod: form.paymentMethod,
        paymentStatus: form.paymentStatus, paymentRef: form.paymentRef,
        startDate, endDate, notes: form.notes,
      });
      onRenewed();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">
              <i className="fas fa-sync me-2" />Renew — {tenant?.companyName}
            </h5>
            <button className="btn-close btn-close-white" onClick={onClose} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body row g-3">
              <div className="col-12">
                <label className="form-label fw-semibold">Plan</label>
                <select className="form-select" value={form.plan} onChange={e => setF('plan', e.target.value)}>
                  <option value="basic">Basic — 299 EGP</option>
                  <option value="pro">Pro — 799 EGP</option>
                  <option value="enterprise">Enterprise — 1999 EGP</option>
                </select>
              </div>
              <div className="col-6">
                <label className="form-label fw-semibold">Duration (months)</label>
                <input className="form-control" type="number" min={1} max={24} value={form.durationMonths}
                  onChange={e => setF('durationMonths', e.target.value)} />
              </div>
              <div className="col-6">
                <label className="form-label fw-semibold">Price (EGP)</label>
                <input className="form-control" type="number" value={form.price}
                  onChange={e => setF('price', e.target.value)} />
              </div>
              <div className="col-6">
                <label className="form-label fw-semibold">Payment Method</label>
                <select className="form-select" value={form.paymentMethod} onChange={e => setF('paymentMethod', e.target.value)}>
                  <option value="manual">Manual</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="paymob">Paymob</option>
                </select>
              </div>
              <div className="col-6">
                <label className="form-label fw-semibold">Payment Status</label>
                <select className="form-select" value={form.paymentStatus} onChange={e => setF('paymentStatus', e.target.value)}>
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              {form.paymentStatus === 'paid' && (
                <div className="col-12">
                  <label className="form-label fw-semibold">Payment Reference</label>
                  <input className="form-control" value={form.paymentRef}
                    onChange={e => setF('paymentRef', e.target.value)} placeholder="Transaction ID..." />
                </div>
              )}
              <div className="col-12">
                <label className="form-label fw-semibold">Notes</label>
                <textarea className="form-control" rows={2} value={form.notes}
                  onChange={e => setF('notes', e.target.value)} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm me-1" /> : <i className="fas fa-sync me-1" />}
                Renew Subscription
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   Tenant Row
════════════════════════════════════════════════ */
function TenantRow({ tenant, onStatusChange, onRenew, onDelete }) {
  const sub      = tenant.currentSubscription;
  const plan     = sub?.plan || tenant.subscriptionPlan || 'trial';
  const days     = sub?.endDate ? daysLeft(sub.endDate) : null;
  const isExpired = days != null && days <= 0;
  const isWarning = days != null && days > 0 && days <= 7;

  return (
    <tr className={isExpired ? 'table-danger' : isWarning ? 'table-warning' : ''}>
      {/* Company */}
      <td>
        <div className="fw-semibold">{tenant.companyName}</div>
        <div className="text-muted" style={{ fontSize: 11 }}>
          <code>{tenant.subdomain}</code>
        </div>
      </td>

      {/* Status */}
      <td>
        <span className={`badge bg-${STATUS_COLORS[tenant.status] || 'secondary'}`}>
          {tenant.status}
        </span>
      </td>

      {/* Plan */}
      <td>
        <span className={`badge bg-${PLAN_COLORS[plan]} bg-opacity-15 text-${PLAN_COLORS[plan]} border border-${PLAN_COLORS[plan]} border-opacity-25`}>
          <i className={`fas ${PLAN_ICONS[plan]} me-1`} />{plan}
        </span>
        {sub?.isTrial && <span className="badge bg-light text-dark border ms-1" style={{ fontSize: 10 }}>Trial</span>}
      </td>

      {/* Employees */}
      <td className="text-center">
        <span className="fw-semibold">{tenant.employeeCount}</span>
        {sub?.limits?.maxEmployees && (
          <span className="text-muted small"> / {sub.limits.maxEmployees}</span>
        )}
      </td>

      {/* Expiry */}
      <td>
        <div className="small">{fmtDate(sub?.endDate)}</div>
        {days != null && (
          <div className={`small fw-semibold ${isExpired ? 'text-danger' : isWarning ? 'text-warning' : 'text-muted'}`}>
            {isExpired ? `Expired ${Math.abs(days)}d ago` : `${days}d left`}
          </div>
        )}
      </td>

      {/* Payment */}
      <td>
        <span className={`badge ${sub?.paymentStatus === 'paid' ? 'bg-success' : 'bg-warning text-dark'}`}>
          {sub?.paymentStatus || '—'}
        </span>
        {sub?.price > 0 && <div className="text-muted small">{fmt(sub.price)} EGP</div>}
      </td>

      {/* Created */}
      <td className="small text-muted">{fmtDate(tenant.createdAt)}</td>

      {/* Actions */}
      <td>
        <div className="d-flex gap-1 flex-wrap">
          {/* Status toggle */}
          {tenant.status === 'active' ? (
            <button className="btn btn-sm btn-outline-warning" title="Suspend"
              onClick={() => onStatusChange(tenant._id, 'suspended')}>
              <i className="fas fa-pause" />
            </button>
          ) : (
            <button className="btn btn-sm btn-outline-success" title="Activate"
              onClick={() => onStatusChange(tenant._id, 'active')}>
              <i className="fas fa-play" />
            </button>
          )}

          {/* Renew */}
          <button className="btn btn-sm btn-outline-primary" title="Renew Subscription"
            onClick={() => onRenew(tenant)}>
            <i className="fas fa-sync" />
          </button>

          {/* Delete */}
          <button className="btn btn-sm btn-outline-danger" title="Deactivate"
            onClick={() => onDelete(tenant)}>
            <i className="fas fa-trash" />
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ════════════════════════════════════════════════
   MAIN DASHBOARD
════════════════════════════════════════════════ */
const SystemAdminDashboard = () => {
  const [stats,       setStats]       = useState(null);
  const [tenants,     setTenants]     = useState([]);
  const [pagination,  setPagination]  = useState({ page: 1, pages: 1, total: 0 });
  const [expiring,    setExpiring]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [page,        setPage]        = useState(1);
  const [filters,     setFilters]     = useState({ status: '', plan: '', q: '' });
  const [toast,       setToast]       = useState(null);
  const [confirm,     setConfirm]     = useState(null);
  const [showCreate,  setShowCreate]  = useState(false);
  const [renewTarget, setRenewTarget] = useState(null);
  const [activeTab,   setActiveTab]   = useState('tenants'); // tenants | expiring

  const loadAll = useCallback(async (p = 1, f = filters) => {
    try {
      setLoading(true);
      const [statsRes, tenantsRes, expiringRes] = await Promise.all([
        getSysAdminStats(),
        listTenants({ ...f, page: p, limit: 20 }),
        getExpiringSubscriptions(7),
      ]);
      setStats(statsRes.data);
      setTenants(tenantsRes.data?.data || []);
      setPagination(tenantsRes.data?.pagination || {});
      setExpiring(expiringRes.data?.data || []);
    } catch {
      setToast({ type: 'error', message: 'Failed to load dashboard data' });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { loadAll(1, filters); }, []);

  const handleStatusChange = (id, status) => {
    setConfirm({
      message: `${status === 'active' ? 'Activate' : 'Suspend'} this company?`,
      action: async () => {
        await updateTenantStatus(id, status);
        setToast({ type: 'success', message: `Company ${status}` });
        loadAll(page, filters);
      },
    });
  };

  const handleDelete = (tenant) => {
    setConfirm({
      message: `Deactivate "${tenant.companyName}"? Their data will be preserved.`,
      action: async () => {
        await deleteTenant(tenant._id, false);
        setToast({ type: 'success', message: 'Company deactivated' });
        loadAll(page, filters);
      },
    });
  };

  const setF = (k, v) => {
    const f = { ...filters, [k]: v };
    setFilters(f);
    setPage(1);
    loadAll(1, f);
  };

  return (
    <div className="container-fluid py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-0 fw-bold">
            <i className="fas fa-shield-alt me-2 text-primary" />
            WorkGuard Admin
          </h3>
          <div className="text-muted small">System Administration Panel</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          <i className="fas fa-plus me-1" />New Company
        </button>
      </div>

      {/* Stats */}
      <StatsBar stats={stats} />

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'tenants' ? 'active' : ''}`}
            onClick={() => setActiveTab('tenants')}>
            <i className="fas fa-building me-1" />Companies ({pagination.total || 0})
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'expiring' ? 'active' : ''} ${expiring.length ? 'text-warning' : ''}`}
            onClick={() => setActiveTab('expiring')}>
            <i className="fas fa-exclamation-triangle me-1" />
            Expiring Soon
            {expiring.length > 0 && <span className="badge bg-warning text-dark ms-1">{expiring.length}</span>}
          </button>
        </li>
      </ul>

      {activeTab === 'tenants' && (
        <>
          {/* Filters */}
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-body py-3">
              <div className="row g-2 align-items-end">
                <div className="col-12 col-md-4">
                  <input className="form-control form-control-sm" placeholder="Search by company name..."
                    value={filters.q} onChange={e => setF('q', e.target.value)} />
                </div>
                <div className="col-6 col-md-2">
                  <select className="form-select form-select-sm" value={filters.status}
                    onChange={e => setF('status', e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div className="col-6 col-md-2">
                  <select className="form-select form-select-sm" value={filters.plan}
                    onChange={e => setF('plan', e.target.value)}>
                    <option value="">All Plans</option>
                    <option value="trial">Trial</option>
                    <option value="basic">Basic</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <div className="col-auto">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => { setFilters({ status: '', plan: '', q: '' }); loadAll(1, { status: '', plan: '', q: '' }); }}>
                    <i className="fas fa-undo" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-5"><span className="spinner-border text-primary" /></div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>Company</th>
                      <th>Status</th>
                      <th>Plan</th>
                      <th className="text-center">Employees</th>
                      <th>Expiry</th>
                      <th>Payment</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenants.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center text-muted py-5">
                          <i className="fas fa-inbox fa-2x mb-2 d-block opacity-25" />
                          No companies found
                        </td>
                      </tr>
                    ) : tenants.map(t => (
                      <TenantRow key={t._id} tenant={t}
                        onStatusChange={handleStatusChange}
                        onRenew={setRenewTarget}
                        onDelete={handleDelete}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="text-muted small">Page {page} of {pagination.pages} — {pagination.total} companies</div>
                  <nav>
                    <ul className="pagination pagination-sm mb-0">
                      <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => { setPage(p => p-1); loadAll(page-1, filters); }}>‹</button>
                      </li>
                      {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => i+1).map(p => (
                        <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => { setPage(p); loadAll(p, filters); }}>{p}</button>
                        </li>
                      ))}
                      <li className={`page-item ${page >= pagination.pages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => { setPage(p => p+1); loadAll(page+1, filters); }}>›</button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Expiring tab */}
      {activeTab === 'expiring' && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr><th>Company</th><th>Plan</th><th>Expires</th><th>Days Left</th><th>Payment</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {expiring.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-muted py-4">No subscriptions expiring in the next 7 days 🎉</td></tr>
              ) : expiring.map(sub => {
                const days = daysLeft(sub.endDate);
                return (
                  <tr key={sub._id} className={days <= 2 ? 'table-danger' : 'table-warning'}>
                    <td>
                      <div className="fw-semibold">{sub.tenantId?.companyName}</div>
                      <code className="small">{sub.tenantId?.subdomain}</code>
                    </td>
                    <td>
                      <span className={`badge bg-${PLAN_COLORS[sub.plan]}`}>{sub.plan}</span>
                    </td>
                    <td className="small">{fmtDate(sub.endDate)}</td>
                    <td className={`fw-bold ${days <= 2 ? 'text-danger' : 'text-warning'}`}>{days}d</td>
                    <td>
                      <span className={`badge ${sub.paymentStatus === 'paid' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {sub.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary"
                        onClick={() => setRenewTarget(sub.tenantId)}>
                        <i className="fas fa-sync me-1" />Renew
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {showCreate && (
        <CreateTenantModal
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); setToast({ type: 'success', message: 'Company created successfully!' }); loadAll(1, filters); }}
        />
      )}

      {renewTarget && (
        <RenewSubModal
          tenant={renewTarget}
          onClose={() => setRenewTarget(null)}
          onRenewed={() => { setRenewTarget(null); setToast({ type: 'success', message: 'Subscription renewed!' }); loadAll(page, filters); }}
        />
      )}

      {/* Confirm Toast */}
      {confirm && (
        <Toast show={true} type="warning" message={confirm.message}
          confirmText="Confirm" cancelText="Cancel"
          onConfirm={async () => { await confirm.action(); setConfirm(null); }}
          onClose={() => setConfirm(null)}
        />
      )}

      {toast && (
        <Toast show={true} type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default SystemAdminDashboard;