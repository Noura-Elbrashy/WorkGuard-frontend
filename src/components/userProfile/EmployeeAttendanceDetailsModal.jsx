// import { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import { apiPut } from '../../helpers/api';

// const toInputDateTimeLocal = (value) => {
//   if (!value) return '';
//   const d = new Date(value);
//   const pad = (n) => n.toString().padStart(2, '0');
//   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
// };

// const formatTime = (value) => {
//   if (!value) return '—';
//   return new Date(value).toLocaleTimeString('en-US', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true
//   });
// };

// const EmployeeAttendanceDetailsModal = ({
//   show,
//   loading,
//   records = [],
//   user,
//   date,
//   isAdmin = false,
//   onClose,
//   onSaved
// }) => {
//   const { t } = useTranslation();
//   const [editingId, setEditingId] = useState(null);
//   const [form, setForm] = useState({});
//   const [saving, setSaving] = useState(false);
//   const [localRecords, setLocalRecords] = useState([]);

//   useEffect(() => {
//     setLocalRecords(records || []);
//   }, [records]);

//   if (!show) return null;

//   const startEdit = (rec) => {
//     setEditingId(rec._id);
//     setForm({
//       checkInTime: toInputDateTimeLocal(rec.checkInTime),
//       checkOutTime: toInputDateTimeLocal(rec.checkOutTime),
//       invalidated: !!rec.invalidated,
//       notes: rec.notes || ''
//     });
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setForm({});
//   };

//   const saveEdit = async (id) => {
//     try {
//       setSaving(true);
//       await apiPut(`/admin/attendance/${id}`, {
//         checkInTime: form.checkInTime ? new Date(form.checkInTime).toISOString() : null,
//         checkOutTime: form.checkOutTime ? new Date(form.checkOutTime).toISOString() : null,
//         invalidated: form.invalidated,
//         notes: form.notes.trim()
//       });
//       setEditingId(null);
//       onSaved?.();
//     } catch (e) {
//       alert(t('error'));
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="modal fade show d-block" style={{ background: '#00000066' }}>
//       <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
//         <div className="modal-content">

//           {/* Header */}
//           <div className="modal-header bg-primary text-white">
//             <h5 className="modal-title">
//               {user?.name} – {new Date(date).toLocaleDateString()}
//             </h5>
//             <button className="btn-close btn-close-white" onClick={onClose} />
//           </div>

//           {/* Body */}
//           <div className="modal-body">
//             {loading ? (
//               <div className="text-center py-5">
//                 <div className="spinner-border text-primary" />
//               </div>
//             ) : localRecords.length === 0 ? (
//               <div className="text-center text-muted py-4">
//                 {t('noAttendanceForDay')}
//               </div>
//             ) : (
//               <div className="table-responsive">
//                 <table className="table table-bordered align-middle">
//                   <thead className="table-light">
//                     <tr>
//                       <th>{t('branch')}</th>
//                       <th>{t('checkIn')}</th>
//                       <th>{t('checkOut')}</th>
//                       <th>{t('late')}</th>
//                       <th>{t('earlyLeave')}</th>
//                       <th>{t('notes')}</th>
//                       {isAdmin && <th className="text-center">{t('actions')}</th>}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {localRecords.map((rec) => {
//                       const isEditing = editingId === rec._id;
//                       return (
//                         <tr key={rec._id} className={rec.invalidated ? 'table-danger' : ''}>
//                           <td>{rec.branch?.name || '—'}</td>

//                           <td>
//                             {isEditing ? (
//                               <input
//                                 type="datetime-local"
//                                 className="form-control form-control-sm"
//                                 value={form.checkInTime}
//                                 onChange={(e) => setForm({ ...form, checkInTime: e.target.value })}
//                               />
//                             ) : formatTime(rec.checkInTime)}
//                           </td>

//                           <td>
//                             {isEditing ? (
//                               <input
//                                 type="datetime-local"
//                                 className="form-control form-control-sm"
//                                 value={form.checkOutTime}
//                                 onChange={(e) => setForm({ ...form, checkOutTime: e.target.value })}
//                               />
//                             ) : formatTime(rec.checkOutTime)}
//                           </td>

//                           <td className="text-warning">
//                             {rec.lateMinutes ? `${rec.lateMinutes} ${t('minutes')}` : '—'}
//                           </td>

