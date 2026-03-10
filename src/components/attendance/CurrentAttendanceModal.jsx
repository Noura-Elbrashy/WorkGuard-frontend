import React, { useEffect, useState } from 'react';
import { apiGet } from '../../helpers/api';

const CurrentAttendanceModal = ({ show, branch, onClose }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show || !branch) return;

    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const res = await apiGet(
          `/attendance/branches/${branch._id}/current-attendance`
        );
        setRecords(res.data.data || []);
      } catch (err) {
        console.error('Failed to load attendance', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [show, branch]);

  if (!show) return null;

  return (
    <div className="attendance-modal-overlay">
      <div className="attendance-modal">
        {/* Header */}
        <div className="attendance-modal-header">
          <h5>
            Employees Currently Checked In – {branch?.name}
          </h5>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Body */}
        <div className="attendance-modal-body">
          {loading ? (
            <p>Loading...</p>
          ) : records.length === 0 ? (
            <p className="text-muted">No active attendance</p>
          ) : (
            <table className="table-modern table-compact table-modal">

              <thead>
                <tr>
                  <th>User</th>
                  <th>Departments</th>
                  <th>Check-in Time</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id}>
                    <td>{r.user?.name}</td>
                    {/* <td>{r.user?.jobTitle || '-'}</td> */}
<td>
  {r.user?.departments?.length
    ? r.user.departments.map(d => d.name).join(', ')
    : '—'}
</td>


                    {/* <td>

                     
  <div className="d-flex flex-wrap gap-1">
    {user.departments?.length
      ? user.departments.map(d => (
          <span key={d._id || d} className="branch-badge">
            {d.name || d}
          </span>
        ))
      : <span className="text-muted">—</span>}
  </div>
</td> */}
                    <td>
                      {new Date(r.checkInTime).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="attendance-modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrentAttendanceModal;
