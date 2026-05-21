import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";

const priorityBadge = {
  low: "success",
  medium: "warning",
  high: "danger",
};

const KanbanTaskCard = ({ task, index }) => {
  const navigate = useNavigate();

  const completedSubtasks =
    task.subtasks?.filter((subtask) => subtask.completed).length || 0;

  const totalSubtasks = task.subtasks?.length || 0;

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "completed";

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`card border-0 shadow-sm mb-3 ${
            snapshot.isDragging ? "shadow-lg" : ""
          }`}
          style={{
            borderRadius: "18px",
            cursor: "grab",
            transition: "0.2s",
            ...provided.draggableProps.style,
          }}
        >
          <div
            className="card-body"
            onDoubleClick={() => navigate(`/edit-task/${task._id}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h6 className="fw-bold mb-0">{task.title}</h6>

              <span className={`badge bg-${priorityBadge[task.priority]}`}>
                {task.priority}
              </span>
            </div>

            {task.description && (
              <p
                className="text-muted small mb-3"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {task.description}
              </p>
            )}

            {totalSubtasks > 0 && (
              <div className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>Checklist</span>
                  <span>
                    {completedSubtasks}/{totalSubtasks}
                  </span>
                </div>

                <div className="progress" style={{ height: "8px" }}>
                  <div
                    className="progress-bar bg-primary"
                    style={{
                      width: `${(completedSubtasks / totalSubtasks) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center small">
              <span
                className={isOverdue ? "text-danger fw-semibold" : "text-muted"}
              >
                {task.dueDate
                  ? `${isOverdue ? "⚠ Overdue" : "📅 Due"} ${new Date(
                      task.dueDate,
                    ).toLocaleDateString()}`
                  : "No due date"}
              </span>

              <button
                className="btn btn-sm btn-outline-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/edit-task/${task._id}`);
                }}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanTaskCard;
