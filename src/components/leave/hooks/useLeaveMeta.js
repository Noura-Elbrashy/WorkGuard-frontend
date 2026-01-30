import { useEffect, useState } from 'react';
import {
  getUserLeaveSummary,
  getUserLeaveYear
} from '../../../services/Leave-services/leave.api';

export default function useLeaveMeta({ userId, year }) {
  const [summary, setSummary] = useState(null);
  const [leaveYear, setLeaveYear] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !year) {
      setSummary(null);
      setLeaveYear(null);
      return;
    }

    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const [sRes, yRes] = await Promise.all([
          getUserLeaveSummary({ userId, year }),
          getUserLeaveYear({ userId, year })
        ]);

        if (!mounted) return;

        setSummary(sRes.data || null);
        setLeaveYear(yRes.data?.exists ? yRes.data : null);

      } catch (err) {
        if (!mounted) return;
        setError(
          err?.response?.data?.message ||
          'Failed to load leave data'
        );
        setSummary(null);
        setLeaveYear(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };

  }, [userId, year]);

  return { summary, leaveYear, loading, error };
}
