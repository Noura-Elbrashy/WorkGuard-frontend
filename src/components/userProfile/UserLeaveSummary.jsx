// import { useEffect, useState } from 'react';
// import { apiGet } from '../../helpers/api';

// const UserLeaveSummary = ({ userId, year }) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!userId || !year) return;

//     apiGet(`/users/${userId}/leave-year`, {
//       params: { year }
//     })
//       .then(res => setData(res.data))
//       .finally(() => setLoading(false));
//   }, [userId, year]);

//   if (loading) return <div>Loading leave summary...</div>;
//   if (!data) return <div>No leave data</div>;

//   return (
//     <div className="row g-3 mt-3">

//       {/* Annual */}
//       <div className="col-md-4">
//         <div className="card shadow-sm">
//           <div className="card-body">
//             <h6>Annual Leave</h6>
//             <p className="mb-1">
//               Used: {data.annual.usedPaid}
//             </p>
//             <p className="mb-1">
//               Remaining: <b>{data.annual.remaining}</b>
//             </p>
//             <small>Total: {data.annual.total}</small>
//           </div>
//         </div>
//       </div>

//       {/* Sick */}
//       <div className="col-md-4">
//         <div className="card shadow-sm">
//           <div className="card-body">
//             <h6>Sick Leave</h6>
//             <p className="mb-1">
//               Used: {data.sick.usedPaid}
//             </p>
//             <p className="mb-1">
//               Remaining: <b>{data.sick.remaining}</b>
//             </p>
//             <small>Total: {data.sick.total}</small>
//           </div>
//         </div>
//       </div>

//       {/* Unpaid */}
//       <div className="col-md-4">
//         <div className="card shadow-sm">
//           <div className="card-body">
//             <h6>Unpaid / Absence</h6>
//             <p className="mb-1">
//               Unpaid Leaves: {data.unpaid.unpaidLeaveDays}
//             </p>
//             <p className="mb-1">
//               Absences: {data.unpaid.absentDays}
//             </p>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default UserLeaveSummary;



//no need 
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getUserLeaveYear } from "../../services/Leave-services/leavePolicy.api";
import Toast from "../ui/Toast";

/**
 * ======================================================
 * UserLeaveSummary
 *
 * ✔ Uses UserLeaveYear ONLY
 * ✔ No business logic in frontend
 * ✔ Safe for missing years
 * ✔ Profile-friendly (no routing assumptions)
 * ======================================================
 */
export default function UserLeaveSummary({ userId }) {
  const { t } = useTranslation();

  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState(currentYear);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  /* =========================
     Guard – invalid user
  ========================= */
  if (!userId) {
    return (
      <div className="text-muted text-center py-4">
        {t("common.invalidUser")}
      </div>
    );
  }

  /* =========================
     Load leave year
  ========================= */
  useEffect(() => {
    setLoading(true);
    setError(null);

    getUserLeaveYear({ userId, year })
      .then(res => {
        setData(res.data || null);
      })
      .catch(err => {
        setData(null);
        setError(
          err.response?.data?.message ||
          t("leave.errors.loadFailed")
        );
      })
      .finally(() => setLoading(false));

  }, [userId, year, t]);

  /* =========================
     Derived (SAFE math only)
     ❗ No policy logic here
  ========================= */
  const computed = useMemo(() => {
    if (!data?.annual || !data?.sick) return null;

    const annualRemaining =
      Number(data.annual.total || 0) -
      Number(data.annual.usedPaid || 0) -
      Number(data.annual.usedUnpaid || 0);

    const sickRemaining =
      Number(data.sick.total || 0) -
      Number(data.sick.usedPaid || 0);

    return {
      annualRemaining: Math.max(0, annualRemaining),
      sickRemaining: Math.max(0, sickRemaining)
    };
  }, [data]);

  /* =========================
     States
  ========================= */
  if (loading) {
    return (
      <div className="text-center py-4">
        {t("common.loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <Toast
          show
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      </div>
    );
  }

  if (!data || !data.annual || !data.sick) {
    return (
      <div className="text-muted text-center py-4">
        {t("leave.noLeaveYear")}
      </div>
    );
  }

  /* =========================
     Render
  ========================= */
  return (
    <div className="container-fluid py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">
          <i className="bi bi-calendar-check me-2" />
          {t("leave.overview")}
        </h5>

        <select
          className="form-select w-auto"
          value={year}
          onChange={e => setYear(Number(e.target.value))}
        >
          {[currentYear - 1, currentYear, currentYear + 1].map(y => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Cards */}
      <div className="row g-3">

        {/* Annual */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted mb-3">
                {t("leave.annual")}
              </h6>

              <p className="mb-1">
                {t("leave.total")}:{" "}
                <strong>{data.annual.total}</strong>
              </p>

              <p className="mb-1">
                {t("leave.used")}:{" "}
                <strong>
                  {data.annual.usedPaid + data.annual.usedUnpaid}
                </strong>
              </p>

              <p className="mb-0">
                {t("leave.remaining")}:{" "}
                <strong className="text-success">
                  {computed.annualRemaining}
                </strong>
              </p>
            </div>
          </div>
        </div>

        {/* Sick */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted mb-3">
                {t("leave.sick")}
              </h6>

              <p className="mb-1">
                {t("leave.total")}:{" "}
                <strong>{data.sick.total}</strong>
              </p>

              <p className="mb-1">
                {t("leave.used")}:{" "}
                <strong>{data.sick.usedPaid}</strong>
              </p>

              <p className="mb-0">
                {t("leave.remaining")}:{" "}
                <strong className="text-success">
                  {computed.sickRemaining}
                </strong>
              </p>
            </div>
          </div>
        </div>

        {/* Unpaid */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted mb-3">
                {t("leave.unpaid")}
              </h6>

              <p className="mb-1">
                {t("leave.absentDays")}:{" "}
                <strong>{data.unpaid.absentDays}</strong>
              </p>

              <p className="mb-0">
                {t("leave.unpaidDays")}:{" "}
                <strong>{data.unpaid.unpaidLeaveDays}</strong>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
