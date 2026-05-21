import React from "react";

const KanbanToolbar = ({
  search,
  setSearch,
  priority,
  setPriority,
  onRefresh,
  onAddTask,
}) => {
  return (
    <div
      className="card border-0 shadow-sm mb-4"
      style={{ borderRadius: "20px" }}
    >
      <div className="card-body">
        <div className="row g-3 align-items-center">
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderRadius: "14px" }}
            />
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{ borderRadius: "14px" }}
            >
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="col-md-4 d-flex gap-2 justify-content-md-end">
            <button className="btn btn-outline-primary" onClick={onRefresh}>
              🔄 Refresh
            </button>

            <button className="btn btn-primary" onClick={onAddTask}>
              ➕ Add Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanToolbar;
