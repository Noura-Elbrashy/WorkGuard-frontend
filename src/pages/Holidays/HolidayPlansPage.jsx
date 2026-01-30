
import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getHolidayPlans,
  createHolidayPlan,
  activateHolidayPlan,
  cancelHolidayPlan,
  deleteHolidayPlan,
  
} from '../../services/holiday.api';

import HolidayPlansList from '../../components/Holidays/HolidayPlans/HolidayPlansList';
import HolidayPlanModal from '../../components/Holidays/HolidayPlans/HolidayPlanModal';
import HolidaysToast from '../../components/Holidays/HolidaysToast';
import '../../style/holidays-module.css';

const HolidayPlansPage = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  /* =========================
     State
  ========================= */
  const [plans, setPlans] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);

  const [filters, setFilters] = useState({
    year: currentYear,
    status: '',
    page: 1,
    limit: 10
  });

  /* =========================
     Helpers
  ========================= */
  const showToast = (message, type = 'success') => {
    setToast({ message, type, show: true });
  };

  /* =========================
     Load Plans
  ========================= */
  const loadPlans = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getHolidayPlans(filters);
      setPlans(res.plans || []);
      setPagination(res.pagination || {});
    } catch (err) {
      console.error('Load plans error:', err);
      showToast(
        err.response?.data?.message || t('holidays.loadError'),
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [filters, t]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  /* =========================
     Actions
  ========================= */
  const handleActivate = async (id) => {
    if (!window.confirm(t('holidays.confirmActivate'))) return;
    try {
      await activateHolidayPlan(id);
      showToast(t('holidays.activated'));
      loadPlans();
    } catch (err) {
      showToast(
        err.response?.data?.message || t('holidays.activateError'),
        'error'
      );
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm(t('holidays.confirmCancel'))) return;
    try {
      await cancelHolidayPlan(id);
      showToast(t('holidays.cancelled'));
      loadPlans();
    } catch (err) {
      showToast(
        err.response?.data?.message || t('holidays.cancelError'),
        'error'
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('holidays.confirmDelete'))) return;
    try {
      await deleteHolidayPlan(id);
      showToast(t('holidays.deleted'));
      loadPlans();
    } catch (err) {
      showToast(
        err.response?.data?.message || t('holidays.deleteError'),
        'error'
      );
    }
  };

  const handleSavePlan = async (data) => {
    try {
      await createHolidayPlan(data);
      showToast(t('holidays.planCreated'));
      setShowModal(false);
      loadPlans();
    } catch (err) {
      showToast(
        err.response?.data?.message || t('holidays.createError'),
        'error'
      );
    }
  };

  /* =========================
     Filters
  ========================= */
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  /* =========================
     Render
  ========================= */
  return (
    <div className="holidays-module">
      {/* Header */}
      <div className="hm-header">
        <div className="hm-header-content">
          <div className="hm-header-icon">
            <i className="fas fa-layer-group" />
          </div>
          <div className="hm-header-text">
            <h1>{t('holidays.plansTitle')}</h1>
            <p>{t('holidays.plansSubtitle')}</p>
          </div>
        </div>

        <button
          className="hm-btn hm-btn-primary"
          onClick={() => setShowModal(true)}
        >
          <i className="fas fa-plus" />
          {t('holidays.addPlan')}
        </button>
      </div>

      {/* Filters */}
      <div className="hm-filters-card">
        <div className="hm-filters-grid">
          <div className="hm-form-group">
            <label className="hm-form-label">
              {t('holidays.year')}
            </label>
            <select
              className="hm-form-select"
              value={filters.year}
              onChange={(e) =>
                handleFilterChange('year', e.target.value)
              }
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = currentYear - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="hm-form-group">
            <label className="hm-form-label">
              {t('holidays.status')}
            </label>
            <select
              className="hm-form-select"
              value={filters.status}
              onChange={(e) =>
                handleFilterChange('status', e.target.value)
              }
            >
              <option value="">
                {t('holidays.allStatuses')}
              </option>
              <option value="draft">{t('holidays.draft')}</option>
              <option value="active">{t('holidays.active')}</option>
              <option value="cancelled">{t('holidays.cancelled')}</option>
              <option value="archived">{t('holidays.archived')}</option>
            </select>
          </div>

          <div className="hm-form-group">
            <button
              className="hm-btn hm-btn-secondary"
              style={{ marginTop: '1.75rem' }}
              onClick={loadPlans}
            >
              <i className="fas fa-search" />
              {t('holidays.search')}
            </button>
          </div>
        </div>
      </div>

      {/* Plans List */}
      <HolidayPlansList
        plans={plans}
        loading={loading}
        pagination={pagination}
        onActivate={handleActivate}
        onCancel={handleCancel}
        onDelete={handleDelete}
        onPageChange={handlePageChange}
      />

      {/* Modal */}
      {showModal && (
        <HolidayPlanModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSavePlan}
        />
      )}

      {/* Toast */}
      {toast && (
        <HolidaysToast
          show={toast.show}
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default HolidayPlansPage;

