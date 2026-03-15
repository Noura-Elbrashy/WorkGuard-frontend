// src/pages/Reports/components/DailyDetailsTable.jsx
import { useTranslation } from 'react-i18next';

function fmtTime(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}
function fmtMin(m) {
  if (!m) return '—';
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

const ROW_CLASS = {
  WORKING_DAY:          'day-row-working',
  ABSENT_NO_PERMISSION: 'day-row-absent',
  LEAVE_PAID:           'day-row-paid-leave',
  LEAVE_UNPAID:         'day-row-unpaid',
  NON_WORKING_DAY:      'day-row-off',
  NO_DATA:              'day-row-no-data',
};

export default function DailyDetailsTable({ days = [] }) {
  const { t } = useTranslation('companyReport');

  if (!days.length) return (
    <div className="report-empty">
      <i className="fa-solid fa-calendar-days" />
      <p>{t('empty.noData')}</p>
    </div>
  );

  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="report-table-wrap">
      <table className="report-table">
        <thead>
          <tr>
            <th>{t('table.date')}</th>
            <th>{t('table.day')}</th>
            <th>{t('table.status')}</th>
            <th>{t('table.checkIn')}</th>
            <th>{t('table.checkOut')}</th>
            <th>{t('table.late')}</th>
            <th>{t('table.earlyLeave')}</th>
            <th>{t('table.transit')}</th>
            <th>OT In</th>
            <th>OT Out</th>
            <th>{t('table.mode')}</th>
            <th>{t('table.notes')}</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(d => {
            const rowCls = ROW_CLASS[d.decisionType] || '';
            const statusLabel = t(`dayStatus.${d.decisionType}`, { defaultValue: d.dayStatus || d.decisionType });

            const notesStr = [
              ...(d.adminNotes || []),
              d.adminOverride ? `Override: ${d.adminOverride.decision}` : null,
              ...(d.transits || []).map(tr =>
                tr.deductionMinutes ? `${tr.fromBranchName || ''}→${tr.deductionMinutes}m` : null
              ),
            ].filter(Boolean).join(' | ') || '—';

            return (
              <tr key={d.date} className={rowCls}>
                <td style={{ fontWeight: 600 }}>{d.date}</td>
                <td style={{ color: '#6c757d' }}>{(d.weekday || '').slice(0, 3)}</td>
                <td>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 10,
                    background: 'rgba(0,0,0,0.06)'
                  }}>
                    {statusLabel}
                  </span>
                </td>
                <td>{d.hasCheckIn ? fmtTime(d.firstCheckInTime) : '—'}</td>
                <td>{d.hasCheckOut ? fmtTime(d.lastCheckOutTime) : '—'}</td>
                <td>
                  <span style={{ color: d.totalLateMinutes ? '#fd7e14' : 'inherit', fontWeight: d.totalLateMinutes ? 600 : 400 }}>
                    {fmtMin(d.totalLateMinutes)}
                  </span>
                </td>
                <td>{fmtMin(d.totalEarlyLeaveMinutes)}</td>
                <td>
                  <span style={{ color: d.totalTransitDeductionMinutes ? '#dc3545' : 'inherit' }}>
                    {fmtMin(d.totalTransitDeductionMinutes)}
                  </span>
                </td>
                <td style={{ color: d.earlyArrivalMinutes ? '#198754' : '#aaa' }}>
                  {fmtMin(d.earlyArrivalMinutes)}
                </td>
                <td style={{ color: d.lateDepartureMinutes ? '#6f42c1' : '#aaa' }}>
                  {fmtMin(d.lateDepartureMinutes)}
                </td>
                <td>
                  <span style={{
                    fontSize: '0.72rem',
                    background: d.workMode === 'REMOTE' ? '#e8f4fd' : '#f0f4ff',
                    color: d.workMode === 'REMOTE' ? '#0d6efd' : '#1F3864',
                    padding: '2px 6px', borderRadius: 8, fontWeight: 600
                  }}>
                    {d.workMode === 'REMOTE' ? 'Remote' : 'Onsite'}
                  </span>
                </td>
                <td className="text-start" style={{ color: '#6c757d', fontSize: '0.78rem', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {notesStr}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Legend */}
      <div className="d-flex flex-wrap gap-3 p-2 mt-2" style={{ fontSize: '0.75rem', color: '#6c757d' }}>
        {[
          ['day-row-working',    t('dayStatus.WORKING_DAY')],
          ['day-row-absent',     t('dayStatus.ABSENT_NO_PERMISSION')],
          ['day-row-paid-leave', t('dayStatus.LEAVE_PAID')],
          ['day-row-unpaid',     t('dayStatus.LEAVE_UNPAID')],
          ['day-row-off',        t('dayStatus.NON_WORKING_DAY')],
        ].map(([cls, lbl]) => (
          <div key={cls} className="d-flex align-items-center gap-1">
            <span className={cls} style={{ width: 14, height: 14, borderRadius: 3, display: 'inline-block', border: '1px solid #ddd' }} />
            {lbl}
          </div>
        ))}
      </div>
    </div>
  );
}