//                           <td className="text-danger">
//                             {rec.earlyLeaveMinutes ? `${rec.earlyLeaveMinutes} ${t('minutes')}` : '—'}
//                           </td>

//                           <td>
//                             {isEditing ? (
//                               <>
//                                 <textarea
//                                   className="form-control form-control-sm mb-2"
//                                   rows="2"
//                                   value={form.notes}
//                                   onChange={(e) => setForm({ ...form, notes: e.target.value })}
//                                 />
//                                 <div className="form-check">
//                                   <input
//                                     className="form-check-input"
//                                     type="checkbox"
//                                     checked={form.invalidated}
//                                     onChange={(e) => setForm({ ...form, invalidated: e.target.checked })}
//                                   />
//                                   <label className="form-check-label">
//                                     {t('invalidateRecord')}
//                                   </label>
//                                 </div>
//                               </>
//                             ) : (
//                               <span className="text-muted">{rec.notes || '—'}</span>
//                             )}
//                           </td>

//                           {isAdmin && (
//                             <td className="text-center">
//                               {isEditing ? (
//                                 <>
//                                   <button
//                                     className="btn btn-sm btn-success me-2"
//                                     disabled={saving}
//                                     onClick={() => saveEdit(rec._id)}
//                                   >
//                                     {t('save')}
//                                   </button>
//                                   <button className="btn btn-sm btn-secondary" onClick={cancelEdit}>
//                                     {t('cancel')}
//                                   </button>
//                                 </>
//                               ) : (
//                                 <button
//                                   className="btn btn-sm btn-outline-primary"
//                                   onClick={() => startEdit(rec)}
//                                 >
//                                   {t('edit')}
//                                 </button>
//                               )}
//                             </td>
//                           )}
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="modal-footer">
//             <button className="btn btn-secondary" onClick={onClose}>
//               {t('close')}
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeAttendanceDetailsModal;

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiGet, apiPut, apiPost } from '../../helpers/api';

