import React from "react";

const TaskFilters = ({
  search,
  setSearch,
  priority,
  setPriority,
  status,
  setStatus,
  sortBy,
  setSortBy,
  selectedTasks,
  onBulkDelete,
  onAddTask,
}) => {
  return (
    <div
      className="card border-0 shadow-sm mb-4"
      style={{
        borderRadius: "20px",
      }}
    >
      <div className="card-body p-4">
        {/* TOP HEADER */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div>
            <h3 className="fw-bold mb-1">Task Management</h3>

            <p className="text-muted mb-0">
              Manage, filter and organize your tasks efficiently
            </p>
          </div>

          <button
            className="btn btn-primary px-4 fw-semibold"
            style={{
              borderRadius: "12px",
            }}
            onClick={onAddTask}
          >
            + Add Task
          </button>
        </div>

        {/* FILTER CONTROLS */}
        <div className="row g-3">
          {/* SEARCH */}
          <div className="col-lg-4 col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                borderRadius: "12px",
                padding: "12px",
              }}
            />
          </div>

          {/* PRIORITY */}
          <div className="col-lg-2 col-md-6">
            <select
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{
                borderRadius: "12px",
                padding: "12px",
              }}
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* STATUS */}
          <div className="col-lg-2 col-md-6">
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                borderRadius: "12px",
                padding: "12px",
              }}
            >
              <option value="">All Status</option>
              <option value="todo">Todo</option>
              <option value="inprogress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* SORT */}
          <div className="col-lg-2 col-md-6">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                borderRadius: "12px",
                padding: "12px",
              }}
            >
              <option value="createdAt">Newest</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="title">Title</option>
            </select>
          </div>

          {/* BULK DELETE */}
          <div className="col-lg-2 col-md-12">
            <button
              className="btn btn-outline-danger w-100 fw-semibold"
              style={{
                borderRadius: "12px",
                padding: "12px",
              }}
              onClick={onBulkDelete}
              disabled={!selectedTasks.length}
            >
              Delete Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
