import React from "react";

const CalendarFilters = ({
  search,
  setSearch,
  priority,
  setPriority,
  status,
  setStatus,
}) => {
  return (
    <div
      className="card border-0 shadow-sm mb-4"
      style={{
        borderRadius: "20px",
      }}
    >
      <div className="card-body">
        <div className="row g-3">
          {/* SEARCH */}
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                borderRadius: "14px",
              }}
            />
          </div>

          {/* PRIORITY */}
          <div className="col-md-4">
            <select
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{
                borderRadius: "14px",
              }}
            >
              <option value="">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          {/* STATUS */}
          <div className="col-md-4">
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                borderRadius: "14px",
              }}
            >
              <option value="">All Status</option>
              <option value="todo">Todo</option>
              <option value="inprogress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarFilters;
