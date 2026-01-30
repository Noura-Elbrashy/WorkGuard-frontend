import { useEffect, useState } from 'react';
import { getHolidayPlans } from '../../services/holiday.api';

export const useHolidayPlans = (filters) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getHolidayPlans(filters)
      .then(res => {
        setData(res.plans);
        setPagination(res.pagination);
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);

  return { data, pagination, loading, error };
};
