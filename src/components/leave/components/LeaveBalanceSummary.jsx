
// import { useTranslation } from 'react-i18next';

// function LeaveBalanceSummary({ summary }) {
//   const { t } = useTranslation();

//   if (!summary) return null;

//   return (
//     <div className="card shadow-sm mb-4">
//       <div className="card-header fw-semibold">
//         <i className="fa-solid fa-chart-pie me-2 text-primary" />
//         {t('leave.balance.title')}
//       </div>

//       <div className="card-body row g-3">

//         {/* Annual */}
//         <div className="col-md-4">
//           <div className="border rounded p-3 h-100">
//             <h6 className="fw-semibold mb-2">
//               {t('leave.types.annual')}
//             </h6>
//             <div className="small">
//               {t('leave.paidTaken')}: <strong>{summary.annual.takenPaid}</strong>
//             </div>
//             <div className="small">
//               {t('leave.unpaidTaken')}: <strong>{summary.annual.takenUnpaid}</strong>
//             </div>
//             <div className="small">
//               {t('leave.remaining')}: <strong>{summary.annual.remaining}</strong>
//             </div>
//           </div>
//         </div>

//         {/* Sick */}
//         <div className="col-md-4">
//           <div className="border rounded p-3 h-100">
//             <h6 className="fw-semibold mb-2">
//               {t('leave.types.sick')}
//             </h6>
//             <div className="small">
//               {t('leave.paidTaken')}: <strong>{summary.sick.takenPaid}</strong>
//             </div>
//           </div>
//         </div>

//         {/* Unpaid */}
//         <div className="col-md-4">
//           <div className="border rounded p-3 h-100">
//             <h6 className="fw-semibold mb-2">
//               {t('leave.types.unpaid')}
//             </h6>
//             <div className="small">
//               {t('leave.totalTaken')}: <strong>{summary.unpaid.totalTaken}</strong>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default LeaveBalanceSummary;
// src/components/leave/components/LeaveBalanceSummary.jsx
import { useTranslation } from 'react-i18next';

function LeaveBalanceSummary({ summary }) {
  const { t } = useTranslation();

  if (!summary) return null;

  const { year, annual, sick } = summary;

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header fw-semibold">
        {t('leave.balance.title', { year })}
      </div>

      <div className="card-body row g-4">

        {/* Annual Leave */}
        <div className="col-md-6">
          <div className="border rounded p-3 h-100">
            <h6 className="fw-semibold mb-3">
              {t('leave.types.annual')}
            </h6>

            <div className="d-flex justify-content-between">
              <span>{t('leave.balance.total')}:</span>
              <strong>{annual.total}</strong>
            </div>

            <div className="d-flex justify-content-between text-success">
              <span>{t('leave.balance.usedPaid')}:</span>
              <strong>{annual.usedPaid}</strong>
            </div>

            <div className="d-flex justify-content-between text-muted">
              <span>{t('leave.balance.usedUnpaid')}:</span>
              <strong>{annual.usedUnpaid}</strong>
            </div>

            <hr />

            <div className="d-flex justify-content-between fw-semibold">
              <span>{t('leave.balance.remaining')}:</span>
              <strong>{annual.remaining}</strong>
            </div>
          </div>
        </div>

        {/* Sick Leave */}
        <div className="col-md-6">
          <div className="border rounded p-3 h-100">
            <h6 className="fw-semibold mb-3">
              {t('leave.types.sick')}
            </h6>

            <div className="d-flex justify-content-between">
              <span>{t('leave.balance.total')}:</span>
              <strong>{sick.total}</strong>
            </div>

            <div className="d-flex justify-content-between text-success">
              <span>{t('leave.balance.used')}:</span>
              <strong>{sick.used}</strong>
            </div>

            <hr />

            <div className="d-flex justify-content-between fw-semibold">
              <span>{t('leave.balance.remaining')}:</span>
              <strong>{sick.remaining}</strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LeaveBalanceSummary;

// function LeaveBalanceSummary({ summary }) {
//   if (!summary) return null;

//   const { year, annual, sick } = summary;

//   return (
//     <div className="card shadow-sm mb-4">
//       <div className="card-header fw-semibold">
//         ملخص رصيد الإجازات – سنة {year}
//       </div>

//       <div className="card-body row g-4">

//         {/* Annual Leave */}
//         <div className="col-md-6">
//           <div className="border rounded p-3 h-100">
//             <h6 className="fw-semibold mb-3">الإجازة السنوية</h6>

//             <div className="d-flex justify-content-between">
//               <span>الإجمالي:</span>
//               <strong>{annual.total}</strong>
//             </div>

//             <div className="d-flex justify-content-between text-success">
//               <span>المستخدم (مدفوع):</span>
//               <strong>{annual.usedPaid}</strong>
//             </div>

//             <div className="d-flex justify-content-between text-warning">
//               <span>المستخدم (غير مدفوع):</span>
//               <strong>{annual.usedUnpaid}</strong>
//             </div>

//             <hr />

//             <div className="d-flex justify-content-between">
//               <span>المتبقي:</span>
//               <strong>{annual.remaining}</strong>
//             </div>
//           </div>
//         </div>

//         {/* Sick Leave */}
//         <div className="col-md-6">
//           <div className="border rounded p-3 h-100">
//             <h6 className="fw-semibold mb-3">الإجازة المرضية</h6>

//             <div className="d-flex justify-content-between">
//               <span>الإجمالي:</span>
//               <strong>{sick.total}</strong>
//             </div>

//             <div className="d-flex justify-content-between text-success">
//               <span>المستخدم:</span>
//               <strong>{sick.used}</strong>
//             </div>

//             <hr />

//             <div className="d-flex justify-content-between">
//               <span>المتبقي:</span>
//               <strong>{sick.remaining}</strong>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default LeaveBalanceSummary;
