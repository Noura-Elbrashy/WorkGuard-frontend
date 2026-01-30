// src/helpers/attendance/groupAttendanceByUserAndDate.js

export const groupAttendanceByUserAndDate = (records = []) => {
  const map = new Map();

  records.forEach((att) => {
    if (!att) return;

    const userId = att.user?._id || 'deleted-user';

    const baseDate =
      att.checkInTime
        ? new Date(att.checkInTime)
        : att.createdAt
        ? new Date(att.createdAt)
        : null;

    if (!baseDate || isNaN(baseDate.getTime())) return;

    const dateKey = baseDate.toISOString().slice(0, 10);
    const key = `${userId}-${dateKey}`;

    if (!map.has(key)) {
      map.set(key, {
        key,
        user: att.user || null,
        date: baseDate,
        records: []
      });
    }

    map.get(key).records.push(att);
  });

  const groups = Array.from(map.values()).map((group) => {
    const sorted = group.records
      .slice()
      .sort(
        (a, b) =>
          new Date(a.checkInTime || a.createdAt) -
          new Date(b.checkInTime || b.createdAt)
      );

    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const dayName = group.date.toLocaleString('en-US', { weekday: 'long' });

    const allInvalid = sorted.every((r) => r.invalidated);

    const effectiveStatus = allInvalid
      ? 'invalidated'
      : last.dayStatus || first.dayStatus || 'working';

    const totalLateMinutes = sorted.reduce(
      (sum, r) => sum + (Number(r.lateMinutes) || 0),
      0
    );

    const lastValidCheckout = [...sorted]
      .reverse()
      .find((r) => r.checkOutTime && !r.invalidated);

    const totalEarlyLeaveMinutes = lastValidCheckout
      ? Number(lastValidCheckout.earlyLeaveMinutes || 0)
      : 0;

    // ===== Transit =====
    let totalTransitDeductionMinutes = 0;
    const transits = [];

    for (let i = 0; i < sorted.length; i++) {
      const rec = sorted[i];
      const gap = Number(rec.transitGapMinutes || 0);
      const deduction = Number(rec.transitDeductionMinutes || 0);

      if (gap > 0) {
        totalTransitDeductionMinutes += deduction;
const prevRec = sorted[i - 1];
const currRec = sorted[i];

transits.push({
  fromBranchName: prevRec.branch?.name || 'N/A', // خرج من هنا
  toBranchName: currRec.branch?.name || 'N/A',   // دخل هنا
  gapMinutes: gap,
  deductionMinutes: deduction,
  paid: Boolean(rec.transitPaid)
});

        // transits.push({
        //   fromBranchName: rec.branch?.name || 'N/A',
        //   toBranchName: sorted[i + 1]?.branch?.name || 'N/A',
        //   gapMinutes: gap,
        //   deductionMinutes: deduction,
        //   paid: Boolean(rec.transitPaid)
        // });
      }
    }

    return {
      key: group.key,
      user: group.user,
      date: group.date,
      dayName,
      records: sorted,

      // summary
      status: effectiveStatus,
      allInvalid,
      totalLateMinutes,
      totalEarlyLeaveMinutes,
      totalTransitDeductionMinutes,
      transits
    };
  });

  // أحدث يوم فوق
  groups.sort((a, b) => b.date - a.date);

  return groups;
};
