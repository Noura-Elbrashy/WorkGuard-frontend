
// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";

// import LeavePolicyTable from "../components/leave/policy/LeavePolicyTable";
// import {
//   getLeavePolicies,
//   deleteLeavePolicy,
//   setLeavePolicyActive
// } from "../components/leave/services/leavePolicy.api";

// import Toast from "../components/ui/Toast";

// export default function LeavePoliciesPage() {
//   const navigate = useNavigate();
//   const { t } = useTranslation();

//   /* =========================
//      State
//   ========================= */
//   const [policies, setPolicies] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [filters, setFilters] = useState({
//     scope: "",
//     active: null
//   });

//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     pages: 1,
//     total: 0
//   });

//   const [toast, setToast] = useState({
//     show: false,
//     message: "",
//     type: "success",
//     onConfirm: null
//   });

//   /* =========================
//      Toast Helpers
//   ========================= */
//   const showToast = ({ message, type = "success", onConfirm = null }) => {
//     setToast({
//       show: true,
//       message,
//       type,
//       onConfirm
//     });
//   };

//   const closeToast = () => {
//     setToast((t) => ({ ...t, show: false, onConfirm: null }));
//   };

//   /* =========================
//      Fetch Policies
//   ========================= */
//   const fetchPolicies = useCallback(async () => {
//     try {
//       setLoading(true);

//       const params = {
//         page: pagination.page,
//         limit: pagination.limit,
//         ...(filters.scope && { scope: filters.scope }),
//         ...(filters.active !== null && { active: filters.active })
//       };

//       const res = await getLeavePolicies(params);
//       const { data, pagination: pg } = res.data;

//       setPolicies(data || []);
//       setPagination((prev) => ({
//         ...prev,
//         page: pg?.page || 1,
//         pages: pg?.pages || 1,
//         total: pg?.total || 0
//       }));
//     } catch (err) {
//       showToast({
//         type: "error",
//         message: t("leavePolicies.loadFailed")
//       });
//     } finally {
//       setLoading(false);
//     }
//   }, [filters, pagination.page, pagination.limit, t]);

//   useEffect(() => {
//     fetchPolicies();
//   }, [fetchPolicies]);

//   /* =========================
//      Handlers
//   ========================= */
//   const handleDelete = (policy) => {
//     showToast({
//       type: "warning",
//       message: t("leavePolicies.confirmDelete"),
//       onConfirm: async () => {
//         try {
//           await deleteLeavePolicy(policy._id);
//           showToast({
//             message: t("leavePolicies.deleteSuccess")
//           });
//           fetchPolicies();
//         } catch {
//           showToast({
//             type: "error",
//             message: t("leavePolicies.deleteFailed")
//           });
//         }
//       }
//     });
//   };

//   const handleToggleActive = async (policy) => {
//     try {
//       await setLeavePolicyActive(policy._id, !policy.active);
//       showToast({
//         message: policy.active
//           ? t("leavePolicies.disabled")
//           : t("leavePolicies.enabled")
//       });
//       fetchPolicies();
//     } catch {
//       showToast({
//         type: "error",
//         message: t("leavePolicies.updateStatusFailed")
//       });
//     }
//   };

//   /* =========================
//      Render
//   ========================= */
//   return (
//     <div className="container-fluid py-4">
//       {/* Header */}
//       <div className="d-flex align-items-center mb-3">
//         <div>
//           <h3 className="mb-0">{t("leavePolicies.pageTitle")}</h3>
//           <small className="text-muted">
//             {t("leavePolicies.pageSubtitle")}
//           </small>
//         </div>

//         <div className="ms-auto">
//           <button
//             className="btn btn-primary"
//             onClick={() => navigate("/admin/leave-policies/create")}
//           >
//             <i className="bi bi-plus-lg me-1" />
//             {t("leavePolicies.new")}
//           </button>
//         </div>
//       </div>

//       <LeavePolicyTable
//         data={policies}
//         loading={loading}
//         filters={filters}
//         pagination={pagination}
//         onFilterChange={(f) => {
//           setFilters(f);
//           setPagination((p) => ({ ...p, page: 1 }));
//         }}
//         onPageChange={(page) =>
//           setPagination((p) => ({ ...p, page }))
//         }
//         onEdit={(p) =>
//           navigate(`/admin/leave-policies/${p._id}/edit`)
//         }
//         onToggleActive={handleToggleActive}
//         onDelete={handleDelete}
//       />

//       {/* Toast */}
//       <Toast
//         show={toast.show}
//         message={toast.message}
//         type={toast.type}
//         onConfirm={toast.onConfirm}
//         onClose={closeToast}
//         confirmText={t("common.confirm")}
//         cancelText={t("common.cancel")}
//       />
//     </div>
//   );
// }

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import LeavePolicyTable from "../components/leave/policy/LeavePolicyTable";
import LeavePolicyFooter from "../components/leave/policy/LeavePolicyFooter";
import YearlyLeaveResetModal from "../components/leave/yearly-reset/components/YearlyResetConfirmModal" 
import {
  getLeavePolicies,
  deleteLeavePolicy,
  setLeavePolicyActive
} from "../services/Leave-services/leavePolicy.api";

