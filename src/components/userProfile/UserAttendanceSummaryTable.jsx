





// import { useTranslation } from 'react-i18next';

// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// // UserAttendanceSummaryTable
// // Source: DailyAttendanceSummary (من /admin/user-monthly-report)
// //
// // ✅ FIX 1 — field names صح:
// //   ❌ day.dayType                   → ✅ day.dayStatus
// //   ❌ day.lateMinutes               → ✅ day.totalLateMinutes
// //   ❌ day.earlyLeaveMinutes         → ✅ day.totalEarlyLeaveMinutes
// //   ❌ day.transitDeductionMinutes   → ✅ day.totalTransitDeductionMinutes
// //   ❌ day.adminNote (string)        → ✅ day.adminNotes (array)
// //
// // ✅ FIX 2 — date string للـ openDetails:
// //   ❌ day.date (ISO string قد يكون UTC)
// //   ✅ localDateStr(day.date) → yyyy-mm-dd بـ local time دايماً
// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// const localDateStr = (value) => {
//   const d = new Date(value);
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, '0');
//   const day = String(d.getDate()).padStart(2, '0');
//   return `${y}-${m}-${day}`;
// };

// // dayStatus → badge color (من DailyAttendanceSummary schema)
// const STATUS_COLOR = {
//   working:         'success',
//   holiday:         'info',
//   leave_paid:      'primary',
//   leave_unpaid:    'warning',
//   absent:          'danger',
//   non_working_day: 'secondary',
//   no_data:         'light'
// };

// const STATUS_ICON = {
//   working:         '🟢',
//   holiday:         '🎉',
//   leave_paid:      '🏖️',
//   leave_unpaid:    '⚠️',
//   absent:          '❌',
//   non_working_day: '📅',
//   no_data:         '—'
// };

// function UserAttendanceSummaryTable({ days = [], loading = false, onOpenDetails }) {
//   const { t } = useTranslation();

//   if (loading) {
//     return (
//       <div className="text-center py-5">
//         <div className="spinner-border text-primary" />
//       </div>
//     );
//   }

//   if (!Array.isArray(days) || days.length === 0) {
//     return <div className="text-center py-5 text-muted">{t('noData')}</div>;
//   }

//   return (
//     <div className="table-responsive">
//       <table className="table table-hover align-middle">
//         <thead className="table-primary">
//           <tr>
//             <th>{t('date')}</th>
//             <th>{t('branches')}</th>
//             <th>{t('dayStatus')}</th>
//             <th>{t('summary')}</th>
//             <th className="text-center">👁️</th>
//           </tr>
//         </thead>

//         <tbody>
//           {days.map(day => {
//             const dateObj = new Date(day.date);

//             // ✅ FIX: dayStatus مش dayType
//             const status = day.dayStatus || 'no_data';

//             // ✅ FIX: الأسماء الصح من DailyAttendanceSummary
//             const lateMin       = day.totalLateMinutes             || 0;
//             const earlyMin      = day.totalEarlyLeaveMinutes       || 0;
//             const transitMin    = day.totalTransitDeductionMinutes || 0;
//             const earlyArrival  = day.earlyArrivalMinutes          || 0;
//             const lateDeparture = day.lateDepartureMinutes         || 0;

//             const hasPenalty = lateMin > 0 || earlyMin > 0 || transitMin > 0;
//             const hasBonus   = earlyArrival > 0 || lateDeparture > 0;

//             return (
//               <tr key={day._id || day.date}>

//                 {/* Date */}
//                 <td>
//                   {dateObj.toLocaleDateString()}
//                   <br />
//                   <small className="text-muted">
//                     {dateObj.toLocaleString('en-US', { weekday: 'long' })}
//                   </small>
//                 </td>

//                 {/* Branches */}
//                 <td>
//                   {day.branchesVisited?.length ? (
//                     day.branchesVisited.map(b => (
//                       <div key={b.branch} className="d-flex align-items-center">
//                         <i className="fas fa-building text-secondary me-2" />
//                         <span>{b.name}</span>
//                         {b.hasInvalid && (
//                           <i className="fas fa-exclamation-circle text-danger ms-2"
//                             title="Invalidated attendance" />
//                         )}
//                       </div>
//                     ))
//                   ) : (
//                     <span className="text-muted">—</span>
//                   )}
//                 </td>

