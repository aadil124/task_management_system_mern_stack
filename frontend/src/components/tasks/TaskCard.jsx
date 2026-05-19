import React from "react";

const priorityConfig = {
  low: {
    label: "Low",
    badge: "bg-success-subtle text-success",
  },
  medium: {
    label: "Medium",
    badge: "bg-warning-subtle text-warning",
  },
  high: {
    label: "High",
    badge: "bg-danger-subtle text-danger",
  },
};

const statusConfig = {
  todo: {
    label: "Todo",
    badge: "bg-secondary-subtle text-secondary",
  },
  inprogress: {
    label: "In Progress",
    badge: "bg-info-subtle text-info",
  },
  completed: {
    label: "Completed",
    badge: "bg-success-subtle text-success",
  },
};

const formatDate = (date) => {
  if (!date) return "No deadline";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const isOverdue = (task) => {
  if (!task.dueDate || task.status === "completed") {
    return false;
  }

  return new Date(task.dueDate) < new Date();
};

const TaskCard = ({ task, selectedTasks, onSelectTask, onEdit, onDelete }) => {
  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  const status = statusConfig[task.status] || statusConfig.todo;

  const overdue = isOverdue(task);

  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter(
    (subtask) => subtask.completed,
  ).length;

  const progressPercent =
    subtasks.length > 0
      ? Math.round((completedSubtasks / subtasks.length) * 100)
      : 0;

  return (
    <div className="col-12 mb-4">
      <div
        className="card border-0 shadow-sm h-100"
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          transition: "all 0.25s ease",
        }}
      >
        {/* PRIORITY TOP BAR */}
        <div
          style={{
            height: "6px",
            background:
              task.priority === "high"
                ? "#dc3545"
                : task.priority === "medium"
                  ? "#ffc107"
                  : "#198754",
          }}
        />

        <div className="card-body p-4">
          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="d-flex align-items-start gap-3 w-100">
              <input
                type="checkbox"
                className="form-check-input mt-1"
                checked={selectedTasks.includes(task._id)}
                onChange={() => onSelectTask(task._id)}
              />

              <div className="w-100">
                <h5 className="fw-bold mb-1">{task.title}</h5>

                <p className="text-muted mb-0">
                  {task.description || "No description provided"}
                </p>
              </div>
            </div>
          </div>

          {/* BADGES */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            <span
              className={`badge px-3 py-2 rounded-pill fw-semibold ${priority.badge}`}
            >
              {priority.label}
            </span>

            <span
              className={`badge px-3 py-2 rounded-pill fw-semibold ${status.badge}`}
            >
              {status.label}
            </span>

            {overdue && (
              <span className="badge px-3 py-2 rounded-pill bg-danger text-white fw-semibold">
                Overdue
              </span>
            )}
          </div>

          {/* SUBTASK PROGRESS */}
          {subtasks.length > 0 && (
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="fw-semibold text-muted">
                  Checklist Progress
                </small>

                <small className="fw-bold text-primary">
                  {completedSubtasks}/{subtasks.length}
                </small>
              </div>

              <div
                className="progress"
                style={{
                  height: "10px",
                  borderRadius: "10px",
                }}
              >
                <div
                  className="progress-bar bg-primary"
                  style={{
                    width: `${progressPercent}%`,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <small className="text-muted fw-semibold">
              📅 Due: {formatDate(task.dueDate)}
            </small>

            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-primary btn-sm px-3"
                onClick={() => onEdit(task._id)}
              >
                Edit
              </button>

              <button
                className="btn btn-outline-danger btn-sm px-3"
                onClick={() => onDelete(task._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
