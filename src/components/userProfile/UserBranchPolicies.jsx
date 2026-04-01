

//no need 

import { useEffect, useState } from 'react';
import { getUserBranchPolicies } from '../../services/attendancePolicy.api';

const UserBranchPolicies = ({ userId }) => {
  const [data, setData] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    getUserBranchPolicies(userId)
      .then(res => setData(res))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return <div className="text-muted">Loading branch policies...</div>;
  }

  if (!data?.branches?.length) {
    return (
      <div className="alert alert-light small">
        No branch-specific attendance policies.
      </div>
    );
  }

  return (
    <div className="card border-secondary mb-4">
      <div className="card-body">
        <h5 className="mb-3">
          <i className="fas fa-code-branch me-2" />
          Branch Attendance Policies
        </h5>

        {data.branches.map(b => (
          <div key={b.branchId} className="mb-2">
            <button
              className="btn btn-outline-secondary btn-sm w-100 text-start"
              onClick={() =>
                setExpanded(e => ({
                  ...e,
                  [b.branchId]: !e[b.branchId]
                }))
              }
            >
              🏢 {b.branchName}
            </button>

            {expanded[b.branchId] && (
              <div className="border rounded p-3 mt-2 bg-light small">
                <div><strong>Grace (Late):</strong> {b.policy.grace.lateMinutes} min</div>
                <div><strong>Grace (Early):</strong> {b.policy.grace.earlyLeaveMinutes} min</div>
                <div><strong>Late Rate:</strong> {b.policy.rates.latePerMinute}</div>
                <div><strong>Early Rate:</strong> {b.policy.rates.earlyLeavePerMinute}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserBranchPolicies;
