function LeaveSummary({
  summary,
  unpaidAbsenceDays,
  unpaidLeaveDays
}) {
  return (
    <>
      {summary && <LeaveBalanceSummary summary={summary} />}

      <div className="row g-3 mt-2">
        <div className="col-md-6">
          <div className="card border-warning h-100">
            <div className="card-body">
              <h6 className="text-warning">Unpaid Leave</h6>
              <div className="fs-4 fw-bold">{unpaidLeaveDays}</div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-danger h-100">
            <div className="card-body">
              <h6 className="text-danger">Absence (No Permission)</h6>
              <div className="fs-4 fw-bold">{unpaidAbsenceDays}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LeaveSummary;
