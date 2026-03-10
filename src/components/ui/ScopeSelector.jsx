import { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getBranchLookup }  from '../../services/branch.api';
import { getDepartments }   from '../../services/department.api';
import { searchUsers }      from '../../services/user.api';

/* ==============================================
   🎯 ScopeSelector — Reusable Component

   Scopes:
   - global     → مفيش scopeId
   - branch     → dropdown من API الفروع
   - department → dropdown من API الأقسام
   - role       → dropdown ثابت (staff / admin)
   - user       → اختار فرع (اختياري) ثم search بالاسم

   Props:
   - scope:     string
   - scopeId:   string
   - onChange:  ({ scope, scopeId, scopeLabel }) => void
   - disabled:  boolean  (readonly في الـ edit)
   - error:     string
   - scopes:    string[] (الـ scopes المتاحة)
============================================== */

const DEFAULT_SCOPES = ['global', 'branch', 'department', 'role', 'user'];

// Roles الموجودة في الـ User model
const ROLES = ['staff', 'admin'];

const SCOPE_ICONS = {
  global:     'fa-globe',
  branch:     'fa-building',
  department: 'fa-sitemap',
  role:       'fa-user-tag',
  user:       'fa-user'
};

export default function ScopeSelector({
  scope,
  scopeId,
  onChange,
  disabled  = false,
  error,
  scopes    = DEFAULT_SCOPES
}) {
  const { t } = useTranslation("translation");

  // ── Branches ──
  const [branches,        setBranches]        = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(false);

  // ── Departments ──
  const [departments,        setDepartments]        = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);

  // ── User search ──
  const [selectedBranchForUser, setSelectedBranchForUser] = useState('');
  const [userQuery,             setUserQuery]             = useState('');
  const [userResults,           setUserResults]           = useState([]);
  const [userSearchLoading,     setUserSearchLoading]     = useState(false);
  const [showUserDropdown,      setShowUserDropdown]      = useState(false);
  const [selectedUserLabel,     setSelectedUserLabel]     = useState('');

  const searchRef   = useRef(null);
  const debounceRef = useRef(null);

  /* =========================
     Load Branches
     (لما scope = branch أو user)
  ========================= */
  useEffect(() => {
    if (!scopes.includes('branch') && !scopes.includes('user')) return;

    setBranchesLoading(true);
    getBranchLookup()
      .then(res => {
        const raw = res?.data?.data ?? res?.data?.branches ?? res?.data ?? res ?? [];
        setBranches(Array.isArray(raw) ? raw : []);
      })
      .catch(() => setBranches([]))
      .finally(() => setBranchesLoading(false));
  }, []);

  /* =========================
     Load Departments
     (لما scope = department)
  ========================= */
  useEffect(() => {
    if (!scopes.includes('department')) return;

    setDepartmentsLoading(true);
    getDepartments({ limit: 100 })
      .then(res => {
        // الـ response ممكن تيجي بأشكال مختلفة حسب الـ backend
        const raw = res?.data?.data ?? res?.data?.departments ?? res?.data ?? res ?? [];
        setDepartments(Array.isArray(raw) ? raw : []);
      })
      .catch(() => setDepartments([]))
      .finally(() => setDepartmentsLoading(false));
  }, []);

  /* =========================
     User Search (debounced 350ms)
  ========================= */
  const handleUserSearch = useCallback((query) => {
    setUserQuery(query);
    setShowUserDropdown(true);

    if (!query.trim() || query.length < 2) {
      setUserResults([]);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setUserSearchLoading(true);
      try {
        const res = await searchUsers(query, selectedBranchForUser);
        const raw = res?.data?.data ?? res?.data?.users ?? res?.data ?? res ?? [];
        setUserResults(Array.isArray(raw) ? raw : []);
      } catch {
        setUserResults([]);
      } finally {
        setUserSearchLoading(false);
      }
    }, 350);
  }, [selectedBranchForUser]);

  /* =========================
     Close dropdown on outside click
  ========================= */
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  /* =========================
     Reset user state on scope change
  ========================= */
  useEffect(() => {
    if (scope !== 'user') {
      setUserQuery('');
      setUserResults([]);
      setSelectedUserLabel('');
      setSelectedBranchForUser('');
    }
  }, [scope]);

  /* =========================
     Handlers
  ========================= */
  const handleScopeChange = (newScope) => {
    onChange({ scope: newScope, scopeId: '', scopeLabel: '' });
  };

  const handleBranchSelect = (e) => {
    const id    = e.target.value;
    const label = branches.find(b => b._id === id)?.name || '';
    onChange({ scope, scopeId: id, scopeLabel: label });
  };

  const handleDepartmentSelect = (e) => {
    const id    = e.target.value;
    const label = departments.find(d => d._id === id)?.name || '';
    onChange({ scope, scopeId: id, scopeLabel: label });
  };

  const handleRoleSelect = (e) => {
    onChange({ scope, scopeId: e.target.value, scopeLabel: e.target.value });
  };

  const handleBranchForUserChange = (e) => {
    setSelectedBranchForUser(e.target.value);
    setUserQuery('');
    setSelectedUserLabel('');
    setUserResults([]);
    onChange({ scope, scopeId: '', scopeLabel: '' });
  };

  const handleUserSelect = (user) => {
    const label = user.name || user.email || '';
    setUserQuery(label);
    setSelectedUserLabel(label);
    setShowUserDropdown(false);
    setUserResults([]);
    onChange({ scope, scopeId: user._id, scopeLabel: label });
  };

  /* =========================
     JSX
  ========================= */
  return (
    <div className="scope-selector">

      {/* ── Scope Type Buttons ── */}
      <div className="mb-3">
        <label className="form-label fw-semibold">
          {t('common.scope')} <span className="text-danger">*</span>
        </label>
        <div className="d-flex flex-wrap gap-2">
          {scopes.map(s => (
            <button
              key={s}
              type="button"
              disabled={disabled}
              className={`btn btn-sm ${scope === s ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => !disabled && handleScopeChange(s)}
            >
              <i className={`fas ${SCOPE_ICONS[s]} me-1`} />
              {t(`common.${s}`)}
              {/* {t(`${s}`)} */}
            </button>
          ))}
        </div>
        {disabled && (
          <div className="form-text text-muted mt-1">
            <i className="fas fa-lock me-1" />
            {t('common.readOnly')}
          </div>
        )}
      </div>

      {/* ── Global ── */}
      {scope === 'global' && (
        <div className="alert alert-info py-2 px-3 mb-0 small">
          <i className="fas fa-globe me-2" />
          {t('common.globalScopeInfo')}
        </div>
      )}

      {/* ── Branch ── */}
      {scope === 'branch' && (
        <div>
          <label className="form-label fw-semibold">
            {t('common.branch')} <span className="text-danger">*</span>
          </label>
          <select
            className={`form-select ${error ? 'is-invalid' : ''}`}
            value={scopeId}
            onChange={handleBranchSelect}
            disabled={disabled || branchesLoading}
          >
            <option value="">
              {branchesLoading ? t('common.loading') : t('common.selectBranch')}
            </option>
            {branches.map(b => (
              <option key={b._id} value={b._id}>{b.name}</option>
            ))}
          </select>
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
      )}

      {/* ── Department ── */}
      {scope === 'department' && (
        <div>
          <label className="form-label fw-semibold">
            {t('common.department')} <span className="text-danger">*</span>
          </label>
          <select
            className={`form-select ${error ? 'is-invalid' : ''}`}
            value={scopeId}
            onChange={handleDepartmentSelect}
            disabled={disabled || departmentsLoading}
          >
            <option value="">
              {departmentsLoading ? t('common.loading') : t('common.selectDepartment')}
            </option>
            {departments.map(d => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
      )}

      {/* ── Role ── */}
      {scope === 'role' && (
        <div>
          <label className="form-label fw-semibold">
            {t('common.role')} <span className="text-danger">*</span>
          </label>
          <select
            className={`form-select ${error ? 'is-invalid' : ''}`}
            value={scopeId}
            onChange={handleRoleSelect}
            disabled={disabled}
          >
            <option value="">{t('common.selectRole')}</option>
            {ROLES.map(r => (
              <option key={r} value={r}>
                {r === 'staff' ? t('common.roles.staff') : t('common.roles.admin')}
              </option>
            ))}
          </select>
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
      )}

      {/* ── User: Step 1 → Branch filter, Step 2 → Search ── */}
      {scope === 'user' && (
        <div className="row g-2">

          {/* Step 1: Branch Filter (اختياري) */}
          <div className="col-12 col-md-5">
            <label className="form-label fw-semibold">
              <span className="badge bg-secondary me-1 fw-normal">1</span>
              {t('common.filterByBranch')}
              <span className="text-muted small ms-1">({t('common.optional')})</span>
            </label>
            <select
              className="form-select"
              value={selectedBranchForUser}
              onChange={handleBranchForUserChange}
              disabled={disabled || branchesLoading}
            >
              <option value="">
                {branchesLoading ? t('common.loading') : t('common.allBranches')}
              </option>
              {branches.map(b => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Step 2: Search Employee */}
          <div className="col-12 col-md-7" ref={searchRef}>
            <label className="form-label fw-semibold">
              <span className="badge bg-secondary me-1 fw-normal">2</span>
              {t('common.searchEmployee')} <span className="text-danger">*</span>
            </label>

            <div className="position-relative">
              <input
                type="text"
                className={`form-control ${error ? 'is-invalid' : ''}`}
                value={userQuery}
                onChange={e => handleUserSearch(e.target.value)}
                onFocus={() => userQuery.length >= 2 && setShowUserDropdown(true)}
                placeholder={t('common.typeToSearch')}
                disabled={disabled}
                autoComplete="off"
              />

              {userSearchLoading && (
                <span className="position-absolute top-50 end-0 translate-middle-y me-3"
                  style={{ pointerEvents: 'none' }}>
                  <span className="spinner-border spinner-border-sm text-secondary" />
                </span>
              )}

              {/* Results Dropdown */}
              {showUserDropdown && userResults.length > 0 && (
                <ul className="dropdown-menu show w-100 shadow-sm"
                  style={{ position: 'absolute', top: '100%', zIndex: 1055, maxHeight: 220, overflowY: 'auto' }}>
                  {userResults.map(user => (
                    <li key={user._id}>
                      <button
                        type="button"
                        className="dropdown-item d-flex align-items-center gap-2 py-2"
                        onClick={() => handleUserSelect(user)}
                      >
                        <div
                          className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                          style={{ width: 32, height: 32, fontSize: 13 }}
                        >
                          {(user.name || user.email || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-semibold small">{user.name || '—'}</div>
                          <div className="text-muted" style={{ fontSize: 11 }}>
                            {user.email}
                            {user.branchName && (
                              <span className="ms-1 badge bg-light text-secondary border">
                                {user.branchName}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* No results */}
              {showUserDropdown && !userSearchLoading && userQuery.length >= 2 && userResults.length === 0 && (
                <ul className="dropdown-menu show w-100"
                  style={{ position: 'absolute', top: '100%', zIndex: 1055 }}>
                  <li className="dropdown-item text-muted small py-2">
                    <i className="fas fa-search me-1" />
                    {t('common.noResults')}
                  </li>
                </ul>
              )}
            </div>

            {error && <div className="text-danger small mt-1">{error}</div>}

            {/* Selected User Badge */}
            {selectedUserLabel && scopeId && (
              <div className="mt-1">
                <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">
                  <i className="fas fa-user-check me-1" />
                  {selectedUserLabel}
                </span>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}