//                 {/* Day Status — ✅ dayStatus */}
//                 <td>
//                   <span className={`badge bg-${STATUS_COLOR[status] || 'secondary'}`}>
//                     {STATUS_ICON[status] || ''} {t(status)}
//                   </span>

//                   {/* ✅ FIX: adminNotes هو array مش string */}
//                   {day.adminNotes?.length > 0 && (
//                     <div className="small text-muted mt-1">
//                       <i className="fas fa-info-circle me-1" />
//                       {day.adminNotes.join(' · ')}
//                     </div>
//                   )}
//                 </td>

//                 {/* Summary */}
//                 <td>
//                   {day.firstCheckInTime && (
//                     <div className="small">
//                       <strong>{t('firstIn')}:</strong>{' '}
//                       {new Date(day.firstCheckInTime).toLocaleTimeString()}
//                     </div>
//                   )}
//                   {day.lastCheckOutTime && (
//                     <div className="small">
//                       <strong>{t('lastOut')}:</strong>{' '}
//                       {new Date(day.lastCheckOutTime).toLocaleTimeString()}
//                     </div>
//                   )}

//                   {/* ✅ FIX: totalLateMinutes */}
//                   {lateMin > 0 && (
//                     <div className="small text-warning">
//                       ⏰ {t('late')}: {lateMin} {t('minutes')}
//                     </div>
//                   )}

//                   {/* ✅ FIX: totalEarlyLeaveMinutes */}
//                   {earlyMin > 0 && (
//                     <div className="small text-danger">
//                       🚪 {t('earlyLeave')}: {earlyMin} {t('minutes')}
//                     </div>
//                   )}

//                   {earlyArrival > 0 && (
//                     <div className="small text-success">
//                       ⬅️ {t('earlyArrival')}: {earlyArrival} {t('minutes')}
//                     </div>
//                   )}

//                   {lateDeparture > 0 && (
//                     <div className="small text-success">
//                       ➡️ {t('lateDeparture')}: {lateDeparture} {t('minutes')}
//                     </div>
//                   )}

//                   {/* ✅ FIX: totalTransitDeductionMinutes */}
//                   {transitMin > 0 && (
//                     <div className="small text-danger">
//                       🚕 {t('transitDeduction')}: {transitMin} {t('minutes')}
//                     </div>
//                   )}

//                   {!hasPenalty && !hasBonus && (
//                     <span className="small text-muted">{t('noPenalties')}</span>
//                   )}
//                 </td>

//                 {/* Details — ✅ FIX: localDateStr بدل day.date مباشرة */}
//                 <td className="text-center">
//                   <button
//                     className="btn btn-sm btn-outline-primary"
//                     onClick={() => onOpenDetails?.({ date: localDateStr(day.date) })}
//                   >
//                     <i className="fas fa-eye" />
//                   </button>
//                 </td>

//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default UserAttendanceSummaryTable;




//--------------------------ui 1

import { useTranslation } from 'react-i18next';
import "/src/style/attendanceProfile.css";

/* ══════════════════════════════════════════════════════════════
   UserAttendanceSummaryTable
   ─────────────────────────────────────────────────────────────
   Source  : DailyAttendanceSummary  (backend)
   Endpoint: GET /admin/attendance/:userId
             GET /admin/user-monthly-report
   ─────────────────────────────────────────────────────────────
   ✅ Schema-correct field names:
        dayStatus  /  totalLateMinutes  /  totalEarlyLeaveMinutes
        totalTransitDeductionMinutes  /  adminNotes[]
   ✅ localDateStr() — yyyy-mm-dd local time (never toISOString)
   ✅ Pagination props from backend: page / pages / total / limit
   ✅ Zero front-end calculation — display only
══════════════════════════════════════════════════════════════ */

/* ── Helpers ─────────────────────────────────────────────────*/
const localDateStr = (value) => {
  const d = new Date(value);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
};

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });

const formatWeekday = (value) =>
  new Date(value).toLocaleDateString('en-US', { weekday: 'long' });

const formatTime = (value) =>
  value
    ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