const toInputDateTimeLocal = (value) => {
  if (!value) return '';
  const d = new Date(value);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatTime = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const EmployeeAttendanceDetailsModal = ({
  show,
  loading,
  records = [],
   transits = [],
  user,
  date,
  isAdmin = false,
  onClose,
  onSaved
}) => {
  const { t } = useTranslation();

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
const [showCreate, setShowCreate] = useState(false);
const [createForm, setCreateForm] = useState({
  branchId: '',
  checkInTime: '',
  checkOutTime: '',
  invalidated: false,
  notes: ''
});
const [availableBranches, setAvailableBranches] = useState([]);
const [loadingBranches, setLoadingBranches] = useState(false);




useEffect(() => {
  if (!show || !isAdmin || !user?._id) return;

  const loadBranches = async () => {
    try {
      setLoadingBranches(true);
      const res = await apiGet(`/branches/user/${user._id}`);
      setAvailableBranches(res.data?.data || []);
    } catch (e) {
      setAvailableBranches([]);
    } finally {
      setLoadingBranches(false);
    }
  };

  loadBranches();
}, [show, isAdmin, user?._id]);

useEffect(() => {
  if (availableBranches.length === 1) {
    setCreateForm(f => ({
      ...f,
      branchId: availableBranches[0]._id
    }));
  }
}, [availableBranches]);

  useEffect(() => {
    setEditingId(null);
    setForm({});
  }, [records]);

  if (!show) return null;

  const startEdit = (rec) => {
    setEditingId(rec._id);
    setForm({
      checkInTime: toInputDateTimeLocal(rec.checkInTime),
      checkOutTime: toInputDateTimeLocal(rec.checkOutTime),
      invalidated: !!rec.invalidated,
      notes: rec.notes || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({});
  };

  const saveEdit = async (id) => {
    try {
      setSaving(true);

      await apiPut(`/admin/attendance/${id}`, {
        checkInTime: form.checkInTime
          ? new Date(form.checkInTime).toISOString()
          : null,
        checkOutTime: form.checkOutTime
          ? new Date(form.checkOutTime).toISOString()
          : null,
        invalidated: form.invalidated,
        notes: String(form.notes || '').trim()

      });

      setEditingId(null);
      onSaved?.();
    } catch (err) {
      console.error(err);
      alert(t('error'));
    } finally {
      setSaving(false);
    }
  };
const handleCreateAttendance = async () => {
  if (!createForm.branchId) return;

  try {
    await apiPost('/admin/attendance/manual', {
      userId: user._id,
      branchId: createForm.branchId,
      date: new Date(date).toISOString().slice(0, 10),
      checkInTime: createForm.checkInTime
        ? new Date(createForm.checkInTime).toISOString()
        : null,
      checkOutTime: createForm.checkOutTime
        ? new Date(createForm.checkOutTime).toISOString()
        : null,
invalidated: createForm.invalidated,
      notes: createForm.notes
    });

    setShowCreate(false);
    setCreateForm({
     branchId:
        availableBranches.length === 1
          ? availableBranches[0]._id
          : '',
      checkInTime: '',
      checkOutTime: '',
      invalidated: false,
      notes: ''
    });

    onSaved?.();

  } catch (err) {
    console.error(err);
    alert(t('errorSaving'));
  }
};



  return (
    <div className="modal fade show d-block" style={{ background: '#00000066' }}>
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">

          {/* Header */}
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title">
              {user?.name} — {new Date(date).toLocaleDateString()}
            </h5>
            <button className="btn-close btn-close-white" onClick={onClose} />
          </div>

          {/* Body */}
          <div className="modal-body">
                  {isAdmin && showCreate && (
  <div className="card border-success mb-4 shadow-sm">
    <div className="card-header bg-success text-white fw-bold">
      <i className="fas fa-plus-circle me-2" />
      {t('addManualAttendance')}
    </div>

    <div className="card-body">
      <div className="row g-3">

        {/* Branch */}
        <div className="col-md-4">
          <label className="form-label">{t('branch')}</label>
          <select
            className="form-select"
            value={createForm.branchId}
            onChange={(e) =>
              setCreateForm({ ...createForm, branchId: e.target.value })
            }
            disabled={loadingBranches}
          >
            <option value="">
              {loadingBranches ? t('loading') : t('selectBranch')}
            </option>
            {availableBranches.map(b => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Check-in */}
        <div className="col-md-4">
          <label className="form-label">{t('checkIn')}</label>
          <input
            type="datetime-local"
            className="form-control"
            value={createForm.checkInTime}
            onChange={(e) =>
              setCreateForm({ ...createForm, checkInTime: e.target.value })
            }
          />
        </div>

        {/* Check-out */}
        <div className="col-md-4">
          <label className="form-label">{t('checkOut')}</label>
          <input
            type="datetime-local"
            className="form-control"
            value={createForm.checkOutTime}
            onChange={(e) =>
              setCreateForm({ ...createForm, checkOutTime: e.target.value })
            }
          />
        </div>
{/* Invalidated */}
<div className="col-md-12">
  <div className="form-check mt-2">
    <input
      className="form-check-input"
      type="checkbox"
      id="create-invalidated"
      checked={createForm.invalidated}
      onChange={(e) =>
        setCreateForm({
          ...createForm,
          invalidated: e.target.checked
        })
      }
    />
    <label
      className="form-check-label"
      htmlFor="create-invalidated"
    >
      <i className="fas fa-ban me-1 text-danger" />
      {t('invalidateRecord')}
    </label>
  </div>
</div>

        {/* Notes */}
        <div className="col-md-12">
          <label className="form-label">{t('notes')}</label>
          <textarea
            className="form-control"
            rows="2"
            value={createForm.notes}
            onChange={(e) =>
              setCreateForm({ ...createForm, notes: e.target.value })
            }
          />
        </div>
      </div>

      <div className="mt-4 d-flex gap-2">
        <button
          className="btn btn-success"
          onClick={handleCreateAttendance}
          disabled={!createForm.branchId}
        >
          <i className="fas fa-check me-2" />
          {t('save')}
        </button>

        <button
          className="btn btn-outline-secondary"
          onClick={() => setShowCreate(false)}
        >
          {t('cancel')}
        </button>
      </div>
    </div>
  </div>
)}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" />
              </div>
            ) : records.length === 0 && !showCreate ? (
              <div className="text-center text-muted py-4">
                {t('noAttendanceForDay')}
              </div>
            ) : (

              
              <div className="table-responsive">
         

                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>{t('branch')}</th>
                      <th>{t('checkIn')}</th>
                      <th>{t('checkOut')}</th>
                      <th>{t('late')}</th>
                      <th>{t('earlyLeave')}</th>
                      <th>{t('notes')}</th>
                      {isAdmin && <th className="text-center">{t('actions')}</th>}
                    </tr>
                  </thead>

                  <tbody>
                    {records.map((rec) => {
                      const isEditing = editingId === rec._id;

                      return (
                        <tr
                          key={rec._id}
                          className={rec.invalidated ? 'table-danger' : ''}
                        >
                          <td>{rec.branch?.name || '—'}</td>

                          <td>
                            {isEditing ? (
                              <input
                                type="datetime-local"
                                className="form-control form-control-sm"
                                value={form.checkInTime}
                                onChange={(e) =>
                                  setForm({ ...form, checkInTime: e.target.value })
                                }
                              />
                            ) : (
                              formatTime(rec.checkInTime)
                            )}
                          </td>

                          <td>
                            {isEditing ? (
                              <input
                                type="datetime-local"
                                className="form-control form-control-sm"
                                value={form.checkOutTime}
                                onChange={(e) =>
                                  setForm({ ...form, checkOutTime: e.target.value })
                                }
                              />
                            ) : (
                              formatTime(rec.checkOutTime)
                            )}
                          </td>

                          <td className="text-warning">
                            {rec.lateMinutes
                              ? `${rec.lateMinutes} ${t('minutes')}`
                              : '—'}
                          </td>

                          <td className="text-danger">
                            {rec.earlyLeaveMinutes
                              ? `${rec.earlyLeaveMinutes} ${t('minutes')}`
                              : '—'}
                          </td>

                          <td>
                            {isEditing ? (
                              <>
                                <textarea
                                  className="form-control form-control-sm mb-2"
                                  rows="2"
                                  value={form.notes}
                                  onChange={(e) =>
                                    setForm({ ...form, notes: e.target.value })
                                  }
                                />
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={form.invalidated}
                                    onChange={(e) =>
                                      setForm({
                                        ...form,
                                        invalidated: e.target.checked
                                      })
                                    }
                                  />
                                  <label className="form-check-label">
                                    {t('invalidateRecord')}
                                  </label>
                                </div>
                              </>
                            ) : (
                              <span className="text-muted">
                                {rec.notes || '—'}
                              </span>
                            )}
                          </td>

                          {isAdmin && (
                            <td className="text-center">
                              {isEditing ? (
                                <>
                                  <button
                                    className="btn btn-sm btn-success me-2"
                                    disabled={saving}
                                    onClick={() => saveEdit(rec._id)}
                                  >
                                    {t('save')}
                                  </button>
                                  <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={cancelEdit}
                                  >
                                    {t('cancel')}
                                  </button>
                                </>
                              ) : (
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => startEdit(rec)}
                                >
                                  {t('edit')}
                                </button>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {isAdmin && transits.length > 0 && (
  <div className="mt-4">
    <h6 className="fw-semibold text-muted mb-2">
      Transit Details
    </h6>

    <div className="table-responsive">
      <table className="table table-sm table-bordered">
        <thead className="table-light">
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Gap (min)</th>
            <th>Deduction (min)</th>
          </tr>
        </thead>
        <tbody>
          {transits.map((t, i) => (
            <tr key={i}>
              <td>{t.fromBranchName}</td>
              <td>{t.toBranchName}</td>
              <td>{t.gapMinutes}</td>
              <td className="text-danger fw-semibold">
                {t.deductionMinutes}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

              </div>
            )}
            
          </div>

          {/* Footer */}
         <div className="modal-footer attendance-modal-footer d-flex justify-content-between">
  
{isAdmin && (
  <button
    type="button"
    className="btn btn-lg btn-success rounded-pill px-4 shadow-sm"
    onClick={() => setShowCreate(true)}
  >
    <i className="fas fa-plus-circle me-2" />
    {t('addAttendance')}
  </button>
)}


  <button
    type="button"
    className="btn btn-lg btn-danger rounded-pill px-5 shadow-sm"
    onClick={onClose}
  >
    <i className="fas fa-times-circle me-2" />
    {t('close')}
  </button>

</div>


        </div>
      </div>
    </div>
    
  );
};

export default EmployeeAttendanceDetailsModal;
