import React from "react";
import { useNavigate } from "react-router-dom";

const priorityBadge = {
  low: "success",
  medium: "warning",
  high: "danger",
};

const TaskEventModal = ({ task, onClose }) => {
  const navigate = useNavigate();

  if (!task) return null;

  const completedSubtasks =
    task.subtasks?.filter((subtask) => subtask.completed).length || 0;

  const totalSubtasks = task.subtasks?.length || 0;

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "completed";

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{
        background: "rgba(0,0,0,0.5)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content border-0 shadow"
          style={{
            borderRadius: "20px",
          }}
        >
          <div className="modal-header border-0">
            <h5 className="fw-bold mb-0">Task Details</h5>

            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h4 className="fw-bold">{task.title}</h4>

              <span className={`badge bg-${priorityBadge[task.priority]}`}>
                {task.priority}
              </span>
            </div>

            <p className="text-muted">{task.description || "No description"}</p>

            <div className="mb-3">
              <strong>Status:</strong>{" "}
              <span className="text-capitalize">{task.status}</span>
            </div>

            <div className="mb-3">
              <strong>Due Date:</strong>{" "}
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "No due date"}
            </div>

            {isOverdue && (
              <div className="alert alert-danger py-2">
                ⚠ This task is overdue
              </div>
            )}

            {totalSubtasks > 0 && (
              <div>
                <strong>Checklist:</strong>

                <div className="mt-2">
                  {task.subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      className="d-flex align-items-center gap-2 mb-2"
                    >
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        readOnly
                      />

                      <span
                        style={{
                          textDecoration: subtask.completed
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="small text-muted mt-2">
                  {completedSubtasks}/{totalSubtasks} completed
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer border-0">
            <button className="btn btn-outline-secondary" onClick={onClose}>
              Close
            </button>

            <button
              className="btn btn-primary"
              onClick={() => navigate(`/edit-task/${task._id}`)}
            >
              Edit Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskEventModal;