/* ── Status configuration ────────────────────────────────────*/
const STATUS_CFG = {
  working:         { dot: true, label: 'working' },
  holiday:         { dot: true, label: 'holiday' },
  leave_paid:      { dot: true, label: 'leavePaid' },
  leave_unpaid:    { dot: true, label: 'leaveUnpaid' },
  absent:          { dot: true, label: 'absent' },
  non_working_day: { dot: true, label: 'nonWorkingDay' },
  no_data:         { dot: true, label: 'noData' },
};

/* ── Skeleton row ────────────────────────────────────────────*/
function SkeletonRow() {
  const widths = [80, 110, 90, 130, 32];
  return (
    <tr>
      {widths.map((w, i) => (
        <td key={i} style={{ padding: '14px 16px' }}>
          <div className="att-skeleton att-skeleton-cell" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

/* ── Pagination ──────────────────────────────────────────────*/
function Pagination({ page, pages, total, limit, onPageChange }) {
  const { t } = useTranslation();
  if (!pages || pages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to   = Math.min(page * limit, total);

  const buildRange = () => {
    const range = [];
    const delta = 2;
    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= page - delta && i <= page + delta)) {
        range.push(i);
      } else if (range[range.length - 1] !== '…') {
        range.push('…');
      }
    }
    return range;
  };

  return (
    <div className="att-pagination">
      <span className="att-pagination__info">
        {t('showing', { from, to, total })}
      </span>
      <div className="att-pagination__controls">
        <button
          className="att-page-btn"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label={t('previous')}
        >
          <i className="fas fa-chevron-left" style={{ fontSize: '.7rem' }} />
        </button>

        {buildRange().map((p, i) =>
          p === '…' ? (
            <span key={`e${i}`} className="att-page-ellipsis">…</span>
          ) : (
            <button
              key={p}
              className={`att-page-btn${p === page ? ' att-page-btn--active' : ''}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}

        <button
          className="att-page-btn"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
          aria-label={t('next')}
        >
          <i className="fas fa-chevron-right" style={{ fontSize: '.7rem' }} />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Main component
══════════════════════════════════════════════════════════════ */
function UserAttendanceSummaryTable({
  days         = [],    // DailyAttendanceSummary[]
  loading      = false,
  page         = 1,     // ← from backend
  pages        = 1,     // ← from backend
  total        = 0,     // ← from backend
  limit        = 20,    // ← from backend
  onPageChange,         // (newPage: number) => void
  onOpenDetails,        // ({ userId, date }) => void
}) {
  const { t } = useTranslation();

  return (
    <div className="att-table-card">

      {/* Toolbar */}
      <div className="att-table-toolbar">
        <div className="att-table-toolbar__title">
          <i className="fas fa-calendar-check" />
          {t('attendanceSummary')}
        </div>
        {total > 0 && (
          <span className="att-record-count">
            {total} {t('records')}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="att-table-scroll">
        <table className="att-table">
          <thead>
            <tr>
              <th>{t('date')}</th>
              <th>{t('branches')}</th>
              <th>{t('dayStatus')}</th>
              <th>{t('summary')}</th>
              <th style={{ textAlign: 'center', width: 52 }}>{t('details')}</th>
            </tr>
          </thead>

          <tbody>
            {/* Loading skeleton */}
            {loading && Array.from({ length: Math.min(limit, 8) }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}

            {/* Empty */}
            {!loading && days.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <div className="att-state">
                    <div className="att-state__icon">📋</div>
                    <div className="att-state__text">{t('noData')}</div>
                  </div>
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!loading && days.map((day) => {
              const status  = day.dayStatus || 'no_data';
              const cfg     = STATUS_CFG[status] || STATUS_CFG.no_data;

              /* ✅ correct field names from DailyAttendanceSummary schema */
              const lateMin    = day.totalLateMinutes             || 0;
              const earlyMin   = day.totalEarlyLeaveMinutes       || 0;
              const transitMin = day.totalTransitDeductionMinutes || 0;
              const earlyArr   = day.earlyArrivalMinutes          || 0;
              const lateDep    = day.lateDepartureMinutes         || 0;

              const hasPenalty = lateMin > 0 || earlyMin > 0 || transitMin > 0;
              const hasBonus   = earlyArr > 0 || lateDep > 0;

              const cIn  = formatTime(day.firstCheckInTime);
              const cOut = formatTime(day.lastCheckOutTime);

              /* ✅ localDateStr — never toISOString */
              const dateStr = localDateStr(day.date);
              const userId  = day.user?._id || day.user;

              return (
                <tr
                  key={day._id || day.date}
                  onClick={() => onOpenDetails?.({ userId, date: dateStr })}
                  style={{ cursor: 'pointer' }}
                >

                  {/* Date */}
                  <td>
                    <div className="att-date-main">{formatDate(day.date)}</div>
                    <div className="att-date-sub">{formatWeekday(day.date)}</div>
                  </td>

                  {/* Branches — branchesVisited from backend */}
                  <td>
                    {day.branchesVisited?.length ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {day.branchesVisited.map((b, i) => (
                          <span
                            key={b.branch || i}
                            className={`att-branch-tag${b.hasInvalid ? ' att-branch-tag--invalid' : ''}`}
                          >
                            <i className="fas fa-building" />
                            {b.name}
                            {b.hasInvalid && (
                              <i className="fas fa-exclamation-circle" title={t('invalidatedAttendance')} />
                            )}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--att-ink-4)', fontSize: '.8rem' }}>—</span>
                    )}
                  </td>

                  {/* Day Status */}
                  <td>
                    <span className={`att-status-badge ${status}`}>
                      {cfg.dot && <span className="att-status-dot" />}
                      {t(cfg.label)}
                    </span>

                    {/* nonWorkingReason chip */}
                    {day.nonWorkingReason && (
                      <div style={{ marginTop: 4 }}>
                        <span
                          style={{
                            background: '#f0f9ff',
                            color: '#075985',
                            borderRadius: 5,
                            padding: '1px 8px',
                            fontSize: '.7rem',
                            fontWeight: 600,
                            display: 'inline-block',
                          }}
                        >
                          {day.nonWorkingReason === 'HOLIDAY' ? t('holiday') : t('weeklyOff')}
                        </span>
                      </div>
                    )}

                    {/* ✅ adminNotes — array from backend */}
                    {day.adminNotes?.length > 0 && (
                      <div style={{ marginTop: 5, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {day.adminNotes.map((note, i) => (
                          <span key={i} className="att-note-chip">
                            <i className="fas fa-sticky-note" style={{ fontSize: '.6rem' }} />
                            {note}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Summary */}
                  <td>
                    {(cIn || cOut) && (
                      <div style={{ marginBottom: 5 }}>
                        {cIn  && <div className="att-time-row"><span className="att-time-label">{t('in')}</span><span className="att-time-val">{cIn}</span></div>}
                        {cOut && <div className="att-time-row"><span className="att-time-label">{t('out')}</span><span className="att-time-val">{cOut}</span></div>}
                      </div>
                    )}

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {/* ✅ totalLateMinutes */}
                      {lateMin > 0    && <span className="att-chip att-chip--late">⏰ {lateMin}{t('min')}</span>}
                      {/* ✅ totalEarlyLeaveMinutes */}
                      {earlyMin > 0   && <span className="att-chip att-chip--early">🚪 {earlyMin}{t('min')}</span>}
                      {/* ✅ totalTransitDeductionMinutes */}
                      {transitMin > 0 && <span className="att-chip att-chip--transit">🚕 {transitMin}{t('min')}</span>}
                      {earlyArr > 0   && <span className="att-chip att-chip--bonus">↙ +{earlyArr}{t('min')}</span>}
                      {lateDep > 0    && <span className="att-chip att-chip--bonus">↗ +{lateDep}{t('min')}</span>}

                      {!hasPenalty && !hasBonus && (
                        <span className="att-no-penalty">
                          <i className="fas fa-check" />
                          {t('noPenalties')}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Eye button — ✅ localDateStr */}
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="att-eye-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDetails?.({ userId, date: dateStr });
                      }}
                      title={t('viewDetails')}
                    >
                      <i className="fas fa-eye" />
                    </button>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination — page/pages/total all from backend */}
      {!loading && (
        <Pagination
          page={page}
          pages={pages}
          total={total}
          limit={limit}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

export default UserAttendanceSummaryTable;

















// //----------------------------------------------------------------ui

// import { useTranslation } from 'react-i18next';
// import { useState, useEffect } from 'react';

// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// // UserAttendanceSummaryTable — Super Wow Professional Edition
// // Dark analytics dashboard aesthetic
// // Fonts: DM Mono (numbers/times) + Syne (UI text) via Google Fonts
// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// const localDateStr = (value) => {
//   const d = new Date(value);
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, '0');
//   const day = String(d.getDate()).padStart(2, '0');
//   return `${y}-${m}-${day}`;
// };

// const fmtTime = (iso) => {
//   if (!iso) return null;
//   return new Date(iso).toLocaleTimeString('en-US', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//   });
// };

// const STATUS_LABEL = {
//   working:         'Working',
//   holiday:         'Holiday',
//   leave_paid:      'Paid Leave',
//   leave_unpaid:    'Unpaid Leave',
//   absent:          'Absent',
//   non_working_day: 'Day Off',
//   no_data:         'No Data',
// };

// // ─── Styles ───────────────────────────────────────────────────────

// const FONT_LINK = 'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;500;600;700&display=swap';

// const css = `
//   @import url('${FONT_LINK}');

//   .uat-root {
//     --bg:       #071340;
//     --surface:  #071340;
//     --surface2: #18191e;
//     --border:   rgba(255,255,255,0.07);
//     --border2:  rgba(255,255,255,0.12);
//     --text:     #e8eaf0;
//     --muted:    #6b7280;
//     --accent:   #6c8efb;
//     --green:    #4ade80;
//     --amber:    #fbbf24;
//     --red:      #f87171;
//     --violet:   #a78bfa;
//     font-family: 'Syne', sans-serif;
//     color: var(--text);
//     background: var(--bg);
//     border-radius: 20px;
//     padding: 1.75rem;
//   }

//   /* Header */
//   .uat-header {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     margin-bottom: 1.5rem;
//   }
//   .uat-title-group { display: flex; align-items: center; gap: 12px; }
//   .uat-pulse {
//     width: 8px; height: 8px; border-radius: 50%;
//     background: var(--accent);
//     box-shadow: 0 0 10px var(--accent);
//     animation: uatPulse 2s ease-in-out infinite;
//     flex-shrink: 0;
//   }
//   @keyframes uatPulse {
//     0%,100% { opacity:1; transform:scale(1); }
//     50%      { opacity:0.45; transform:scale(0.75); }
//   }
//   .uat-title {
//     font-size: 13px; font-weight: 600;
//     letter-spacing: 0.1em; text-transform: uppercase; color: var(--text);
//   }
//   .uat-month-badge {
//     font-size: 11px; font-weight: 500;
//     padding: 4px 12px; border-radius: 20px;
//     background: var(--surface2);
//     border: 0.5px solid var(--border2);
//     color: var(--muted);
//     letter-spacing: 0.06em; text-transform: uppercase;
//     font-family: 'DM Mono', monospace;
//   }

//   /* Stats strip */
//   .uat-stats {
//     display: grid;
//     grid-template-columns: repeat(4, 1fr);
//     gap: 10px;
//     margin-bottom: 1.5rem;
//   }
//   .uat-stat {
//     background: var(--surface);
//     border: 0.5px solid var(--border);
//     border-radius: 12px;
//     padding: 12px 16px;
//     display: flex; flex-direction: column; gap: 4px;
//     transition: border-color 0.2s;
//   }
//   .uat-stat:hover { border-color: var(--border2); }
//   .uat-stat-label {
//     font-size: 10px; font-weight: 500;
//     letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted);
//   }
//   .uat-stat-value {
//     font-size: 22px; font-weight: 700;
//     font-family: 'DM Mono', monospace;
//   }
//   .uat-stat-value.blue   { color: var(--accent); }
//   .uat-stat-value.green  { color: var(--green); }
//   .uat-stat-value.amber  { color: var(--amber); }
//   .uat-stat-value.red    { color: var(--red); }

//   /* Table */
//   .uat-table-wrap {
//     background: var(--surface);
//     border: 0.5px solid var(--border);
//     border-radius: 16px;
//     overflow: hidden;
//   }
//   .uat-table {
//     width: 100%; border-collapse: collapse; table-layout: fixed;
//   }
//   .uat-table colgroup col:nth-child(1) { width: 110px; }
//   .uat-table colgroup col:nth-child(2) { width: 140px; }
//   .uat-table colgroup col:nth-child(3) { width: 130px; }
//   .uat-table colgroup col:nth-child(4) { width: auto; }
//   .uat-table colgroup col:nth-child(5) { width: 56px; }

//   .uat-thead tr { border-bottom: 0.5px solid var(--border2); }
//   .uat-thead th {
//     padding: 12px 16px;
//     font-size: 10px; font-weight: 600;
//     letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted);
//     text-align: left;
//     background: var(--surface2);
//   }
//   .uat-thead th:last-child { text-align: center; }

//   .uat-tbody tr {
//     border-bottom: 0.5px solid var(--border);
//     transition: background 0.15s;
//     cursor: pointer;
//   }
//   .uat-tbody tr:last-child { border-bottom: none; }
//   .uat-tbody tr:hover { background: var(--surface2); }

//   .uat-tbody td {
//     padding: 14px 16px;
//     font-size: 13px; vertical-align: middle; color: var(--text);
//   }
//   .uat-tbody td:last-child { text-align: center; }

//   /* Date cell */
//   .uat-date-main {
//     font-size: 13px; font-weight: 600;
//     font-family: 'DM Mono', monospace;
//   }
//   .uat-date-day {
//     font-size: 10px; color: var(--muted);
//     letter-spacing: 0.05em; text-transform: uppercase; margin-top: 2px;
//   }

//   /* Branch cell */
//   .uat-branch {
//     display: flex; align-items: center; gap: 6px;
//     font-size: 12px; margin-bottom: 2px;
//   }
//   .uat-branch-dot {
//     width: 5px; height: 5px; border-radius: 50%;
//     background: var(--muted); flex-shrink: 0;
//   }
//   .uat-branch-warn { color: var(--red); font-size: 10px; margin-left: 2px; }

//   /* Status badge */
//   .uat-badge {
//     display: inline-flex; align-items: center; gap: 5px;
//     padding: 4px 10px; border-radius: 20px;
//     font-size: 11px; font-weight: 600;
//     letter-spacing: 0.04em; white-space: nowrap;
//   }
//   .uat-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
//   .uat-badge.working        { background: rgba(74,222,128,0.12);  color: #4ade80; border: 0.5px solid rgba(74,222,128,0.3); }
//   .uat-badge.holiday        { background: rgba(108,142,251,0.12); color: #6c8efb; border: 0.5px solid rgba(108,142,251,0.3); }
//   .uat-badge.leave_paid     { background: rgba(167,139,250,0.12); color: #a78bfa; border: 0.5px solid rgba(167,139,250,0.3); }
//   .uat-badge.leave_unpaid   { background: rgba(251,191,36,0.12);  color: #fbbf24; border: 0.5px solid rgba(251,191,36,0.3); }
//   .uat-badge.absent         { background: rgba(248,113,113,0.12); color: #f87171; border: 0.5px solid rgba(248,113,113,0.3); }
//   .uat-badge.non_working_day{ background: rgba(107,114,128,0.12); color: #9ca3af; border: 0.5px solid rgba(107,114,128,0.3); }
//   .uat-badge.no_data        { background: rgba(107,114,128,0.08); color: var(--muted); border: 0.5px solid var(--border); }
//   .uat-admin-note { font-size: 10px; color: var(--muted); margin-top: 5px; font-style: italic; }

//   /* Summary cell */
//   .uat-time-block { display: flex; flex-direction: column; gap: 3px; }
//   .uat-time-row   { display: flex; align-items: center; gap: 6px; font-size: 11px; }
//   .uat-time-label { color: var(--muted); font-size: 10px; letter-spacing: 0.04em; text-transform: uppercase; min-width: 36px; }
//   .uat-time-val   { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--text); }
//   .uat-penalty    { display: flex; align-items: center; gap: 5px; font-size: 11px; margin-top: 3px; }
//   .uat-penalty.late    { color: var(--amber); }
//   .uat-penalty.early   { color: var(--red); }
//   .uat-penalty.transit { color: var(--red); }
//   .uat-bonus           { color: var(--green); font-size: 11px; margin-top: 2px; }
//   .uat-clean           { font-size: 11px; color: var(--muted); }

//   /* Eye button */
//   .uat-btn-eye {
//     width: 30px; height: 30px; border-radius: 8px;
//     border: 0.5px solid var(--border2); background: transparent;
//     cursor: pointer;
//     display: inline-flex; align-items: center; justify-content: center;
//     color: var(--muted);
//     transition: background 0.15s, border-color 0.15s, color 0.15s;
//   }
//   .uat-btn-eye:hover { background: var(--surface2); border-color: var(--accent); color: var(--accent); }

//   /* Empty / loading */
//   .uat-center { text-align: center; padding: 3rem; color: var(--muted); font-size: 13px; }
//   .uat-spinner {
//     width: 28px; height: 28px;
//     border: 2px solid var(--border2);
//     border-top-color: var(--accent);
//     border-radius: 50%;
//     animation: uatSpin 0.7s linear infinite;
//     margin: 0 auto 1rem;
//   }
//   @keyframes uatSpin { to { transform: rotate(360deg); } }

//   /* Row entrance animation */
//   .uat-tbody tr {
//     animation: uatFadeIn 0.3s ease both;
//   }
//   @keyframes uatFadeIn {
//     from { opacity: 0; transform: translateY(6px); }
//     to   { opacity: 1; transform: none; }
//   }
// `;

// // ─── Sub-components ───────────────────────────────────────────────

// function StatCard({ label, value, color }) {
//   return (
//     <div className="uat-stat">
//       <div className="uat-stat-label">{label}</div>
//       <div className={`uat-stat-value ${color}`}>{value}</div>
//     </div>
//   );
// }

// function StatusBadge({ status, adminNotes }) {
//   return (
//     <>
//       <span className={`uat-badge ${status}`}>
//         <span className="uat-badge-dot" />
//         {STATUS_LABEL[status] || status}
//       </span>
//       {adminNotes?.length > 0 && (
//         <div className="uat-admin-note">{adminNotes.join(' · ')}</div>
//       )}
//     </>
//   );
// }

// function BranchCell({ branches }) {
//   if (!branches?.length) return <span style={{ color: 'var(--muted)', fontSize: 12 }}>—</span>;
//   return (
//     <>
//       {branches.map((b) => (
//         <div key={b.branch} className="uat-branch">
//           <span className="uat-branch-dot" />
//           <span style={{ fontSize: 12 }}>{b.name}</span>
//           {b.hasInvalid && <span className="uat-branch-warn">⚠</span>}
//         </div>
//       ))}
//     </>
//   );
// }

// function SummaryCell({ day }) {
//   const lateMin    = day.totalLateMinutes             || 0;
//   const earlyMin   = day.totalEarlyLeaveMinutes       || 0;
//   const transitMin = day.totalTransitDeductionMinutes || 0;
//   const earlyArr   = day.earlyArrivalMinutes          || 0;
//   const lateDep    = day.lateDepartureMinutes         || 0;
//   const hasPenalty = lateMin > 0 || earlyMin > 0 || transitMin > 0;
//   const hasBonus   = earlyArr > 0 || lateDep > 0;
//   const checkIn    = fmtTime(day.firstCheckInTime);
//   const checkOut   = fmtTime(day.lastCheckOutTime);

//   return (
//     <div className="uat-time-block">
//       {checkIn && (
//         <div className="uat-time-row">
//           <span className="uat-time-label">In</span>
//           <span className="uat-time-val">{checkIn}</span>
//         </div>
//       )}
//       {checkOut && (
//         <div className="uat-time-row">
//           <span className="uat-time-label">Out</span>
//           <span className="uat-time-val">{checkOut}</span>
//         </div>
//       )}
//       {lateMin    > 0 && <div className="uat-penalty late">▲ Late {lateMin}m</div>}
//       {earlyMin   > 0 && <div className="uat-penalty early">▼ Early leave {earlyMin}m</div>}
//       {transitMin > 0 && <div className="uat-penalty transit">◆ Transit -{transitMin}m</div>}
//       {earlyArr   > 0 && <div className="uat-bonus">● Early arrival +{earlyArr}m</div>}
//       {lateDep    > 0 && <div className="uat-bonus">● Overtime +{lateDep}m</div>}
//       {!hasPenalty && !hasBonus && !checkIn && (
//         <span className="uat-clean">—</span>
//       )}
//     </div>
//   );
// }

// // ─── Eye icon SVG ─────────────────────────────────────────────────

// function EyeIcon() {
//   return (
//     <svg
//       width="14" height="14"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//       <circle cx="12" cy="12" r="3" />
//     </svg>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────

// function UserAttendanceSummaryTable({ days = [], loading = false, onOpenDetails, monthLabel }) {
//   const { t } = useTranslation();

//   // Inject Google Fonts once
//   useEffect(() => {
//     if (!document.getElementById('uat-font-link')) {
//       const link = document.createElement('link');
//       link.id   = 'uat-font-link';
//       link.rel  = 'stylesheet';
//       link.href = FONT_LINK;
//       document.head.appendChild(link);
//     }
//   }, []);

//   // Computed stats
//   const working   = days.filter(d => d.dayStatus === 'working').length;
//   const absent    = days.filter(d => d.dayStatus === 'absent').length;
//   const totalLate = days.reduce((s, d) => s + (d.totalLateMinutes || 0), 0);
//   const totalOT   = days.reduce((s, d) => s + (d.lateDepartureMinutes || 0), 0);

//   // ── Render states ──────────────────────────────────────────────
//   const renderBody = () => {
//     if (loading) {
//       return (
//         <tr>
//           <td colSpan={5}>
//             <div className="uat-center">
//               <div className="uat-spinner" />
//               Loading attendance data…
//             </div>
//           </td>
//         </tr>
//       );
//     }
//     if (!Array.isArray(days) || days.length === 0) {
//       return (
//         <tr>
//           <td colSpan={5}>
//             <div className="uat-center">{t('noData')}</div>
//           </td>
//         </tr>
//       );
//     }
//     return days.map((day, i) => {
//       const dateObj = new Date(day.date);
//       const dateStr = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
//       const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
//       const status  = day.dayStatus || 'no_data';

//       return (
//         <tr
//           key={day._id || day.date}
//           style={{ animationDelay: `${i * 40}ms` }}
//           onClick={() => onOpenDetails?.({ date: localDateStr(day.date) })}
//         >
//           {/* Date */}
//           <td>
//             <div className="uat-date-main">{dateStr}</div>
//             <div className="uat-date-day">{dayName}</div>
//           </td>

//           {/* Branch */}
//           <td>
//             <BranchCell branches={day.branchesVisited} />
//           </td>

//           {/* Status */}
//           <td>
//             <StatusBadge status={status} adminNotes={day.adminNotes} />
//           </td>

//           {/* Summary */}
//           <td>
//             <SummaryCell day={day} />
//           </td>

//           {/* Eye */}
//           <td>
//             <button
//               className="uat-btn-eye"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onOpenDetails?.({ date: localDateStr(day.date) });
//               }}
//             >
//               <EyeIcon />
//             </button>
//           </td>
//         </tr>
//       );
//     });
//   };

//   return (
//     <>
//       {/* Scoped styles */}
//       <style>{css}</style>

//       <div className="uat-root">
//         {/* Header */}
//         <div className="uat-header">
//           <div className="uat-title-group">
//             <div className="uat-pulse" />
//             <span className="uat-title">Attendance Summary</span>
//           </div>
//           {monthLabel && <span className="uat-month-badge">{monthLabel}</span>}
//         </div>

//         {/* Stats strip — only when we have data */}
//         {/* {!loading && days.length > 0 && (
//           <div className="uat-stats">
//             <StatCard label="Working Days" value={working}   color="blue"  />
//             <StatCard label="Absences"     value={absent}    color="red"   />
//             <StatCard label="Late (min)"   value={totalLate} color="amber" />
//             <StatCard label="Overtime (min)" value={totalOT} color="green" />
//           </div>
//         )} */}

//         {/* Table */}
//         <div className="uat-table-wrap">
//           <table className="uat-table">
//             <colgroup>
//               <col /><col /><col /><col /><col />
//             </colgroup>
//             <thead className="uat-thead">
//               <tr>
//                 <th>{t('date')}</th>
//                 <th>{t('branches')}</th>
//                 <th>{t('dayStatus')}</th>
//                 <th>{t('summary')}</th>
//                 <th />
//               </tr>
//             </thead>
//             <tbody className="uat-tbody">
//               {renderBody()}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// }

// export default UserAttendanceSummaryTable;