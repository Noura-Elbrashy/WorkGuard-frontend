import { useEffect, useState } from 'react';
import {
  getMonthlyAbsence,
  getYearlyAbsence
} from '../../../services/attendance.api';

export default function useAbsenceSnapshot({
  userId,
  year,
  month,
  enabled = true
}) {
  const [monthly, setMonthly] = useState(null);
  const [yearly, setYearly] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled || !userId || !year) return;

    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const [mRes, yRes] = await Promise.all([
          month
            ? getMonthlyAbsence({ userId, year, month })
            : Promise.resolve(null),
          getYearlyAbsence({ userId, year })
        ]);

        if (!mounted) return;

        setMonthly(mRes?.data || null);
        setYearly(yRes?.data || null);

      } catch (err) {
        if (!mounted) return;
        setError(
          err?.response?.data?.message ||
          'Failed to load absence'
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };

  }, [userId, year, month, enabled]);

  return { monthly, yearly, loading, error };
}
