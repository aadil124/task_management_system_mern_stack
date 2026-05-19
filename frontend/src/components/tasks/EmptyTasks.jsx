import React from "react";

const EmptyTasks = ({ onAddTask }) => {
  return (
    <div
      className="card border-0 shadow-sm text-center"
      style={{
        borderRadius: "24px",
      }}
    >
      <div className="card-body py-5 px-4">
        <div
          style={{
            fontSize: "5rem",
            marginBottom: "1rem",
          }}
        >
          📋
        </div>

        <h3 className="fw-bold mb-3">No Tasks Found</h3>

        <p
          className="text-muted mx-auto mb-4"
          style={{
            maxWidth: "500px",
            fontSize: "1rem",
          }}
        >
          You don’t have any tasks matching your current filters. Start by
          creating your first task and stay productive.
        </p>

        <button
          className="btn btn-primary btn-lg px-4 fw-semibold"
          style={{
            borderRadius: "14px",
          }}
          onClick={onAddTask}
        >
          + Create First Task
        </button>
      </div>
    </div>
  );
};

export default EmptyTasks;