import Toast from "../components/ui/Toast";
import "../style/LeavePoliciesPage.css";

export default function LeavePoliciesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
const [showResetModal, setShowResetModal] = useState(false);

  const [filters, setFilters] = useState({
    scope: "",
    active: null
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    pages: 1,
    total: 0
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
    onConfirm: null
  });

  const showToast = ({ message, type = "success", onConfirm = null }) => {
    setToast({
      show: true,
      message,
      type,
      onConfirm
    });
  };

  const closeToast = () => {
    setToast((t) => ({ ...t, show: false, onConfirm: null }));
  };

  const fetchPolicies = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.scope && { scope: filters.scope }),
        ...(filters.active !== null && { active: filters.active })
      };

      const res = await getLeavePolicies(params);
      const { data, pagination: pg } = res.data;

      setPolicies(data || []);
      setPagination((prev) => ({
        ...prev,
        page: pg?.page || 1,
        pages: pg?.pages || 1,
        total: pg?.total || 0
      }));
    } catch (err) {
      showToast({
        type: "error",
        message: t("leavePolicies.loadFailed")
      });
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit, t]);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  const handleDelete = (policy) => {
    showToast({
      type: "warning",
      message: t("leavePolicies.confirmDelete"),
      onConfirm: async () => {
        try {
          await deleteLeavePolicy(policy._id);
          showToast({
            message: t("leavePolicies.deleteSuccess")
          });
          fetchPolicies();
        } catch {
          showToast({
            type: "error",
            message: t("leavePolicies.deleteFailed")
          });
        }
      }
    });
  };

  const handleToggleActive = async (policy) => {
    try {
      await setLeavePolicyActive(policy._id, !policy.active);
      showToast({
        message: policy.active
          ? t("leavePolicies.disabled")
          : t("leavePolicies.enabled")
      });
      fetchPolicies();
    } catch {
      showToast({
        type: "error",
        message: t("leavePolicies.updateStatusFailed")
      });
    }
  };

  const stats = [
    {
      label: t("leavePolicies.totalPolicies") || "Total Policies",
      value: pagination.total,
      icon: "fa-clipboard-list",
      color: "primary"
    },
    {
      label: t("leavePolicies.active") || "Active",
      value: policies.filter(p => p.active).length,
      icon: "fa-check-circle",
      color: "success"
    },
    {
      label: t("leavePolicies.inactive") || "Inactive",
      value: policies.filter(p => !p.active).length,
      icon: "fa-times-circle",
      color: "warning"
    },
    {
      label: t("leavePolicies.scopes.global") || "Global",
      value: policies.filter(p => p.scope === "global").length,
      icon: "fa-globe",
      color: "info"
    }
  ];

  return (
    <div className="leave-policies-page">
      <div className="container-fluid">
        
        {/* Header */}
        <div className="page-header mb-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="page-title mb-1">
                <i className="fas fa-calendar-check me-2"></i>
                {t("leavePolicies.pageTitle")}
              </h2>
              <p className="page-subtitle mb-0">
                {t("leavePolicies.pageSubtitle")}
              </p>
            </div>
            
            {/* <button
              className="btn btn-primary btn-create"
              onClick={() => navigate("/admin/leave-policies/create")}
            >
              <i className="fas fa-plus me-2"></i>
              {t("leavePolicies.new")}
            </button> */}
            <div className="d-flex gap-2">
  <button
    className="btn btn-outline-danger"
    onClick={() => setShowResetModal(true)}
  >
    <i className="fas fa-sync-alt me-2"></i>
    {t("leaveReset.open")}
  </button>

  <button
    className="btn btn-primary btn-create"
    onClick={() => navigate("/admin/leave-policies/create")}
  >
    <i className="fas fa-plus me-2"></i>
    {t("leavePolicies.new")}
  </button>
</div>

          </div>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-4">
          {stats.map((stat, index) => (
            <div key={index} className="col-6 col-lg-3">
              <div className={`stat-card stat-card-${stat.color}`}>
                <div className="stat-icon">
                  <i className={`fas ${stat.icon}`}></i>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <LeavePolicyTable
          data={policies}
          loading={loading}
          filters={filters}
          pagination={pagination}
          onFilterChange={(f) => {
            setFilters(f);
            setPagination((p) => ({ ...p, page: 1 }));
          }}
          onPageChange={(page) =>
            setPagination((p) => ({ ...p, page }))
          }
          onEdit={(p) =>
            navigate(`/admin/leave-policies/${p._id}/edit`)
          }
          onToggleActive={handleToggleActive}
          onDelete={handleDelete}
        />
        <YearlyLeaveResetModal
  show={showResetModal}
  onClose={() => setShowResetModal(false)}
/>

<LeavePolicyFooter />
        {/* Toast */}
        <Toast
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onConfirm={toast.onConfirm}
          onClose={closeToast}
          confirmText={t("common.confirm")}
          cancelText={t("common.cancel")}
        />
      </div>
    </div>
  );
}